from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(['POST'])
def hello(request):
    data = request.data  # DRF handles JSON parsing automatically
    username = data.get('name')
    password = data.get('pass')

    if not username or not password:
        return Response({"error": "Username and password are required"}, status=400)

    return Response({"message": "Data received", "username": username, "password": password})
