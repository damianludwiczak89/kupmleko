from django.shortcuts import render
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode 
from django.conf import settings
from django.http import HttpResponseBadRequest
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics, status
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response

from . import serializer as api_serializer
from .models import User

import base64
import random

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = api_serializer.MyTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = api_serializer.RegisterSerializer

def generate_random_otp(length=7):
    return ''.join([str(random.randint(0, 9)) for _ in range(length)])

class PasswordResetEmailVerifyAPIView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    serializer_class = api_serializer.UserSerializer

    def get_object(self):
        email = self.kwargs['email']

        user = User.objects.filter(email=email).first()
        
        if user:
            uuidb64 = urlsafe_base64_encode(force_bytes(user.pk))
            refresh = RefreshToken.for_user(user)
            refresh_token = str(refresh.access_token)
            user.refresh_token = refresh_token
            user.otp = generate_random_otp()
            user.save()

            link = f"http://localhost:8000/reset-password/?otp={user.otp}&uuidb64={uuidb64}&=refresh_token={refresh_token}"
            
            email_data = {
                "link": link,
                "username": user.username
            }

            subject = "Password Reset Email"
            text_body = render_to_string("email/password_reset.txt", email_data)
            html_body = render_to_string("email/password_reset.html", email_data)

            msg = EmailMultiAlternatives(
                subject=subject,
                from_email=settings.FROM_EMAIL,
                to=[user.email],
                body=text_body
            )

            msg.attach_alternative(html_body, "text/html")
            msg.send()

        return user
    
class PasswordChangeAPIView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = api_serializer.UserSerializer

    def get(self, request, *args, **kwargs):
        otp = request.GET.get('otp')
        uuidb64 = request.GET.get('uuidb64')

        if not otp or not uuidb64:
            return Response({"message": "Invalid or inactive link"}, status=status.HTTP_400_BAD_REQUEST)

        uuidb64 = int(force_str(urlsafe_base64_decode(uuidb64)))
        user = User.objects.filter(id=uuidb64, otp=otp).first()

        if not user or user.otp != otp:
            return Response({"message": "Invalid or inactive link"}, status=status.HTTP_400_BAD_REQUEST)
        
        return render(request, 'buddybasket/password_reset_form.html', {'otp': otp, 'uuidb64': uuidb64})

    def create(self, request, *args, **kwargs):
        otp = request.data['otp']
        uuidb64 = request.data['uuidb64']
        print(uuidb64)
        password = request.data['password']
        confirm_password = request.data['confirm_password']

        user = User.objects.filter(id=uuidb64, otp=otp).first()
        if not user:
            return Response({"message": "User does not exist"}, status = status.HTTP_404_NOT_FOUND)
        if password != confirm_password:
            return Response({"message": "Passwords do not match"}, status=status.HTTP_400_BAD_REQUEST)
        try:
            validate_password(password, user)
        except ValidationError as err:
            return Response({"message": err.messages}, status=status.HTTP_400_BAD_REQUEST)
        
        user.set_password(password)
        user.otp = ""
        user.save()

        return Response({"message": "Password Changed Successfully"}, status = status.HTTP_201_CREATED)
        