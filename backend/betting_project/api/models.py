# models.py in your Django app

from re import T
from django.conf import settings
from django.db import models
from enum import Enum
from django.core.validators import MinValueValidator
from django.utils import timezone




from api.validators.bet_validators import team_choice_validator, bet_type_validator

class UserType(Enum):
    ADMIN = "admin"
    NORMAL = "normal"


# Group Model
class Group(models.Model):
    """
    Represents a group which can organize events and have members.
    """
    name = models.CharField(
        max_length=20, 
        unique=True, 
        null=False,
        help_text="The name of the group. Must be unique."
    )
    
    location = models.CharField(
        max_length=32, 
        null=False,
        help_text="The location associated with the group."
    )
    
    description = models.TextField(
        null=False,
        help_text="A detailed description of the group and its purpose."
    )
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="created_groups",
        on_delete=models.SET_NULL,
        null=True,
        related_query_name="created_group",
        help_text="The user who created the group. Can be null if the creator is no longer a member."
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # METHODS     
    # def save(self, *args, **kwargs):
    #     # Capitalie the name before saving
    #     self.name = self.name.title()
    #     super(Group, self).save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} - {self.location}"

    class Meta:
        verbose_name = "Group"
        verbose_name_plural = "Groups"

class Event(models.Model):
    """
    Represents an event organized by a group, involving two teams.
    """
    team1 = models.CharField(
        max_length=32,
        null=False,
        help_text="The name of the first team participating in the event."
    )
    
    team2 = models.CharField(
        max_length=32,
        null=False,
        help_text="The name of the second team participating in the event."
    )
    team1_score = models.IntegerField(
        null=True,
        blank=True,
        help_text="The final score for team 1. Can be left blank initially."
    )
    
    team2_score = models.IntegerField(
        null=True,
        blank=True,
        help_text="The final score for team 2. Can be left blank initially."
    )
    
    start_time = models.DateTimeField(
        help_text="The scheduled start time of the event."
    )
    
    end_time = models.DateTimeField(
        default=timezone.now,
        help_text="The scheduled end time of the event."
    )
    
    is_complete = models.BooleanField(
        default=False,
        help_text="Indicates whether the event has been completed."
    )
    
    organizer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="organized_events",
        on_delete=models.SET_NULL,
        null=True,
        related_query_name="organized_event",
        help_text="The user who is organizing the event. Can be null if the organizer is no longer a member."
    )
    
    group = models.ForeignKey(
        Group,
        related_name="events",
        on_delete=models.CASCADE,
        related_query_name="event",
        help_text="The group under which this event is organized."
    )
    
    participants = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name="attended_events",
        blank=True,
        related_query_name="attended_event",
        help_text="The users who are participating in the event."
    )
    
    is_archived = models.BooleanField(
        default=False,
        help_text="Indicates whether the event is archived.")
    
    # METHODS
        # METHODS     
    def save(self, *args, **kwargs):
        # Capitalie the name before saving
        self.team1 = self.team1.title()
        self.team2 = self.team2.title()
        super(Event, self).save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.team1} vs {self.team2} at {self.start_time.strftime('%Y-%m-%d %H:%M')}"

class Member(models.Model):
    """
    Represents a member of a group, which can have different roles such as 'admin' or 'normal'.
    """
    group = models.ForeignKey(
        Group,
        on_delete=models.CASCADE,
        related_name="members",
        help_text="The group to which the member belongs."
    )
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="member_of",
        on_delete=models.CASCADE,
        related_query_name="membership",
        help_text="The user who is a member of the group."
    )
    
    admin = models.CharField(
        max_length=10,
        choices=[(tag.value, tag.name) for tag in UserType],
        default=UserType.NORMAL.value,
        help_text="The role of the member within the group. Defaults to 'normal'."
    )
    
    joined_at = models.DateTimeField(auto_now_add=True,)

    # METHODS
    def __str__(self):
        return (
            f"{self.user.username} in {self.group.name} as {self.get_admin_display()}"
        )
        
    class Meta:
        unique_together = ("user", "group")
        ordering = ["joined_at"]



class Bet(models.Model):
    """
    
    Represents a bet made by a user on a particular event.

    Attributes:
        user (settings.AUTH_USER_MODEL): The user who made the bet. 
            Related to the AUTH_USER_MODEL setting, which should be a custom user model.
        event (Event): The event on which the bet is placed.
        team1_score (int): The predicted score for team 1. This field is optional.
        team2_score (int): The predicted score for team 2. This field is optional.
        points (int): The number of points wagered on the bet. Defaults to 0 if not specified.
        created_at (datetime): The date and time when the bet was created. Automatically set to now when the bet is first created.
        updated_at (datetime): The date and time when the bet was last updated. Automatically updated to now every time the bet is saved.
        status (str): The status of the bet, which can be 'Pending', 'Won', or 'Lost'. Defaults to 'Pending'.

    Example:
        # Example of creating a new bet:
        new_bet = Bet(
            user=user_instance,
            event=event_instance,
            team1_score=2,
            team2_score=1,
            points=50,
            status='Pending'
        )
        new_bet.save()

    Note:
        The `unique_together` meta option ensures that a user can only have one bet per event.
        The `ordering` option ensures that queries for bets will return the newest first.
    """   
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="user_bets",
        on_delete=models.CASCADE,
        help_text="The user who made the bet."
    )
    
    event = models.ForeignKey(
        Event, 
        related_name="bets",
        on_delete=models.CASCADE,
        help_text="The event on which the bet is placed."
    )
    
    team1_score = models.IntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(0)],
        help_text="The predicted score for team 1. Optional."
    )
    
    team2_score = models.IntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(0)],
        help_text="The predicted score for team 2. Optional."
    )
    
    team_choice = models.CharField(
        max_length=15,
        # choices=[("Team 1", "Team 1"), ("Team 2", "Team 2")], 
        default="",
        # validators=[team_choice_validator],
        help_text="Select the team you want to bet on"
    )
    
    BET_TYPE_CHOICES = [
        ("Win", "Win"),
        ("Lose", "Lose"),
    ]
    bet_type = models.CharField(
        max_length=4,
        choices=BET_TYPE_CHOICES,
        default="",
        validators=[bet_type_validator],
        help_text="Select the bet type ('Win' or 'Lose')"
    )
    
    bet_amount = models.IntegerField(
        default=0,
        null=True,
        blank=True,
        validators=[MinValueValidator(0)],
        help_text="The amount wagered on the bet. Defaults to 0."
    )
    
    created_at = models.DateTimeField(
        auto_now_add=True,
    )
    
    updated_at = models.DateTimeField(
        auto_now=True,
    )
    
    status = models.CharField(
        max_length=10,
        choices=[("Pending", "Pending"), ("WON", "Won"), ("LOST", "Lost")],
        default="PENDING",
    )
    
    @property
    def team1(self):
        return self.event.team1
    
    @property
    def team2(self):
        return self.event.team2
    
    #METHODS
    def __str__(self):
        return f"{self.user.username}'s bet on {self.event.team1} vs {self.event.team2} - Status: {self.status}"
    
    class Meta:
        unique_together = ("user", "event")
        # index_together = ("user", "event") # no longer necesary since django v1.11
        ordering = ["-created_at"]  # newest bets first
    