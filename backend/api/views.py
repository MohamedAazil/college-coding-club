from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from core.supabase_client import supabase
from rest_framework import status
from core.supabase_client import supabase
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