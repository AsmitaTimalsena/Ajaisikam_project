from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from django.shortcuts import get_object_or_404
from .ai_matching import get_ai_category

from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    LogoutSerializer,
    SeekerProfileSerializer,
    AnswerSeekerSerializer, MentorProfileSerializer, MentorReplySerializer
)
from .models import SeekerProfile, AnswerSeeker, MentorProfile, MentorReply

class Register(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()

            # if seeker or both -> create empty seeker profile automatically
            if user.role in ['SEEKER', 'BOTH']:
                SeekerProfile.objects.get_or_create(user=user)

            return Response({'message': 'User registered successfully'}, status=201)
        return Response(serializer.errors, status=400)

class Login(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.validated_data, status=200)
        return Response(serializer.errors, status=400)


class Logout(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = LogoutSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Logout successful'}, status=205)
        return Response(serializer.errors, status=400)
    
    #--------------views for seeeker profile-----------


class SeekerProfileView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile, created = SeekerProfile.objects.get_or_create(user=request.user)
        serializer = SeekerProfileSerializer(profile)
        return Response(serializer.data, status=200)

    def put(self, request):
        profile, created = SeekerProfile.objects.get_or_create(user=request.user)
        serializer = SeekerProfileSerializer(profile, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)



class AnswerSeekerListCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        posts = AnswerSeeker.objects.filter(seeker=request.user).order_by('-created_at')
        serializer = AnswerSeekerSerializer(posts, many=True)
        return Response(serializer.data, status=200)

    def post(self, request):
        serializer = AnswerSeekerSerializer(data=request.data)
        if serializer.is_valid():
            post = serializer.save(seeker=request.user)

            # To stop server lagging,  run AI once at creation and save to database
            top_categories, ai_override, confidence = get_ai_category(
                post.title,
                post.description,
                post.category
            )
            post.ai_categories = top_categories
            post.ai_confidence = confidence
            post.save()
            response_data = serializer.data

            text = f"{post.title} {post.description}"

            if len(text.split()) < 20:
                response_data["warning"] = (
                    "Your description seems a bit short. Adding more details will help us match you with the right mentor."
                )

            return Response(response_data, status=201)
        return Response(serializer.errors, status=400)


class AnswerSeekerDetailView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, pk):
        try:
            post = AnswerSeeker.objects.get(id=pk, seeker=request.user)
        except AnswerSeeker.DoesNotExist:
            return Response({'error': 'Post not found'}, status=404)

        serializer = AnswerSeekerSerializer(post, data=request.data, partial=True)
        if serializer.is_valid():
            post = serializer.save()

            #Re-run AI when post is edited
            top_categories, ai_override, confidence = get_ai_category(
                post.title,
                post.description,
                post.category
            )
            post.ai_categories = top_categories
            post.ai_confidence = confidence
            post.save()

            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        try:
            post = AnswerSeeker.objects.get(id=pk, seeker=request.user)
        except AnswerSeeker.DoesNotExist:
            return Response({'error': 'Post not found'}, status=404)

        post.delete()
        return Response({'message': 'Post deleted successfully'}, status=204)


#-------------------Mentor Profile Views/Pages--------------
class MentorProfileView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        profile = request.user.mentor_profile
        serializer = MentorProfileSerializer(profile)
        return Response(serializer.data)

    def put(self, request):
        profile = request.user.mentor_profile
        serializer = MentorProfileSerializer(profile, data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)
    

class MentorReplyListCreateView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, post_id):
        replies = MentorReply.objects.filter(post_id=post_id)
        serializer = MentorReplySerializer(replies, many=True)
        return Response(serializer.data)

    def post(self, request, post_id):

        serializer = MentorReplySerializer(data=request.data)

        if serializer.is_valid():

            serializer.save(
                mentor=request.user,
                post_id=post_id
            )

            profile = request.user.mentor_profile
            profile.points += 5

            if profile.points >= 100:
                profile.badge_level = 'PLATINUM'
            elif profile.points >= 60:
                profile.badge_level = 'GOLD'
            elif profile.points >= 30:
                profile.badge_level = 'SILVER'
            else:
                profile.badge_level = 'BRONZE'

            profile.save()

            return Response(serializer.data, status=201)

        return Response(serializer.errors, status=400)
    
class MentorRecommendedPostsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # posts = AnswerSeeker.objects.filter(status='OPEN').order_by('-created_at')
        # serializer = AnswerSeekerSerializer(posts, many=True, context={'request':request})
        # return Response(serializer.data)

        mentor_pfoile = request.user.mentor_profile
        mentor_expertise = mentor_pfoile.expertise 
        all_posts = AnswerSeeker.objects.filter(status="OPEN").order_by('-created_at')

        matched_posts = []

        for post in all_posts:
        # ai_categories is  a list e.g. ["BIOLOGY", "RESEARCH"]
            ai_categories = post.ai_categories if post.ai_categories else [post.category]

            # Show post if mentor expertise matches ANY of the top categories
            if any(cat in mentor_expertise for cat in ai_categories):
                serializer = AnswerSeekerSerializer(post, context={'request': request})
                post_data = serializer.data
                matched_categories = [
                    cat for cat in ai_categories
                    if cat in mentor_expertise
                ]

                post_data['matched_categories'] = matched_categories
                post_data['ai_confidence'] = post.ai_confidence
                post_data['ai_override'] = post.category not in ai_categories
                matched_posts.append(post_data)

        return Response(matched_posts)
    
    
class MentorReplyDetailView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, pk):

        reply = MentorReply.objects.get(pk=pk)

        if reply.mentor != request.user:
            return Response({"error": "Not allowed"}, status=status.HTTP_403_FORBIDDEN) #this ensures that one mentor cannot edit or delete another mentor's reply

        serializer = MentorReplySerializer(reply, data=request.data, partial=True)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=400)

    def delete(self, request, pk):

        reply = MentorReply.objects.get(pk=pk)

        if reply.mentor != request.user:
            return Response({"error": "Not allowed"}, status=status.HTTP_403_FORBIDDEN)

        reply.delete()

        return Response(status=204)
    
#endpoint where mentor can see their history of replies
class MentorMyRepliesView(APIView):

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        replies = MentorReply.objects.filter(
            mentor=request.user
        ).order_by('-created_at')

        serializer = MentorReplySerializer(replies, many=True)
        return Response(serializer.data)


class SeekerRecommendedMentorsView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # first get seekers interest
        try:
            seeker_profile = request.user.seeker_profile
            seeker_interests = seeker_profile.interests
        except SeekerProfile.DoesNotExist:
            return Response({"error": "Seeker profile not found."}, status=404)

        if not seeker_interests:
            return Response([])

        # match with expertise
        matched_mentors = []

        mentors = MentorProfile.objects.all()

        for mentor in mentors:
            overlap = [cat for cat in mentor.expertise if cat in seeker_interests]

            if overlap:
                matched_mentors.append({
                    "id": str(mentor.id),
                    "full_name": mentor.user.full_name,
                    "expertise": mentor.expertise,
                    "experience": mentor.experience,
                    "bio": mentor.bio,
                    "badge_level": mentor.badge_level,
                    "points": mentor.points,
                    "matched_on": overlap  # which categories matched
                })

        # higher badge mentors first ==> sorting
        matched_mentors.sort(key=lambda x: x["points"], reverse=True)

        # return top 3 only
        return Response(matched_mentors[:3])