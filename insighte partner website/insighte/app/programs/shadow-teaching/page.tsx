import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Shadow Teaching | Insighte Programs",
  description: "One-on-one support enabling children with special needs to thrive in inclusive mainstream classrooms.",
};

export default function ShadowTeachingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#0d0f1a] font-sans text-white">
      <Navbar />
      <main className="flex-1 pt-24 pb-20">
        
        {/* HERO */}
        <section className="px-6 py-20 max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[#8b7ff0] text-xs font-bold uppercase tracking-widest mb-6">
            School Support
          </div>
          <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight text-[#f0ece4]" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>
            Shadow Teaching
          </h1>
          <p className="text-[#8a8591] text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            One-on-one classroom support designed to empower children with ADHD, Autism, and learning difficulties to thrive confidently in mainstream schools.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/triage" className="px-8 py-4 rounded-full bg-white text-[#0d0f1a] font-black uppercase text-xs tracking-widest hover:bg-[#8b7ff0] hover:text-white transition-colors shadow-2xl">
              Get Started
            </Link>
          </div>
        </section>

        {/* DETAILS */}
        <section className="px-6 py-12 max-w-4xl mx-auto">
          <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-8 md:p-12">
            <h2 className="text-2xl font-bold mb-6 text-white border-b border-white/10 pb-4">How It Helps</h2>
            <div className="grid md:grid-cols-2 gap-8 text-[#e0daea]">
              <div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-[#1d9e75] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">Promotes smooth social interaction with peers without masking their authentic selves.</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-[#1d9e75] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">Active facilitation of the Individualized Education Program (IEP) goals inside the classroom.</span>
                  </li>
                </ul>
              </div>
              <div>
                <ul className="space-y-4">
                  <li className="flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-[#1d9e75] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">Reduces sensory overload and in-class stress, making learning highly accessible and enjoyable.</span>
                  </li>
                  <li className="flex items-start gap-4">
                    <CheckCircle2 className="w-6 h-6 text-[#1d9e75] shrink-0 mt-0.5" />
                    <span className="leading-relaxed">Bridges the gap between special educators, parents, and mainstream school teachers.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
        
      </main>
      <Footer />
    </div>
  );
}
