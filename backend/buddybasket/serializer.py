from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import Token
from django.contrib.auth.password_validation import validate_password
from .models import User, ShoppingList, Item, Draft, Invite, Category
from django.shortcuts import get_object_or_404

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

class CategorySerializer(serializers.ModelSerializer):

    items = ItemSerializer(many=True, required=False)

    class Meta:
        model = Category
        fields = '__all__'

    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        category = Category.objects.create(**validated_data)

        for item_data in items_data:
            Item.objects.create(category=category, **item_data)

        return category

class ShoppingListSerializer(serializers.ModelSerializer):

    items = ItemSerializer(many=True, required=False)
    categories = CategorySerializer(many=True, required=False)

    class Meta:
        model = ShoppingList
        fields = '__all__'
        read_only_fields = ['created_by', 'users', 'archived']

    def create(self, validated_data):
        items_data = validated_data.pop('items', [])
        categories_data = validated_data.pop('categories', [])
        created_by = self.context['created_by']

        shopping_list = ShoppingList.objects.create(**validated_data, created_by=created_by)
        shopping_list.users.add(created_by)

        
        friends = created_by.friends.all()
        for friend in friends:
            shopping_list.users.add(friend)

        
        for item_data in items_data:
            Item.objects.create(shopping_list=shopping_list, **item_data)

        
        for category_data in categories_data:
            category_data['shopping_list'] = shopping_list.id  # attach shopping list id
            category_serializer = CategorySerializer(data=category_data)
            if category_serializer.is_valid():
                category_serializer.save()
            else:
                print(category_serializer.errors)

        return shopping_list
    
    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.save()

        new_items_data = validated_data.pop('items', [])

        items_to_save = []
        items_to_delete = []

        for item in instance.items.all():
            item.shopping_list = None
            if item.draft or item.shopping_list:
                items_to_save.append(item)
            else:
                items_to_delete.append(item)

        if items_to_save:
            Item.objects.bulk_update(items_to_save, ['shopping_list'])

        if items_to_delete:
            Item.objects.filter(id__in=[item.id for item in items_to_delete]).delete()

        items_to_create = []
        # Create new items attached to shopping_list
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
    categories = CategorySerializer(many=True, required=False)

    class Meta:
        model = Draft
        fields = ['id', 'name', 'items', 'categories']


    
class InviteSerializer(serializers.ModelSerializer):

    from_user = UserSerializer(read_only=True)
    to_user = UserSerializer(read_only=True)

    class Meta:
        model = Invite
        fields = '__all__'