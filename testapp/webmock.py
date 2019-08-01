from unittest.mock import MagicMock, patch

import flask
from eme.entities import loadHandlers, EntityPatch
from flask import request

from webapp.entities import ApiResponse

obj = MagicMock()

controllers = loadHandlers(obj, "Controller", "webapp/")


def call(controller_action, form_data=None, **kwargs):
    controller, action = controller_action.split(':')
    print("  >{}:{} {}".format(controller, action, kwargs))

    if form_data:
        request_mock = patch.object(flask, "request")

        with patch('request.form') as mock:
            mock.return_value = form_data

    resp = getattr(controllers[controller], action)(**kwargs)

    if resp:
        if isinstance(resp, ApiResponse):
            return resp.json

        return resp
