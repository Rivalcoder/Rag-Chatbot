import os
from rag_service import ingest_folder, query_rag

# Initialize
print("Ingesting documents...")
print(ingest_folder("uploads"))

# Query
query = "What is the mission of Aditya-L1 and what are its payloads?"
print(f"\nQuery: {query}")
response = query_rag(query)
print(f"Response: {response}")

query = "What are the safety protocols for Gaganyaan?"
print(f"\nQuery: {query}")
response = query_rag(query)
print(f"Response: {response}")
