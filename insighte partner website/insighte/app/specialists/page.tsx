"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import {
  Search, SlidersHorizontal, X, MapPin, User,
  Video, ChevronDown, Sparkles, Globe, HelpCircle,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { cn, normalizeCategory } from "@/lib/utils";
import { ProviderCard } from "@/components/ui/provider-card";
import { SERVICE_GROUPS, TOP_LEVEL_FILTERS } from "@/lib/constants";
import { Suspense } from "react";

// ─── URL PARAM CATEGORY MAP ───────────────────────────────────────────────────
// Maps arbitrary URL params (from homepage suggestions) → normalised category strings
const CATEGORY_PARAM_MAP: Record<string, string> = {
  "speech therapy":           "Speech Therapy",
  "speech+therapy":           "Speech Therapy",
  "autism":                   "Autism",
  "occupational therapy":     "Occupational Therapy",
  "occupational+therapy":     "Occupational Therapy",
  "child counselling":        "Child Counselling",
  "child+counselling":        "Child Counselling",
  "behavior therapy":         "Behavior Therapy",
  "behavior+therapy":         "Behavior Therapy",
  "behaviour therapy":        "Behavior Therapy",
  "special education":        "Special Education",
  "special+education":        "Special Education",
  "tutoring":                 "Tutoring",
  "arts":                     "Arts",
  "developmental pediatrics": "Developmental Pediatrics",
  "developmental+pediatrics": "Developmental Pediatrics",
  "school inclusion":         "School Inclusion",
  "school+inclusion":         "School Inclusion",
};

const AGE_PARAM_MAP: Record<string, string> = {
  "toddler":        "Toddlers (2-4)",
  "toddlers":       "Toddlers (2-4)",
  "preschool":      "Pre-Primary (4-6)",
  "pre-primary":    "Pre-Primary (4-6)",
  "primary":        "Primary (6-10)",
  "adolescent":     "Adolescents (10+)",
  "adolescents":    "Adolescents (10+)",
  "teen":           "Adolescents (10+)",
  "adult":          "Young Adults (19+)",
};

const AGE_GROUPS = [
  "Toddlers (2-4)", "Pre-Primary (4-6)", "Primary (6-10)",
  "Adolescents (10+)", "Young Adults (19+)",
];

const SUBJECTS = [
  "English", "Maths", "Science", "Social Studies", "Hindi", "Kannada",
  "French", "German", "Pre-Primary", "Junior", "High School", "Graduation",
  "CBSE", "ICSE", "IB", "State Board", "Cambridge board", "NIOS", "Homework Support",
];

const CITIES = ["Bangalore", "Delhi", "Mumbai", "Kochi", "Trivandrum", "Chennai", "Hyderabad", "Pune", "Online"];

// ─── LABEL FOR A FILTER TAG ────────────────────────────────────────────────────
function labelFor(key: string, val: string): string {
  if (key === "city") return `📍 ${val}`;
  if (key === "age") return `🧒 ${val}`;
  if (key === "category") return `🔖 ${val}`;
  if (key === "q") return `🔍 "${val}"`;
  if (key === "condition") return `🩺 ${val}`;
  if (key === "mode") return val === "online" ? "💻 Online" : `📍 ${val}`;
  return val;
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function SpecialistsPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "100vh", background: "#0d0f1a", color: "#e8e2d8", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p style={{ fontSize: 16, color: "#8a8591" }}>Loading specialists...</p>
      </div>
    }>
      <SpecialistsContent />
    </Suspense>
  );
}

function SpecialistsContent() {
  const supabase = createClient();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [providers, setProviders] = useState<any[]>([]);
  const [onlineProviders, setOnlineProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialised, setInitialised] = useState(false);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedAgeGroups, setSelectedAgeGroups] = useState<string[]>([]);
  const [selectedSubModules, setSelectedSubModules] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState("All");
  const [selectedMode, setSelectedMode] = useState<"all" | "offline" | "online">("all");
  const [showFilters, setShowFilters] = useState(false);

  // ── Read URL params on mount (single source of truth) ──────────────────────
  useEffect(() => {
    const q         = searchParams.get("q") || searchParams.get("query") || "";
    const city      = searchParams.get("city") || searchParams.get("location") || "All";
    const catRaw    = searchParams.get("category") || "";
    const ageRaw    = searchParams.get("ageGroup") || searchParams.get("age") || "";
    const condRaw   = searchParams.get("condition") || "";
    const modeRaw   = searchParams.get("mode") || "all";
    const boardRaw  = searchParams.get("board") || "";
    const typeRaw   = searchParams.get("type") || "";

    if (q) setSearchQuery(q);
    if (city && city !== "All") setSelectedCity(city);
    if (modeRaw === "online") setSelectedMode("online");

    // Category resolution
    const cats: string[] = [];
    if (catRaw) {
      const resolved = CATEGORY_PARAM_MAP[catRaw.toLowerCase()] || catRaw;
      cats.push(resolved);
    }
    if (condRaw) {
      const resolved = CATEGORY_PARAM_MAP[condRaw.toLowerCase()] || condRaw;
      if (!cats.includes(resolved)) cats.push(resolved);
    }
    if (cats.length > 0) setSelectedCategories(cats);

    // Sub-modules
    const subs: string[] = [];
    if (typeRaw)  subs.push(typeRaw.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()));
    if (boardRaw) subs.push(boardRaw);
    if (subs.length > 0) setSelectedSubModules(subs);

    // Age group
    if (ageRaw) {
      const resolved = AGE_PARAM_MAP[ageRaw.toLowerCase()] || ageRaw;
      setSelectedAgeGroups([resolved]);
    }

    setInitialised(true);
  }, [searchParams]);

  // ── Fetch whenever filters change (after init) ─────────────────────────────
  useEffect(() => {
    if (!initialised) return;
    const handler = setTimeout(() => { fetchProviders(); }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery, selectedCategories, selectedAgeGroups, selectedSubModules, selectedCity, selectedMode, initialised]);

  async function fetchProviders() {
    setLoading(true);
    const specs = [...selectedSubModules, ...selectedCategories];
    const targetCity = selectedCity === "All" ? null : selectedCity;

    // Determine mode filtering
    const modes: string[] | null =
      selectedMode === "online"  ? ["Online"] :
      selectedMode === "offline" ? ["Home", "In-Clinic"] :
      null;

    const { data, error } = await supabase.rpc("search_partners", {
      search_term:      searchQuery,
      selected_specs:   specs.length > 0 ? specs : null,
      selected_modes:   modes,
      selected_ages:    selectedAgeGroups.length > 0 ? selectedAgeGroups : null,
      target_city:      targetCity,
      require_available: false,
    });

    if (error) {
      console.error("Search RPC error:", error);
      setProviders([]);
    } else {
      setProviders(data || []);

      // If city-filtered search returns 0 and we're not already in online mode,
      // silently fetch online providers as a fallback
      if (targetCity && (data || []).length === 0 && selectedMode !== "online") {
        const { data: onlineData } = await supabase.rpc("search_partners", {
          search_term:      searchQuery,
          selected_specs:   specs.length > 0 ? specs : null,
          selected_modes:   ["Online"],
          selected_ages:    selectedAgeGroups.length > 0 ? selectedAgeGroups : null,
          target_city:      null,
          require_available: false,
        });
        setOnlineProviders(onlineData || []);
      } else {
        setOnlineProviders([]);
      }
    }
    setLoading(false);
  }

  // ── Active filter tags (from state → shown as dismissible pills) ────────────
  type FilterTag = { id: string; label: string; onRemove: () => void };
  const activeTags: FilterTag[] = useMemo(() => {
    const tags: FilterTag[] = [];
    if (searchQuery) tags.push({ id: "q", label: labelFor("q", searchQuery), onRemove: () => setSearchQuery("") });
    if (selectedCity !== "All") tags.push({ id: "city", label: labelFor("city", selectedCity), onRemove: () => setSelectedCity("All") });
    if (selectedMode !== "all") tags.push({ id: "mode", label: labelFor("mode", selectedMode), onRemove: () => setSelectedMode("all") });
    selectedCategories.forEach((c) => tags.push({ id: `cat-${c}`, label: labelFor("category", c), onRemove: () => toggleCategory(c) }));
    selectedAgeGroups.forEach((a) => tags.push({ id: `age-${a}`, label: labelFor("age", a), onRemove: () => toggleAgeGroup(a) }));
    selectedSubModules.forEach((s) => tags.push({ id: `sub-${s}`, label: s, onRemove: () => toggleSubModule(s) }));
    return tags;
  }, [searchQuery, selectedCity, selectedMode, selectedCategories, selectedAgeGroups, selectedSubModules]);

  // ── URL sync (push state changes back to URL for shareability) ──────────────
  function syncUrl(overrides: Record<string, string> = {}) {
    const p = new URLSearchParams();
    const q   = overrides.q       ?? searchQuery;
    const cat = overrides.cat     ?? selectedCategories[0] ?? "";
    const city = overrides.city   ?? (selectedCity !== "All" ? selectedCity : "");
    const age = overrides.age     ?? selectedAgeGroups[0] ?? "";
    const mode = overrides.mode   ?? (selectedMode !== "all" ? selectedMode : "");
    if (q)    p.set("q", q);
    if (cat)  p.set("category", cat);
    if (city) p.set("city", city);
    if (age)  p.set("ageGroup", age);
    if (mode) p.set("mode", mode);
    router.replace(`/specialists?${p.toString()}`, { scroll: false });
  }

  // ── Toggle helpers ──────────────────────────────────────────────────────────
  const toggleCategory = (cat: string) => {
    const norm = normalizeCategory(cat);
    setSelectedCategories((prev) => {
      const next = prev.includes(norm) ? prev.filter((c) => c !== norm) : [...prev, norm];
      return next;
    });
  };

  const toggleSubModule = (sm: string) => {
    const norm = normalizeCategory(sm);
    setSelectedSubModules((prev) =>
      prev.includes(norm) ? prev.filter((s) => s !== norm) : [...prev, norm]
    );
  };

  const toggleAgeGroup = (age: string) => {
    setSelectedAgeGroups((prev) =>
      prev.includes(age) ? prev.filter((a) => a !== age) : [...prev, age]
    );
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedAgeGroups([]);
    setSelectedSubModules([]);
    setSearchQuery("");
    setSelectedCity("All");
    setSelectedMode("all");
    router.replace("/specialists", { scroll: false });
  };

  const hasFilters = activeTags.length > 0;

  // ─────────────────────────────────────────────────────────────────────────────

  return (
    <div style={{
      minHeight: "100vh", background: "#0d0f1a", color: "#e8e2d8",
      fontFamily: "'DM Sans', 'Inter', sans-serif",
    }}>
      <Navbar />

      <main style={{ paddingTop: 96, paddingBottom: 80 }}>

        {/* ── HEADER ── */}
        <header style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 32px" }}>
          {/* Breadcrumb */}
          <div style={{ fontSize: 12, color: "#5a5466", marginBottom: 12 }}>
            <Link href="/" style={{ color: "#5a5466", textDecoration: "none" }}>Home</Link>
            {" / "}
            <span style={{ color: "#8a8591" }}>Find a Specialist</span>
          </div>

          <h1 style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            fontSize: "clamp(28px, 4vw, 42px)", color: "#f0ece4",
            lineHeight: 1.15, margin: "0 0 8px",
          }}>
            {selectedCategories.length > 0
              ? `${selectedCategories.join(" & ")} Specialists`
              : "Find the right specialist"}
          </h1>
          <p style={{ fontSize: 14, color: "#8a8591", lineHeight: 1.6 }}>
            {selectedCity !== "All"
              ? `Showing verified specialists ${selectedMode === "online" ? "online" : `in ${selectedCity}`} — all background-checked.`
              : "All specialists are verified and background-checked."}
          </p>
        </header>

        {/* ── SEARCH BAR ── */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 16px" }}>
          <div style={{
            display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center",
            background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.1)",
            borderRadius: 16, padding: "10px 16px",
          }}>

            {/* Search input */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, flex: "3 1 220px", minWidth: 0 }}>
              <Search style={{ width: 15, height: 15, color: "#6b6475", flexShrink: 0 }} />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, specialty, concern…"
                style={{
                  flex: 1, background: "transparent", border: "none", outline: "none",
                  fontSize: 13, color: "#e8e2d8", fontFamily: "inherit", minWidth: 0,
                }}
                aria-label="Search specialists"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} style={{ background: "none", border: "none", cursor: "pointer", color: "#5a5466", padding: 2 }}>
                  <X style={{ width: 12, height: 12 }} />
                </button>
              )}
            </div>

            <div style={{ width: "0.5px", height: 20, background: "rgba(255,255,255,0.08)", flexShrink: 0 }} />

            {/* City selector */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, flex: "1 1 130px" }}>
              <MapPin style={{ width: 13, height: 13, color: "#8b7ff0", flexShrink: 0 }} />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                style={{
                  background: "transparent", border: "none", outline: "none",
                  fontSize: 13, color: selectedCity !== "All" ? "#c5b8f8" : "#8a8591",
                  fontFamily: "inherit", cursor: "pointer", minWidth: 0, flex: 1,
                }}
                aria-label="Filter by city"
              >
                <option value="All">All Locations</option>
                {CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div style={{ width: "0.5px", height: 20, background: "rgba(255,255,255,0.08)", flexShrink: 0 }} />

            {/* Mode toggle */}
            <div style={{ display: "flex", gap: 4 }}>
              {(["all", "online", "offline"] as const).map((m) => (
                <button key={m}
                  onClick={() => setSelectedMode(m)}
                  style={{
                    padding: "5px 12px", borderRadius: 100, fontSize: 11, fontWeight: 600,
                    background: selectedMode === m ? "rgba(139,127,240,0.15)" : "transparent",
                    border: selectedMode === m ? "0.5px solid rgba(139,127,240,0.4)" : "0.5px solid rgba(255,255,255,0.06)",
                    color: selectedMode === m ? "#c5b8f8" : "#5a5466",
                    cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
                    display: "flex", alignItems: "center", gap: 4,
                  }}
                >
                  {m === "online" && <Video style={{ width: 10, height: 10 }} />}
                  {m === "offline" && <MapPin style={{ width: 10, height: 10 }} />}
                  {m === "all" ? "All" : m === "online" ? "Online" : "In-Person"}
                </button>
              ))}
            </div>

            <div style={{ width: "0.5px", height: 20, background: "rgba(255,255,255,0.08)", flexShrink: 0 }} />

            {/* Filters toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              style={{
                display: "flex", alignItems: "center", gap: 6, padding: "7px 14px",
                borderRadius: 100, fontSize: 12, fontWeight: 600,
                background: showFilters ? "rgba(139,127,240,0.12)" : "rgba(255,255,255,0.04)",
                border: showFilters ? "0.5px solid rgba(139,127,240,0.4)" : "0.5px solid rgba(255,255,255,0.1)",
                color: showFilters ? "#c5b8f8" : "#8a8591",
                cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
              }}
            >
              <SlidersHorizontal style={{ width: 12, height: 12 }} />
              Filters
              {hasFilters && (
                <span style={{ width: 16, height: 16, borderRadius: "50%", background: "#8b7ff0", color: "#fff", fontSize: 9, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {activeTags.length}
                </span>
              )}
            </button>
          </div>

          {/* ── ACTIVE FILTER TAGS (always visible) ── */}
          {activeTags.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8, marginTop: 12 }}>
              <span style={{ fontSize: 11, color: "#5a5466", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>Active:</span>
              {activeTags.map((tag) => (
                <span key={tag.id} style={{
                  display: "inline-flex", alignItems: "center", gap: 6,
                  padding: "4px 12px", borderRadius: 100, fontSize: 12, fontWeight: 600,
                  background: "rgba(139,127,240,0.1)", border: "0.5px solid rgba(139,127,240,0.3)",
                  color: "#c5b8f8",
                }}>
                  {tag.label}
                  <button onClick={tag.onRemove} style={{ background: "none", border: "none", cursor: "pointer", color: "#8b7ff0", padding: 0, display: "flex", lineHeight: 1 }}>
                    <X style={{ width: 10, height: 10 }} />
                  </button>
                </span>
              ))}
              <button onClick={clearFilters} style={{ fontSize: 11, color: "#5a5466", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit", textDecoration: "underline" }}>
                Clear all
              </button>
            </div>
          )}

          {/* ── EXPANDED FILTERS ── */}
          {showFilters && (
            <div style={{
              background: "rgba(26,28,46,0.95)", border: "0.5px solid rgba(255,255,255,0.1)",
              borderRadius: 16, padding: 24, marginTop: 10,
              boxShadow: "0 24px 48px rgba(0,0,0,0.4)",
            }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 24 }}>

                {/* Service Type */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#5a5466", marginBottom: 10 }}>Service Type</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {TOP_LEVEL_FILTERS.filter((f) => f !== "All").map((cat) => (
                      <button key={cat} onClick={() => toggleCategory(cat)}
                        style={{
                          padding: "6px 12px", borderRadius: 100, fontSize: 11, fontWeight: 600, cursor: "pointer",
                          background: selectedCategories.includes(cat) ? "rgba(139,127,240,0.15)" : "rgba(255,255,255,0.04)",
                          border: selectedCategories.includes(cat) ? "0.5px solid rgba(139,127,240,0.4)" : "0.5px solid rgba(255,255,255,0.08)",
                          color: selectedCategories.includes(cat) ? "#c5b8f8" : "#8a8591",
                          fontFamily: "inherit", transition: "all 0.15s",
                        }}
                      >{cat}</button>
                    ))}
                  </div>
                </div>

                {/* Age Group */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#5a5466", marginBottom: 10 }}>Age Group</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {AGE_GROUPS.map((age) => (
                      <button key={age} onClick={() => toggleAgeGroup(age)}
                        style={{
                          padding: "6px 12px", borderRadius: 100, fontSize: 11, fontWeight: 600, cursor: "pointer",
                          background: selectedAgeGroups.includes(age) ? "rgba(29,158,117,0.15)" : "rgba(255,255,255,0.04)",
                          border: selectedAgeGroups.includes(age) ? "0.5px solid rgba(29,158,117,0.4)" : "0.5px solid rgba(255,255,255,0.08)",
                          color: selectedAgeGroups.includes(age) ? "#5DCAA5" : "#8a8591",
                          fontFamily: "inherit", transition: "all 0.15s",
                        }}
                      >{age}</button>
                    ))}
                  </div>
                </div>

                {/* Subjects / Sub-modules */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#5a5466", marginBottom: 10 }}>Specializations</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                    {Array.from(new Set(
                      SERVICE_GROUPS
                        .filter((g) => selectedCategories.includes(g.name) || selectedCategories.length === 0)
                        .flatMap((g) => g.services)
                        .map((s) => s === "OT" ? "Occupational Therapy" : s)
                    )).slice(0, 20).map((sm) => (
                      <button key={sm} onClick={() => toggleSubModule(sm)}
                        style={{
                          padding: "6px 12px", borderRadius: 100, fontSize: 11, fontWeight: 600, cursor: "pointer",
                          background: selectedSubModules.includes(sm) ? "rgba(24,95,165,0.15)" : "rgba(255,255,255,0.04)",
                          border: selectedSubModules.includes(sm) ? "0.5px solid rgba(24,95,165,0.4)" : "0.5px solid rgba(255,255,255,0.08)",
                          color: selectedSubModules.includes(sm) ? "#85B7EB" : "#8a8591",
                          fontFamily: "inherit", transition: "all 0.15s",
                        }}
                      >{sm}</button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── RESULTS ── */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>

          {loading ? (
            // ── Loading skeletons ──
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} style={{ height: 280, borderRadius: 18, background: "rgba(255,255,255,0.03)", animation: "pulse 1.5s ease-in-out infinite" }} />
              ))}
            </div>
          ) : (
            <>
              {/* Results count */}
              {providers.length > 0 && (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                  <p style={{ fontSize: 13, color: "#8a8591" }}>
                    <span style={{ fontWeight: 700, color: "#f0ece4" }}>{providers.length}</span> specialists found
                    {selectedCity !== "All" && <span style={{ color: "#8b7ff0" }}> in {selectedCity}</span>}
                  </p>
                  {/* Sort (UI only for now) */}
                  <select style={{
                    background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.08)",
                    borderRadius: 8, padding: "6px 12px", fontSize: 12, color: "#8a8591",
                    fontFamily: "inherit", cursor: "pointer", outline: "none",
                  }}>
                    <option>Best match</option>
                    <option>Highest rated</option>
                    <option>Most reviews</option>
                  </select>
                </div>
              )}

              {/* Results grid */}
              {providers.length > 0 && (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16, marginBottom: 40 }}>
                  {providers.map((provider) => (
                    <ProviderCard key={provider.id} provider={provider} />
                  ))}
                </div>
              )}

              {/* ─── ZERO RESULTS + ONLINE FALLBACK ─── */}
              {providers.length === 0 && (
                <div style={{ padding: "48px 24px", textAlign: "center" }}>
                  <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                    <Search style={{ width: 22, height: 22, color: "#5a5466" }} />
                  </div>
                  <h3 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 22, color: "#f0ece4", marginBottom: 8 }}>
                    {selectedCity !== "All"
                      ? `No in-person specialists found in ${selectedCity}`
                      : "No specialists match these filters"}
                  </h3>
                  <p style={{ fontSize: 14, color: "#8a8591", maxWidth: 400, margin: "0 auto 24px", lineHeight: 1.65 }}>
                    {selectedCity !== "All"
                      ? `We don't have in-person specialists in ${selectedCity} yet — but many of our experts offer equally effective online sessions.`
                      : "Try adjusting your filters or broaden your search to find the right match."}
                  </p>
                  <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
                    <button onClick={clearFilters} style={{
                      padding: "10px 24px", borderRadius: 100, fontSize: 13, fontWeight: 700,
                      background: "rgba(255,255,255,0.06)", border: "0.5px solid rgba(255,255,255,0.12)",
                      color: "#e8e2d8", cursor: "pointer", fontFamily: "inherit",
                    }}>Clear filters</button>
                    {selectedCity !== "All" && (
                      <button onClick={() => { setSelectedCity("All"); setSelectedMode("online"); }} style={{
                        padding: "10px 24px", borderRadius: 100, fontSize: 13, fontWeight: 700,
                        background: "rgba(139,127,240,0.12)", border: "0.5px solid rgba(139,127,240,0.4)",
                        color: "#c5b8f8", cursor: "pointer", fontFamily: "inherit",
                        display: "flex", alignItems: "center", gap: 6,
                      }}>
                        <Video style={{ width: 13, height: 13 }} /> Show online specialists
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* ─── ONLINE FALLBACK SECTION (when city returned 0) ─── */}
              {providers.length === 0 && onlineProviders.length > 0 && (
                <div style={{ marginTop: 48 }}>
                  <div style={{
                    background: "rgba(139,127,240,0.06)", border: "0.5px solid rgba(139,127,240,0.2)",
                    borderRadius: 16, padding: "20px 24px", marginBottom: 24,
                    display: "flex", alignItems: "flex-start", gap: 14,
                  }}>
                    <Globe style={{ width: 20, height: 20, color: "#8b7ff0", flexShrink: 0, marginTop: 2 }} />
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#c5b8f8", marginBottom: 4 }}>
                        Can't find someone in {selectedCity}? These specialists are available online
                      </div>
                      <p style={{ fontSize: 13, color: "#8a8591", lineHeight: 1.6 }}>
                        Research shows online therapy is equally effective for most conditions. These {onlineProviders.length} verified experts offer sessions via video — same quality, more flexibility.
                      </p>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: 16 }}>
                    {onlineProviders.map((provider) => (
                      <ProviderCard key={provider.id} provider={provider} />
                    ))}
                  </div>
                </div>
              )}

              {/* Not sure CTA */}
              {(providers.length > 0 || onlineProviders.length > 0) && (
                <div style={{
                  marginTop: 40, padding: "24px 28px", borderRadius: 16, textAlign: "center",
                  background: "rgba(255,255,255,0.025)", border: "0.5px solid rgba(255,255,255,0.06)",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 16, flexWrap: "wrap",
                }}>
                  <div>
                    <p style={{ fontSize: 13, color: "#8a8591", marginBottom: 4 }}>Not sure who to choose?</p>
                    <p style={{ fontSize: 12, color: "#5a5466" }}>Answer 3 questions and we'll match you with the right specialist.</p>
                  </div>
                  <Link href="/triage" style={{
                    display: "inline-flex", alignItems: "center", gap: 6,
                    padding: "10px 22px", borderRadius: 100, fontSize: 13, fontWeight: 700,
                    background: "rgba(239,159,39,0.1)", border: "0.5px solid rgba(239,159,39,0.3)",
                    color: "#EF9F27", textDecoration: "none",
                  }}>
                    <HelpCircle style={{ width: 13, height: 13 }} /> Get guided →
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      <Footer />

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
