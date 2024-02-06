from django.shortcuts import render
from django.core.paginator import Paginator
from StudentsPortal.models import Students_Pin_and_ID


def home_view(request):
    return render(request,'home.html')


def student_card_view(request):
    P = Paginator(Students_Pin_and_ID.objects.all(),21)
    page= request.GET.get('page')
    students = P.get_page(page)
    context = {
        "students":students
    }
    return render(request,'card_activation.html',context)