from django.urls import path
from .views import SignupUserView, LoginUserView, CommunityPostView

urlpatterns = [
    path('signup', SignupUserView.as_view(), name='signup'),
    path('login', LoginUserView.as_view(), name='login'),
    path('post', CommunityPostView.as_view(), name='post'),
]
