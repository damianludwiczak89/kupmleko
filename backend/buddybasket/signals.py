from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import ShoppingList
from django.conf import settings
from .firebase import send_push_notification

@receiver(post_save, sender=ShoppingList)
def new_shopping_list_notify(sender, instance, created, **kwargs):
    if not created:
        return

    user = instance.user
    friends = user.friends.all()

    for friend in friends:
        if friend.fcm_token:
            send_push_notification(friend.fcm_token, "New Shopping List", f"{instance.user.username} created a new shopping list: {instance.name}")