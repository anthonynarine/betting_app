from typing import Self
from rest_framework import viewsets
from .models import Group, Event, Member
from rest_framework.response import Response
from .serializer import GroupSerializer, EventSerializer, FullGroupSerializer, MemberSerializer

class GroupViewset(viewsets.ModelViewSet):
    queryset = Group.objects.prefetch_related("members__user").all()
    serializer_class = GroupSerializer
    
    # def get_serializer_class(self):
    #     if "pk" in self.kwargs:
    #         return FullGroupSerializer
    #     return GroupSerializer
    
    # eitehr of these methods will work 
    
    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        print("Members:", instance.members.all())  # Debugging line
        serializer = FullGroupSerializer(instance, many=False, context={"request": request})
        print("Serialized Data:", serializer.data)  # Debugging line
        return Response(serializer.data )
       
class EventViewset(viewsets.ModelViewSet):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    
class MemberViewSet(viewsets.ModelViewSet):
    queryset = Member.objects.all()
    serializer_class = MemberSerializer
