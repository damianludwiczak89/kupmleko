from rest_framework.test import APITestCase
from rest_framework.test import APIClient
from .models import Draft, ShoppingList
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