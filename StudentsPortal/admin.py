from django.contrib import admin
from.models import *


admin.site.register(AcademicSession)
admin.site.register(Term)
admin.site.register(Subjectallocation)
admin.site.register(Newsletter)
admin.site.register(AnnualStudent)
admin.site.register(AnnualResult)

@admin.register(Students_Pin_and_ID)
class Students_Pin_and_IDAdmin(admin.ModelAdmin):
    list_display=('student_name','student_id','student_class')
    ordering=('student_name','student_class')
    search_fields=('student_name','student_class')
    list_filter=('student_class',"student_name")


@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display=('subject_name','subject_code')
    ordering=('subject_name','subject_code')
    search_fields=('subject_name','subject_code')
    list_filter=('subject_name','subject_code')

@admin.register(Class)
class ClassAdmin(admin.ModelAdmin):
    list_display=('Class',)
    ordering=('Class',)
    search_fields=('Class',)
    list_filter=('Class',)

@admin.register(Student_Result_Data)
class Student_Result_DataAdmin(admin.ModelAdmin):
    list_display = ('Student_name', 'Position', 'display_Class', 'Average')
    ordering = ('Student_name', 'Position', 'Average')
    search_fields = ('Student_name__student_class','Position', 'Average')
    list_filter = ('Student_name__student_class','Student_name', 'Position', 'Average')

    def display_Class(self, obj):
        return obj.Student_name.student_class

    display_Class.short_description = 'Class'

@admin.register(Result)
class ResultAdmin(admin.ModelAdmin):
    list_display = ('student','student_class','Subject')
    ordering = ('student','student_class','Subject')
    search_fields = ('student_class','Subject') 
    list_filter = ('student','student_class','Subject')