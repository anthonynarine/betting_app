
from django.contrib import admin
from .models import Group, Event, Member

@admin.register(Group)
class GroupAdmin(admin.ModelAdmin):
    fields = ["name", "location", "description"]
    list_display = ["id", "name", "location", "description"]
    
@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    fields = ["team1", "team2", "time", "team1_score", "team2_score", "group"] 
    list_display = [field.name for field in Event._meta.fields]  
    
@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    fields = [field.name for field in Member._meta.fields if field.name not in ['id', 'joined_at']]
    list_display = [field.name for field in Member._meta.fields]