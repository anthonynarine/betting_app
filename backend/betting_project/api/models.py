# models.py in your Django app

from django.conf import settings
from django.db import models
from enum import Enum

class UserType(Enum):
    ADMIN = "admin"
    NORMAL = "normal"

# Group Model
class Group(models.Model):
    # Basic Info
    name = models.CharField(max_length=32, unique=True, null=False)
    location = models.CharField(max_length=32, null=False)
    description = models.TextField(null=False)
    
    # Creator of the group
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='created_groups', on_delete=models.SET_NULL, null=True, related_query_name='created_group')
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = "Group"
        verbose_name_plural = "Groups"


    def __str__(self):
        return f"{self.name} - {self.location}"

# Event Model
class Event(models.Model):
    # Team Info
    team1 = models.CharField(max_length=32, null=False)
    team2 = models.CharField(max_length=32, null=False)
    team1_score = models.IntegerField(null=True, blank=True)
    team2_score = models.IntegerField(null=True, blank=True)
    
    # Event Time
    time = models.DateTimeField()
    
    # Organizer of the event
    organizer = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='organized_events', on_delete=models.SET_NULL, null=True, related_query_name='organized_event')
    
    # Relationships
    group = models.ForeignKey(Group, related_name="events", on_delete=models.CASCADE, related_query_name='event')
    participants = models.ManyToManyField(
        settings.AUTH_USER_MODEL, related_name="attended_events", blank=True, related_query_name='attended_event'
    )

    def __str__(self):
        return f"{self.team1} - {self.team2}"

# Member Model
class Member(models.Model):
    # Relationships and Role
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name="members")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="member_of", on_delete=models.CASCADE,  related_query_name='membership')
    admin = models.CharField(
        max_length=10, 
        choices=[(tag.value, tag.name) for tag in UserType], 
        default=UserType.NORMAL.value
    )
    
    # Timestamp
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "group")
        ordering = ["joined_at"]

    def __str__(self):
        return f"{self.user.username} in {self.group.name} as {self.get_admin_display()}"




