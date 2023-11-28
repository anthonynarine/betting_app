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
        
        # Use the serializer to create a user
        serializer = UserSerializer(data=user_data)
        if serializer.is_valid():
            serializer.save()
            
        # Retrieve the created user
        self.user = serializer.instance
        
        # Create a Group instance
        group = Group.objects.create(
            name="unplugged",
            location="earth",
            description="take the red pill",
            user=self.user, 
        )
        
        # Create an event
        self.event = Event.objects.create(
            group=group,
            team1="Lakers",
            team2="76ers",
            start_time=timezone.now(),
            end_time=timezone.now() + timedelta(hours=2),
            organizer=self.user,
        )
        
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

