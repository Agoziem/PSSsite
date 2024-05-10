from django.db import models
from django.contrib.auth.models import User
from StudentsPortal.models import Students_Pin_and_ID
from StudentsPortal.models import Class,Subject
import random
import secrets

ROLE_CHOICES = [
        ('Teacher', 'Teacher'),
        ('Formteacher', 'Formteacher'),
        ('Admin', 'Admin'),
    ]

class Teacher(models.Model):
	user = models.OneToOneField(User, on_delete=models.CASCADE, blank=True, null=True)
	FirstName= models.CharField(max_length= 200, blank=True,default='None')
	LastName= models.CharField(max_length= 200, blank=True, default='None')
	Phone_number= models.CharField(max_length= 200, blank=True)
	Email= models.EmailField(max_length= 200, blank=True)
	teachers_id=models.CharField(max_length= 200, blank=True)
	Role= models.CharField(max_length= 200, blank=True , default="Teacher",choices=ROLE_CHOICES )
	subjects_taught=models.ManyToManyField(Subject ,blank=True,related_name='assigned_subjects')
	classes_taught=models.ManyToManyField(Class,blank=True,related_name='assigned_classes')
	classFormed = models.ForeignKey(Class,on_delete=models.CASCADE, blank=True, null=True )
	Headshot=models.ImageField(upload_to='assets/TeachersProfileimages', blank=True)
	
	
	
	def __str__(self):
		return str(self.FirstName)

	@property
	def profileimageURL(self):
		try:
			url= self.Headshot.url
		except:
			url=""
		return url
	
	def save(self, *args, **kwargs):
		if self.teachers_id:
			super().save(*args, **kwargs)
		else:  # if object is new
			while not self.teachers_id:
				random_pin = str(random.randint(1000, 9999))
				# random_password = secrets.token_urlsafe(8)
				Application_id = f"teacher/pss/{random_pin}"
				object_with_similar_Application_id = Teacher.objects.filter(teachers_id=random_pin)
				if not object_with_similar_Application_id:
					self.teachers_id = Application_id
					# self.teachers_password = random_password
			super().save(*args, **kwargs)
