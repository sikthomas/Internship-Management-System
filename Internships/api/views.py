from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import RegisterSerializer, StudentResponsesSerializer, LoginSerializer,AssignmentsSerializer,RoleSerializer,UserSerializer,ApplicationSerializer,ApplicationsSerializer,AssignmentSerializer,ApplicantSerializers,StudentresponseSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny,IsAuthenticated
from.models import CustomUser,AttachmentApplication,Assignment,Studentresponse


@api_view(['POST'])
@permission_classes([AllowAny])
def signup_api(request):
    if request.method == 'POST':
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_api(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': {
                'username': user.username,
                'email': user.email,
                'is_superuser': user.is_superuser,
                'is_staff': user.is_staff,
                'user_type': user.user_type, 
            },
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_200_OK)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([AllowAny])
def view_psersolInfo(request):
    users = CustomUser.objects.filter(user_type="student")
    serializer = UserSerializer(users, many=True)
    print(serializer.data)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def applyinternship(request):
    if request.method == 'POST':
        serializer = ApplicationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(student_id=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print("Validation Errors:", serializer.errors)  # Log errors
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])  # Ensure the user is authenticated
def supervisor_list(request):
    print("Received request for supervisors")
    logged_in_user = request.user
    university_name = logged_in_user.university_name
    supervisors = CustomUser.objects.filter(user_type='supervisor', university_name=university_name)
    serializer = UserSerializer(supervisors, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@permission_classes([AllowAny])
def view_applications(request):
    applications = AttachmentApplication.objects.all()
    serializer = ApplicationsSerializer(applications, many=True)
    print(serializer.data)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def assignment(request):
    if request.method == 'POST':
        serializer = AssignmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(assigned_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([AllowAny])
def applicant_list(request, id):
    students = AttachmentApplication.objects.filter(id=id)
    if students.exists():
        serializer = ApplicantSerializers(students, many=True)
        return Response(serializer.data)
    return Response({"error": "Applicant not found."}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_assignments(request):
    print(f"User: {request.user}")  # Log the user
    if request.user.is_authenticated:
        try:
            # Access the AttachmentApplication using the related name 'applicant'
            student_application = request.user.applicant  
            assignments = Assignment.objects.filter(applicant_id=student_application).order_by('assigned_date')
            serializer = AssignmentsSerializer(assignments, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except AttachmentApplication.DoesNotExist:
            return Response({"error": "No attachment application found for this user."}, status=status.HTTP_404_NOT_FOUND)
    else:
        return Response({"error": "Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])
def reply_to_assignment(request):
    if request.method == 'POST':
        assignment_id = request.data.get('assignment_id')
        response = request.data.get('response')
        try:
            assignment = Assignment.objects.get(id=assignment_id)
        except Assignment.DoesNotExist:
            return Response({'detail': 'Assignment not found.'}, status=status.HTTP_404_NOT_FOUND)
        student_response = Studentresponse.objects.create(assignment_id=assignment,response=response)
        serializer = StudentresponseSerializer(student_response)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_assignment_replies(request, assignment_id):
    # Ensure the user is authenticated
    if not request.user.is_authenticated:
        return Response({'detail': 'Authentication credentials were not provided.'}, status=401)

    # Get all the responses for the specified assignment
    responses = Studentresponse.objects.filter(assignment_id=assignment_id)
    serializer = StudentResponsesSerializer(responses, many=True)
    
    # Return the serialized data (the replies) in the response
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@permission_classes([AllowAny])
def assignment_list(request, applicant_id):
    assignment = Assignment.objects.filter(applicant_id=applicant_id)
    if assignment.exists():
        serializer = AssignmentSerializer(assignment, many=True)
        return Response(serializer.data)
    return Response({"error": "Assignments not found."}, status=status.HTTP_404_NOT_FOUND)



'''
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def roles(request):
    if request.method == 'POST':
        serializer = RoleSerializer(data=request.data)

        if serializer.is_valid():
            selecteduser = serializer.validated_data.get('user_id')
            role = serializer.validated_data.get('role')

            # Reset user roles if needed
            selecteduser.is_superuser = False
            selecteduser.is_staff = False

            if role == 'superuser':
                selecteduser.is_superuser = True
                selecteduser.is_staff = True
            elif role == 'lecturer':
                selecteduser.is_superuser = False
                selecteduser.is_staff = True
            elif role == 'student':
                selecteduser.is_superuser = False
                selecteduser.is_superuser = False

            selecteduser.save()

            # Save the role assignment
            serializer.save(assigned_by=request.user)  # Automatically set the assigned_by field
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AllowAny])
def roles_choices(request):
    roles_choices = [
        {"id": "superuser", "name": "Superuser"},
        {"id": "lecturer", "name": "Lecturer"},
        {"id": "student", "name": "Student"},
    ]
    return Response(roles_choices, status=status.HTTP_200_OK)


@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def view_applications(request):
    if request.method == 'GET':
        applications = AttachmentApplication.objects.select_related('university', 'student_id').all()
        for app in applications:
            app.student_cv = request.build_absolute_uri(app.student_cv.url) if app.student_cv else None
        serializer = ApplicationSerializer(applications, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
@api_view(['GET'])
@permission_classes([AllowAny])
def university_list(request):
    universities = University.objects.all()
    serializer = UniversitiesSerializer(universities, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def assignment(request):
    if request.method == 'POST':
        serializer = AssignmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(assigned_by=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([AllowAny])
def applicant_list(request, id):
    students = AttachmentApplication.objects.filter(id=id)
    if students.exists():
        serializer = ApplicantSerializers(students, many=True)
        return Response(serializer.data)
    return Response({"error": "Applicant not found."}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_assignments(request):
    student = request.user.attachmentapplication 
    assignments = Assignment.objects.filter(applicant_id=student).order_by('assigned_date')
    serializer = AssignmentSerializer(assignments, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def assignment_response(request):
    if request.method == 'POST':
        serializer = StudentresponseSerializer(data=request.data)
        assignment_id = request.data.get('assignment_id')
        if not Assignment.objects.filter(id=assignment_id).exists():
            return Response({"error": "Assignment not found."}, status=status.HTTP_404_NOT_FOUND)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([AllowAny])
def assignment_list(request, id):
    assignment = Assignment.objects.filter(id=id).prefetch_related('studentresponse_set ')
    if assignment.exists():
        serializer = AssignmentSerializer(assignment, many=True)
        return Response(serializer.data)
    return Response({"error": "Assignment not found."}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def assignment_reply(request, assignment_id):
    replies = Studentresponse.objects.filter(assignment_id=assignment_id)
    serializer = StudentresponseSerializer(replies, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def assignments(request, applicant_id):
    assignment = Assignment.objects.filter(applicant_id=applicant_id)
    serializer = AssignmentSerializer(assignment, many=True)
    return Response(serializer.data)

'''