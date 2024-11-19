from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import CustomUser,AttachmentApplication,Roles,Assignment,Studentresponse
from django.conf import settings

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    university_name = serializers.ChoiceField(choices=[
        ('Kabianga', 'Kabianga'),
        ('University of Nairobi', 'University of Nairobi'),
        ('Kabarak University', 'Kabarak University')
    ])
    user_type = serializers.ChoiceField(choices=[
        ('student', 'Student'),
        ('supervisor', 'Supervisor')
    ])

    class Meta:
        model = CustomUser
        fields = ['first_name','last_name','email','username','user_type','university_name','profile_photo', 'password']

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name'],
            email=validated_data['email'],
            username=validated_data['username'],
            user_type=validated_data['user_type'],
            university_name=validated_data['university_name'],
            profile_photo=validated_data.get('profile_photo'),
            password=validated_data['password']
        )
        return user


class UserSerializer(serializers.ModelSerializer):
    profile_photo_url = serializers.SerializerMethodField()
    class Meta:
        model = CustomUser
        fields = ['id', 'first_name', 'last_name', 'email', 'username', 'user_type', 'university_name', 'profile_photo', 'password', 'profile_photo_url']

    def get_profile_photo_url(self, obj):
        request = self.context.get('request')
        if obj.profile_photo:
            return request.build_absolute_uri(obj.profile_photo.url)
        else:
            default_image_path = 'product_images/no-image.jpg'
        return request.build_absolute_uri(settings.MEDIA_URL + default_image_path)

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        # Authenticate using 'email' as 'username'
        user = authenticate(username=data['email'], password=data['password'])
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Invalid credentials")

class ApplicationSerializer(serializers.ModelSerializer):

    class Meta:
        model = AttachmentApplication
        fields = [
            'id', 'student_id', 'supervisor_id', 
            'idnumber', 'phonenumber', 'course', 
            'registration_number', 'student_cv', 'application_date'
        ]
        read_only_fields = ['student_id', 'application_date']

class ApplicationsSerializer(serializers.ModelSerializer):
    student_first_name = serializers.CharField(source='student_id.first_name')
    student_last_name = serializers.CharField(source='student_id.last_name')
    university_name = serializers.CharField(source='student_id.university_name')
    student_profile_image = serializers.ImageField(source='student_id.profile_photo')  # Add this line
    supervisor_first_name = serializers.CharField(source='supervisor_id.first_name')
    supervisor_last_name = serializers.CharField(source='supervisor_id.last_name')

    class Meta:
        model = AttachmentApplication
        fields = ['id', 'student_first_name', 'student_last_name', 'university_name', 'student_profile_image', 'supervisor_first_name', 'supervisor_last_name', 'application_date']
        

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Roles
        fields = ['id', 'user_id', 'role', 'assigned_by', 'assigned_date']
        read_only_fields = ['assigned_by', 'assigned_date']

class AssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = ['id', 'applicant_id', 'assignment_title', 'assignment_description', 'assigned_by', 'assigned_date', 'completion_date']
        read_only_fields = ['assigned_by', 'assigned_date']

class AssignmentsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Assignment
        fields = ['id', 'applicant_id', 'assignment_title', 'assignment_description', 'assigned_by', 'assigned_date', 'completion_date']
       
class StudentresponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Studentresponse
        fields = ['id', 'assignment_id', 'response', 'response_date']

class StudentResponsesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Studentresponse
        fields = ['id', 'response', 'response_date', 'assignment_id']

class ApplicantSerializers(serializers.ModelSerializer):
    class Meta:
        model = AttachmentApplication
        fields = ['id', 'student_id']