from django.urls import path
from .views.views import *
from .views.Formteachersviews import *
from .views.classteachersviews import *
from .views.Adminviews import *

app_name = 'TeachersPortal'
urlpatterns = [
	path('',Teachers_dashboard_view , name='Teachers_dashboard'),
	path('<int:id>/profile/', profile_view , name='profile'),
	path('<str:Classname>/Students/',Students_view , name='Students'),
    path('newStudent/', createstudent_view , name='createstudent'),   
	path('updateStudent/', updatestudent_view , name='updatestudent'),   
	path('DeleteStudents/', DeleteStudents_view , name='DeleteStudents'),   
    
	# form teachers URLS
	path('<str:Classname>/PublishResults/',PublishResults_view , name='PublishResults'),
	path('getstudentsubjecttotals/',getstudentsubjecttotals_view , name='getstudentsubjecttotals'),   
	path('publishstudentresult/',publish_student_result_view , name='publishstudentresult'), 
    path('unpublishclassresult/',unpublish_classresults_view , name='unpublishstudentresult'),
	
	# class teachers URLS
	path('<str:Classname>/<int:id>/result_computation/',result_computation_view , name='result_computation'),
	path('getstudentresults/',get_students_result_view , name='getstudentresults'),   
	path('updatestudentresults/',update_student_result_view , name='updatestudentresults'),   
	path('submitallstudentresult/',submitallstudentresult_view , name='submitallstudentresult'), 
    path('unpublishstudentresults/',unpublish_results_view , name='unpublishresults'),
    
	# Admin urls
    path('schoolresults/',schoolresult_view , name='schoolresults'),
    path('getclasspublishedResults/',getclasspublishedResults , name='getclasspublishedResults')
]