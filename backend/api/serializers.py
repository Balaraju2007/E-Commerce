from rest_framework import serializers
from .models import *

# # class UserSubmissionSerializer(serializers.ModelSerializer):
# #     class Meta:
# #         model = UserSubmision
# #         fields = '__all__'  # Includes `id`, `username`, `password`, and `submitted_at`

# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = User
#         fields = '__all__'

# class OrderSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Order
#         fields = '__all__'  # Return all fields in API response
#         read_only_fields = ['order_id', 'order_date']

# class BookSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = BookDetails
#         fields = '__all__'  # Return all fields in API response
#         read_only_fields = ['book_id']


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = author
        fields = '__all__'


class PublisherSerializer(serializers.ModelSerializer):
    class Meta:
        model = publisher
        fields = '__all__'


class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = genre
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
        read_only_fields = ['user_id', 'is_active', 'is_staff', 'is_superuser', 'last_login', 'date_joined', 'groups', 'user_permissions', 'password']


class BookSerializer(serializers.ModelSerializer):
    seller_name = UserSerializer(read_only=True)
    author_id = AuthorSerializer(read_only=True)
    publisher_id = PublisherSerializer(read_only=True)
    genre_id = GenreSerializer(read_only=True)

    class Meta:
        model = Book
        fields = '__all__'


class CartSerializer(serializers.ModelSerializer):
    user_id = UserSerializer(read_only=True)
    
    class Meta:
        model = cart
        fields = '__all__'


class CartItemSerializer(serializers.ModelSerializer):
    cart_id = CartSerializer(read_only=True)
    book_id = BookSerializer(read_only=True)

    class Meta:
        model = cart_items
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
    user_id = UserSerializer(read_only=True)

    class Meta:
        model = orders
        fields = '__all__'


class OrderItemSerializer(serializers.ModelSerializer):
    order_id = OrderSerializer(read_only=True)
    book_id = BookSerializer(read_only=True)

    class Meta:
        model = order_items
        fields = '__all__'