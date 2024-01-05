from django.utils import timezone
from backend.betting_project.validators.bet_validators import bet_type_validator
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
        event = self.get_object()
        if not self.is_authorized_user(request.user, event):
            return Response(
                {"details": "You did not create this event"},
                status=status.HTTP_403_FORBIDDEN,
            )

        winning_team = self.validate_winning_team(request, event)
        if not winning_team:
            return Response(
                {"details": "Invalid Winning Team"}, status=status.HTTP_400_BAD_REQUEST
            )

        total_bet_amount = self._calculate_total_bet_amount(event)
        if total_bet_amount == 0:
            return Response(
                {"details": "No bets were placed on this event"},
                status=status.HTTP_404_NOT_FOUND,
            )

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

    def _calculate_percentage_shares(self, event, winning_team, total_bet_amount):
        bet_percentage = {}
        if total_bet_amount == 0:
            return bet_percentage
        winning_bets = Bet.objects.filter(event=event, team_choice=winning_team)
        for bet in winning_bets:
            percentage = (bet.bet_amount / total_bet_amount) * 100
            bet_percentage[bet.user] = percentage
        return bet_percentage

    @transaction.atomic
    def _calculate_and_distribute_winnings(self, event, winning_team, total_bet_amount):
        try:
            bet_percentage = self._calculate_percentage_shares(
                event, winning_team, total_bet_amount
            )
            winning_info = []
            for user, percentage in bet_percentage.items():
                user_winning = (percentage / 100) * total_bet_amount
                CustomUser.objects.filter(pk=user.pk).update(
                    available_funds=F("available_funds") + user_winning
                )
                winning_info.append(
                    {"username": user.username, "winning_amount": user_winning}
                )
            return winning_info
        except Exception as e:
            logger.error(
                "Error in calculating and distributing winnings for event ID %s: %s",
                event.id,
                e,
            )
            # Consider whether to re-raise the exception or handle it here
            raise
