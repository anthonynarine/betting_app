from django.contrib import admin
from .models import Group, Event, Member, Bet, Participant

import logging

logger = logging.getLogger(__name__)


@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    # This filds list is only needed to display the filds in the order as listed 
    # Without the list they will be listed in defult order also needed if you don't wnat to add all fields
    fields = ["name", "location", "description", "banner_image"]
    list_display = ["name", "location", "description", ]

    def save_model(self, request, obj, form, change):
        logger.debug("Logged-in admin user:", request.user)
        if not change:
            obj.creator = request.user
        super().save_model(request, obj, form, change)

@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    fields = [
        field.name
        for field in Member._meta.fields
        if field.name not in ["id", "joined_at"]
    ]
    list_display = [field.name for field in Member._meta.fields]

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    fields = ["team1", "team2", "time", "group"]
    list_display = [field.name for field in Event._meta.fields]

@admin.register
class ParticipantAdmin(admin.ModelAdmin):
    list_display = [field.name for field in Participant._meta.fields]
    
@admin.register(Bet)
class BetAdmin(admin.ModelAdmin):
    fields = ["user", "event", "team1_score", "team2_score", "points", "status"]
    list_display = [
        field.name for field in Bet._meta.fields ]
