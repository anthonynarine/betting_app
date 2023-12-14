from django.utils import timezone
from ..models import Event
from ..serializer import EventSerializer
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.exceptions import ValidationError

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
        print("Received data for Event creation:", request.data)
        return super().create(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        event = self.get_object()
        if request.user != event.organizer:
            raise PermissionDenied 
        
        # Check if the event has already started 
        if timezone.now() >= event.start_time:
            raise ValidationError({"detail": "Cannot update the event after it has started"})
        
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        event = self.get_object()
        if request.user != event.organizer:
            raise PermissionDenied
        
        # Check if the event has already started 
        if timezone.now() >= event.start_time:
            raise ValidationError({"detail": "Cannot delete the event after it has started"})
        
        return super().destroy(request, *args, **kwargs)

    
    @action(detail=True, methods=["post"], permission_classes=[IsAuthenticated])
    def complete_event(self, request, pk=None):
        """
        Method to mark an event as complete
        
        """
        # Retrieve the specific Event instance based on the primary key (pk) provided in the URL.
        # This is used to operate on a specific instance rather than the entire collection.
        event = self.get_object()
        
        # Check if the request user is the event organizer
        if request.user != event.organizer:
            return Response({'details': 'You did not create this even'}, status=status.HTTP_403_FORBIDDEN)
        
        event.is_complete = True
        event.save()
        
        
        
        return Response({'details': "Event marked as complete"}, status=status.HTTP_200_OK)