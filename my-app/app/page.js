import NewsAnalyzer from "./components/NewsAnalyzer";

export default function Home() {
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

      {/* Analyzer */}
      <section
        style={{
          width: "100%",
          padding: "0 20px 40px",
        }}
      >
        <NewsAnalyzer />
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

      {/* Footer */}
      <footer
        style={{
          width: "100%",
          textAlign: "center",
          padding: "20px",
          borderTop: "1px solid var(--border-subtle)",
          position: "relative",
          zIndex: 1,
        }}
      >
        <p
          style={{
            fontSize: "0.75rem",
            color: "var(--text-muted)",
            margin: 0,
          }}
        >
          VerifAI — Hackathon Project • Built with Next.js & Python
        </p>
      </footer>
    </main>
  );
}
