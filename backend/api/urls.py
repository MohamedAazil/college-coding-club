from django.urls import path
from .views import CommunityPostView, UserProfileDataView, PostReactionView

urlpatterns = [
    path('community-posts', CommunityPostView.as_view(), name='community-posts'),
    path('user-profile', UserProfileDataView.as_view(), name='get-user-profile') ,  
    path('post-reaction', PostReactionView.as_view(), name='post-reaction') ,  
]
