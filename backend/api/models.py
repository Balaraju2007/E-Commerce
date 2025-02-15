from django.db import models

# Create your models here.

# class UserSubmision(models.Model):
#     username = models.CharField(max_length=255)
#     password = models.CharField(max_length=255)

#     def __str__(self):
#         return self.username
    
class User(models.Model):
    name = models.CharField(primary_key=True, max_length=40)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=20)

    def __str__(self):
        return self.name
    

class Order(models.Model):
    username = models.ForeignKey(User, on_delete=models.CASCADE, to_field='name', db_column='username')
    order_id = models.AutoField(primary_key=True)
    product = models.CharField(max_length=100)
    price = models.BigIntegerField()
    order_date = models.DateTimeField(auto_created=True)

    def __str__(self):
        return self.product
    
