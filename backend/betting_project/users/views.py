from email.policy import HTTP
from rest_framework import viewsets, generics, status
from rest_framework.response import Response

from rest_framework.permissions import (
    AllowAny,
    IsAuthenticatedOrReadOnly,
    IsAuthenticated,
)
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.shortcuts import get_object_or_404


from .models import CustomUser
from .serializer import UserSerializer, UserSignupSerializer

from django.conf import settings
from rest_framework.views import APIView
from django.db import transaction
import stripe


class UserViewSet(viewsets.ViewSet):
    """
    A view set for handling operations related to CustomUser.

    Provides an endpoint to retrieve the details of a user by their primary key.
    """

    # Define the default set of objects to be used in this view set.
    queryset = CustomUser.objects.all()
    permission_classes = [IsAuthenticated]

    # Specify the serializer to convert between model instances and JSON.
    serializer_class = UserSerializer

    def retrieve(self, request, pk=None):
        """
        Handle GET requests for a single user instance identified by its primary key (pk).

        Args:
        - request (HttpRequest): the request instance.
        - pk (int, optional): the primary key of the user instance to retrieve. Defaults to None.

        Returns:
        - Response: a response containing the serialized user data or a 404 error.
        """

        # Attempt to get the user with the specified primary key (pk).
        # If no such user exists, return a 404 Not Found response.
        user = get_object_or_404(CustomUser, pk=pk)

        # Initialize the serializer with the retrieved user object.
        serializer = UserSerializer(user)

        # Return an HTTP response containing the serialized user data.
        return Response(serializer.data)


# FOR DEBUGGING
# import pdb
# import logging
# logger = logging.getLogger(__name__)


class UserSignupView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSignupSerializer

    def create(self, request, *args, **kwargs):
        # logger.debug("Entering create method")  # Use logger for debugging
        # pdb.set_trace()  # Set a breakpoint for debugging
        response = super().create(request, *args, **kwargs)
        return Response({"detail": "User registered successfully."})
    
    
# All stripe related view functionality
class StripeConfigView(APIView):
    """
    Stripe Configurations.
    
    This view is will provide the Stripe public key to the Frontend
    The key is used in the Stripe payment process to identify your Stripe 
    account
    """
    def get(self, request, *args, **kwargs):
        """
        Get request to retrieve the Stripe public key.
        This method will respond with the Stripe Public key,needed by the frontend
        to initiate transactions with Stripe. The key is retrieved from the projects setting.
            Args:
        request: The HTTP request object.

        Returns:
            Response: A DRF Response object containing the Stripe public key.
        """
        # Retrieve the Stripe publishable key from the project settings
        stripe_publishable_key = settings.STRIPE_PUBLISHABLE_KEY
        # Return the Stripe publishable key in the response
        return Response({"publicKey": settings.STRIPE_PUBLISHABLE_KEY})

class CreateChargeView(APIView):
    """
    API view to create a charge using stripe
    
    This view handles POST requests to charge a user's card. The amout and source 
    (card information) are expected in the request data. It updates the user's availabe
    funds upon successful charge.  
    """
    def post(self, request, *args, **kwargs):
        """
            Handles The POST request to create a charge
            
            uses Stripe's API to create a charge with the provided amount and source
            On scuccessful charge, it updates  the user's availabe funds.
        Args:
            request: The HTTP request objec containing the charge details.
        Returns:
            Response: A Response object w/ a success + 201 HTTP status code
            or an error message and error-specific HTTP status code. 
        """
        # Set the Stripe API key
        stripe.api_key = settings.STRIPE_SECRET_KEY
        
        try:
            # Create a charge using Stripe's API
            charge = stripe.Charge.create(
                amount=request.data.get("amount"), # amount in cents
                currency="usd",
                source=request.data.get("source"), # Card information
                description=f"Deposit for user {request.user.email}"
            )
            
            # Convert the charged amount to dollars(Stripe uses cents)
            amount_in_dollars = charge["amount"] / 100
            
            # Update user's availabel Funds in a transaction-safe way
            with transaction.atomic():
                user = request.user
                user.availabe_funds += amount_in_dollars
                user.save()
                
            # Return a success response    
            return Response({"message": "Charge successful"}, status=status.HTTP_201_CREATED)
        
        except stripe.error.StripeError as e: 
            #Handle Stripe-specifice errors
            # "e" captures the exception instance thrown by Stripe
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": "An error occured while processing your request."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
