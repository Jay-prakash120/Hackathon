"""
Fake News Detection API — Flask Backend
========================================
This server exposes a /predict endpoint that accepts news text
and returns a verdict (REAL/FAKE) with confidence scores.

Currently SIMULATED — see MODEL_INTEGRATION.md for how to swap
in your trained model.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import re
import random
import requests as http_requests
from urllib.parse import urlparse, quote_plus, unquote
from html import unescape

app = Flask(__name__)
CORS(app)  # Allow requests from Next.js frontend

# ============================================================
# TODO: Replace this section with your real model
# ============================================================
# from your_model import load_model, predict
# model = load_model("path/to/your/model.pkl")
# ============================================================


# --- Simulated prediction logic (remove when real model is ready) ---

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


def simulate_prediction(text):
    """
    Simulated fake news detection using basic heuristics.
    Returns a dict with verdict, confidence, credibility, explanation, and key phrases.

    TODO: Replace this entire function with your real model inference.
    Expected input:  str (the news text)
    Expected output: dict with keys:
        - verdict: "REAL" or "FAKE"
        - confidence: float 0-100
        - credibility_score: float 0-100
        - explanation: str (human-readable reasoning)
        - key_phrases: list of str (phrases that influenced the decision)
    """
    text_lower = text.lower()
    words = text_lower.split()
    word_count = len(words)

    # Count sensational vs credible indicators
    sensational_count = sum(1 for word in SENSATIONAL_WORDS if word in text_lower)
    credible_count = sum(1 for phrase in CREDIBLE_INDICATORS if phrase in text_lower)

    # Check for ALL CAPS abuse
    caps_ratio = sum(1 for c in text if c.isupper()) / max(len(text), 1)

    # Check for excessive punctuation (!!!, ???)
    excessive_punct = len(re.findall(r'[!?]{2,}', text))

    # Build a "fakeness" score
    fake_score = 0
    fake_score += sensational_count * 15
    fake_score += caps_ratio * 40
    fake_score += excessive_punct * 10
    fake_score -= credible_count * 20

    # Short text penalty (very short texts are suspicious)
    if word_count < 10:
        fake_score += 15

    # Add some randomness to make it feel more realistic
    fake_score += random.uniform(-10, 10)

    # Clamp between 5 and 95
    fake_score = max(5, min(95, fake_score))

    # Determine verdict
    if fake_score > 50:
        verdict = "FAKE"
        confidence = fake_score
    else:
        verdict = "REAL"
        confidence = 100 - fake_score

    # Credibility score (inverse of fakeness, with some noise)
    credibility_score = max(5, min(95, 100 - fake_score + random.uniform(-5, 5)))

    # Build explanation
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
        "key_phrases": found_phrases[:8]  # Limit to 8 phrases
    }


# --- API Routes ---

@app.route("/predict", methods=["POST"])
def predict():
    """
    Analyze news text and return fake/real prediction.

    Request body (JSON):
        { "text": "The news article text to analyze..." }

    Response (JSON):
        {
            "verdict": "REAL" or "FAKE",
            "confidence": 0-100,
            "credibility_score": 0-100,
            "explanation": "Human-readable reasoning...",
            "key_phrases": ["phrase1", "phrase2", ...]
        }
    """
    data = request.get_json()

    if not data or "text" not in data:
        return jsonify({"error": "Missing 'text' field in request body"}), 400

    text = data["text"].strip()

    if len(text) == 0:
        return jsonify({"error": "Text cannot be empty"}), 400

    # ============================================================
    # TODO: Replace simulate_prediction() with your real model call
    # Example:
    #   result = model.predict(text)
    #   return jsonify(result)
    # ============================================================
    result = simulate_prediction(text)

    return jsonify(result)


@app.route("/search", methods=["POST"])
def search_news():
    """
    Search the internet for similar/matching news articles.

    Request body (JSON):
        { "text": "The news text to search for..." }

    Response (JSON):
        {
            "results": [
                {
                    "title": "Article title",
                    "url": "https://...",
                    "snippet": "Brief excerpt...",
                    "source": "example.com"
                }, ...
            ]
        }
    """
    data = request.get_json()

    if not data or "text" not in data:
        return jsonify({"error": "Missing 'text' field"}), 400

    text = data["text"].strip()
    if len(text) == 0:
        return jsonify({"error": "Text cannot be empty"}), 400

    try:
        # Extract a meaningful search query from the text
        words = text.split()
        search_query = " ".join(words[:10]) if len(words) > 10 else text

        # Search using Wikipedia API (Free, fast, no API key, returns JSON)
        url = f"https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch={quote_plus(search_query)}&utf8=&format=json"
        headers = {
            "User-Agent": "VerifAI-Hackathon-Project/1.0"
        }

        resp = http_requests.get(url, headers=headers, timeout=10)
        resp.raise_for_status()
        data = resp.json()

        results = []
        # Wikipedia returns hits in data['query']['search']
        search_hits = data.get("query", {}).get("search", [])

        for hit in search_hits[:6]:
            # Clean HTML tags from snippets (Wikipedia highlights terms with <span class="searchmatch">)
            clean_snippet = re.sub(r'<[^>]+>', '', hit.get("snippet", "")).strip() + "..."
            
            # Construct Wikipedia page URL
            page_title = hit.get("title", "")
            page_url = f"https://en.wikipedia.org/wiki/{quote_plus(page_title.replace(' ', '_'))}"

            results.append({
                "title": page_title,
                "url": page_url,
                "snippet": clean_snippet,
                "source": "wikipedia.org"
            })

        return jsonify({"results": results})

    except Exception as e:
        print(f"Search error: {e}")
        return jsonify({"results": [], "error": str(e)}), 200


@app.route("/health", methods=["GET"])
def health():
    """Health check endpoint."""
    return jsonify({
        "status": "ok",
        "model_loaded": False,
        "search_available": True
    })


if __name__ == "__main__":
    print("🚀 Fake News Detection API running on http://localhost:5000")
    print("📡 POST /predict — Analyze news text")
    print("🔍 POST /search  — Search matching news")
    print("💚 GET  /health  — Health check")
    print("=" * 50)
    app.run(debug=True, host="0.0.0.0", port=5000)
