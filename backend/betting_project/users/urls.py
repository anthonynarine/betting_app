from users import views
from rest_framework import routers
from django.urls import path, include
from django.conf import urls
from .views import UserSignupView, UserViewSet, StripeConfigView, CreateChargeView


router = routers.DefaultRouter()
router.register("users", views.UserViewSet)



urlpatterns = [
    path("", include(router.urls)),
    path("signup/", UserSignupView.as_view(), name="signup"),
    #Stripe 
    path("stripe/config/", StripeConfigView.as_view(), name="stripe-config"),
    path("stripe/charge/", CreateChargeView.as_view(), name="stripe-charge")
]