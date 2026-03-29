export default function About() {
  return (
    <main
      style={{
        minHeight: "calc(100vh - 149px)", /* Account for header + footer roughly */
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "60px 20px",
        position: "relative",
      }}
    >
      {/* Background Orbs */}
      <div className="glow-orb glow-orb-1" style={{ top: "-100px", left: "20%" }} />
      <div className="glow-orb glow-orb-2" style={{ top: "20%", right: "10%" }} />

      <div style={{ maxWidth: "800px", width: "100%", zIndex: 1 }}>
        <h1
          style={{
            fontSize: "clamp(2rem, 4vw, 3rem)",
            fontWeight: 800,
            marginBottom: "24px",
            background: "var(--gradient-button)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            textAlign: "center"
          }}
        >
          About VerifAI
        </h1>
        
        <div className="glass-card animate-fade-in-up" style={{ padding: "40px", borderRadius: "var(--radius-lg)" }}>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "16px", color: "var(--text-primary)" }}>Our Mission</h2>
          <p style={{ fontSize: "1.05rem", lineHeight: 1.8, color: "var(--text-secondary)", marginBottom: "24px" }}>
            The sheer volume of digital information today makes it difficult to separate fact from fiction. 
            <strong> VerifAI</strong> was built to tackle the spread of misinformation by providing users with an instant, clear, and explainable analysis of online news content.
          </p>

          <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: "16px", color: "var(--text-primary)", marginTop: "32px" }}>How It Works</h2>
          <ul style={{ fontSize: "1.05rem", lineHeight: 1.8, color: "var(--text-secondary)", listStyle: "none", paddingLeft: 0, margin: 0 }}>
            <li style={{ marginBottom: "12px", display: "flex", gap: "10px" }}>
              <span>🔍</span> <span><strong>Real-Time Analysis:</strong> Using advanced linguistics search, we analyze text for sensationalist language and typical misinformation markers.</span>
            </li>
            <li style={{ marginBottom: "12px", display: "flex", gap: "10px" }}>
              <span>🌐</span> <span><strong>Trusted Source Cross-Referencing:</strong> We ping external APIs spanning the BBC, Reuters, AP News, and Wikipedia to find identical or opposing coverage.</span>
            </li>
            <li style={{ marginBottom: "12px", display: "flex", gap: "10px" }}>
              <span>🧠</span> <span><strong>Explainable AI:</strong> A final verdict provides an easy-to-read explanation outlining exactly why the claim is deemed credible or unreliable.</span>
            </li>
          </ul>

          <div style={{ marginTop: "40px", paddingTop: "24px", borderTop: "1px solid var(--border-subtle)", textAlign: "center" }}>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>Created with ❤️</p>
          </div>
        </div>
      </div>
    </main>
  );
}
