from celery import shared_task
from better_profanity import profanity
from .models import CommunityPost
from .services.moderation_ai import ai_moderate
import logging

# Get a logger for this module
logger = logging.getLogger(__name__)

@shared_task(
    bind=True, 
    autoretry_for=(Exception,),
    retry_backoff=10,
    rety_kwargs={'max_retries':3},
    rate_limit='10/m'
)
def moderate_community_post(self, post_id):
    post = CommunityPost.objects.get(post_id=post_id)
    text = f"{post.title} {post.content}"
    
    is_flagged = ai_moderate(text, logger)
    post.is_flagged = is_flagged if is_flagged != None else False
    post.pendingModeration = False
    post.save()
        