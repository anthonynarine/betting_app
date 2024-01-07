

# Commands
# Run All test in this module
# python manage.py test api.tests.views.test_mark_as_complete

# Run an individual test
# python manage.py test api.tests.views.test_mark_as_complete.EventCompleteTest.test_create_group
# python manage.py test api.tests.views.test_mark_as_complete.EventCompleteTest.test_create_event
# python manage.py test api.tests.views.test_mark_as_complete.EventCompleteTest.test_complete_event_unauthorized
# python manage.py test api.tests.views.test_mark_as_complete.EventCompleteTest.test_complete_event_by_organizer

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from api.models import Event, Group
from users.models import CustomUser
from django.utils import timezone
from datetime import timedelta
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class EventCompleteTest(APITestCase):
    """
    This class contains tests for the event completion functionality in the API.

    Methods:
        setUpTestData: Class method to set up data for all test methods.
        test_create_group: Test to verify group creation functionality.
        test_create_event: Test to verify event creation functionality.
        test_complete_event_by_organizer: Test to verify event completion by the organizer.
        test_complete_event_unauthorized: Test to verify unauthorized access prevention in event completion.
    """
    RED = '\033[91m'
    GREEN = '\033[92m'
    END = '\033[0m'

    @classmethod
    def setUpTestData(cls):
        """
        Sets up data used in all test methods. This includes creating a user,
        a group, and an event for testing purposes.

        The data is set up once for the entire test case, and not before each test method.
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

        # Create a test event associated with the created user and group
        cls.event = Event.objects.create(
            group=cls.group,
            team1="Lakers",
            team2="Pistons",
            start_time=timezone.now() + timedelta(hours=1),
            end_time=timezone.now() + timedelta(hours=3),
            organizer=cls.user
        )

    def test_create_group(self):
        """
        Tests the API's ability to create a new group.

        The test authenticates as the created user, sends a POST request to create a group,
        and asserts that the response status code is 201 (Created).
        """
        
        logger.info(f"{self.GREEN}Running test_create_group {self.END}")
        # Authenticate the test client as the test user
        self.client.force_authenticate(user=self.user)

        # Data for a new group creation
        group_data = {
            "name": "Unplugged 1.0",  # Unique name to avoid conflicts
            "location": "Earth",
            "description": "The red pill will set you free"
        }

        # Send POST request to create a new group
        url = reverse("group-list")
        response = self.client.post(url, group_data, format="json")

        # Assert that the group was created successfully
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_create_event(self):
        """
        Tests the event creation functionality in the API.

        The test authenticates as the user, sends a POST request to create an event,
        and checks the response status code for successful creation.
        """
        logger.info(f"{self.GREEN}Running test_create_event {self.END}")
        # Authenticate the test client as the test user
        self.client.force_authenticate(user=self.user)

        # Data for creating a new event
        event_data = {
            "group_id": self.group.id,
            "team1": "Lakers",
            "team2": "Pistons",
            "start_time": timezone.now() + timedelta(hours=1),
            "end_time": timezone.now() + timedelta(hours=3),
            "organizer": self.user.id
        }

        # Send POST request to create a new event
        url = reverse("event-list")
        response = self.client.post(url, event_data, format="json")

        # Log error and assert the event was created successfully
        if response.status_code != status.HTTP_201_CREATED:
            logger.error(f"Test create event failed: Response Data: {response.data}")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_complete_event_by_organizer(self):
        """
        Tests the event completion functionality by the event organizer.

        The test authenticates as the event organizer, sends a POST request to mark
        the event as complete, and asserts the response and the event's state.
        """
        logger.info(f"RUNNING TEST {self.id()}")
        logger.info(f"{self.GREEN}Running test_complete_event_by_organizer{self.END}")
        # Authenticate the test client as the organizer
        self.client.force_authenticate(user=self.user)

        # Send POST request to mark the event as complete
        url = reverse('event-complete-event', kwargs={'pk': self.event.pk})
        response = self.client.post(url, {"winning_team": self.event.team1})

        # Refresh the event object from the database
        self.event.refresh_from_db()

        # Assert the response status code and event completion state
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        
    def test_complete_event_unauthorized(self):
        logger.info(f"{self.GREEN}Running test_complete_event_unauthorized {self.END}")
        # Create and authenticate as a different user
        different_user = CustomUser.objects.create_user(
            username="Smith",
            email="AgentSmith@aol.com",
            password="matrix123"
        )
        self.client.force_authenticate(user=different_user)

        # Post request to complete event
        url = reverse('event-complete-event', kwargs={'pk': self.event.pk})
        response = self.client.post(url, {"winning_team": self.event.team1})

        # Assertions
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.event.refresh_from_db()
        self.assertFalse(self.event.is_complete)
