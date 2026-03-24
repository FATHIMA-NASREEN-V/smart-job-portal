import json
from urllib.parse import parse_qs

from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth.models import AnonymousUser

from rest_framework_simplejwt.tokens import AccessToken
from users.models import User


class NotificationConsumer(AsyncWebsocketConsumer):

    async def connect(self):

        query_string = self.scope["query_string"].decode()
        query_params = parse_qs(query_string)

        token = query_params.get("token")

        if token:
            try:
                access_token = AccessToken(token[0])

                # 🔥 FIX: convert to int
                user_id = int(access_token["user_id"])

                self.user = await self.get_user(user_id)

            except Exception as e:
                print("❌ Token error:", e)
                self.user = AnonymousUser()
        else:
            self.user = AnonymousUser()

        if self.user.is_anonymous:
            print("❌ WebSocket rejected (anonymous)")
            await self.close()
            return

        self.group_name = f"user_{self.user.id}"

        await self.channel_layer.group_add(
            self.group_name,
            self.channel_name
        )

        await self.accept()

        print(f"✅ WebSocket connected: {self.user.username}")


    async def disconnect(self, close_code):

        if hasattr(self, "group_name"):
            await self.channel_layer.group_discard(
                self.group_name,
                self.channel_name
            )

        print("❌ WebSocket disconnected")


    async def send_notification(self, event):

        await self.send(text_data=json.dumps({
            "message": event["message"]
        }))


    # 🔥 IMPORTANT (async safe DB call)
    @staticmethod
    async def get_user(user_id):
        from asgiref.sync import sync_to_async
        return await sync_to_async(User.objects.get)(id=user_id)