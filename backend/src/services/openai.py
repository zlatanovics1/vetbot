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

from typing import List
from openai import OpenAI
from pydantic import BaseModel


QA_generation_prompt = """
    Your task is to write a 5 factoid questions and answers given a context provided by user.
    Your factoid question should be answerable with a specific, concise piece of factual information from the context.
    Your factoid question should be formulated in the same style as questions users could ask in a search engine.
    This means that your factoid question MUST NOT mention something like "according to the passage" or "context".

    Provide your answer as follows:

    Output:::
    [
        {
            "question": "...",
            "answer": "..."
        },
        ...
    ]
"""

class QAOutput(BaseModel):
    question: str
    answer: str

class QAPair(BaseModel):
    pairs: List[QAOutput]

# llm = StructuredLLM(llm=OpenAI(), output_cls=List[QAOutput])
openai = OpenAI()

def generate_qa_pairs(context: str) -> List[QAOutput]:
    response = openai.responses.parse(
            model="gpt-4.1",
            input=[
                {"role": "system", "content": QA_generation_prompt},
                {"role": "user", "content": "Here is the context: " + context}
            ],
            text_format=QAPair,
        )
    parsed = response.output_parsed
    return parsed.pairs