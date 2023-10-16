from django.db import models
from django.contrib.auth.models import AbstractUser
from django.dispatch import receiver
from django.shortcuts import get_object_or_404
from django.utils.translation import gettext_lazy as _

from .managers import CustomUserManager


def profile_picture_upload_path(instance, filename):
    return f"user/{instance.id}/profile_picture/{filename}"


class CustomUser(AbstractUser):
    username = models.CharField(_("username"), max_length=30, unique=True)
    email = models.EmailField(_("email address"), unique=True)

    profile_picture = models.FileField(
        upload_to=profile_picture_upload_path, blank=True, null=True
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]

    objects = CustomUserManager()

    def save(self, *args, **kwargs):
        """
        Overrides the default save method to delete the old profile_picture 
        if a new one is uploaded or updated.
        """
        if self.id:
            existing_instance = get_object_or_404(CustomUser, id=self.id)
            
            # Delete the old profile_picture if a different one is provided
            if existing_instance.profile_picture and self.profile_picture and existing_instance.profile_picture != self.profile_picture:
                existing_instance.profile_picture.delete(save=False)
        
        super(CustomUser, self).save(*args, **kwargs)


@receiver(models.signals.post_delete, sender=CustomUser)
def delete_associated_files(sender, instance, **kwargs):
    """
    Deletes the associated files of specified fields after a CustomUser instance is deleted.
    """
    fields_with_files_to_delete = ['profile_picture']
    for file_field_name in fields_with_files_to_delete:
        associated_file = getattr(instance, file_field_name, None)
        if associated_file:
            associated_file.delete(save=False)


    def __str__(self):
        return self.email

    
    
    
    
    

# CustomUser:
# - Attends -> Many Events (Event's attendees field)
# - Is part of -> Many Groups (if you decide to add this relationship)

# Group:
#     - Hosts -> Many Events (Event's group field)

# Event:
#     - Is attended by -> Many CustomUsers (attendees field)
#     - Is hosted by -> One Group (group field)
