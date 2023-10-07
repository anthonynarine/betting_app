from typing import Required
from .models import CustomUser
from rest_framework import serializers
from django.core.validators import EmailValidator


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        exclude = [ "password"]

# Serializer for the User model during registration
class UserSignupSerializer(serializers.ModelSerializer):
    # This field is used for confirming password, it won't be stored in the database
    password2 = serializers.CharField(
        write_only=True, required=True, style={"input_type": "password"}
    )

    class Meta:
        model = CustomUser
        fields = ["username", "email", "password", "password2"]

    # Use EmailValidator to validate the email field
    email = serializers.EmailField(
        validators=[EmailValidator(message="Invalid email format.")]
    )

    def validate_password(self, value):
        """
        Check the validity of the password field on its own.
        """
        # Example: Check if password is too short
        if len(value) < 6:
            raise serializers.ValidationError("The password is too short.")
        return value

    def validate(self, data):
        """
        Ensure that the passwords provided match.
        """
        password = data.get("password")
        password2 = data.pop("password2")
        if password != password2:
            raise serializers.ValidationError("Passwords do not match.")
        return data

    def create(self, validated_data):
        """
        Create a new user instance using the validated data.
        """
        user = CustomUser.objects.create_user(**validated_data)
        return user

    # def validate_email(self, value):
    #     """
    #     Log email value and validation result for debugging.
    #     """
    #     print(f"Received email: {value}")
    #     result = EmailValidator()(value)
    #     print(f"Validation result: {result}")
    #     return value