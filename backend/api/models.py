from django.db import models
from django.core.exceptions import ObjectDoesNotExist, ValidationError  # Import ValidationError



# Create your models here.

# class UserSubmision(models.Model):
#     username = models.CharField(max_length=255)
#     password = models.CharField(max_length=255)

#     def __str__(self):
#         return self.username

def get_default_seller():
    """Fetch an existing seller or create a default one."""
    seller_name = "default_user"
    try:
        return User.objects.get(name=seller_name).name  # Fetch existing seller
    except ObjectDoesNotExist:
        return User.objects.create(name=seller_name, email="default@example.com", password="password123")  # Create default seller


class User(models.Model):
    name = models.CharField(primary_key=True, max_length=40)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=20)

    def __str__(self):
        return self.name


class BookDetails(models.Model):
        book_id = models.AutoField(primary_key=True)  # Unique book ID
        seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name="books", to_field="name", db_column="seller", default=get_default_seller) # stored seller details
        title = models.CharField(max_length=255)  # Title of the book
        author = models.CharField(max_length=255)  # Author of the book
        publisher = models.CharField(max_length=255)  # Publisher of the book
        genre = models.CharField(max_length=100, null=True, blank=True)  # Genre of the book (optional)
        price = models.DecimalField(max_digits=10, decimal_places=2)  # Price of the book
        description = models.TextField(null=True, blank=True)  # Book description (optional)
        quantity = models.PositiveIntegerField(default=1)  # Quantity of the book in stock
        
        def __str__(self):
            return f"Book: {self.title} by {self.author}"

    

class Order(models.Model):
    id = models.AutoField(primary_key=True)
    username = models.ForeignKey(User, on_delete=models.CASCADE, to_field='name', db_column='username')
    order_id = models.PositiveIntegerField()
    book = models.ForeignKey(BookDetails, on_delete=models.CASCADE, related_name = 'orders',default=1)
    order_quantity = models.PositiveIntegerField(default=1)
    order_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('username', 'order_id')  # Ensure order_id is unique per user

    def clean(self):
        # Ensure the quantity ordered does not exceed the available quantity in BookDetails
        if self.order_quantity > self.book.quantity:
            raise ValidationError(f"Not enough stock available for {self.book.title}. Available quantity: {self.book.quantity}")

    
    def save(self, *args, **kwargs):
        
        self.clean()
        
        if self.order_quantity <= self.book.quantity:
            self.book.quantity -= self.order_quantity
            self.book.save()  # Save the updated book quantity
        
        if not self.order_id:  # If order_id is not provided, assign a new one
            last_order = Order.objects.filter(username=self.username).order_by('-order_id').first()
            self.order_id = last_order.order_id + 1 if last_order else 1  # Increment or start at 1
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.username.name} - Order {self.order_id}: {self.product}"
    

    
