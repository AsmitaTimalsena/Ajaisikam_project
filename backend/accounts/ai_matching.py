from huggingface_hub import InferenceClient
import numpy as np
import os, json
from pathlib import Path

HF_API_TOKEN = os.environ.get("HF_API_TOKEN")
if not HF_API_TOKEN:
    raise ValueError("HF_API_TOKEN environment variable is not set.")

BASE_DIR = Path(__file__).resolve().parent # to store the embeddings in json file for embeddings and optimize api calls
EMBEDDINGS_FILE = BASE_DIR / "embeddings.json"

client = InferenceClient(
    provider="hf-inference",
    api_key=HF_API_TOKEN,
)
CATEGORY_DESCRIPTIONS = {
    "TECH": "programming, software development, Python, React, AWS, cloud computing, machine learning, IT, coding, software engineering, web development, database, API, DevOps, networking",
    "CAREER": "job, career guidance, internship, resume, employment, work, profession, job application, lab assistant, medical career",
    "PHYSICS": "physics, quantum mechanics, higgs boson, particle physics, thermodynamics, optics, forces",
    "CHEMISTRY": "chemistry, organic chemistry, lab, reactions, molecules, periodic table, compounds",
    "BIOLOGY": "biology, medical, anatomy, genetics, botany, microbiology, living organisms, biomedical",
    "RESEARCH": "research, academic paper, study, investigation, thesis, dissertation, experiment, professor, research team",
    "EDUCATION": "learning, studying, exam, university, college, student, academic guidance, tutor",
    "ASTRONOMY": "astronomy, space, stars, planets, telescope, universe, astrophysics, galaxy",
    "LITERATURE": "literature, writing, books, poetry, language, reading, grammar, novels",
    "BUSINESS": "business, startup, entrepreneurship, marketing, finance, management, investment",
    "OTHER": "general question, miscellaneous, other topics, unsure, help needed"
}
CATEGORY_EMBEDDINGS = {} #used to hold all precomputed embeddings

THRESHOLD = 0.25

def save_embeddings():

    with open(EMBEDDINGS_FILE, "w") as f:
        json.dump(CATEGORY_EMBEDDINGS, f,indent=4)

def load_embeddings():
    global CATEGORY_EMBEDDINGS

    if not EMBEDDINGS_FILE.exists():
        return False

    try:
        with open(EMBEDDINGS_FILE, "r") as f:
            CATEGORY_EMBEDDINGS = json.load(f)

        print("Loaded category embeddings from file.")
        return True

    except Exception as e:
        print(f"Could not load embeddings: {e}")
        return False
    

def get_embedding(text):
    """
    Get embedding from Hugging Face Inference API.
    """

    try:
        embedding = client.feature_extraction(
            text,
            model="sentence-transformers/all-MiniLM-L6-v2",
        )

        return embedding

    except Exception as e:
        print(f"HF Inference Error: {e}")
        return None
    
def generate_category_embeddings():

    global CATEGORY_EMBEDDINGS

    CATEGORY_EMBEDDINGS = {}

    print("Generating category embeddings...")

    for category, text in CATEGORY_DESCRIPTIONS.items():

        embedding = get_embedding(text)

        if embedding is None:
            continue

        CATEGORY_EMBEDDINGS[category] = embedding.tolist()

        print(category, "done")

    save_embeddings()

    print("Saved category embeddings.")

def initialize_embeddings():

    loaded = load_embeddings()

    if loaded:
        return

    generate_category_embeddings()

def cosine_similarity(vec1, vec2):
    """Compute cosine similarity between two vectors"""
    vec1 = np.array(vec1)
    vec2 = np.array(vec2)
    return np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))


def get_ai_category(title, description, user_selected_category):
    """
    Main function called by views.
    Gets embeddings via HF API and computes similarity against category descriptions.
    Returns top 2 matching categories, ai_override flag, and confidence score.
    """
    try:
        text = f"{title}. {description}"

        # Get embedding for the post text
        post_embedding = get_embedding(text)

        if post_embedding is None:
            print("Could not get post embedding, falling back to user category")
            return [user_selected_category], False, 0.0

        scores = {}

        # Compare post against each category description
        for category, category_embedding in CATEGORY_EMBEDDINGS.items():

            score = cosine_similarity(post_embedding, category_embedding)
            scores[category] = round(float(score), 2)

        
        if not scores:
            return [user_selected_category], False, 0.0
        
        # Sort categories by score highest to lowest
        sorted_categories = sorted(scores.items(), key=lambda x: x[1], reverse=True)

        top1_category, top1_score = sorted_categories[0]
        top2_category, top2_score = sorted_categories[1]

        top_categories = []

        # Add top 1 if above threshold
        if top1_score >= THRESHOLD:
            top_categories.append(top1_category)

        # Add top 2 only if also above threshold
        if top2_score >= THRESHOLD:
            top_categories.append(top2_category)

        # If nothing passed threshold, fall back to user's selected category
        if not top_categories:
            top_categories = [user_selected_category]

        ai_override = user_selected_category not in top_categories
        
        return top_categories, ai_override, top1_score

    except Exception as e:
        # If anything fails, fall back gracefully
        print(f"AI matching error: {e}")
        return [user_selected_category], False, 0.0