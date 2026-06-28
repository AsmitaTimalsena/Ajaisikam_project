import pytest
from accounts.models import User, MentorReply, MentorProfile
from rest_framework.test import APIClient

@pytest.fixture
def dummy_users(db):
    users = []
    for i in range(1, 6):
        user = User.objects.create_user(
            username=f'testuser{i}',
            email=f'testuser{i}@gmail.com',
            password=f'TestUser{i}@123',
            role='SEEKER',
            full_name=f'Test User {i}',
            location='Kathmandu'
        )
        users.append(user)
    return users

@pytest.fixture
def auth_client(dummy_users):
    client = APIClient()

    response = client.post('/api/login/', {
        'username': 'testuser1',
        'password': 'TestUser1@123'
    }, format='json')

    access_token = response.data['access']
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
    return client


@pytest.fixture
def mentor_client(db):
    mentor = User.objects.create_user(
        username='mentor1',
        email='mentor1@gmail.com',
        password='Mentor@123',
        role='MENTOR',
        full_name='Mentor One',
        location = 'Kathmandu'
    )

    MentorProfile.objects.create(user=mentor)

    client = APIClient()
    response = client.post('/api/login/',{
        'username': 'mentor1',
        'password':'Mentor@123'
    }, format='json')

    access = response.data['access']
    client.credentials(HTTP_AUTHORIZATION=f'Bearer {access}')

    return client