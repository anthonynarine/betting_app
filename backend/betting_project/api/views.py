
from django.conf import settings
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.decorators import action
from .models import Group, Event, Member
from rest_framework.response import Response
from .serializer import GroupSerializer, EventSerializer, FullGroupSerializer, MemberSerializer
from rest_framework_simplejwt.authentication import JWTAuthentication  
from rest_framework.permissions import IsAuthenticated


class GroupViewset(viewsets.ModelViewSet):
    queryset = Group.objects.prefetch_related("members__user").all()
    serializer_class = GroupSerializer
    authentication_classes = [JWTAuthentication] 
    permission_classes = [IsAuthenticated]
    
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
    authentication_classes = [JWTAuthentication] 
    permission_classes = [IsAuthenticated]
    

@action(detail=True, methods=['POST'])
def join(self, request, pk=None):
    user = request.user  # Get the authenticated user
    group = get_object_or_404(Group, pk=pk)  # Get the group or return 404

    # Check if the user is already a member
    if group.members.filter(user=user).exists():
        return Response({"message": "Already a member"}, status=status.HTTP_400_BAD_REQUEST)

    # Create a new member
    Member.objects.create(group=group, user=user)
    return Response({"message": "Successfully joined the group"}, status=status.HTTP_200_OK)


        