from collections import OrderedDict

from game.entities import User, Area, World, Country
from game.instance import worlds, countries, areas, users
from game.services import movement, building, turns as turns_serv, endgame


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
            building.buy_item(area, country, item_id)
        except building.service.BuyException as e:
            return {"err": e.reason}

        areas.save(area)
        countries.save(country)

        self.server.send_to_world(user.wid, {
            "route": self.name+":buy",

            "iso": country.iso,
            "area_id": area_id,
            "item_id": item_id,

            "cost": building.get_cost(item_id)
        })

    def move(self, area_id, to_id, user: User):
        error, world, country, area1 = self._accessControl(user, area_id)
        if error: return error

        area2: Area = areas.get(to_id, user.wid)
        is_kill = bool(area2.unit)

        try:
            is_conquer = movement.move_to(area1, area2)
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

    def end_turn(self, user: User):
        error, world, curr_country, _ = self._accessControl(user)
        if error: return error

        world_countries = countries.list_all(world.wid)
        world_countries = OrderedDict((c.iso, c) for c in world_countries)

        # if len(world.isos) < 2:
        #     return {"err": "waiting_for_players"}

        try:
            round_end_events = turns_serv.end_turn(world, curr_country, world_countries)
            winner_iso = None
        except turns_serv.EndGameException as e:
            winner_iso = e.reason
            round_end_events = e.events
        except turns_serv.TurnException as e:
            return {"err": e.reason}

        if round_end_events is not None:
            countries_to_save = []

            # save countries that have been eliminated by conquer
            for iso in round_end_events.eliminated:
                country = world_countries[iso]

                if country.shields > 0:
                    country.shields = 0#-1
                    countries_to_save.append(country)

            # save emperor and previous emperor countries
            if round_end_events.ex_emperor:
                countries_to_save.append(round_end_events.ex_emperor)

            if round_end_events.emperor:
                countries_to_save.append(round_end_events.emperor)

            countries.save_all(countries_to_save)


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
            # create match history
            world_users = users.list_all(world.wid)
            endgame.create_match_history(world, world_users, world_countries, winner=winner_iso if winner_iso != '-1' else None)

            for user in world_users:
                user.iso = None
                user.wid = None

                # todo: rating
                print("TODO: rating")

            users.save_all(world_users)

            # this schedules the world to be deleted at a later time
            world.turns = -1

            self.server.send_to_world(user.wid, {
                "route": self.name + ":end_game",
                "winner": winner_iso
            })

        worlds.save(world)

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
