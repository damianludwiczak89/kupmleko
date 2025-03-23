from django.contrib import admin
from .models import User, ShoppingList, Item, Draft, Invite



admin.site.register(User)
admin.site.register(ShoppingList)
admin.site.register(Item)
admin.site.register(Draft)
admin.site.register(Invite)