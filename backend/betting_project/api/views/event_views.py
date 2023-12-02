from ..models import Event
from ..serializer import EventSerializer
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

class EventViewset(viewsets.ModelViewSet):
    """
    API endpoint that allows events to be viewed or edited.
    """

    queryset = Event.objects.all()
    serializer_class = EventSerializer
    
    def create(self, request, *args, **kwargs):
        print("Received data for Event creation:", request.data)
        return super().create(request, *args, **kwargs)

    
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