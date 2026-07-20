from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User, SeekerProfile, AnswerSeeker, MentorProfile, MentorReply


class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'role', 'full_name', 'location']
        extra_kwargs = {
            'password': {'write_only': True} #password can be sent into serializer but it wont be shown in the response
        }

    def create(self, validated_data):
        user = User.objects.create_user( #create_user() automatically hashes the password.
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            role=validated_data.get('role', 'SEEKER'),
            full_name=validated_data.get('full_name', ''),
            location=validated_data.get('location', '')
        )
        if user.role == 'SEEKER':
            SeekerProfile.objects.create(user=user)

        elif user.role == 'MENTOR':
            MentorProfile.objects.create(user=user)

        else:   # BOTH
            SeekerProfile.objects.create(user=user)
            MentorProfile.objects.create(user=user)
        return user


class LoginSerializer(serializers.Serializer):
    #this is not model serializer as it is not creating a model object, it is just used to check input
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        user = authenticate( #check if sent username and password exists
            username=data['username'],
            password=data['password']
        )

        if not user:
            raise serializers.ValidationError("Invalid username or password")

        refresh = RefreshToken.for_user(user) #if exists create a jwt refresh token for that user

        return { #return the refresh and access token
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'role':user.role,
            'full_name':user.full_name,
            'location':user.location,
        }


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField() #logouts needs the refresh token from frontend

    def save(self):
        token = RefreshToken(self.validated_data['refresh'])
        token.blacklist() #here we take refresh token, add it to blacklist so it cannot be used again.

#---------------For Seeker Profile-----------------
class SeekerProfileSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source='user.full_name', read_only=True)
    location = serializers.CharField(source='user.location', required=False, allow_blank=True)
    role = serializers.CharField(source='user.role', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = SeekerProfile
        fields = [
            'id',
            'username',
            'full_name',
            'location',
            'role',
            'bio',
            'learning_goal',
            'interests',
            'custom_interest',
            'is_rural',
        ]
    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})

        if 'location' in user_data:
            instance.user.location = user_data['location']
            instance.user.save()

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance




#------------------------for mentor profile------------------
class MentorProfileSerializer(serializers.ModelSerializer):

    full_name = serializers.CharField(source='user.full_name', read_only=True)
    location = serializers.CharField(
        source='user.location',
        required=False,
        allow_blank=True
    )
    class Meta:
        model = MentorProfile
        fields = '__all__'
        read_only_fields = ['id', 'user', 'points', 'badge_level']

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})

        if 'location' in user_data:
            instance.user.location = user_data['location']
            instance.user.save()

        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance

class MentorReplySerializer(serializers.ModelSerializer):
    post_title = serializers.CharField(source='post.title', read_only=True)
    seeker_name = serializers.CharField(source='post.seeker.full_name', read_only=True)
    post_description = serializers.CharField(source="post.description", read_only=True)
    post_category = serializers.CharField(source="post.category", read_only=True)
    mentor_name = serializers.CharField(source='mentor.full_name', read_only=True)
    matched_categories = serializers.ListField(source="post.ai_categories", read_only=True)

    class Meta:
        model = MentorReply
        fields = '__all__'
        read_only_fields = ['id', 'mentor', 'post', 'created_at']

        def get_contact_info(self, obj):
            if obj.share_contact:
                return obj.contact_info
            return ""

class AnswerSeekerSerializer(serializers.ModelSerializer):
    seeker_name = serializers.CharField(source='seeker.full_name', read_only=True)
    replied = serializers.SerializerMethodField()
    replies = MentorReplySerializer(many=True, read_only=True)
    is_rural = serializers.BooleanField( source= 'seeker.seeker_profile.is_rural', read_only=True)
    selected_mentor_name = serializers.CharField( source="selected_mentor.full_name", read_only=True)
    class Meta:

        model = AnswerSeeker
        fields = ['id', 'title', 'description', 'category', 'status', 'created_at','seeker_name','replied','replies','is_rural','selected_mentor_name']
        read_only_fields = ['id', 'status', 'created_at']

    
    def get_replied(self, obj):
        request = self.context.get("request")

        if not request or request.user.is_anonymous:
            return False

        return obj.replies.filter(mentor=request.user).exists()
