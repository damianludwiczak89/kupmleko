from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from django.contrib.auth.password_validation import validate_password
from .models import User, ShoppingList, Item, Draft, Invite

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
        fields = ['email','username', 'password', 'password2', 'account_auth_type', 'language']

    def validate(self, attr):
        if attr['password'] != attr['password2']:
            raise serializers.ValidationError({"password": "Passwords do not match."})
        
        return attr
    
    def create(self, validated_data):
        user = User.objects.create(
            email=validated_data['email'],
            account_auth_type = 'email',
            language=validated_data['language'],
            username = validated_data['username']
        )

        user.set_password(validated_data["password"])
        user.save()

        return user


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'language']


class ItemSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False, allow_null=True)
    class Meta:
        model = Item
        fields = '__all__'

class ShoppingListSerializer(serializers.ModelSerializer):

    items = ItemSerializer(many=True, required=False)
    archived_timestamp = serializers.DateTimeField(format="%Y-%m-%d %H:%M", required=False, allow_null=True)
    created_by = serializers.SlugRelatedField(read_only=True, slug_field='username')

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
            item_data.pop('shopping_list', None)
            create_items.append(Item(shopping_list=shopping_list, **item_data))

        Item.objects.bulk_create(create_items)

        return shopping_list
    
    def update(self, instance, validated_data):

        instance.name = validated_data.get('name', instance.name)
        instance.save()

        incoming_items = validated_data.pop('items', [])
        existing_items = {item.id: item for item in instance.items.all()}

        incoming_ids = set()
        items_to_create = []
        for item_data in incoming_items:
            item_id = item_data.get('id')
            try:
                item_id = int(item_id) if item_id is not None else None
            except (ValueError, TypeError):
                item_id = None

            if item_id and item_id in existing_items:
                item = existing_items[item_id]
                item.name = item_data.get('name', item.name)
                item.amount = item_data.get('amount', item.amount)
                item.save()
                incoming_ids.add(item_id)
            else:
                items_to_create.append(Item(
                    name=item_data['name'],
                    amount=item_data['amount'],
                    bought=item_data.get('bought', False),
                    shopping_list=instance
                ))


        to_delete = [item for item_id, item in existing_items.items() if item_id not in incoming_ids]
        for item in to_delete:
            item.delete()

        if items_to_create:
            Item.objects.bulk_create(items_to_create)

        return instance


    
class DraftSerializer(serializers.ModelSerializer):

    items = ItemSerializer(many=True, required=False)

    class Meta:
        model = Draft
        fields = ['id', 'name', 'items']

    def create(self, validated_data):
        user = self.context['user']

        items_data = validated_data.pop('items', []) # in case of not providing items at all
        draft = Draft.objects.create(**validated_data, user=user)
        
        create_items = []
        for item_data in items_data:
            create_items.append(Item(draft=draft, **item_data))

        Item.objects.bulk_create(create_items)

        return draft
    
    def update(self, instance, validated_data):

        instance.name = validated_data.get('name', instance.name)
        instance.save()

        incoming_items = validated_data.pop('items', [])
        existing_items = {item.id: item for item in instance.items.all()}

        incoming_ids = set()
        items_to_create = []

        for item_data in incoming_items:
            item_id = item_data.get('id')
            if item_id and item_id in existing_items:
                item = existing_items[item_id]
                item.name = item_data.get('name', item.name)
                item.amount = item_data.get('amount', item.amount)
                item.bought = item_data.get('bought', item.bought)
                item.save()
                incoming_ids.add(item_id)
            else:
                items_to_create.append(Item(
                    name=item_data['name'],
                    amount=item_data['amount'],
                    bought=item_data.get('bought', False),
                    draft=instance
                ))

        to_delete = [item for item_id, item in existing_items.items() if item_id not in incoming_ids]
        for item in to_delete:
            item.delete()

        if items_to_create:
            Item.objects.bulk_create(items_to_create)

        return instance
    
class InviteSerializer(serializers.ModelSerializer):

    from_user = UserSerializer(read_only=True)
    to_user = UserSerializer(read_only=True)

    class Meta:
        model = Invite
        fields = '__all__'