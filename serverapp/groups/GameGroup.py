from collections import OrderedDict

from game.entities import User, Area, World, Country
from game.instance import worlds, countries, areas, users
from game.services import movement, economy, turns as turns_serv, endgame, economy



class GameGroup:

    def __init__(self, server):
        self.server = server
        self.name = 'Game'

    def _accessControl(self, user, area_id=None, leave_country=False):
        if user.wid is None:
            return {"err": "not_in_match"}, None, None, None

        world = worlds.get(user.wid)

        if world.current != user.iso:
            return {"err": "not_your_turn"}, None, None, None

        if leave_country:
            country = None
        else:
            country = countries.get(user.iso, user.wid)

        if area_id is not None:
            area: Area = areas.get(area_id, user.wid)

            if area.iso != user.iso:
                return {"err": "not_your_area"}, None, None, None
        else:
            area = None

        return None, world, country, area

    def buy(self, area_id, item_id, user: User):
        error, world, country, area = self._accessControl(user, area_id)
        if error: return error

        if world.has_moved:
            return {"err": "cant_buy_after_move"}

        try:
            economy.buy_item(area, country, item_id)
        except economy.service.BuyException as e:
            return {"err": e.reason}

        areas.save(area)
        countries.save(country)

        self.server.send_to_world(user.wid, {
            "route": self.name+":buy",

            "iso": country.iso,
            "area_id": area_id,
            "item_id": item_id,

            "cost": economy.get_cost(item_id)
        })

    def move(self, area_id, to_id, user: User):
        error, world, country, area1 = self._accessControl(user, area_id)
        if error: return error

        area2: Area = areas.get(to_id, user.wid)
        is_kill = bool(area2.unit)

        try:
            is_conquer = movement.move_to(area1, area2, world.map)
        except movement.MoveException as e:
            return {"err": e.reason}

        if not world.has_moved:
            world.has_moved = True
            worlds.save(world)

        areas.save(area1)
        areas.save(area2)

        self.server.send_to_world(user.wid, {
            "route": self.name+":move",

            "iso": user.iso,
            "area_id": area_id,
            "to_id": to_id,

            "events": {
                "conquer": is_conquer,
                "kill": is_kill
            }
        })

    def end_turn(self, user: User, timeout=None):
        if timeout is not None:
            print("TODO: backend timeout validation & kick out")
            # we ignore
            return

        error, world, curr_country, _ = self._accessControl(user)
        if error: return error

        world_countries = world.countries
        dict_countries = OrderedDict((c.iso, c) for c in world_countries)

        # if len(world.isos) < 2:
        #     return {"err": "waiting_for_players"}

        try:
            round_end_events = turns_serv.end_turn(world, curr_country, dict_countries)
            winner_iso = None
        except turns_serv.EndGameException as e:
            winner_iso = e.reason
            round_end_events = e.events
        except turns_serv.TurnException as e:
            return {"err": e.reason}

        self.server.send_to_world(user.wid, {
            "route": self.name+":end_turn",
            "iso": user.iso,
            "turn_end": {
                "turns": world.turns,
                "current": world.current,
            },
            "round_end": round_end_events.to_dict() if round_end_events else None
        })

        if winner_iso:
            winner = winner_iso if winner_iso != '-1' else None

            # create match history
            world_users = users.list_all(world.wid)
            endgame.create_match_history(world, world_users, world_countries, winner=winner)

            # change user ratings
            endgame.apply_rating(world_users, winner=winner)
            users.save_all(world_users)

            # this schedules the world to be deleted at a later time
            world.turns = -1

            self.server.send_to_world(user.wid, {
                "route": self.name + ":end_game",
                "winner": winner_iso
            })

        worlds.save(world)

    def tribute(self, iso, amount, user: User):
        """
        Country1 gives a certain amount of gold to other country
        """
        world = worlds.get(user.wid)

        country1: Country = countries.get(user.iso, world.wid)
        country2: Country = countries.get(iso, world.wid)

        if not economy.give_tribute(country1, country2, amount):
            return

        countries.save_all([country1, country2])

        self.server.send_to_world(user.wid, {
            "route": self.name+":tribute",
            "iso": user.iso,
            "to_iso": iso,
            "amount": amount
        })

    def surrender(self, user: User):
        world = worlds.get(user.wid)

        country: Country = countries.get(user.iso, user.wid)
        country.shields = 0

        countries.save(country)

        if world.current == country.iso:
            return self.end_turn(user)

        self.server.send_to_world(user.wid, {
            "route": self.name+":surrender",
            "iso": user.iso
        })
