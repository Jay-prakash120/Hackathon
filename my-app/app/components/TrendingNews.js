"use client";

import React from "react";

const TRENDING_NEWS = [
  {
    id: 1,
    claim: "Donald Trump was killed in an attack",
    verdict: "FAKE",
    confidence: "95.3%",
    explanation: "Real-time search confirms related news about an attempted assassination, but key claims from your text ('killed') are completely absent from the closest factual reporting snippet.",
    timestamp: "2 mins ago"
  },
  {
    id: 2,
    claim: "India is facing LPG crises due to the Iran war",
    verdict: "REAL",
    confidence: "99.0%",
    explanation: "This claim strongly matches recent reports from trusted sources (BBC, Reuters) based on real-time internet search. Semantic comparison confirms high factual overlap.",
    timestamp: "15 mins ago"
  },
  {
    id: 3,
    claim: "Massive secret government conspiracy EXPOSED regarding miracle pharma cure",
    verdict: "FAKE",
    confidence: "86.5%",
    explanation: "Detected 3 linguistic pattern(s) commonly associated with misinformation. The SVM classifier identified this text as highly misleading.",
    timestamp: "1 hour ago"
  },
  {
    id: 4,
    claim: "Senate voted on Tuesday to pass a new $1.2 trillion infrastructure bill",
    verdict: "REAL",
    confidence: "93.2%",
    explanation: "Found 4 credibility indicator(s) typical of factual reporting. The classifier assessed this text as highly credible.",
    timestamp: "2 hours ago"
  }
];

export default function TrendingNews() {
  return (
    <div style={{
      width: "100%",
      maxWidth: "1000px",
      margin: "0 auto",
      padding: "20px"
    }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "24px"
      }}>
        <h2 style={{
          fontSize: "1.5rem",
          fontWeight: 700,
          color: "var(--text-primary)",
          display: "flex",
          alignItems: "center",
          gap: "10px"
        }}>
          🔥 Trending Verifications
        </h2>
        <span style={{
          fontSize: "0.85rem",
          color: "var(--text-secondary)",
          background: "var(--bg-secondary)",
          padding: "4px 12px",
          borderRadius: "99px",
          border: "1px solid var(--border-subtle)"
        }}>
          Live Feed
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {TRENDING_NEWS.map((item) => (
          <div key={item.id} style={{
            background: "var(--glass-bg)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "16px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "12px",
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            transition: "transform 0.2s, boxShadow 0.2s",
            cursor: "default"
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.transform = "translateY(-2px)";
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
          >
            {/* Top Row */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <h3 style={{
                fontSize: "1.1rem",
                fontWeight: 600,
                color: "var(--text-primary)",
                margin: 0,
                lineHeight: "1.4",
                flex: 1,
                paddingRight: "20px"
              }}>
                "{item.claim}"
              </h3>
              
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}>
                <span style={{
                  background: item.verdict === "REAL" ? "var(--bg-success)" : "var(--bg-danger)",
                  color: item.verdict === "REAL" ? "var(--accent-green)" : "var(--accent-red)",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  fontWeight: 800,
                  fontSize: "0.85rem",
                  letterSpacing: "0.05em"
                }}>
                  {item.verdict === "REAL" ? "✅ REAL" : "⛔ FAKE"}
                </span>
                <span style={{
                  fontSize: "0.85rem",
                  color: "var(--text-secondary)",
                  fontWeight: 600,
                  background: "var(--bg-secondary)",
                  padding: "4px 8px",
                  borderRadius: "6px",
                  border: "1px solid var(--border-subtle)"
                }}>
                  {item.confidence}
                </span>
              </div>
            </div>

            {/* Explanation Row */}
            <p style={{
              fontSize: "0.9rem",
              color: "var(--text-secondary)",
              lineHeight: "1.5",
              margin: 0,
              background: "rgba(0,0,0,0.1)",
              padding: "12px",
              borderRadius: "8px",
              borderLeft: `3px solid ${item.verdict === "REAL" ? "var(--accent-green)" : "var(--accent-red)"}`
            }}>
              {item.explanation}
            </p>

            {/* Footer Row */}
            <div style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "4px"
            }}>
              <span style={{ fontSize: "0.75rem", color: "var(--text-tertiary)" }}>
                Verified {item.timestamp}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
