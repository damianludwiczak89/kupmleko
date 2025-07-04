from django.db import models
from django.contrib.auth.models import AbstractUser
from django.apps import apps
from django.dispatch import Signal, receiver

invite_accepted = Signal()


class User(AbstractUser):
    username = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    otp = models.CharField(max_length=50, null=True, blank=True)
    friends = models.ManyToManyField("self", symmetrical=True, blank=True)
    fcm_token = models.CharField(max_length=255, blank=True, null=True)
    account_auth_type = models.CharField(max_length=30, choices=[('email', 'email'), ('google', 'google')], default='email')
    language = models.CharField(max_length=4, choices=[('pl', 'pl'), ('en', 'en')], default='pl')

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email
    
    def save(self, *args, **kwargs):
        email_username = self.email.split("@")[0]
        if self.username == "" or self.username == None:
            self.username = email_username
        super(User,  self).save(*args, **kwargs)

    def remove_friend(self, friend):
        ShoppingList = apps.get_model('kupmleko', 'ShoppingList')

        my_created_lists = ShoppingList.objects.filter(created_by=self, users=friend)
        for shopping_list in my_created_lists:
            shopping_list._suppress_notifications = True
            shopping_list.users.remove(friend)

        friends_created_lists = ShoppingList.objects.filter(created_by=friend, users=self)
        for shopping_list in friends_created_lists:
            shopping_list._suppress_notifications = True
            shopping_list.users.remove(self)

        if friend in self.friends.all():
            self.friends.remove(friend)
            return True
        return False

    
class Draft(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='drafts')
    name = models.CharField(max_length=100)

    def __str__(self):
        return f"{self.name} - {self.user}"
    
class ShoppingList(models.Model):
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_lists') 
    users = models.ManyToManyField(User, related_name='lists')
    name = models.CharField(max_length=100)
    archived = models.BooleanField(default=False)
    archived_timestamp = models.DateTimeField(default=None, null=True, blank=True)

    def __str__(self):
        return f"{self.name} - {self.created_by}"

class Item(models.Model):
    shopping_list = models.ForeignKey(ShoppingList, on_delete=models.CASCADE, related_name='items', null=True, blank=True)
    draft = models.ForeignKey(Draft, on_delete=models.CASCADE, related_name='items', null=True, blank=True)
    name = models.CharField(max_length=100)
    amount = models.IntegerField(default=1)
    bought = models.BooleanField(default=False)

    def __str__(self):
        return self.name
    
class Invite(models.Model):
    from_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_invites")
    to_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="received_invites")

    class Meta:
        unique_together = ('from_user', 'to_user')

    def accept(self):
        self.from_user.friends.add(self.to_user)
        for shopping_list in self.from_user.lists.all():
            shopping_list._suppress_notifications = True
            if shopping_list.archived == False:
                shopping_list.users.add(self.to_user)
        
        for shopping_list in self.to_user.lists.all():
            shopping_list._suppress_notifications = True
            if shopping_list.archived == False:
                shopping_list.users.add(self.from_user)
        reversed_invite = Invite.objects.filter(from_user=self.to_user, to_user=self.from_user)
        if reversed_invite:
            reversed_invite[0].delete()
        invite_accepted.send(sender=self.__class__, invite=self)
        self.delete()

    def __str__(self):
        return f"{self.from_user.username} invited {self.to_user.username}"

