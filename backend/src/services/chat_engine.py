import json
from llama_index.storage.chat_store.postgres import PostgresChatStore
from llama_index.core.memory import ChatMemoryBuffer
from llama_index.core.chat_engine.types import StreamingAgentChatResponse
from src.consts import DATABASE_URL
from src.rag.retrieval import index

db_url = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://")
chat_store = PostgresChatStore.from_uri(
  db_url,
)

def retrieve_context(question: str):
    engine = index.as_retriever()
    return engine.retrieve(question)

async def run_chat_engine_async(question: str, id:str) -> str:
    chat_memory = ChatMemoryBuffer.from_defaults(
    token_limit=3000,
    chat_store=chat_store,
    chat_store_key=id,
    )

    chat_engine = index.as_chat_engine(
    memory=chat_memory,
    verbose=True,
    system_prompt="You are a helpful assistant that can answer questions about pet care. You are given a question and a context. You should answer the question based on the context.",
    # chat_mode=ChatMode.CONTEXT,
    # enabling hybrid search for more accurate results, as many questions should include a keyword from the context
    vector_store_query_mode="hybrid",

    )
    streaming_response = await chat_engine.astream_chat(message=question)
    return streaming_response

async def generate_streaming_response(streaming_response: StreamingAgentChatResponse, new_id:str | None = None):
    if new_id:
        # if the conversation just started, we need to send the id to the client first
        yield f"data: {json.dumps({'id': new_id, 'content': ''})}\n\n"
    async for chunk_item in streaming_response.async_response_gen():
        if chunk_item is None:
            continue
        yield f"data: {json.dumps({'content': chunk_item})}\n\n"
