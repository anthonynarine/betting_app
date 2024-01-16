from decimal import Decimal
from MySQLdb import DatabaseError
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

        # Color for logger debugger
    YELLOW = '\033[93m'  # ANSI escape code for bright yellow text
    HEADER = '\033[95m'
    BLUE = '\033[94m'
    RED = '\033[91m'
    GREEN = '\033[92m'
    END = '\033[0m'
    
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
        
        # Step 4: Calculate and distribute winnings based on the event outcome
        self._update_bet_status(event, winning_team)

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
        
    def _update_bet_status(self, event, winning_team):
        """
        Updates the status of each bet based on the outcome of the event.
        Sets the status to 'Won' if the bet was on the winning team, otherwise 'Lost'.
        """
        all_bets = Bet.objects.filter(event=event)
        for bet in all_bets:
            if bet.team_choice == winning_team:
                bet.status = "Won" 
            else:
                bet.status = "Lost" 
            bet.save()  

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
            
        logger.info(f"{self.GREEN}Starting calculation and distribution of the winnings for event {event.id}{self.END}")
        
        total_bet_amount = Decimal(total_bet_amount)
        all_bets = Bet.objects.filter(event=event)
        
        for bet in all_bets:
            bet.bet_amount = Decimal(bet.bet_amount)
        
        winning_bets = all_bets.filter(team_choice=winning_team)
        total_bettors = all_bets.count()
        winning_bettors = winning_bets.count()
        
        # Scenario 1: Only 1 bettor in the event
        if total_bettors == 1:
            logger.info(f"{self.YELLOW} Only 1 bet placed for {event.id}, a refund will be distributed{self.END}")
            return self._refund_bets(all_bets)
        
        # Scenario 2: No bettors chose the winning team
        elif winning_bettors == 0:
            logger.info(f"{self.YELLOW}No winning bets for event {event.id}, all bets refunded{self.END}")
            return self._refund_bets(all_bets)
        
        # Scenario 3: All bettors chose the winning team
        elif winning_bettors == total_bettors:
            logger.info(f"{self.YELLOW}All bets were winning for event {event.id} all bets refunded{self.END}")
            return self._refund_bets(all_bets)
        
        # Scenario 4: Multiple bettors, distribute winnings based on bet proportion
        else:
            logger.info(f"{self.YELLOW} One more winning bets for event {event.id}, distributing winnings{self.END}")
            return self._distribute_winnings(winning_bets, total_bet_amount)
    
    # HELPER METHODS
    def _refund_bets(self, bets):
        refunded_bets = []
        for bet in bets:
            try:
                CustomUser.objects.filter(pk=bet.user.pk).update(
                    available_funds=F("available_funds") + bet.bet_amount
                )
                logger.info(f"{self.BLUE}Refunded {bet.bet_amount} to user {bet.user.username} for bet {bet.id}{self.END}")
                refunded_bets.append(bet.id)
            except DatabaseError as e:
                logger.error(f"{self.RED}Database error while refunding bet {bet.id}: {e}{self.END}")  
                    
        return [{"message": "Bets refunded", "refunded_bets": refunded_bets}]
    
    def _distribute_winnings(self, winning_bets, total_bet_amount):
        winning_info = []
        winning_bet_total = Decimal("0")
        
        for bet in winning_bets:
            # bet_amount = Decimal(bet.bet_amount)
            winning_bet_total += Decimal(bet.bet_amount)
        
        if winning_bet_total == 0:
            logger.error(f"{self.RED}No winning bets total to distribute{self.END}")
            return [{"message": "Error: No winning bets total"}]
            
        losing_bet_total = total_bet_amount - winning_bet_total
        
        for bet in winning_bets:
            bet_amount = Decimal(bet.bet_amount)
            user_share = (bet_amount / winning_bet_total) * losing_bet_total
            CustomUser.objects.filter(pk=bet.user.pk).update(
                available_funds=F("available_funds") + user_share
            )
            winning_info.append({"username": bet.user.username, "winning_amount": user_share})
            logger.info(f"{self.BLUE}Distributed {user_share} to user {bet.user.username} for bet ID {bet.id}{self.END}")
        return winning_info
        
        
        
        
