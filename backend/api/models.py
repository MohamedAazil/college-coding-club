from django.db import models
from django.contrib.postgres.indexes import Gin
from django.contrib.postgres.search import SearchVectorField
from django.contrib.contenttypes.models import ContentType
# Create your models here.

class CommunityPosts(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    author_id = models.IntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    search_vector = SearchVectorField(null=True)
    like_count = models.IntegerField(default=0)
    dislike_count = models.IntegerField(default=0)
    is_anonymous = models.BooleanField(default=False)
    
    class Meta:
        indexes = [
            Gin(fields=['search_vector'])
        ]

    def __str__(self):
        return self.title
    
class Comments(models.Model):
    comment_id = models.AutoField(primary_key=True)
    post = models.ForeignKey(CommunityPosts, on_delete=models.CASCADE)
    author_id = models.IntegerField()
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    parent_comment_id = models.IntegerField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_updated = models.BooleanField(default=False)
    status = models.CharField(max_length=20, default='active')  # e.g., active, deleted, edited

    class Meta:
        indexes = [
            models.Index(fields=['post']),
            models.Index(fields=['author_id']),
            models.Index(fields=['parent_comment_id'])
        ]
    def __str__(self):
        return f"{self.author_id}: {self.content[:30]}"

class Like(models.Model):
    Like = 'like'
    Dislike = 'dislike'
    REACTION_CHOICES = [
        (Like, 'Like'),
        (Dislike, 'Dislike'),
    ]
    
    user_id = models.IntegerField()
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.IntegerField()
    content_object = models.GenericForeignKey('content_type', 'object_id')
    creared_at = models.DateTimeField(auto_now_add=True)
    reaction_type = models.CharField(max_length=7, choices=REACTION_CHOICES)
    
    class Meta: 
        unique_togther = ('user_id', 'content_type', 'object_id')