'''
before creating models and views:

import pytest
from rest_framework.test import APIClient

@pytest.mark.django_db
def test_user_registration(dummy_users):
    client = APIClient() #creating a fake browser. We'll use this to send requests like a real user would.
    
    for i, user in enumerate(dummy_users, 1):
        response = client.post('/api/register/', { #sending post request with user data likein registration form submission
            'username': f'testuser{i}',
            'email': f'testuser{i}@example.com',
            'password': f'TestPass{i}@123'
        })
        assert response.status_code == 201 # Checking the result, 201 for successful
    '''
import pytest
from rest_framework.test import APIClient
from accounts.models import User


@pytest.mark.django_db
class TestAuthJWT:

    def test_user_registration(self):
        client = APIClient()

        response = client.post('/api/register/', {
            'username': 'newuser',
            'email': 'newuser@example.com',
            'password': 'NewUser@123',
            'role': 'SEEKER',
            'full_name': 'New User',
            'location': 'Kathmandu'
        }, format='json')

        assert response.status_code == 201
        assert User.objects.filter(username='newuser').exists()

    def test_registration_for_5_dummy_users(self):
        client = APIClient()

        for i in range(1, 6):
            response = client.post('/api/register/', {
                'username': f'dummyuser{i}',
                'email': f'dummyuser{i}@example.com',
                'password': f'DummyPass{i}@123',
                'role': 'SEEKER',
                'full_name': f'Dummy User {i}',
                'location': 'Kathmandu'
            }, format='json')

            assert response.status_code == 201
            assert User.objects.filter(username=f'dummyuser{i}').exists()

    def test_user_login_returns_jwt_tokens(self, dummy_users):
        client = APIClient()

        response = client.post('/api/login/', {
            'username': 'testuser1',
            'password': 'TestUser1@123'
        }, format='json')

        assert response.status_code == 200
        assert 'access' in response.data
        assert 'refresh' in response.data

    def test_user_logout_blacklists_refresh_token(self, dummy_users):
        client = APIClient()

        login_response = client.post('/api/login/', {
            'username': 'testuser1',
            'password': 'TestUser1@123'
        }, format='json')

        assert login_response.status_code == 200

        access_token = login_response.data['access']
        refresh_token = login_response.data['refresh']

        client.credentials(HTTP_AUTHORIZATION=f'Bearer {access_token}')
        logout_response = client.post('/api/logout/', {
            'refresh': refresh_token
        }, format='json')

        assert logout_response.status_code == 205
        assert logout_response.data['message'] == 'Logout successful'