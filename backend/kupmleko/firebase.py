import firebase_admin
from firebase_admin import messaging, credentials
from django.conf import settings
import os
from firebase_admin._messaging_utils import UnregisteredError
from google.auth.exceptions import TransportError
from requests.exceptions import ProxyError
from urllib3.exceptions import MaxRetryError
import logging


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
    try:
        return messaging.send(message)
    except (TransportError, ProxyError, MaxRetryError, OSError, UnregisteredError) as e:
        logging.warning(f"Push notification failed due to error: {e}")
        return None