from typing import Self
from rest_framework import viewsets
from .models import Group, Event
from rest_framework.response import Response
from .serializer import GroupSerializer, EventSerializer, FullGroupSerializer

class GroupViewset(viewsets.ModelViewSet):
    queryset = Group.objects.all().order_by("name")
    serializer_class = GroupSerializer
    
    # def get_serializer_class(self):
    #     if "pk" in self.kwargs:
    #         return FullGroupSerializer
    #     return GroupSerializer
    
    # eitehr of these methods will work 
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = FullGroupSerializer(instance, many=False, context={"request": request})
        return Response(serializer.data )
       



class EventViewset(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
