"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Search, Sparkles, HelpCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { GeoSearchPill } from "@/components/home/GeoSearchPill";
import { Zone } from "@/lib/geo";
import { TopExperts } from "@/components/home/top-experts";

// ─── DATA DELEGATES ───────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: "all", label: "All Support", color: "#8b7ff0" },
  { id: "Therapy", label: "Therapy", color: "#5DCAA5" },
  { id: "Education", label: "Education", color: "#85B7EB" },
  { id: "Clinical", label: "Clinical", color: "#EF9F27" },
  { id: "Academic", label: "Academic", color: "#F0997B" },
];

const SERVICES = [
  {
    icon: "🗣️", name: "Speech Therapy", slug: "speech-therapy", count: "45+ specialists",
    category: "Therapy", color: "rgba(139,127,240,0.12)",
    desc: "Support for language, articulation, and communication milestones."
  },
  {
    icon: "🎓", name: "Shadow Teaching", slug: "shadow-teaching", count: "60+ specialists",
    category: "Education", color: "rgba(59,109,17,0.12)",
    desc: "1:1 classroom assistance for neurodiverse learners."
  },
  {
    icon: "🧠", name: "ABA Therapy", slug: "aba-therapy", count: "32+ specialists",
    category: "Therapy", color: "rgba(29,158,117,0.12)",
    desc: "Evidence-based behavioral intervention for autism & development."
  },
  {
    icon: "📐", name: "Special Education", slug: "special-education", count: "58+ specialists",
    category: "Education", color: "rgba(24,95,165,0.12)",
    desc: "Personalized learning plans for ADHD, dyslexia, and more."
  },
  {
    icon: "🧩", name: "Occupational Therapy", slug: "occupational-therapy", count: "28+ specialists",
    category: "Therapy", color: "rgba(139,127,240,0.12)",
    desc: "Building motor skills, sensory regulation, and independence."
  },
  {
    icon: "💬", name: "Child Counselling", slug: "child-counselling", count: "40+ specialists",
    category: "Clinical", color: "rgba(216,90,48,0.12)",
    desc: "Emotional support for anxiety, trauma, and social growth."
  },
];

const TRUST_ITEMS = [
  "100% Verified Partners", "500+ Happy Families", "Neuro-Affirmative Care", "Seamless Booking"
];

// ─── SMART SEARCH SUGGESTIONS ────────────────────────────────────────────────
const ALL_SUGGESTIONS = [
  {
    icon: "🗣️", text: "Speech delay support", tag: "Therapy",
    category: "Speech Therapy", ageGroup: "3-6 yrs",
    keywords: ["speech", "delay", "talk", "language", "words", "speech therapy", "stammer"],
    color: "rgba(139,127,240,0.12)",
  },
  {
    icon: "🎓", text: "Shadow teacher for school", tag: "Education",
    category: "Special Education", ageGroup: "School-age",
    keywords: ["shadow", "teacher", "school", "inclusion", "aide", "mainstream", "classroom"],
    color: "rgba(59,109,17,0.12)",
  },
  {
    icon: "🧠", text: "Autism / ASD Assessment", tag: "Clinical",
    category: "Autism", ageGroup: "Early Childhood",
    keywords: ["autism", "asd", "assessment", "diagnosis", "spectrum", "sensory"],
    color: "rgba(29,158,117,0.12)",
  },
  {
    icon: "📐", text: "Math tutor (ICSE/CBSE)", tag: "Academic",
    category: "Tutoring", ageGroup: "Grade 1-10",
    keywords: ["math", "tutor", "science", "physics", "cbse", "icse", "exams", "study"],
    color: "rgba(24,95,165,0.12)",
  },
  {
    icon: "🧩", text: "Occupational therapy", tag: "Rehab",
    category: "Occupational Therapy", ageGroup: "All Ages",
    keywords: ["occupational", "ot", "motor", "sensory", "handwriting", "dexterity"],
    color: "rgba(139,127,240,0.12)",
  },
  {
    icon: "💬", text: "Child Psychologist", tag: "Mental Health",
    category: "Child Counselling", ageGroup: "Adolescent",
    keywords: ["counsell", "psycholog", "anxiety", "behavior", "emotional", "trauma"],
    color: "rgba(216,90,48,0.12)",
  },
  {
    icon: "👩‍⚕️", text: "ADHD / focus coaching", tag: "Behavioural",
    category: "Behavior Therapy", ageGroup: "5-15 yrs",
    keywords: ["adhd", "attention", "focus", "hyperactive", "executive", "impulse"],
    color: "rgba(239,159,39,0.12)",
  },
  {
    icon: "👨‍👩‍👧", text: "Parent Training (ABA/DIR)", tag: "Coaching",
    category: "Parenting", ageGroup: "Parents",
    keywords: ["parent", "coaching", "training", "caregive", "guidance"],
    color: "rgba(139,127,240,0.12)",
  },
];

function getSmartSuggestions(query: string, zone: Zone | null) {
  const q = query.toLowerCase().trim();
  const locationLabel = zone && zone.id !== "online" ? zone.label.replace("Near ", "") : null;
  const city = zone && zone.id !== "online" ? zone.city : null;

  const ageTiers = [
    { label: "3-6 yrs", match: ["3", "4", "5", "6", "preschool", "toddler"] },
    { label: "School-age", match: ["7", "8", "9", "10", "11", "12", "school", "grade"] },
    { label: "Adolescent", match: ["13", "14", "15", "16", "17", "18", "teen"] }
  ];
  const detectedAge = ageTiers.find(a => a.match.some(m => q.includes(m)))?.label;

  const getUrl = (s: typeof ALL_SUGGESTIONS[0]) => {
    const params = new URLSearchParams();
    if (s.category) params.set("category", s.category);
    if (detectedAge || s.ageGroup) params.set("ageGroup", detectedAge || s.ageGroup);
    if (city) params.set("city", city);
    if (q && !s.keywords.some(k => k === q)) params.set("q", q);
    return `/specialists?${params.toString()}`;
  };

  if (!q || q.length < 2) {
    return ALL_SUGGESTIONS.slice(0, 5).map((s) => {
      let display = s.text;
      if (locationLabel) display += ` near ${locationLabel}`;
      return { ...s, displayText: display, href: getUrl(s) };
    });
  }

  const matched = ALL_SUGGESTIONS
    .filter((s) =>
      s.text.toLowerCase().includes(q) ||
      s.keywords.some((k) => q.includes(k) || k.includes(q))
    )
    .map((s) => {
      let display = s.text;
      if (detectedAge) display += ` (${detectedAge})`;
      else if (s.ageGroup) display += ` (${s.ageGroup})`;
      
      if (locationLabel) display += ` near ${locationLabel}`;

      return {
        ...s,
        displayText: display,
        href: getUrl(s)
      };
    });

  return matched.length > 0 ? matched.slice(0, 6) : [
    {
      icon: "🔍", text: `Search for "${query}"`, tag: "Direct Search",
      color: "rgba(255,255,255,0.05)",
      displayText: `Search for "${query}" ${locationLabel ? `in ${locationLabel}` : ""}`,
      href: `/specialists?q=${encodeURIComponent(query)}${city ? `&city=${city}` : ""}`
    }
  ];
}

interface InteractiveHeroProps {
  initialExperts?: any[];
}

export function InteractiveHero({ initialExperts = [] }: InteractiveHeroProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeZone, setActiveZone] = useState<Zone | null>(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowSuggestions(false);
        setHighlightedIndex(-1);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const buildSearchUrl = useCallback((q: string) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (activeZone && activeZone.id !== "online") params.set("city", activeZone.city);
    return `/specialists?${params.toString()}`;
  }, [activeZone]);

  const handleSearch = useCallback(() => {
    setShowSuggestions(false);
    router.push(buildSearchUrl(query.trim()));
  }, [query, buildSearchUrl, router]);

  const suggestions = getSmartSuggestions(query, activeZone);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setHighlightedIndex((i) => Math.min(i + 1, suggestions.length - 1)); }
    if (e.key === "ArrowUp") { e.preventDefault(); setHighlightedIndex((i) => Math.max(i - 1, -1)); }
    if (e.key === "Enter") {
      if (highlightedIndex >= 0) {
        router.push(suggestions[highlightedIndex].href);
        setShowSuggestions(false);
      } else {
        handleSearch();
      }
    }
    if (e.key === "Escape") { setShowSuggestions(false); setHighlightedIndex(-1); }
  };

  const filteredServices = activeCategory === "all" ? SERVICES : SERVICES.filter((s) => s.category === activeCategory);

  if (!mounted) return null;

  return (
    <>
      <section className="relative text-center overflow-hidden" style={{ padding: "56px 24px 64px" }}>
        {/* Ambient glow */}
        <div className="absolute pointer-events-none" style={{
          top: "-120px", left: "50%", transform: "translateX(-50%)",
          width: "700px", height: "400px",
          background: "radial-gradient(ellipse, rgba(120,100,220,0.12) 0%, transparent 70%)",
        }} />

        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 mb-7" style={{
          background: "rgba(255,255,255,0.06)", border: "0.5px solid rgba(255,255,255,0.12)",
          borderRadius: "100px", padding: "4px 14px", fontSize: "11px", fontWeight: 500,
          letterSpacing: "0.08em", textTransform: "uppercase", color: "#b0a8f0",
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#8b7ff0", display: "inline-block" }} />
          Verified specialists · Bangalore, Delhi & Online
        </div>

        {/* Headline */}
        <h1 className="mx-auto mb-4" style={{
          fontFamily: "'DM Serif Display', 'Georgia', serif",
          fontSize: "clamp(32px, 5vw, 52px)", lineHeight: 1.15,
          color: "#f0ece4", maxWidth: "700px",
        }}>
          Find the right expert<br />
          for your child — and{" "}
          <em style={{ fontStyle: "italic", color: "#c5b8f8" }}>yourself</em>
        </h1>

        <p className="mx-auto" style={{
          fontSize: "15px", color: "#8a8591", maxWidth: "480px",
          lineHeight: 1.65, marginBottom: "40px",
        }}>
          Learning, behaviour, communication, academics and development support —{" "}
          matched to what your family actually needs.
        </p>

        {/* ─── SEARCH BAR ─── */}
        <div ref={searchRef} className="relative mx-auto flex flex-col md:flex-row items-center justify-center gap-3" style={{ maxWidth: "680px", marginBottom: "14px" }}>
          <div className="flex items-center gap-3 w-full" style={{
            background: "rgba(255,255,255,0.06)",
            border: showSuggestions ? "0.5px solid rgba(139,127,240,0.5)" : "0.5px solid rgba(255,255,255,0.14)",
            borderRadius: "100px", padding: "6px 6px 6px 20px", transition: "border-color 0.2s",
          }}>
            <Search style={{ color: "#8a8591", flexShrink: 0, width: 16, height: 16 }} aria-hidden="true" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); setHighlightedIndex(-1); }}
              onFocus={() => setShowSuggestions(true)}
              onKeyDown={handleKeyDown}
              placeholder="e.g. Speech delay 3 yrs · Shadow teacher · ADHD support…"
              autoComplete="off"
              className="focus-visible:ring-2 focus-visible:ring-[#8b7ff0] focus-visible:ring-offset-0 focus-visible:outline-none"
              style={{
                flex: 1, background: "transparent", border: "none", outline: "none",
                fontFamily: "inherit", fontSize: "14px", color: "#e8e2d8", minWidth: 0,
              }}
              aria-label="Search specialists"
              aria-autocomplete="list"
              aria-expanded={showSuggestions}
            />

            {/* Divider */}
            <div className="hidden md:block" style={{ width: "0.5px", height: 20, background: "rgba(255,255,255,0.2)", flexShrink: 0 }} />

            <div className="hidden md:flex shrink-0">
               <GeoSearchPill onZoneChange={setActiveZone} />
            </div>

            {/* Search button */}
            <button onClick={handleSearch} className="hidden md:flex focus-visible:ring-2 focus-visible:ring-[#8b7ff0] focus-visible:outline-none" style={{
              background: "#e8e2d8", color: "#0d0f1a", border: "none", borderRadius: "100px",
              padding: "12px 24px", fontFamily: "inherit", fontSize: "13px", fontWeight: 600,
              cursor: "pointer", alignItems: "center", gap: 6,
              whiteSpace: "nowrap", transition: "background 0.15s",
            }}
              onMouseOver={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#fff")}
              onMouseOut={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#e8e2d8")}
              aria-label="Search"
            >
              Search →
            </button>
          </div>
          
          <div className="md:hidden flex w-full gap-2">
             <div className="flex-1">
                <GeoSearchPill onZoneChange={setActiveZone} />
             </div>
             <button onClick={handleSearch} className="flex-1 justify-center focus-visible:ring-2 focus-visible:ring-[#8b7ff0] focus-visible:outline-none" style={{
                background: "#e8e2d8", color: "#0d0f1a", border: "none", borderRadius: "100px",
                padding: "12px 24px", fontFamily: "inherit", fontSize: "13px", fontWeight: 600,
                cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
                whiteSpace: "nowrap", transition: "background 0.15s",
              }}
                onMouseOver={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#fff")}
                onMouseOut={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "#e8e2d8")}
                aria-label="Search"
              >
                Search →
              </button>
          </div>

          {/* ─── SUGGESTIONS DROPDOWN ─── */}
          {showSuggestions && (
            <div className="absolute left-0 right-0" style={{
              top: "calc(100% + 8px)", background: "#1a1c2e",
              border: "0.5px solid rgba(255,255,255,0.12)",
              borderRadius: "18px", padding: "12px 0", zIndex: 50,
              boxShadow: "0 32px 64px rgba(0,0,0,0.5)",
            }}>
              {/* AI label */}
              <div className="flex items-center gap-2" style={{
                fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                color: "#8a8591", padding: "4px 18px 8px",
              }}>
                <Sparkles style={{ width: 10, height: 10, color: "#8b7ff0" }} aria-hidden="true" />
                {query.length > 1 ? "Matching results" : "Popular searches"}
                {activeZone && <span style={{ color: "#8b7ff0", marginLeft: 4 }}>· {activeZone.label}</span>}
              </div>

              {suggestions.map((sug, i) => (
                <button key={i}
                  onClick={() => { setShowSuggestions(false); router.push(sug.href); }}
                  className="flex items-center gap-3 w-full text-left focus-visible:ring-2 focus-visible:ring-[#8b7ff0] focus-visible:outline-none"
                  style={{
                    padding: "10px 18px", cursor: "pointer", transition: "background 0.1s",
                    background: i === highlightedIndex ? "rgba(139,127,240,0.08)" : "transparent",
                    border: "none",
                  }}
                  onMouseEnter={() => setHighlightedIndex(i)}
                  onMouseLeave={() => setHighlightedIndex(-1)}
                  aria-label={`Suggestion: ${sug.displayText}`}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: 9, background: sug.color,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 15, flexShrink: 0,
                  }} aria-hidden="true">
                    {sug.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, color: "#c8c2d0", lineHeight: 1.4 }}>
                      {query.length > 1
                        ? (() => {
                            const idx = sug.displayText.toLowerCase().indexOf(query.toLowerCase());
                            if (idx === -1) return sug.displayText;
                            return (
                              <>
                                {sug.displayText.slice(0, idx)}
                                <mark style={{ background: "rgba(139,127,240,0.3)", color: "#e8e2d8", borderRadius: 3 }}>
                                  {sug.displayText.slice(idx, idx + query.length)}
                                </mark>
                                {sug.displayText.slice(idx + query.length)}
                              </>
                            );
                          })()
                        : sug.displayText}
                    </div>
                  </div>
                  <span style={{
                    fontSize: 10, padding: "2px 8px", borderRadius: 100,
                    border: "0.5px solid rgba(255,255,255,0.1)", color: "#8a8591", whiteSpace: "nowrap",
                  }}>
                    {sug.tag}
                  </span>
                  <ArrowRight style={{ width: 12, height: 12, color: "#6b6475", flexShrink: 0 }} aria-hidden="true" />
                </button>
              ))}

              <div style={{ padding: "10px 18px 6px", borderTop: "0.5px solid rgba(255,255,255,0.05)", marginTop: 6 }}>
                <button onClick={() => router.push("/book")}
                  className="flex items-center gap-2 w-full focus-visible:ring-2 focus-visible:ring-[#8b7ff0] focus-visible:outline-none"
                  style={{
                    background: "rgba(239,159,39,0.06)", border: "0.5px solid rgba(239,159,39,0.2)",
                    borderRadius: 12, padding: "10px 14px", cursor: "pointer",
                    color: "#EF9F27", fontSize: 13, fontWeight: 600,
                    fontFamily: "inherit", textAlign: "left", transition: "background 0.15s",
                  }}
                  onMouseOver={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(239,159,39,0.1)")}
                  onMouseOut={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(239,159,39,0.06)")}
                >
                  <HelpCircle style={{ width: 14, height: 14, flexShrink: 0 }} aria-hidden="true" />
                  Not sure what your child needs? Answer 3 questions — we'll guide you →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ─── TRUST STRIP ─── */}
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-10">
          {TRUST_ITEMS.map((item, i) => (
            <React.Fragment key={i}>
              <span style={{ fontSize: 12, color: "#8a8591", display: "flex", alignItems: "center", gap: 4 }}>{item}</span>
              {i < TRUST_ITEMS.length - 1 && (
                <span style={{ width: 4, height: 4, borderRadius: "50%", background: "#6b6475", display: "inline-block" }} aria-hidden="true" />
              )}
            </React.Fragment>
          ))}
        </div>
      </section>

      {/* ═══ CATEGORY PILLS ══════════════════════════════════════════════════ */}
      <div className="flex items-center justify-center gap-2 flex-wrap" style={{ padding: "0 24px 48px" }}>
        {CATEGORIES.map((cat) => (
          <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
            className="flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-[#8b7ff0] focus-visible:outline-none"
            style={{
              padding: "8px 16px", borderRadius: "100px",
              border: activeCategory === cat.id ? `0.5px solid rgba(139,127,240,0.4)` : "0.5px solid rgba(255,255,255,0.1)",
              background: activeCategory === cat.id ? "rgba(139,127,240,0.08)" : "rgba(255,255,255,0.03)",
              fontSize: 13, color: activeCategory === cat.id ? "#c5b8f8" : "#8a8591",
              cursor: "pointer", transition: "all 0.15s", fontFamily: "inherit",
            }}
            aria-pressed={activeCategory === cat.id}
          >
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: cat.color, display: "inline-block", flexShrink: 0 }} aria-hidden="true" />
            {cat.label}
          </button>
        ))}
      </div>

      {/* ═══ SERVICES SECTION ════════════════════════════════════════════════ */}
      <section style={{ padding: "0 24px 60px", maxWidth: 1200, margin: "0 auto" }}>
        <div className="flex items-end justify-between flex-wrap gap-4" style={{ marginBottom: "24px" }}>
          <div>
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 5,
              fontSize: 10, fontWeight: 600, letterSpacing: "0.1em",
              textTransform: "uppercase", color: "#8a8591", marginBottom: 8,
            }}>
              <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#8a8591", display: "inline-block" }} aria-hidden="true" />
              What can we help with
            </div>
            <h2 style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
              fontSize: "clamp(24px, 3.5vw, 36px)", color: "#f0ece4", lineHeight: 1.2, margin: 0,
            }}>
              Every kind of support,<br />in one place
            </h2>
            <p style={{ fontSize: 14, color: "#8a8591", marginTop: 6, maxWidth: 400, lineHeight: 1.6 }}>
              From speech delays to exam prep — find the right expert for where your child is right now.
            </p>
          </div>
          <Link href="/specialists" className="focus-visible:ring-2 focus-visible:ring-[#8b7ff0] focus-visible:outline-none rounded-sm" style={{
            fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase",
            color: "#8b7ff0", textDecoration: "none", display: "flex", alignItems: "center", gap: 5, whiteSpace: "nowrap",
          }}>View all services →</Link>
        </div>

        <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12 }}>
          {filteredServices.map((svc) => (
            <Link key={svc.slug} href={`/services/${svc.slug}`} style={{ textDecoration: "none" }} className="focus-visible:ring-2 focus-visible:ring-[#8b7ff0] focus-visible:outline-none rounded-2xl">
              <div className="group flex flex-col" style={{
                background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.08)",
                borderRadius: 14, padding: "20px 18px", cursor: "pointer",
                transition: "all 0.2s", gap: 12, height: "100%",
              }}
                onMouseOver={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.15)";
                  (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.05)";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-1px)";
                }}
                onMouseOut={(e) => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.08)";
                  (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.03)";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                }}
              >
                <div style={{
                  width: 42, height: 42, borderRadius: 12, background: svc.color,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
                }} aria-hidden="true">{svc.icon}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#e0daea", lineHeight: 1.35 }}>{svc.name}</div>
                  <div style={{ fontSize: 11, color: "#8a8591", marginTop: 2 }}>{svc.count}</div>
                  <div style={{ fontSize: 11, color: "#8a8591", marginTop: 4, lineHeight: 1.4 }}>{svc.desc}</div>
                </div>
                <div className="self-end hidden md:block" style={{ fontSize: 14, color: "#6b6475", marginTop: "auto", transition: "color 0.15s" }} aria-hidden="true">→</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ═══ TOP EXPERTS ════════════════════════════════════════════════════ */}
      <TopExperts zone={activeZone} initialExperts={initialExperts} />
    </>
  );
}
