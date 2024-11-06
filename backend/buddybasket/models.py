from django.db import models
from django.contrib.auth.models import AbstractUser

# Creating custom user model in case I need to tweak it in the future
class User(AbstractUser):
    username = models.CharField(unique=True, max_length=50)
    email = models.EmailField(unique=True)
    otp = models.CharField(unique=True, max_length=50)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return self.email
    
    def save(self, *args, **kwargs):
        email_username = self.email.split("@")[0]
        if self.username == "" or self.username == None:
            self.username = email_username
        super(User,  self).save(*args, **kwargs)

