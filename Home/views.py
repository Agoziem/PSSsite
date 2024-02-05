from django.shortcuts import render

def home_view(request):
    return render(request,'home.html')

def student_card_view(request):
    return render(request,'card_activation.html')