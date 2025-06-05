import firebase_admin
from firebase_admin import messaging, credentials
from django.conf import settings
import os


path = os.path.join(settings.BASE_DIR, "buddybasket-firebase-adminsdk-fbsvc-2ad439059d.json") 
cred = credentials.Certificate(path)
firebase_admin.initialize_app(cred)

def send_push_notification(token, title, body, type):
    message = messaging.Message(
        notification=messaging.Notification(
            title=title,
            body=body,
        ),
        data={
            "type": type
        },
        token=token,
    )
    return messaging.send(message)