from sched import Event
import stat
from rest_framework import viewsets, status
from rest_framework.decorators import action
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
        Cutsom save behavior to create a new Bet instance.

        Associates the new Bet w/ the currently authenticated user. Will maintain
        referential integrity, ensure security by preventing manual override of the "user"
        feild, and provide convenience by automatically setting the "user" without requiring
        it in the request payload
        """
        serializer.save(user=self.request.user)

    @action(detail=False, methods=["post"], permission_classes=[IsAuthenticated])
    def place_bet(self, request):
        
        """Custom action to place a bet
        Action will ensure that a bet cannot be placed after the event assoc w/
        it has started
        """
        #Deserialize the input data
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        #Retrieve the event based on the provided data
        event_id = serializer.validated_data.get("event")
        try:
            event = Event.objects.get(id=event_id)
        except Event.DoesNotExist:
            return Response(
                {"details": "Event does not exist"},
                status=status.HTTP_404_NOT_FOUND
            )
        
        #check if the event has already started
        if event.start_time <= timezone.now():
            return Response(
                {"details": "Cannot place a bet after the event has started"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        #save to db 
        self.perform_create(serializer)
        # serializer.save()
        
        #Return the serialized data with a 201 Created status. 
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def update_bet(self, request, pk=None):
        
        bet = self.get_object()
        if bet.event.start_time <= timezone.now():
            return Response(
                {"details": "Cannot plac a bet after the event has started"},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        serializer = self.get_serializer(bet, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)  
        
        serializer.save()
        
        return Response(serializer.data, status=status.HTTP_200_OK)      
    
        
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
        if bet.event.start_time <= timezone.now():
            # If the event has started, respond with a 400 Bad Request, indicating
            # that the bet cannot be deleted.
            return Response(
                {
                    "details": "Cannot delete a bet after the associated event has started."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # If the event has not started, proceed with the default deletion process.
        return super().destroy(request, *args, **kwargs)
