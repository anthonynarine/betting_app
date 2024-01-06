from django.utils import timezone
from  validators.bet_validators import bet_type_validator
from ..models import Event, Bet
from ..serializer import EventSerializer
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.exceptions import ValidationError
from django.db import models
from django.db.models import F, Sum
from django.db import transaction
from django.contrib.auth import get_user_model
import logging

logger = logging.getLogger(__name__)

CustomUser = get_user_model()


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
        logger.info("Received data for Event creation: %s", request.data)

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
        logger.info(
            "Event with ID %s updated by user %s", event.id, request.user.username
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
        logger.info(
            "Event with ID %s deleted by user %s", event.id, request.user.username
        )
        return super().destroy(request, *args, **kwargs)

    @action(
        detail=True,
        methods=["post"],
        url_path="mark-as-complete",
        permission_classes=[IsAuthenticated],
    )
    def complete_event(self, request, pk=None):
        """
        Custom action to mark an event as complet. Steps below:
        - User authentication check
        - Winning team validation
        - Calculation of the total bet amount
        - Marking the event as complete in the database
        """
        
        # Retrieve the event based on the pk from the URL
        event = self.get_object()
        
        # Step 1: Check if the user is authorized to complete the event
        if not self.is_authorized_user(request.user, event):
            return Response(
                {"details": "You did not create this event"},
                status=status.HTTP_403_FORBIDDEN,
            )
        # Step 2: Validate the winning team
        winning_team = self.validate_winning_team(request, event)
        if not winning_team:
            return Response(
                {"details": "Invalid Winning Team"}, status=status.HTTP_400_BAD_REQUEST
            )
        # Step 3: Calculate the total bet amount
        total_bet_amount = self._calculate_total_bet_amount(event)
        if total_bet_amount == 0:
            return Response(
                {"details": "No bets were placed on this event"},
                status=status.HTTP_404_NOT_FOUND,
            )
        # Step 4: Calculate and distribute winnings
        # Example: if total_bet_amount is $1000 and a user bet $100 on the winning team
        # their winning_info entry should look like {"username": "Julia Narine "winning_amount": $100}
        winning_info = self._calculate_and_distribute_winnings(
            event, winning_team, total_bet_amount
        )

        event.is_complete = True
        event.save()

        logger.info(
            "Event with ID %s marked as complete by user %s",
            event.id,
            request.user.username,
        )
        return Response(
            {
                "details": "Event completed and winnings distributed",
                "winning_team": winning_team,
                "winning_info": winning_info,
            },
            status=status.HTTP_200_OK,
        )

    # Helper methods for complete_event

    def is_authorized_user(self, user, event):
        """
        Check if the user is authorized to complete the event.
        """
        return user == event.organizer

    def validate_winning_team(self, request, event):
        """
        Use the request data to validate the winning team
        """
        winning_team_name = request.data.get("winning_team")
        if winning_team_name in [event.team1, event.team2]:
            return winning_team_name
        return None

    def _calculate_total_bet_amount(self, event):
        return Bet.objects.filter(event=event).aggregate(Sum("bet_amount"))[
            "bet_amount__sum"
        ]

    @transaction.atomic
    def _calculate_and_distribute_winnings(self, event, winning_team, total_bet_amount):
        """
        Calculate and distribute winnigns based on the bets place on an event. 
        Handles several senaris:
        1. If only 1 person bets. the are refunded regardless of the outcome
        2. If all bettors select the winning team, their bets are refunded.
        3. If there are multiple bets and 1 person wins, they win a proportion of of the total bet amount.
        4. If more than one person wins, each winner gets a proportion of the total pool based on their bet. 
        
        Args:
            event (Event): The event for which to calculate and distribute winnings.
            winning_team (str): The team that won the event.
            total_bet_amount (Decimal): The total amount bet on the event. 
            
        Returns:
            list: A list of dicts w/ each winner's username and their winning amount. 
        """
        try:
            # Retrieve all bets placed on the event and those placed on the winning team
            all_bets = Bet.objects.filter(event=event)
            
            # Retrieve bets placed on the winning team
            winning_bets = Bet.objects.filter(event=event, team_choice=winning_team)
            
            # Count the total number of bettors and the number who bet on the winning team
            total_bettors = all_bets.count()
            winning_bettors = winning_bets.count()
            
            # Calculate the total amount bet on the winning team.
            winning_bet_total = winning_bets.aggregate(Sum("bet_amount"))["bet_amount__sum"] or 0
            
            # Scenario 1: Only 1 bettor in the event
            # Example: If there's only 1 bettor who bets $100, refund this amount
            if total_bettors == 1:
                for bet in all_bets:
                    CustomUser.objects.filter(pk=bet.user.pk).update(
                        available_funds=F("available_funds") + bet.bet_amount
                    )
                logger.info(f"Revunded bet for the only bettor in {event.team1} vs {event.team2}")
                return []
        
            # Scenario 2:  All bettors chose the winning team
            # Example: If there are 3 bettors and they all bet on the winning team, refund their bets
            if winning_bettors == total_bettors:
                for bet in all_bets:
                    CustomUser.objects.filter(pk=bet.user.pk).update(
                        available_funds=F("available_funds") + bet.bet_amount
                    )
            logger.info(f"All bets refunded for {event.team1} vs {event.team2} as all bets were placed on the winner")
            
            # Scenario 3: No bettors chose the winning team
            if winning_bettors == 0:
                for bet in all_bets:
                    CustomUser.objects.filter(pk=bet.user.pk).update(
                        available_funds=F("available_funds") + bet.bet_amount
                    )
                logger.info(f"All bets refunded for {event.team1} vs {event.team2} as no bet was placed on the winning team")
                return []  
            
            # Scenario 4: Multiple bettors, distribute winnings based on bet proportion. 
            else:
                winning_info =[]
                # The pool for distribution is total bet amount - the amount on the winning team  
                losing_bet_total = total_bet_amount - winning_bet_total
                for bet in winning_bets:
                    # Calculate each winner's share of the losing bet total
                    user_share = (bet.bet_amount / winning_bet_total) * losing_bet_total
                    # Update the winner's account with their share of winnings. 
                    CustomUser.objects.filter(pk=bet.user.pk).update(
                        available_funds=F("available_funds") + user_share
                    )
                    # Add the winner's information to the rewaponse data. 
                    winning_info.append({"username": bet.user.username, "winning_amount": user_share })
                return winning_info
        except Exception as e:
            logger.error(
                "Error in calculating and distributing winnings for event ID %s: %s",
                event.id,
                e,
            )
            raise
