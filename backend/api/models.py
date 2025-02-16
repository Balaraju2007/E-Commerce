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
    id = models.AutoField(primary_key=True)
    username = models.ForeignKey(User, on_delete=models.CASCADE, to_field='name', db_column='username')
    order_id = models.PositiveIntegerField()
    product = models.CharField(max_length=100)
    price = models.BigIntegerField()
    order_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('username', 'order_id')  # Ensure order_id is unique per user

    def save(self, *args, **kwargs):
        if not self.order_id:  # If order_id is not provided, assign a new one
            last_order = Order.objects.filter(username=self.username).order_by('-order_id').first()
            self.order_id = last_order.order_id + 1 if last_order else 1  # Increment or start at 1
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.username.name} - Order {self.order_id}: {self.product}"
    
    class BookDetails(models.Model):
        book_id = models.IntegerField()
    
    
