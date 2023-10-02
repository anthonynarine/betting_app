from rest_framework import serializers
from .models import Group, Event


class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = "__all__"
        
        
class FullGroupSerializer(serializers.ModelSerializer):
    events = EventSerializer(many=True, read_only=True)
    class Meta:
        model = Group
        fields = ("id", "name", "location", "description", "events")
        
class GroupSerializer(serializers.ModelSerializer):

    class Meta:
        model = Group
        fields = ("id", "name", "location", "description",)


        
