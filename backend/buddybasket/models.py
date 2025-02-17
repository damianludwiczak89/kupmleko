from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

# Creating custom user model in case I need to tweak it in the future
class User(AbstractUser):
    username = models.CharField(max_length=50)
    email = models.EmailField(unique=True)
    otp = models.CharField(max_length=50, null=True, blank=True)
    refresh_token = models.CharField(max_length=1000, null=True, blank=True)
    friends = models.ManyToManyField("self", symmetrical=True, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email
    
    def save(self, *args, **kwargs):
        email_username = self.email.split("@")[0]
        if self.username == "" or self.username == None:
            self.username = email_username
        super(User,  self).save(*args, **kwargs)

    
class Draft(models.Model):
    users = models.ManyToManyField(User, related_name='drafts')
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name
    
class ShoppingList(models.Model):
    users = models.ManyToManyField(User, related_name='lists')
    name = models.CharField(max_length=100)
    draft = models.ForeignKey(Draft, on_delete=models.SET_NULL, related_name='draft', null=True, blank=True)

    def __str__(self):
        return self.name

class Item(models.Model):
    shopping_list = models.ForeignKey(ShoppingList, on_delete=models.SET_NULL, related_name='items', null=True, blank=True)
    draft = models.ForeignKey(Draft, on_delete=models.SET_NULL, related_name='items', null=True, blank=True)
    name = models.CharField(max_length=100)
    amount = models.IntegerField(default=1)
    bought = models.BooleanField(default=False)

    def __str__(self):
        return self.name

# Delete Item object if it is not related to ShoppingList AND Draft
@receiver(post_delete, sender=ShoppingList)
def check_items_after_shopping_list_delete(sender, instance, **kwargs):
    Item.objects.filter(shopping_list=instance, draft=None).delete()
@receiver(post_delete, sender=Draft)
def check_items_after_draft_delete(sender, instance, **kwargs):
    Item.objects.filter(draft=instance, shopping_list=None).delete()
