from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication
from .models import Bet
from .serializer import BetSerializer
from rest_framework.exceptions import NotFound

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
       