from django.db.models.signals import post_delete
from django.dispatch import receiver
from .models import ShoppingList, Draft, Item

@receiver(post_delete, sender=ShoppingList)
def check_items_after_shopping_list_delete(sender, instance, **kwargs):
    Item.objects.filter(shopping_list=None, draft=None).delete()

@receiver(post_delete, sender=Draft)
def check_items_after_draft_delete(sender, instance, **kwargs):
    Item.objects.filter(draft=None, shopping_list=None).delete()
