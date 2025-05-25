from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import Token
from django.contrib.auth.password_validation import validate_password
from .models import User, ShoppingList, Item, Draft, Invite
from .utils import update_and_delete_items

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token["username"] = user.username
        token["email"] = user.email
        token["language"] = user.language

        return token
    
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['email', 'password', 'password2', 'account_auth_type', 'language']

    def validate(self, attr):
        if attr['password'] != attr['password2']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        
        return attr
    
    def create(self, validated_data):
        user = User.objects.create(
            email=validated_data['email'],
            account_auth_type = 'email',
            language=validated_data['language'],
        )

        email_username, _ = user.email.split('@')
        user.username = email_username
        user.set_password(validated_data["password"])
        user.save()

        return user


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'language']


class ItemSerializer(serializers.ModelSerializer):

    class Meta:
        model = Item
        fields = '__all__'

class ShoppingListSerializer(serializers.ModelSerializer):

    items = ItemSerializer(many=True, required=False)
    archived_timestamp = serializers.DateTimeField(format="%Y-%m-%d %H:%M", required=False, allow_null=True)

    class Meta:
        model = ShoppingList
        fields = '__all__'
        read_only_fields = ['created_by', 'users', 'archived', 'archived_timestamp']

    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        created_by = self.context['created_by']

        shopping_list = ShoppingList.objects.create(**validated_data, created_by=created_by, archived_timestamp=None)
        shopping_list.users.add(created_by)
        
        friends = created_by.friends.all()
        for friend in friends:
            shopping_list.users.add(friend)

        create_items = []

        for item_data in items_data:
            create_items.append(Item(shopping_list=shopping_list, **item_data))

        Item.objects.bulk_create(create_items)

        return shopping_list
    
    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.save()
        update_and_delete_items(instance)

        # Create new items attached to shopping_list
        new_items_data = validated_data.pop('items', [])
        items_to_create = []
        for item_data in new_items_data:
            items_to_create.append(Item(
                name=item_data['name'],
                amount=item_data['amount'],
                bought=item_data['bought'],
                shopping_list=instance
            ))
        Item.objects.bulk_create(items_to_create)

        return instance

    
class DraftSerializer(serializers.ModelSerializer):

    items = ItemSerializer(many=True, required=False)

    class Meta:
        model = Draft
        fields = ['id', 'name', 'items']

    def create(self, validated_data):
        user = self.context['user']
        active = self.context['active']

        items_data = validated_data.pop('items', []) # in case of not providing items at all
        draft = Draft.objects.create(**validated_data, user=user)

        # create also a shopping list with same data if checkbox active was also checked
        if active:
            shopping_list = ShoppingList.objects.create(**validated_data, created_by=user)
            shopping_list.users.add(user)
        
        create_items = []
        for item_data in items_data:
            if active:
                create_items.append(Item(draft=draft, shopping_list = shopping_list, **item_data))
            else:
                create_items.append(Item(draft=draft, **item_data))

        Item.objects.bulk_create(create_items)

        return draft
    
    def update(self, instance, validated_data):
        instance.name = validated_data['name']
        instance.save()
        update_and_delete_items(instance)
        
        # Create new items attached to the draft
        new_items_data = validated_data.pop('items', [])
        items_to_create = []
        for item_data in new_items_data:
            items_to_create.append(Item(
                name=item_data['name'],
                amount=item_data['amount'],
                bought=item_data['bought'],
                draft=instance
            ))
        Item.objects.bulk_create(items_to_create)

        return instance
    
class InviteSerializer(serializers.ModelSerializer):

    from_user = UserSerializer(read_only=True)
    to_user = UserSerializer(read_only=True)

    class Meta:
        model = Invite
        fields = '__all__'