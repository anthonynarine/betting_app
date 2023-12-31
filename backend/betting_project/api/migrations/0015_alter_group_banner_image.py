# Generated by Django 4.2.3 on 2023-12-29 05:14

import api.models
from django.db import migrations, models
import validators.img_validators


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0014_group_banner_image"),
    ]

    operations = [
        migrations.AlterField(
            model_name="group",
            name="banner_image",
            field=models.ImageField(
                blank=True,
                default=api.models.default_banner_image,
                help_text="The image for the group card",
                null=True,
                upload_to=api.models.banner_image_upload_path,
                validators=[validators.img_validators.validate_image_file_extension],
            ),
        ),
    ]
