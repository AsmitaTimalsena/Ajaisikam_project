# from transformers import pipeline

# # Load model once when server starts
# classifier = pipeline(
#     "zero-shot-classification",
#     model="facebook/bart-large-mnli"
# )

# CATEGORIES = [
#     "CAREER", "RESEARCH", "TECH", "EDUCATION",
#     "CHEMISTRY", "BIOLOGY", "PHYSICS",
#     "ASTRONOMY", "LITERATURE", "BUSINESS", "OTHER"
# ]

# THRESHOLD = 0.50


# def get_ai_category(title, description, user_selected_category):
#     """
#     This combines title + description, and runs zero-shot classification.
#     If confident enough ==> use AI prediction.
#     If not confident ==> fall back to user's selected category.
#     """
#     text = f"{title}. {description}"

#     result = classifier(text, candidate_labels=CATEGORIES)

#     predicted_category = result["labels"][0]
#     confidence = result["scores"][0]

#     if confidence >= THRESHOLD:
#         ai_override = predicted_category != user_selected_category
#         return predicted_category, ai_override, round(confidence, 2)
#     else:
#         # if AI not confident enough - keep user's choice
#         return user_selected_category, False, round(confidence, 2)
    

'''
    simple single confidence return code in sentence transformer

    from sentence_transformers import SentenceTransformer, util

# Small, fast model — loads quickly
model = SentenceTransformer('all-MiniLM-L6-v2')

CATEGORY_DESCRIPTIONS = {
    "TECH": "programming, software development, Python, React, AWS, EC2, S3, cloud computing, machine learning, IT, coding, software engineering, web development, database, API, DevOps, networking",
    "CAREER": "job, career guidance, internship, resume, employment, work, profession, job application, lab assistant, medical career",
    "PHYSICS": "physics, quantum mechanics, higgs boson, particle physics, thermodynamics, optics, forces",
    "CHEMISTRY": "chemistry, organic chemistry, lab, reactions, molecules, periodic table, compounds",
    "BIOLOGY": "biology, medical, anatomy, genetics, botany, microbiology, living organisms",
    "RESEARCH": "research, academic paper, study, investigation, thesis, dissertation, experiment",
    "EDUCATION": "learning, studying, exam, university, college, student, academic guidance, tutor",
    "ASTRONOMY": "astronomy, space, stars, planets, telescope, universe, astrophysics, galaxy",
    "LITERATURE": "literature, writing, books, poetry, language, reading, grammar, novels",
    "BUSINESS": "business, startup, entrepreneurship, marketing, finance, management, investment",
    "OTHER": "general question, miscellaneous, other topics, unsure, help needed"
}

THRESHOLD = 0.25  # cosine similarity threshold — lower than before

def get_ai_category(title, description, user_selected_category):
    """
    Uses semantic similarity to match post to category.
    Compares post text against rich category descriptions.
    """
    text = f"{title}. {description}"

    # Encode the post text
    post_embedding = model.encode(text, convert_to_tensor=True)

    best_category = None
    best_score = -1

    # Compare post against each category description
    for category, category_text in CATEGORY_DESCRIPTIONS.items():
        category_embedding = model.encode(category_text, convert_to_tensor=True)
        score = util.cos_sim(post_embedding, category_embedding).item()

        if score > best_score:
            best_score = score
            best_category = category

    if best_score >= THRESHOLD:
        ai_override = best_category != user_selected_category
        return best_category, ai_override, round(best_score, 2)
    else:
        return user_selected_category, False, round(best_score, 2)
    

    '''