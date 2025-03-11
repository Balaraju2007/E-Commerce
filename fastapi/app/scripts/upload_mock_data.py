import os
import sys
import csv
import bcrypt
from sqlalchemy.orm import Session
from datetime import datetime

sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))  # ✅ Fix Import Path

from app.database import SessionLocal
from app import models

# ✅ Utility function to hash passwords
def hash_password(password: str) -> str:
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed_password.decode("utf-8")

# ✅ Import Users
def import_users_from_csv(file_path: str, db: Session):
    with open(file_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)

        for row in reader:
            hashed_pwd = hash_password(row["password"])
            user = models.User(
                email=row["email"],
                full_name=row["full_name"],
                contact_number=row["contact_number"],
                profile_image=row["profile_image"],
                password=hashed_pwd
            )
            db.add(user)
        
        db.commit()
        print("✅ Users imported successfully!")

# ✅ Import Publishers
def import_publishers_from_csv(file_path: str, db: Session):
    with open(file_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)

        for row in reader:
            publisher = models.Publisher(publisher_name=row["publisher_name"])
            db.add(publisher)

        db.commit()
        print("✅ Publishers imported successfully!")

# ✅ Import Genres
def import_genres_from_csv(file_path: str, db: Session):
    with open(file_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)

        for row in reader:
            genre = models.Genre(genre_name=row["genre_name"])
            db.add(genre)

        db.commit()
        print("✅ Authors imported successfully!")
        
# Import Authors
def import_authors_from_csv(file_path: str, db: Session):
    with open(file_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)

        for row in reader:
            author = models.Author(author_name=row["author_name"])
            db.add(author)

        db.commit()
        print("✅ Genres imported successfully!")

# ✅ Import Books
def import_books_from_csv(file_path: str,db):
    with open(file_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)

        for row in reader:
            try:
                # ✅ Convert string values to integers for foreign key lookups
                seller_id = int(row["seller_id"])
                author_id = int(row["author_id"])
                genre_id = int(row["genre_id"])
                publisher_id = int(row["publisher_id"])

                # ✅ Check if the related entities exist in DB
                seller = db.query(models.User).filter(models.User.user_id == seller_id).first()
                author = db.query(models.Author).filter(models.Author.author_id == author_id).first()
                genre = db.query(models.Genre).filter(models.Genre.genre_id == genre_id).first()
                publisher = db.query(models.Publisher).filter(models.Publisher.publisher_id == publisher_id).first()

                if not seller:
                    print(f"❌ Seller ID {seller_id} not found. Skipping book '{row['book_name']}'")
                    continue
                if not author:
                    print(f"❌ Author ID {author_id} not found. Skipping book '{row['book_name']}'")
                    continue
                if not genre:
                    print(f"❌ Genre ID {genre_id} not found. Skipping book '{row['book_name']}'")
                    continue
                if not publisher:
                    print(f"❌ Publisher ID {publisher_id} not found. Skipping book '{row['book_name']}'")
                    continue

                # ✅ Insert book into DB
                book = models.Book(
                    book_name=row["book_name"],
                    seller_id=seller_id,
                    author_id=author_id,
                    price=float(row["price"]),
                    quantity=int(row["quantity"]),
                    genre_id=genre_id,
                    publisher_id=publisher_id,
                    picture=row["picture"]
                )
                db.add(book)

            except Exception as e:
                print(f"⚠️ Error inserting book '{row['book_name']}': {e}")

        db.commit()
        print("✅ Books imported successfully!")



def import_cart_from_csv(file_path: str, db: Session):
    with open(file_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)

        for row in reader:
            # ✅ Ensure the user exists before adding a cart
            user = db.query(models.User).filter(models.User.user_id == int(row["user_id"])).first()
            if not user:
                print(f"❌ User ID {row['user_id']} not found. Skipping cart entry.")
                continue  # Skip invalid cart entries

            cart = models.Cart(
                cart_id=int(row["cart_id"]),
                user_id=int(row["user_id"])
            )
            db.add(cart)

        db.commit()
        print("✅ Carts imported successfully!")

def import_cart_items_from_csv(file_path: str, db: Session):
    with open(file_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)

        for row in reader:
            # ✅ Ensure the cart and book exist before adding cart items
            cart = db.query(models.Cart).filter(models.Cart.cart_id == int(row["cart_id"])).first()
            book = db.query(models.Book).filter(models.Book.book_id == int(row["book_id"])).first()

            if not cart:
                print(f"❌ Cart ID {row['cart_id']} not found. Skipping cart item.")
                continue
            if not book:
                print(f"❌ Book ID {row['book_id']} not found. Skipping cart item.")
                continue

            cart_item = models.CartItem(
                cart_id=int(row["cart_id"]),
                book_id=int(row["book_id"]),
                quantity=int(row["quantity"])
            )
            db.add(cart_item)

        db.commit()
        print("✅ Cart Items imported successfully!")

def import_orders_from_csv(file_path: str, db: Session):
    """Imports orders from CSV into the database"""
    with open(file_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)

        for row in reader:
            user = db.query(models.User).filter(models.User.user_id == int(row["user_id"])).first()
            if not user:
                print(f"❌ User ID {row['user_id']} not found. Skipping order.")
                continue  # Skip invalid orders

            order = models.Order(
                order_id=int(row["order_id"]),  # Ensure ID consistency
                user_id=int(row["user_id"]),
                order_date=datetime.strptime(row["order_date"],"%Y-%m-%d %H:%M:%S.%f")
            )
            db.add(order)

        db.commit()
        print("✅ Orders imported successfully!")


def import_order_items_from_csv(file_path: str, db: Session):
    """Imports order items from CSV into the database"""
    with open(file_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)

        for row in reader:
            order = db.query(models.Order).filter(models.Order.order_id == int(row["order_id"])).first()
            book = db.query(models.Book).filter(models.Book.book_id == int(row["book_id"])).first()

            if not order:
                print(f"❌ Order ID {row['order_id']} not found. Skipping order item.")
                continue
            if not book:
                print(f"❌ Book ID {row['book_id']} not found. Skipping order item.")
                continue

            order_item = models.OrderItem(
                order_id=int(row["order_id"]),
                book_id=int(row["book_id"]),
                quantity=int(row["quantity"])
            )
            db.add(order_item)

        db.commit()
        print("✅ Order Items imported successfully!")

def import_notifications_from_csv(file_path: str, db: Session):
    """Imports notifications from a CSV file into the database."""
    
    with open(file_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)

        for row in reader:
            # ✅ Convert string values to the appropriate type
            user_id = int(row["user_id"])
            message = row["message"]
            is_read = row["is_read"].strip().lower() == "true"  # ✅ Convert "true"/"false" to boolean
            created_at = datetime.strptime(row["created_at"], "%Y-%m-%d %H:%M:%S.%f")

            # ✅ Ensure the user exists before adding a notification
            user = db.query(models.User).filter(models.User.user_id == user_id).first()
            if not user:
                print(f"❌ User ID {user_id} not found. Skipping notification.")
                continue

            notification = models.Notifications(
                user_id=user_id,
                message=message,
                is_read=is_read,
                created_at=created_at
            )
            db.add(notification)

        db.commit()
        print("✅ Notifications imported successfully!")



# ✅ Main Function
if __name__ == "__main__":
    db = SessionLocal()  # Create a new DB session

    import_users_from_csv("app/csv_files/Users.csv", db)
    import_publishers_from_csv("app/csv_files/Publishers.csv", db)
    import_genres_from_csv("app/csv_files/Genres.csv", db)
    import_authors_from_csv("app/csv_files/Authors.csv",db)
    import_books_from_csv("app/csv_files/Books.csv", db)
    import_cart_from_csv("app/csv_files/Cart.csv",db)
    import_cart_items_from_csv("app/csv_files/CartItems.csv",db)
    import_orders_from_csv("app/csv_files/Orders.csv",db)
    import_order_items_from_csv("app/csv_files/OrderItems.csv",db)
    import_notifications_from_csv("app/csv_files/Notifications.csv",db)
    
    db.close()
