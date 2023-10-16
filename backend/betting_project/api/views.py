
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework import viewsets, status
from rest_framework.decorators import action
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
    
    @action(methods=["POST"], detail=False)
    def join(self, request, pk=None):
        if "group" in request.data and "user" in request.data:
            try:
                group = Group.objects.get(id=request.data["group"])
                User = get_user_model()
                user = User.objects.get(id=request.data["user"])
                
                member = Member.objects.create(group=group, user=user, admin=False)
                serializer = MemberSerializer(member, many=False)
                response = {"message": "Joined group", "results": serializer.data}
                return Response(response, status=status.HTTP_200_OK)
            except:
                response = {"message": "Cannot join"}
                return Response(response, status=status.HTTP_400_BAD_REQUEST)
        else:
            response = {"message": "Wrong params"}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)

    