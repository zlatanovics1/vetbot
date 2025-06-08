
from llama_index.core import StorageContext, Document
from llama_index.core import VectorStoreIndex
from llama_index.vector_stores.postgres import PGVectorStore
from sqlalchemy import make_url
from src.consts import DATABASE_URL


data = """
1. How to bathe a dog?
 - First, you need to gather the necessary supplies.
 - Second, you need to prepare the dog for the bath.
 - Third, you need to bathe the dog.
 - Fourth, you need to dry the dog.

2. Should I give sweet treats to my dog?
 - No, sweet treats are not good for dogs.
 - They can cause obesity and other health problems.
"""

docs = [Document(text=data, doc_id="1")]

url = make_url(DATABASE_URL)

vector_store = PGVectorStore.from_params(
    database=url.database,
    host=url.host,
    password=url.password,
    port=url.port,
    user=url.username,
    hybrid_search=True,
    text_search_config="english",
    table_name="documents",
    embed_dim=1536,  # openai embedding dimension
    hnsw_kwargs={
        "hnsw_m": 16,
        "hnsw_ef_construction": 64,
        "hnsw_ef_search": 40,
        "hnsw_dist_method": "vector_cosine_ops",
    },
)

def ingest_data():
 try:
    storage_context = StorageContext.from_defaults(vector_store=vector_store)
    VectorStoreIndex.from_documents(
        documents=docs, storage_context=storage_context, show_progress=True
    )
    return "Success"
 except Exception as e:
    print(e)
    return "Error"