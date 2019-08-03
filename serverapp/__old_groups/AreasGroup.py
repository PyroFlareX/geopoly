from eme.entities import EntityPatch

from core.entities import User, Area, Match
from core.exceptions import AreaGuardedException, MoveException
from core.instance import areas, matches
from core.game import move_to, attack_to
from core.services.events import pushEvent, addEvent, addBattleEvent


class AreasGroup:

    def __init__(self, server):
        self.server = server
        self.group = 'Areas'

    def load(self, user=None, mid=None):
        if mid is None:
            if user.mid is None:
                return {"err": "not_in_match"}
            else:
                mid = user.mid

        lareas = areas.get_all(mid=mid, raw=True)

        return {
            "areas": lareas
        }

    def move(self, from_id: str, to_id: str, patch: EntityPatch, user: User):
        if user.mid is None:
            return {"err": "not_in_match"}

        try:
            area_from: Area = areas.get(user.mid, from_id)
            area_to: Area = areas.get(user.mid, to_id)
            patch = patch.toDict()
        except Exception as e:
            if self.server.debug:
                raise e

            # user has given bad input
            return {"err": "bad_input"}

        if area_from.iso != user.iso:
            # user tries to move someone else's area
            return {
                "err": "not_yours",
                "from_iso": area_from.iso,
                "to_iso": area_to.iso,
                "user_iso": user.iso
            }

        # Move units:
        try:
            move_to(area_from, area_to, patch)

            areas.save(area_from)
            areas.save(area_to)

            match: Match = matches.get(user.mid)
            pushEvent(match, addEvent(match, 1, area_from.iso))

            self.server.sendToMatch(user.mid, {
                "route": "Areas:move",

                "from_id": area_from.id,
                "to_id": area_to.id,

                "iso": area_from.iso,
                "move_left": area_from.move_left,

                #"area_from": area_from.toView(),
                #"area_to": area_to.toView(),
                "patch": patch,
            })

        except AreaGuardedException as e:
            # Area is guarded, battle time

            try:
                new_patch, escape_patch, resp = attack_to(area_from, area_to, patch)

                match: Match = matches.get(user.mid)
                pushEvent(match, addBattleEvent(match, 3, area_from.iso, battle=resp))

                areas.save(area_from)
                areas.save(area_to)

                self.server.sendToMatch(user.mid, {**{
                    "route": "Areas:battle",

                    "from_id": area_from.id,
                    "to_id": area_to.id,

                    "patch": patch,
                    "new_patch": new_patch,
                    "escape_patch": escape_patch,

                    "iso": area_from.iso,
                    "move_left": area_from.move_left,

                }, **resp.toDict()})

            except MoveException as e:
                # Area is probably not neighbor, or we're out of exhaustion

                return {"err": e.reason}


            # if resp.def_esc:
            #     # defendant still had some army, it attempts to leave...
            #
            #     pass
            #
            # if resp.att_win:
            #     try:
            #         # Let's try moving again
            #         # ...but only with the remaining army
            #         move_to_after_battle(area_from, area_to, patch)
            #
            #         areas.save(area_from)
            #         areas.save(area_to)
            #
            #
            #     except MoveException as e:
            #         # Area is probably not neighbor, or we're out of exhaustion
            #
            #         return {"err": e.reason}
            # # else:
            # #     # Defender won, save state
            # #     areas.save(area_from)
            # #     areas.save(area_to)

        except MoveException as e:
            # Area is probably not neighbor, or we're out of exhaustion

            return {"err": e.reason}
