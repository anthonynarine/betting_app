from ..models import Event
from ..serializer import EventSerializer
from rest_framework import viewsets


class EventViewset(viewsets.ModelViewSet):
    """
    API endpoint that allows events to be viewed or edited.
    """

    queryset = Event.objects.all()
    serializer_class = EventSerializer