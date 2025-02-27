from sqlalchemy import Column, Integer, String
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)  # Ensure you hash passwords before storing!
    full_name = Column(String, nullable=False)
    contact_number = Column(String, nullable=True)
    profile_image = Column(String, nullable=True)  # Stores the image file path
