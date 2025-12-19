from rest_framework.serializers import ModelSerializer, SerializerMethodField
from .models import  CommunityPost, UserProfile, Like
from django.contrib.contenttypes.models import ContentType

class CommunityPostSerializer(ModelSerializer):
    class Meta: 
        fields = ['id', 'post_id', 'title', 'content', 'author_name', 'created_at', 'like_count', 'dislike_count', 'author_avatar', 'coverImg', 'is_liked_by_user', 'is_disliked_by_user']
        model = CommunityPost
        
    author_name = SerializerMethodField()
    author_avatar = SerializerMethodField()
    is_liked_by_user = SerializerMethodField()
    is_disliked_by_user = SerializerMethodField()
    
    def get_author_name(self, obj):
        if obj.is_anonymous:
            return "Anonymous"
        return obj.author.name
    
    def get_author_avatar(self, obj):
        return obj.author.profile_img_url
    
    def get_is_liked_by_user(self, obj):
        request = self.context.get("request")
        if not request or not request.user.get('aud'):
            return False
        content_type = ContentType.objects.get_for_model(CommunityPost)
        return Like.objects.filter(
            user_id=request.user.get('sub'),
            object_id=obj.id,
            content_type=content_type,
            reaction_type=Like.Like
        ).exists()

    def get_is_disliked_by_user(self, obj):
        request = self.context.get("request")
        if not request or not request.user.get('aud'):
            return False
        content_type = ContentType.objects.get_for_model(CommunityPost)
        return Like.objects.filter(
            user_id=request.user.get('sub'),
            object_id=obj.id,
            content_type=content_type,
            reaction_type=Like.Dislike
        ).exists()
    
class UserProfileSerializer(ModelSerializer):
    class Meta:
        fields = ['id', 'name', 'age', 'college', 'year', 'profile_img_url']
        model = UserProfile