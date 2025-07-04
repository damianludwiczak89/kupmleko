from django.shortcuts import render, get_object_or_404
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail
from django.template.loader import render_to_string
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode 
from django.conf import settings
from django.utils.encoding import force_bytes, force_str
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.utils import timezone
from django_ratelimit.decorators import ratelimit
from django.utils.decorators import method_decorator


from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import AuthenticationFailed

from . import serializer as api_serializer
from .models import User, ShoppingList, Item, Draft, Invite
from firebase_admin import auth as firebase_auth
from .utils import update_and_delete_items, generate_random_otp, uuid_to_none

import traceback

from django.contrib.auth import get_user_model

User = get_user_model()


class MyTokenObtainPairView(TokenObtainPairView):

    serializer_class = api_serializer.MyTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        email = request.data.get('email')
        password = request.data.get('password')
        user = User.objects.filter(email=email).first()

        # Custom message on a wrong password because on default it returned 'no active account' msg
        if user:
            if not user.check_password(password):
                raise AuthenticationFailed("Incorrect password")

        return super().post(request, *args, **kwargs)



class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = api_serializer.RegisterSerializer

class GoogleLoginView(APIView):
    def post(self, request):
        id_token = request.data.get('idToken')
        language = request.data.get('language')

        if not language:
            language = "pl"

        if not id_token:
            return Response({'error': 'ID token is required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            decoded_token = firebase_auth.verify_id_token(id_token)
            email = decoded_token.get('email', '')
            name = decoded_token.get('name', '')

            user, created = User.objects.get_or_create(
                email=email, 
                account_auth_type='google',
                defaults={'username': email, 'first_name': name, 'language': language})
            
            if created:
                user.set_unusable_password()
                user.save()

            refresh = RefreshToken.for_user(user)
            refresh.payload['language'] = user.language
            refresh.payload['username'] = user.username
            refresh.payload['email'] = user.email

            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            })

        except Exception as e:
            traceback.print_exc()
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class LogoutAPIView(APIView):
    permission_classes= [IsAuthenticated]

    def post(self, request):
        request.user.fcm_token = None
        request.user.save()
        return Response({"message": "Successfully logged out"}, status=status.HTTP_200_OK)


class PasswordResetEmailVerifyAPIView(APIView):
    permission_classes = [AllowAny]
    serializer_class = api_serializer.UserSerializer

    @method_decorator(ratelimit(key='post:email', rate='1/3m', method='POST', block=True))
    def post(self, request):
        email = request.data.get('email')
        user = User.objects.filter(email=email).first()

        if not user:
            return Response({"message": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
        if user.account_auth_type == 'google':
            return Response({"message": "Cannot reset password for google account login"}, status=status.HTTP_400_BAD_REQUEST)
        
        uuidb64 = urlsafe_base64_encode(force_bytes(user.pk))
        user.otp = generate_random_otp()
        user.save()



        link = f"https://kupmleko.pythonanywhere.com/api/user/reset-password/?otp={user.otp}&uuidb64={uuidb64}"
        
        email_data = {
            "link": link,
            "username": user.username
        }

        template = "email/password_reset_eng.html" if user.language == "en" else "email/password_reset_pl.html"

        subject = "Password Reset for KupMleko account" if user.language == "en" else "Reset hasła w serwisie KupMleko"
        html_body = render_to_string(template, email_data)


        message = Mail(
            from_email='damiankonin@gmail.com',
            to_emails=email,
            subject=subject,
            html_content=html_body
        )

        try:
            sg = SendGridAPIClient(settings.SENDGRID_API_KEY)
            response = sg.send(message)
            print(f"SendGrid response: {response.status_code}")
            return Response({"message": "Password reset email sent successfully"}, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"SendGrid error: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


    

class PasswordChangeAPIView(APIView):
    permission_classes = [AllowAny]
    serializer_class = api_serializer.UserSerializer

    def get(self, request, *args, **kwargs):
        otp = request.GET.get('otp')
        uuidb64 = request.GET.get('uuidb64')
        if not otp or not uuidb64:
            return render(request, 'kupmleko/password_reset_form_pl.html', 
                {"message": "Niepoprawny lub nieaktywny link\nInvalid or inactive link"})

        decoded_uuidb64 = int(force_str(urlsafe_base64_decode(uuidb64)))
        user = User.objects.filter(id=decoded_uuidb64, otp=otp).first()
        
        if not user or user.otp != otp:
            return render(request, 'kupmleko/password_reset_form_pl.html', 
                {"message": "Niepoprawny lub nieaktywny link\nInvalid or inactive link"})
        
        if user.language == "en":
            return render(request, 'kupmleko/password_reset_form_eng.html', {'otp': otp, 'uuidb64': uuidb64})
        elif user.language == "pl":
            return render(request, 'kupmleko/password_reset_form_pl.html', {'otp': otp, 'uuidb64': uuidb64})

    def post(self, request, *args, **kwargs):
        otp = request.data['otp']
        uuidb64 = request.data['uuidb64']
        password = request.data['password']
        confirm_password = request.data['confirm_password']

        decoded_uuidb64 = int(force_str(urlsafe_base64_decode(uuidb64)))
        user = User.objects.filter(id=decoded_uuidb64, otp=otp).first()

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
        message = "Password Changed Successfully" if user.language == 'en' else "Hasło zostało zmienione"
        return Response({"message": message}, status = status.HTTP_200_OK)


class ShoppingListAPIView(APIView):
    serializer_class = api_serializer.ShoppingListSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, id=None, *args, **kwargs):

        if id:
            shopping_list = get_object_or_404(ShoppingList.objects.prefetch_related('items'), id=id)
            serializer = self.serializer_class(shopping_list)
            return Response(serializer.data)

        queryset = ShoppingList.objects.filter(users=request.user, archived=False).prefetch_related('items')
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)
    
    def delete(self, request, id, *args, **kwargs):
        '''
        Deleting a shopping list actually means to put it in archive but only 10 objects
        are kept there, so the 11th object is deleted
        '''
        shopping_list = get_object_or_404(ShoppingList.objects.prefetch_related('items'), id=id)
        shopping_list.archived = True
        shopping_list.archived_timestamp = timezone.now()
        shopping_list._acting_user = request.user # attribute for signal notification
        shopping_list.save()

        if len(ShoppingList.objects.filter(users=request.user, archived=True)) > 10:
            archived_to_be_removed = ShoppingList.objects.filter(users=request.user, archived=True).prefetch_related('items').order_by('id')[0]
            update_and_delete_items(archived_to_be_removed)
            archived_to_be_removed.delete()
        return Response({"message": "Shopping list archived successfully"}, status=status.HTTP_202_ACCEPTED) 

    def post(self, request, *args, **kwargs):
        data = uuid_to_none(request.data)
        serializer = self.serializer_class(data=data, context={'created_by': request.user})
        
        if serializer.is_valid():
            serializer.save()               
            return Response({"message": "Shopping list addedd successfully"}, status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def put(self, request, id, *args, **kwargs):
        shopping_list = get_object_or_404(ShoppingList.objects.prefetch_related('items'), id=id)
        data = uuid_to_none(request.data)
        serializer = self.serializer_class(shopping_list, data=data)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Shopping list changed successfully"}, status=status.HTTP_202_ACCEPTED)
        else:
            print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DraftAPIView(APIView):
    serializer_class = api_serializer.DraftSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request, id=None, *args, **kwargs):
        if id:
            draft = get_object_or_404(Draft.objects.prefetch_related('items'), id=id, user=request.user)
            serializer = self.serializer_class(draft)
            return Response(serializer.data)
        
        queryset = Draft.objects.filter(user=request.user).prefetch_related('items')
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)
    
    def delete(self, request, id, *args, **kwargs):
        draft = get_object_or_404(Draft.objects.prefetch_related('items'), id=id)
        update_and_delete_items(draft)
        draft.delete()
        return Response({"message": "Draft list deleted successfully"}, status=status.HTTP_202_ACCEPTED) 

    def post(self, request, *args, **kwargs):
        data = uuid_to_none(request.data)
        serializer = self.serializer_class(data=data, context={'user': request.user})
        
        if serializer.is_valid():
            serializer.save()
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        if request.data.get('activeAndDraft'):
            serializer = api_serializer.ShoppingListSerializer(data=data, context={'created_by': request.user})
            if serializer.is_valid():
                serializer.save()
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        return Response({"message": "Draft addedd successfully"}, status=status.HTTP_201_CREATED)
    
    def put(self, request, id, *args, **kwargs):
        draft = get_object_or_404(Draft.objects.prefetch_related('items'), id=id, user=request.user)
        data = uuid_to_none(request.data)
        serializer = self.serializer_class(draft, data=data)
        if serializer.is_valid():
            serializer.save()
        else:
            print(serializer.errors)
        return Response({"message": "Draft edited successfully"}, status=status.HTTP_202_ACCEPTED)

class DraftActivateAPIView(APIView):
    serializer_class = api_serializer.DraftSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        id = request.data.get('id')
        draft = get_object_or_404(Draft.objects.prefetch_related('items'), id=id, user=request.user)
        serializer = self.serializer_class(draft).data
        new_shopping_list = ShoppingList.objects.create(name=serializer.get('name'), created_by=request.user)
        new_shopping_list.users.add(request.user)

        items = [int(x['id']) for x in serializer.get('items')]
        items = Item.objects.filter(id__in=items)

        create_items = []
        for item in items:
            # Creating new Item instead of adding shoppinglist to existing Item, in case of activating 1 draft multiple times
            create_items.append(Item(name=item.name, amount=item.amount, shopping_list=new_shopping_list))
        Item.objects.bulk_create(create_items)

        friends = request.user.friends.all()
        for friend in friends:
            new_shopping_list.users.add(friend)

        return Response({"message": "Draft activated successfully"}, status=status.HTTP_202_ACCEPTED)

class HistoryAPIView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = api_serializer.ShoppingListSerializer
    
    def get(self, request, *args, **kwargs):
        queryset = ShoppingList.objects.filter(users=request.user, archived=True).prefetch_related('items').order_by('-archived_timestamp')
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)
    
class ItemAPIView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = api_serializer.ItemSerializer

    def put(self, request, id, *args, **kwargs):
        item = get_object_or_404(Item, id=id)
        bought = request.data.get('bought')
        item.bought = bought
        item.save()
        serializer = self.serializer_class(item)
        return Response(serializer.data, status=status.HTTP_200_OK)

class FriendsAPIView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = api_serializer.UserSerializer

    def get(self, request, *args, **kwargs):
        queryset = User.objects.filter(friends=request.user)
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)
    
    def post(self, request, *args, **kwargs):
        user = request.user

        new_friend = request.data["email"]
        new_friend = User.objects.get(email=new_friend)
        if new_friend in user.friends.all():
            return Response({"message": "Already a friend"}, status=status.HTTP_409_CONFLICT)
        user.friends.add(new_friend)

        for shopping_list in user.lists.all():
            shopping_list.users.add(new_friend)

        for shopping_list in new_friend.lists.all():
            shopping_list.users.add(user)
            
        return Response({"message": "New friend added successfully"}, status=status.HTTP_200_OK)
    
    def delete(self, request, id, *args, **kwargs):
        if not id:
            return Response({"error": "Friend ID is required"}, status=400)
        try:
            remove_user = User.objects.get(pk=id)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)
        
        user = request.user
        if user.remove_friend(remove_user):
            return Response({"message": "Friend removed successfully"}, status=200)
        return Response({"error": "User is not your friend"}, status=400)

    
class InviteAPIView(APIView):

    permission_classes = [IsAuthenticated]
    serializer_class = api_serializer.InviteSerializer

    def get(self,request, *args, **kwargs):
        queryset = Invite.objects.filter(to_user=request.user)
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

    def post(self, request, *args, **kwargs): 
        email = request.data.get('email')
        if not email:
            return Response({"error": "Email is required"}, status=400)
        user = get_object_or_404(User, email=email.strip())

        if user == request.user:
            return Response({"error": "Cannot invite yourself"}, status=status.HTTP_409_CONFLICT)
        
        if Invite.objects.filter(from_user=request.user, to_user=user).exists():
                    return Response({"error": "Invite already sent"}, status=status.HTTP_409_CONFLICT)
        if request.user in user.friends.all():
            return Response({"error": "Already a friend"}, status=status.HTTP_409_CONFLICT)

        Invite.objects.create(from_user=request.user, to_user=user)
        return Response({"message": "Invite sent!"}, status=201)
    
    def delete(self, request, id, *args, **kwargs):
        try:
            invite = Invite.objects.get(id=id, to_user=request.user)
        except Invite.DoesNotExist:
            return Response({"error": "Invite not found"}, status=404)

        invite.delete()
        return Response({"message": "Friend request rejected!"}, status=200)
    
class AcceptInviteAPIView(APIView):
    
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        invite_id = request.data.get('id')
        if not invite_id:
            return Response({"error": "Invite ID is required"}, status=400)
        try:
            invite = Invite.objects.get(id=invite_id, to_user=request.user)
        except Invite.DoesNotExist:
            return Response({"error": "Invite not found"}, status=404)
        
        user = request.user
        if invite.from_user in user.friends.all():
            return Response({"error": "Already a friend"}, status=status.HTTP_409_CONFLICT)
        
        invite.accept()

        return Response({"message": "Friend request accepted!"}, status=200)
    
class UpdateFCMTokenView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        token = request.data.get('fcm_token')
        if not token:
            return Response({'error': 'No token provided'}, status=400)

        request.user.fcm_token = token
        request.user.save()
        return Response({'status': 'FCM token updated'})
    
class UserAPIView(APIView):
    permission_classes = [IsAuthenticated]
    serializer_class = api_serializer.UserSerializer

    def get(self, request):
        serializer = self.serializer_class(request.user)
        return Response(serializer.data)

    def put(self, request, *args, **kwargs):
        user = request.user
        serializer = self.serializer_class(user, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User updated'}, status=200)
        else:
            print(serializer.errors())
            return Response({'error': 'Invalid data'}, status=400)