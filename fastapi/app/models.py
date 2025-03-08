from sqlalchemy import Column, Integer, String, Boolean
from .database import Base
from sqlalchemy.orm import relationship
from sqlalchemy import ForeignKey, DECIMAL, DateTime

class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)  # Ensure you hash passwords before storing!
    full_name = Column(String, nullable=False)
    contact_number = Column(String, nullable=True)
    profile_image = Column(String, nullable=True)  # Stores the image file path

    books = relationship("Book", back_populates="seller", cascade="all, delete-orphan")
    cart = relationship("Cart", back_populates="user", uselist=False)
    orders = relationship("Order", back_populates="user")
    notifications = relationship("Notifications", back_populates="user", cascade="all, delete-orphan")  

# Genre Table
class Genre(Base):
    __tablename__ = "genre"

    genre_id = Column(Integer, primary_key=True, index=True)
    genre_name = Column(String, nullable=False)

    books = relationship("Book", back_populates="genre")

# Author Table
class Author(Base):
    __tablename__ = "author"

    author_id = Column(Integer, primary_key=True, index=True)
    author_name = Column(String, nullable=False)

    books = relationship("Book", back_populates="author")

# Publisher Table
class Publisher(Base):
    __tablename__ = "publisher"

    publisher_id = Column(Integer, primary_key=True, index=True)
    publisher_name = Column(String, nullable=False)

    books = relationship("Book", back_populates="publisher")

# Books Table
class Book(Base):
    __tablename__ = "books"

    book_id = Column(Integer, primary_key=True, index=True)
    book_name = Column(String, nullable=False)
    seller_id = Column(Integer, ForeignKey("users.user_id"), nullable=False)
    author_id = Column(Integer, ForeignKey("author.author_id"))
    price = Column(DECIMAL(10, 2), nullable=False)
    quantity = Column(Integer, nullable=False)
    genre_id = Column(Integer, ForeignKey("genre.genre_id"))
    publisher_id = Column(Integer, ForeignKey("publisher.publisher_id"))
    picture = Column(String, nullable=True)

    author = relationship("Author", back_populates="books")
    genre = relationship("Genre", back_populates="books")
    publisher = relationship("Publisher", back_populates="books")
    order_items = relationship("OrderItem", back_populates="book")  # ✅ Fix
    cart_items = relationship("CartItem", back_populates="book")  # ✅ Fix
    seller = relationship("User", back_populates="books", passive_deletes=True)


# Orders Table
class Order(Base):
    __tablename__ = "orders"

    order_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"))
    order_date = Column(DateTime, nullable=False)

    user = relationship("User", back_populates="orders", passive_deletes=True)
    order_items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

# Order Items Table
class OrderItem(Base):
    __tablename__ = "order_items"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.order_id", ondelete="CASCADE"), nullable=False)
    book_id = Column(Integer, ForeignKey("books.book_id"))
    quantity = Column(Integer, nullable=False)

    order = relationship("Order", back_populates="order_items", passive_deletes = True)
    book = relationship("Book", back_populates="order_items")

# Cart Table
class Cart(Base):
    __tablename__ = "cart"

    cart_id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.user_id"), nullable=False, unique=True)

    user = relationship("User", back_populates="cart", passive_deletes=True)
    cart_items = relationship("CartItem", back_populates="cart",cascade="all, delete-orphan", passive_deletes=True) 
    
# Cart Items Table
class CartItem(Base):
    __tablename__ = "cart_items"

    id = Column(Integer, primary_key=True, index=True)
    cart_id = Column(Integer, ForeignKey("cart.cart_id"), nullable=False)
    book_id = Column(Integer, ForeignKey("books.book_id"), nullable=False)
    quantity = Column(Integer, nullable=False)

    cart = relationship("Cart", back_populates="cart_items", passive_deletes=True)
    book = relationship("Book", back_populates="cart_items")
    
    
    
# notifications table
class Notifications(Base):
    __tablename__ = 'notifications'
    
    id = Column(Integer, primary_key = True, index = True)
    user_id = Column(Integer, ForeignKey('users.user_id'), nullable = False)
    message = Column(String, nullable = False)
    is_read = Column(Boolean, default= False )
    created_at = Column(DateTime, nullable = False)
    
    user = relationship('User', back_populates='notifications')
    
