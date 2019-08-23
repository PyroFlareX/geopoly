from engine.modules.building import service


def buy_item(area, country, item_id):
    # raises BuyException
    service.buy_item(area, country, item_id)

    # you can't buy new figures for the next turn
    area.exhaust = 1

    return True


def get_cost(item_id):
    return service.get_cost(item_id)


def get_conf(item_id):
    return service.get_conf(item_id)
