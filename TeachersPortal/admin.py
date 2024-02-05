from django.contrib import admin
from .models import *

@admin.register(Teacher)
class TeacherAdmin(admin.ModelAdmin):
    list_display=('FirstName','teachers_id','Role',"classFormed")
    ordering=('FirstName','teachers_id','Role')
    search_fields=('FirstName','teachers_id','Role')
    list_filter=('FirstName','teachers_id','Role')