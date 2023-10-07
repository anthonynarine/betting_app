from django.db import models
from django.contrib.auth.models import AbstractUser


from django.contrib.auth.models import AbstractUser
from django.db import models
from django.utils.translation import gettext_lazy as _

from .managers import CustomUserManager


def profile_picture_upload_path(instance, filename):
    return f"user/{instance.id}/profile_picture/{filename}"


class CustomUser(AbstractUser):
    username = None
    email = models.EmailField(_("email address"), unique=True)

    profile_picture = models.FileField(
        upload_to=profile_picture_upload_path, blank=True, null=True
    )
    # filefield used insted of imagefield b/c file field supports svg's img does not

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.email
