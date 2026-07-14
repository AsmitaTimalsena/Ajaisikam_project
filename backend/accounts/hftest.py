from huggingface_hub import InferenceClient
import os
from dotenv import load_dotenv
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

load_dotenv(BASE_DIR / ".env.development")
HF_API_TOKEN = os.environ.get("HF_API_TOKEN")

if not HF_API_TOKEN:
    raise ValueError("HF_API_TOKEN environment variable is not set.")

client = InferenceClient(
    provider="hf-inference",
    api_key=HF_API_TOKEN,
)

embedding = client.feature_extraction(
    "Hello world",
    model="sentence-transformers/all-MiniLM-L6-v2",
)

print(type(embedding))
print(embedding.shape)