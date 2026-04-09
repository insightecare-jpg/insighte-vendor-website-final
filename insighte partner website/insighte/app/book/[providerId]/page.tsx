"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, ArrowRight, Check, Calendar, Clock,
  MapPin, Video, Users, User, Star, ShieldCheck,
  ChevronLeft, ChevronRight, CreditCard, Sparkles,
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";

// ─── SESSION TYPES ────────────────────────────────────────────────────────────
const SESSION_TYPES = [
  { id: "home", icon: "🏠", label: "Home Session", desc: "Specialist visits your home", duration: "60 min", price: "₹1,800", badge: "Most popular", badgeColor: "#EF9F27" },
  { id: "online", icon: "💻", label: "Online Session", desc: "Video call from anywhere", duration: "45 min", price: "₹1,200", badge: "Flexible", badgeColor: "#5DCAA5" },
  { id: "group", icon: "👥", label: "Group Session", desc: "2–4 children, shared session", duration: "60 min", price: "₹600", badge: "Affordable", badgeColor: "#85B7EB" },
  { id: "oneonone", icon: "🎯", label: "1:1 Call", desc: "Focused one-on-one call", duration: "30 min", price: "₹800", badge: null, badgeColor: null },
  { id: "assessment", icon: "📋", label: "Assessment", desc: "Full diagnostic evaluation", duration: "90 min", price: "₹3,500", badge: "Thorough", badgeColor: "#c5b8f8" },
  { id: "trial", icon: "✨", label: "Trial Session", desc: "First time? Try a short intro", duration: "20 min", price: "₹299", badge: "Free for new", badgeColor: "#97C459" },
  { id: "package", icon: "📦", label: "Package (8 sessions)", desc: "Commit for better outcomes", duration: "60 min × 8", price: "₹10,000", badge: "Best value", badgeColor: "#EF9F27" },
  { id: "training", icon: "🎓", label: "Training/Workshop", desc: "Parent or school training", duration: "2 hrs", price: "₹2,500", badge: null, badgeColor: null },
];

// ─── MOCK PROVIDER ────────────────────────────────────────────────────────────
const MOCK_PROVIDERS: Record<string, any> = {
  "priya-sharma": { name: "Dr. Priya Sharma", role: "Autism Specialist", rating: "4.9", reviews: 124, city: "Bangalore", accentColor: "#c5b8f8", accentBg: "rgba(139,127,240,0.18)" },
  "rahul-iyer": { name: "Mr. Rahul Iyer", role: "Speech Therapist", rating: "4.8", reviews: 98, city: "Mumbai", accentColor: "#85B7EB", accentBg: "rgba(24,95,165,0.18)" },
  "ananya-kapoor": { name: "Dr. Ananya Kapoor", role: "Behavioral Specialist", rating: "4.9", reviews: 87, city: "Delhi", accentColor: "#F0997B", accentBg: "rgba(216,90,48,0.18)" },
  "shanti-devi": { name: "Mrs. Shanti Devi", role: "Special Educator", rating: "5.0", reviews: 61, city: "Bangalore", accentColor: "#5DCAA5", accentBg: "rgba(29,158,117,0.18)" },
};

function getDefaultProvider(id: string) {
  return MOCK_PROVIDERS[id] ?? { name: "Specialist", role: "Expert", rating: "4.9", reviews: 0, city: "Bangalore", accentColor: "#c5b8f8", accentBg: "rgba(139,127,240,0.18)" };
}

// ─── CALENDAR HELPERS ──────────────────────────────────────────────────────────
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const TIME_SLOTS = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"];
const UNAVAILABLE = new Set([1, 3, 8, 12]); // simulated unavailable

function getCalendarWeek(baseDate: Date) {
  const today = new Date(baseDate);
  const day = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - day + 1);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
}

// ─── COMPONENT ────────────────────────────────────────────────────────────────
export default function BookingPage() {
  const params = useParams();
  const router = useRouter();
  const providerId = (params?.providerId as string) ?? "priya-sharma";
  const provider = getDefaultProvider(providerId);

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedService, setSelectedService] = useState<typeof SESSION_TYPES[0] | null>(null);
  const [weekOffset, setWeekOffset] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const baseDate = new Date();
  baseDate.setDate(baseDate.getDate() + weekOffset * 7);
  const week = getCalendarWeek(baseDate);

  const handlePay = async () => {
    setPaying(true);
    await new Promise((r) => setTimeout(r, 1800));
    setPaid(true);
    setPaying(false);
    setTimeout(() => router.push("/login?redirect=/parent/dashboard&session=new"), 2000);
  };

  if (!mounted) return null;

  // Determine if in desktop 3-col layout
  const isDesktop = typeof window !== "undefined" && window.innerWidth >= 1024;

  return (
    <div style={{ minHeight: "100vh", background: "#0d0f1a", color: "#e8e2d8", fontFamily: "'DM Sans', 'Inter', sans-serif" }}>
      <Navbar />

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "100px 24px 80px" }}>

        {/* Header */}
        <div style={{ marginBottom: 40 }}>
          <Link href={`/providers/${providerId}`} style={{ display: "inline-flex", alignItems: "center", gap: 6, fontSize: 13, color: "#5a5466", textDecoration: "none", marginBottom: 20, transition: "color 0.15s" }}
            onMouseOver={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#c5b8f8")}
            onMouseOut={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "#5a5466")}
          >
            <ArrowLeft style={{ width: 14, height: 14 }} /> Back to profile
          </Link>

          {/* Provider mini-card */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 32 }}>
            <div style={{ width: 52, height: 52, borderRadius: "50%", background: provider.accentBg, border: `1.5px solid ${provider.accentColor}40`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontFamily: "'DM Serif Display', Georgia, serif", color: provider.accentColor, fontWeight: 700 }}>
              {provider.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "#f0ece4" }}>{provider.name}</div>
              <div style={{ fontSize: 13, color: "#8a8591" }}>{provider.role}</div>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5, fontSize: 14, color: "#f0ece4", fontWeight: 700 }}>
              <Star style={{ width: 13, height: 13, fill: "#EF9F27", color: "#EF9F27" }} />
              {provider.rating}
              <span style={{ fontSize: 12, color: "#6b6475", fontWeight: 400 }}>({provider.reviews})</span>
            </div>
          </div>

          {/* Step indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 40 }}>
            {(["Pick Service", "Choose Time", "Review & Pay"] as const).map((label, i) => {
              const stepNum = (i + 1) as 1 | 2 | 3;
              const active = step === stepNum;
              const done = step > stepNum;
              return (
                <React.Fragment key={label}>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                      background: done ? "#5DCAA5" : active ? "#8b7ff0" : "rgba(255,255,255,0.06)",
                      border: done ? "none" : active ? "none" : "0.5px solid rgba(255,255,255,0.1)",
                      fontSize: 13, fontWeight: 700, color: done || active ? "#fff" : "#5a5466",
                      transition: "all 0.3s",
                    }}>
                      {done ? <Check style={{ width: 14, height: 14 }} /> : stepNum}
                    </div>
                    <div style={{ fontSize: 11, fontWeight: 600, color: active ? "#c5b8f8" : done ? "#5DCAA5" : "#5a5466", whiteSpace: "nowrap" }}>{label}</div>
                  </div>
                  {i < 2 && <div style={{ flex: 1, height: "0.5px", background: done ? "#5DCAA5" : "rgba(255,255,255,0.08)", marginBottom: 22, transition: "background 0.4s" }} />}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* ─── 3-Column Layout (desktop) ─── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 16, alignItems: "start" }}>

          {/* ── STEP 1: SERVICE PICKER ── */}
          <div style={{
            background: step === 1 ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
            border: step === 1 ? "0.5px solid rgba(255,255,255,0.14)" : "0.5px solid rgba(255,255,255,0.06)",
            borderRadius: 20, padding: 24, transition: "all 0.3s",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: step >= 1 ? "#8b7ff0" : "#3a3544" }} />
              <div style={{ fontSize: 13, fontWeight: 700, color: step >= 1 ? "#c5b8f8" : "#5a5466", letterSpacing: "0.05em", textTransform: "uppercase" }}>Pick a Service</div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {SESSION_TYPES.map((svc) => (
                <button key={svc.id}
                  onClick={() => { setSelectedService(svc); if (step === 1) setStep(2); }}
                  style={{
                    background: selectedService?.id === svc.id ? "rgba(139,127,240,0.1)" : "rgba(255,255,255,0.03)",
                    border: selectedService?.id === svc.id ? "0.5px solid rgba(139,127,240,0.4)" : "0.5px solid rgba(255,255,255,0.07)",
                    borderRadius: 12, padding: "12px 14px", cursor: "pointer",
                    fontFamily: "inherit", transition: "all 0.2s", textAlign: "left",
                    display: "flex", alignItems: "center", gap: 12,
                  }}
                  onMouseOver={(e) => {
                    if (selectedService?.id !== svc.id) {
                      (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)";
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.12)";
                    }
                  }}
                  onMouseOut={(e) => {
                    if (selectedService?.id !== svc.id) {
                      (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.03)";
                      (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.07)";
                    }
                  }}
                >
                  <span style={{ fontSize: 22, flexShrink: 0 }}>{svc.icon}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#e0daea" }}>{svc.label}</span>
                      {svc.badge && (
                        <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 100, background: `${svc.badgeColor}20`, color: svc.badgeColor!, border: `0.5px solid ${svc.badgeColor}40`, fontWeight: 700 }}>{svc.badge}</span>
                      )}
                    </div>
                    <div style={{ fontSize: 11, color: "#5a5466", marginTop: 2 }}>{svc.desc} · {svc.duration}</div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: selectedService?.id === svc.id ? "#c5b8f8" : "#8a8591", flexShrink: 0 }}>{svc.price}</div>
                  {selectedService?.id === svc.id && <Check style={{ width: 14, height: 14, color: "#8b7ff0", flexShrink: 0 }} />}
                </button>
              ))}
            </div>
          </div>

          {/* ── STEP 2: CALENDAR + TIME PICKER ── */}
          <div style={{
            background: step >= 2 ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.015)",
            border: step === 2 ? "0.5px solid rgba(255,255,255,0.14)" : "0.5px solid rgba(255,255,255,0.05)",
            borderRadius: 20, padding: 24, transition: "all 0.3s",
            opacity: step < 2 ? 0.5 : 1, pointerEvents: step < 2 ? "none" : "auto",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: step >= 2 ? "#8b7ff0" : "#3a3544" }} />
              <div style={{ fontSize: 13, fontWeight: 700, color: step >= 2 ? "#c5b8f8" : "#5a5466", letterSpacing: "0.05em", textTransform: "uppercase" }}>Choose a Time</div>
            </div>

            {/* Week navigation */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <button onClick={() => setWeekOffset((w) => Math.max(w - 1, 0))} style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "6px 10px", cursor: "pointer", color: "#8a8591" }}>
                <ChevronLeft style={{ width: 14, height: 14 }} />
              </button>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#c8c2d0" }}>
                {week[0].toLocaleDateString("en-IN", { day: "numeric", month: "short" })} – {week[6].toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </div>
              <button onClick={() => setWeekOffset((w) => w + 1)} style={{ background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 8, padding: "6px 10px", cursor: "pointer", color: "#8a8591" }}>
                <ChevronRight style={{ width: 14, height: 14 }} />
              </button>
            </div>

            {/* Day grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 6, marginBottom: 20 }}>
              {week.map((date, i) => {
                const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
                const isToday = date.toDateString() === new Date().toDateString();
                const isSelected = selectedDate?.toDateString() === date.toDateString();
                return (
                  <button key={i}
                    disabled={isPast}
                    onClick={() => { setSelectedDate(date); setSelectedTime(null); }}
                    style={{
                      borderRadius: 10, padding: "8px 4px", cursor: isPast ? "not-allowed" : "pointer",
                      background: isSelected ? "#8b7ff0" : isToday ? "rgba(139,127,240,0.12)" : "rgba(255,255,255,0.03)",
                      border: isSelected ? "none" : isToday ? "0.5px solid rgba(139,127,240,0.3)" : "0.5px solid rgba(255,255,255,0.06)",
                      opacity: isPast ? 0.3 : 1, fontFamily: "inherit",
                      display: "flex", flexDirection: "column", alignItems: "center", gap: 2,
                    }}
                  >
                    <span style={{ fontSize: 9, fontWeight: 600, textTransform: "uppercase", color: isSelected ? "rgba(255,255,255,0.7)" : "#5a5466" }}>{DAYS[date.getDay()]}</span>
                    <span style={{ fontSize: 14, fontWeight: 700, color: isSelected ? "#fff" : isToday ? "#c5b8f8" : "#c8c2d0" }}>{date.getDate()}</span>
                  </button>
                );
              })}
            </div>

            {/* Time slots */}
            {selectedDate && (
              <>
                <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#5a5466", marginBottom: 10 }}>Available Times</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {TIME_SLOTS.map((time, i) => {
                    const unavail = UNAVAILABLE.has(i);
                    const isSelected = selectedTime === time;
                    return (
                      <button key={time}
                        disabled={unavail}
                        onClick={() => { setSelectedTime(time); setStep(3); }}
                        style={{
                          padding: "8px 14px", borderRadius: 100, fontSize: 12, fontWeight: 600,
                          background: isSelected ? "#8b7ff0" : unavail ? "rgba(255,255,255,0.02)" : "rgba(255,255,255,0.05)",
                          border: isSelected ? "none" : unavail ? "0.5px solid rgba(255,255,255,0.04)" : "0.5px solid rgba(255,255,255,0.1)",
                          color: isSelected ? "#fff" : unavail ? "#3a3544" : "#c8c2d0",
                          cursor: unavail ? "not-allowed" : "pointer", fontFamily: "inherit",
                          textDecoration: unavail ? "line-through" : "none",
                        }}
                      >{time}</button>
                    );
                  })}
                </div>
              </>
            )}
            {!selectedDate && (
              <div style={{ textAlign: "center", padding: "32px 0", color: "#5a5466", fontSize: 13 }}>
                <Calendar style={{ width: 24, height: 24, margin: "0 auto 8px", opacity: 0.3 }} />
                Select a date to see available slots
              </div>
            )}
          </div>

          {/* ── STEP 3: REVIEW + PAY ── */}
          <div style={{
            background: step >= 3 ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.015)",
            border: step === 3 ? "0.5px solid rgba(255,255,255,0.14)" : "0.5px solid rgba(255,255,255,0.05)",
            borderRadius: 20, padding: 24, transition: "all 0.3s",
            opacity: step < 3 ? 0.5 : 1, pointerEvents: step < 3 ? "none" : "auto",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: step >= 3 ? "#8b7ff0" : "#3a3544" }} />
              <div style={{ fontSize: 13, fontWeight: 700, color: step >= 3 ? "#c5b8f8" : "#5a5466", letterSpacing: "0.05em", textTransform: "uppercase" }}>Review & Pay</div>
            </div>

            {step >= 3 && selectedService && selectedDate && selectedTime && !paid && (
              <>
                {/* Summary */}
                <div style={{ background: "rgba(255,255,255,0.03)", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: 18, marginBottom: 20 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "#5a5466", marginBottom: 14 }}>Booking Summary</div>
                  {[
                    { label: "Specialist", value: provider.name },
                    { label: "Service", value: `${selectedService.icon} ${selectedService.label}` },
                    { label: "Duration", value: selectedService.duration },
                    { label: "Date", value: selectedDate.toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" }) },
                    { label: "Time", value: selectedTime },
                    { label: "Location", value: provider.city },
                  ].map(({ label, value }) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
                      <span style={{ fontSize: 12, color: "#5a5466", flexShrink: 0 }}>{label}</span>
                      <span style={{ fontSize: 13, color: "#e0daea", fontWeight: 600, textAlign: "right" }}>{value}</span>
                    </div>
                  ))}
                  <div style={{ height: "0.5px", background: "rgba(255,255,255,0.07)", margin: "12px 0" }} />
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 13, color: "#8a8591" }}>Total</span>
                    <span style={{ fontSize: 22, fontWeight: 800, color: "#f0ece4" }}>{selectedService.price}</span>
                  </div>
                </div>

                {/* Trust badges */}
                <div style={{ display: "flex", gap: 12, marginBottom: 20 }}>
                  {["🔒 Secure payment", "✓ Verified provider", "📅 Easy reschedule"].map((badge) => (
                    <span key={badge} style={{ fontSize: 11, color: "#5a5466", display: "flex", alignItems: "center", gap: 4 }}>{badge}</span>
                  ))}
                </div>

                {/* Pay button */}
                <button onClick={handlePay} disabled={paying}
                  style={{
                    width: "100%", padding: "14px 24px", borderRadius: 100,
                    background: paying ? "rgba(139,127,240,0.3)" : "#8b7ff0", border: "none",
                    color: "#fff", fontSize: 15, fontWeight: 700, cursor: paying ? "not-allowed" : "pointer",
                    fontFamily: "inherit", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    transition: "all 0.2s",
                  }}
                >
                  {paying ? (
                    <>
                      <span style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff", borderRadius: "50%", animation: "spin 0.8s linear infinite", display: "inline-block" }} />
                      Processing…
                    </>
                  ) : (
                    <>
                      <CreditCard style={{ width: 16, height: 16 }} />
                      Pay {selectedService.price}
                    </>
                  )}
                </button>

                <p style={{ textAlign: "center", fontSize: 11, color: "#5a5466", marginTop: 10 }}>
                  You'll be asked to log in / sign up after payment to access your dashboard.
                </p>
              </>
            )}

            {step < 3 && (
              <div style={{ textAlign: "center", padding: "32px 0", color: "#5a5466", fontSize: 13 }}>
                <Sparkles style={{ width: 24, height: 24, margin: "0 auto 8px", opacity: 0.3 }} />
                Complete the steps above to review your booking
              </div>
            )}

            {/* Payment success state */}
            {paid && (
              <div style={{ textAlign: "center", padding: "32px 16px" }}>
                <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(29,158,117,0.15)", border: "1px solid rgba(29,158,117,0.4)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <Check style={{ width: 28, height: 28, color: "#5DCAA5" }} />
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, color: "#f0ece4", marginBottom: 8 }}>Booking confirmed! 🎉</div>
                <div style={{ fontSize: 13, color: "#8a8591", lineHeight: 1.6 }}>
                  Redirecting you to your dashboard to view the details…
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
