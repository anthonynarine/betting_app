from api import views
from rest_framework import routers
from django.urls import path, include
from django.conf import urls

# Create a DefaultRouter instance
router = routers.DefaultRouter()

router.register(r"groups", views.GroupViewset)


urlpatterns = [
    path("", include(router.urls)),
]