# from huggingface_hub import InferenceClient
# import os
# from dotenv import load_dotenv
# from pathlib import Path

# BASE_DIR = Path(__file__).resolve().parent.parent

# load_dotenv(BASE_DIR / ".env.development")
# HF_API_TOKEN = os.environ.get("HF_API_TOKEN")

# if not HF_API_TOKEN:
#     raise ValueError("HF_API_TOKEN environment variable is not set.")

# client = InferenceClient(
#     provider="hf-inference",
#     api_key=HF_API_TOKEN,
# )

# embedding = client.feature_extraction(
#     "Hello world",
#     model="sentence-transformers/all-MiniLM-L6-v2",
# )

# print(type(embedding))
# print(embedding.shape)


# from huggingface_hub import InferenceClient
# import os
# from dotenv import load_dotenv

# load_dotenv()

# client = InferenceClient(api_key=os.getenv("HF_API_TOKEN"))

# try:
#     result = client.feature_extraction(
#         "Hello world",
#         model="sentence-transformers/all-MiniLM-L6-v2"
#     )
#     print("SUCCESS")
#     print(type(result))
# except Exception as e:
#     print(e)

from dotenv import load_dotenv
from pathlib import Path
import os, requests

BASE_DIR = Path(__file__).resolve().parent.parent
load_dotenv(BASE_DIR / ".env.development")

print(os.environ.get("HF_API_TOKEN")[:10])


TOKEN = os.environ["HF_API_TOKEN"]

url = "https://router.huggingface.co/hf-inference/models/sentence-transformers/all-MiniLM-L6-v2"

headers = {
    "Authorization": f"Bearer {TOKEN}",
}

payload = {
    "inputs": {
        "source_sentence": "Hello world",
        "sentences": ["Hi there"]
    }
}

r = requests.post(url, headers=headers, json=payload)

print(r.status_code)
print(r.text)