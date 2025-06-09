
from llama_index.core import StorageContext
from llama_index.core import VectorStoreIndex
from llama_index.vector_stores.postgres import PGVectorStore
from sqlalchemy import make_url
from src.consts import DATABASE_URL
from src.rag.utils import get_data_chunks


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
    nodes = get_data_chunks()
    storage_context = StorageContext.from_defaults(vector_store=vector_store)
    VectorStoreIndex(nodes, storage_context=storage_context, show_progress=True)
    return "Success"
 except Exception as e:
    print(e)
    return "Error"