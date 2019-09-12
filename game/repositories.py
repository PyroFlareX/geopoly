from sqlalchemy import text, or_, func, and_from sqlalchemy.dialects import postgresqlfrom game.entities import User, Area, World, Country, MatchHistory, MatchResultfrom engine.modules.auth.repository import AbstractUserRepositoryfrom engine.modules.worlds.repository import AbstractWorldInstanceRepositoryfrom engine.repository import Repository, Entity@Entity(User)class UserRepository(AbstractUserRepository):    def save(self, **kwargs):        print(1)        return super().save(**kwargs)    def set_world(self, uid, wid, iso):        self.session.query(User)\            .filter(User.uid == uid)\            .update({User.wid: wid, User.iso: iso})        self.session.commit()    def list_all(self, wid):        return self.session.query(self.T)\            .filter(self.T.wid == wid)\        .all()    def list(self, uids):        return self.session.query(self.T)\            .filter(User.uid.in_(uids))\        .all()    def list_some(self, N):        return self.session.query(self.T)\            .limit(N)\        .all()    def delete_all(self, wid):        self.session.query(self.T)\            .filter(self.T.wid == wid)\        .delete()@Entity(World)class WorldRepository(Repository):    def get_first(self):        return self.session.query(World).first()    def list_finished(self):        return self.session.query(World)\            .filter(World.turns == -1)\        .all()@Entity(Country)class CountryRepository(AbstractWorldInstanceRepository):    def list_all(self, wid=None, still_playing=False):        qs = self.session.query(Country)\            .filter(Country.wid == wid)        if still_playing:            qs = qs.filter(Country.shields > 0)        return qs.order_by(Country.order)\        .all()    def calculate_shields(self, wid, commit=True):        """        Sets the shields of the countries according to recent conquer changes in the round        """        SQL = """        WITH conquers AS (SELECT iso,iso2,count(*) AS num FROM areas          WHERE tile = 'city' AND iso != iso2 AND wid = :wid          GROUP BY iso, iso2),        shields AS (SELECT c.iso,             SUM(CASE WHEN c.iso = s.iso2 THEN num ELSE 0 END) shield_lost,            SUM(CASE WHEN c.iso = s.iso THEN num ELSE 0 END) shield_gain          FROM countries c, conquers s          WHERE (c.iso = s.iso OR c.iso = s.iso2) AND wid = :wid          GROUP BY c.iso        )                UPDATE countries SET shields = GREATEST(0, shields - s.shield_lost + s.shield_gain)        FROM shields s        WHERE countries.iso = s.iso AND countries.wid = :wid        RETURNING countries.iso as iso, s.shield_lost, s.shield_gain;        """        result = self.session.execute(text(SQL), {'wid': wid}).fetchall()        if commit:            self.session.commit()        return {row['iso']: (row['shield_lost'], row['shield_gain']) for row in result}    def calculate_payday(self, wid, commit=True):        SQL = """        WITH yields AS (SELECT iso, sum(CASE WHEN build = 'cita' THEN 30 ELSE 10 END) as tax          FROM areas          WHERE tile = 'city' AND iso IS NOT NULL AND build IS NOT NULL AND wid = :wid          GROUP BY iso)                UPDATE countries SET gold = gold + tax        FROM yields        WHERE yields.iso = countries.iso AND countries.wid = :wid        RETURNING countries.iso as iso, tax;        """        result = self.session.execute(text(SQL), {'wid': wid}).fetchall()        if commit:            self.session.commit()        return {row['iso']: row['tax'] for row in result}    def calculate_pop(self, wid, commit=True):        SQL = """        WITH stats AS (SELECT iso,             sum(CASE WHEN build = 'barr' THEN 3 WHEN build = 'house' THEN 1 WHEN build = 'cita' THEN 1 ELSE 0 END) as pop_limit,             sum(CASE WHEN unit IS NOT null THEN 1 ELSE 0 END) as mil_pop          FROM areas          WHERE iso IS NOT NULL AND wid = :wid          GROUP BY iso)                UPDATE countries        SET pop = pop_limit - mil_pop        FROM stats        WHERE countries.iso = stats.iso AND countries.wid = :wid        RETURNING countries.iso as iso, pop;        """        result = self.session.execute(text(SQL), {'wid': wid}).fetchall()        if commit:            self.session.commit()        return {row['iso']: row['pop'] for row in result}    def list_still_playing(self, wid):        """Gets countries that are not eliminated from the game:        - game ends for player: when shields == 0        - when country has no city or unit area        So countries are still playing if:        - their shields > 0        - they have any area with units or city tiles on it        """        SQL = """        SELECT c.iso        FROM countries c        LEFT JOIN areas a          ON a.iso = c.iso AND a.wid = :wid AND c.wid = :wid         WHERE a.iso IS NOT NULL        AND (tile = 'city' OR a.unit IS NOT NULL)        AND c.shields > 0        GROUP BY c.iso        """        result = self.session.execute(text(SQL), {'wid': wid}).fetchall()        return list(map(lambda x: str(x[0]), result))@Entity(Area)class AreaRepository(AbstractWorldInstanceRepository):    def list(self, ids):        return self.session.query(Area)\            .filter(Area.id.in_(ids))\        .all()    def set_reset_iso2(self, wid, commit=True):        self.session.query(Area)\            .filter(Area.wid == wid)\            .update({Area.iso2: Area.iso}, synchronize_session=commit)    def set_decrement_exhaust(self, wid, commit=True):        self.session.query(Area)\            .filter(Area.wid == wid)\            .filter(Area.exhaust > 0)\            .update({Area.exhaust: Area.exhaust - 1}, synchronize_session=commit)@Entity(MatchHistory)class HistoryRepository(Repository):    pass@Entity(MatchResult)class ResultRepository(Repository):    pass