"use client";

import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const REPORTED_QUEUE = [
  {
    id: 101,
    claim: "Breaking: AI passes the Turing Test and attains consciousness.",
    aiVerdict: "REAL",
    aiConfidence: "88.4%",
    userNote: "This seems like clickbait. Can an expert confirm?",
    submitter: "User_842",
    timeAgo: "10 mins ago"
  },
  {
    id: 102,
    claim: "The 2026 Space Treaty was just signed by all UN members.",
    aiVerdict: "FAKE",
    aiConfidence: "65.0%",
    userNote: "I saw this on a local news channel but AI flagged it as fake. Please verify.",
    submitter: "AeroFan99",
    timeAgo: "1 hour ago"
  },
  {
    id: 103,
    claim: "Scientists discover unlimited clean energy source in deep ocean.",
    aiVerdict: "REAL",
    aiConfidence: "92.1%",
    userNote: "Sounds too good to be true. Probably a misinterpretation of a small study.",
    submitter: "ScienceDude",
    timeAgo: "3 hours ago"
  }
];

export default function ReporterDashboard() {
  const { user, isReporter } = useAuth();
  const { addToast } = useToast();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [queue, setQueue] = useState(REPORTED_QUEUE);
  const [removingIds, setRemovingIds] = useState([]);

  useEffect(() => {
    setMounted(true);
    if (!localStorage.getItem("verifai_user")) {
        router.push("/");
    }
  }, [router]);

  if (!mounted) return null;

  if (!isReporter) {
    return (
      <div style={{ padding: "100px", textAlign: "center", color: "var(--text-primary)" }}>
        <h2>Access Denied</h2>
        <p>You must be signed in as a Verified Reporter to view this dashboard.</p>
        <button onClick={() => router.push("/")} style={{
          marginTop: "20px", padding: "10px 20px", background: "var(--bg-secondary)", 
          border: "1px solid var(--border-subtle)", color: "var(--text-primary)", 
          borderRadius: "8px", cursor: "pointer"
        }}>Return Home</button>
      </div>
    );
  }

  const handleReview = (id, newVerdict) => {
    setRemovingIds(prev => [...prev, id]);
    addToast(`Claim ${id} successfully marked as ${newVerdict} and submitted to the live model!`, "success");
    
    // Wait for the animation to finish before unmounting the element completely
    setTimeout(() => {
        setQueue(prev => prev.filter(item => item.id !== id));
        setRemovingIds(prev => prev.filter(rId => rId !== id));
    }, 400);
  };

  return (
    <div style={{
      maxWidth: "1000px",
      margin: "0 auto",
      padding: "60px 20px",
      minHeight: "100vh"
    }}>
      <div style={{ marginBottom: "40px" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: 800, margin: "0 0 10px 0", color: "var(--text-primary)" }}>
          Expert Review Queue
        </h1>
        <p style={{ fontSize: "1.1rem", color: "var(--text-secondary)", margin: 0 }}>
          Welcome back, {user?.name}. You have <b>{queue.length}</b> community-flagged items pending verification.
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        {queue.length === 0 ? (
          <div style={{ padding: "60px", textAlign: "center", background: "var(--glass-bg)", borderRadius: "16px", border: "1px solid var(--border-subtle)" }}>
            <span style={{ fontSize: "3rem" }}>🎉</span>
            <h3 style={{ color: "var(--text-primary)", marginTop: "20px" }}>Queue is empty!</h3>
            <p style={{ color: "var(--text-secondary)" }}>All flagged claims have been reviewed.</p>
          </div>
        ) : (
          queue.map((item) => {
            const isRemoving = removingIds.includes(item.id);
            return (
              <div key={item.id} style={{
                background: "var(--glass-bg)",
                border: "1px solid var(--border-subtle)",
                borderRadius: "16px",
                padding: isRemoving ? "0 24px" : "24px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                
                // --- Animation Properties ---
                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                opacity: isRemoving ? 0 : 1,
                transform: isRemoving ? "scale(0.9) translateY(20px)" : "scale(1) translateY(0)",
                maxHeight: isRemoving ? "0px" : "400px",
                overflow: "hidden",
                margin: isRemoving ? "0" : "auto",
                width: "100%",
                // ----------------------------
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", opacity: isRemoving ? 0 : 1, transition: "opacity 0.2s" }}>
                  <div style={{ flex: 1 }}>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-tertiary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px" }}>
                      Reported {item.timeAgo} by {item.submitter}
                    </span>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--text-primary)", margin: "8px 0" }}>
                      "{item.claim}"
                    </h3>
                  </div>
                  <div style={{ textAlign: "right", minWidth: "120px" }}>
                    <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", display: "block", marginBottom: "4px" }}>AI Verdict</span>
                    <span style={{
                      background: item.aiVerdict === "REAL" ? "var(--bg-success)" : "var(--bg-danger)",
                      color: item.aiVerdict === "REAL" ? "var(--accent-green)" : "var(--accent-red)",
                      padding: "4px 10px",
                      borderRadius: "6px",
                      fontWeight: 800,
                      fontSize: "0.85rem"
                    }}>
                      {item.aiVerdict} ({item.aiConfidence})
                    </span>
                  </div>
                </div>

                <div style={{
                  background: "rgba(0,0,0,0.1)",
                  padding: "16px",
                  borderRadius: "8px",
                  borderLeft: "3px solid var(--accent-cyan)",
                  color: "var(--text-secondary)",
                  opacity: isRemoving ? 0 : 1, 
                  transition: "opacity 0.2s"
                }}>
                  <b>Submitter Note:</b> "{item.userNote}"
                </div>

                {/* Action Buttons */}
                <div style={{ display: "flex", gap: "12px", marginTop: "10px", justifyContent: "flex-end", opacity: isRemoving ? 0 : 1, transition: "opacity 0.2s" }}>
                  <button 
                    onClick={() => handleReview(item.id, 'REAL')}
                    style={btnApproveStyle}
                  >
                    <span style={{ fontSize: "1.2rem" }}>✅</span> Verify as REAL
                  </button>
                  <button 
                    onClick={() => handleReview(item.id, 'FAKE')}
                    style={btnRejectStyle}
                  >
                    <span style={{ fontSize: "1.2rem" }}>⛔</span> Flag as FAKE
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

const btnApproveStyle = {
  background: "var(--bg-success)",
  color: "var(--accent-green)",
  border: "1px solid var(--accent-green)",
  padding: "12px 20px",
  borderRadius: "8px",
  fontWeight: 700,
  fontSize: "0.95rem",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  transition: "all 0.2s"
};

const btnRejectStyle = {
  background: "var(--bg-danger)",
  color: "var(--accent-red)",
  border: "1px solid var(--accent-red)",
  padding: "12px 20px",
  borderRadius: "8px",
  fontWeight: 700,
  fontSize: "0.95rem",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: "8px",
  transition: "all 0.2s"
};
