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


    def calculate_potential_winnings(self):
        """
        Calculates the potential winnings for each participant's bet based on 
        the current betting pool. This method is used to provide an estimate 
        of what participants might win, based on the bets currently placed on 
        each team.

        The potential winnings are calculated by:
        - Summing the total bet amount for each team.
        - For each bet, calculating what proportion of the team's total bet amount 
          it represents.
        - Using this proportion to determine what share of the opposite team's 
          total bets the bet would win if successful.

        Note: This is an estimation and the actual winnings might differ based 
        on the event's final outcome.

        Returns:
            A list of dictionaries, each containing:
            - 'user': Username of the participant.
            - 'bet_amount': The amount bet by the participant.
            - 'team_choice': The team chosen by the participant.
            - 'potential_winning': The estimated winning amount for the participant.
            - 'total_winnable_pool': The total pool of bets that can be won.

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
        # Initialize a dict to keep trasck of the total bet amount for each team (read up on python dictionary comprehension)
        total_bet_amount = {team: Decimal("0") for team in [self.team1, self.team]}
        #loop over each bet + add the bet amount to the correspoing team's total the total_bet_amount dict
        for bet in bets:
            total_bet_amount[bet.team_choice] += bet.bet_amount
        
        #initialize a list to store potential winnings
        potential_winnings = []
        for bet in bets:
            if total_bet_amount[bet.team_choice] > 0:
                # The total amount of money that can be won from the opposite team's bet pool.
                winnable_amount = (total_bet_amount[self.team1] + total_bet_amount[self.team2] - total_bet_amount[bet.team_choice])
                # The proportion of the bet in relation to the total bets placed on the chosen team.
                winning_ratio = bet.bet_amount / total_bet_amount[bet.team_choice]
                potential_winning = winning_ratio * winnable_amount
                
                potential_winning.append({
                    'user': bet.user.username,
                    'bet_amount': bet.bet_amount,
                    'team_choice': bet.team_choice,
                    'potential_winning': potential_winning,
                    'total_winnable_pool': winnable_amount
                    
                })
        
        return potential_winnings
    
    
    @action(
        detail=True,
        methods=["post"],
        url_path="mark-as-complete",
        permission_classes=[IsAuthenticated],
    )
    def complete_event(self, request, pk=None):
        """
        Custom action to mark an event as complete. This method follows several steps:
        1. User authentication check.
        2. Winning team validation.
        3. Calculation of the total bet amount.
        4. Marking the event as complete in the database.
        5. Updating the bet status based on the event outcome.

        The winning team name is determined in this method and passed to the EventSerializer
        as part of the context. This context is used by the serializer to accurately calculate
        and display participants' bets and potential winnings in the get_participants_bets_and_winnings
        method. It ensures that the serializer has the necessary dynamic data for processing 
        the request, particularly the winning team information.

        Args:
            request: The HTTP request object.
            pk: The primary key of the event to be marked as complete.

        Returns:
            A Response object with the event completion details, winnings information, 
            and serialized event data.
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
        
        # Step 5: Calculate and distribute winnings based on the event outcome
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
    def _calculate_and_distribute_winnings(self, event, winning_team_name, total_bet_amount):
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
        
        # Check if the event is already completed ()
        if event.is_complete:
            logger.info(f"Event {event.id} is already marked as complete.")
            return {"details": "Event has already been completed."}
        
        total_bet_amount = Decimal(total_bet_amount)
        all_bets = Bet.objects.filter(event=event)
        
        # Logging for debugging
        logger.info(f"{self.BLUE}Total bet amount for event {event.id}: {total_bet_amount}{self.END}")
        logger.info(f"{self.BLUE}Winning team for event {event.id}: {winning_team_name}{self.END}")
        
        for bet in all_bets:
            bet.bet_amount = Decimal(bet.bet_amount)
            logger.info(f"{self.BLUE}Bet ID {bet.id}: Team choice - {bet.team_choice},  Bet amount - {bet.bet_amount}{self.END}")
        
        # Determine if the winning team name matches team1 or team2 of the event
        if winning_team_name == event.team1:
            winning_team_label = "Team 1"
        elif winning_team_name == event.team2:
            winning_team_label = "Team 2"
        else:
            logger.error(f"{self.RED}Invalid winning team name for event {event.id}: {winning_team_name}{self.END}")
            return {"details": "Invalid winning team name"}
        
        winning_bets = all_bets.filter(team_choice=winning_team_label)
        total_bettors = all_bets.count()
        winning_bettors = winning_bets.count()
        
        # Logging for debugging
        logger.info(f"{self.BLUE}Total bettors for event {event.id}: {total_bettors}{self.END}")
        logger.info(f"{self.BLUE}Total winning bettors for event {event.id}: {winning_bettors}{self.END}")
        
        
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
                # No need to raise an exception; let the transaction.atomic handle the rollback      
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
            try:
                bet_amount = Decimal(bet.bet_amount)
                user_share = (bet_amount / winning_bet_total) * losing_bet_total
                CustomUser.objects.filter(pk=bet.user.pk).update(
                    available_funds=F("available_funds") + user_share
                )
                winning_info.append({"username": bet.user.username, "winning_amount": user_share})
                logger.info(f"{self.BLUE}Distributed {user_share} to user {bet.user.username} for bet ID {bet.id}{self.END}")
            except DatabaseError as e:
                logger.error(f"{self.RED}Database error while distributing winnings for bet {bet.id}: {e}{self.END}")
                # No need to raise an exception; let the transaction.atomic handle the rollback
        return winning_info
        
        
        
        
