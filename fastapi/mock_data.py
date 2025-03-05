from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import models
from datetime import datetime

def insert_mock_data():
    """Inserts mock data into the SQLite database"""
    
    db: Session = SessionLocal()

    # ✅ Insert Users
    user1 = models.User(email="user1@example.com", password="hashedpassword", full_name="User One", contact_number="1234567890", profile_image=None)
    user2 = models.User(email="user2@example.com", password="hashedpassword", full_name="User Two", contact_number="0987654321", profile_image=None)

    db.add_all([user1, user2])
    db.commit()

    # ✅ Insert Authors
    author1 = models.Author(author_name="John Doe")
    author2 = models.Author(author_name="Jane Smith")

    db.add_all([author1, author2])
    db.commit()

    # ✅ Insert Genres
    genre1 = models.Genre(genre_name="Programming")
    genre2 = models.Genre(genre_name="Science Fiction")

    db.add_all([genre1, genre2])
    db.commit()

    # ✅ Insert Publishers
    publisher1 = models.Publisher(publisher_name="Tech Books")
    publisher2 = models.Publisher(publisher_name="Fiction House")

    db.add_all([publisher1, publisher2])
    db.commit()

    # ✅ Insert Books
    book1 = models.Book(
        book_name="Python Basics",
        seller_id=user1.user_id,
        author_id=author1.author_id,
        price=49.99,
        quantity=10,
        genre_id=genre1.genre_id,
        publisher_id=publisher1.publisher_id,
        picture="python_basics.jpg"
    )

    book2 = models.Book(
        book_name="AI Revolution",
        seller_id=user2.user_id,
        author_id=author2.author_id,
        price=59.99,
        quantity=5,
        genre_id=genre2.genre_id,
        publisher_id=publisher2.publisher_id,
        picture="ai_revolution.jpg"
    )

    db.add_all([book1, book2])
    db.commit()

    # ✅ Insert Orders & OrderItems
    order1 = models.Order(user_id=user1.user_id, order_date=datetime.utcnow())
    db.add(order1)
    db.commit()
    db.refresh(order1)

    order_item1 = models.OrderItem(order_id=order1.order_id, book_id=book1.book_id, quantity=2)
    order_item2 = models.OrderItem(order_id=order1.order_id, book_id=book2.book_id, quantity=1)

    db.add_all([order_item1, order_item2])
    db.commit()

    order2 = models.Order(user_id=user2.user_id, order_date=datetime.utcnow())
    db.add(order2)
    db.commit()
    db.refresh(order2)

    order_item3 = models.OrderItem(order_id=order2.order_id, book_id=book1.book_id, quantity=1)
    db.add(order_item3)
    db.commit()

    # ✅ Insert Cart & CartItems
    cart1 = models.Cart(user_id=user1.user_id)
    db.add(cart1)
    db.commit()
    db.refresh(cart1)

    cart_item1 = models.CartItem(cart_id=cart1.cart_id, book_id=book2.book_id, quantity=2)
    db.add(cart_item1)
    db.commit()

    print("✅ Mock data inserted successfully!")

if __name__ == "__main__":
    insert_mock_data()
