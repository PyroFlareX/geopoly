from core.instance import worlds
from core.services import areas
from core.services.areas import load_areas_raw
from webapp.entities import ApiResponse


class AreasController():
    def __init__(self, server):
        self.server = server
        self.group = "Areas"

        self.server.addUrlRule({
            'GET /areas/radius/<area_id>': 'areas/load',
        })

    def get_load(self, area_id):
        # todo: get wid from user
        wid = worlds.list_all()[0].wid

        geojson_areas = load_areas_raw([area_id], wid, discover_fog=True)

        return ApiResponse({
            "areas": geojson_areas,
        })
