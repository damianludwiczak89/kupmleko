from rest_framework.test import APITestCase
from rest_framework.test import APIClient
from .models import Draft, ShoppingList, Item
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
            "email": "test@test.com"
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

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

        self.client.force_authenticate(user=self.user1)

        self.shopping_list = ShoppingList.objects.create(name="Lidl")
        self.shopping_list.users.add(self.user1)

        Item.objects.create(name="Milk", amount=3, bought=False, shopping_list=self.shopping_list)
        Item.objects.create(name="Cookies", amount=5, bought=False, shopping_list=self.shopping_list)

    def test_shopping_list_get(self):
        response = self.client.get(self.shopping_list_url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]['name'], "Lidl")
        self.assertEqual(len(response.data[0]['items']), 2)

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

    def test_shopping_list_delete(self):
        shopping_list_url = reverse("shopping_list_detail", args=[1])
        response = self.client.delete(shopping_list_url)
        
        self.assertEqual(response.status_code, status.HTTP_202_ACCEPTED)

        response = self.client.get(self.shopping_list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)

        items = Item.objects.all()
        self.assertEqual(len(items), 0)
        
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





    




