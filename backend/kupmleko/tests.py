from rest_framework.test import APITestCase
from rest_framework.test import APIClient
from .models import Draft, ShoppingList, Item, Invite
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status


User = get_user_model()

class RegisterSuite(APITestCase):

    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('register')

    def test_register_correct(self):
        response = self.client.post(self.register_url, {
            "username": "test",
            "password": "Test123$",
            "password2": "Test123$",
            "email": "test@test.com",
            "language": 'en',
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        user = User.objects.get(username="test")
        self.assertEqual(user.language, 'en')

    def test_register_existing_email(self):
        User.objects.create_user(username="test", email="test@test.com", password="Test123$")
        response = self.client.post(self.register_url, {
            "username": "test",
            "password": "Test123$",
            "password2": "Test123$",
            "email": "test@test.com"
        })
        self.assertEqual(response.data["email"], ["user with this email already exists."])
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_password_mismatch(self):
        response = self.client.post(self.register_url, {
            "username": "test",
            "password": "Test123%",
            "password2": "Test123$",
            "email": "test@test.com"
        })
        self.assertEqual(response.data["password"], ["Passwords do not match."])
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_password_too_short(self):
        response = self.client.post(self.register_url, {
            "username": "test",
            "password": "Test12#",
            "password2": "Test12#",
            "email": "test@test.com"
        })
        self.assertEqual(response.data["password"], ["This password is too short. It must contain at least 8 characters."])
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_password_too_common(self):
        response = self.client.post(self.register_url, {
            "username": "test",
            "password": "qwerty123",
            "password2": "qwerty123",
            "email": "test@test.com"
        })
        self.assertEqual(response.data["password"], ["This password is too common."])
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_register_password_only_numeric(self):
        response = self.client.post(self.register_url, {
            "username": "test",
            "password": "15975328",
            "password2": "15975328",
            "email": "test@test.com"
        })
        self.assertEqual(response.data["password"], ["This password is entirely numeric."])
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class LoginSuite(APITestCase):

    def setUp(self):
        self.client = APIClient()
        self.login_url = reverse('login')
        self.user = User.objects.create_user(username="test", email="test@test.com", password="Test123$", is_active=True)

    def test_login_correct(self):
        response = self.client.post(self.login_url, {
            "email": "test@test.com",
            "password": "Test123$"
        })
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_login_wrong_password(self):
        response = self.client.post(self.login_url, {
            "email": "test@test.com",
            "password": "x$"
        })
        self.assertEqual(str(response.data["detail"]), "Incorrect password")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_login_wrong_email(self):
        response = self.client.post(self.login_url, {
            "email": "test@testa.com",
            "password": "Test123$"
        })
        self.assertEqual(str(response.data["detail"]), "No active account found with the given credentials")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

class ShoppingListSuite(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.shopping_list_url = reverse('shopping_list')

        self.user1 = User.objects.create_user(username="test1", email="test1@test.com", password="Test123$", is_active=True)
        self.user2 = User.objects.create_user(username="test2", email="test2@test.com", password="Test123$", is_active=True)

        self.user2.friends.add(self.user1)

        self.client.force_authenticate(user=self.user1)

        self.shopping_list = ShoppingList.objects.create(name="Lidl", created_by=self.user1)
        self.shopping_list.users.add(self.user1)

        Item.objects.create(name="Milk", amount=3, bought=False, shopping_list=self.shopping_list)
        Item.objects.create(name="Cookies", amount=5, bought=False, shopping_list=self.shopping_list)


    def test_shopping_list_get(self):
        response = self.client.get(self.shopping_list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], "Lidl")
        self.assertEqual(len(response.data[0]['items']), 2)


    def test_shopping_list_get_by_id(self):
        shopping_list_url = reverse("shopping_list_detail", args=[1])
        response = self.client.get(shopping_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], "Lidl")
        self.assertEqual(len(response.data['items']), 2)

    def test_shopping_list_post(self):
        response = self.client.post(self.shopping_list_url, {
            'name': 'Kaufland',
            "items": [{'name': 'Eggs', 'amount': 3, 'bought': False}, {'name': 'Water', 'amount': 6, 'bought': False}]
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        response = self.client.get(self.shopping_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[1]['name'], "Kaufland")
        self.assertEqual(len(response.data[1]['items']), 2)

        response = self.client.post(self.shopping_list_url, {
            'name': 'Intermarche',
            "items": []
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        response = self.client.get(self.shopping_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 3)
        self.assertEqual(response.data[2]['name'], "Intermarche")
        self.assertEqual(len(response.data[2]['items']), 0)

        self.client.force_authenticate(user=self.user2)
        response = self.client.post(self.shopping_list_url, {
            'name': 'Polo Market',
            "items": [{'name': 'Flour', 'amount': 8, 'bought': False}]
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        self.client.force_authenticate(user=self.user1)
        response = self.client.get(self.shopping_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 4)
        self.assertEqual(response.data[3]['name'], "Polo Market")
        self.assertEqual(len(response.data[3]['items']), 1)


    def test_shopping_list_delete(self):
        shopping_list_url = reverse("shopping_list_detail", args=[1])
        response = self.client.delete(shopping_list_url)
        
        self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)

        response = self.client.get(self.shopping_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

        items = Item.objects.all() # List is not deleted but archived, so items are still attached
        self.assertEqual(len(items), 2)
        
    def test_shopping_list_put(self):

        response = self.client.get(self.shopping_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], "Lidl")

        shopping_list_url = reverse("shopping_list_detail", args=[1])
        response = self.client.put(shopping_list_url, {
            "name": "Intermarche",
            "items": [{"name": "apple", "amount": 1, "bought": False}]
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)

        response = self.client.get(self.shopping_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], "Intermarche")
        self.assertEqual(len(response.data[0]['items']), 1)


class DraftSuite(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.draft_url = reverse('draft')

        self.user1 = User.objects.create_user(username="test1", email="test1@test.com", password="Test123$", is_active=True)

        self.client.force_authenticate(user=self.user1)

        self.draft = Draft.objects.create(name="Lidl", user=self.user1)

        Item.objects.create(name="Milk", amount=3, bought=False, draft=self.draft)
        Item.objects.create(name="Cookies", amount=5, bought=False, draft=self.draft)

    def test_draft_get(self):
        response = self.client.get(self.draft_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], "Lidl")
        self.assertEqual(len(response.data[0]['items']), 2)
    
    def test_draft_get_by_id(self):
        activate_draft_url = reverse("draft_detail", args=[1])
        response = self.client.get(activate_draft_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], "Lidl")
        self.assertEqual(len(response.data['items']), 2)

    def test_draft_activate_to_shopping_list(self):
        draft_url = reverse("draft_activate")
        response = self.client.post(draft_url, {'id': 1,})

        shopping_list_url = reverse('shopping_list')
        response = self.client.get(shopping_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], "Lidl")
        self.assertEqual(len(response.data[0]['items']), 2)


    def test_draft_post(self):
        response = self.client.post(self.draft_url, {
            'name': 'Kaufland',
            "items": [{'name': 'Eggs', 'amount': 3, 'bought': False}, {'name': 'Water', 'amount': 6, 'bought': False}]
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        response = self.client.get(self.draft_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[1]['name'], "Kaufland")
        self.assertEqual(len(response.data[1]['items']), 2)

        response = self.client.post(self.draft_url, {
            'name': 'Intermarche',
            "items": []
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        response = self.client.get(self.draft_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 3)
        self.assertEqual(response.data[2]['name'], "Intermarche")
        self.assertEqual(len(response.data[2]['items']), 0)

    def test_draft_and_shopping_list(self):
        response = self.client.post(self.draft_url, {
            'name': 'Kaufland',
            "items": [{'name': 'Eggs', 'amount': 3, 'bought': False}, {'name': 'Water', 'amount': 6, 'bought': False}],
            "activeAndDraft": True
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        response = self.client.get(self.draft_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[1]['name'], "Kaufland")
        self.assertEqual(len(response.data[1]['items']), 2)

        shopping_list_url = reverse('shopping_list')
        response = self.client.get(shopping_list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], "Kaufland")
        self.assertEqual(len(response.data[0]['items']), 2)



    def test_draft_delete(self):
        draft_url = reverse("draft_detail", args=[1])
        response = self.client.delete(draft_url)
        
        self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)

        response = self.client.get(self.draft_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

        items = Item.objects.all()
        self.assertEqual(len(items), 0)
        
    def test_draft_put(self):

        response = self.client.get(self.draft_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], "Lidl")

        draft_url = reverse("draft_detail", args=[1])
        response = self.client.put(draft_url, {
            "name": "Intermarche",
            "items": [{"name": "apple", "amount": 1, "bought": False}]
        }, format='json')

        self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)

        response = self.client.get(self.draft_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], "Intermarche")
        self.assertEqual(len(response.data[0]['items']), 1)

class FriendsSuite(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.friends_url = reverse('friends')

        self.user1 = User.objects.create_user(username="test1", email="test1@test.com", password="Test123$", is_active=True)
        self.user2 = User.objects.create_user(username="test2", email="test2@test.com", password="Test123$", is_active=True)
        self.user3 = User.objects.create_user(username="test3", email="test3@test.com", password="Test123$", is_active=True)

        self.user1.friends.add(self.user2)

        self.client.force_authenticate(user=self.user1)

        self.shopping_list = ShoppingList.objects.create(name="Lidl", created_by=self.user3)
        self.shopping_list.users.add(self.user3)

        self.shopping_list = ShoppingList.objects.create(name="Lidl", created_by=self.user2)
        self.shopping_list.users.add(self.user2, self.user1)

        Item.objects.create(name="Milk", amount=3, bought=False, shopping_list=self.shopping_list)
        Item.objects.create(name="Cookies", amount=5, bought=False, shopping_list=self.shopping_list)

    def test_friends_get(self):
        response = self.client.get(self.friends_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['username'], 'test2')



    def test_friends_post(self):
        response = self.client.post(self.friends_url, {'email': 'test3@test.com'})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        response = self.client.post(self.friends_url, {'email': 'test2@test.com'})
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)

        response = self.client.get(self.friends_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[1]['username'], 'test3')

        # Check if after befriending user3, user1 sees user3's shopping list
        shopping_list_url = reverse('shopping_list')
        response = self.client.get(shopping_list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_friends_delete(self):

        shopping_lists_url = reverse('shopping_list')
        response = self.client.get(shopping_lists_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], "Lidl")

        friends_url = reverse("friends_delete", args=[2])
        response = self.client.delete(friends_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], 'Friend removed successfully')

        shopping_lists_url = reverse('shopping_list')
        response = self.client.get(shopping_lists_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

        response = self.client.delete(friends_url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'User is not your friend')

        friends_url = reverse("friends_delete", args=[20])
        response = self.client.delete(friends_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['error'], 'User not found')



class SearchSuite(APITestCase):
    def setUp(self):
        self.client = APIClient()

        self.user1 = User.objects.create_user(username="test1", email="test1@test.com", password="Test123$", is_active=True)
        self.user2 = User.objects.create_user(username="test2", email="test2@test.com", password="Test123$", is_active=True)

        self.client.force_authenticate(user=self.user1)

    def test_search_get(self):
        search_url = reverse("search", args=['test2@test.com'])
        response = self.client.get(search_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], "test2")
        self.assertEqual(response.data['email'], "test2@test.com")

class InviteSuite(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.invite_url = reverse('invite')

        self.user1 = User.objects.create_user(username="test1", email="test1@test.com", password="Test123$", is_active=True)
        self.user2 = User.objects.create_user(username="test2", email="test2@test.com", password="Test123$", is_active=True)
        self.user3 = User.objects.create_user(username="test3", email="test3@test.com", password="Test123$", is_active=True)
        self.user4 = User.objects.create_user(username="test4", email="test4@test.com", password="Test123$", is_active=True)

        Invite.objects.create(from_user=self.user3, to_user=self.user1)
        self.user1.friends.add(self.user4)
        self.client.force_authenticate(user=self.user1)

        self.shopping_list = ShoppingList.objects.create(name="Lidl", created_by=self.user3)
        self.shopping_list.users.add(self.user3)

    def test_invites_get(self):
        response = self.client.get(self.invite_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]['from_user']['email'], 'test3@test.com')
        
    def test_invites_send(self):
        response = self.client.post(self.invite_url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'Email is required')
        
        response = self.client.post(self.invite_url, {'email': 'test2@test.com'})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['message'], 'Invite sent!')

        response = self.client.post(self.invite_url, {'email': 'test1@test.com'})
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)
        self.assertEqual(response.data['error'], 'Cannot invite yourself')

        response = self.client.post(self.invite_url, {'email': 'test2@test.com'})
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)
        self.assertEqual(response.data['error'], 'Invite already sent')

        response = self.client.post(self.invite_url, {'email': 'test4@test.com'})
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)
        self.assertEqual(response.data['error'], 'Already a friend')
        
    def test_invite_accept(self):
        invite_url = reverse("accept_invite")
        response = self.client.post(invite_url)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data['error'], 'Invite ID is required')

        response = self.client.post(invite_url, {'id': 10})
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['error'], 'Invite not found')

        response = self.client.post(invite_url, {'id': 1})
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        friends_url = reverse('friends')
        response = self.client.get(friends_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[1]['username'], 'test3')

        Invite.objects.create(from_user=self.user4, to_user=self.user1)
        response = self.client.post(invite_url, {'id': 2})
        self.assertEqual(response.status_code, status.HTTP_409_CONFLICT)
        self.assertEqual(response.data['error'], 'Already a friend')


        shopping_lists_url = reverse('shopping_list')
        response = self.client.get(shopping_lists_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], "Lidl")

    def test_invite_reject(self):
        invite_url = reverse("invite", args=[1])
        response = self.client.delete(invite_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['message'], 'Friend request rejected!')

        response = self.client.delete(invite_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data['error'], 'Invite not found')

class HistorySuite(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.history_url = reverse('history')

        self.user1 = User.objects.create_user(username="test1", email="test1@test.com", password="Test123$", is_active=True)
        self.client.force_authenticate(user=self.user1)
        self.shopping_list = ShoppingList.objects.create(name="Lidl", created_by=self.user1, archived=True)
        self.shopping_list2 = ShoppingList.objects.create(name="Kaufland", created_by=self.user1, archived=False)
        Item.objects.create(name="Milk", amount=3, bought=False, shopping_list=self.shopping_list)
        Item.objects.create(name="Cookies", amount=5, bought=False, shopping_list=self.shopping_list)
        self.shopping_list.users.add(self.user1)
        self.shopping_list2.users.add(self.user1)

    def test_history_get(self):
        response = self.client.get(self.history_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], "Lidl")

    def test_max_10_history_objects(self):
        items = Item.objects.all()
        self.assertEqual(len(items), 2)
        for i in range(9):
            shopping_list = ShoppingList.objects.create(name="Lidl", archived=True, created_by=self.user1)
            shopping_list.users.add(self.user1)

        response = self.client.get(self.history_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 10)

         # Create shopping list, not archived, delete it, check if archive length did not exceeded 10, and oldest is deleted

        shopping_list = ShoppingList.objects.create(name="Lidl", created_by=self.user1)
        shopping_list.users.add(self.user1)
        shopping_list_url = reverse("shopping_list_detail", args=[shopping_list.id])
        response = self.client.delete(shopping_list_url)
        
        self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)

        response = self.client.get(self.history_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 10)
        self.assertNotIn(self.shopping_list, response.data)

        # Check if items of the removed archived list are deleted
        items = Item.objects.all()
        self.assertEqual(len(items), 0)