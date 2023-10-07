
from rest_framework import viewsets
from rest_framework import  generics
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.permissions import AllowAny
from rest_framework.decorators import authentication_classes, permission_classes
from django.shortcuts import get_object_or_404


from .models import CustomUser
from .serializer import UserSerializer, UserSignupSerializer

   

class UserViewSet(viewsets.ViewSet):
    """
    A view set for handling operations related to CustomUser.
    
    Provides an endpoint to retrieve the details of a user by their primary key.
    """

    # Define the default set of objects to be used in this view set.
    queryset = CustomUser.objects.all()
    
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