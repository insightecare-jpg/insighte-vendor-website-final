import React from "react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { 
  ArrowLeft,
  Video,
  CheckCircle2,
  Calendar,
  Clock,
  ShieldCheck,
  Check,
  MapPin,
  Headset,
  ChevronRight,
  BrainCircuit,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

export default async function SessionDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  // Fetch Booking Data
  const { data: session } = await supabase
    .from("bookings")
    .select(`
      *,
      provider:providers(*),
      service:services(*),
      child:children(*)
    `)
    .eq("id", id)
    .single();

  if (!session) {
    redirect("/parent/sessions");
  }

  return (
    <div className="min-h-[100dvh] bg-[#1E1B4B] text-white font-inter pb-24 lg:pb-12 selection:bg-[#7A9482] selection:text-[#FDF8F1]">
      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 flex items-center justify-between px-6 h-16 bg-[#1E1B4B]/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-4">
          <Link href="/parent/sessions" className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-5 h-5 text-white" />
          </Link>
          <span className="text-xl font-extrabold text-white tracking-tighter font-manrope">Insighte</span>
        </div>
      </header>

      <main className="pt-24 px-4 sm:px-6 max-w-4xl mx-auto space-y-12 animate-fade-in-up">
        
        {/* Header Section */}
        <section className="flex flex-col md:flex-row md:items-end justify-between gap-8 pt-4">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#7A9482]/20 border border-[#7A9482]/30 rounded-full">
              <span className="w-2 h-2 rounded-full bg-[#7A9482] animate-pulse"></span>
              <span className="text-[10px] font-bold text-[#7A9482] uppercase tracking-[0.15em]">Upcoming Session</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold font-manrope tracking-tight leading-tight">
              Session with <span className="text-[#7A9482]">{session.provider?.name || "Provider"}</span>
              <span className="block text-2xl mt-2 opacity-60 font-medium italic">for {session.child?.name || "Child"}</span>
            </h1>
            <p className="text-white/60 font-medium flex items-center gap-2 flex-wrap">
              <ShieldCheck className="w-5 h-5 text-[#7A9482]" />
               {session.service?.title || "Therapy Session"} • Certified Professional
            </p>
          </div>
        </section>

        {/* Join Meeting Floating CTA (Prominent Platform) */}
        <section>
          <div className="bg-[#FDF8F1] p-1.5 rounded-[2rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] hover:-translate-y-1 transition-transform duration-500 ease-out border border-white/10">
            <div className="bg-[#FDF8F1] p-8 rounded-[1.75rem] flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 rounded-2xl bg-[#1E1B4B] flex items-center justify-center shadow-inner">
                  <Calendar className="text-[#FDF8F1] w-8 h-8 fill-current opacity-90" />
                </div>
                <div>
                  <p className="text-[10px] text-[#1E1B4B]/60 font-bold uppercase tracking-[0.2em] mb-1">Schedule</p>
                  <p className="text-2xl font-black text-[#1E1B4B] font-manrope">
                     {new Date(session.start_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })},{" "}
                     {new Date(session.start_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                  </p>
                  <p className="text-sm text-[#1E1B4B]/70 font-medium">Virtual Session • 50 Minutes</p>
                </div>
              </div>
              <button className="w-full md:w-auto flex items-center justify-center gap-3 bg-[#7A9482] text-white py-4 px-10 rounded-2xl font-bold hover:brightness-110 transition-all shadow-xl shadow-[#7A9482]/30 active:scale-95 text-lg">
                <Video className="w-6 h-6" />
                Join Meeting
              </button>
            </div>
          </div>
        </section>

        {/* Content Platforms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Main Column */}
          <div className="md:col-span-8 space-y-8">
            
            {/* Session Goals Platform */}
            <div className="bg-[#FDF8F1] p-8 rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] text-[#1E1B4B] hover:-translate-y-1 transition-transform duration-500">
              <h3 className="text-2xl font-black font-manrope mb-8 flex items-center gap-4">
                <span className="w-2 h-8 bg-[#7A9482] rounded-full"></span>
                Session Goals
              </h3>
              <div className="space-y-4">
                <div className="flex items-start gap-5 p-5 rounded-3xl bg-white/40 border border-[#1E1B4B]/5 hover:border-[#7A9482]/40 transition-colors">
                  <div className="mt-1 w-6 h-6 rounded-full border-2 border-[#7A9482] flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5 text-[#7A9482] stroke-[3]" />
                  </div>
                  <span className="text-[#1E1B4B]/80 font-medium leading-relaxed">Review progress on recent social milestones and independent activities.</span>
                </div>
                <div className="flex items-start gap-5 p-5 rounded-3xl bg-white/40 border border-[#1E1B4B]/5 hover:border-[#7A9482]/40 transition-colors">
                  <div className="mt-1 w-6 h-6 rounded-full border-2 border-[#7A9482] flex items-center justify-center shrink-0">
                     <Check className="w-3.5 h-3.5 text-[#7A9482] stroke-[3]" />
                  </div>
                  <span className="text-[#1E1B4B]/80 font-medium leading-relaxed">Discuss strategies for emotional regulation identified in the previous session.</span>
                </div>
              </div>
            </div>

            {/* Pre-session Notes Platform */}
            <div className="bg-[#312E81] p-8 rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] border border-white/10 hover:-translate-y-1 transition-transform duration-500">
              <h3 className="text-2xl font-black font-manrope mb-8 flex items-center gap-4 text-white">
                <span className="w-2 h-8 bg-[#7A9482] rounded-full"></span>
                Pre-session Notes
              </h3>
              <div className="space-y-6">
                <p className="text-white/80 leading-relaxed text-lg italic font-light">
                  "Hello! For today's session, I would like to focus on the recent feedback. Please ensure {session.child?.name || "your child"} is in a comfortable, quiet space..."
                </p>
              </div>
              
              <div className="mt-10 pt-8 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-[#1E1B4B] border-4 border-[#312E81] flex items-center justify-center text-[#7A9482] text-xl font-bold">
                     {session.provider?.name?.charAt(0) || "P"}
                  </div>
                  <span className="text-sm text-white/50 font-semibold">Shared by Provider</span>
                </div>
                <span className="text-[10px] text-[#7A9482] font-black uppercase tracking-widest bg-[#7A9482]/10 px-4 py-2 rounded-full border border-[#7A9482]/20">
                   Private Insight
                </span>
              </div>
            </div>

          </div>

          {/* Sidebar Column */}
          <div className="md:col-span-4 space-y-8">
            
            {/* Appointment Info Platform */}
            <div className="bg-[#FDF8F1] p-8 rounded-[2.5rem] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] text-[#1E1B4B] hover:-translate-y-1 transition-transform duration-500">
               <h4 className="text-[10px] font-black text-[#1E1B4B]/40 uppercase tracking-[0.25em] mb-8">Session Details</h4>
               
               <div className="space-y-8">
                 <div className="flex items-center gap-5 border-b border-[#1E1B4B]/10 pb-6">
                   <div className="w-12 h-12 rounded-2xl bg-[#7A9482]/10 flex items-center justify-center border border-[#7A9482]/20">
                     <BrainCircuit className="w-6 h-6 text-[#7A9482]" />
                   </div>
                   <div>
                     <p className="text-[10px] text-[#1E1B4B]/50 font-bold uppercase tracking-widest">Type</p>
                     <p className="text-sm font-black">{session.service?.title || "Therapy"}</p>
                   </div>
                 </div>

                 <div className="flex items-center gap-5 border-b border-[#1E1B4B]/10 pb-6">
                   <div className="w-12 h-12 rounded-2xl bg-[#7A9482]/10 flex items-center justify-center border border-[#7A9482]/20">
                     <Clock className="w-6 h-6 text-[#7A9482]" />
                   </div>
                   <div>
                     <p className="text-[10px] text-[#1E1B4B]/50 font-bold uppercase tracking-widest">Length</p>
                     <p className="text-sm font-black">50 Minutes</p>
                   </div>
                 </div>

                 <div className="flex items-center gap-5">
                   <div className="w-12 h-12 rounded-2xl bg-[#7A9482]/10 flex items-center justify-center border border-[#7A9482]/20">
                     <ShieldCheck className="w-6 h-6 text-[#7A9482]" />
                   </div>
                   <div>
                     <p className="text-[10px] text-[#1E1B4B]/50 font-bold uppercase tracking-widest">Status</p>
                     <p className="text-sm font-black capitalize">{session.status}</p>
                   </div>
                 </div>
               </div>
            </div>

            {/* Support Action */}
            <button className="w-full flex items-center justify-between p-6 rounded-[2rem] bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] hover:-translate-y-1">
              <span className="flex items-center gap-4">
                <Headset className="w-6 h-6 text-[#7A9482]" />
                Concierge Support
              </span>
              <ChevronRight className="w-5 h-5 opacity-30" />
            </button>

          </div>
        </div>

        {/* Danger Zone Footer */}
        <footer className="mt-20 pt-10 border-t border-white/5 flex flex-col items-center gap-8 pb-10">
          <p className="text-sm text-white/40 text-center max-w-sm leading-relaxed">
            Policy: Cancellations made within 24 hours may incur a recovery fee. View our <Link href="#" className="text-[#7A9482] font-bold underline decoration-[#7A9482]/30 hover:text-white transition-colors">guidelines</Link>.
          </p>
          <button className="group flex items-center gap-3 text-red-400/80 font-black px-10 py-4 rounded-full hover:bg-red-400/10 transition-colors uppercase tracking-widest text-xs border border-red-400/20 active:scale-95">
             <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
             Cancel Session
          </button>
        </footer>
      </main>

    </div>
  );
}
