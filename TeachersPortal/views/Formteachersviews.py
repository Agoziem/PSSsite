from django.shortcuts import render, redirect, get_object_or_404
from StudentsPortal.models import *
from ..models import *
from django.http import JsonResponse
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth.decorators import login_required
import json

# Form teachers View for submitting Results
@login_required
def PublishResults_view(request,Classname):
    Terms=Term.objects.all()
    academic_session= AcademicSession.objects.all()
    class_object = Class.objects.get(Class=Classname)
    subjects_allocation = Subjectallocation.objects.filter(classname=class_object).first()
    subject_code = []
    for subobject in subjects_allocation.subjects.all():
        subject_code.append(subobject.subject_code)
    context = {
        'subjects_allocation': subjects_allocation,
        "class": class_object,
        'sub_list':subject_code,
        "Terms":Terms,
        "academic_session":academic_session
        }
    return render(request, 'Publish_Result.html', context)


# GET all the Students Result details in a Particular Class
def getstudentsubjecttotals_view(request):
    data=json.loads(request.body)
    class_object = Class.objects.get(Class=data['studentclass'])
    term_object = Term.objects.get(term=data['selectedTerm'])
    session_object = AcademicSession.objects.get(session=data['selectedAcademicSession'])
    subjects_allocated = Subjectallocation.objects.filter(classname=class_object).first()
    students = Students_Pin_and_ID.objects.filter(student_class=class_object)
    final_list = []
    # get all the Students related to the Class
    for student in students:
        Resultdetails,created=Student_Result_Data.objects.get_or_create(Student_name=student,Term=term_object,AcademicSession=session_object)
        student_dict = {
            'Name': student.student_name
        }
        for subobject in subjects_allocated.subjects.all():
            subject = {}
            try:
                subresult = Result.objects.get(student=student,students_result_summary=Resultdetails, Subject=subobject)
                subject['subject_code'] = subobject.subject_code
                subject['subject_name'] = subobject.subject_name
                subject['Total'] = subresult.Total
                subject['published'] = subresult.published
            except:
                subject['subject_code'] = subobject.subject_code
                subject['subject_name'] = subobject.subject_name
                subject['Total'] = "-"
                subject['published'] = False
            student_dict[subobject.subject_code] = subject
        student_dict['published'] = Resultdetails.published
        final_list.append(student_dict)
    return JsonResponse(final_list, safe=False)


# POST all the Students Result details in a Particular Class
def publish_student_result_view(request):
    try:
        data = json.loads(request.body)
        term_object = Term.objects.get(term=data['classdata']['selectedTerm'])
        acad_session_object = AcademicSession.objects.get(session=data['classdata']['selectedAcademicSession'])
        class_data = data['classdata']['studentclass']
        print(data['data'])
        for student_data in data['data']:
            class_object = Class.objects.get(Class=class_data)
            result_term = term_object
            result_session = acad_session_object
            student = Students_Pin_and_ID.objects.get(student_name=student_data['Name'],student_class=class_object)
            student_number = Students_Pin_and_ID.objects.filter(student_class=class_object).count()

            try:
                student_result = Student_Result_Data.objects.get(
                    Student_name=student,
                    Term=result_term,
                    AcademicSession=result_session
                )
                student_result.TotalScore = student_data['Total']
                student_result.Totalnumber = student_number
                student_result.Average = student_data['Ave']
                student_result.Position = student_data['Position']
                student_result.Remark = student_data['Remarks']
                student_result.published = True
                student_result.save()
            except Exception as e:
                print(str(e))
                continue

        return JsonResponse(
            {
            "type": "success",
            "message": "Results have been Published and are now open to the Students"
            }
        , safe=False)

    except Exception as e:
        print(str(e))
        return JsonResponse({
            "type": "error",
            "message": str(e) 
        }, safe=False)
    

# unpublish Result Views
def unpublish_classresults_view(request):
    data=json.loads(request.body)
    class_object = Class.objects.get(Class=data['classdata']['studentclass'])
    term_object = Term.objects.get(term=data['classdata']['selectedTerm'])
    session_object = AcademicSession.objects.get(session=data['classdata']['selectedAcademicSession'])
    students = Students_Pin_and_ID.objects.filter(student_class=class_object)
    for student in students:
        try:
            student_result = Student_Result_Data.objects.get(Student_name=student,Term=term_object,AcademicSession=session_object)
            student_result.published = False
            student_result.save()
        except ObjectDoesNotExist:
            continue
    return JsonResponse(
        {
            "type": "success",
            "message": "Results have been Unpublished Successfully"
            }
        , safe=False)