import pytest
from rest_framework.test import APIClient

from accounts.models import (
    MentorProfile,
    MentorReply,
    AnswerSeeker,
    User,
    SeekerProfile
)


@pytest.mark.django_db
class TestMentorFeatures:

    def test_mentor_profile_created_after_registration(self):
        client = APIClient()

        response = client.post('/api/register/', {
            'username': 'mentor2',
            'email': 'mentor2@gmail.com',
            'password': 'Mentor@123',
            'role': 'MENTOR',
            'full_name': 'Mentor Two',
            'location': 'Kathmandu'
        }, format='json')

        assert response.status_code == 201
        assert MentorProfile.objects.filter(user__username='mentor2').exists()


    def test_get_mentor_profile(self, mentor_client):
        response = mentor_client.get('/api/mentor/profile/')

        assert response.status_code == 200
        assert 'experience' in response.data


    def test_update_mentor_profile(self, mentor_client):

        response = mentor_client.put('/api/mentor/profile/', {
            'bio': 'Helping students',
            'expertise': ['TECH','BUSINESS'],
            'custom_expertise': '',
            'experience': '3 years'
        }, format='json')

        assert response.status_code == 200
        assert response.data['experience'] == '3 years'


    def test_create_reply(self, mentor_client):

        seeker = User.objects.create_user(
            username='student',
            email='student@gmail.com',
            password='Student@123',
            role='SEEKER'
        )

        SeekerProfile.objects.create(user=seeker)

        post = AnswerSeeker.objects.create(
            seeker=seeker,
            title='Need Django Help',
            description='Help',
            category='TECH'
        )

        response = mentor_client.post(
            f'/api/mentor/posts/{post.id}/replies/',
            {
                'reply': 'I can help.',
                'share_contact': True,
                'contact_info': 'mentor@gmail.com'
            },
            format='json'
        )

        assert response.status_code == 201
        assert MentorReply.objects.count() == 1


    def test_delete_reply(self, mentor_client):

        seeker = User.objects.create_user(
            username='student2',
            email='student2@gmail.com',
            password='Student@123',
            role='SEEKER'
        )

        SeekerProfile.objects.create(user=seeker)

        post = AnswerSeeker.objects.create(
            seeker=seeker,
            title='Need React',
            description='Help',
            category='TECH'
        )

        create = mentor_client.post(
            f'/api/mentor/posts/{post.id}/replies/',
            {
                'reply': 'Reply',
                'share_contact': False,
                'contact_info': ''
            },
            format='json'
        )
        print(create.data) 

        reply_id = create.data['id']

        response = mentor_client.delete(
            f'/api/mentor/replies/{reply_id}/'
        )

        assert response.status_code == 204