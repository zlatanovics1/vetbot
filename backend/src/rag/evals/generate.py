import json
from ...rag.utils import get_data_chunks
# please uncomment this if you run the script directly, so that you can use the .env file
# from dotenv import load_dotenv
# load_dotenv()

from ...services.openai import generate_qa_pairs


def generate_qa_dataset():
    nodes = get_data_chunks()
    chunks = [node.text for node in nodes]
    qa_pairs = []
    length = len(chunks) 
    # send 5 chunks per iteration
    for i in range(0, length, 5):
        chunk = chunks[i:i+5]
        new_pairs = generate_qa_pairs("\n".join(chunk))
        qa_pairs.extend(new_pairs)
        print(f"Processed {i+5}/{length} chunks")

    # create a json file with the qa pairs
    print(qa_pairs)
    with open("src/rag/evals/qa_pairs.json", "w") as f:
        json.dump(qa_pairs, f, default=str)
    return qa_pairs


    

