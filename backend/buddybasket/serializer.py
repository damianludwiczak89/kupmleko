from rest_framework import serializers
from .models import User, List

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = '__all__'

class ListSerializer(serializers.ModelSerializer):

    class Meta:
        model = List
        fields = '__all__'