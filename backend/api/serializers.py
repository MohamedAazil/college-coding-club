from rest_framework.serializers import ModelSerializer, SerializerMethodField
from .models import  CommunityPost, UserProfile

class CommunityPostSerializer(ModelSerializer):
    class Meta: 
        fields = ['id', 'title', 'content', 'author_name', 'created_at', 'like_count', 'dislike_count', 'author_avatar', 'coverImg']
        model = CommunityPost
        
    author_name = SerializerMethodField()
    author_avatar = SerializerMethodField()
    
    def get_author_name(self, obj):
        if obj.is_anonymous:
            return "Anonymous"
        return obj.author.name
    
    def get_author_avatar(self, obj):
        return obj.author.profile_img_url
    
class UserProfileSerializer(ModelSerializer):
    fields = "__all__"
    model = UserProfile