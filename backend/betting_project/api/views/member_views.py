
from rest_framework import viewsets
from rest_framework_simplejwt.authentication import JWTAuthentication
from ..models import Member
from ..serializer import (MemberSerializer)
from rest_framework.permissions import IsAuthenticated


class MemberViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows members to be viewed or edited.
    """

    queryset = Member.objects.all()
    serializer_class = MemberSerializer
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]
    
    

