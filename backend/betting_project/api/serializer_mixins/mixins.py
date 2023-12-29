from rest_framework import serializers

class BannerImageMixin:
    banner_image = serializers.SerializerMethodField()
    
    def get_banner_image(self, instance):
        if instance.banner_image:
            return instance.banner_image.url
        else:
            return "https://source.unsplash.com/random/?sports"
            