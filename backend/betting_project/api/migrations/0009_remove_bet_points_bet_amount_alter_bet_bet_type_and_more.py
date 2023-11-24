# Generated by Django 4.2.3 on 2023-11-24 17:28

import api.validators.bet_validators
import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0008_bet_bet_type_bet_team_choice"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="bet",
            name="points",
        ),
        migrations.AddField(
            model_name="bet",
            name="amount",
            field=models.IntegerField(
                blank=True,
                default=0,
                help_text="The amount wagered on the bet. Defaults to 0.",
                null=True,
                validators=[django.core.validators.MinValueValidator(0)],
            ),
        ),
        migrations.AlterField(
            model_name="bet",
            name="bet_type",
            field=models.CharField(
                choices=[("Win", "Win"), ("Lose", "Lose")],
                default="",
                help_text="Select the bet type ('Win' or 'Lose')",
                max_length=4,
                validators=[api.validators.bet_validators.bet_type_validator],
            ),
        ),
        migrations.AlterField(
            model_name="bet",
            name="team_choice",
            field=models.CharField(
                choices=[("Team 1", "Team 1"), ("Team 2", "Team 2")],
                default="",
                help_text="Select the team you want to bet on",
                max_length=15,
                validators=[api.validators.bet_validators.team_choice_validator],
            ),
        ),
    ]
