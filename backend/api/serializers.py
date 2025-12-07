from rest_framework.serializers import Serializer
from .models import  CommunityPost

class CommunityPostSerializer(Serializer):
    fields = ['id', 'title', 'content', 'author_name', 'created_at', 'like_count', 'dislike_count']
    model = CommunityPost
    
    def get_author_name(self, obj):
        if obj.author.is_anonymous:
            return "Anonymous"
        return obj.author.name