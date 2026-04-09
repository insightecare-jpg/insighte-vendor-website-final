"use client";

import React, { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play, Quote, X } from "lucide-react";

interface Testimonial {
  id: string;
  type: "text" | "video";
  author: string;
  role: string;
  org: string;
  content: string;
  thumbnail?: string;
  videoUrl?: string;
  accentColor?: string;
  accentBg?: string;
  initials?: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    type: "text",
    author: "Deepak Sharma",
    role: "Parent",
    org: "Indiranagar, Bangalore",
    content:
      "We were overwhelmed and didn't know where to start. Insighte helped us find the right therapist in one day. Our son's speech has improved dramatically in just 3 months.",
    accentColor: "#c5b8f8",
    accentBg: "rgba(139,127,240,0.12)",
    initials: "DS",
  },
  {
    id: "t2",
    type: "video",
    author: "Anjali Rao",
    role: "Mother of Two",
    org: "The Valley School",
    content: "Hear how Anjali found the right support for her child's learning journey.",
    thumbnail:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=1200&auto=format&fit=crop",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    accentColor: "#85B7EB",
    accentBg: "rgba(24,95,165,0.12)",
    initials: "AR",
  },
  {
    id: "t3",
    type: "text",
    author: "Dr. Kavita Menon",
    role: "Pediatrician",
    org: "Bangalore Children's Clinic",
    content:
      "As a pediatrician, I recommend Insighte to families because every specialist is verified and uses evidence-based methods. It's the platform our city needed.",
    accentColor: "#5DCAA5",
    accentBg: "rgba(29,158,117,0.12)",
    initials: "KM",
  },
  {
    id: "t4",
    type: "video",
    author: "Rohan Varma",
    role: "Father",
    org: "Inventure Academy",
    content: "Rohan shares how easy it was to book the right therapist and the impact on his family.",
    thumbnail:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1200&auto=format&fit=crop",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    accentColor: "#F0997B",
    accentBg: "rgba(216,90,48,0.12)",
    initials: "RV",
  },
  {
    id: "t5",
    type: "text",
    author: "Priyanka Nair",
    role: "Parent",
    org: "HSR Layout, Bangalore",
    content:
      "I was scared about starting therapy for my daughter. Insighte matched us with a specialist who understood her exactly. She now looks forward to every session.",
    accentColor: "#EF9F27",
    accentBg: "rgba(239,159,39,0.12)",
    initials: "PN",
  },
];

export function TestimonialsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeVideo, setActiveVideo] = useState<string | null>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const scrollTo =
        direction === "left"
          ? scrollLeft - clientWidth / 2
          : scrollLeft + clientWidth / 2;
      scrollRef.current.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  };

  return (
    <section
      style={{
        padding: "64px 24px 80px",
        background: "#0d0f1a",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -60%)",
          width: 700,
          height: 500,
          background:
            "radial-gradient(ellipse, rgba(139,127,240,0.06) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <div
          className="flex items-end justify-between flex-wrap gap-5"
          style={{ marginBottom: 40 }}
        >
          <div>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#6b6475",
                marginBottom: 10,
              }}
            >
              <span
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: "#6b6475",
                  display: "inline-block",
                }}
              />
              Real Stories
            </div>
            <h2
              style={{
                fontFamily: "'DM Serif Display', Georgia, serif",
                fontSize: "clamp(26px, 3.5vw, 38px)",
                color: "#f0ece4",
                lineHeight: 1.15,
                margin: 0,
              }}
            >
              Parents like you found
              <br />
              the right support
            </h2>
            <p
              style={{
                fontSize: 15,
                color: "#9a94a3",
                marginTop: 8,
                lineHeight: 1.65,
                maxWidth: 400,
              }}
            >
              Real families. Real impact. Not marketing copy.
            </p>
          </div>

          {/* Scroll buttons */}
          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#a09aaa",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.background = "rgba(255,255,255,0.08)";
                el.style.color = "#f0ece4";
              }}
              onMouseOut={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.background = "rgba(255,255,255,0.04)";
                el.style.color = "#a09aaa";
              }}
            >
              <ChevronLeft style={{ width: 18, height: 18 }} />
            </button>
            <button
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              style={{
                width: 44,
                height: 44,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#a09aaa",
                transition: "all 0.2s",
              }}
              onMouseOver={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.background = "rgba(255,255,255,0.08)";
                el.style.color = "#f0ece4";
              }}
              onMouseOut={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.background = "rgba(255,255,255,0.04)";
                el.style.color = "#a09aaa";
              }}
            >
              <ChevronRight style={{ width: 18, height: 18 }} />
            </button>
          </div>
        </div>

        {/* Scrollable cards */}
        <div
          ref={scrollRef}
          style={{
            display: "flex",
            gap: 16,
            overflowX: "auto",
            scrollSnapType: "x mandatory",
            paddingBottom: 12,
            scrollbarWidth: "none",
            // hide scrollbar
            msOverflowStyle: "none",
          }}
        >
          {TESTIMONIALS.map((t) => (
            <div
              key={t.id}
              style={{
                minWidth: 340,
                maxWidth: 380,
                flexShrink: 0,
                scrollSnapAlign: "start",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 20,
                position: "relative",
                overflow: "hidden",
                transition: "all 0.25s",
                display: "flex",
                flexDirection: "column",
              }}
              onMouseOver={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = "rgba(255,255,255,0.14)";
                el.style.background = "rgba(255,255,255,0.055)";
                el.style.transform = "translateY(-2px)";
              }}
              onMouseOut={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = "rgba(255,255,255,0.08)";
                el.style.background = "rgba(255,255,255,0.04)";
                el.style.transform = "translateY(0)";
              }}
            >
              {t.type === "text" ? (
                // ─── TEXT CARD ───────────────────────────────────────────────
                <div style={{ padding: "24px 24px 22px", display: "flex", flexDirection: "column", height: "100%", minHeight: 280 }}>
                  {/* Quote icon */}
                  <Quote
                    style={{
                      width: 28,
                      height: 28,
                      color: t.accentColor,
                      opacity: 0.4,
                      marginBottom: 16,
                      flexShrink: 0,
                    }}
                  />

                  {/* Quote text */}
                  <p
                    style={{
                      fontSize: 15,
                      color: "#ddd8e6",
                      lineHeight: 1.7,
                      fontWeight: 400,
                      flex: 1,
                      margin: 0,
                    }}
                  >
                    &ldquo;{t.content}&rdquo;
                  </p>

                  {/* Author */}
                  <div
                    style={{
                      marginTop: 20,
                      paddingTop: 16,
                      borderTop: "0.5px solid rgba(255,255,255,0.07)",
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                    }}
                  >
                    {/* Avatar */}
                    <div
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: "50%",
                        background: t.accentBg,
                        border: `1px solid ${t.accentColor}35`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 13,
                        fontWeight: 700,
                        color: t.accentColor,
                        fontFamily: "'DM Serif Display', Georgia, serif",
                        flexShrink: 0,
                      }}
                    >
                      {t.initials}
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#f0ece4", lineHeight: 1.3 }}>
                        {t.author}
                      </div>
                      <div style={{ fontSize: 12, color: "#6b6475", marginTop: 2 }}>
                        {t.role} · {t.org}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                // ─── VIDEO CARD ──────────────────────────────────────────────
                <div style={{ position: "relative", minHeight: 280, display: "flex", flexDirection: "column" }}>
                  {/* Background image */}
                  <div style={{ position: "absolute", inset: 0 }}>
                    <img
                      src={t.thumbnail}
                      alt={t.author}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        opacity: 0.45,
                        filter: "grayscale(0.2)",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(to top, #0d0f1a 30%, rgba(13,15,26,0.3) 70%, rgba(13,15,26,0.1) 100%)",
                      }}
                    />
                  </div>

                  {/* Content */}
                  <div
                    style={{
                      position: "relative",
                      zIndex: 2,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      padding: "18px 20px 20px",
                      flex: 1,
                      minHeight: 280,
                    }}
                  >
                    {/* Video badge */}
                    <div
                      style={{
                        alignSelf: "flex-start",
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "#0d0f1a",
                        background: "#e8e2d8",
                        borderRadius: 100,
                        padding: "3px 10px",
                      }}
                    >
                      Video Story
                    </div>

                    {/* Play button */}
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flex: 1 }}>
                      <button
                        onClick={() => setActiveVideo(t.videoUrl || null)}
                        aria-label="Play video"
                        style={{
                          width: 64,
                          height: 64,
                          borderRadius: "50%",
                          background: "rgba(232,226,216,0.95)",
                          backdropFilter: "blur(8px)",
                          border: "none",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          transition: "transform 0.2s, box-shadow 0.2s",
                          boxShadow: "0 8px 32px rgba(232,226,216,0.25)",
                        }}
                        onMouseOver={(e) => {
                          const el = e.currentTarget as HTMLButtonElement;
                          el.style.transform = "scale(1.1)";
                          el.style.boxShadow = "0 12px 40px rgba(232,226,216,0.4)";
                        }}
                        onMouseOut={(e) => {
                          const el = e.currentTarget as HTMLButtonElement;
                          el.style.transform = "scale(1)";
                          el.style.boxShadow = "0 8px 32px rgba(232,226,216,0.25)";
                        }}
                      >
                        <Play style={{ width: 22, height: 22, fill: "#0d0f1a", color: "#0d0f1a", marginLeft: 3 }} />
                      </button>
                    </div>

                    {/* Author */}
                    <div>
                      <div style={{ fontSize: 15, fontWeight: 700, color: "#f0ece4", lineHeight: 1.3 }}>
                        Watch {t.author.split(" ")[0]}&rsquo;s story
                      </div>
                      <div style={{ fontSize: 12, color: "#8a8591", marginTop: 4 }}>
                        {t.role} · {t.org}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal */}
      {activeVideo && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 24,
            background: "rgba(13,15,26,0.96)",
            backdropFilter: "blur(24px)",
          }}
        >
          <button
            style={{
              position: "absolute",
              top: 28,
              right: 28,
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: "#e8e2d8",
            }}
            onClick={() => setActiveVideo(null)}
            aria-label="Close video"
          >
            <X style={{ width: 20, height: 20 }} />
          </button>
          <div
            style={{
              width: "100%",
              maxWidth: 900,
              aspectRatio: "16/9",
              borderRadius: 20,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
            }}
          >
            <iframe
              src={activeVideo}
              style={{ width: "100%", height: "100%", border: "none" }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      )}
    </section>
  );
}
