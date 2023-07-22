from django.db import models


class Group(models.Model):
    """
    A model representing a group.

    Attributes:
        name (str): The name of the group.
        location (str): The location of the group.
        description (str): A description of the group.
    """

    name = models.CharField(max_length=32, null=False, unique=False)
    location = models.CharField(max_length=32, null=False)
    description = models.CharField(max_length=256, null=False, unique=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    class Meta:
        """
        This class allows you to specify various options and settings for the model.
        """

        unique_together = ("name", "location")

        """
    The unique_together option enforces a constraint that the combination
    of name and location fields must be unique in the database. This ensures
    that no two groups can have the same name and location.

    For example, if there's a group named "Group A" in "Location X", another
    group cannot be created with the same name "Group A" in "Location X".
    """
    
    
    def __str__(self):
        return self.name
