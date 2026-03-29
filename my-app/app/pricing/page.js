"use client";

import Link from "next/link";
import { useState } from "react";

export default function PricingPage() {
  const [isAnnual, setIsAnnual] = useState(false);

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg-primary)",
      color: "var(--text-primary)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "80px 20px 120px 20px",
      fontFamily: "'Inter', sans-serif"
    }}>
      
      {/* Header Section */}
      <div style={{ textAlign: "center", marginBottom: "60px", maxWidth: "700px" }}>
        <h1 style={{
          fontSize: "3.5rem",
          fontWeight: 800,
          background: "var(--gradient-button)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          letterSpacing: "-0.03em",
          marginBottom: "20px"
        }}>
          Simple, Transparent Pricing
        </h1>
        <p style={{
          fontSize: "1.2rem",
          color: "var(--text-secondary)",
          lineHeight: "1.6"
        }}>
          Whether you're an individual fact-checking daily news or a digital media house needing massive API volume, we have a plan for you.
        </p>
      </div>

      {/* Main Pricing Cards */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
        gap: "30px",
        width: "100%",
        maxWidth: "1100px",
        marginBottom: "80px"
      }}>
        
        {/* FREE PLAN */}
        <div style={cardStyle}>
          <h2 style={planTypeStyle}>Free</h2>
          <div style={priceContainerStyle}>
            <span style={priceNumberStyle}>₹0</span>
            <span style={priceCycleStyle}>/forever</span>
          </div>
          <p style={planDescStyle}>Perfect for individuals who want to occasionally check suspicious articles.</p>
          <hr style={dividerStyle} />
          <ul style={featureListStyle}>
            <FeatureItem title="10 Fact-checks per day" />
            <FeatureItem title="Standard ML accuracy" />
            <FeatureItem title="Contains Ads" />
          </ul>
          <button style={btnSecondaryStyle}>Get Started</button>
        </div>

        {/* PRO PLAN */}
        <div style={{
          ...cardStyle,
          border: "1px solid var(--accent-cyan)",
          boxShadow: "0 0 30px rgba(0, 240, 255, 0.15)",
          transform: "scale(1.03)"
        }}>
          <div style={popularBadgeStyle}>MOST POPULAR</div>
          <h2 style={planTypeStyle}>Pro</h2>
          <div style={priceContainerStyle}>
            <span style={priceNumberStyle}>₹299</span>
            <span style={priceCycleStyle}>/month</span>
          </div>
          <p style={planDescStyle}>Designed for power users and journalists who need reliable access.</p>
          <hr style={dividerStyle} />
          <ul style={featureListStyle}>
            <FeatureItem title="Unlimited fact-checks" />
            <FeatureItem title="Zero Advertisements" />
            <FeatureItem title="Priority processing speed" />
          </ul>
          <button style={btnPrimaryStyle}>Upgrade to Pro</button>
        </div>

        {/* BUSINESS PLAN */}
        <div style={cardStyle}>
          <h2 style={planTypeStyle}>Business</h2>
          <div style={priceContainerStyle}>
            <span style={priceNumberStyle}>₹1999</span>
            <span style={priceCycleStyle}>/month</span>
          </div>
          <p style={planDescStyle}>For developers and small teams needing to integrate VerifAI directly.</p>
          <hr style={dividerStyle} />
          <ul style={featureListStyle}>
            <FeatureItem title="Everything in Pro" />
            <FeatureItem title="Full REST API access" />
            <FeatureItem title="Team tracking & analytics" />
          </ul>
          <button style={btnSecondaryStyle}>Start Free Trial</button>
        </div>
      </div>

      {/* API Usage & B2B Sections Side by Side */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
        gap: "40px",
        width: "100%",
        maxWidth: "1100px"
      }}>
        
        {/* API PRICING */}
        <div style={secondaryCardStyle}>
          <div style={iconCircleStyle}>💻</div>
          <h3 style={{ fontSize: "1.5rem", marginBottom: "15px" }}>Pay-As-You-Go API Limits</h3>
          <p style={{ color: "var(--text-secondary)", marginBottom: "25px", lineHeight: "1.6" }}>
            Scale your infrastructure exactly when you need it. High throughput API pricing designed for developers building the next generation of trustworthy applications.
          </p>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <div style={apiRowStyle}>
              <span style={{ fontWeight: 600 }}>1,000 requests</span>
              <span style={{ color: "var(--accent-green)", fontWeight: 700 }}>$10</span>
            </div>
            <div style={apiRowStyle}>
              <span style={{ fontWeight: 600 }}>10,000 requests</span>
              <span style={{ color: "var(--accent-green)", fontWeight: 700 }}>$50</span>
            </div>
            <div style={apiRowStyle}>
              <span style={{ fontWeight: 600 }}>100,000 requests</span>
              <span style={{ color: "var(--accent-green)", fontWeight: 700 }}>$200</span>
            </div>
          </div>
        </div>

        {/* B2B ENTERPRISE */}
        <div style={secondaryCardStyle}>
          <div style={iconCircleStyle}>🏢</div>
          <h3 style={{ fontSize: "1.5rem", marginBottom: "15px" }}>Enterprise & B2B</h3>
          <p style={{ color: "var(--text-secondary)", marginBottom: "20px", lineHeight: "1.6" }}>
            Massive volume scaling, custom model fine-tuning, and dedicated support engineering.
          </p>
          
          <div style={{
            background: "rgba(0, 0, 0, 0.2)",
            padding: "20px",
            borderRadius: "12px",
            marginBottom: "20px",
            border: "1px solid var(--border-subtle)"
          }}>
            <span style={{ display: "block", fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "8px" }}>Annual Contract Range:</span>
            <span style={{ fontSize: "1.8rem", fontWeight: 800, color: "var(--text-primary)" }}>₹50,000 — ₹2,00,000</span>
            <span style={{ display: "block", fontSize: "0.9rem", color: "var(--text-secondary)", marginTop: "4px" }}>per year</span>
          </div>

          <p style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: "12px" }}>Ideal Architecture For:</p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            <span style={tagStyle}>Online News Portals</span>
            <span style={tagStyle}>Digital Media Houses</span>
            <span style={tagStyle}>Fact-Check Organizations</span>
            <span style={tagStyle}>Government Intel</span>
          </div>
        </div>

      </div>
    </div>
  );
}

// Subcomponent for bullet points
function FeatureItem({ title }) {
  return (
    <li style={{ display: "flex", alignItems: "center", gap: "12px", color: "var(--text-secondary)", fontSize: "0.95rem" }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent-green)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
      {title}
    </li>
  );
}

// STYLES
const cardStyle = {
  background: "var(--glass-bg)",
  border: "1px solid var(--border-subtle)",
  borderRadius: "24px",
  padding: "40px 30px",
  display: "flex",
  flexDirection: "column",
  position: "relative",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
};

const secondaryCardStyle = {
  background: "var(--glass-bg)",
  border: "1px solid var(--border-subtle)",
  borderRadius: "24px",
  padding: "40px",
  display: "flex",
  flexDirection: "column",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  height: "100%"
};

const popularBadgeStyle = {
  position: "absolute",
  top: "-15px",
  left: "50%",
  transform: "translateX(-50%)",
  background: "var(--gradient-button)",
  color: "white",
  padding: "6px 16px",
  borderRadius: "99px",
  fontSize: "0.75rem",
  fontWeight: 800,
  letterSpacing: "0.05em",
  boxShadow: "0 4px 14px rgba(0, 240, 255, 0.4)"
};

const planTypeStyle = {
  fontSize: "1.4rem",
  fontWeight: 600,
  marginBottom: "15px",
  color: "var(--text-primary)"
};

const priceContainerStyle = {
  display: "flex",
  alignItems: "flex-end",
  gap: "4px",
  marginBottom: "20px"
};

const priceNumberStyle = {
  fontSize: "3rem",
  fontWeight: 800,
  lineHeight: "1"
};

const priceCycleStyle = {
  fontSize: "1rem",
  color: "var(--text-secondary)",
  marginBottom: "6px"
};

const planDescStyle = {
  color: "var(--text-secondary)",
  fontSize: "0.95rem",
  lineHeight: "1.6",
  marginBottom: "24px",
  minHeight: "45px"
};

const dividerStyle = {
  border: "none",
  borderTop: "1px solid var(--border-subtle)",
  margin: "0 0 24px 0",
  width: "100%"
};

const featureListStyle = {
  listStyle: "none",
  padding: 0,
  margin: "0 0 40px 0",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  flexGrow: 1
};

const btnPrimaryStyle = {
  width: "100%",
  padding: "16px",
  background: "var(--gradient-button)",
  color: "white",
  border: "none",
  borderRadius: "12px",
  fontSize: "1rem",
  fontWeight: 700,
  cursor: "pointer",
  transition: "opacity 0.2s",
  boxShadow: "0 4px 14px rgba(0, 240, 255, 0.3)"
};

const btnSecondaryStyle = {
  width: "100%",
  padding: "16px",
  background: "transparent",
  color: "var(--text-primary)",
  border: "1px solid var(--border-subtle)",
  borderRadius: "12px",
  fontSize: "1rem",
  fontWeight: 700,
  cursor: "pointer",
  transition: "all 0.2s",
};

const apiRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  padding: "16px 20px",
  background: "rgba(0, 0, 0, 0.2)",
  borderRadius: "12px",
  border: "1px solid var(--border-subtle)",
  fontSize: "1.05rem"
};

const tagStyle = {
  background: "var(--bg-secondary)",
  border: "1px solid var(--border-subtle)",
  padding: "8px 14px",
  borderRadius: "8px",
  fontSize: "0.85rem",
  color: "var(--text-secondary)",
  fontWeight: 500
};

const iconCircleStyle = {
  width: "50px",
  height: "50px",
  borderRadius: "50%",
  background: "var(--bg-secondary)",
  border: "1px solid var(--border-subtle)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "1.5rem",
  marginBottom: "20px"
};
