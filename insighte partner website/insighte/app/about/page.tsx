"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Heart, ShieldCheck, ArrowRight, Target, Sparkles,
  Users, Award, Globe, Zap, Quote,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

// ─── TEAM DATA ────────────────────────────────────────────────────────────────
const TEAM = [
  {
    name: "Midhun Noble", role: "Founder & CEO", dept: "leadership",
    initials: "MN", accent: "#c5b8f8", accentBg: "rgba(139,127,240,0.15)",
    bio: "Parent, architect, and advocate. Midhun built Insighte after realising how fractured and inaccessible the care ecosystem was for Indian families.",
  },
  {
    name: "Trisha Mukherjee", role: "Chief Clinical Officer", dept: "clinical",
    initials: "TM", accent: "#5DCAA5", accentBg: "rgba(29,158,117,0.15)",
    bio: "20+ years in pediatric psychology and neuro-affirming practice. Trisha leads the clinical framework and specialist vetting at Insighte.",
  },
  {
    name: "Dr. Ananya Rao", role: "Lead Speech Pathologist", dept: "clinical",
    initials: "AR", accent: "#85B7EB", accentBg: "rgba(24,95,165,0.15)",
    bio: "Pioneer in communication-first speech therapy. Dr. Rao trains our speech therapy specialists and designs assessment protocols.",
  },
  {
    name: "Riya Venkatesan", role: "Head of Partner Success", dept: "ops",
    initials: "RV", accent: "#F0997B", accentBg: "rgba(216,90,48,0.15)",
    bio: "Former special educator turned ops lead. Riya ensures every specialist joining Insighte is supported, retained, and growing.",
  },
  {
    name: "Arjun Mehta", role: "Head of Engineering", dept: "tech",
    initials: "AM", accent: "#97C459", accentBg: "rgba(59,109,17,0.15)",
    bio: "Architect of the Insighte platform. Arjun believes technology should be invisible — it should just work, accessibly, for everyone.",
  },
  {
    name: "Kavya Suresh", role: "Community Manager", dept: "ops",
    initials: "KS", accent: "#EF9F27", accentBg: "rgba(239,159,39,0.15)",
    bio: "Kavya grows the Insighte parent and practitioner community, running our support groups and digital spaces.",
  },
];

const DEPT_TABS = [
  { id: "all", label: "All" },
  { id: "leadership", label: "Leadership" },
  { id: "clinical", label: "Clinical" },
  { id: "tech", label: "Tech" },
  { id: "ops", label: "Operations" },
];

const VALUES = [
  { icon: <Heart className="w-5 h-5" />, title: "Connection Before Correction", desc: "We lead with empathy. Our platform never hard-fails — every touchpoint is designed to feel like a warm hand, not a locked door.", color: "#c5b8f8" },
  { icon: <ShieldCheck className="w-5 h-5" />, title: "Neuro-Affirming, Always", desc: "We design for every brain. No flickering, no cognitive overload — every experience is built around how children and parents actually process the world.", color: "#5DCAA5" },
  { icon: <Award className="w-5 h-5" />, title: "Clinical Integrity", desc: "Only vetted, credentialed specialists on Insighte. We'd rather have fewer experts than compromise on the quality of care your child receives.", color: "#85B7EB" },
  { icon: <Globe className="w-5 h-5" />, title: "Radical Accessibility", desc: "Care shouldn't be a privilege. We actively work to make quality support affordable, local, and available to families across India's tier-1 and tier-2 cities.", color: "#EF9F27" },
];

const STATS = [
  { value: "1,000+", label: "Families supported" },
  { value: "200+", label: "Verified specialists" },
  { value: "12", label: "Cities active" },
  { value: "< 24h", label: "Avg match time" },
];

const CAREERS = [
  { title: "Clinical Quality Lead", dept: "Clinical", type: "Full-time · Bangalore", desc: "Own the specialist vetting, training, and outcomes framework." },
  { title: "Full-Stack Engineer (Next.js)", dept: "Engineering", type: "Full-time · Remote", desc: "Build the weightless care infrastructure that serves 1000s of families." },
  { title: "Specialist Partnerships Manager", dept: "Ops", type: "Full-time · Delhi/Bangalore", desc: "Recruit, onboard, and retain India's best child-development specialists." },
];

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function AboutPage() {
  const [mounted, setMounted] = useState(false);
  const [activeDept, setActiveDept] = useState("all");

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const visibleTeam = activeDept === "all" ? TEAM : TEAM.filter((m) => m.dept === activeDept);

  return (
    <div style={{ minHeight: "100vh", background: "#0d0f1a", color: "#e8e2d8", fontFamily: "'DM Sans', 'Inter', sans-serif" }}>
      <Navbar />

      <main style={{ paddingTop: 80 }}>

        {/* ═══ HERO ═══════════════════════════════════════════════════════════ */}
        <section style={{ position: "relative", padding: "72px 24px 64px", textAlign: "center", overflow: "hidden" }}>
          <div style={{
            position: "absolute", top: "-100px", left: "50%", transform: "translateX(-50%)",
            width: "700px", height: "500px",
            background: "radial-gradient(ellipse, rgba(139,127,240,0.1) 0%, transparent 70%)",
            pointerEvents: "none",
          }} />

          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, marginBottom: 20, background: "rgba(255,255,255,0.05)", border: "0.5px solid rgba(255,255,255,0.1)", borderRadius: "100px", padding: "5px 16px" }}>
            <Sparkles style={{ width: 11, height: 11, color: "#c5b8f8" }} />
            <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#b0a8f0" }}>Our Story & Mission</span>
          </div>

          <h1 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "clamp(36px, 6vw, 64px)", lineHeight: 1.1, color: "#f0ece4", maxWidth: 700, margin: "0 auto 20px" }}>
            Making care<br />
            <em style={{ color: "#c5b8f8", fontStyle: "italic" }}>accessible</em> — for every family
          </h1>

          <p style={{ fontSize: 16, color: "#8a8591", maxWidth: 520, margin: "0 auto 48px", lineHeight: 1.7 }}>
            Insighte is a care marketplace on a mission to connect Indian families with verified, neuro-affirming specialists — for therapy, education, and child development.
          </p>

          {/* Stats strip */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 0, justifyContent: "center", maxWidth: 680, margin: "0 auto", background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 16, overflow: "hidden" }}>
            {STATS.map((stat, i) => (
              <div key={i} style={{ padding: "24px 32px", flex: "1 1 120px", borderRight: i < STATS.length - 1 ? "0.5px solid rgba(255,255,255,0.07)" : "none", textAlign: "center" }}>
                <div style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 28, fontWeight: 700, color: "#c5b8f8", marginBottom: 4 }}>{stat.value}</div>
                <div style={{ fontSize: 12, color: "#5a5466" }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ STORY ═══════════════════════════════════════════════════════════ */}
        <section style={{ padding: "0 24px 72px", maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16 }}>
            {/* Quote card */}
            <div style={{ background: "rgba(139,127,240,0.08)", border: "0.5px solid rgba(139,127,240,0.2)", borderRadius: 20, padding: "36px 32px", position: "relative", overflow: "hidden" }}>
              <Quote style={{ width: 28, height: 28, color: "rgba(197,184,248,0.2)", position: "absolute", top: 20, right: 20 }} />
              <p style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "clamp(18px, 2.5vw, 24px)", color: "#f0ece4", lineHeight: 1.5, marginBottom: 24, fontStyle: "italic" }}>
                "Empathy is our most powerful technology."
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <span style={{ fontWeight: 700, color: "#c5b8f8", fontSize: 15 }}>Midhun Noble</span>
                <span style={{ fontSize: 11, color: "#5a5466", letterSpacing: "0.1em", textTransform: "uppercase" }}>Founder & CEO</span>
              </div>
            </div>

            {/* Fighting for the family */}
            <div style={{ background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 20, padding: "36px 32px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#5a5466", marginBottom: 12 }}>Why we exist</div>
              <h3 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "clamp(20px, 2.5vw, 26px)", color: "#f0ece4", lineHeight: 1.3, marginBottom: 16 }}>
                Fighting for the family
              </h3>
              <p style={{ fontSize: 14, color: "#8a8591", lineHeight: 1.75 }}>
                Traditional childcare hasn't changed in decades. Parents are left navigating a fragmented ecosystem of unverified WhatsApp referrals, overbooked clinics, and inconsistent quality. We knew families deserved better.
                <br /><br />
                Insighte was built with one conviction: <strong style={{ color: "#c5b8f8" }}>connection before correction</strong>. Before we treat, we understand. Before we prescribe, we listen.
              </p>
            </div>

            {/* Connection before correction */}
            <div style={{ background: "rgba(29,158,117,0.08)", border: "0.5px solid rgba(29,158,117,0.2)", borderRadius: 20, padding: "36px 32px" }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#5DCAA5", marginBottom: 12 }}>Our Doctrine</div>
              <h3 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "clamp(20px, 2.5vw, 26px)", color: "#f0ece4", lineHeight: 1.3, marginBottom: 16 }}>
                Celebrating how<br />every child learns
              </h3>
              <p style={{ fontSize: 14, color: "#8a8591", lineHeight: 1.75 }}>
                We don't see neurodiversity as a deficit to be corrected. We see it as a different kind of intelligence — one that deserves specialists who truly understand it and tools that celebrate, not suppress, it.
              </p>
              <div style={{ marginTop: 24, padding: "12px 16px", background: "rgba(29,158,117,0.08)", borderRadius: 12, fontSize: 13, color: "#5DCAA5", fontWeight: 600 }}>
                500+ families navigated with empathy first
              </div>
            </div>
          </div>
        </section>

        {/* ═══ VALUES ══════════════════════════════════════════════════════════ */}
        <section style={{ padding: "0 24px 72px", maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 40 }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6b6475", marginBottom: 8 }}>What we stand for</div>
            <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "clamp(26px, 3.5vw, 38px)", color: "#f0ece4", lineHeight: 1.2, margin: 0 }}>
              Our values
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 14 }}>
            {VALUES.map((val, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.08)",
                borderRadius: 16, padding: 24, transition: "all 0.2s",
              }}
                onMouseOver={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.15)"; }}
                onMouseOut={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.08)"; }}
              >
                <div style={{ width: 40, height: 40, borderRadius: 12, background: `${val.color}18`, color: val.color, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  {val.icon}
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#f0ece4", marginBottom: 8, lineHeight: 1.3 }}>{val.title}</div>
                <div style={{ fontSize: 12, color: "#5a5466", lineHeight: 1.65 }}>{val.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ TEAM ════════════════════════════════════════════════════════════ */}
        <section style={{ padding: "0 24px 72px", maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16, marginBottom: 32 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#6b6475", marginBottom: 8 }}>The People</div>
              <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "clamp(26px, 3.5vw, 38px)", color: "#f0ece4", lineHeight: 1.2, margin: 0 }}>
                Guided by experts
              </h2>
            </div>
            {/* Dept filter */}
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {DEPT_TABS.map((tab) => (
                <button key={tab.id} onClick={() => setActiveDept(tab.id)}
                  style={{
                    padding: "6px 14px", borderRadius: 100, fontSize: 12, fontWeight: 600,
                    background: activeDept === tab.id ? "rgba(139,127,240,0.12)" : "rgba(255,255,255,0.04)",
                    border: activeDept === tab.id ? "0.5px solid rgba(139,127,240,0.35)" : "0.5px solid rgba(255,255,255,0.08)",
                    color: activeDept === tab.id ? "#c5b8f8" : "#8a8591",
                    cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
                  }}>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 14 }}>
            {visibleTeam.map((member) => (
              <div key={member.name} style={{
                background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.08)",
                borderRadius: 18, padding: 22, display: "flex", gap: 16, alignItems: "flex-start",
                transition: "all 0.2s",
              }}
                onMouseOver={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.15)";
                  (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.05)";
                }}
                onMouseOut={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.08)";
                  (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.03)";
                }}
              >
                {/* Avatar */}
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: member.accentBg, border: `1.5px solid ${member.accent}40`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 18, fontWeight: 700, color: member.accent }}>
                  {member.initials}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 700, color: "#f0ece4", marginBottom: 2 }}>{member.name}</div>
                  <div style={{ fontSize: 11, color: member.accent, fontWeight: 700, letterSpacing: "0.04em", marginBottom: 10, textTransform: "uppercase" }}>{member.role}</div>
                  <div style={{ fontSize: 12, color: "#8a8591", lineHeight: 1.65 }}>{member.bio}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ═══ CAREERS ═════════════════════════════════════════════════════════ */}
        <section style={{ padding: "0 24px 80px", maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ background: "rgba(255,255,255,0.025)", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 24, padding: "48px 36px", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: "10%", right: "10%", height: "1px", background: "linear-gradient(90deg, transparent, rgba(139,127,240,0.4), transparent)" }} />
            <div style={{ position: "absolute", bottom: -60, right: -60, width: 200, height: 200, borderRadius: "50%", background: "rgba(139,127,240,0.05)", filter: "blur(60px)" }} />

            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 24, marginBottom: 36 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "#c5b8f8", marginBottom: 8 }}>Join the team</div>
                <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: "clamp(26px, 3.5vw, 38px)", color: "#f0ece4", lineHeight: 1.15, margin: "0 0 8px" }}>
                  Build the future<br />of care in India
                </h2>
                <p style={{ fontSize: 14, color: "#5a5466", maxWidth: 380, lineHeight: 1.65 }}>
                  We're hiring people who believe precision and empathy are inseparable — in our product, our clinical work, and our team culture.
                </p>
              </div>
              <Link href="/partners" style={{
                display: "inline-flex", alignItems: "center", gap: 8, background: "#c5b8f8",
                color: "#0d0f1a", borderRadius: 100, padding: "12px 28px",
                fontSize: 13, fontWeight: 700, textDecoration: "none", whiteSpace: "nowrap",
              }}>
                Join as Specialist <ArrowRight style={{ width: 14, height: 14 }} />
              </Link>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {CAREERS.map((job) => (
                <div key={job.title} style={{
                  background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.08)",
                  borderRadius: 14, padding: "18px 20px",
                  display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap",
                  transition: "all 0.2s", cursor: "pointer",
                }}
                  onMouseOver={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.16)"; }}
                  onMouseOut={(e) => { (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.08)"; }}
                >
                  <div style={{ flex: 1, minWidth: 200 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#e8e2d8", marginBottom: 4 }}>{job.title}</div>
                    <div style={{ fontSize: 12, color: "#5a5466" }}>{job.type}</div>
                    <div style={{ fontSize: 12, color: "#8a8591", marginTop: 4 }}>{job.desc}</div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 100, background: "rgba(139,127,240,0.1)", border: "0.5px solid rgba(139,127,240,0.25)", color: "#c5b8f8", fontWeight: 600 }}>{job.dept}</span>
                    <span style={{ fontSize: 18, color: "#5a5466" }}>→</span>
                  </div>
                </div>
              ))}
            </div>

            <p style={{ fontSize: 13, color: "#5a5466", marginTop: 20 }}>
              Don't see a fit? Send us your story at{" "}
              <a href="mailto:careers@insighte.in" style={{ color: "#c5b8f8" }}>careers@insighte.in</a>
            </p>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
