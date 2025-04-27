from .models import Item, Draft, ShoppingList

def update_and_delete_items(instance):
    '''
    When Draft or Shopping List is deleted, its items should be removed if they no longer
    are related to any objects or updated if they still have some relations
    '''
    items_to_update = []
    items_to_delete = []

    if isinstance(instance, Draft):
        related_field = 'draft'
    elif isinstance(instance, ShoppingList):
        related_field = 'shopping_list'

    for item in instance.items.all():
        setattr(item, related_field, None)
        items_to_update.append(item)

        if not item.draft and not item.shopping_list:
            items_to_delete.append(item)

    if items_to_update:
        Item.objects.bulk_update(items_to_update, [related_field])

    if items_to_delete:
        Item.objects.filter(id__in=[item.id for item in items_to_delete]).delete()