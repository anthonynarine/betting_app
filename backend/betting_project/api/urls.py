from api import views
from rest_framework import routers
from django.urls import path, include
from django.conf import urls


router = routers.DefaultRouter()
router.register("groups", views.GroupViewset)
router.register("events", views.EventViewset)
router.register("members", views.MemberViewSet)


urlpatterns = [
    path("", include(router.urls)),
]