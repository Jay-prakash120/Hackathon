import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "VerifAI — Fake News Detection & Verification",
  description:
    "AI-powered fake news detection system with real-time misinformation analysis, source credibility scoring, and explainable AI outputs.",
  keywords: [
    "fake news detection",
    "misinformation",
    "fact checking",
    "AI verification",
    "NLP",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
