from django.core.exceptions import ValidationError


def team_choice_validator(value):
    valid_choices = ["Team 1", "Team 2"]
    if value not in valid_choices:
        raise ValidationError("Invalid team choice. Choose either 'Team 1' or 'Team 2'.")
    

def bet_type_validator(value):
    valid_choices = ["Win", "Lose"]
    if value not in valid_choices:
        raise ValidationError("Invalid bet type. Chose either 'Win' or 'Lose'. ")