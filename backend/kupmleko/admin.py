from django.contrib import admin
from .models import User, ShoppingList, Item, Draft, Invite

class ItemInline(admin.TabularInline):
    model = Item
    can_delete = False
    extra = 0
    readonly_fields = ['name', 'amount', 'bought', 'shopping_list', 'draft']

class ShoppingListAdmin(admin.ModelAdmin):
    inlines = [ItemInline]
    list_display = ['name', 'created_by', 'archived']


class DraftAdmin(admin.ModelAdmin):
    inlines = [ItemInline]
    list_display = ['name', 'user']

class ItemAdmin(admin.ModelAdmin):
    list_display = ['name', 'shopping_list', 'draft']

admin.site.register(User)
admin.site.register(ShoppingList, ShoppingListAdmin)
admin.site.register(Item, ItemAdmin)
admin.site.register(Draft, DraftAdmin)
admin.site.register(Invite)