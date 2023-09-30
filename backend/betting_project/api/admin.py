
from django.contrib import admin
from .models import Group

@admin.register(Group)
class GroudAdmin(admin.ModelAdmin):
    fields = ["name", "location", "description"]
    list_display = ["id", "name", "location", "description"]
