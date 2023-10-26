
from django.contrib import admin
from .models import Group, Event, Member

import logging

logger = logging.getLogger(__name__)

@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    fields = ["name", "location", "description"]
    list_display = ["id", "name", "location", "description"]

    def save_model(self, request, obj, form, change):
        logger.debug("Logged-in admin user: %s", request.user)
        if not change:
            obj.creator = request.user
        super().save_model(request, obj, form, change)
    
@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    fields = ["team1", "team2", "time", "team1_score", "team2_score", "group"] 
    list_display = [field.name for field in Event._meta.fields]  
    
@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    fields = [field.name for field in Member._meta.fields if field.name not in ['id', 'joined_at']]
    list_display = [field.name for field in Member._meta.fields]