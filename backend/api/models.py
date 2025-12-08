from django.db import models
from django.contrib.postgres.indexes import GinIndex
from django.contrib.postgres.search import SearchVectorField
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey
# Create your models here.

class College(models.Model):
    college_name = models.TextField()
    address = models.CharField(max_length=50, blank=True, null=True)

class UserProfile(models.Model):
    user_id = models.CharField(max_length=255, unique=True) #supabase user id
    name = models.TextField(null=False)
    age = models.IntegerField(null=True, blank=True) 
    college = models.ForeignKey(College, on_delete=models.SET_NULL, null=True, blank=True, related_name="users")
    year = models.IntegerField()
    
class SocialLink(models.Model):
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="social_links")
    platform = models.CharField(max_length=255)
    url = models.URLField()
    shared = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.platform}: {self.user.name}"

class CommunityPost(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    author = models.ForeignKey(UserProfile, on_delete=models.CASCADE, null=True, blank=True, related_name="posts")
    created_at = models.DateTimeField(auto_now_add=True)
    search_vector = SearchVectorField(null=True)
    like_count = models.IntegerField(default=0)
    dislike_count = models.IntegerField(default=0)
    is_anonymous = models.BooleanField(default=False)
    
    class Meta:
        indexes = [
            GinIndex(fields=['search_vector'])
        ]

    def __str__(self):
        return self.title
    
class PostMedia(models.Model):
    file_type_choices = [('image', 'Image'),('video','Video'), ('pdf','PDF')]
    post = models.ForeignKey(CommunityPost, on_delete=models.CASCADE, related_name="media")
    file_url = models.URLField()
    file_type = models.CharField(choices=file_type_choices)
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
class Comment(models.Model):
    comment_id = models.AutoField(primary_key=True)
    post = models.ForeignKey(CommunityPost, on_delete=models.CASCADE)
    author_id = models.IntegerField()
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    parent_comment_id = models.IntegerField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_updated = models.BooleanField(default=False)
    status = models.CharField(max_length=20, default='active')  # e.g., active, deleted, edited
    gold_coins = models.BigIntegerField(default=0)

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
    content_object = GenericForeignKey('content_type', 'object_id')
    creared_at = models.DateTimeField(auto_now_add=True)
    reaction_type = models.CharField(max_length=7, choices=REACTION_CHOICES)
    
    class Meta: 
        unique_together = ('user_id', 'content_type', 'object_id')