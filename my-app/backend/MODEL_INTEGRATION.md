# Model Integration Guide

This guide explains how to swap the **simulated prediction** in `app.py` with your **trained ML model**.

## Current Setup

The file `app.py` has a function called `simulate_prediction(text)` that uses basic keyword heuristics. You need to replace this with your real model.

## Expected Input/Output Format

Your model function must:

- **Accept**: A string (the news text)
- **Return**: A dictionary with these keys:

```python
{
    "verdict": "REAL" or "FAKE",         # string — the classification
    "confidence": 87.3,                   # float 0-100 — how confident the model is
    "credibility_score": 72.1,            # float 0-100 — source credibility estimate
    "explanation": "Reasoning text...",    # string — human-readable explanation
    "key_phrases": ["phrase1", "phrase2"]  # list of strings — influential phrases
}
```

## Step-by-Step Integration

### 1. Save your trained model

Place your model file in the `backend/` directory:
```
backend/
├── app.py
├── requirements.txt
├── model/
│   ├── fake_news_model.pkl      # or .pt, .h5, etc.
│   └── vectorizer.pkl           # if using TF-IDF or similar
```

### 2. Update requirements.txt

Add your ML dependencies:
```
# For scikit-learn
scikit-learn>=1.3.0
joblib>=1.3.0

# For PyTorch / Transformers
torch>=2.0.0
transformers>=4.30.0

# For TensorFlow
tensorflow>=2.13.0
```

### 3. Modify app.py

#### Option A: scikit-learn model

```python
import joblib

# Load model at startup (top of file)
model = joblib.load("model/fake_news_model.pkl")
vectorizer = joblib.load("model/vectorizer.pkl")

def real_prediction(text):
    """Replace simulate_prediction with this."""
    # Preprocess
    features = vectorizer.transform([text])
    
    # Predict
    prediction = model.predict(features)[0]
    probabilities = model.predict_proba(features)[0]
    
    # Map to expected format
    verdict = "FAKE" if prediction == 1 else "REAL"
    confidence = max(probabilities) * 100
    
    return {
        "verdict": verdict,
        "confidence": round(confidence, 1),
        "credibility_score": round((1 - probabilities[1]) * 100, 1),
        "explanation": f"Model classified this as {verdict} with {confidence:.1f}% confidence based on learned text patterns.",
        "key_phrases": extract_key_phrases(text, vectorizer, model)  # implement this
    }
```

#### Option B: Hugging Face Transformers

```python
from transformers import pipeline

# Load model at startup
classifier = pipeline("text-classification", model="model/fake_news_model")

def real_prediction(text):
    result = classifier(text, truncation=True, max_length=512)[0]
    
    verdict = "FAKE" if result["label"] == "FAKE" else "REAL"
    confidence = result["score"] * 100
    
    return {
        "verdict": verdict,
        "confidence": round(confidence, 1),
        "credibility_score": round(confidence * 0.9, 1),
        "explanation": f"Transformer model classified as {verdict}.",
        "key_phrases": []  # Add attention-based key phrases if desired
    }
```

### 4. Update the /predict route

In `app.py`, find this line:
```python
result = simulate_prediction(text)
```

Replace it with:
```python
result = real_prediction(text)
```

### 5. Update the health check

In the `/health` route, change `"model_loaded": False` to `"model_loaded": True`.

### 6. Test it

```bash
# Start the server
python app.py

# Test with curl
curl -X POST http://localhost:5000/predict \
  -H "Content-Type: application/json" \
  -d '{"text": "Scientists discover new treatment for disease"}'
```

## Key Phrases / Explainability

For **explainable AI**, consider:

- **TF-IDF + Logistic Regression**: Use feature importance / coefficients
- **LIME**: `pip install lime` — generates per-instance explanations
- **SHAP**: `pip install shap` — SHapley Additive exPlanations
- **Attention weights**: If using transformers, extract attention scores

Example with LIME:
```python
from lime.lime_text import LimeTextExplainer

explainer = LimeTextExplainer(class_names=["REAL", "FAKE"])

def get_explanation(text):
    exp = explainer.explain_instance(text, model.predict_proba, num_features=6)
    key_phrases = [word for word, weight in exp.as_list()]
    return key_phrases
```

## Questions?

The frontend is already set up to display whatever you return. Just make sure the JSON keys match the format above, and the UI will work automatically!
