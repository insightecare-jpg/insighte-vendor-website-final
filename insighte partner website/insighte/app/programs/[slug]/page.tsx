import React from "react";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { 
  Calendar, 
  Users, 
  MapPin, 
  Globe, 
  Clock, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Zap,
  GraduationCap,
  Play,
  Award,
  BookOpen,
  MessageCircle,
  CreditCard
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { getPrograms } from "@/lib/actions/programs";

export default async function ProgramDetailPage(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const supabase = await createClient();

  // Fetch program with relations
  let { data: program } = await supabase
    .from("programs")
    .select(`
      *,
      facilitators:program_facilitators(*),
      modules:program_modules(*)
    `)
    .or(`slug.eq.${slug},id.eq.${slug}`)
    .single();

  // Fallback check (if database is missing as previously noted)
  if (!program) {
     const fallbacks = await getPrograms();
     program = fallbacks.find((p: any) => p.slug === slug || p.id === slug);
  }

  if (!program) notFound();

  const isCourse = program.type === 'course' || program.type === 'training';

  return (
    <div className="min-h-screen bg-[#0a0b1c] text-white selection:bg-[#BACCB3] selection:text-black">
      <Navbar />
      
      {/* ─── HERO SECTION ─────────────────────────────────────────────────── */}
      <section className="relative pt-48 pb-32 px-6 overflow-hidden">
        {/* Dynamic Background */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[800px] bg-gradient-radial from-[#8b7ff010] via-transparent to-transparent pointer-events-none opacity-50" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#5DCAA5]/5 blur-[120px] rounded-full" />
        
        <div className="max-w-7xl mx-auto">
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
              <div className="lg:col-span-7 space-y-10 relative z-10">
                 <div className="flex flex-wrap items-center gap-4">
                    <div className="px-6 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-3xl text-[10px] font-black uppercase tracking-[0.3em] text-[#D3C4B5] flex items-center gap-2">
                       <div className="h-1.5 w-1.5 rounded-full bg-[#BACCB3] animate-pulse" />
                       {program.type?.replace('_', ' ') || "Clinical Program"} // Registry
                    </div>
                    {program.is_featured && (
                      <div className="px-6 py-2 rounded-full bg-[#BACCB3]/10 border border-[#BACCB3]/30 text-[#BACCB3] text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <Sparkles className="h-3 w-3" /> Featured Institutional Flow
                      </div>
                    )}
                 </div>
                 
                 <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase italic leading-[0.8] mix-blend-plus-lighter drop-shadow-2xl">
                    {program.name.split(' ').map((word: string, i: number) => (
                      <span key={i} className={i === 0 ? "text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/40" : "text-white"}>
                        {word}{' '}
                      </span>
                    ))}
                 </h1>

                 <p className="text-2xl text-zinc-400 font-medium leading-relaxed max-w-3xl italic border-l-4 border-[#BACCB3]/20 pl-8">
                    "{program.description}"
                 </p>

                 <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 pt-6">
                    <div className="space-y-2">
                       <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 block">Status</span>
                       <div className="flex items-center gap-2 text-white font-black uppercase text-xs">
                          <CheckCircle2 className="h-4 w-4 text-[#BACCB3]" /> Active
                       </div>
                    </div>
                    <div className="space-y-2">
                       <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 block">Credential</span>
                       <div className="flex items-center gap-2 text-white font-black uppercase text-xs">
                          <Award className="h-4 w-4 text-[#D3C4B5]" /> Verified
                       </div>
                    </div>
                    <div className="space-y-2">
                       <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 block">Pace</span>
                       <div className="flex items-center gap-2 text-white font-black uppercase text-xs">
                          <Clock className="h-4 w-4 text-[#8b7ff0]" /> {program.course_duration || "Self-Paced"}
                       </div>
                    </div>
                    <div className="space-y-2">
                       <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 block">Access</span>
                       <div className="flex items-center gap-2 text-white font-black uppercase text-xs">
                          <Globe className="h-4 w-4 text-[#5DCAA5]" /> Universal
                       </div>
                    </div>
                 </div>

                 <div className="pt-10 flex flex-wrap gap-6 items-center">
                    {program.external_enroll_url ? (
                      <Link 
                        href={program.external_enroll_url} 
                        target="_blank"
                        className="h-20 px-16 rounded-[2rem] bg-white text-black font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center hover:bg-[#BACCB3] transition-all shadow-[0_0_50px_rgba(255,255,255,0.15)] active:scale-95 group"
                      >
                         Secure Enrollment (Graphy) <ArrowRight className="h-5 w-5 ml-4 group-hover:translate-x-2 transition-transform" />
                      </Link>
                    ) : (
                      <Link 
                        href={program.registration_link || "/contact"} 
                        className="h-20 px-16 rounded-[2rem] bg-white text-black font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center hover:bg-[#D3C4B5] transition-all shadow-[0_0_50px_rgba(255,255,255,0.1) active:scale-95 group"
                      >
                         Initiate Intake <ArrowRight className="h-5 w-5 ml-4 group-hover:translate-x-2 transition-transform" />
                      </Link>
                    )}
                    
                    {!program.is_free && (
                      <div className="flex items-center gap-4 pl-4 border-l border-white/10">
                         <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                            <CreditCard className="h-5 w-5 text-zinc-400" />
                         </div>
                         <div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Institutional Fee</div>
                            <div className="text-xl font-black text-white italic">₹{program.fee?.toLocaleString() || "4,999"}</div>
                         </div>
                      </div>
                    )}
                 </div>
              </div>

              <div className="lg:col-span-5 relative lg:sticky lg:top-40">
                 <div className="group relative">
                    <div className="absolute -inset-1 bg-gradient-to-r from-[#BACCB3]/20 via-white/5 to-[#8b7ff0]/20 rounded-[4rem] blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
                    <div className="relative aspect-[4/5] rounded-[4rem] bg-zinc-900/50 backdrop-blur-3xl overflow-hidden border border-white/10 shadow-3xl transform rotate-1 group-hover:rotate-0 transition-all duration-700">
                       {program.hero_image_url ? (
                         <img src={program.hero_image_url} alt={program.name} className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000 grayscale hover:grayscale-0" />
                       ) : (
                         <div className="h-full w-full bg-[#111224] flex flex-col items-center justify-center gap-6 p-12 text-center">
                            <GraduationCap className="h-24 w-24 text-zinc-800 animate-pulse" />
                            <div className="space-y-2">
                               <div className="text-xl font-black text-white uppercase italic">Clinical Portfolio</div>
                               <div className="text-[9px] font-bold text-zinc-600 uppercase tracking-widest">Asset ID: {program.slug}</div>
                            </div>
                         </div>
                       )}
                       
                       <div className="absolute inset-x-8 bottom-8 p-10 rounded-[2.5rem] bg-black/60 backdrop-blur-3xl border border-white/10 space-y-3 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                          <div className="flex items-center justify-between">
                             <div className="text-[10px] font-black text-[#BACCB3] uppercase tracking-widest">Enrollment Impact</div>
                             <div className="flex -space-x-3">
                                {[1,2,3,4].map(i => <div key={i} className="h-8 w-8 rounded-full border-2 border-black bg-zinc-800" />)}
                             </div>
                          </div>
                          <div className="text-4xl font-black text-white tracking-tighter">{program.impact_stat}</div>
                          <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{program.impact_label}</div>
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* ─── ARCHITECTURE & EXPERIENCE ─────────────────────────────────────── */}
      <section className="relative py-40 bg-zinc-950/30">
        <div className="max-w-7xl mx-auto px-6">
           <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
              <div className="lg:col-span-8 space-y-32">
                 
                 {/* What You Will Learn */}
                 <div className="space-y-16">
                    <div className="space-y-4">
                       <span className="text-[10px] font-black text-[#8b7ff0] uppercase tracking-[0.4em]">Syllabus</span>
                       <h2 className="text-5xl font-black tracking-tighter uppercase italic">Curated <span className="text-zinc-600">Flow.</span></h2>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                       {(program.modules && program.modules.length > 0 ? program.modules : [
                         { title: "Clinical Foundation", description: "Understanding the neuro-affirming lens and baseline protocols." },
                         { title: "Practical Application", description: "Hands-on strategy deployment for diverse classroom settings." },
                         { title: "Outcome Mapping", description: "Measuring progress without pathologizing natural behaviors." }
                       ]).map((m: any, idx: number) => (
                         <div key={idx} className="p-10 rounded-[3rem] bg-white/[0.02] border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-8 group hover:bg-white/[0.04] transition-all border-l-4 border-l-transparent hover:border-l-[#BACCB3]">
                            <div className="flex items-start gap-8">
                               <div className="text-2xl font-black text-zinc-800 mt-1">{ (idx + 1).toString().padStart(2, '0') }</div>
                               <div className="space-y-2">
                                  <h3 className="text-2xl font-black text-white uppercase tracking-tight group-hover:text-[#BACCB3] transition-colors">{m.title}</h3>
                                  <p className="text-sm font-medium text-zinc-500 italic max-w-lg leading-relaxed">{m.description}</p>
                               </div>
                            </div>
                            <div className="flex items-center gap-6">
                               <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">{m.duration_minutes || "45"} MINS / MODULE</span>
                               <div className="h-14 w-14 rounded-full border border-white/5 flex items-center justify-center bg-black/40 group-hover:scale-110 transition-transform">
                                  <Play className="h-5 w-5 text-[#BACCB3] fill-[#BACCB3]" />
                               </div>
                            </div>
                         </div>
                       ))}
                    </div>
                 </div>

                 {/* Outcomes */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-8">
                       <div className="h-20 w-20 rounded-[2rem] bg-[#5DCAA5]/10 flex items-center justify-center text-[#5DCAA5] border border-[#5DCAA5]/20">
                          <CheckCircle2 className="h-10 w-10" />
                       </div>
                       <h3 className="text-3xl font-black uppercase text-white tracking-tighter italic">Learner <br/>Transformations.</h3>
                       <div className="space-y-4">
                          {["Credentialed Expertise", "Clinical Protocol Literacy", "Adaptive Peer Management", "Neuro-Inclusive Certification"].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 text-sm font-black uppercase text-zinc-500">
                               <ArrowRight className="h-4 w-4 text-[#BACCB3]" /> {item}
                            </div>
                          ))}
                       </div>
                    </div>
                    <div className="space-y-8">
                       <div className="h-20 w-20 rounded-[2rem] bg-[#8b7ff0]/10 flex items-center justify-center text-[#8b7ff0] border border-[#8b7ff0]/20">
                          <MessageCircle className="h-10 w-10" />
                       </div>
                       <h3 className="text-3xl font-black uppercase text-white tracking-tighter italic">Direct <br/>Onboarding.</h3>
                       <p className="text-sm font-medium text-zinc-400 leading-relaxed italic">
                          "This program bridged the gap between clinical theory and classroom reality. My child felt truly seen for the first time."
                       </p>
                       <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-full bg-zinc-800" />
                          <div className="text-[10px] font-black uppercase tracking-widest text-[#BACCB3]">Priyanka M. • Parent</div>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="lg:col-span-4 space-y-16">
                 {/* Clinical Guides */}
                 <div className="space-y-10">
                    <div className="space-y-2">
                       <span className="text-[10px] font-black text-[#D3C4B5] uppercase tracking-[0.4em]">Primary Guides</span>
                       <h4 className="text-2xl font-black uppercase italic text-white">Clinical Leads.</h4>
                    </div>
                    
                    <div className="space-y-6">
                       {(program.facilitators && program.facilitators.length > 0 ? program.facilitators : [
                         { name: "Trisha Sinha", role: "Clinical Director", bio: "15+ years in behavioral architecture." }
                       ]).map((f: any, i: number) => (
                         <div key={i} className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-white/10 space-y-6 group hover:bg-white/[0.05] transition-all">
                            <div className="flex items-center gap-6">
                               <div className="h-20 w-20 rounded-full bg-zinc-800 border-2 border-[#BACCB3]/30 overflow-hidden">
                                  {f.avatar_url && <img src={f.avatar_url} className="w-full h-full object-cover" />}
                               </div>
                               <div>
                                  <div className="text-lg font-black text-white italic">{f.name}</div>
                                  <div className="text-[10px] font-bold text-[#BACCB3] uppercase tracking-widest">{f.role}</div>
                               </div>
                            </div>
                            <p className="text-xs font-medium text-zinc-500 leading-relaxed italic">
                               "{f.bio || "Specialized in translating high-level clinical goals into actionable daily care flows."}"
                            </p>
                         </div>
                       ))}
                    </div>
                 </div>

                 {/* Sticky Enrollment Details */}
                 <div className="p-10 rounded-[3rem] bg-white text-black shadow-4xl space-y-10 transform -rotate-1 lg:rotate-0">
                    <div className="space-y-2">
                       <div className="text-[10px] font-black uppercase tracking-[0.4em] opacity-40">Operational Summary</div>
                       <h4 className="text-3xl font-black uppercase italic leading-none">Enrollment <br/><span className="text-zinc-400">Hub.</span></h4>
                    </div>

                    <div className="space-y-6">
                       <div className="flex items-center justify-between pb-6 border-b border-black/5">
                          <div className="flex items-center gap-4">
                             <div className="h-10 w-10 rounded-2xl bg-black/5 flex items-center justify-center"><BookOpen className="h-4 w-4" /></div>
                             <span className="text-[10px] font-black uppercase tracking-widest">Portal Access</span>
                          </div>
                          <span className="text-xs font-black italic">Lifetime / Graphy</span>
                       </div>
                       <div className="flex items-center justify-between pb-6 border-b border-black/5">
                          <div className="flex items-center gap-4">
                             <div className="h-10 w-10 rounded-2xl bg-black/5 flex items-center justify-center"><Users className="h-4 w-4" /></div>
                             <span className="text-[10px] font-black uppercase tracking-widest">Live Connect</span>
                          </div>
                          <span className="text-xs font-black italic">Alt Saturdays</span>
                       </div>
                    </div>

                    <div className="space-y-6">
                       <div className="p-6 rounded-2xl bg-black/5 border border-black/5 space-y-1">
                          <div className="text-[10px] font-black uppercase tracking-widest opacity-40">Investment</div>
                          <div className="flex items-baseline gap-2">
                             <span className="text-4xl font-black italic">₹{program.fee?.toLocaleString() || "4,999"}</span>
                             <span className="text-[10px] font-bold text-zinc-400 uppercase">incl. GST</span>
                          </div>
                       </div>

                       {program.external_enroll_url ? (
                         <Link 
                           href={program.external_enroll_url} 
                           target="_blank"
                           className="w-full h-16 rounded-[1.5rem] bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center group shadow-xl active:scale-95"
                         >
                            Secure Enrollment <ArrowRight className="ml-4 h-5 w-5 group-hover:translate-x-2 transition-transform" />
                         </Link>
                       ) : (
                         <Button className="w-full h-16 rounded-[1.5rem] bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] flex items-center justify-center group shadow-xl active:scale-95 border-none">
                            Pay via Razorpay <CreditCard className="ml-4 h-5 w-5 group-hover:scale-110 transition-transform" />
                         </Button>
                       )}
                       
                       <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                          <ShieldCheck className="h-4 w-4" /> 100% Secured by Razorpay
                       </div>
                    </div>
                 </div>
              </div>
           </div>
        </div>
      </section>

      {/* ─── TRIAGE CTA ────────────────────────────────────────────────────── */}
      <section className="py-40 bg-zinc-950">
         <div className="max-w-4xl mx-auto px-6 text-center space-y-12">
            <Sparkles className="h-16 w-16 text-[#BACCB3] mx-auto opacity-50" />
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.8] mix-blend-plus-lighter">
               Not the right <br/>
               <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BACCB3] to-white">Pathway?</span>
            </h2>
            <p className="text-zinc-500 text-lg max-w-xl mx-auto italic font-medium leading-relaxed">
               Every child is unique. Our clinical curators can help you select the exact combination of services you need.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6">
               <Link href="/triage" className="h-16 px-12 rounded-[2rem] bg-white/5 border border-white/10 text-white font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-all">
                  Consult Triage
               </Link>
               <Link href="/specialists" className="h-16 px-12 rounded-[2rem] bg-white text-black font-black uppercase text-[10px] tracking-widest hover:bg-[#BACCB3] transition-all">
                  Browse Experts
               </Link>
            </div>
         </div>
      </section>

      <Footer />
    </div>
  );
}

function Button({ children, className, onClick }: any) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "cursor-pointer transition-all active:scale-95",
        className
      )}
    >
      {children}
    </button>
  );
}

