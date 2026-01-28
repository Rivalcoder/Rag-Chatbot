import os
# Suppress TensorFlow/OneDNN warnings
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'

from dotenv import load_dotenv
load_dotenv(override=True)

from langchain_community.document_loaders import PyPDFLoader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.vectorstores import FAISS
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_google_genai import ChatGoogleGenerativeAI


load_dotenv(override=True)

# Global Vector Store
vector_store = None

# Gemini Setup
# Ensure GOOGLE_API_KEY is in your environment or .env file
api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    print("CRITICAL WARNING: GOOGLE_API_KEY is not set in environment!")
else:
    print(f"DEBUG: Loaded API Key starting with: {api_key[:10]}...")

llm = ChatGoogleGenerativeAI(model="gemini-2.5-flash-lite", temperature=0.7)

def clear_vector_store():
    global vector_store
    vector_store = None

def ingest_document(file_path: str):
    global vector_store
    try:
        loader = PyPDFLoader(file_path)
        documents = loader.load()
        
        text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        splits = text_splitter.split_documents(documents)
        
        # Local Embeddings (free, runs on CPU/GPU)
        print("DEBUG: Initializing Neural Core (Embeddings)...")
        embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2") 
        print("DEBUG: Neural Core Online.")

        if vector_store is None:
            vector_store = FAISS.from_documents(splits, embeddings)
        else:
            vector_store.add_documents(splits)
            
        return "Document processed and added to Vector DB."
    except Exception as e:
        return f"Error processing document: {str(e)}"

def ingest_folder(folder_path: str):
    global vector_store
    
    if not os.path.exists(folder_path):
        return "Uploads folder not found."
        
    ingested_count = 0
    errors = []
    
    for filename in os.listdir(folder_path):
        if filename.endswith(".pdf"):
            file_path = os.path.join(folder_path, filename)
            try:
                # We can reuse the logic, but to avoid re-initializing vector_store multiple times inefficiently,
                # we could collect all docs first. But for now, simple loop is fine for prototype.
                ingest_document(file_path)
                ingested_count += 1
            except Exception as e:
                errors.append(f"{filename}: {e}")
    
    return f"Ingested {ingested_count} documents from archive. Errors: {len(errors)}"

def query_rag(query: str):
    global vector_store
    if vector_store is None:
        return {"response": "I haven't read any documents yet. Please upload documents to the Archives to begin analysis.", "sources": []}
    
    # 1. Retrieve Docs
    docs = vector_store.similarity_search(query, k=4)
    context_text = "\n\n".join([d.page_content for d in docs])
    
    # Extract unique sources
    sources = []
    for d in docs:
        source_name = os.path.basename(d.metadata.get('source', 'unknown'))
        if source_name not in sources and source_name != 'unknown':
            sources.append(source_name)

    # 2. Generate Answer with Gemini
    prompt_template = f"""
    SYSTEM ROLE: ISRO NEURAL CORE (INC)
    
    MISSION CONTEXT:
    {context_text}
    
    USER QUERY: {query}
    
    GUIDELINES:
    1. You are the ISRO Neural Core, a direct interface for mission intelligence.
    2. Be concise, professional, and technical. Avoid repetitive boilerplate or long greetings on every message.
    3. Use the MISSION CONTEXT to answer technical questions accurately.
    4. If the information is not in the context, state: "RECORD NOT FOUND IN MISSION ARCHIVES."
    5. For non-technical queries or greetings, respond naturally but maintain a professional 'Mission Control' persona.
    6. Always format your output using clean Markdown (bolding, lists, etc.) for readability.
    
    OUTPUT:"""
    
    try:
        response = llm.invoke(prompt_template)
        return {"response": response.content, "sources": sources}
    except Exception as e:
        return {"response": f"Gemini Error: {str(e)}", "sources": []}
