from django.db.models.signals import m2m_changed, post_save
from django.dispatch import receiver
from .models import ShoppingList, User, Invite
from .firebase import send_push_notification

@receiver(m2m_changed, sender=ShoppingList.users.through)
def notify_users_added(sender, instance, action, pk_set, **kwargs):
    if getattr(instance, '_suppress_notifications', False):
        return
    
    if action == 'post_add':
        # Avoid notifying the user who created the list - only his/her friends
        creator = instance.created_by
        creator_friends = set(creator.friends.all())
        users = User.objects.filter(pk__in=pk_set)


        for user in users:
            if user in creator_friends and user.fcm_token:

                if user.language == 'pl':
                    title = "Masz nową listę od znajomego"
                    body = f"{creator.username if creator else 'Ktoś'} udostępnił/a listę: {instance.name}" 
                elif user.language == 'en':
                    title = "New Shopping List Shared"
                    body = f"{creator.username if creator else 'Someone'} shared a list: {instance.name}" 

                send_push_notification(
                    user.fcm_token,
                    title,
                    body
                )

@receiver(post_save, sender=Invite)
def notify_users_invite(sender, instance, created, **kwargs):
    if not created:
        return
    user = instance.to_user
    if user and user.fcm_token:
        if user.language == 'pl':
            title = 'Zaproszenie do znajomych'
            body = f'Nowe zaproszenie od {instance.from_user}'
        elif user.language == 'en':
            title = 'Frined invitation'
            body = f"New invite from {instance.from_user}"
        send_push_notification(
            user.fcm_token,
            title,
            body
        )