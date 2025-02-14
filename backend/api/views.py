from django.shortcuts import render
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import UserSubmissionSerializer
from .models import UserSubmision

class UserSubmissionViewSet(viewsets.ModelViewSet):
    queryset = UserSubmision.objects.all()
    serializer_class = UserSubmissionSerializer


