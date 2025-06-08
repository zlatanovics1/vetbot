# CUSTOM RAG example
# from src.services.openAIService import embed_text, generate_faq_answer
# from src.models.models import Document
# from src.api.deps import get_db
# from sqlmodel import select

# session = next(get_db())

# def retrieve_chunks(question: str) -> list[Document]:
#     embedding = embed_text(question)
#     chunks = session.exec(select(Document).where(Document.embedding.cosine_distance(embedding) < 0.4).order_by(Document.embedding.cosine_distance(embedding)).limit(5)).all()
#     return chunks

# def run_rag_pipeline(question: str) -> str:
#     chunks = retrieve_chunks(question)
#     context = chunks and "\n".join([chunk.content for chunk in chunks]) or "No relevant context found."
#     print("Context:", context)
#     answer = generate_faq_answer(question, context)
#     return answer


from llama_index.core import VectorStoreIndex
from llama_index.vector_stores.postgres import PGVectorStore
from sqlalchemy import make_url
from src.consts import DATABASE_URL

url = make_url(DATABASE_URL)

vector_store = PGVectorStore.from_params(
    database=url.database,
    host=url.host,
    password=url.password,
    port=url.port,
    user=url.username,
    hybrid_search=True,
    text_search_config="english",
    table_name="documents", #todo add as env variable
    embed_dim=1536,  # openai embedding dimension
    hnsw_kwargs={
        "hnsw_m": 16,
        "hnsw_ef_construction": 64,
        "hnsw_ef_search": 40,
        "hnsw_dist_method": "vector_cosine_ops",
    },
)
# index that will be used as chat engine
index = VectorStoreIndex.from_vector_store(vector_store=vector_store)