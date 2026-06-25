from django.urls import path
from .views import Register, Login, Logout, SeekerProfileView, AnswerSeekerListCreateView, AnswerSeekerDetailView

urlpatterns = [
    path('register/', Register.as_view(), name='register'),
    path('login/', Login.as_view(), name='login'),
    path('logout/', Logout.as_view(), name='logout'),


    #for seeker profile
    path('seeker/profile/', SeekerProfileView.as_view(),name='seeker-profile'),
    path('seeker/posts/', AnswerSeekerListCreateView.as_view(), name='seeker-posts'),
    path('seeker/posts/<uuid:pk>/', AnswerSeekerDetailView.as_view(), name='seeker-post-detail'),

]