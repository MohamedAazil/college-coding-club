from django.urls import path
from .views import SignupUserView, LoginUserView, CommunityPostView

urlpatterns = [
    path('post', CommunityPostView.as_view(), name='post'),
]
