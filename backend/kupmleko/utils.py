from .models import Item, Draft, ShoppingList
import random, requests, os
from pathlib import Path

from dotenv import load_dotenv
load_dotenv(dotenv_path=Path(__file__).resolve().parent / '.env')

def update_and_delete_items(instance):
    '''
    When Draft or Shopping List is deleted, its items should be removed if they no longer
    are related to any objects or updated if they still have some relations
    '''

    '''


    potentially no longer needed


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

    '''
    
def generate_random_otp(length=7):
    return ''.join([str(random.randint(0, 9)) for _ in range(length)])
    

def uuid_to_none(data):
    sanitized = data.copy()
    items = sanitized.get("items", [])

    for item in items:
        if not isinstance(item.get("id"), int):
            item["id"] = None

    return sanitized

def send_email(to, subject, text):
  	return requests.post(
  		f"https://api.mailgun.net/v3/{os.environ['MAILGUN_DOMAIN']}/messages",
  		auth=("api", os.environ["MAILGUN_API_KEY"]),
  		data={"from": f"Kup Mleko  postmaster@{os.environ['MAILGUN_DOMAIN']}",
			"to": to,
  			"subject": subject,
  			"html": text})