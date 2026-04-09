"use client";

import React, { useState, useEffect, useRef } from "react";
import { MapPin, Navigation, X } from "lucide-react";
import { Zone, getUserZone, getCachedZone, setCachedZone, getPincodeZone, ZONES } from "@/lib/geo";

interface GeoSearchPillProps {
  onZoneChange?: (zone: Zone | null) => void;
}

export function GeoSearchPill({ onZoneChange }: GeoSearchPillProps) {
  const [zone, setZone] = useState<Zone | null>(null);
  const [status, setStatus] = useState<"idle" | "detecting" | "pincode" | "done">("idle");
  const [open, setOpen] = useState(false);
  const [pincode, setPincode] = useState("");
  const [pincodeError, setPincodeError] = useState("");
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cached = getCachedZone();
    if (cached) { setZone(cached); setStatus("done"); onZoneChange?.(cached); }
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleDetect = async () => {
    // Clear stale cache BEFORE detecting so we never show a cached city from a
    // previous session when the user is physically in a different location.
    try { localStorage.removeItem("insighte_geo_zone"); } catch {}
    setZone(null);
    setStatus("detecting");
    setOpen(false);
    const detected = await getUserZone();
    if (detected) {
      setZone(detected);
      setCachedZone(detected);
      setStatus("done");
      onZoneChange?.(detected);
    } else {
      setStatus("pincode");
      setOpen(true);
    }
  };

  const handlePincode = () => {
    setPincodeError("");
    const matched = getPincodeZone(pincode);
    if (matched) {
      setZone(matched);
      setCachedZone(matched);
      setStatus("done");
      setOpen(false);
      onZoneChange?.(matched);
    } else {
      setPincodeError("Pincode not found — try a nearby pincode or select city below.");
    }
  };

  const clearZone = () => {
    setZone(null);
    setStatus("idle");
    try { localStorage.removeItem("insighte_geo_zone"); } catch {}
    onZoneChange?.(null);
  };

  return (
    <div ref={popoverRef} style={{ position: "relative", flexShrink: 0 }}>
      {/* Pill trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 whitespace-nowrap"
        style={{
          fontFamily: "inherit", fontSize: "12px", fontWeight: 500,
          letterSpacing: "0.06em", color: zone ? "#c5b8f8" : "#8a8591",
          background: "transparent", border: "none", cursor: "pointer", padding: "0 8px",
          transition: "color 0.15s",
        }}
        aria-label="Select your location"
      >
        {status === "detecting" ? (
          <>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#EF9F27", display: "inline-block", animation: "pulse 1.2s ease-in-out infinite" }} />
            Detecting…
          </>
        ) : zone ? (
          <>
            <MapPin style={{ width: 12, height: 12, color: "#8b7ff0" }} />
            {zone.label}
          </>
        ) : (
          <>
            <MapPin style={{ width: 12, height: 12 }} />
            Location ▾
          </>
        )}
      </button>

      {/* Popover */}
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 12px)", right: 0,
          background: "#1a1c2e", border: "0.5px solid rgba(255,255,255,0.14)",
          borderRadius: 16, padding: 16, zIndex: 100, width: 260,
          boxShadow: "0 24px 48px rgba(0,0,0,0.4)",
        }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#5a5466", marginBottom: 12 }}>
            Your Location
          </div>

          {/* Use GPS */}
          <button onClick={handleDetect}
            className="flex items-center gap-2 w-full"
            style={{
              background: "rgba(139,127,240,0.1)", border: "0.5px solid rgba(139,127,240,0.25)",
              borderRadius: 10, padding: "10px 14px", cursor: "pointer", marginBottom: 12,
              fontFamily: "inherit", color: "#c5b8f8", fontSize: 13, fontWeight: 600, textAlign: "left",
            }}
          >
            <Navigation style={{ width: 14, height: 14 }} />
            Use my current location
          </button>

          {/* Pincode input */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: "#5a5466", marginBottom: 6 }}>Or enter pincode</div>
            <div className="flex gap-2">
              <input
                value={pincode} onChange={(e) => setPincode(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handlePincode(); }}
                placeholder="e.g. 560066"
                maxLength={6}
                style={{
                  flex: 1, background: "rgba(255,255,255,0.04)", border: "0.5px solid rgba(255,255,255,0.1)",
                  borderRadius: 8, padding: "8px 12px", color: "#e8e2d8", fontSize: 13,
                  fontFamily: "inherit", outline: "none",
                }}
              />
              <button onClick={handlePincode} style={{
                background: "#8b7ff0", border: "none", borderRadius: 8, padding: "8px 12px",
                color: "#fff", fontSize: 12, fontWeight: 700, cursor: "pointer", fontFamily: "inherit",
              }}>Go</button>
            </div>
            {pincodeError && <div style={{ fontSize: 11, color: "#F0997B", marginTop: 6, lineHeight: 1.5 }}>{pincodeError}</div>}
          </div>

          {/* Quick city picks */}
          <div style={{ fontSize: 11, color: "#5a5466", marginBottom: 8 }}>Quick select</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {ZONES.filter((z) => ["central-bangalore", "trivandrum-central", "central-kochi", "chennai-central", "hyderabad-central", "delhi-central", "mumbai-central", "online"].includes(z.id)).map((z) => (
              <button key={z.id} onClick={() => {
                setZone(z); setCachedZone(z); setStatus("done"); setOpen(false); onZoneChange?.(z);
              }} style={{
                background: zone?.id === z.id ? "rgba(139,127,240,0.15)" : "rgba(255,255,255,0.04)",
                border: zone?.id === z.id ? "0.5px solid rgba(139,127,240,0.4)" : "0.5px solid rgba(255,255,255,0.08)",
                borderRadius: 100, padding: "5px 12px", fontSize: 11, fontWeight: 500,
                color: zone?.id === z.id ? "#c5b8f8" : "#8a8591", cursor: "pointer", fontFamily: "inherit",
              }}>
                {z.city === "India" ? "🌐 Online" : `📍 ${z.city}`}
              </button>
            ))}
          </div>

          {zone && (
            <button onClick={clearZone} className="flex items-center gap-1 mt-3"
              style={{ background: "none", border: "none", color: "#5a5466", fontSize: 11, cursor: "pointer", fontFamily: "inherit" }}>
              <X style={{ width: 10, height: 10 }} /> Clear location
            </button>
          )}
        </div>
      )}

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; } 50% { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
