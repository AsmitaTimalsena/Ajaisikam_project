import pytest
from accounts.models import SeekerProfile, AnswerSeeker


@pytest.mark.django_db
class TestSeekerFeatures:

    def test_seeker_profile_created_after_registration(self):
        from rest_framework.test import APIClient
        client = APIClient()

        response = client.post('/api/register/', {
            'username': 'seeker1',
            'email': 'seeker1@example.com',
            'password': 'Seeker@123',
            'role': 'SEEKER',
            'full_name': 'Seeker One',
            'location': 'Kathmandu'
        }, format='json')

        assert response.status_code == 201
        assert SeekerProfile.objects.filter(user__username='seeker1').exists()

    def test_get_seeker_profile(self, auth_client):
        response = auth_client.get('/api/seeker/profile/')

        assert response.status_code == 200
        assert 'full_name' in response.data
        assert 'interests' in response.data

    def test_update_seeker_profile(self, auth_client):
        response = auth_client.put('/api/seeker/profile/', {
            'bio': 'I am interested in web development',
            'learning_goal': 'I want guidance in AI/ML',
            'interests': ['TECH','OTHER'],
            'custom_interest': 'Study Abroad',
            'is_rural': True
        }, format='json')

        assert response.status_code == 200
        assert response.data['bio'] == 'I am interested in web development'
        assert response.data['interests'] == ['TECH','OTHER']

    def test_create_seeker_post(self, auth_client):
        response = auth_client.post('/api/seeker/posts/', {
            'title': 'Need help in web development',
            'description': 'I want guidance on Django and React roadmap',
            'category': 'TECH'
        }, format='json')

        assert response.status_code == 201
        assert AnswerSeeker.objects.filter(title='Need help in web development').exists()

    def test_get_seeker_posts(self, auth_client):
        auth_client.post('/api/seeker/posts/', {
            'title': 'Need help in interviews',
            'description': 'I need interview preparation guidance',
            'category': 'CAREER'
        }, format='json')

        response = auth_client.get('/api/seeker/posts/')

        assert response.status_code == 200
        assert isinstance(response.data, list)

    def test_update_seeker_post(self, auth_client):
        create_response = auth_client.post('/api/seeker/posts/', {
            'title': 'Old title',
            'description': 'Old description',
            'category': 'TECH'
        }, format='json')

        post_id = create_response.data['id']

        response = auth_client.put(f'/api/seeker/posts/{post_id}/', {
            'title': 'Updated title',
            'description': 'Updated description'
        }, format='json')

        assert response.status_code == 200
        assert response.data['title'] == 'Updated title'

    def test_delete_seeker_post(self, auth_client):
        create_response = auth_client.post('/api/seeker/posts/', {
            'title': 'Delete me',
            'description': 'This post will be deleted',
            'category': 'TECH'
        }, format='json')

        post_id = create_response.data['id']

        response = auth_client.delete(f'/api/seeker/posts/{post_id}/')

        assert response.status_code == 204
        assert not AnswerSeeker.objects.filter(id=post_id).exists()