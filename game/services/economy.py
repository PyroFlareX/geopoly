from engine.modules.building import service
from engine.modules.building.service import items, BuyException
from game.entities import Country, Area


def get_cost(item_id):
    return service.get_cost(item_id)


def get_conf(item_id):
    return service.get_conf(item_id)


def buy_item(area, country, item_id):
    # raises BuyException
    service.buy_item(area, country, item_id)

    # you can't buy new figures for the next turn
    area.exhaust = 1

    return True


def give_tribute(country1: Country, country2: Country, amount):
    if amount % 10 != 0 or amount <= 0:
        return False

    if country1.gold < amount:
        return False

    if country1.iso == country2.iso:
        return False

    country1.gold -= amount
    country2.gold += amount

    return True


def sacrifice_shield(country: Country, area: Area, item):
    old_gold = country.gold
    #old_pop = country.pop

    if country.shields <= 1:
        raise BuyException("not_enough_shields")

    # you can't buy city tile
    # if item in ('city','river',''):
    #     raise BuyException("bad_conf")

    # hack: set infinite resources, buy item, then reset
    country.gold = 999
    #country.pop = 99

    try:
        return buy_item(area, country, item)
    except BuyException as e:
        raise e
    finally:
        # restore original resources
        country.gold = old_gold
        #country.pop = old_pop

        # remove 1 shield
        country.shields -= 1
