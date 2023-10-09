from django.db import models






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


class Event(models.Model):
    team1 = models.CharField(max_length=32, blank=False)
    team2 = models.CharField(max_length=32, blank=False)
    time = models.DateTimeField(null=False, blank=False)
    score1 = models.IntegerField(null=True, blank=True)
    score2 = models.IntegerField(null=True, blank=True)
    group = models.ForeignKey(Group, related_name="events", on_delete=models.CASCADE)
    participants = models.ManyToManyField(
       "users.CustomUser", related_name="attended_events", blank=True
    )

    def __str__(self):
        return f"{self.team1} - {self.team2}"


# CustomUser:
# - Attends -> Many Events (Event's attendees field)
# - Is part of -> Many Groups (if you decide to add this relationship)

# Group:
#     - Hosts -> Many Events (Event's group field)

# Event:
#     - Is attended by -> Many CustomUsers (attendees field)
#     - Is hosted by -> One Group (group field)
