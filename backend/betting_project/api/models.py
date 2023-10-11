from django.conf import settings
from django.db import models

class Group(models.Model):
    name = models.CharField(max_length=32, unique=True)
    location = models.CharField(max_length=32)
    description = models.CharField(max_length=256)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    members = models.ManyToManyField(settings.AUTH_USER_MODEL, through='Member', related_name='groups')

    def __str__(self):
        return f"{self.name} - {self.location}"


class Event(models.Model):
    team1 = models.CharField(max_length=32)
    team2 = models.CharField(max_length=32)
    time = models.DateTimeField()
    team1_score = models.IntegerField(null=True, blank=True) 
    team2_score = models.IntegerField(null=True, blank=True)  
    group = models.ForeignKey(Group, related_name="events", on_delete=models.CASCADE)
    participants = models.ManyToManyField(
       settings.AUTH_USER_MODEL, related_name="attended_events", blank=True
    )

    def __str__(self):
        return f"{self.team1} - {self.team2}"


class Member(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    group = models.ForeignKey(Group, on_delete=models.CASCADE)
    admin = models.BooleanField(default=False)  
    joined_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user', 'group')
        ordering = ['joined_at']

    def __str__(self):
        return f"{self.user.username} in {self.group.name}"

    
    
    
    

# CustomUser:
# - Attends -> Many Events (Event's attendees field)
# - Is part of -> Many Groups (if you decide to add this relationship)

# Group:
#     - Hosts -> Many Events (Event's group field)

# Event:
#     - Is attended by -> Many CustomUsers (attendees field)
#     - Is hosted by -> One Group (group field)
