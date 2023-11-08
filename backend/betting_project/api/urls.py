from api import views, views_bet
from rest_framework import routers
from django.urls import path, include
from django.conf import urls


router = routers.DefaultRouter()
router.register("groups", views.GroupViewset)
router.register("events", views.EventViewset)
router.register("members", views.MemberViewSet)
router.register("bets", views_bet.BetViewset, basename="bet") 
# basename="bet" added to this route b/c a queryset was not explicitly set.  
# the get_queryset was overidden.


urlpatterns = [
    path("", include(router.urls)),
]