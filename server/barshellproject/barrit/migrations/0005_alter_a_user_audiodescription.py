# Generated by Django 4.0.4 on 2022-05-06 19:50

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('barrit', '0004_alter_a_user_darkmode'),
    ]

    operations = [
        migrations.AlterField(
            model_name='a_user',
            name='audiodescription',
            field=models.BooleanField(blank=True, default=True),
        ),
    ]
