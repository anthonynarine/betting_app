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
# python manage.py test api.tests.views.test_complete_event.EventViewSetTestCase.test_all_bettors_refund_winning_team
# python manage.py test api.tests.views.test_complete_event.EventViewSetTestCase.test_all_bettors_refund_losing_team
# python manage.py test api.tests.views.test_complete_event.EventViewSetTestCase.test_multiple_bettors_winnings_distribution

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
        
    def test_all_bettors_refund_winning_team(self):
        """
        Test scenario 2 where all bettor choose the winning team for an event.
        
        This test ensures that if all bettors bet on the wining team, the are refunded
        
        Steps:
        1. Mark the event as complete w/ the winning team being the one everyone bets on.
        2. Check the response to confirm successful completion and refund distribution.
        3. Assert that eaxh bettor's account is refunded w/ the bet amount
        
        Example:
        If 3 users bet $100, $50, and $75 respectively on the same team and team wins,
        they should all receive refunds of their bet amounts, regardless of the event outcome
        
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
        
        # Log the response data for debugging
        logger.info(f"Response data: {response.data}")
        
        # Extract and log the specific message if it exist in the response
        completion_message = response.data.get("details")
        if completion_message:
            logger.info(f"{self.PINK}Message details: {completion_message}{self.END}")
        
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
    
    def test_all_bettors_refund_losing_team(self):
        """
        Test scenario 3 where all bettor chose the losing team for an event. 
        
        This test ensures taht if all bettors bet on the losing team, th are refunced their bet amount
        The event is marked as complete with a different winning team than what the bettors chose
        
        Steps:
        1. Deduct the bet amount from teh initial funds of the users
        2. Place bet for users (2 in this test) on the team taht will be marked as losing. 
        3. Mark the event as complete with a different team as the winner.
        4. Check the response to confirm successful completion and refund distribution. 
        5. Assert that each bettors's account is refunded with the bet amount.
        
        Example:
        user1 and user2 bet $50 and $70 respectively on team2
        Event is marked as complete with Team1 as the winner.
        Both user1 and user2 should receive refunds of their bet amounts. 
        """
        
        logger.info(f"{self.GREEN}test_all_bettors_refund_losing_team{self.END}")
        
        # Define initial funds and bet amounts for both users
        initial_funds_user = Decimal("100.00")
        initial_funds_user2 = Decimal("200.00")
        bet_amount_user = Decimal("50.00")
        bet_amount_user2 = Decimal("70.00")

        # Deduct bet amounts from initial funds
        self.user.available_funds = initial_funds_user - bet_amount_user
        self.user.save()
        self.user2.available_funds = initial_funds_user2 - bet_amount_user2
        self.user2.save()

        # Users bet on TeamB, but TeamA will be marked as the winner
        Bet.objects.create(event=self.event, user=self.user, bet_amount=bet_amount_user, team_choice=self.event.team2)
        Bet.objects.create(event=self.event, user=self.user2, bet_amount=bet_amount_user2, team_choice=self.event.team2)

        # Perform the complete_event action
        self.client.force_authenticate(user=self.user)
        url = reverse("event-complete-event", args=[self.event.id])
        response = self.client.post(url, {"winning_team": self.event.team2})
        
        # Log the response data for debugging
        logger.info(f"Response data: {response.data}")
        
        # Extract and log the specific message if it exist in the response
        completion_message = response.data.get("details")
        if completion_message:
            logger.info(f"{self.PINK}Message details: {completion_message}{self.END}")
        
        # Check response and assert that bets were refunded
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("Event completed and winnings distributed", response.data["details"])

        # Refresh user data from database and validate refund
        self.user.refresh_from_db()
        self.user2.refresh_from_db()
        
        # Log the refunded amount for each user
        logger.info(f"{self.PINK}User {self.user.username} refunded amount: {self.user.available_funds - initial_funds_user + bet_amount_user}{self.END}")
        logger.info(f"{self.PINK}User {self.user2.username} refunded amount: {self.user2.available_funds - initial_funds_user2 + bet_amount_user2}{self.END}")

        self.assertEqual(self.user.available_funds, initial_funds_user)  # User's funds should be unchanged
        self.assertEqual(self.user2.available_funds, initial_funds_user2)  # User2's funds should be unchanged
        
    def test_multiple_bettors_winnings_distribution(self):
        """
        Test scenario where multiple bettors place bets on different teams, and winnings are distributed proportionally among the winners.

        This test ensures that when multiple users place bets on different teams, and one of the teams wins, the winnings are distributed proportionally among the bettors who chose the winning team.

        The test involves three users with distinct initial funds and bet amounts. Two of them bet on Team1 (winning team), and one bets on Team2 (losing team). After the event is marked as complete, the test verifies that the winners receive their proportional share of the total bet amount placed on the losing team.

        Steps:
        1. Place bets for all users on their chosen teams.
        2. Mark the event as complete with Team1 as the winning team.
        3. Check the response to confirm successful completion and distribution of winnings.
        4. Validate that the winning users' accounts are credited with their respective winnings.

        Example:
        User1 and User2 bet on Team1, and User3 bets on Team2. If Team1 wins, User1 and User2 share User3's bet amount proportionally based on their own bet amounts.
        """
        logger.info(f"{self.GREEN}Running test_multiple_bettors_winnings_distribution{self.END}")

        # Define initial funds and bet amounts
        initial_funds_user = Decimal("100.00")
        initial_funds_user2 = Decimal("200.00")
        initial_funds_user3 = Decimal("400.00")
        bet_amount_user = Decimal("50.00")  # Betting on Team1 will win
        bet_amount_user2 = Decimal("70.00")  # Betting on Team1 will win
        bet_amount_user3 = Decimal("250")   # Betting on Team2 will lose

        # Users place their bets
        Bet.objects.create(event=self.event, user=self.user, bet_amount=bet_amount_user, team_choice=self.event.team1)
        Bet.objects.create(event=self.event, user=self.user2, bet_amount=bet_amount_user2, team_choice=self.event.team1)
        Bet.objects.create(event=self.event, user=self.user3, bet_amount=bet_amount_user3, team_choice=self.event.team2)

        # Authenticate as the event organizer and mark the event as complete
        self.client.force_authenticate(user=self.user)
        url = reverse("event-complete-event", args=[self.event.id])
        response = self.client.post(url, {"winning_team": self.event.team1})

        # Log the response data for debugging
        logger.info(f"Response data: {response.data}")
        
        # Extract and log the specific message if it exist in the response
        completion_message = response.data.get("details")
        if completion_message:
            logger.info(f"{self.PINK}Message details: {completion_message}{self.END}")

        # Validate the response
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("Event completed and winnings distributed", response.data["details"])

        # Refresh the user data from the database
        self.user.refresh_from_db()
        self.user2.refresh_from_db()
        self.user3.refresh_from_db()

        # Calculate expected winnings
        """  
        Details of Expected Winnings Calculation:
        - Initial Funds: Starting amount in each user's account before the bet.
        - Bet Amount: Amount each user has bet on their chosen team.
        - Total Bet on Winning Team: Combined bet amount of users who bet on the winning team.
        - Bet Amount by Losing Team Bettor: Amount bet by the user who chose the losing team, forming the winnings pool.
        - Calculation for Winners: Proportional distribution of the losing bettor's amount based on each winner's bet proportion.
        """
        total_bet_on_winning_team = bet_amount_user + bet_amount_user2
        expected_winnings_user = initial_funds_user + (bet_amount_user / total_bet_on_winning_team) * bet_amount_user3
        expected_winnings_user2 = initial_funds_user2 + (bet_amount_user2 / total_bet_on_winning_team) * bet_amount_user3
        expected_winnings_user3 = initial_funds_user3 - bet_amount_user3  # User3 loses the bet

        # Validate the winnings distribution and log
        self.assertAlmostEqual(self.user.available_funds, expected_winnings_user, places=2)
        self.assertAlmostEqual(self.user2.available_funds, expected_winnings_user2, places=2)
        self.assertEqual(self.user3.available_funds, expected_winnings_user3)

        # Log the winnings for each user
        logger.info(f"{self.PINK}User {self.user.username} winning amount: {self.user.available_funds - initial_funds_user}{self.END}")
        logger.info(f"{self.PINK}User {self.user2.username} winning amount: {self.user2.available_funds - initial_funds_user2}{self.END}")
        logger.info(f"{self.PINK}User {self.user3.username} winning amount: {self.user3.available_funds - initial_funds_user3}{self.END}")
                