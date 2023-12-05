from api.views import bet_views, group_views, member_views, event_views
from rest_framework import routers
from django.urls import path, include
from django.conf import urls


router = routers.DefaultRouter()
router.register("groups", group_views.GroupViewset, basename="group")
router.register("events", event_views.EventViewset, basename="event")
router.register("members", member_views.MemberViewSet, basename="member")
router.register("bet", bet_views.BetViewset, basename="bet") 
# basename="bet" added to this route b/c a queryset was not explicitly set.  
# the get_queryset was overidden.


urlpatterns = [
    path("", include(router.urls)),
]



#  to view all URL patterns 
# from django.urls import get_resolver
# for url in get_resolver().url_patterns:
#     print(url)
