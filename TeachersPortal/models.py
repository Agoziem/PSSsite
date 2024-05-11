from django.db import models
from django.contrib.auth.models import User,Group
from StudentsPortal.models import Students_Pin_and_ID
from StudentsPortal.models import Class,Subject
import random
import secrets
from django.db.models.signals import post_delete
from django.dispatch import receiver

ROLE_CHOICES = [
        ('Teacher', 'Teacher'),
        ('Formteacher', 'Formteacher'),
        ('Admin', 'Admin'),
    ]

class Teacher(models.Model):
	user = models.OneToOneField(User, on_delete=models.CASCADE, blank=True, null=True)
	FirstName= models.CharField(max_length= 200, blank=False, default='None')
	LastName= models.CharField(max_length= 200, blank=False, default='None')
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
		if not self.teachers_id:
			random_pin = str(random.randint(10000, 99999))
			application_id = f"teacher/pss/{random_pin}"
			object_with_similar_application_id = Teacher.objects.filter(teachers_id=random_pin)
			while object_with_similar_application_id.exists():
				random_pin = str(random.randint(1000, 9999))
				application_id = f"teacher/pss/{random_pin}"
				object_with_similar_application_id = Teacher.objects.filter(teachers_id=random_pin)
			
			self.teachers_id = application_id
			user = User.objects.create_user(username=f"@{self.FirstName}{self.LastName}", password=application_id)
			user.first_name = self.FirstName
			user.last_name = self.LastName
			user.is_staff = True
			group_name = self.Role
			group, _ = Group.objects.get_or_create(name=group_name)
			user.groups.add(group)
			user.save()
			self.user = user
			super().save(*args, **kwargs)
		else:
			super().save(*args, **kwargs)

	def delete(self, *args, **kwargs):
		if self.user:
			user = User.objects.filter(id=self.user.id).first()
			if user:
				user.delete()
		super().delete(*args, **kwargs)

@receiver(post_delete, sender=Teacher)
def delete_teacher(sender, instance, **kwargs):
    if instance.user:
        user = User.objects.filter(id=instance.user.id).first()
        if user:
            user.delete()
		


