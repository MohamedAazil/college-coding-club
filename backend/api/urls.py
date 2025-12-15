from django.urls import path
from .views import CommunityPostView, UserProfileDataView

urlpatterns = [
    path('community-posts', CommunityPostView.as_view(), name='community-posts'),
    path('user-profile', UserProfileDataView.as_view(), name='get-user-profile')    
]
