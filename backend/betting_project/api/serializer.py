from rest_framework import serializers
from users.serializer import UserSerializer
from .models import Group, Event, Member, Bet
from django.utils import timezone


class GroupSerializer(serializers.ModelSerializer):

    class Meta:
        model = Group
        fields = ("id", "name", "location", "description", "user")

class GroupBriefSerializer(serializers.ModelSerializer):

    class Meta:
        model = Group
        fields = ("name", "description", "user")

class EventSerializer(serializers.ModelSerializer):
    group = GroupBriefSerializer(read_only=True)

    class Meta:
        model = Event
        fields = ('id', 'team1', 'team2', 'team1_score', 'team2_score', 'time', 'organizer', 'group', 'participants')
class EventBriefSerializer(serializers.ModelSerializer):
    group = GroupBriefSerializer(read_only=True)

    class Meta:
        model = Event
        fields = ('id', 'team1', 'team2', 'team1_score', 'team2_score', 'time', 'organizer', 'group', 'participants')

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

class BetSerializer(serializers.ModelSerializer):

    class Meta:
        model = Bet
        fields = [
            'id', 'user', 'event', "team_choice", "bet_type",  'team1_score', 'team2_score', 'points', 'created_at', 'updated_at', 'status'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']  

    def validate(self, data):
        """
        Check that the bet is valid.
        """
        # When creating a new bet, ensure the event has not already passed
        if data['event'].time < timezone.now():
            raise serializers.ValidationError("Cannot place a bet on a past event.")
        # When updating an existing bet, ensure the event has not started
        elif self.instance and self.instance.event.time <= timezone.now():
            raise serializers.ValidationError("Cannot update a bet after the event has started.")

        return data
        

        


        
