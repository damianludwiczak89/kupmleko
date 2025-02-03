from django.db import models
from django.contrib.auth.models import AbstractUser

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

class ShoppingList(models.Model):
    users = models.ManyToManyField(User, related_name='lists')
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Item(models.Model):
    shopping_list = models.ForeignKey(ShoppingList, on_delete=models.CASCADE, related_name='items')
    name = models.CharField(max_length=100)
    amount = models.IntegerField(default=1)
    bought = models.BooleanField(default=False)

    def __str__(self):
        return self.name
