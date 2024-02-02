# models.py in your Django app
from django.db import models
from django.db.models import Count
from decimal import Decimal
from django.conf import settings
from django.db import models
from enum import Enum
from django.core.validators import MinValueValidator
from django.shortcuts import get_object_or_404
from django.utils import timezone
from validators.bet_validators import bet_type_validator
from validators.img_validators import validate_icon_image_size, validate_image_file_extension


def banner_image_upload_path(instance, filename):
    return f"group/{instance.id}/banner_image/{filename}"

def default_banner_image():
    return "/default/tenkaichi.gif"

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
    
    banner_image = models.ImageField(
        upload_to=banner_image_upload_path,
        null=True,
        blank=True,
        validators=[validate_image_file_extension],
        default=default_banner_image,
        help_text="The image for the group card"
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
    
    #METHODS     
    def save(self, *args, **kwargs):
        """
        Overrides the default save method of the Django model the Group inherits from.
        Method performs additional operations before saving 
        """
        
        # Check if this is an existing instance in the DB.
        # self.id indicates the instace is being Updated NOT Created.
        if self.id:
            # Fetch the existing instance from the db or 404 not found
            group_instance = get_object_or_404(Group, id=self.id)
            # check if the "banner_image" field has been updated
            # this is done by comparing the current img to the one tn the db
            if group_instance.banner_image != self.banner_image:
                # If the image has changed delete the old image from the files
                group_instance.banner_image.delete(save=False)       
        # Capitalie the name before saving
        self.name = self.name.title()
        # Call the parent class's save method.
        # This ensures that the base model's save logic is executed,
        # which includes actually saving the instance to the database.
        super(Group, self).save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} - {self.location}"

    class Meta:
        verbose_name = "Group"
        verbose_name_plural = "Groups"

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

class EventManager(models.Manager):
    def order_by_participants(self):
        return self.get_queryset().annotate(
            num_participants=Count("bets__user", distinct=True)
        ).order_by("-num_participants")

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
        
    is_archived = models.BooleanField(
        default=False,
        help_text="Indicates whether the event is archived.")
    
    def calculate_potential_winnings(self):
        """
            Calculates the potential winnings for each participant's bet based on 
            the current betting pool. This method is used to provide an estimate 
            of what participants might win, based on the bets currently placed on 
            each team.

            Calculation Steps:
            1. Sum the total bet amount for each team.
            2. For each bet, calculate the proportion of that bet in its team's total bet amount.
            3. Use this proportion to determine the potential share of the opposite team's total bets.
            
            Returns:
                A list of dictionaries, each containing:
                - 'user': Username of the participant.
                - 'bet_amount': The amount bet by the participant.
                - 'team_choice': The team chosen by the participant. (actual team name the event was created with not the db will store Team 1 or Team2
                - 'potential_winning': The estimated winning amount for the participant.
                - 'total_winnable_pool': The total pool of bets that can be won.

        Note: This is an estimation and the actual winnings might differ based 
            on the event's final outcome.

            Example:
                Let's say we have an event with two teams: Team A and Team B.
                - Total bets on Team A: $1000
                - Total bets on Team B: $800
                - Participant X bets $100 on Team A.

                The potential winning for Participant X is calculated as follows:
                - Participant X's share of bets on Team A: $100 / $1000 = 10%
                - If Team A wins, Participant X is entitled to 10% of Team B's total bets.
                - Potential winning = 10% of $800 = $80
                - Total Winnable Pool = $800 (Total bets on Team B)
        """     
        # Initialize the bets collections by retrieving all related to this event.
        bets = self.bets.all()

        #initialize a dictionary to track the total bet amount for each team
        total_bet_amount = {"Team 1": Decimal("0"), "Team 2": Decimal("0")}
        
        #loop over each bet and add the bet amount to the correspoing team's total 
        for bet in bets:
            total_bet_amount[bet.team_choice] += bet.bet_amount
        
        #initialize a list to store potential winnings
        potential_winnings = []
        participants = set() # initialize set for number of unique participants
        for bet in bets:
            participants.add(bet.user.username)
            if total_bet_amount[bet.team_choice] > 0:
                # Calculate the total that can be won from the opposite team's bet pool.
                winnable_amount = (total_bet_amount["Team 1"] + total_bet_amount["Team 2"] - total_bet_amount[bet.team_choice])
                
                # Calculate the proportion of the bet in relation to the total bets placed on the chosen team.
                winning_ratio = bet.bet_amount / total_bet_amount[bet.team_choice]
                potential_winning = winning_ratio * winnable_amount
            
            if bet.team_choice == "Team 1":
                team_name = bet.event.team1
            elif bet.team_choice == "Team 2":
                team_name = bet.event.team2
            else:
                team_name = "Unknown Team"
                
                # Append the calculated data to the potential_winnings list
            potential_winnings.append({  # Correct usage of append
                'user': bet.user.username,
                'bet_amount': bet.bet_amount,
                'team_choice': team_name,
                'potential_winning': potential_winning,
                'total_winnable_pool': winnable_amount
            })
        
        return {
            "participants_info": potential_winnings,
            "total_participants": len(participants) # total # of participants
        }
    def save(self, *args, **kwargs):
        # Capitalie the name before saving
        self.team1 = self.team1.title()
        self.team2 = self.team2.title()
        super(Event, self).save(*args, **kwargs)
    
    def __str__(self):
        return f"{self.team1} vs {self.team2} at {self.start_time.strftime('%Y-%m-%d %H:%M')}"

class Participant(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="event_participants")
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="event_participantions")
    bet = models.OneToOneField('Bet', on_delete=models.CASCADE, related_name="participants", null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} participating in {self.event}"
    class Meta:
        unique_together = ('event', 'user')
    
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
    
    bet_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=("0.00"),
        null=True,
        blank=True,
        validators=[MinValueValidator(Decimal("0.00"))],
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
    
    def save(self, *args, **kwargs):
        """
        Overrides the save method to create or update a Participant instance
        when a bet is placed. This links the bet to the event and the user.
        
        - If the bet is newly created, it either creates a new Participant instance
        or updates an existing one with the new bet.
        - If the bet is being updated (not newly created), it ensures the Participant
        instance is linked to this bet.
        """
        # Check if this is a new bet or an update
        created = self._state.adding

        # Save the bet first to ensure it has an ID (important for new bets)
        super(Bet, self).save(*args, **kwargs)

        # Handle the creation or update of the Participant instance
        if created:
            # Attempt to get an existing Participant, or create a new one if it doesn't exist
            participant, participant_created = Participant.objects.get_or_create(
                event=self.event,
                user=self.user,
                defaults={"bet": self}
            )
            # If a Participant already existed, update it with this bet
            if not participant_created:
                participant.bet = self
                participant.save()

    def delete(self, *args, **kwargs):
        """
        Override the delete method to remove the user from the event's participants when their bet is deleted 
        """
        # Check if there's an associated participant record
        participant = Participant.objects.filter(event=self.event, user=self.user).first()
        if participant:
            # If the participant's bet is the one being deleted, remove the participant
            if participant.bet == self:
                participant.delete()
        super(Bet, self).delete(*args, **kwargs)
    
    def __str__(self): 
        return f"{self.user.username}'s bet on {self.event.team1} vs {self.event.team2} - Status: {self.status}"

    
    class Meta:
        unique_together = ("user", "event")
        # index_together = ("user", "event") # no longer necesary since django v1.11
        ordering = ["-created_at"]  # newest bets first
    