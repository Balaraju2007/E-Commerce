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