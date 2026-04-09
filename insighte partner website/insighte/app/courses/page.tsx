"use client";

import React, { useEffect, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/client";
import { Play, Video, ArrowRight, Zap, RefreshCw, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function CoursesPage() {
  const supabase = createClient();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all"|"live"|"past">("all");

  useEffect(() => {
    async function loadCourses() {
      const { data } = await supabase.from('courses').select('*').eq('status', 'published').order('created_at', { ascending: false });
      setCourses(data || []);
      setLoading(false);
    }
    loadCourses();
  }, [supabase]);

  const displayedCourses = courses.filter(c => {
    if (filter === "live") return c.is_live;
    if (filter === "past") return !c.is_live;
    return true;
  });

  return (
    <div className="flex flex-col min-h-screen bg-[#0d0f1a] font-sans text-white selection:bg-[#8b7ff0] selection:text-white">
      <Navbar />
      <main className="flex-1 pt-[120px] pb-40">
        
        {/* HERO SECTION */}
        <section className="px-6 max-w-7xl mx-auto mb-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[#8b7ff0] text-xs font-bold uppercase tracking-widest mb-6">
                <Play size={14} fill="currentColor" /> Insighte Academy
              </div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase mb-6 drop-shadow-lg text-white" style={{ fontFamily: "'Space Grotesk', system-ui, sans-serif" }}>
                Masterclasses<br/>& <span className="italic text-[#8a8591]">Certifications</span>
              </h1>
              <p className="text-xl text-[#8a8591] font-medium max-w-xl">
                Advanced learning frameworks for parents and educators. High-density, outcome-driven programs taught by leading neuro-specialists.
              </p>
            </div>
            
            <div className="flex bg-[#16172b] p-2 rounded-2xl border border-white/10 self-start md:self-end">
              <button onClick={() => setFilter("all")} className={cn("px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all", filter === "all" ? "bg-white text-black shadow-lg" : "text-white/40 hover:text-white")}>All Catalog</button>
              <button onClick={() => setFilter("live")} className={cn("px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all", filter === "live" ? "bg-[#ff6b6b] text-white shadow-lg shadow-[#ff6b6b]/20" : "text-[#ff6b6b]/60 hover:text-[#ff6b6b]")}>Live Cohorts</button>
              <button onClick={() => setFilter("past")} className={cn("px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all", filter === "past" ? "bg-[#1d9e75] text-white shadow-lg shadow-[#1d9e75]/20" : "text-[#1d9e75]/60 hover:text-[#1d9e75]")}>Pre-Recorded</button>
            </div>
          </div>
        </section>

        {/* COURSES GRID */}
        <section className="px-6 max-w-7xl mx-auto">
          {loading ? (
             <div className="py-20 flex justify-center items-center">
               <RefreshCw className="animate-spin opacity-20 w-12 h-12" />
             </div>
          ) : displayedCourses.length === 0 ? (
            <div className="py-32 text-center border border-white/10 border-dashed rounded-[48px] bg-white/[0.02]">
              <h3 className="text-2xl font-bold uppercase tracking-tighter text-white/40 mb-2">No programs available</h3>
              <p className="text-white/20 italic">Check back soon for new masterclasses.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {displayedCourses.map((course) => (
                 <div key={course.id} className="group flex flex-col bg-[#16172B] rounded-[32px] border border-white/5 overflow-hidden hover:border-[#8b7ff0]/50 transition-all duration-500 hover:shadow-[0_20px_80px_rgba(139,127,240,0.15)]">
                   {/* Card Header Background */}
                   <div className="h-48 relative overflow-hidden bg-zinc-900 border-b border-white/10">
                     {course.cover_image_url ? (
                        <img src={course.cover_image_url} alt={course.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
                     ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#8b7ff0]/20 to-[#1d9e75]/20 group-hover:scale-110 transition-transform duration-700" />
                     )}
                     <div className="absolute top-4 left-4">
                        <span className={cn("px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md border", course.is_live ? "bg-[#ff6b6b]/20 text-[#ff6b6b] border-[#ff6b6b]/30" : "bg-black/40 text-white border-white/20")}>
                           {course.is_live ? "Live Session" : "Self-Paced"}
                        </span>
                     </div>
                   </div>

                   <div className="p-8 flex-1 flex flex-col">
                     <h3 className="text-2xl font-bold mb-4 tracking-tight leading-tight group-hover:text-[#8b7ff0] transition-colors">{course.title}</h3>
                     
                     <p className="text-zinc-400 text-sm leading-relaxed mb-8 flex-1 line-clamp-3">
                       {course.description || "No description provided."}
                     </p>
                     
                     <div className="flex items-center gap-4 mb-8">
                       <div className="flex items-center gap-2 text-xs font-bold text-white/50">
                          <CheckCircle2 size={16} className="text-[#1d9e75]" /> Certification
                       </div>
                       <div className="w-1 h-1 rounded-full bg-white/20" />
                       <div className="flex items-center gap-2 text-xs font-bold text-white/50">
                          <Video size={16} className="text-[#8b7ff0]" /> Studio Quality
                       </div>
                     </div>

                     <div className="flex items-center justify-between pt-6 border-t border-white/10">
                        <div className="flex flex-col">
                           <span className="text-[10px] uppercase font-black tracking-widest text-[#8a8591] mb-1">Enrollment Fee</span>
                           <span className="text-2xl font-black text-white">₹{course.price}</span>
                        </div>
                        <button 
                          onClick={() => {
                            if (course.payment_link && course.payment_link !== "#") {
                              window.open(course.payment_link, "_blank");
                            } else {
                              toast.info("Enquiry Initiated", {
                                description: "The enrollment link for this masterclass is being finalized. We've notified our team to contact you with the registration details.",
                              });
                            }
                          }}
                          className="h-12 px-6 rounded-full bg-white text-black font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-[#8b7ff0] hover:text-white transition-colors"
                        >
                           Enroll <ArrowRight size={14} />
                        </button>
                     </div>
                   </div>
                 </div>
               ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </div>
  );
}
