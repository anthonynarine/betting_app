from rest_framework import viewsets
from .models import Group
from .serializer import GroupSerializer

class GroupViewset(viewsets.ModelViewSet):
    """
    Viewset class for the Group model. Provides CRUD operations for Group objects.

    Attributes:
        queryset (django.db.models.query.QuerySet): The initial queryset of Group objects.
            This attribute determines which Group objects will be accessible through this viewset.
            In this case, we use the `all()` method to retrieve all Group objects from the database.
            You can customize the queryset by applying filters, sorting, or other database queries.
            For example, you can use `Group.objects.filter(...)` to retrieve a subset of Group objects
            based on certain conditions.
            By default, the queryset is ordered by the primary key of the model in ascending order.
        serializer_class (GroupSerializer): The serializer class used for Group objects.
            This attribute specifies the serializer that will be used to convert Group objects
            to JSON and vice versa. The serializer is responsible for serializing the data and
            validating input data when creating or updating Group objects.
            In this case, we use the `GroupSerializer` class, which is defined elsewhere in the code,
            to handle the serialization and deserialization of Group objects.

    Note:
        The `queryset` attribute is an essential part of a viewset as it determines which data
        the viewset can operate on. By default, the `ModelViewSet` class provides standard CRUD
        operations (Create, Retrieve, Update, Delete) for the specified model using the `queryset`
        and `serializer_class` attributes. You can further customize the viewset by overriding
        its methods or using mixins to add additional functionality.
    """
    queryset = Group.objects.all().order_by("name")
    serializer_class = GroupSerializer
    
    
    



