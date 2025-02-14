from django.urls import path, include
from .views import hello
from .views import UserSubmissionViewSet
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r'submissions', UserSubmissionViewSet, basename='submission')


urlpatterns = [
    path('hello/', hello, name='hello-api'),
    path('api/', include(router.urls)),
]