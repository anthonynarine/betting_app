from rest_framework import viewsets,status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from ..models import Bet
from ..serializer import BetSerializer
from django.utils import timezone

import logging

class BetViewset(viewsets.ModelViewSet):

    # queryset = Bet.objects.all()
    serializer_class = BetSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        This view should return a list of all bets for the currently authenticated user.
        However, if the user has special permissions (e.g., staff members), they can see all bets.
        """
        # Access the user from the request object, currently authenticated user.
        user = self.request.user

        # Check if the user has the 'is_staff' attribute set to True, which typically indicates an admin-level user.
        if user.is_staff:
            # If the user is a staff member, return all bet objects.
            return Bet.objects.all()

        # If the user is not a staff member, filter the bets so that only those belonging to the user are returned.
        return Bet.objects.filter(user=user)
    
    def perform_create(self, serializer):
        """
        Cutsom create of a new Bet instance.
        
        Associates the new Bet w/ the currently authenticated user. Will maintain
        referential integrity, ensure security by preventing manual override of the "user"
        feild, and provide convenience by automatically setting the "user" without requiring 
        it in the request payload
        """
        serializer.save(user=self.request.user)
    
    
    def destroy(self, request, *args, **kwargs):
        """
        Deletes a bet instance.

        This method overrides the default destroy method to add a custom
        validation step. It ensures that a bet cannot be deleted after the
        event associated with it has started.

        Args:
            request: The HTTP request object.

        Returns:
            Response: A DRF Response object with either a success status (if deletion is allowed)
            or an error status (if the event has already started).
        """
        # Retrieve the bet instance that is requested to be deleted.
        bet = self.get_object()

        # Check if the event time associated with the bet is in the past.
        if bet.event.time <= timezone.now():
            # If the event has started, respond with a 400 Bad Request, indicating
            # that the bet cannot be deleted.
            return Response(
                {"details": "Cannot delete a bet after the associated event has started."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # If the event has not started, proceed with the default deletion process.
        return super().destroy(request, *args, **kwargs)