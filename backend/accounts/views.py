from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from .serializers import (
    RegisterSerializer,
    LoginSerializer,
    LogoutSerializer,
    SeekerProfileSerializer,
    AnswerSeekerSerializer
)
from .models import SeekerProfile, AnswerSeeker

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
            serializer.save(seeker=request.user)
            return Response(serializer.data, status=201)
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
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)

    def delete(self, request, pk):
        try:
            post = AnswerSeeker.objects.get(id=pk, seeker=request.user)
        except AnswerSeeker.DoesNotExist:
            return Response({'error': 'Post not found'}, status=404)

        post.delete()
        return Response({'message': 'Post deleted successfully'}, status=204)


