from rest_framework import viewsets
from ..models import Participant
from ..serializer import ParticipantSerializer 

class ParticipantViewSet(viewsets.ModelViewSet):
    queryset = Participant.objects.all()
    serializer_class = ParticipantSerializer