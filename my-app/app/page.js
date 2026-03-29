"use client";

import NewsAnalyzer from "./components/NewsAnalyzer";
import TrendingNews from "./components/TrendingNews";
import { useAuth } from "./context/AuthContext";
import { useEffect, useState } from "react";

export default function Home() {
  const { isLoggedIn, login } = useAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glow orbs */}
      <div className="glow-orb glow-orb-1" />
      <div className="glow-orb glow-orb-2" />

      {/* Hero Section */}
      <header
        style={{
          textAlign: "center",
          paddingTop: "60px",
          paddingBottom: "32px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "20px",
            padding: "6px 16px",
            borderRadius: "999px",
            background: "rgba(0, 212, 255, 0.08)",
            border: "1px solid rgba(0, 212, 255, 0.15)",
            fontSize: "0.8rem",
            color: "var(--accent-cyan)",
            fontWeight: 500,
            letterSpacing: "0.04em",
          }}
        >
          🔬 AI-Powered Verification Engine
        </div>

        <h1
          style={{
            fontSize: "clamp(2rem, 5vw, 3.2rem)",
            fontWeight: 800,
            letterSpacing: "-0.03em",
            lineHeight: 1.15,
            margin: "0 0 16px 0",
            background:
              "linear-gradient(135deg, #e8ecf4 0%, #00d4ff 60%, #0096c7 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          VerifAI
        </h1>

        <p
          style={{
            fontSize: "clamp(0.95rem, 2vw, 1.15rem)",
            color: "var(--text-secondary)",
            maxWidth: "520px",
            margin: "0 auto",
            lineHeight: 1.6,
            padding: "0 20px",
          }}
        >
          Detect misinformation in real-time with AI-driven analysis, source
          credibility scoring, and transparent explanations.
        </p>
      </header>

      {/* Analyzer or Auth Wall */}
      <section
        style={{
          width: "100%",
          padding: "0 20px 40px",
          display: "flex",
          justifyContent: "center"
        }}
      >
        {!mounted ? null : isLoggedIn ? (
          <NewsAnalyzer />
        ) : (
          <div style={{
            background: "var(--glass-bg)",
            border: "1px solid var(--border-subtle)",
            borderRadius: "24px",
            padding: "60px 40px",
            textAlign: "center",
            maxWidth: "800px",
            width: "100%",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "24px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.1)"
          }}>
            <div style={{ fontSize: "3.5rem" }}>🔒</div>
            <h2 style={{ fontSize: "2rem", fontWeight: 700, margin: 0, color: "var(--text-primary)" }}>Unlock AI Verification</h2>
            <p style={{ color: "var(--text-secondary)", fontSize: "1.1rem", maxWidth: "500px", lineHeight: "1.6" }}>
              Sign in to instantly verify news articles, uncover linguistic manipulation, and fact-check using real-time internet semantic search.
            </p>
            <button 
              onClick={() => login("user")}
              style={{
                background: "var(--gradient-button)",
                color: "white",
                border: "none",
                padding: "16px 36px",
                borderRadius: "99px",
                fontSize: "1.05rem",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(0, 240, 255, 0.3)",
                marginTop: "10px",
                transition: "opacity 0.2s"
              }}
              onMouseOver={(e) => e.currentTarget.style.opacity = 0.9}
              onMouseOut={(e) => e.currentTarget.style.opacity = 1}
            >
              Sign In to Verify News
            </button>
          </div>
        )}
      </section>

      {/* Trending News Feed */}
      <section style={{ width: "100%", padding: "20px 0 60px 0", position: "relative", zIndex: 1 }}>
        <TrendingNews />
      </section>

      {/* Feature Cards */}
      <section
        style={{
          width: "100%",
          maxWidth: "780px",
          margin: "0 auto",
          padding: "0 20px 80px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "16px",
          }}
        >
          <div className="feature-card">
            <div
              className="feature-icon"
              style={{ background: "var(--accent-cyan-dim)" }}
            >
              ⚡
            </div>
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: 600,
                marginBottom: "8px",
              }}
            >
              Real-Time Detection
            </h3>
            <p
              style={{
                fontSize: "0.85rem",
                color: "var(--text-secondary)",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Instant analysis of articles, headlines, and social media posts
              using advanced NLP.
            </p>
          </div>

          <div className="feature-card">
            <div
              className="feature-icon"
              style={{ background: "var(--accent-green-dim)" }}
            >
              🛡️
            </div>
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: 600,
                marginBottom: "8px",
              }}
            >
              Source Credibility
            </h3>
            <p
              style={{
                fontSize: "0.85rem",
                color: "var(--text-secondary)",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Evaluates the reliability and trustworthiness of information
              sources.
            </p>
          </div>

          <div className="feature-card">
            <div
              className="feature-icon"
              style={{ background: "var(--accent-amber-dim)" }}
            >
              🧠
            </div>
            <h3
              style={{
                fontSize: "1rem",
                fontWeight: 600,
                marginBottom: "8px",
              }}
            >
              Explainable AI
            </h3>
            <p
              style={{
                fontSize: "0.85rem",
                color: "var(--text-secondary)",
                lineHeight: 1.6,
                margin: 0,
              }}
            >
              Transparent reasoning — see why content was flagged with key
              phrase analysis.
            </p>
          </div>
        </div>
      </section>

    </main>
  );
}
