from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User


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
            'access': str(refresh.access_token)
        }


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField() #logouts needs the refresh token from frontend

    def save(self):
        token = RefreshToken(self.validated_data['refresh'])
        token.blacklist() #here we take refresh token, add it to blacklist so it cannot be used again.