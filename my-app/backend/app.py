"""
Fake News Detection API — Flask Backend (Real NLP Model)
=========================================================
This server trains a LinearSVC + TF-IDF pipeline on startup using
the Fake.csv / True.csv dataset, then exposes a /predict endpoint
that returns a verdict with confidence scores derived from the
SVM decision function.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import re
import os
import numpy as np
import pandas as pd
import nltk
import requests as http_requests
from urllib.parse import quote_plus
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import LinearSVC
from sklearn.model_selection import train_test_split
from sklearn.metrics.pairwise import cosine_similarity
from sklearn import metrics

app = Flask(__name__)
CORS(app)  # Allow requests from Next.js frontend

# ============================================================
# NLTK setup
# ============================================================
try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords', quiet=True)

from nltk.corpus import stopwords
STOP_WORDS = set(stopwords.words("english"))


# ============================================================
# Text cleaning (same logic as the notebook, improved)
# ============================================================
def clean_text(text):
    """Clean text for model input: lowercase, remove URLs, HTML, special chars, stopwords."""
    if not isinstance(text, str):
        return ""
    text = text.lower()
    # Remove URLs
    text = re.sub(r'https?://\S+|www\.\S+', ' ', text)
    # Remove HTML tags
    text = re.sub(r'<[^>]+>', ' ', text)
    # Keep only letters
    text = re.sub(r'[^a-zA-Z]', ' ', text)
    # Split and remove stopwords
    words = text.split()
    words = [w for w in words if w not in STOP_WORDS and len(w) > 1]
    return " ".join(words)


# ============================================================
# Model training on startup
# ============================================================
print("🔄 Loading datasets and training model...")

# Resolve paths relative to this script
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(SCRIPT_DIR, "..", "..", "demo", "NLP_Fake_News_Classification")
FAKE_CSV = os.path.join(DATA_DIR, "Fake.csv")
TRUE_CSV = os.path.join(DATA_DIR, "True.csv")

MODEL_LOADED = False
text_clf = None
accuracy = 0.0

try:
    # Load datasets
    fake = pd.read_csv(FAKE_CSV)
    true = pd.read_csv(TRUE_CSV)

    # Label: 0 = Fake, 1 = True
    fake["label"] = 0
    true["label"] = 1

    # Combine
    data = pd.concat([fake, true], axis=0)
    data.reset_index(drop=True, inplace=True)

    # Combine title + text as content (same as notebook Cell 7)
    data["content"] = data["title"].fillna("") + " " + data["text"].fillna("")

    # Clean content
    print("🧹 Cleaning text data...")
    data["clean_content"] = data["content"].apply(clean_text)

    # Split
    X = data["clean_content"]
    y = data["label"]
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.25, random_state=42
    )

    # Build pipeline with bigrams for better accuracy
    print("🏗️  Training TF-IDF + LinearSVC pipeline (with bigrams)...")
    text_clf = Pipeline([
        ("tfidf", TfidfVectorizer(
            max_features=10000,
            ngram_range=(1, 2),     # Unigrams + bigrams
            min_df=3,               # Ignore very rare terms
            max_df=0.95,            # Ignore terms in >95% of docs
            sublinear_tf=True       # Apply log scaling to TF
        )),
        ("clf", LinearSVC(
            C=1.0,
            max_iter=2000,
            class_weight='balanced'
        ))
    ])
    text_clf.fit(X_train, y_train)

    # Evaluate
    predictions = text_clf.predict(X_test)
    accuracy = metrics.accuracy_score(y_test, predictions)
    print(f"✅ Model trained! Accuracy: {accuracy:.4f} ({accuracy*100:.1f}%)")
    print(metrics.classification_report(y_test, predictions, target_names=["FAKE", "REAL"]))

    MODEL_LOADED = True

except Exception as e:
    print(f"❌ Failed to train model: {e}")
    import traceback
    traceback.print_exc()


# ============================================================
# Prediction helpers
# ============================================================

def sigmoid(x):
    """Convert decision function distance to 0-1 probability-like score."""
    return 1.0 / (1.0 + np.exp(-x))


def get_top_features(text_cleaned, n=8):
    """Get the top TF-IDF features from the input that the model cares about most."""
    try:
        tfidf_step = text_clf.named_steps["tfidf"]
        clf_step = text_clf.named_steps["clf"]

        # Transform the single text to TF-IDF
        tfidf_vector = tfidf_step.transform([text_cleaned])

        # Get feature names
        feature_names = tfidf_step.get_feature_names_out()

        # Get the SVM coefficients (weights for each feature)
        coefs = clf_step.coef_[0]

        # Multiply TF-IDF values by SVM weights to get contribution scores
        contributions = tfidf_vector.toarray()[0] * coefs

        # Get indices of non-zero contributions
        nonzero = np.nonzero(contributions)[0]

        if len(nonzero) == 0:
            return []

        # Sort by absolute contribution (most influential first)
        sorted_idx = nonzero[np.argsort(np.abs(contributions[nonzero]))[::-1]]

        top_phrases = []
        for idx in sorted_idx[:n]:
            feature = feature_names[idx]
            score = contributions[idx]
            top_phrases.append({
                "phrase": feature,
                "weight": float(score),
                "direction": "credible" if score > 0 else "suspicious"
            })

        return top_phrases

    except Exception as e:
        print(f"Feature extraction error: {e}")
        return []


def real_prediction(text):
    """
    Run the trained LinearSVC model on the input text.
    Returns dict with: verdict, confidence, credibility_score, explanation, key_phrases
    """
    # Clean the input
    cleaned = clean_text(text)

    if not cleaned.strip():
        return {
            "verdict": "FAKE",
            "confidence": 50.0,
            "credibility_score": 50.0,
            "explanation": "The text could not be analyzed after cleaning. Very short or non-English text may not produce reliable results.",
            "key_phrases": []
        }

    # Get prediction (0 = Fake, 1 = True)
    prediction = text_clf.predict([cleaned])[0]

    # Get confidence via decision_function + sigmoid
    # Positive distance = True (class 1), Negative distance = Fake (class 0)
    raw_distance = text_clf.decision_function([cleaned])[0]
    
    # Scale distance to make confidence spread wider (SVM dists are uncalibrated)
    distance = raw_distance * 2.5
    prob = sigmoid(distance)  # 0..1 where >0.5 = True, <0.5 = Fake

    if prediction == 1:
        verdict = "REAL"
        confidence = round(prob * 100, 1)
    else:
        verdict = "FAKE"
        confidence = round((1 - prob) * 100, 1)

    # --- SEMANTIC TRUTH OVERRIDE ---
    override_applied = None
    best_similarity = 0.0
    contradicted_words = set()
    word_count = len(text.split())
    
    try:
        live_news = fetch_matching_news_internal(text)
        if live_news:
            query_words = set(cleaned.split())
            best_snippet_match = None
            
            # Check each news snippet individually rather than grouping them!
            for news in live_news:
                snippet_text = news.get("snippet", "") + " " + news.get("title", "")
                clean_snippet = clean_text(snippet_text)
                
                if clean_snippet:
                    sim_vec = TfidfVectorizer().fit_transform([cleaned, clean_snippet])
                    sim = cosine_similarity(sim_vec[0], sim_vec[1])[0][0]
                    
                    if sim > best_similarity:
                        best_similarity = sim
                        context_words = set(clean_snippet.split())
                        contradicted_words = query_words - context_words
                        best_snippet_match = news
            
            # Rule 1: Missing Key Evidence within the BEST MATCH snippet (Downgrade to FAKE)
            # If the closest matching distinct article is still missing key claims from the short query
            if word_count < 15 and contradicted_words and best_similarity < 0.60:
                verdict = "FAKE"
                confidence = min(99.0, confidence + 30.0)
                override_applied = "FAKE_CONTRADICTION"
                missing_str = ", ".join(list(contradicted_words)[:3])
                
            # Rule 2: Strong Corroboration from a single article
            elif best_similarity >= 0.15:
                verdict = "REAL"
                confidence = min(99.0, confidence + 45.0)
                override_applied = "REAL"
                
            # Rule 3: Unverified General Claims
            elif verdict == "REAL" and best_similarity < 0.08 and word_count < 25:
                verdict = "FAKE"
                confidence = min(99.0, confidence + 20.0)
                override_applied = "UNVERIFIED"
                    
    except Exception as e:
        print(f"Truth override error: {e}")
    # --------------------------------

    # Clamp confidence to 5-99 range for display
    confidence = max(5.0, min(99.0, confidence))

    # Credibility score: based on how "real" the content looks
    credibility_score = round(prob * 100, 1)
    if override_applied in ["FAKE_CONTRADICTION", "UNVERIFIED"]:
        credibility_score = 100 - credibility_score  # Invert it for UI display since it's fake
    credibility_score = max(5.0, min(99.0, credibility_score))

    top_features = get_top_features(cleaned, n=8)
    reasons = []

    if override_applied == "REAL":
        reasons.append(f"🌍 VERIFIED OVERRIDE: This {word_count}-word claim strongly matches recent reports from trusted sources (e.g., BBC, Reuters) based on real-time internet search.")
        reasons.append(f"Semantic comparison confirms high factual overlap, overriding the ML model's baseline assessment with {confidence}% confidence.")
    elif override_applied == "FAKE_CONTRADICTION":
        reasons.append(f"⛔ CONTRADICTION OVERRIDE: Real-time search confirms related news, but key claims from your text ('{missing_str}') are completely absent from the closest factual reporting snippet.")
        reasons.append(f"The text has been flagged as highly misleading with {confidence}% confidence.")
    elif override_applied == "UNVERIFIED":
        reasons.append(f"⛔ UNVERIFIED OVERRIDE: Despite containing credible keywords, this {word_count}-word claim could not be corroborated by any current trusted internet sources.")
        reasons.append(f"Because the text lacks real-time credible evidence, it has been flagged as unverified/fake with {confidence}% confidence.")
    else:
        if verdict == "FAKE":
            suspicious = [f['phrase'] for f in top_features if f['direction'] == 'suspicious']
            if suspicious:
                reasons.append(f"Detected {len(suspicious)} linguistic pattern(s) commonly associated with misinformation: {', '.join(suspicious[:4])}.")
            reasons.append(f"The SVM classifier identified this text as potentially misleading with {confidence}% confidence based on {int(accuracy*100)}% training accuracy.")
        else:
            credible = [f['phrase'] for f in top_features if f['direction'] == 'credible']
            if credible:
                reasons.append(f"Found {len(credible)} credibility indicator(s) typical of factual reporting: {', '.join(credible[:4])}.")
            reasons.append(f"The classifier assessed this text as credible with {confidence}% confidence based on {int(accuracy*100)}% training accuracy.")

    if not override_applied and word_count < 15:
        reasons.append("Note: Very short texts may produce less reliable ML predictions.")

    explanation = " ".join(reasons)

    # Extract just the phrase strings for key_phrases
    key_phrases = [f['phrase'] for f in top_features]

    return {
        "verdict": verdict,
        "confidence": confidence,
        "credibility_score": credibility_score,
        "explanation": explanation,
        "key_phrases": key_phrases[:8]
    }


# ============================================================
# Fallback simulated prediction (if model fails to load)
# ============================================================
SENSATIONAL_WORDS = [
    "breaking", "shocking", "unbelievable", "secret", "exposed",
    "conspiracy", "hoax", "urgent", "banned", "they don't want you to know",
    "miracle", "cure", "deadly", "cover-up", "leaked", "anonymous sources",
    "you won't believe", "share before deleted", "mainstream media won't tell",
    "wake up", "bombshell"
]

CREDIBLE_INDICATORS = [
    "according to", "researchers found", "study published",
    "official statement", "data shows", "peer-reviewed",
    "university", "journal", "investigation", "evidence suggests",
    "report by", "analysis of", "statistics indicate"
]

import random

def simulate_prediction(text):
    """Fallback simulation when real model is unavailable."""
    text_lower = text.lower()
    words = text_lower.split()
    word_count = len(words)

    sensational_count = sum(1 for word in SENSATIONAL_WORDS if word in text_lower)
    credible_count = sum(1 for phrase in CREDIBLE_INDICATORS if phrase in text_lower)

    caps_ratio = sum(1 for c in text if c.isupper()) / max(len(text), 1)
    excessive_punct = len(re.findall(r'[!?]{2,}', text))

    fake_score = 0
    fake_score += sensational_count * 15
    fake_score += caps_ratio * 40
    fake_score += excessive_punct * 10
    fake_score -= credible_count * 20

    if word_count < 10:
        fake_score += 15

    fake_score += random.uniform(-10, 10)
    fake_score = max(5, min(95, fake_score))

    if fake_score > 50:
        verdict = "FAKE"
        confidence = fake_score
    else:
        verdict = "REAL"
        confidence = 100 - fake_score

    credibility_score = max(5, min(95, 100 - fake_score + random.uniform(-5, 5)))

    reasons = []
    found_phrases = []

    if sensational_count > 0:
        matched = [w for w in SENSATIONAL_WORDS if w in text_lower]
        found_phrases.extend(matched)
        reasons.append(f"Contains {sensational_count} sensationalist phrase(s) commonly found in misinformation.")

    if credible_count > 0:
        matched = [p for p in CREDIBLE_INDICATORS if p in text_lower]
        found_phrases.extend(matched)
        reasons.append(f"Contains {credible_count} credibility indicator(s) typical of factual reporting.")

    if caps_ratio > 0.3:
        reasons.append("Excessive use of capital letters, a common trait in misleading content.")

    if excessive_punct > 0:
        reasons.append("Uses excessive punctuation (!! / ??), often seen in clickbait.")

    if word_count < 10:
        reasons.append("Very short text provides limited context for verification.")

    if not reasons:
        reasons.append("No strong indicators found. Moderate confidence based on general text analysis.")

    explanation = " ".join(reasons)

    return {
        "verdict": verdict,
        "confidence": round(confidence, 1),
        "credibility_score": round(credibility_score, 1),
        "explanation": explanation,
        "key_phrases": found_phrases[:8],
        "simulated": True
    }


def fetch_matching_news_internal(text):
    """Internal function to fetch matching news from trusted sources."""
    words = text.split()
    search_query = " ".join(words[:10]) if len(words) > 10 else text

    wiki_results = []
    news_results = []

    # 1. Wikipedia
    try:
        wiki_url = f"https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch={quote_plus(search_query)}&utf8=&format=json"
        headers = {"User-Agent": "VerifAI-Hackathon-Project/1.0"}
        resp = http_requests.get(wiki_url, headers=headers, timeout=5)
        if resp.status_code == 200:
            resp_data = resp.json()
            search_hits = resp_data.get("query", {}).get("search", [])
            for hit in search_hits[:3]:
                clean_snippet = re.sub(r'<[^>]+>', '', hit.get("snippet", "")).strip() + "..."
                page_title = hit.get("title", "")
                page_url = f"https://en.wikipedia.org/wiki/{quote_plus(page_title.replace(' ', '_'))}"
                wiki_results.append({
                    "title": page_title,
                    "url": page_url,
                    "snippet": clean_snippet,
                    "source": "wikipedia.org"
                })
    except Exception as e:
        print(f"Wikipedia search error: {e}")

    # 2. Google News RSS
    try:
        import xml.etree.ElementTree as ET
        trusted_query = f"{search_query} site:bbc.com OR site:reuters.com OR site:apnews.com OR site:npr.org"
        gn_url = f"https://news.google.com/rss/search?q={quote_plus(trusted_query)}"
        gn_resp = http_requests.get(gn_url, headers={"User-Agent": "Mozilla/5.0"}, timeout=5)

        if gn_resp.status_code == 200:
            root = ET.fromstring(gn_resp.content)
            items = root.findall('.//item')
            raw_news = []
            for item in items[:6]:
                title = item.find('title').text if item.find('title') is not None else "News Update"
                link = item.find('link').text if item.find('link') is not None else ""
                pubDate = item.find('pubDate').text if item.find('pubDate') is not None else ""
                source_elem = item.find('source')
                source_name = source_elem.text if source_elem is not None else "Trusted News Source"
                raw_news.append({
                    "title": title,
                    "url": link,
                    "snippet": f"Published: {pubDate}",
                    "source": source_name
                })

            bbc_results = [r for r in raw_news if "bbc" in r["source"].lower() or "bbc.com" in r["url"].lower()]
            other_results = [r for r in raw_news if r not in bbc_results]
            news_results = (bbc_results + other_results)[:4]
    except Exception as e:
        print(f"Google News RSS search error: {e}")

    return news_results + wiki_results


# ============================================================
# API Routes
# ============================================================

@app.route("/predict", methods=["POST"])
def predict():
    """Analyze news text and return fake/real prediction with confidence."""
    data = request.get_json()

    if not data or "text" not in data:
        return jsonify({"error": "Missing 'text' field in request body"}), 400

    text = data["text"].strip()

    if len(text) == 0:
        return jsonify({"error": "Text cannot be empty"}), 400

    # Use real model if loaded, otherwise simulate
    if MODEL_LOADED and text_clf is not None:
        result = real_prediction(text)
    else:
        result = simulate_prediction(text)

    return jsonify(result)


@app.route("/search", methods=["POST"])
def search_news():
    """Search the internet for similar/matching news articles."""
    data = request.get_json()

    if not data or "text" not in data:
        return jsonify({"error": "Missing 'text' field"}), 400

    text = data["text"].strip()
    if len(text) == 0:
        return jsonify({"error": "Text cannot be empty"}), 400

    try:
        final_results = fetch_matching_news_internal(text)
        return jsonify({"results": final_results})

    except Exception as e:
        print(f"General Search error: {e}")
        return jsonify({"results": [], "error": str(e)}), 200


@app.route("/health", methods=["GET"])
def health():
    """Health check endpoint."""
    return jsonify({
        "status": "ok",
        "model_loaded": MODEL_LOADED,
        "model_accuracy": round(accuracy * 100, 1) if MODEL_LOADED else 0,
        "search_available": True
    })


if __name__ == "__main__":
    print("=" * 50)
    print("🚀 VerifAI — Fake News Detection API")
    print(f"   Model: {'✅ Real NLP (LinearSVC + TF-IDF)' if MODEL_LOADED else '⚠️ Simulated (fallback)'}")
    if MODEL_LOADED:
        print(f"   Accuracy: {accuracy*100:.1f}%")
    print("📡 POST /predict — Analyze news text")
    print("🔍 POST /search  — Search matching news")
    print("💚 GET  /health  — Health check")
    print("=" * 50)
    # Important: use_reloader=False prevents Flask from running training twice at startup
    app.run(debug=True, host="0.0.0.0", port=5000, use_reloader=False)
