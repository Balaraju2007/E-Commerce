from django.urls import path, include
from .views import hello
from .views import UserSubmissionViewSet
from rest_framework.routers import DefaultRouter
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView, SpectacularRedocView


router = DefaultRouter()
router.register(r'submissions', UserSubmissionViewSet, basename='submission')


urlpatterns = [
    path('hello/', hello, name='hello-api'),
    path('api/', include(router.urls)),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),  # Schema JSON
    path('api/swagger/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),  # Swagger UI
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),  # Redoc UI
]
