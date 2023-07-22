from api import views
from rest_framework import routers
from django.urls import path, include
from django.conf import urls

# Create a DefaultRouter instance
router = routers.DefaultRouter()

# Register the GroupViewset with the router for the "groups" URL
router.register(r"groups", views.GroupViewset)

# URL patterns for the API endpoints
urlpatterns = [
    # Include the URL patterns from the router
    path("", include(router.urls)),
]