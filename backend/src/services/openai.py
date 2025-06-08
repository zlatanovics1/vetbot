# CUSTOM RAG example
# from openai import OpenAI
# client = OpenAI()

# specifially tell llm what context indicates no relevant context found, and strongly encourage it to only use the context if it is relevant
#RAG_PROMPT = """
# You are an assistant for Pet Care question-answering tasks.

# Use the following pieces of retrieved context to answer the question. 
# If you don't know the answer, just say that you don't know. 
# Use three sentences maximum and keep the answer concise.
# If the context is "No relevant context found.", respond with "I don't know the answer to that question."

# Context: {context} 
# """

# def embed_text(text: str) -> list[float]:
#     response = client.embeddings.create(
#         input=text,
#         model="text-embedding-3-small"
#     )
#     return response.data[0].embedding

# def generate_faq_answer(question: str, context: str) -> str:
#     response = client.chat.completions.create(
#         model="gpt-4o-mini",
#         messages=[
#             {"role": "system", "content": RAG_PROMPT.format(context=context)},
#             {"role": "user", "content": f"Question: {question}"}
#         ]
#     )
#     return response.choices[0].message.content