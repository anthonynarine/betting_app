from users import views
from rest_framework import routers
from django.urls import path, include
from django.conf import urls


router = routers.DefaultRouter()
router.register("users", views.UserViewSet)



urlpatterns = [
    path("", include(router.urls)),
]