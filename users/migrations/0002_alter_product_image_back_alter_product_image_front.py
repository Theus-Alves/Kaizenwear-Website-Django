# Generated by Django 4.2.1 on 2023-09-01 17:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='product',
            name='image_back',
            field=models.ImageField(blank=True, null=True, upload_to=''),
        ),
        migrations.AlterField(
            model_name='product',
            name='image_front',
            field=models.ImageField(blank=True, null=True, upload_to=''),
        ),
    ]
