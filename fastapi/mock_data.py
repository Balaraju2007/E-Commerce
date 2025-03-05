from sqlalchemy.orm import Session
from app.database import SessionLocal
from app import models
from datetime import datetime

def insert_mock_data():
    """Inserts mock data into the SQLite database"""
    
    db: Session = SessionLocal()

    # ✅ Insert Users
    user1 = models.User(email="kuladeep@gmail.com", password="asdf", full_name="kuladeep", contact_number="1234567890", profile_image='kuladeep.jpg')
    user2 = models.User(email="hemanth@gmail.com", password="asdf", full_name="hemanth", contact_number="0987654321", profile_image='hemanth.jpg')
    user3 = models.User(email="balaraju@gmail.com", password="asdf", full_name="Balaraju", contact_number="1234509876", profile_image="balaraju.jpg")
    user4 = models.User(email="rakesh@gmail.com", password="asdf", full_name="Rakesh", contact_number="9876543210", profile_image="rakesh.jpg")

    db.add_all([user1, user2, user3, user4])
    db.commit()

    # ✅ Insert Authors
    author1 = models.Author(author_name="John Doe")
    author2 = models.Author(author_name="Jane Smith")
    author3 = models.Author(author_name="bala guruswamy")
    author4 = models.Author(author_name="rakesh sharma")
    
    db.add_all([author1, author2, author3, author4])
    db.commit()

    # ✅ Insert Genres
    genre1 = models.Genre(genre_name="Programming")
    genre2 = models.Genre(genre_name="Science Fiction")
    genre3 = models.Genre(genre_name="Non-Fiction")
    genre4 = models.Genre(genre_name="Biography")

    db.add_all([genre1, genre2, genre3, genre4])
    db.commit()

    # ✅ Insert Publishers
    publisher1 = models.Publisher(publisher_name="Tech Books")
    publisher2 = models.Publisher(publisher_name="Fiction House")
    publisher3 = models.Publisher(publisher_name="Falcon Books")
    publisher4 = models.Publisher(publisher_name="Radiant Books")
    
    db.add_all([publisher1, publisher2, publisher3, publisher4])
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
    
    book3 = models.Book(
        book_name="C Programming",
        seller_id=user3.user_id,
        author_id=author3.author_id,
        price=39.99,
        quantity=7,
        genre_id=genre1.genre_id,
        publisher_id=publisher3.publisher_id,
        picture="c_programming.jpg"
    )

    db.add_all([book1, book2, book3])
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
