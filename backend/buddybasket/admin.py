from django.contrib import admin
from .models import User, ShoppingList, Item, Draft



admin.site.register(User)
admin.site.register(ShoppingList)
admin.site.register(Item)
admin.site.register(Draft)