from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.postgres.search import SearchVector
from django.db import models

from .models import CommunityPost
from core.utils import extract_text_from_json

@receiver(post_save, sender=CommunityPost)
def update_search_vector(sender, instance, *args, **kwargs):
    content = instance.content
    
    CommunityPost.objects.filter(id=instance.id).update(
        search_vector = 
            SearchVector('title', weight='A') + 
            SearchVector(models.Value(content), weight='B')
    )