from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from core.supabase_client import supabase
from rest_framework import status
from core.supabase_client import supabase
from .models import CommunityPost, UserProfile, SocialLink, Like, College, PostMedia, CommunityPostQueueEntry
from .serializers import CommunityPostSerializer, UserProfileSerializer
from backend.settings import POSTS_MEDIA_BUCKET_NAME
from core.utils import upload_post_file_to_supabase, get_file_type, extract_text_from_json
from django.contrib.contenttypes.models import ContentType

class UserProfileDataView(APIView):
    def post(self, request, *args, **kwargs):
        try: 
            supabase_user_id = request.data.get("userId")
            userqs = UserProfile.objects.filter(user_id=supabase_user_id)
            if not userqs: 
                return Response({"error": "User profile not created"}, status=status.HTTP_403_FORBIDDEN)
            user = userqs.first()
            serializer = UserProfileSerializer(user)
                
            return Response({"data": serializer.data}, status=status.HTTP_200_OK)
        except Exception as e: 
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CommunityPostView(APIView):
    # permission_classes = [IsAuthenticated]
    def get_single_post(self, request, user_id, post_id):
        try:
            post_queryset = CommunityPost.objects.filter(id=post_id)
            if not post_queryset.exists():
                return Response({"message":"No data found"}, status=status.HTTP_404_NOT_FOUND)
            post = post_queryset.first()
            serializer = CommunityPostSerializer(post, context={'request':request})
            return Response({"data":serializer.data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error":e.info}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def get_posts_from_college(self, college_id):
        return True
        
    def get(self, request, *args, **kwargs):
        post_id = kwargs.get("post_id", None)
        college_id = kwargs.get("college_id", None)
        author_id = request.query_params.get("author_id", None)
        pagination = kwargs.get("post_count", 25)
        single_post = False
        if post_id:
            return self.get_single_post(post_id=post_id, request=request)
        try: 
            postquerySet = CommunityPost.objects.order_by("like_count", "created_at")
            if college_id:
                college = College.objects.filter(id=college_id)
                postquerySet.filter(college=college)
            if author_id: 
                author = UserProfile.objects.filter(user_id=author_id).first()
                postquerySet.filter(author=author)
            posts = postquerySet[:25]
            serializer = CommunityPostSerializer(posts, many=True, context={'request':request})
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR) 
    
    def post(self, request, *args, **kwargs):
        required_params = ["author_id", "title", "content_json"]
        for param in required_params:
            if not request.data.get(param, None):
                return Response({"error": f"{param} not provided"}, status=status.HTTP_400_BAD_REQUEST)
        author_id = request.data.get("author_id")
        authorqs = UserProfile.objects.filter(user_id=author_id)
        if not authorqs.exists():
            return Response({"error":"User not found"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        author = authorqs.first()
        title = request.data.get('title')
        content_json = request.data.get('content_json')
        coverImgUrl = request.data.get('coverImgUrl')
        content = request.data.get('content_text')
        try: 
            post_queue_entry = CommunityPostQueueEntry.objects.create(flagged = False)
            newpost = CommunityPost.objects.create(
                post_id = post_queue_entry.post_id,
                title = title,
                content_json = content_json,
                content = content,
                coverImg = coverImgUrl,
                author = author,
                is_anonymous = request.data.get("is_anonymous", False)
            )
            files = request.data.get('media', [])
            if len(files) > 0:
                file_objs = []
                for file in files:
                    file_type = get_file_type(file)
                    if file_type.lower() == 'unknown':
                        continue
                    file_dict = {
                        'post': newpost,
                        'file_url': file,
                        'file_type': file_type
                    }
                    file_objs.append(file_dict)

                post_media_objs = [
                    PostMedia(
                        post=file_obj.get('post'),
                        file_url=file_obj.get('file_url'),
                        file_type=file_obj.get('file_type')
                    )
                    for file_obj in file_objs
                ]
                bulk_creat_res = PostMedia.objects.bulk_create(post_media_objs)

            return Response({"message": "Post created"}, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class PostReactionView(APIView):
    def post(self, request, *args, **kwargs):
        try: 
            post_id = request.data.get('post_id')
            community_post_obj = CommunityPost.objects.filter(post_id=post_id).first()
            if not community_post_obj: return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)
            reaction_type = request.data.get('reaction')
            content_type = ContentType.objects.get_for_model(CommunityPost)
            reaction_record, created = Like.objects.update_or_create(
                user_id = request.user.get('sub'),
                object_id = community_post_obj.id,
                content_type=content_type,
                defaults={
                "reaction_type": reaction_type}
            )
            if reaction_type == Like.Like:
                community_post_obj.like_count += 1
                if not created: 
                    community_post_obj.dislike_count -= 1 
            elif reaction_type == Like.Dislike:
                community_post_obj.dislike_count += 1
                if not created: 
                    community_post_obj.like_count -= 1 
            community_post_obj.save()
            
            return Response({"message": f"Reaction {reaction_type} saved"})
        except Exception as e:
            return Response(str(e), status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        