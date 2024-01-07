from decimal import Decimal
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
# python manage.py test api.tests.views.test_complete_event.EventViewSetTestCase.test_all_bettors_refund

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)
class EventViewSetTestCase(APITestCase):
    
    RED = '\033[91m'
    GREEN = '\033[92m'
    END = '\033[0m'
    PINK = '\033[95m'  # Light pink color
    ORANGE = '\033[93m'  # Light orange/yellow color


    
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
            password="bluepill123",
            available_funds=100.00
        )
        
        cls.user2 = CustomUser.objects.create_user(
            username="piccolo",
            email="piccolo@namek.com",
            password="SpecialBeamCannon",
            available_funds=200.00
        )
        
        cls.user3 = CustomUser.objects.create_user(
            username="krillin",
            email="krillin@earth.com",
            password="DestructoDisc",
            available_funds=150.00
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
        
    def test_all_bettors_refund(self):
        """
        
        
        """
        logger.info(f"{self.GREEN}Running test_all_bettors_refund {self.END}")
        
        # Initial funds for each user
        initial_funds_user = Decimal("100.00")
        initial_funds_user2 = Decimal("200.00")
        initial_funds_user3 = Decimal("150.00")

        # Bet amounts
        bet_amount_user = Decimal("100.00")
        bet_amount_user2 = Decimal("50.00")
        bet_amount_user3 = Decimal("75.00")
        
        #Place bet for all users on the same team
        Bet.objects.create(event=self.event, user=self.user, bet_amount=bet_amount_user, team_choice=self.event.team1)
        Bet.objects.create(event=self.event, user=self.user2, bet_amount=bet_amount_user2, team_choice=self.event.team1)
        Bet.objects.create(event=self.event, user=self.user3, bet_amount=bet_amount_user3, team_choice=self.event.team1)

        # Perform the complete_event action
        self.client.force_authenticate(user=self.user)
        url = reverse("event-complete-event", args=[self.event.id])
        response = self.client.post(url, {"winning_team": self.event.team1})
        
        # Check response and assert that bets were refunded
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("Event completed and winnings distributed", response.data["details"])
        
        # Validate that all bettors received thier refunds
        self.user.refresh_from_db()
        self.user2.refresh_from_db()
        self.user3.refresh_from_db()
        
        # DEBUG
        logger.info(f"{self.PINK}User {self.user.username} refunded amount: {self.user.available_funds - 100}{self.END}")
        logger.info(f"{self.PINK}User {self.user2.username} refunded amount: {self.user2.available_funds - 200}{self.END}")
        logger.info(f"{self.PINK}User {self.user3.username} refunded amount: {self.user3.available_funds - 150}{self.END}")

        
        # Check if the available funds are equal to initial funds plus bet amount
        self.assertEqual(self.user.available_funds, initial_funds_user + bet_amount_user)
        self.assertEqual(self.user2.available_funds, initial_funds_user2 + bet_amount_user2)
        self.assertEqual(self.user3.available_funds, initial_funds_user3 + bet_amount_user3)
            