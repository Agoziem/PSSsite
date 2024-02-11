from django.shortcuts import render, redirect, get_object_or_404
from StudentsPortal.models import *
from .models import *
from django.http import JsonResponse
from django.core.exceptions import ObjectDoesNotExist
from .forms import TeacherForm
from django.contrib.auth.decorators import login_required
import json


# Teachers Dashbord View
@login_required
def Teachers_dashboard_view(request):
    context={

    }
    return render(request,'Teachers_dashboard.html',context)

# Teachers profile View
@login_required
def profile_view(request,id):
    teacher = Teacher.objects.get(id=id)
    classes=Class.objects.all()
    subjects=Subject.objects.all()
    form = TeacherForm(instance=teacher)
    if request.method == 'POST':
        form = TeacherForm(request.POST, instance=teacher)
        if form.is_valid():
            form.save() 
            return redirect('TeachersPortal:Teachers_dashboard')
    
    context={
        'teacher': teacher,
        'classes':classes,
        'subjects':subjects,
        'form':form
    }
    return render(request,'editprofile.html',context)


# Teachers Result Formulation Part
@login_required
def result_computation_view(request,Classname,id):
    teacher = Teacher.objects.get(id=id)
    Terms=Term.objects.all()
    academic_session= AcademicSession.objects.all()
    classobject = Class.objects.get(Class=Classname)
    subjectsforclass=Subjectallocation.objects.get(classname=classobject)
    subjects_taught_for_class = teacher.subjects_taught.filter(id__in=subjectsforclass.subjects.values_list('id', flat=True))

    context={
            'class':classobject,
            "Terms":Terms,
            "academic_session":academic_session,
            "subjects_taught_for_class":subjects_taught_for_class
        }
    return render(request,'Result_computation.html',context)


# GET the entire Student Results Records for the Class
@login_required
def get_students_result_view(request):
    data=json.loads(request.body)
    classobject = Class.objects.get(Class=data['studentclass'])
    subjectobject = Subject.objects.get(subject_name=data['studentsubject'])
    term=Term.objects.get(term=data['selectedTerm'])
    session=AcademicSession.objects.get(session=data['selectedAcademicSession'])
    students = Students_Pin_and_ID.objects.filter(student_class=classobject)
    studentResults = []
    
    for studentresult in students:
        student_result_details,created = Student_Result_Data.objects.get_or_create(Student_name=studentresult,Term=term,AcademicSession=session)
        student_result_object, created = Result.objects.get_or_create(student=studentresult, Subject=subjectobject, students_result_summary=student_result_details,student_class=classobject)
        studentResults.append({
            'Name': student_result_object.student.student_name,
            'studentID': student_result_object.student.student_id,
            '1sttest': student_result_object.FirstTest,
            '1stAss': student_result_object.FirstAss,
            'MidTermTest': student_result_object.MidTermTest,
            'Project': student_result_object.Project,
            '2ndTest': student_result_object.SecondAss,
            '2ndAss': student_result_object.SecondTest,
            'Exam': student_result_object.Exam,
        })

    return JsonResponse(studentResults, safe=False)


# UPDATE a Single Student Results Record
@login_required
def update_student_result_view(request):
    data=json.loads(request.body)
    subject=data['classdata']['studentsubject']
    Classdata=data['classdata']['studentclass']
    studentID=data['formDataObject']['studentID']
    Name=data['formDataObject']['Name']
    classobject= Class.objects.get(Class=Classdata)
    term=Term.objects.get(term=data['classdata']['selectedTerm'])
    session=AcademicSession.objects.get(session=data['classdata']['selectedAcademicSession'])
    studentobject= Students_Pin_and_ID.objects.get(student_id=studentID,student_name=Name,student_class=classobject)
    subjectobject = Subject.objects.get(subject_name=subject)
    student_result_details = Student_Result_Data.objects.get(Student_name=studentobject,Term=term,AcademicSession=session)
    studentResult = Result.objects.get(student=studentobject,students_result_summary=student_result_details, Subject=subjectobject,student_class=classobject)
    studentResult.FirstTest  = data['formDataObject']['1sttest']
    studentResult.FirstAss  = data['formDataObject']['1stAss']
    studentResult.MidTermTest  = data['formDataObject']['MidTermTest']
    studentResult.Project  = data['formDataObject']['Project']
    studentResult.SecondAss = data['formDataObject']['2ndAss']
    studentResult.SecondTest = data['formDataObject']['2ndTest']
    studentResult.Exam = data['formDataObject']['Exam']
    studentResult.save()

    return JsonResponse('Result Updated Successfully', safe=False)
    

# UPDATE all Students Results Record
def submitallstudentresult_view(request):
    data=json.loads(request.body)
    subject=data['classdata']['studentsubject']
    Classdata=data['classdata']['studentclass']
    term=Term.objects.get(term=data['classdata']['selectedTerm'])
    session=AcademicSession.objects.get(session=data['classdata']['selectedAcademicSession'])
    for result in data['data']:
        classobject= Class.objects.get(Class=Classdata)
        subjectobject = Subject.objects.get(subject_name=subject)
        studentobject= Students_Pin_and_ID.objects.get(student_id=result['studentID'],student_name=result['Name'])
        student_result_details = Student_Result_Data.objects.get(Student_name=studentobject,Term=term,AcademicSession=session)
        studentResult = Result.objects.get(student=studentobject,students_result_summary=student_result_details, Subject=subjectobject,student_class=classobject)
        studentResult.FirstTest=result['1sttest']
        studentResult.FirstAss=result['1stAss']
        studentResult.MidTermTest=result['MidTermTest']
        studentResult.Project=result['Project']
        studentResult.SecondAss=result['2ndTest']
        studentResult.SecondTest=result['2ndAss']
        studentResult.CA=result['CA']
        studentResult.Exam=result['Exam']
        studentResult.Total=result['Total']
        studentResult.Grade=result['Grade']
        studentResult.SubjectPosition=result['Position']
        studentResult.Remark=result['Remarks']
        studentResult.save()
    return JsonResponse('Results submitted Successfully', safe=False)



# Form teachers View for CRUD Students Details
# READ all Students Record 
@login_required
def Students_view(request,Classname):
    print(Classname)
    classobject = Class.objects.get(Class=Classname)
    students = Students_Pin_and_ID.objects.filter(student_class=classobject)
    context={
        'class':classobject,
        "students":students
        } 
    return render(request,'students.html',context)


# CREATE Single Student Record
def createstudent_view(request):
    data=json.loads(request.body)
    student_name=data['studentname']
    student_sex=data['Student_sex']
    student_class=data['studentclass']
    classobject = Class.objects.get(Class=student_class)
    try:
        newStudent = Students_Pin_and_ID.objects.create(student_name=student_name,Sex=student_sex,student_class=classobject)
        context={
            'student_ID': newStudent.id, 
            'student_id': newStudent.student_id, 
            'student_name':newStudent.student_name,
            'student_sex':newStudent.Sex,
            'message': f'{newStudent.student_name} record have been created Successfully'
        }
        return JsonResponse(context, safe=False)
    except:
        return JsonResponse({'error': 'something went wrong' }, safe=False)
    

# UPDATE Single Student Record
def updatestudent_view(request):
    data=json.loads(request.body)
    student_id=data['studentID']
    student_name=data['studentname']
    student_sex=data['Student_sex']
    student_class=data['studentclass']
    classobject = Class.objects.get(Class=student_class)
    try:
        updateStudent = Students_Pin_and_ID.objects.get(id=student_id)
        updateStudent.student_name=student_name
        updateStudent.Sex= student_sex
        updateStudent.student_class=classobject
        updateStudent.save()
        context={
            'student_ID': updateStudent.id, 
            'student_id': updateStudent.student_id, 
            'student_name':updateStudent.student_name,
            'student_sex':updateStudent.Sex,
            'message': f'{updateStudent.student_name} record have been updated Successfully'
        }
        return JsonResponse(context, safe=False)
    except:
        return JsonResponse({'error': 'something went wrong' }, safe=False)


# DELETE Single Student Record
def DeleteStudents_view(request):
    studentidstodelete=json.loads(request.body)
    studentnamesdeleted=[]   
    try:
        for id in studentidstodelete:
            student = Students_Pin_and_ID.objects.get(id=id)
            studentnamesdeleted.append(student.student_name)
            student.delete()
        context={
            'message': f'{studentnamesdeleted} records have been deleted Successfully'
        }
        return JsonResponse(context, safe=False)
    except:
        return JsonResponse({'error': 'something went wrong' }, safe=False)




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
        Resultdetails=Student_Result_Data.objects.filter(Student_name=student,Term=term_object,AcademicSession=session_object).first()
        student_dict = {
            'Name': student.student_name,
        }
        for subobject in subjects_allocated.subjects.all():
            try:
                subresult = Result.objects.get(student=student,students_result_summary=Resultdetails, Subject=subobject)
                student_dict[subobject.subject_code] = subresult.Total
            except:
                student_dict[subobject.subject_code] = "-"
        final_list.append(student_dict)
    return JsonResponse(final_list, safe=False)


# POST all the Students Result details in a Particular Class
def publish_student_result_view(request):
    try:
        data = json.loads(request.body)
        term_object = Term.objects.get(term=data['classdata']['selectedTerm'])
        acad_session_object = AcademicSession.objects.get(session=data['classdata']['selectedAcademicSession'])
        class_data = data['classdata']['studentclass']
        
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
                student_result.TotalScore = student_data['TOTAL']
                student_result.Totalnumber = student_number
                student_result.Average = student_data['AVE']
                student_result.Position = student_data['POSITION']
                student_result.Remark = student_data['REMARK']
                student_result.save()
            except ObjectDoesNotExist:
                Student_Result_Data.objects.create(
                    TotalScore=student_data['TOTAL'],
                    Average=student_data['AVE'],
                    Position=student_data['POSITION'],
                    Remark=student_data['REMARK'],
                    Student_name=student,
                    Totalnumber=student_number,
                    Term=result_term,
                    AcademicSession=result_session
                )

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
            "message": "An error occurred while publishing Student Results" 
        }, safe=False)








