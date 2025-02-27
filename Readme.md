***Follow this steps to run this website***

**install node, npm, vscode, python in your machine**
```
 cd frontend  
 npm install  
 npm run dev
```

```
cd fastapi  
python -m venv venv   
venv\Scripts\activate  
pip install -r requirements.txt  
uvicorn app.main:app --log-level debug

```


** alembic added to track the migrations on db **
```
alembic init alembic (only once at starting)

alembic revision --autogenerate -m "Describe the change"

alembic upgrade head



if you want revert back to previous
alembic downgrade -1
```


💡 **Tip:**  make sure use terminal as command prompt not to powershell.
