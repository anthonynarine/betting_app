

# TO RUN THESE TESTS
# python manage.py test api.tests.views.test_mark_as_complete

import imp
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from api.models import Event, Group
from users.models import CustomUser
from users.serializer import UserSerializer
from django.utils import timezone
from datetime import timedelta

# TO RUN THESE TESTS
# python manage.py test api.tests.views.test_mark_as_complete

class EventCompleteTest(APITestCase):
    def setUp(self):
        # User data needed to create a user instance
        user_data = {  
            "username": "anto",
            "email": "followtherabbit@aol.com",
            "password": "bluepill123",
            "password2": "bluepill123",
        }

        # Make a POST request to create a user
        url = reverse('signup')
        response = self.client.post(url, user_data, format="json")

        # Assertions for user Creations
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIsNotNone(CustomUser.objects.get(username="anto"))


    def test_create_group(self):
        # create a user instance using the create user method
        self.test_create_user()
        user = CustomUser.objects.get(username="anto")

        # Authenticate as the user
        self.client.force_authenticarte(user=user)

        # Create a group data dictionary
        group_data = {
            "name": "The Unplugged",
            "location": "Earth",
            "description": "The red pill will set you free"
        }
        
        # Make a POST request to create a group
        url = reverse("group-list")
        response = self.client.post(url, group_data, format="json")
        
        # Assertion for group creation
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIsNotNone(Group.objects.get(name="The Unplugged"))


    def test_create_event(self):
        # Create an event
        event_data = {
            "group": self.group.id,
            "team1": "Lakers",
            "team2": "Pistons",
            "start_time": timezone.now(),
            "end_time": timezone.now() + timedelta(hours=2),
            "organizer": self.user.id
        }

        # Authenticate as the user
        self.client.force_authenticate(user=self.user)

        # set the URL for creating an event
        url = reverse("event-list")

        # Make the POST request to create the event
        response = self.client.post(url, event_data, format="json")

        # Assertions
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
    def test_complete_event_by_organizer(self):
        # Authenticate as the organizer
        self.client.force_authenticate(user=self.user)
        # Set the URL for the 'complete event' action
        url = reverse('event-complete-event', kwargs={'pk': self.event.pk})
        
        # Make the POST request to complete the event
        response = self.client.post(url)
        
        # Fetch the updated event
        self.event.refresh_from_db()
        
        # Assertions
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(self.event.is_complete)
        
    def test_complete_event_unauthorized(self):
        # Create a different user (not the organizer)
        different_user_data = {
            "username": "Smith",
            "email": "AgentSmith@aol.com",
            "password": "matrix123",
            "password2": "matrix123",
        }
        different_user_serializer = UserSerializer(data=different_user_data)
        if different_user_serializer.is_valid():
            different_user_serializer.save()
            different_user = different_user_serializer.instance
            
        # Authenticate as the different user
        self.client.force_authenticate(user=different_user)
        
        # Set the URL for the 'complete event' action
        url = reverse('event-complete-event', kwargs={'pk': self.event.pk})
        
        # Make the POST request to complete the event
        response = self.client.post(url)
        
        # Assertions
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertFalse(self.event.is_complete)