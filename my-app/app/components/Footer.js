export default function Footer() {
  return (
    <footer
      style={{
        width: "100%",
        textAlign: "center",
        padding: "24px 20px",
        borderTop: "1px solid var(--border-subtle)",
        position: "relative",
        zIndex: 1,
        background: "var(--bg-primary)",
      }}
    >
      <p
        style={{
          fontSize: "0.8rem",
          color: "var(--text-muted)",
          margin: 0,
        }}
      >
               © 2026 VerifAI. All Rights Reserved
      </p>
    </footer>
  );
}
