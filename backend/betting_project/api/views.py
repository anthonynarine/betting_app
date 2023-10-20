
from django.conf import settings
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication  
from rest_framework.permissions import IsAuthenticated

from .models import Group, Event, Member
from .serializer import GroupSerializer, EventSerializer, FullGroupSerializer, MemberSerializer

class GroupViewset(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.prefetch_related("members__user").all()
    serializer_class = GroupSerializer
    authentication_classes = [JWTAuthentication] 
    permission_classes = [IsAuthenticated]

    def retrieve(self, request, *args, **kwargs):
        """
        Retrieve a group along with its members and events.
        """
        instance = self.get_object()
        serializer = FullGroupSerializer(instance, many=False, context={"request": request})
        return Response(serializer.data)

    @action(detail=True, methods=['POST'])
    def join(self, request, pk=None):
        """
        Allow a user to join a group.
        """
        user = request.user  # Get the authenticated user
        group = get_object_or_404(Group, pk=pk)  # Get the group or return 404

        # Check if the user is already a member
        if group.members.filter(user=user).exists():
            return Response({"message": "Already a member"}, status=status.HTTP_400_BAD_REQUEST)

        # Create a new member
        Member.objects.create(group=group, user=user)
        return Response({"message": "Successfully joined the group"}, status=status.HTTP_200_OK)    

class EventViewset(viewsets.ModelViewSet):
    """
    API endpoint that allows events to be viewed or edited.
    """
    queryset = Event.objects.all()
    serializer_class = EventSerializer

class MemberViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows members to be viewed or edited.
    """
    queryset = Member.objects.all()
    serializer_class = MemberSerializer
    authentication_classes = [JWTAuthentication] 
    permission_classes = [IsAuthenticated]


