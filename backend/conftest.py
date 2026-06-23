import pytest
from accounts.models import User

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