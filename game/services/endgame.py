from game.entities import Area, User, Country, MatchHistory, MatchResult
from game.instance import histories, matchresults, countries, users, areas as areasrepo
from game.util.load_gtml import load_isos


def create_match_history(world, world_users, world_countries, winner=None):
    # load necessary entities
    world_users = {user.iso: user for user in world_users}
    isos = load_isos('game/maps/{}.gtml'.format(world.map))

    history = MatchHistory(wid=world.wid, map=world.map, rounds=world.rounds)

    # create history result profiles for each player
    results = []

    for iso in isos:
        user = world_users.get(iso)
        country = world_countries.get(iso)

        mr = MatchResult( history_id=world.wid, iso=iso, shields=country.shields, gold=country.gold )
        if user is not None:
            mr.uid = user.uid
            mr.div = user.division

        if winner == iso or (iso in winner and isinstance(winner, list)):
            mr.result = 1
        elif country.shields <= 0:
            mr.result = 2
        else:
            mr.result = 99

        results.append(mr)

    histories.save(history)
    matchresults.save_all(results)


def populate_match_history(world):
    # Load and gather necessary entities
    isos = load_isos('game/maps/{}.gtml'.format(world.map))
    history = histories.get(world.wid)
    world_areas = areasrepo.list_all(world.wid)
    results = history.results
    #results = matchresults.list_all(world.wid)
    d_results = {r.iso: r for r in results}

    # calculate area statistics at the end of the game
    for area in world_areas:
        if not area.iso:
            continue

        d_results[area.iso].areas += 1

        if area.tile == 'city':
            d_results[area.iso].cities += 1

            if area.build == 'barr':
                d_results[area.iso].barr += 1
            elif area.build == 'cita':
                d_results[area.iso].cita += 1
            elif area.build == 'house':
                d_results[area.iso].house += 1

        if area.unit == 'cav':
            d_results[area.iso].cav += 1
        elif area.unit == 'art':
            d_results[area.iso].art += 1
        elif area.unit == 'inf':
            d_results[area.iso].inf += 1

    matchresults.save_all(d_results.values(), commit=False)
