from rest_framework import serializers

from users.serializer import UserSerializer
from .models import Group, Event, Member

class GroupSerializer(serializers.ModelSerializer):

    class Meta:
        model = Group
        fields = ("id", "name", "location", "description", "creator")

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = "__all__"
        
class MemberSerializer(serializers.ModelSerializer):
    user = UserSerializer(many=False)
    class Meta:
        model = Member
        fields = ["user",'group', 'admin', 'joined_at']       

        
class FullGroupSerializer(serializers.ModelSerializer):
    events = EventSerializer(many=True, read_only=True)
    members = MemberSerializer(many=True, read_only=True)
    class Meta:
        model = Group
        fields = ( "name","id", "location", "description", "events", "members")
        


        
