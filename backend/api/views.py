from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from core.supabase_client import supabase
from rest_framework import status
from core.supabase_client import supabase
from .models import CommunityPost, UserProfile, SocialLink, Like, College, PostMedia
from .serializers import CommunityPostSerializer
from backend.settings import POSTS_MEDIA_BUCKET_NAME
from core.utils import upload_post_file_to_supabase, file_type

class CommunityPostView(APIView):
    permission_classes = [IsAuthenticated]
    def get_single_post(self, user_id, post_id):
        try:
            post_queryset = CommunityPost.objects.filter(id=post_id)
            if not post_queryset.exists():
                return Response({"message":"No data found"}, status=status.HTTP_404_NOT_FOUND)
            post = post_queryset.first()
            serializer = CommunityPostSerializer(post)
            return Response({"data":serializer.data}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"error":e.info}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
    def get_posts_from_college(self, college_id):
        return True
        
    def get(self, request, *args, **kwargs):
        post_id = kwargs.get("post_id", None)
        college_id = kwargs.get("college_id", None)
        single_post = False
        if post_id: 
            single_post = bool(post_id)
        if single_post:      
            return self.get_single_post(post_id=post_id)
        if college_id:
            return self.get_posts_from_college(college_id=college_id)
    
    def post(self, request, *args, **kwargs):
        required_params = ["author_id", "title", "content"]
        for param in required_params:
            if not request.data.get(param, None):
                return Response({"error": f"{param} not provided"}, status=status.HTTP_400_BAD_REQUEST)
        author_id = request.data.get("author_id")
        authorqs = UserProfile.objects.filter(user_id=author_id)
        if not authorqs.exists():
            return Response({"error":"User not found"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        author = authorqs.first()
        title = request.data.get('title')
        content = request.data.get('content')
        try: 
            newpost = CommunityPost.objects.create(
                title = title,
                content = content,
                author = author,
                is_anonymous = request.data.get("is_anonymous", False)
            )
            files = request.data.get('media', [])
            if len(files) > 0:
                file_objs = []
                path = f"post/{newpost.id}/"
                for file in files:
                    file_type = file_type(file.get('filename'))
                    if file_type.lower() == 'unknown':
                        continue
                    curr_path = path + str(file.get('filename'))
                    url = upload_post_file_to_supabase(file=file, filename_with_path=curr_path)
                    file_dict = {
                        'post': newpost,
                        'file_url': url,
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
            return Response({"error":e.info}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class LoginUserView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        if not email or not password:
            return Response({"error": "Email and password are required."}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            auth_response = supabase.auth.sign_in_with_password({
                "email": email,
                "password": password
            })

            # If login fails, user['error'] will exist
            if "error" in auth_response:
                return Response({"error": auth_response["error"]["message"]}, status=status.HTTP_400_BAD_REQUEST)
            
            user_data = auth_response.user
            session_data = auth_response.session
            
            return Response({
                "message": "Login successful",
                "user": {
                    "id": user_data.id,
                    "email": user_data.email,
                    "role": user_data.role,
                    "confirmed_at": user_data.confirmed_at
                },
                "session": {
                    "access_token": session_data.access_token,
                    "refresh_token": session_data.refresh_token,
                    "expires_at": session_data.expires_at
                }
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SignupUserView(APIView):
    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        user = supabase.auth.sign_up({
            "email": email,
            "password": password
        })

        return Response(user)