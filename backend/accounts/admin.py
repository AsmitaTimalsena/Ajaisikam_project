from django.contrib import admin
from .models import User, SeekerProfile, AnswerSeeker, MentorProfile, MentorReply
from django.contrib.auth.admin import UserAdmin

admin.site.register(User, UserAdmin)
admin.site.register(SeekerProfile)
admin.site.register(AnswerSeeker)
admin.site.register(MentorProfile)
admin.site.register(MentorReply)