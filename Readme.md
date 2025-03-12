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
.\venv\Scripts\activate
pip install -r requirements.txt 
python3 run.py (for linux )
python execute.py (for windows)

uvicorn app.main:app --log-level debug --reload

use ps  in windows

```


**alembic added to track the migrations on db**
```
alembic init alembic (only once at starting)

alembic revision --autogenerate -m "Describe the change"

alembic upgrade head

if you want revert back to previous

alembic downgrade -1
```


