import uuid
from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
ROLE_CHOICES=[
    ('SEEKER','Seeker'),
    ('MENTOR','Mentor'),
    ('BOTH','Both'),
]

class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    role= models.CharField(max_length=20, choices=ROLE_CHOICES, default='SEEKER')
    full_name = models.CharField(max_length=100, default='')
    location = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return self.username
    
    
