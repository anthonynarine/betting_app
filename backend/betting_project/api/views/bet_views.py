from django.shortcuts import get_object_or_404
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
        Override the default queryset to return bets based on user's staff status
        """
        user = self.request.user
        if user.is_staff:
            return Bet.objects.all()
        return Bet.objects.filter(user=user)

    @action(detail=False, methods=['get'], url_path='event-bet')
    def event_bet(self, request):
        """
        A custom action to retrieve a specific bet based on the provided event ID
        
        This action will return a single Bet instance for the currently logged in user
        if a valid event_id is provided in the query parameters. If the user is a staff mem
        the can acces any bet for the specified event.
        
        The build in list method will return all bets for the logged in user;
        """
        # Access the user who make the request 
        user = request.user
        
        # Retrieve the "event_id" from the quer parmas of the request
        event_id = request.query_params.get("event_id")
        
        # Check if "event_id" was provided: if no, return an error response
        if not event_id:
            return Response({"error": "event_id must be provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Build the queryset to filter the bets based on the provided event_id
        queryset = Bet.objects.filter(event_id=event_id)
        
        # if the user is not a staff member, further filter the querset to include only bets made by the user 
        if not user.is_staff:
            queryset = queryset.filter(user=user)
        # Try to get a single bet from the queryset; if no bet is found, a 404    
        bet = get_object_or_404(queryset)
        
        # Serialize the bet instance
        serializer = self.get_serializer(bet)
        print(serializer.data)
        # Return the serialized bet data in the response
        return Response(serializer.data)

    
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
