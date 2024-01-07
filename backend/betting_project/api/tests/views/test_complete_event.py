from rest_framework.test import APITestCase
from rest_framework import status
from django.urls import reverse
from api.models import Event, Bet, Group
from users.models import CustomUser
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta
import json
import logging




User = get_user_model()

# Commands to run test in terminal
# Run all test in module 
# python manage.py test api.tests.views.test_complete_event
# Run individual test
# python manage.py test api.tests.views.test_complete_event.EventViewSetTestCase.test_single_bettor_refund

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)
class EventViewSetTestCase(APITestCase):
    
    RED = '\033[91m'
    GREEN = '\033[92m'
    END = '\033[0m'
    
    @classmethod
    def setUpTestData(cls):
        """
        Sets up data used in all test methods. This includes creating a user,
        a group, and an event for testing purposes.
        """
        # Create a test user
        cls.user = CustomUser.objects.create_user(
            username="anto",
            email="followtherabbit@aol.com",
            password="bluepill123"
        )

        # Create a test group
        cls.group = Group.objects.create(
            name="Unplugged",
            location="Earth",
            description="The red pill will set you free"
        )

        # Create a test event
        cls.event = Event.objects.create(
            group=cls.group,
            team1="Lakers",
            team2="Pistons",
            start_time=timezone.now() + timedelta(hours=1),
            end_time=timezone.now() + timedelta(hours=3),
            organizer=cls.user
        )
    
    def test_single_bettor_refund(self):  # Scenario 1: Only 1 bettor in the event
        """
        Test scenario where there is only one bettor for an event.
        
        This test validates that if there's only one bettor in an event, 
        the are refunded their bet amount regardless of the outcome
        
        Steps:
        1. A bet is palce by a auth user for an event.
        2. The even is marked as complete.
        3. The response is checked to confirm that it indicats 
            a successfull completion and distribution of winnings.
        4. Assert that the response message includes information about 
            the completion and distribution of winnings
            
        Example:
        If a user bets $100 on a team and they are the only bettor for that event
        upon completing the event, their $100 should be refunded
        """
        # Log the start of the test
        logger.info(f"{self.GREEN}Running test_single_bettor_refund {self.END}")
        
        # Create a bet for the user on the event
        Bet.objects.create(event=self.event, user=self.user, bet_amount=100)
        
        # Authenticate as the user who created the event
        self.client.force_authenticate(user=self.user)
        
        # Define the URL for making the event as complete
        url = reverse("event-complete-event", args=[self.event.id])
        
        # Send a POST request to mark the event as complete
        response = self.client.post(url, {"winning_team": self.event.team1})
        
        # Assert that the response indicates a successful completion of the event
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Assert that the response contains the expected message indicating 
        # that the event is completed and winnings (refunds in this case) are distributed
        self.assertIn("Event completed and winnings distributed", response.data["details"])