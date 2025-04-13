from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import Token
from django.contrib.auth.password_validation import validate_password
from .models import User, ShoppingList, Item, Draft, Invite

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token["username"] = user.username
        token["email"] = user.email

        return token
    
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['email', 'password', 'password2']

    def validate(self, attr):
        if attr['password'] != attr['password2']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        
        return attr
    
    def create(self, validated_data):
        user = User.objects.create(
            email=validated_data['email']
        )

        email_username, _ = user.email.split('@')
        user.username = email_username
        user.set_password(validated_data["password"])
        user.save()

        return user


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['id', 'email', 'username']


class ItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = Item
        fields = '__all__'

class ShoppingListSerializer(serializers.ModelSerializer):

    items = ItemSerializer(many=True, required=False)

    class Meta:
        model = ShoppingList
        fields = '__all__'
        read_only_fields = ['created_by', 'users', 'archived'] 

    
class DraftSerializer(serializers.ModelSerializer):

    items = ItemSerializer(many=True, required=False)

    class Meta:
        model = Draft
        fields = ['id', 'name', 'items']


    
class InviteSerializer(serializers.ModelSerializer):

    from_user = UserSerializer(read_only=True)
    to_user = UserSerializer(read_only=True)

    class Meta:
        model = Invite
        fields = '__all__'