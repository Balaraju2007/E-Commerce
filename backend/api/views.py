from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import *
from .models import *

# class UserSubmissionViewSet(viewsets.ModelViewSet):
#     queryset = UserSubmision.objects.all()
#     serializer_class = UserSubmissionSerializer

# class UserViewset(viewsets.ModelViewSet):
#     queryset = User.objects.all()
#     serializer_class = UserSerializer

# class OrdersViewset(viewsets.ModelViewSet):
#     queryset = Order.objects.all()
#     serializer_class = OrderSerializer
    
    
# class BooksViewset(viewsets.ModelViewSet):
#     queryset = BookDetails.objects.all()
#     serializer_class = BookSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class AuthorViewSet(viewsets.ModelViewSet):
    queryset = author.objects.all()
    serializer_class = AuthorSerializer


class PublisherViewSet(viewsets.ModelViewSet):
    queryset = publisher.objects.all()
    serializer_class = PublisherSerializer


class GenreViewSet(viewsets.ModelViewSet):
    queryset = genre.objects.all()
    serializer_class = GenreSerializer


class BookViewSet(viewsets.ModelViewSet):
    queryset = Book.objects.all()
    serializer_class = BookSerializer


class CartViewSet(viewsets.ModelViewSet):
    queryset = cart.objects.all()
    serializer_class = CartSerializer


class CartItemViewSet(viewsets.ModelViewSet):
    queryset = cart_items.objects.all()
    serializer_class = CartItemSerializer


class OrderViewSet(viewsets.ModelViewSet):
    queryset = orders.objects.all()
    serializer_class = OrderSerializer


class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = order_items.objects.all()
    serializer_class = OrderItemSerializer