from django.db import models
from django.forms import CharField


class Group(models.Model):
    name = models.CharField(max_length=32, null=False, unique=False)
    location = models.CharField(max_length=32, null=False)
    description = models.CharField(max_length=256, null=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        unique_together = ("name", "location")
    
    
    def __str__(self):
        return f"{self.name} - {self.location}"
    
class Events(models.Model):
    team1 = models.CharField(CharField(max_length=32, blank=False))
    team2 = models.CharField(CharField(max_length=32, blank=False))
    time = models.DateTimeField(null=False, blank=False)
    score1 = models.IntegerField(null=True, blank=True)
    score2 = models.IntegerField(null=True, blank=True)
    group = models.ForeignKey(Group, related_name="events")
