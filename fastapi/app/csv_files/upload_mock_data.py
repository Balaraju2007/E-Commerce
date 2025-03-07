import os, sys
import csv
from sqlalchemy.orm import Session
sys.path.append(os.path.join(os.path.dirname(__file__), '..', '..'))
from app.database import SessionLocal
from app import models
import bcrypt

def hash_password(password: str) -> str:
    """Hashes a password using bcrypt."""
    salt = bcrypt.gensalt()
    hashed_password = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed_password.decode("utf-8")


def import_users_from_csv(file_path: str):
    """Imports users from a CSV file into the database"""

    db: Session = SessionLocal()

    with open(file_path, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)

        for row in reader:
            hashed_pwd = hash_password(row["password"])
            user = models.User(
                email=row["email"],
                full_name=row["full_name"],
                contact_number=row["contact_number"],
                profile_image=row["profile_image"],
                password=hashed_pwd  # Consider hashing this before storing in real apps!
            )
            db.add(user)
        
        db.commit()
        print("✅ Users imported successfully!")

if __name__ == "__main__":
    import_users_from_csv("Users.csv")
