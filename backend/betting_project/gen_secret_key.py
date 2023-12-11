from django.core.management.utils import get_random_secret_key

new_secret_key = get_random_secret_key()
print(new_secret_key)
