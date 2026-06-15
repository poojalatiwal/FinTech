- for ml
cd FinSight-ml
python3 -m venv venv
source venv/bin/activate
python ml_api.py

- for vector db 
cd rag-service
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --reload --port 8000


- for frontend 
cd frontend
npm run dev
