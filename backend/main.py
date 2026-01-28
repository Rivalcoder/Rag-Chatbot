import os
import logging

# 1. Set environment variables to suppress TensorFlow/oneDNN logs
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'  # 3 = FATAL only

# 2. Suppress warnings from Python's warnings module
import warnings
warnings.filterwarnings("ignore")

# 3. Suppress Abseil (used by TensorFlow) logging
logging.getLogger('absl').setLevel(logging.ERROR)
logging.getLogger('tensorflow').setLevel(logging.ERROR)

from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import shutil
import os
from rag_service import ingest_document, query_rag, ingest_folder

app = FastAPI(title="ISRO AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class QueryRequest(BaseModel):
    query: str

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
# Initialize RAG with existing docs
print(ingest_folder(UPLOAD_DIR))

@app.get("/")
def read_root():
    return {"message": "ISRO AI Backend is Online. Systems Nominal."}

@app.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Process the file
        status = ingest_document(file_path)
        return {"filename": file.filename, "status": status}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/chat")
def chat(request: QueryRequest):
    try:
        data = query_rag(request.query)
        return data  # contains "response" and "sources"
    except Exception as e:
        return {"response": f"AI Error: {str(e)}", "sources": []}

@app.delete("/documents/{filename}")
def delete_document(filename: str):
    file_path = os.path.join(UPLOAD_DIR, filename)
    if os.path.exists(file_path):
        os.remove(file_path)
        # In a real app, we'd remove specific docs from FAISS. 
        # For this prototype, we'll re-ingest the folder to sync.
        from rag_service import clear_vector_store
        clear_vector_store()
        ingest_folder(UPLOAD_DIR)
        return {"message": f"Document {filename} deleted and index updated."}
    raise HTTPException(status_code=404, detail="File not found")

@app.get("/documents")
def list_documents():
    files = []
    # Mock dates for specific files as requested by user
    file_metadata = {
        "Chandrayaan-3_Mission_Profile.pdf": "2023-08-23",
        "PSLV-C57_Brochure.pdf": "2023-09-02",
        "Gaganyaan_Safety_Protocols_v2.pdf": "2024-01-15"
    }
    
    if os.path.exists(UPLOAD_DIR):
        for f in os.listdir(UPLOAD_DIR):
            if f.endswith(".pdf"):
                path = os.path.join(UPLOAD_DIR, f)
                stat = os.stat(path)
                size_mb = stat.st_size / (1024 * 1024)
                
                if size_mb >= 1:
                    size_str = f"{round(size_mb, 1)} MB"
                else:
                    size_str = f"{round(stat.st_size / 1024, 1)} KB"
                
                # Get number of pages (approx estimation or use pypdf)
                try:
                    from pypdf import PdfReader
                    reader = PdfReader(path)
                    pages = len(reader.pages)
                except:
                    pages = 20
                
                date_str = file_metadata.get(f, "2024-01-27")
                
                files.append({
                    "name": f,
                    "size": size_str,
                    "date": date_str,
                    "pages": pages
                })
    return {"documents": files}
