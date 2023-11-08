from api.views import bet_views, group_views, member_views, event_views
from rest_framework import routers
from django.urls import path, include
from django.conf import urls


router = routers.DefaultRouter()
router.register("groups", group_views.GroupViewset)
router.register("events", event_views.EventViewset)
router.register("members", member_views.MemberViewSet)
router.register("bets", bet_views.BetViewset, basename="bet") 
# basename="bet" added to this route b/c a queryset was not explicitly set.  
# the get_queryset was overidden.


urlpatterns = [
    path("", include(router.urls)),
]