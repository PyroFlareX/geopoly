from eme.entities import loadConfig
from eme.website import WebsiteApp


class GeoEditor(WebsiteApp):

    def __init__(self):
        # eme/examples/simple_website is the working directory.
        conf = loadConfig('GeoEditor/config.ini')

        super().__init__(conf)


if __name__ == "__main__":
    app = GeoEditor()
    app.start()
