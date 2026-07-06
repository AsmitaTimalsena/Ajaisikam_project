from sentence_transformers import SentenceTransformer, util

model = SentenceTransformer('all-MiniLM-L6-v2')

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

THRESHOLD = 0.25

def get_ai_category(title, description, user_selected_category):
    text = f"{title}. {description}"

    post_embedding = model.encode(text, convert_to_tensor=True)

    scores = {}

    for category, category_text in CATEGORY_DESCRIPTIONS.items():
        category_embedding = model.encode(category_text, convert_to_tensor=True)
        score = util.cos_sim(post_embedding, category_embedding).item()
        scores[category] = round(score, 2)

    # Sort by score descending
    sorted_categories = sorted(scores.items(), key=lambda x: x[1], reverse=True)

    top1_category, top1_score = sorted_categories[0]
    top2_category, top2_score = sorted_categories[1]

    # Build top categories list — always include top1 if above threshold
    top_categories = []

    if top1_score >= THRESHOLD:
        top_categories.append(top1_category)

    # Include top2 only if it's also above threshold
    if top2_score >= THRESHOLD:
        top_categories.append(top2_category)

    # If nothing passed threshold, fall back to user selected
    if not top_categories:
        top_categories = [user_selected_category]

    ai_override = user_selected_category not in top_categories

    return top_categories, ai_override, top1_score