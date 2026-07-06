from transformers import pipeline

# Load model once when server starts
classifier = pipeline(
    "zero-shot-classification",
    model="facebook/bart-large-mnli"
)

CATEGORIES = [
    "CAREER", "RESEARCH", "TECH", "EDUCATION",
    "CHEMISTRY", "BIOLOGY", "PHYSICS",
    "ASTRONOMY", "LITERATURE", "BUSINESS", "OTHER"
]

THRESHOLD = 0.60


def get_ai_category(title, description, user_selected_category):
    """
    This combines title + description, and runs zero-shot classification.
    If confident enough ==> use AI prediction.
    If not confident ==> fall back to user's selected category.
    """
    text = f"{title}. {description}"

    result = classifier(text, candidate_labels=CATEGORIES)

    predicted_category = result["labels"][0]
    confidence = result["scores"][0]

    if confidence >= THRESHOLD:
        ai_override = predicted_category != user_selected_category
        return predicted_category, ai_override, round(confidence, 2)
    else:
        # if AI not confident enough - keep user's choice
        return user_selected_category, False, round(confidence, 2)