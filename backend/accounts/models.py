import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
ROLE_CHOICES=[
    ('SEEKER','Seeker'),
    ('MENTOR','Mentor'),
    ('BOTH','Both'),
]

CATEGORY_CHOICES = [
    ('CAREER', 'Career'),
    ('RESEARCH', 'Research'),
    ('TECH', 'Tech'),
    ('EDUCATION', 'Education'),
    ('CHEMISTRY', 'Chemistry'),
    ('BIOLOGY', 'Biology'),
    ('PHYSICS', 'Physics'),
    ('ASTRONOMY', 'Astronomy'),
    ('LITERATURE', 'Literature'),
    ('BUSINESS','Business'),
    ('OTHER', 'Other'),
]

STATUS_CHOICES = [
    ('OPEN', 'Open'),
    ('MATCHED', 'Matched'),
    ('CONNECTED', 'Connected'),
    ('CLOSED', 'Closed'),
]


class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    role= models.CharField(max_length=20, choices=ROLE_CHOICES, default='SEEKER')
    full_name = models.CharField(max_length=100, default='')
    location = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.username
    
    
class SeekerProfile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4,editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE,related_name='seeker_profile')
    bio = models.TextField(blank=True)
    learning_goal = models.TextField(blank=True)
    interest = models.CharField(max_length=30, choices=CATEGORY_CHOICES,default='TECH')

     # if interest = OTHER, user can write custom one
    custom_interest = models.CharField(max_length=100, blank=True)

    is_rural = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.user.username} - Seeker Profile"
    

class AnswerSeeker(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    seeker = models.ForeignKey(User, on_delete=models.CASCADE, related_name='seeker_posts')
    title = models.CharField(max_length=150)
    description = models.TextField()
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES, default='OTHER')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='OPEN')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title