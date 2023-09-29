from rest_framework import viewsets
from .models import Group
from .serializer import GroupSerializer

class GroupViewset(viewsets.ModelViewSet):
    queryset = Group.objects.all().order_by("name")
    serializer_class = GroupSerializer
    
    
    



