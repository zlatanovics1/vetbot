import json
from src.rag.utils import get_data_chunks
from llama_index.core.llms.structured_llm import StructuredLLM
from openai import OpenAI
from pydantic import BaseModel
from typing import List
from dotenv import load_dotenv

load_dotenv()


class QAOutput(BaseModel):
    question: str
    answer: str

class QAPair(BaseModel):
    pairs: List[QAOutput]

# llm = StructuredLLM(llm=OpenAI(), output_cls=List[QAOutput])
openai = OpenAI()


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

def generate_qa_pairs():
    nodes = get_data_chunks()
    chunks = [node.text for node in nodes]
    qa_pairs = []
    length = len(chunks) 
    # send 5 chunks per iteration
    for i in range(0, length, 5):
        chunk = chunks[i:i+5]
        response = openai.responses.parse(
            model="gpt-4.1",
            input=[
                {"role": "system", "content": QA_generation_prompt},
                {"role": "user", "content": "Here is the context: " + "\n".join(chunk)}
            ],
            text_format=QAPair,
        )
        parsed = response.output_parsed
        qa_pairs.extend(parsed.pairs)
        print(f"Processed {i+5}/{length} chunks")

    # create a json file with the qa pairs
    print(qa_pairs)
    with open("src/rag/evals/qa_pairs.json", "w") as f:
        json.dump(qa_pairs, f, default=str)
    return qa_pairs


    

