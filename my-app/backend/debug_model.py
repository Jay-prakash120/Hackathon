"""Debug script - output to file."""
import pandas as pd
import numpy as np
import re
import os
import sys
import nltk
from nltk.corpus import stopwords
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import LinearSVC
from sklearn.model_selection import train_test_split
from sklearn import metrics

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords', quiet=True)

STOP_WORDS = set(stopwords.words("english"))

def clean_text(text):
    if not isinstance(text, str):
        return ""
    text = text.lower()
    text = re.sub(r'https?://\S+|www\.\S+', ' ', text)
    text = re.sub(r'<[^>]+>', ' ', text)
    text = re.sub(r'[^a-zA-Z]', ' ', text)
    words = text.split()
    words = [w for w in words if w not in STOP_WORDS and len(w) > 1]
    return " ".join(words)

DATA_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "..", "demo", "NLP_Fake_News_Classification")
out = open("debug_results.txt", "w", encoding="utf-8")

def log(msg):
    print(msg)
    out.write(msg + "\n")

log("Loading data...")
fake = pd.read_csv(os.path.join(DATA_DIR, "Fake.csv"))
true = pd.read_csv(os.path.join(DATA_DIR, "True.csv"))
fake["label"] = 0
true["label"] = 1
data = pd.concat([fake, true], axis=0).reset_index(drop=True)
data["content"] = data["title"].fillna("") + " " + data["text"].fillna("")
data["clean_content"] = data["content"].apply(clean_text)

X = data["clean_content"]
y = data["label"]
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.25, random_state=42)

log(f"Dataset: {len(data)} total, {len(fake)} fake, {len(true)} true")

# Config 1: Notebook style
clf1 = Pipeline([("tfidf", TfidfVectorizer()), ("clf", LinearSVC())])
clf1.fit(X_train, y_train)
acc1 = metrics.accuracy_score(y_test, clf1.predict(X_test))
log(f"\nConfig1 (default TfidfVectorizer): accuracy={acc1:.4f}")

# Config 2: Improved
clf2 = Pipeline([
    ("tfidf", TfidfVectorizer(max_features=10000, ngram_range=(1,2), min_df=3, max_df=0.95, sublinear_tf=True)),
    ("clf", LinearSVC(C=1.0, max_iter=2000, class_weight='balanced'))
])
clf2.fit(X_train, y_train)
acc2 = metrics.accuracy_score(y_test, clf2.predict(X_test))
log(f"Config2 (bigrams+tuned): accuracy={acc2:.4f}")

def sigmoid(x):
    return 1.0 / (1.0 + np.exp(-x))

test_texts = [
    ("Notebook test (TRUE)", "Middle East War EscalationUS troops were injured at a Saudi air base as attacks on Iran nuclear sites continue and the conflict enters its second month."),
    ("Real news (REAL)", "According to a study published by researchers at MIT, data shows that global temperatures have risen by 1.5 degrees Celsius since the pre-industrial era."),
    ("Fake-sounding (FAKE)", "BREAKING Secret government conspiracy EXPOSED They do not want you to know the TRUTH about miracle cure that Big Pharma is hiding"),
    ("Reuters style (REAL)", "WASHINGTON (Reuters) - The U.S. Senate voted on Tuesday to pass a new infrastructure bill worth 1.2 trillion dollars, with bipartisan support."),
]

log("\n=== PREDICTION RESULTS ===")
for label, text in test_texts:
    cleaned = clean_text(text)
    
    p1r = clf1.predict([text])[0]
    d1r = clf1.decision_function([text])[0]
    p1c = clf1.predict([cleaned])[0]
    d1c = clf1.decision_function([cleaned])[0]
    p2c = clf2.predict([cleaned])[0]
    d2c = clf2.decision_function([cleaned])[0]
    
    log(f"\n--- {label} ---")
    log(f"  Text: {text[:80]}...")
    log(f"  Cleaned: {cleaned[:80]}...")
    log(f"  C1 RAW:     {'REAL' if p1r==1 else 'FAKE'} dist={d1r:.3f} conf={sigmoid(d1r)*100:.1f}%")
    log(f"  C1 CLEANED: {'REAL' if p1c==1 else 'FAKE'} dist={d1c:.3f} conf={sigmoid(d1c)*100:.1f}%")
    log(f"  C2 CLEANED: {'REAL' if p2c==1 else 'FAKE'} dist={d2c:.3f} conf={sigmoid(d2c)*100:.1f}%")

out.close()
print("\nResults written to debug_results.txt")
