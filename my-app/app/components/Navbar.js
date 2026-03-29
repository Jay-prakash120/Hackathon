"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [theme, setTheme] = useState("dark");
  const [mounted, setMounted] = useState(false);
  const { user, isLoggedIn, isReporter, login, logout } = useAuth();

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
      document.body.setAttribute("data-theme", savedTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    document.body.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const btnStyle = {
    padding: "8px 16px",
    borderRadius: "999px",
    fontSize: "0.85rem",
    fontWeight: 700,
    cursor: "pointer",
    transition: "all 0.3s ease",
  };

  return (
    <nav style={{
      width: "100%",
      padding: "16px 40px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      borderBottom: "1px solid var(--border-subtle)",
      background: "var(--glass-bg)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      position: "sticky",
      top: 0,
      zIndex: 50,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
          <span style={{
            fontSize: "1.5rem",
            fontWeight: 800,
            background: "var(--gradient-button)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            letterSpacing: "-0.03em"
          }}>VerifAI</span>
        </Link>
      </div>

      <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
          <Link href="/" className="nav-link" style={{ textDecoration: "none", color: "var(--text-primary)", fontWeight: 600, fontSize: "0.95rem" }}>
            Home
          </Link>
          <Link href="/about" className="nav-link" style={{ textDecoration: "none", color: "var(--text-primary)", fontWeight: 600, fontSize: "0.95rem" }}>
            About Us
          </Link>
          <Link href="/pricing" className="nav-link" style={{ textDecoration: "none", color: "var(--text-primary)", fontWeight: 600, fontSize: "0.95rem" }}>
            Pricing
          </Link>
          
          {isReporter && (
            <Link href="/reporter" className="nav-link" style={{ 
              textDecoration: "none", 
              color: "var(--accent-cyan)", 
              fontWeight: 800, 
              fontSize: "0.95rem",
              background: "var(--accent-cyan-dim)",
              padding: "4px 10px",
              borderRadius: "8px"
            }}>
              Reporter Dashboard
            </Link>
          )}
        </div>
        
        {mounted ? (
          <div style={{ display: "flex", gap: "12px", alignItems: "center", borderLeft: "1px solid var(--border-subtle)", paddingLeft: "24px" }}>
            <button 
              onClick={toggleTheme}
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-subtle)",
                padding: "8px 16px",
                borderRadius: "999px",
                color: "var(--text-primary)",
                cursor: "pointer",
                fontSize: "0.85rem",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: "6px",
                transition: "all 0.3s ease",
                boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
              }}
            >
              {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
            </button>

            {isLoggedIn ? (
              <button 
                onClick={logout}
                style={{ ...btnStyle, background: "transparent", border: "1px solid var(--accent-red)", color: "var(--accent-red)" }}
              >
                Logout ({user?.name.split(" ")[0]})
              </button>
            ) : (
              <>
                <button 
                  onClick={() => login("user")}
                  style={{ ...btnStyle, background: "var(--bg-secondary)", color: "var(--text-primary)", border: "1px solid var(--border-subtle)" }}
                >
                  Sign In (User)
                </button>
                <button 
                  onClick={() => login("reporter")}
                  style={{ ...btnStyle, background: "var(--gradient-button)", color: "white", border: "none" }}
                >
                  Sign In (Reporter)
                </button>
              </>
            )}
          </div>
        ) : (
          <div style={{ width: "250px", height: "34px" }}></div>
        )}
      </div>
    </nav>
  );
}
