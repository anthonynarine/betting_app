import imp
from django.contrib.auth.forms import UserChangeForm, UserCreationForm
from .models import CustomUser

from django.contrib.auth.forms import UserCreationForm, UserChangeForm

class CustomUserCreationForm(UserCreationForm):
    """
    A custom form for creating a user.

    This form is based on Django's built-in UserCreationForm but is customized
    to work with a CustomUser model and only includes the 'email' field.

    Attributes:
        Meta:
            model (class): The User model that this form is associated with (CustomUser in this case).
            fields (tuple): A tuple specifying which fields from the model should be included in the form.
                            In this case, it includes only the 'email' field.
    """
    
    class Meta:
        model = CustomUser
        fields = ("email", )

class CustomUserChangeForm(UserChangeForm):
    """
    A custom form for changing user details.

    This form is based on Django's built-in UserChangeForm but is customized
    to work with a CustomUser model and only includes the 'email' field for
    changing user email.

    Attributes:
        Meta:
            model (class): The User model that this form is associated with (CustomUser in this case).
            fields (tuple): A tuple specifying which fields from the model should be included in the form.
                            In this case, it includes only the 'email' field.
    """
        
    class Meta:
        model = CustomUser
        fields = ("email", )
