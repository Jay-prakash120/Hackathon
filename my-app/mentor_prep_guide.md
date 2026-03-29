# Mentor Question & Answer (Q&A) Guide: VerifAI

This guide prepares you for deep-dive technical and conceptual questions your mentors might ask during the hackathon presentation.

---

## 1. Core Technical Questions

### Q: Why did you choose LinearSVC over more complex models like LSTMs or Transformers (BERT)?
**A:** 
- **Efficiency:** LinearSVC is computationally inexpensive and trains in seconds, which was crucial for a hackathon environment where we might need to re-train or iterate quickly.
- **Performance on Text:** For document classification with TF-IDF, LinearSVC often matches or beats deep learning models on smaller-to-medium datasets without needing a GPU.
- **Explainability:** SVMs provide coefficients for every word feature. This allowed us to build the **XAI (Explainable AI)** component, showing users exactly which words (features) influenced the verdict. Deep learning models are "black boxes" and much harder to explain.

### Q: How do you handle "Knowledge Cutoff" in your model?
**A:** This is our most significant innovation. Standard ML models are "frozen" in time at the moment they were trained. VerifAI uses a **Hybrid Architecture**:
1.  The **Offline Model** handles historical patterns and linguistic styles (clickbait detection).
2.  The **Real-Time Override** engine uses Google News RSS and Wikipedia APIs to "check the facts" right now. If the ML says it's fake because it looks like a rumor, but the BBC reported it 5 minutes ago, our **Cosine Similarity** math identifies the overlap and upgrades the verdict to REAL.

### Q: Explain the "Semantic Truth Override" math.
**A:** We use **Cosine Similarity**. 
- We convert the user's input and live news snippets into vectors in a multi-dimensional space. 
- The "Cosine Similarity" measures the angle between these vectors. 
- If the angle is small (high similarity score, > 0.15), it means the user's claim is being echoed by trusted sources like Reuters or AP.
- We also check for **Missing Evidence**: If the best matching live article mentions the *topic* but lacks the specific *verbs/subjects* of the user's claim (e.g., User says "X killed", live news says "X alive"), we flag it as a **Contradiction**.

---

## 2. Dataset & Bias Questions

### Q: What dataset did you use, and how did you ensure it's not biased?
**A:** We used the **ISOT Fake News Dataset** (University of Victoria), which contains ~44,000 articles. 
- **Balanced Class Weights:** We used `class_weight='balanced'` in our Scikit-Learn pipeline to ensure the model doesn't favor "Real" or "Fake" simply because one has more samples.
- **Cleaning:** We perform heavy text cleaning (removing URLs, special characters, and NLTK Stopwords) to ensure the model learns *contextual language* rather than identifying specific website formats or metadata.

### Q: How do you define "Trusted Sources" in your search?
**A:** We hard-filter our Google News search to specific domains using the `site:` operator. We currently query: `bbc.com`, `reuters.com`, `apnews.com`, `npr.org`, and `wikipedia.org`. These are internationally recognized for their rigorous editorial standards.

---

## 3. Architecture & User Experience

### Q: Why Next.js and Flask? Why not a single language?
**A:** 
- **Best of Both Worlds:** Next.js (Node.js) is the industry leader for fast, SEO-friendly, and responsive frontends. Python (Flask) is the go-to language for Data Science and Machine Learning. 
- **Microservices:** This separation of concerns allows us to scale the "prediction engine" independently of the "user dashboard."

### Q: How did you implement "Explainable AI" (XAI)?
**A:** We don't just give a "Yes/No." We look at the SVM's internal **coefficients** (weights). 
1.  We multiply the TF-IDF weight of a word in the user's input by the SVM's learned coefficient for that word.
2.  This gives us a **Contribution Score**. 
3.  The top positive scores are shown as "Credibility Indicators," and the top negative scores are "Suspicious Phrases."

---

## 4. Scalability & Future Questions

### Q: How would this scale if 10,000 users used it at once?
**A:** 
- **Caching:** We would implement a Redis cache for the Search results. If two people ask about the same breaking news, we don't need to hit Google News twice.
- **Model Serialization:** Currently, we train on startup. For scale, we would save the model using `joblib` so it loads in milliseconds without re-training.
- **Rate Limiting:** We use Nginx or API gateways to manage live search requests to prevent being blocked by search providers.

### Q: What are the limitations of VerifAI?
**A:** 
- **Sarcasm/Satire:** Like most NLP models, it may struggle with highly nuanced satire (e.g., The Onion) if the linguistic patterns mimic real news too closely. 
- **Latency:** Real-time search adds a few seconds of delay compared to pure ML. We solved this by using a "loading" state with micro-animations to keep the user engaged.

---

## 5. Potential "Gotcha" Questions

### Q: "Isn't Cosine Similarity too simple for fact-checking?"
**A:** It's a starting point. While it doesn't understand "Truth" in a philosophical sense, it's a powerful tool for **Corroboration**. If the user's exact claim matches a BBC headline by 80%, the likelihood of it being a total hallucination is scientifically low. We use it as a "sanity check" (Override) rather than the sole decision-maker.

### Q: "What if the trusted source itself publishes fake news?"
**A:** No system is 100% foolproof. However, by aggregating from *multiple* trusted sources (BBC + Reuters + NPR), we reduce the risk. This acts as a "Social Consensus" mechanism.

---
