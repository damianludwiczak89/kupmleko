from django.db.models.signals import m2m_changed, post_save
from django.dispatch import receiver
from .models import ShoppingList, User, Invite
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

@receiver(post_save, sender=Invite)
def notify_users_invite(sender, instance, created, **kwargs):
    if not created:
        return
    user = instance.to_user
    if user and user.fcm_token:
        send_push_notification(
            user.fcm_token,
            "Friend invitation",
            f"New invite from {instance.from_user}"
        )