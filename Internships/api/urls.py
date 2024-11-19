from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import signup_api,login_api,applyinternship,supervisor_list,view_applications,assignment,applicant_list,my_assignments,reply_to_assignment,get_assignment_replies,assignment_list,view_psersolInfo

urlpatterns = [
     path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    path('personalinfformation/', view_psersolInfo, name='personalinfo'),
    path('signup/',signup_api,name='signup'),
    path('login/', login_api, name='login'),
    path('application/', applyinternship, name='application'),
    path('supervisors/', supervisor_list, name='supervisors'),
    path('applications/', view_applications,name='applications'),
    path('assignment/', assignment, name='assignment'),
    path('applicantlist/<int:id>/', applicant_list, name='applicantlist'),



    path('my_assignments/',my_assignments,name='my_assignments'),
    path('reply/', reply_to_assignment, name='reply'), 
    path('assignments_reply/<int:assignment_id>/', get_assignment_replies, name='get_assignment_replies'),

    path('assignments/<int:applicant_id>/', assignment_list, name='assignment-list'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)