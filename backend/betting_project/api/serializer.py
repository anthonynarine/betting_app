from django.forms import ValidationError
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
        fields = ("id", "name", "description", "user")


class EventSerializer(serializers.ModelSerializer):
    group = GroupBriefSerializer(read_only=True)
    group_id = serializers.IntegerField(write_only=True)

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
            "organizer",
            "group",
            "group_id",
            "participants",
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
        This handles all the fields of the event except for "grou_id".
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
            "is_complete" "organizer",
            "group",
            "participants",
        )


class MemberSerializer(serializers.ModelSerializer):
    user = UserSerializer(many=False)

    class Meta:
        model = Member
        fields = ["user", "group", "admin", "joined_at"]


class FullGroupSerializer(serializers.ModelSerializer):
    events = EventSerializer(many=True, read_only=True)
    members = MemberSerializer(many=True, read_only=True)

    class Meta:
        model = Group
        fields = ("name", "id", "location", "description", "events", "members")


class BetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bet
        fields = [
            "id",
            "user",
            "event",
            "team_choice",
            "bet_type",
            "team1_score",
            "team2_score",
            "amount",
            "created_at",
            "updated_at",
            "status",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    def validate(self, data):
        """
        Check that the bet is valid.
        """
        # When creating a new bet, ensure the event has not already passed
        if data["event"].time < timezone.now():
            raise serializers.ValidationError("Cannot place a bet on a past event.")
        # When updating an existing bet, ensure the event has not started
        elif self.instance and self.instance.event.time <= timezone.now():
            raise serializers.ValidationError(
                "Cannot update a bet after the event has started."
            )

        return data
