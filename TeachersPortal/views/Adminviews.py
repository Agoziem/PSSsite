from django.shortcuts import render, redirect, get_object_or_404
from StudentsPortal.models import *
from ..models import *
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
import json

def schoolresult_view(request):
    school_classes = Class.objects.all()
    academic_session = AcademicSession.objects.all()
    terms = Term.objects.all()
    context = {
        'school_classes': school_classes,
        'academic_session': academic_session,
        'terms': terms,
    }
    return render(request,'schoolresults.html',context)

def getclasspublishedResults(request):
    try:
        data = json.loads(request.body)
        print(data)
        class_ =data.get('classname')
        term = data.get('term')
        academic_session = data.get('session')
        classobject = Class.objects.get(Class=class_)
        termobject = Term.objects.get(term=term)
        academic_sessionobject = AcademicSession.objects.get(session=academic_session)
        subject_allocations = Subjectallocation.objects.get(classname=classobject)
        classstudent = Students_Pin_and_ID.objects.filter(student_class=classobject).first()
        classresultdata = {
        }
        try:
            resultsummary = Student_Result_Data.objects.get(Student_name=classstudent,Term=termobject,AcademicSession=academic_sessionobject)
            classresultdata["classname"] =  classobject.Class
            classresultdata['published'] = resultsummary.published
            subjectResults = []
            for subject in subject_allocations.subjects.all():
                Subjectresult = {}
                try:
                    subject_results = Result.objects.get(student_class=classobject,students_result_summary=resultsummary,Subject=subject)
                    Subjectresult['subject'] = subject.subject_name
                    Subjectresult['published'] = subject_results.published
                except:
                    Subjectresult['subject'] = subject.subject_name
                    Subjectresult['published'] = False
                subjectResults.append(Subjectresult)
            classresultdata['subjects'] = subjectResults
        except:
            classresultdata["classname"] =  classobject.Class
            classresultdata['published'] = False
            classresultdata['subjects'] = []
        return JsonResponse(classresultdata, safe=False)
    except Exception as e:
        print(e)
        return JsonResponse({'error': 'An error occured try again later'}, safe=False)