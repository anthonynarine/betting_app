from rest_framework import serializers
from .models import Group

class GroupSerializer(serializers.ModelSerializer):
    """
    Serializer class to convert Group model instances to JSON and vice versa.

    Attributes:
        model (django.db.models.Model): The Django model to be serialized (Group).
        fields (str): A special value "__all__" which includes all fields from the model in the serializer.

    Note:
        The `ModelSerializer` class provided by Django REST Framework automatically generates
        serializer fields based on the model's fields, saving you from defining them manually.
    """

    class Meta:
        model = Group
        fields = "__all__"