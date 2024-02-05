# Generated by Django 2.2 on 2024-02-01 00:57

import ckeditor.fields
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('StudentsPortal', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Newsletter',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('newsletter', ckeditor.fields.RichTextField(blank=True, null=True)),
                ('newsletterFile', models.FileField(blank=True, upload_to='media/Newsletter')),
                ('currentTerm', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='StudentsPortal.Term')),
            ],
        ),
    ]
