import time
from django.test import TestCase
from api.models import Bet, Event, Group
from django.contrib.auth import get_user_model

# running test in this module
# python manage.py test api.tests.models.test_bets

class BetModelTestCase(TestCase):
    def setUp(self):
        #set up data needed for test
        User = get_user_model() # get the user model
        self.user = User.objects.create(username="testuser")
        self.group = Group.objects.create(name="Test Group")
        self.event = Event.objects.create(
            team1="Team 1",
            team2="Team 2",
            team1_score=None,
            team2_score=None,
            time="2024-11-23 12:00",
            organizer=None,
            group=self.group,
            is_archived=False,
        )
        self.bet = Bet.objects.create(
            user=self.user,
            event=self.event,
            team_choice="Team 1",
            bet_type="Win",
            points=50
        )
        
    def test_bet_createion(self):
        # test if a Bet object was created successfully
        bet = Bet.objects.get(id=self.bet.id)
        self.assertEqual(bet.team_choice, "Team 1")
        self.assertEqual(bet.bet_type, "Win")
        self.assertEqual(bet.points, 50)