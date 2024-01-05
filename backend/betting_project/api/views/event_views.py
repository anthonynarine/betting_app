from django.utils import timezone
from ..models import Event, Bet
from ..serializer import EventSerializer
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.exceptions import ValidationError
from django.db import models

# Rest of your code...

class EventViewset(viewsets.ModelViewSet):
    """
    API endpoint that allows events to be viewed or edited.
    """

    queryset = Event.objects.all()
    serializer_class = EventSerializer

    def get_queryset(self):
        queryset = Event.objects.all()
        if self.request.user.is_authenticated:
            queryset = queryset.filter(organizer=self.request.user)
        return super().get_queryset()

    def create(self, request, *args, **kwargs):
        print("Received data for Event creation:", request.data)
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        event = self.get_object()
        if request.user != event.organizer:
            raise PermissionDenied

        # Check if the event has already started
        if timezone.now() >= event.start_time:
            raise ValidationError(
                {"detail": "Cannot update the event after it has started"}
            )

        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        event = self.get_object()
        if request.user != event.organizer:
            raise PermissionDenied

        current_time = timezone.now()

        # Check if the event is either upcoming or has already ended
        if not (current_time < event.start_time or current_time > event.end_time):
            raise ValidationError(
                {"detail": "Cannot delete the event after it has started"}
            )

        return super().destroy(request, *args, **kwargs)

    @action(
        detail=True,
        methods=["post"],
        url_path="mark-as-complete",
        permission_classes=[IsAuthenticated],
    )

    def is_authorized_user(self, user, event):
        """
        Check if the user is authorized to complete the event. 
        """


    def complete_event(self, request, pk=None):
        """
        Marks an event as complete, determines the winning team based on request data,
        and calculates and distributes winnings to the users who bet on the winning team.

        Parameters:
            request (HttpRequest): The HTTP request object containing request data.
            pk (int, optional): The primary key of the event to be marked as complete.

        Returns:
            Response: A Response object with details about the completion of the event
                      and the distribution of winnings, or an error message and status code.
        """

        # Retrieve the specific Event instance based on the primary key (pk) provided in the URL.
        event = self.get_object()

        # Check if the request user is the event organizer. Only the organizer can complete the event.
        if request.user != event.organizer:
            return Response(
                {"details": "You did not create this event"},
                status=status.HTTP_403_FORBIDDEN,
            )

        # Retrieve the winning team name from the request data.
        winning_team_name = request.data.get("winning_team")

        # Validate the winning team name against the event's teams.
        if winning_team_name == event.team1:
            winning_team = event.team1
        elif winning_team_name == event.team2:
            winning_team = event.team2
        else:
            return Response(
                {"details": "Invalid Winning Team"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        
        # Aggregate the total bet amount for this event.
        total_bet_amount = Bet.objects.filter(event=event).aggregate(models.Sum("bet_amount"))["bet_amount__sum"]

        # Initialize dictionaries to store the winnings and bet percentage for each user.
        winnings = {}
        bet_percentage = {}

        # Calculate the percentage of each bet relative to the total bet amount.
        bets = Bet.objects.filter(event=event)
        for bet in bets:
            if bet.team_choice == winning_team:
                percentage = (bet.bet_amount / total_bet_amount) * 100
                bet_percentage[bet.user] = percentage
                winnings[bet.user] = (bet.bet_amount / total_bet_amount) * 100

        # Distribute the winnings to each user based on their bet percentage.
        for user, percentage in bet_percentage.items():
            user_winnings = (percentage / 100) * winnings[user]
            user.available_funds += user_winnings
            user.save()

        # Mark the event as complete and save the event.
        event.is_complete = True
        event.save()

        # Return a successful response indicating event completion and winnings distribution.
        return Response(
            {
                "details": "Event completed and winnings distributed",
                "winning_team": winning_team,
            },
            status=status.HTTP_200_OK,
        )



