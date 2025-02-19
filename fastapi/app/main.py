from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from . import crud, models, schemas, database
from .database import init_db
app = FastAPI()


# Initialize the database tables on startup
@app.on_event("startup")
def on_startup():
    init_db()



# Dependency to get the database session
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/items/", response_model=schemas.Item)
def create_item(item: schemas.ItemCreate, db: Session = Depends(get_db)):
    return crud.create_item(db=db, item=item)

@app.get("/items/", response_model=list[schemas.Item])
def read_items(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    items = crud.get_items(db=db, skip=skip, limit=limit)
    return items

@app.get("/items/{item_id}", response_model=schemas.Item)
def get_items_number(item_id: int , db : Session = Depends(get_db)):
    item = crud.get_item_by_number(db = db, item_id = item_id)
    return item
