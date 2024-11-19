from django.contrib.auth.models import AbstractUser
from django.db import models

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    is_superuser=models.BooleanField(default=False)
    is_staff=models.BooleanField(default=False)
    user_type=models.CharField(max_length=30)
    university_name=models.CharField(max_length=50)
    profile_photo = models.ImageField(upload_to="profile_images/")

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']  
 
class AttachmentApplication(models.Model):
    student_id = models.OneToOneField(CustomUser, on_delete=models.CASCADE, related_name='applicant')
    supervisor_id = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='applicantsupervisor')
    idnumber = models.CharField(max_length=20)
    phonenumber = models.CharField(max_length=15)
    course = models.CharField(max_length=50)
    registration_number = models.CharField(max_length=50)
    student_cv = models.FileField(upload_to="documents")
    application_date = models.DateTimeField(auto_now_add=True)


class Assignment(models.Model):
    applicant_id = models.ForeignKey(AttachmentApplication, on_delete=models.CASCADE)
    assignment_title = models.CharField(max_length=50)
    assignment_description = models.TextField()
    assigned_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    assigned_date = models.DateTimeField(auto_now_add=True)
    completion_date = models.DurationField()

class Studentresponse(models.Model):
    assignment_id = models.ForeignKey(Assignment, on_delete=models.CASCADE)
    response=models.TextField()
    response_date=models.DateTimeField(auto_now_add=True)

class Roles(models.Model):
    user_id = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='user_roles')
    role = models.CharField(max_length=50)
    assigned_by = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='assigned_roles')
    assigned_date = models.DateTimeField(auto_now_add=True)















