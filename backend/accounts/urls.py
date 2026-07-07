from django.urls import path
from .views import Register, Login, Logout, SeekerProfileView, AnswerSeekerListCreateView, AnswerSeekerDetailView, MentorProfileView, MentorReplyDetailView, MentorReplyListCreateView
from .views import MentorRecommendedPostsView, MentorMyRepliesView, SeekerRecommendedMentorsView
urlpatterns = [
    path('register/', Register.as_view(), name='register'),
    path('login/', Login.as_view(), name='login'),
    path('logout/', Logout.as_view(), name='logout'),


    #for seeker profile
    path('seeker/profile/', SeekerProfileView.as_view(),name='seeker-profile'),
    path('seeker/posts/', AnswerSeekerListCreateView.as_view(), name='seeker-posts'),
    path('seeker/posts/<uuid:pk>/', AnswerSeekerDetailView.as_view(), name='seeker-post-detail'),


    #for mentor profile
    path('mentor/profile/', MentorProfileView.as_view()),
    path('mentor/posts/', MentorRecommendedPostsView.as_view(), name='mentor-posts'),

    path('mentor/posts/<uuid:post_id>/replies/', MentorReplyListCreateView.as_view(),  name='mentor-replies'),

    path('mentor/replies/<uuid:pk>/', MentorReplyDetailView.as_view()),
    path('mentor/replies/',MentorMyRepliesView.as_view(),name='mentor-my-replies'),
    path('seeker/recommended-mentors/', SeekerRecommendedMentorsView.as_view(), name='seeker-recommended-mentors'),

]

