from django.db import models

# Create your models here.


class test(models.Model):
    name = models.CharField(max_length=100)
    r_no = models.IntegerField(max_length=4)

    