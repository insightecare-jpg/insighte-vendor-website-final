import React from "react";
import Link from "next/link";
import {
  Home as HomeIcon,
  LayoutDashboard,
  User,
  CalendarDays,
  ShieldCheck,
  Heart,
  Users,
} from "lucide-react";

import { TestimonialsSection } from "@/components/ui/testimonials-section";
import { SchoolLogoScroll } from "@/components/ui/school-logo-scroll";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { InteractiveHero } from "@/components/home/interactive-hero";

// ─── DATA DELEGATES ───────────────────────────────────────────────────────────
const HOW_STEPS = [
  { num: "01", title: "Discover", desc: "Browse specialized partners or use our guided triage." },
  { num: "02", title: "Match", desc: "Find the expert who resonates with your child's signature." },
  { num: "03", title: "Connect", desc: "Book a 1:1 session instantly — online or in-person." },
  { num: "04", title: "Grow", desc: "Receive evidence-based support and regular progress logs." },
];

const WHY_ITEMS = [
  {
    icon: <ShieldCheck className="w-5 h-5" aria-hidden="true" />,
    title: "Vetted Sovereignty",
    desc: "Every specialists goes through a 4-step verification process before joining."
  },
  {
    icon: <Heart className="w-5 h-5" aria-hidden="true" />,
    title: "Child-First Design",
    desc: "Our platform is engineered for emotional safety and accessibility."
  },
  {
    icon: <Users className="w-5 h-5" aria-hidden="true" />,
    title: "Institutional Stability",
    desc: "Experience the heart of a founder with the scale of an institution."
  },
];

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function InsighteHome() {
  return (
    <div className="flex flex-col min-h-screen overflow-x-hidden"
      style={{ background: "#0d0f1a", color: "#e8e2d8", fontFamily: "'DM Sans', 'Inter', sans-serif" }}>
      <Navbar />

      <main id="main-content" className="relative pt-24 pb-24">

        {/* ═══ INTERACTIVE HERO & SEARCH ════════════════════════════════════════════ */}
        <InteractiveHero />

        {/* ═══ HOW IT WORKS ════════════════════════════════════════════════════ */}
        <section style={{ padding: "0 24px 60px", maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ marginBottom: 24 }}>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              fontSize: 10, fontWeight: 600, letterSpacing: "0.1em",
              textTransform: "uppercase", color: "#8a8591", marginBottom: 8,
            }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#8a8591", display: "inline-block" }} aria-hidden="true" />
              Simple process
            </div>
            <h2 style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
              fontSize: "clamp(24px, 3.5vw, 36px)", color: "#f0ece4", lineHeight: 1.2,
            }}>
              From search to session<br />in minutes
            </h2>
          </div>

          <div className="grid" style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1px",
            background: "rgba(255,255,255,0.06)", border: "0.5px solid rgba(255,255,255,0.06)",
            borderRadius: 16, overflow: "hidden",
          }}>
            {HOW_STEPS.map((step) => (
              <div key={step.num} style={{
                background: "#0d0f1a", padding: "28px 24px",
                display: "flex", flexDirection: "column", gap: 12,
              }}>
                <div style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 28, color: "rgba(255,255,255,0.08)", lineHeight: 1 }} aria-hidden="true">{step.num}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#e0daea" }}>{step.title}</div>
                <div style={{ fontSize: 12, color: "#8a8591", lineHeight: 1.6 }}>{step.desc}</div>
              </div>
            ))}
          </div>
        </section>

        <div style={{ height: "0.5px", background: "rgba(255,255,255,0.05)", margin: "0 24px 48px" }} aria-hidden="true" />

        {/* ═══ WHY INSIGHTE ════════════════════════════════════════════════════ */}
        <section style={{ padding: "0 24px 60px", maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "clamp(28px, 4vw, 42px)", color: "#f0ece4", lineHeight: 1.2, marginBottom: 8 }}>
              Why families choose Insighte
            </h2>
            <p style={{ fontSize: 14, color: "#8a8591", maxWidth: 420, margin: "0 auto", lineHeight: 1.6 }}>
              A platform built by parents, for parents — designed to make finding help simple, not stressful.
            </p>
          </div>

          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
            {WHY_ITEMS.map((item, i) => (
              <div key={i} className="group" style={{
                background: "rgba(255,255,255,0.035)", border: "0.5px solid rgba(255,255,255,0.08)",
                borderRadius: 16, padding: 24, transition: "all 0.2s", cursor: "default"
              }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, background: "rgba(139,127,240,0.12)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "#c5b8f8", marginBottom: 16,
                }} aria-hidden="true">{item.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#e0daea", marginBottom: 8 }}>{item.title}</div>
                <div style={{ fontSize: 12, color: "#8a8591", lineHeight: 1.6 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ SCHOOL LOGOS ════════════════════════════════════════════════════ */}
        <SchoolLogoScroll />

        {/* ═══ TESTIMONIALS ════════════════════════════════════════════════════ */}
        <TestimonialsSection />

        {/* ═══ FINAL CTA ════════════════════════════════════════════════════════ */}
        <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 48px" }}>
          <div className="relative overflow-hidden text-center" style={{
            borderRadius: 20, padding: "48px 32px",
            background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.08)",
          }}>
            <div style={{
              position: "absolute", top: 0, left: "10%", right: "10%", height: "1px",
              background: "linear-gradient(90deg, transparent, rgba(139,127,240,0.5), transparent)",
            }} aria-hidden="true" />
            <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "clamp(24px, 4vw, 36px)", color: "#f0ece4", marginBottom: 12, lineHeight: 1.2 }}>
              You don't have to figure this out alone
            </h2>
            <p style={{ fontSize: 14, color: "#8a8591", marginBottom: 32, maxWidth: 420, margin: "0 auto 32px" }}>
              Join thousands of parents who found the right support for their child through Insighte.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Link href="/specialists" className="focus-visible:ring-2 focus-visible:ring-[#8b7ff0] focus-visible:outline-none" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "#e8e2d8", color: "#0d0f1a", borderRadius: 100,
                padding: "12px 28px", fontSize: 13, fontWeight: 600, textDecoration: "none",
              }}>Get matched with the right expert →</Link>
              <Link href="/book" className="focus-visible:ring-2 focus-visible:ring-[#8b7ff0] focus-visible:outline-none" style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                background: "transparent", color: "#8b7ff0",
                border: "0.5px solid rgba(139,127,240,0.3)", borderRadius: 100,
                padding: "12px 28px", fontSize: 13, fontWeight: 600, textDecoration: "none",
              }}>Not sure? Answer 3 questions →</Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* ─── Mobile Bottom Nav ─── */}
      <nav className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] z-50 flex justify-around items-center px-2 py-2 backdrop-blur-3xl rounded-full border border-white/10 shadow-2xl"
        style={{ background: "rgba(26,28,46,0.9)" }}>
        <Link href="/" className="flex flex-col items-center justify-center rounded-full p-3 shadow-lg focus-visible:ring-2 focus-visible:ring-[#8b7ff0] focus-visible:outline-none"
          style={{ background: "#c5b8f8", color: "#0d0f1a" }} aria-label="Home"><HomeIcon className="w-5 h-5" aria-hidden="true" /></Link>
        <Link href="/specialists" className="flex flex-col items-center justify-center p-3 focus-visible:ring-2 focus-visible:ring-[#8b7ff0] focus-visible:outline-none"
          style={{ color: "#8a8591" }} aria-label="Find specialists"><LayoutDashboard className="w-5 h-5" aria-hidden="true" /></Link>
        <Link href="/book" className="flex flex-col items-center justify-center p-3 focus-visible:ring-2 focus-visible:ring-[#8b7ff0] focus-visible:outline-none"
          style={{ color: "#8a8591" }} aria-label="Book session"><CalendarDays className="w-5 h-5" aria-hidden="true" /></Link>
        <Link href="/login" className="flex flex-col items-center justify-center p-3 focus-visible:ring-2 focus-visible:ring-[#8b7ff0] focus-visible:outline-none"
          style={{ color: "#8a8591" }} aria-label="Account"><User className="w-5 h-5" aria-hidden="true" /></Link>
      </nav>
    </div>
  );
}
