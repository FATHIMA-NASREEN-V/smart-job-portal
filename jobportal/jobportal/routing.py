# this is my routing.py file from jobportal project.

from notifications.routing import websocket_urlpatterns as notification_ws 

websocket_urlpatterns = [
    # *websocket_urlpatterns,
    *notification_ws,
]