from core.services import areas


class AreasController():
    def __init__(self, server):
        self.server = server
        self.group = "Areas"

        self.server.addUrlRule({
            'GET /player/<pid>/areas': 'areas/by_player',
            'GET /country/<iso>/areas': 'areas/by_country',
            'GET /area/<aid>': 'areas/view',

            'GET /player/<pid>/radius': 'areas/by_player_radius',
            'GET /country/<iso>/radius': 'areas/by_country_radius',
            'GET /area/radius/<aid>': 'areas/view_radius',
        })

    def get_view(self, pid):
        """Get area by id"""

        pass

    def get_by_player(self, pid):
        """Get areas owned player"""

        pass

    def get_by_country(self, iso):
        """Get areas belonging to country"""

        pass

    def get_view_radius(self, pid):
        """Get area by id + action radius"""

        pass

    def get_by_player_radius(self, pid):
        """Get areas owned player + action radius"""

        pass

    def get_by_country_radius(self, iso):
        """Get areas belonging to country + action radius"""

        pass
