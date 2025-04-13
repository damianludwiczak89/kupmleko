from django.db.models.signals import m2m_changed
from django.dispatch import receiver
from .models import ShoppingList, User
from .firebase import send_push_notification

@receiver(m2m_changed, sender=ShoppingList.users.through)
def notify_users_added(sender, instance, action, pk_set, **kwargs):
    if action == 'post_add':
        # Avoid notifying the user who created the list
        creator = instance.created_by

        for user_id in pk_set:
            if user_id == creator.id:
                continue
            user = User.objects.get(pk=user_id)
            if user.fcm_token:
                send_push_notification(
                    user.fcm_token,
                    "New Shopping List Shared",
                    f"{creator.username if creator else 'Someone'} shared a list: {instance.name}"
                )