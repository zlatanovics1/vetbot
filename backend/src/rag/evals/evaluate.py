import json
from openevals.llm import create_llm_as_judge
from openevals.prompts import RAG_RETRIEVAL_RELEVANCE_PROMPT

from ...services.chat_engine import retrieve_context

retrieval_relevance_evaluator = create_llm_as_judge(
    prompt=RAG_RETRIEVAL_RELEVANCE_PROMPT,
    feedback_key="retrieval_relevance",
    model="openai:o3-mini",
)
with open("src/rag/evals/qa_pairs.json", "r") as f:
        qa_pairs = json.load(f)

def retrieval_relevance(question: str, context: str):
    inputs = {
    "question": question,
    }
    context = {
        "documents": [
            context
        ],
    }
    eval_result = retrieval_relevance_evaluator(
        inputs=inputs,
        context=context,
    )
    return {**eval_result, "question": question, "context": context}



def evaluate_retrieval_relevance():
    eval_results = []
    for qa_pair in qa_pairs:
        retrieved_docs = retrieve_context(qa_pair["question"])
        retrieved_context = "\n".join([doc.text for doc in retrieved_docs])
        eval_result = retrieval_relevance(qa_pair["question"], retrieved_context)
        eval_results.append(eval_result)
    #num of score True / total
    score = sum(1 for result in eval_results if result["score"] == True) / len(eval_results)
    print(f"Score: {score*100}%")
    with open("src/rag/evals/retrieval_relevance_results.json", "w") as f:
        json.dump({
        "score": score,
        "eval_results": eval_results
        }, f)
    

evaluate_retrieval_relevance()