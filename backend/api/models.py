from django.db import models
from django.core.exceptions import ObjectDoesNotExist, ValidationError  # Import ValidationError



def get_default_seller():
    """Fetch an existing seller or create a default one."""
    seller_name = "default_user"
    try:
        return User.objects.get(name=seller_name)  # Fetch existing seller by name
    except ObjectDoesNotExist:
        # Create a default seller if it doesn't exist
        return User.objects.create(name=seller_name, email="default@example.com", password="password123", contact_number="1234567890")


class User(models.Model):
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('terminated', 'Terminated'),
    ]
    
    user_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=40,null = False)
    email = models.EmailField(unique=True,null = False)
    password = models.CharField(max_length=20,null = False)
    contact_number = models.CharField(max_length=10,null = False)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='active')
    
    def __str__(self):
        return f"{self.name} ({self.get_status_display()})"

class author(models.Model):
    author_id = models.AutoField(primary_key=True)
    author_name = models.CharField(max_length=255)
    
    def __str__(self):
        return self.author_name
    

class publisher(models.Model):
    publisher_id = models.AutoField(primary_key=True)
    publisher_name = models.CharField(max_length=255)
    
    def __str__(self):
        return self.publisher_name

class genre(models.Model):
    genre_id = models.AutoField(primary_key=True)
    genre_name = models.CharField(max_length=255)
    def __str__(self):
        return self.genre_name

class Book(models.Model):
    book_id = models.AutoField(primary_key=True)
    book_name = models.CharField(max_length=255)
    seller_name = models.ForeignKey(User, on_delete=models.CASCADE, related_name="books", to_field="user_id", db_column="seller_name",default=get_default_seller)
    author_id = models.ForeignKey(author, on_delete=models.CASCADE, related_name="books", to_field="author_id", db_column="author_id")
    publisher_id = models.ForeignKey(publisher, on_delete=models.CASCADE, related_name="books", to_field="publisher_id", db_column="publisher_id")
    genre_id = models.ForeignKey(genre, on_delete=models.CASCADE, related_name="books", to_field="genre_id", db_column="genre_id")
    price = models.DecimalField(max_digits=10, decimal_places=2)
    quantity = models.PositiveIntegerField(default=1)
    
    
    def __str__(self):
        return f"Book: {self.book_name} by {self.author_id.author_name}"
    

class cart(models.Model):
    cart_id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name="cart", to_field="user_id", db_column="user_id")
    
    def __str__(self):
        return f"Cart of {self.user_id.name}"

class cart_items(models.Model):
    cart_item_id = models.AutoField(primary_key=True)
    cart_id = models.ForeignKey(cart, on_delete=models.CASCADE, related_name="cart_items", to_field="cart_id", db_column="cart_id")
    book_id = models.ForeignKey(Book, on_delete=models.CASCADE, related_name="cart_items", to_field="book_id", db_column="book_id")
    quantity = models.PositiveIntegerField(default=1)
    
    def __str__(self):
        return f"Book: {self.book_id.book_name} by {self.book_id.author_id.author_name} in cart of {self.cart_id.user_id.name}"
    
    
 

class orders(models.Model):
    order_id = models.AutoField(primary_key=True)
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name="orders", to_field="user_id", db_column="user_id")
    order_date = models.DateField(auto_now_add=True)
    
    def __str__(self):
        return f"Order: {self.order_id} by {self.user_id.name}"
    
    
class order_items(models.Model):
    order_item_id = models.AutoField(primary_key=True)
    order_id = models.ForeignKey(orders, on_delete=models.CASCADE, related_name="order_items", to_field="order_id", db_column="order_id")
    book_id = models.ForeignKey(Book, on_delete=models.CASCADE, related_name="order_items", to_field="book_id", db_column="book_id")
    quantity = models.PositiveIntegerField(default=1)
    price = models.DecimalField(max_digits=10, decimal_places=2)  # Store price at the time of purchase

    def save(self, *args, **kwargs):
        """Set the price at the time of ordering"""
        if not self.price:  # Only set if it's not already assigned
            self.price = self.book.price  
        super().save(*args, **kwargs)
        
        
    def __str__(self):
        return f"Book: {self.book_id.book_name} by {self.book_id.author_id.author_name} in order: {self.order_id.order_id}"