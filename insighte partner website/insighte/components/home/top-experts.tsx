"use client";

import React, { useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { Award, ArrowRight, Sparkles } from "lucide-react";
import { Zone } from "@/lib/geo";
import { ProviderCard } from "@/components/ui/provider-card";

const FEATURED_EXPERTS = [
  {
    id: "1",
    name: "Dr. Priya Sharma",
    provider_type: "Autism Specialist",
    category: "Autism",
    specializations: ["ABA Therapy", "Early Intervention"],
    rating_avg: 4.9,
    review_count: 124,
    city: "Bangalore",
    avatar_url: "/images/experts/autism_specialist.png",
    experience_years: 12,
    total_bookings: 340,
    bio: "Clinical psychologist specializing in neuro-developmental support and family guidance through evidence-based ABA therapy.",
    consultation_fee: 1500,
    is_verified: true,
    mode: "In-Person",
    session_modes: ["IN_PERSON", "ONLINE"],
    slug: "priya-sharma",
  },
  {
    id: "2",
    name: "Mr. Rahul Iyer",
    provider_type: "Speech Therapist",
    category: "Speech Therapy",
    specializations: ["Articulation", "Language Delay"],
    rating_avg: 4.8,
    review_count: 98,
    city: "Mumbai",
    avatar_url: "/images/experts/speech_therapist.png",
    experience_years: 8,
    total_bookings: 210,
    bio: "Dedicated speech-language pathologist helping children overcome communication hurdles with fun, engaging virtual sessions.",
    consultation_fee: 1200,
    is_verified: true,
    mode: "Online",
    session_modes: ["ONLINE"],
    slug: "rahul-iyer",
  },
  {
    id: "3",
    name: "Dr. Ananya Kapoor",
    provider_type: "Behavioral Specialist",
    category: "Child Counselling",
    specializations: ["CBT", "Social Skills"],
    rating_avg: 4.9,
    review_count: 87,
    city: "Delhi",
    avatar_url: "/images/experts/behavioral_specialist.png",
    experience_years: 10,
    total_bookings: 290,
    bio: "Specialist in ADHD management and emotional regulation, helping children build long-term resilience and focus.",
    consultation_fee: 1800,
    is_verified: true,
    mode: "In-Person",
    session_modes: ["IN_PERSON", "ONLINE"],
    slug: "ananya-kapoor",
  },
  {
    id: "4",
    name: "Mrs. Shanti Devi",
    provider_type: "Special Educator",
    category: "Special Education",
    specializations: ["IEP Design", "Learning Support"],
    rating_avg: 5.0,
    review_count: 61,
    city: "Bangalore",
    avatar_url: "/images/experts/special_educator.png",
    experience_years: 15,
    total_bookings: 180,
    bio: "Senior educator focused on inclusive schooling and personalized curriculum adaptation for diverse learning needs.",
    consultation_fee: 900,
    is_verified: true,
    mode: "In-Person",
    session_modes: ["IN_PERSON"],
    slug: "shanti-devi",
  },
];

interface TopExpertsProps {
  zone?: Zone | null;
  initialExperts?: any[];
}

export function TopExperts({ zone, initialExperts = [] }: TopExpertsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  const baseExperts = useMemo(() => {
    return initialExperts.length > 0 ? initialExperts : FEATURED_EXPERTS;
  }, [initialExperts]);

  const filteredExperts = useMemo(() => {
    if (!zone || !zone.city || zone.city === "Global") return baseExperts;
    
    // Exact city match
    const local = baseExperts.filter(e => 
      e.city?.toLowerCase() === zone.city.toLowerCase()
    );

    // If no local, show online/featured but add a label
    return local.length > 0 ? local : baseExperts;
  }, [zone, baseExperts]);

  const isShowingFallback = useMemo(() => {
    if (!zone || !zone.city || zone.city === "Global") return false;
    return !baseExperts.some(e => e.city?.toLowerCase() === zone.city.toLowerCase());
  }, [zone, baseExperts]);

  useEffect(() => {
    let ctx: any;
    const initGsap = async () => {
      try {
        const { default: gsap } = await import("gsap");
        const { ScrollTrigger } = await import("gsap/ScrollTrigger");
        gsap.registerPlugin(ScrollTrigger);

        if (!sectionRef.current || !cardsRef.current) return;
        const cards = Array.from(cardsRef.current.children) as HTMLElement[];

        ctx = gsap.context(() => {
          gsap.fromTo(
            cards,
            { y: 40, opacity: 0, scale: 0.95 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 1,
              stagger: 0.1,
              ease: "expo.out",
              scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }, sectionRef);
      } catch (e) {
        // Fail silently
      }
    };

    initGsap();
    return () => { if (ctx) ctx.revert(); };
  }, [filteredExperts]);

  return (
    <section ref={sectionRef} className="py-20 px-6 max-w-7xl mx-auto overflow-hidden">
      {/* ── SECTION HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#8b7ff015] border border-[#8b7ff030] text-[10px] font-black text-[#8b7ff0] uppercase tracking-[0.2em] mb-4">
            <Award className="w-3.5 h-3.5" aria-hidden="true" />
            Vetted Professionals
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white leading-[1.05] tracking-tighter mb-6 font-serif">
            Experts your family<br />
            can <span className="italic text-[#c5b8f8]">truly</span> trust
          </h2>
          <p className="text-lg text-[#8a8591] font-medium leading-relaxed">
            {isShowingFallback 
              ? `We're expanding into ${zone?.city}! While our local team is growing, these top-rated experts are available online right now.`
              : "Hand-vetted for clinical excellence, teaching quality, and real-world outcomes by child psychologists."
            }
          </p>
        </div>

        <Link 
          href="/specialists" 
          aria-label="Explore All Specialists"
          className="group flex items-center gap-3 px-8 py-4 rounded-full bg-[#1a1c2e] border border-white/5 text-xs font-black text-white uppercase tracking-[0.15em] hover:bg-[#23263b] hover:border-[#8b7ff040] transition-all transform active:scale-[0.98]"
        >
          Explore All Specialists 
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1.5" aria-hidden="true" />
        </Link>
      </div>

      {/* ── EXPERTS ROW (NETFLIX STYLE) ── */}
      {isShowingFallback && (
        <div className="flex items-center gap-3 mb-8 px-5 py-4 rounded-2xl bg-[#1d9e7510] border border-[#1d9e7530]" role="alert">
          <Sparkles className="w-5 h-5 text-[#5dcaa5]" aria-hidden="true" />
          <span className="text-sm font-bold text-[#5dcaa5]">Showing top available experts who provide online sessions</span>
        </div>
      )}

      {/* ── EXPERTS LIST (Vertical on Mobile, Horizontal Scroll on Desktop) ── */}
      <div className="relative -mx-6 px-6 lg:mx-0 lg:px-0">
        <div 
          ref={cardsRef} 
          className="flex flex-col md:flex-row md:overflow-x-auto gap-8 md:gap-6 pb-12 pt-10 md:snap-x md:snap-mandatory custom-scrollbar"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {filteredExperts.map((expert) => (
            <div 
              key={expert.id} 
              className="md:snap-start flex-none w-full md:w-[360px] lg:w-[380px] mb-4 md:mb-0"
            >
              <ProviderCard 
                provider={expert as any} 
                className="h-full w-full"
              />
            </div>
          ))}
        </div>
        
        {/* Optional fading edges for desktop scroll */}
        <div className="hidden lg:block absolute top-0 left-0 bottom-12 w-6 bg-gradient-to-r from-[#111224] to-transparent pointer-events-none z-10" />
        <div className="hidden lg:block absolute top-0 right-0 bottom-12 w-12 bg-gradient-to-l from-[#111224] to-transparent pointer-events-none z-10" />
      </div>

      {/* ── TRUST INDICATOR ── */}
      <div className="mt-16 flex flex-wrap justify-center items-center gap-x-12 gap-y-6 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Narayana Health</span>
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Cloudnine</span>
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Manipal Hospitals</span>
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Rainbow Children's</span>
      </div>
    </section>
  );
}
