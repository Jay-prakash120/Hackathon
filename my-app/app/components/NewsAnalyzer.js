"use client";

import { useState } from "react";

// SVG circular gauge component
function ConfidenceGauge({ value, verdict }) {
  const radius = 65;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color = verdict === "FAKE" ? "var(--accent-red)" : "var(--accent-green)";

  return (
    <div className="gauge-container">
      <svg className="gauge-svg" viewBox="0 0 160 160">
        <circle className="gauge-bg" cx="80" cy="80" r={radius} />
        <circle
          className="gauge-fill"
          cx="80"
          cy="80"
          r={radius}
          stroke={color}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      <div className="gauge-label">
        <span className="gauge-value" style={{ color }}>
          {value}%
        </span>
        <span className="gauge-text">Confidence</span>
      </div>
    </div>
  );
}

// Credibility score bar
function CredibilityBar({ score }) {
  let color;
  if (score >= 70) color = "var(--accent-green)";
  else if (score >= 40) color = "var(--accent-amber)";
  else color = "var(--accent-red)";

  let label;
  if (score >= 70) label = "High Credibility";
  else if (score >= 40) label = "Moderate Credibility";
  else label = "Low Credibility";

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "8px",
        }}
      >
        <span
          style={{
            fontSize: "0.85rem",
            color: "var(--text-secondary)",
            fontWeight: 500,
          }}
        >
          Source Credibility
        </span>
        <span style={{ fontSize: "0.85rem", color, fontWeight: 600 }}>
          {score}% — {label}
        </span>
      </div>
      <div className="credibility-bar-track">
        <div
          className="credibility-bar-fill"
          style={{
            width: `${score}%`,
            background: `linear-gradient(90deg, ${color}88, ${color})`,
          }}
        />
      </div>
    </div>
  );
}

export default function NewsAnalyzer() {
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeNews = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      setResult(data);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      analyzeNews();
    }
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: "780px",
        margin: "0 auto",
        position: "relative",
        zIndex: 1,
      }}
    >
      {/* Input Card */}
      <div
        className="glass-card animate-fade-in-up"
        style={{ padding: "32px", marginBottom: "24px" }}
      >
        <label
          htmlFor="news-input"
          style={{
            display: "block",
            fontSize: "0.85rem",
            color: "var(--text-secondary)",
            fontWeight: 500,
            marginBottom: "10px",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          📰 Enter news article or claim
        </label>
        <textarea
          id="news-input"
          className="news-textarea"
          placeholder="Paste a news article, headline, or social media post here to verify its authenticity..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "16px",
          }}
        >
          <span
            style={{
              fontSize: "0.75rem",
              color: "var(--text-muted)",
            }}
          >
            {text.length > 0
              ? `${text.split(/\s+/).filter(Boolean).length} words`
              : "Press Ctrl+Enter to analyze"}
          </span>

          <button
            id="analyze-btn"
            className="btn-primary"
            onClick={analyzeNews}
            disabled={loading || !text.trim()}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              minWidth: "160px",
              justifyContent: "center",
            }}
          >
            {loading ? (
              <>
                <span className="spinner" />
                Analyzing...
              </>
            ) : (
              <>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                Analyze
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          className="glass-card animate-fade-in-up"
          style={{
            padding: "20px 24px",
            marginBottom: "24px",
            borderColor: "rgba(255, 61, 113, 0.3)",
          }}
        >
          <p
            style={{
              color: "var(--accent-red)",
              fontSize: "0.9rem",
              margin: 0,
            }}
          >
            ⚠️ {error}
          </p>
        </div>
      )}

      {/* Results */}
      {result && (
        <div
          className="glass-card animate-fade-in-up animate-pulse-glow"
          style={{ padding: "32px", overflow: "hidden" }}
        >
          {/* Simulated badge */}
          {result.simulated && (
            <div style={{ marginBottom: "16px" }}>
              <span className="simulated-badge">
                ⚡ Simulated — Python model not connected
              </span>
            </div>
          )}

          {/* Top section: Verdict + Gauge */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "24px",
            }}
          >
            <div>
              <span
                className={`verdict-badge ${
                  result.verdict === "FAKE" ? "verdict-fake" : "verdict-real"
                }`}
              >
                {result.verdict === "FAKE" ? "⛔" : "✅"} {result.verdict}
              </span>
              <p
                style={{
                  marginTop: "12px",
                  fontSize: "0.9rem",
                  color: "var(--text-secondary)",
                  maxWidth: "340px",
                  lineHeight: 1.6,
                }}
              >
                {result.verdict === "FAKE"
                  ? "This content shows indicators of misinformation."
                  : "This content appears to be credible."}
              </p>
            </div>

            <ConfidenceGauge
              value={result.confidence}
              verdict={result.verdict}
            />
          </div>

          <div className="section-divider" />

          {/* Credibility Score */}
          <div className="animate-fade-in-up animate-delay-2">
            <CredibilityBar score={result.credibility_score} />
          </div>

          <div className="section-divider" />

          {/* Explanation */}
          <div className="animate-fade-in-up animate-delay-3">
            <h3
              style={{
                fontSize: "0.85rem",
                color: "var(--text-secondary)",
                fontWeight: 500,
                marginBottom: "10px",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              🧠 AI Explanation
            </h3>
            <p
              style={{
                fontSize: "0.9rem",
                color: "var(--text-primary)",
                lineHeight: 1.7,
                margin: 0,
              }}
            >
              {result.explanation}
            </p>
          </div>

          {/* Key Phrases */}
          {result.key_phrases && result.key_phrases.length > 0 && (
            <>
              <div className="section-divider" />
              <div className="animate-fade-in-up animate-delay-4">
                <h3
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--text-secondary)",
                    fontWeight: 500,
                    marginBottom: "12px",
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                  }}
                >
                  🔑 Key Phrases Detected
                </h3>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "8px",
                  }}
                >
                  {result.key_phrases.map((phrase, i) => (
                    <span key={i} className="phrase-tag">
                      {phrase}
                    </span>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Matching News on Internet */}
      {result && result.matching_news && result.matching_news.length > 0 && (
        <div
          className="glass-card animate-fade-in-up"
          style={{ padding: "32px", marginTop: "24px" }}
        >
          <h3
            style={{
              fontSize: "0.85rem",
              color: "var(--text-secondary)",
              fontWeight: 500,
              marginBottom: "6px",
              letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            🌐 Matching News on Internet
          </h3>
          <p
            style={{
              fontSize: "0.8rem",
              color: "var(--text-muted)",
              marginBottom: "18px",
              lineHeight: 1.5,
            }}
          >
            Similar articles and reports found across the web
          </p>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
            }}
          >
            {result.matching_news.map((article, i) => (
              <a
                key={i}
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="news-match-card"
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
                    gap: "12px",
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h4 className="news-match-title">
                      {article.title}
                    </h4>
                    <p className="news-match-snippet">
                      {article.snippet}
                    </p>
                  </div>
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--text-muted)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ flexShrink: 0, marginTop: "2px" }}
                  >
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                    <polyline points="15 3 21 3 21 9" />
                    <line x1="10" y1="14" x2="21" y2="3" />
                  </svg>
                </div>
                <div className="news-match-source">
                  <span className="news-match-source-dot" />
                  {article.source}
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* No matching news message (when analysis is done but no results) */}
      {result && result.matching_news && result.matching_news.length === 0 && (
        <div
          className="glass-card animate-fade-in-up"
          style={{
            padding: "24px 32px",
            marginTop: "24px",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontSize: "0.85rem",
              color: "var(--text-muted)",
              margin: 0,
            }}
          >
            🌐 No matching news found on the internet.{" "}
            <span style={{ color: "var(--text-secondary)" }}>
              Start the Python backend to enable web search.
            </span>
          </p>
        </div>
      )}
    </div>
  );
}
