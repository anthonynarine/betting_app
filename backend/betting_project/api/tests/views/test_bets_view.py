from decimal import Decimal
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from api.models import Bet, Group, Event
from api.serializer import BetSerializer
from users.models import CustomUser
from django.utils import timezone
from datetime import timedelta
import logging

# Command for running tests

# Run All test in this module
# python manage.py test api.tests.views.test_bets_view

# Run idividual test
# python manage.py test api.tests.views.test_bets_view.BetViewsetTestCase.test_create_bet_with_sufficient_funds
# python manage.py test api.tests.views.test_bets_view.BetViewsetTestCase.test_create_bet_with_insufficient_funds

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class BetViewsetTestCase(TestCase):
    
    RED = '\033[91m'
    GREEN = '\033[92m'
    END = '\033[0m'
    
    def setUp(self):
        # Set up data for the tests
        self.client = APIClient()
        
        # Create a test group
        self.group = Group.objects.create(
            name="Klutch Sports"
        )
        
        # Create a test organizer user - test user created below can also be used.
        self.organizer = CustomUser.objects.create(
            username="rich_paul",
            email="organizer@gmail.com"),
        
        # Create test users 
        self.user_with_funds = CustomUser.objects.create_user(
            username ="the_goat",
            email="raymone_james@aol.com",
            password="testpassword623",
            available_funds=100.00
        )
        self.user_without_funds = CustomUser.objects.create(
            username ="black_manba",
            email="bean_bryant@netzero.com",
            password="testpassword824",
            available_funds=0.00,   
        )
        # Create a test event
        self.event = Event.objects.create(
            group=self.group,
            # orgainzer=self.test_user_1
            organizer=self.user_with_funds,
            team2 = "jorgambler",
            start_time = timezone.now() + timedelta(hours=1),
            end_time = timezone.now() + timedelta(hours=3),
        )
        # URL for create a bet
        self.create_bet_url = reverse("bet-list")
        
    def test_create_bet_with_sufficient_funds(self):
        logger.info(f"{self.GREEN}Running test_create_bet_with_sufficient_funds {self.END}")
        # Log in as a user with funds
        self.client.force_authenticate(user=self.user_with_funds)
        
        # Define bet Data
        bet_data = {
            "event": self.event.id,
            "bet_amount": "50.00",
            "team_choice": "team1",
            "bet_type": "Win",
        }
        # Make the request to create a bet
        response = self.client.post(self.create_bet_url, bet_data, format="json")
        print(response.data)
        # Check if the bet was created Successfully
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        print(response.data)  # For debugging
        self.assertEqual(Bet.objects.count(), 1)
        
        self.user_with_funds.refresh_from_db()
        self.assertEqual(self.user_with_funds.available_funds, Decimal("50.00"))  
        
    def test_create_bet_with_insufficient_funds(self):
        logger.info(f"{self.GREEN}Running test_create_bet_with_sufficient_funds {self.END}") 
        # Log in as user without funds
        self.client.force_authenticate(user=self.user_without_funds)
        
        self.user_without_funds.refresh_from_db()
        self.assertEqual(self.user_without_funds.available_funds, Decimal(0.00))
        
        # Define bet data
        bet_data = {
            "event": self.event.id,
            "bet_amount": "50.00",
            "team_choice": "team1",
            "bet_type": "Win",
        }
        # Make the request to create a bet
        response = self.client.post(self.create_bet_url, bet_data, format="json")
        
        # Check if the correct error is teturned for the insufficient funds
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        print(response.data)  # For debugging
        self.assertIn("Insufficient funds", str(response.data))
        
        