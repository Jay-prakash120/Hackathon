const PYTHON_BACKEND_URL =
  process.env.PYTHON_BACKEND_URL || "http://127.0.0.1:5000";

/**
 * Fallback simulation when Python backend is unavailable.
 * This lets the frontend work even without the Flask server running.
 */
function simulatePrediction(text) {
  const textLower = text.toLowerCase();

  const sensationalWords = [
    "breaking",
    "shocking",
    "unbelievable",
    "secret",
    "exposed",
    "conspiracy",
    "hoax",
    "urgent",
    "banned",
    "miracle",
    "cure",
    "deadly",
    "leaked",
    "bombshell",
  ];

  const credibleIndicators = [
    "according to",
    "researchers found",
    "study published",
    "official statement",
    "data shows",
    "peer-reviewed",
    "university",
  ];

  const sensationalCount = sensationalWords.filter((w) =>
    textLower.includes(w)
  ).length;
  const credibleCount = credibleIndicators.filter((p) =>
    textLower.includes(p)
  ).length;

  let fakeScore = sensationalCount * 15 - credibleCount * 20;
  fakeScore += Math.random() * 20 - 10;
  fakeScore = Math.max(5, Math.min(95, fakeScore + 40));

  const verdict = fakeScore > 50 ? "FAKE" : "REAL";
  const confidence =
    verdict === "FAKE" ? fakeScore : 100 - fakeScore;

  const keyPhrases = [
    ...sensationalWords.filter((w) => textLower.includes(w)),
    ...credibleIndicators.filter((p) => textLower.includes(p)),
  ].slice(0, 8);

  return {
    verdict,
    confidence: Math.round(confidence * 10) / 10,
    credibility_score:
      Math.round((100 - fakeScore + Math.random() * 10 - 5) * 10) / 10,
    explanation:
      "Analysis based on linguistic patterns, sensationalism markers, and credibility indicators found in the text.",
    key_phrases: keyPhrases,
    simulated: true,
  };
}

/**
 * Search for matching news articles on the internet.
 * Tries the Python backend first, falls back to empty results.
 */
async function fetchMatchingNews(text) {
  try {
    const res = await fetch(`${PYTHON_BACKEND_URL}/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
      signal: AbortSignal.timeout(15000),
    });
    if (res.ok) {
      const data = await res.json();
      return data.results || [];
    }
  } catch {
    // Search unavailable
  }
  return [];
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (!body.text || body.text.trim().length === 0) {
      return Response.json(
        { error: "Please provide news text to analyze." },
        { status: 400 }
      );
    }

    let predictionResult = null;
    let matchingNews = [];

    // Run predict + search in parallel — each with independent error handling
    const predictPromise = (async () => {
      try {
        const res = await fetch(`${PYTHON_BACKEND_URL}/predict`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: body.text }),
          signal: AbortSignal.timeout(10000),
        });
        if (res.ok) return await res.json();
      } catch {
        console.log("⚠️  Python backend unavailable for prediction");
      }
      return null;
    })();

    const searchPromise = fetchMatchingNews(body.text);

    const [prediction, search] = await Promise.all([
      predictPromise,
      searchPromise,
    ]);

    predictionResult = prediction;
    matchingNews = search;

    // Fallback: simulate prediction if backend was unreachable
    if (!predictionResult) {
      predictionResult = simulatePrediction(body.text);
    }

    // Merge matching news into the response
    predictionResult.matching_news = matchingNews;

    return Response.json(predictionResult);
  } catch {
    return Response.json(
      { error: "Failed to process request." },
      { status: 500 }
    );
  }
}
