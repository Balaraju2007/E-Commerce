from rest_framework import serializers
from .models import *

# class UserSubmissionSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = UserSubmision
#         fields = '__all__'  # Includes `id`, `username`, `password`, and `submitted_at`

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = '__all__'  # Return all fields in API response
        read_only_fields = ['order_id', 'order_date']

class BookSerializer(serializers.ModelSerializer):
    class Meta:
        model = BookDetails
        fields = '__all__'  # Return all fields in API response
        read_only_fields = ['book_id']

