from rest_framework import serializers
from .models import UserSubmision

class UserSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSubmision
        fields = '__all__'  # Includes `id`, `username`, `password`, and `submitted_at`
