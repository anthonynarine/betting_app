from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from api.models import Event, Bet
from users.models import CustomUser
from django.contrib.auth import get_user_model
import json

User = get_user_model()

# running test in this module
# python manage.py test api.tests.views.test_complete_event


class EventViewSetTest(APITestCase):
    
    def test_single_bettor_refund(self):
        # Setup = create user, event, and single bet
        user = User.objects.create_user(email="gohan@capsulecorp.com", password="GohanBeast")
        event = Event.objects.create(team1="Gohan", team2="Cell")
        Bet.objects.create(event=event, user=user, bet_amount=100)
        
        #Perform the complete_event action
        self.client.login(username="gohan", password="pan")
        url = reverse("mark-as-complete", args=[event.id])
        response = self.client.post(url, {"Winning_team": "Gohan"})
        
        #check that the response indicates a refund
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("refund", response.data["details"])