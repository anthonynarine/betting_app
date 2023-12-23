from rest_framework.exceptions import ValidationError
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from ..models import Bet, Event
from ..serializer import BetSerializer
from django.utils import timezone

class BetViewset(viewsets.ModelViewSet):
    # Define the serializer class used for this viewset
    serializer_class = BetSerializer

    # Define the authentication and permission classes for this viewset
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Retrieve a queryset of bets based on the user's role and optional event filter.
        """
        # Access the currently authenticated user from the request
        user = self.request.user

        # Retrieve 'event_id' from query parameters, if provided
        event_id = self.request.query_params.get("event_id")
        
        # By default, filter bets for the logged-in user
        queryset = Bet.objects.filter(user=user)

        # If the user is a staff member, return all bets
        if user.is_staff:
            queryset = Bet.objects.all()
        
        # If 'event_id' is provided, further filter the queryset by the event
        if event_id:
            queryset = queryset.filter(event_id=event_id)

        # Return the final queryset
        return queryset
    
    def check_and_update_funds(self, user, bet_amount):
        """
        Check if the user has sufficient funds and update their balance.
        """
        # Check if the user's available funds are less than or equal to zero
        if user.available_funds <= 0:
            raise ValidationError({"details": "Insufficient funds"})
        
        # Check if the bet amount is greater than the user's available funds
        if bet_amount > user.available_funds:
            raise ValidationError({"details": "Bet amount is more than currently available funds"})
        
        # Deduct the bet amount from the user's available funds
        user.available_funds -= bet_amount

        # Save the updated user object
        user.save(update_fields=["available_funds"])

    def perform_create(self, serializer):
        """
        Custom save behavior to create a new Bet instance.
        """
        # Save the bet instance with the currently authenticated user
        serializer.save(user=self.request.user)

    @action(detail=False, methods=["post"], permission_classes=[IsAuthenticated])
    def place_bet(self, request):
        """
        Custom action to place a new bet.
        """
        # Deserialize and validate the incoming data
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        # Retrieve the bet amount from the validated data
        bet_amount = serializer.validated_data.get("bet_amount")
        
        # Retrieve the event based on the provided data
        event_id = serializer.validated_data.get("event")
        try:
            event = Event.objects.get(id=event_id)
        except Event.DoesNotExist:
            # Return an error response if the event does not exist
            return Response({"details": "Event does not exist"}, status=status.HTTP_404_NOT_FOUND)
        
        # Check if the event has already started
        if event.start_time <= timezone.now():
            # Return an error response if the event has started
            return Response({"details": "Cannot place a bet after the event has started"}, status=status.HTTP_400_BAD_REQUEST)
            
        # Check and update the user's funds
        self.check_and_update_funds(request.user, bet_amount)
        
        # Save the bet to the database
        self.perform_create(serializer)
        
        # Return a success response with the bet data
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def update_bet(self, request, pk=None):
        """
        Custom action to update an existing bet.
        """
        # Retrieve the bet instance to be updated
        bet = self.get_object()

        # Check if the event associated with the bet has already started
        if bet.event.start_time <= timezone.now():
            # Return an error response if the event has started
            return Response({"details": "Cannot update a bet after the event has started"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Deserialize and validate the incoming data for update
        serializer = self.get_serializer(bet, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        
        # Save the updated bet data
        serializer.save()
        
        # Return a success response with the updated bet data
        return Response(serializer.data, status=status.HTTP_200_OK)

    def destroy(self, request, *args, **kwargs):
        """
        Custom behavior for deleting a bet instance.
        """
        # Retrieve the bet instance to be deleted
        bet = self.get_object()

        # Check if the event time associated with the bet is in the past
        if bet.event.start_time <= timezone.now():
            # Return an error response if the event has started
            return Response({"details": "Cannot delete a bet after the associated event has started"}, status=status.HTTP_400_BAD_REQUEST)

        # Proceed with the default deletion process if the event has not started
        return super().destroy(request, *args, **kwargs)
