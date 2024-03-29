import re
from django.forms import ValidationError
from rest_framework import serializers
from users.serializer import UserSerializer
from .models import Group, Event, Member, Bet, Participant
from django.utils import timezone
from .serializer_mixins.mixins import BannerImageMixin


class GroupBriefSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = ("id", "name", "description", "user", "banner_image")

class EventSerializer(serializers.ModelSerializer):
    group = GroupBriefSerializer(read_only=True)
    group_id = serializers.IntegerField(write_only=True)
    participants_bets_and_winnings = serializers.SerializerMethodField()
    num_participants = serializers.IntegerField(read_only=True)
    

    class Meta:
        model = Event
        fields = (
            "id",
            "team1",
            "team2",
            # "team1_score",
            # "team2_score",
            "start_time",
            "end_time",
            "organizer",
            "group",
            "group_id",
            "is_complete",
            "participants_bets_and_winnings",
            "num_participants",
        )
    def create (self, validated_data):
        """
        Create a new Event Instance, ensuring that a valid  group_id
        is provided. 
        
        Overriding the create method because the default create behavior
        does not handle the "group_id" field which is write-only.
        We need to manually extact the "group_id" from the validated_data, get 
        the corresonding Group instance and then create the Event instance w/
        this group.
        
      
        """ 
        # Extract group_id from validated data
        group_id = validated_data.pop("group_id", None)
        if group_id is None:
            raise ValidationError({'group_id': "You must be a member of this group to host events. "})
        
        try:
            # check if the group already exist
            group = Group.objects.get(id=group_id)
        except Group.DoesNotExist:
            raise ValidationError({"group_id": "This event already exist"})
        
        # Add group to validated data and create the Event instance
        validated_data['group'] = group
        event = Event.objects.create(**validated_data)

        return event
    
    def update(self, instance, validated_data):
        """
        Update an existing Event instance.
        
        The default update method in DRF does not handle write-only fiels like 
        "group-id".  Overriding this method to extract "group_id" from validated_data
        and update the "group" relationship accordingly
        
        Eact attribute in validated_data is set on the instace using setattr.
        This handles all the fields of the event except for "group_id".
        if "group_id" is porvided, fetch the corresponding Group instance
        and set it as the event's group.  If "group_id" is not provided,
        the group relationship is not modified
        """
        group_id = validated_data.pop("group_id", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
            
        if group_id is not None:
            instance.group = Group.objects.get(id=group_id)
        instance.save()
        return instance

    def get_participants_bets_and_winnings(self, obj):
        # obj is an instance of the Event model
        # calculate_potential_winnings i called on the instance. 
        return obj.calculate_potential_winnings()
        
class EventBriefSerializer(serializers.ModelSerializer):
    group = GroupBriefSerializer(read_only=True)

    class Meta:
        model = Event
        fields = (
            "id",
            "team1",
            "team2",
            "team1_score",
            "team2_score",
            "start_time",
            "end_time",
            "is_complete",
            "organizer",
            "group",
        )

class MemberSerializer(serializers.ModelSerializer):
    user = UserSerializer(many=False)

    class Meta:
        model = Member
        fields = ["user", "group", "admin", "joined_at"]

class GroupSerializer(serializers.ModelSerializer):
    events = EventSerializer(many=True, read_only=True)
    members = MemberSerializer(many=True, read_only=True)

    class Meta:
        model = Group
        fields = ("name", "id", "location", "description", "events", "members", "banner_image")
        
class BetSerializer(serializers.ModelSerializer):
    event_id = serializers.IntegerField(write_only=True, required =True)
    chosen_team_name = serializers.SerializerMethodField("get_chosen_team_name")
    event = EventSerializer(read_only=True)
    class Meta:
        model = Bet
        fields = [
            "id",
            "user",
            "event",
            "event_id",
            "team_choice",
            "bet_type",
            "bet_amount",
            "created_at",
            "updated_at",
            "status",
            "chosen_team_name"
        ]
        read_only_fields = ["id", "created_at", "updated_at", "chosen_team_name"]
        
    def get_chosen_team_name(self, bet):
        """
        Determines and returns the name of the chonen team based on the team_choice of the Bet instance
        
        Args:
            obj (Bet): The Bet instance obeing serialized.
            
        Retruns: 
            str: The name of the chonese team or None if no Team is chosen or if the event is not set.
        """
        # Check if the chosen team is "Team 1"
        if bet.team_choice == "Team 1":
            # Return the name of team1 from the related event, if the event exist
            return bet.event.team1 if bet.event else None
        # Check if the chonsen tea is "Team 2"
        elif bet.team_choice == "Team 2":
            return bet.event.team2 if bet.event else None
        # If neither "Team 1" nor "Team 2" is chosen, return None
        return None

    def validate_event_id(self, value):
        try:
            event = Event.objects.get(pk=value)
            if event.start_time <= timezone.now():
                raise serializers.ValidationError("Cannot place a bet on an event that has already started.")
            return value
        except Event.DoesNotExist:
            raise serializers.ValidationError("This event does not exist")

    def validate(self, data):
        """
        Check that the bet is valid:
            - Ensure the event has not started.
            - Ensure the event is not in progress
            - Ensure the event has not ended
        """
        # Extract the event_id from the incoming data or instance (for updates)
        event_id = data.get("event_id", self.instance.event_id if self.instance else None)

        # Fetch the event based on event_id
        try:
            event = Event.objects.get(id=event_id)
        except Event.DoesNotExist:
            raise serializers.ValidationError({"event_id": "This event does not exist"})
        
        current_time = timezone.now()

        # Check if the event has started or ended
        if event.start_time <= current_time:
            raise serializers.ValidationError("Cannot place a bet on an event that has already started")
        if hasattr(event, "end_time") and event.end_time and event.end_time <= current_time:
            raise serializers.ValidationError("Cannot place bet on an event that has already ended")
        
        return data

    def create(self, validated_data):
        """
        The create override will primarily focus on associating the bet with the correct event
        """
        # Assuming, "event_id" has been validated and used to set the "event" in validated_data
        event_id = validated_data.pop("event_id", None) # remove "event_id" it's not a model field
        event = Event.objects.get(id=event_id)
        validated_data["event"] = event

        # Now call the superclass method on the handle actual object creation
        return super().create(validated_data)

class ParticipantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Participant
        fields = '__all__'  
