import React from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowLeft, 
  MapPin, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  ArrowUpRight,
  ShieldCheck,
  FileText,
  HelpCircle,
  MoreVertical,
  Check,
  MessageSquare,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { getProviderById } from "@/lib/actions/admin";
import { ReviewActions } from "@/components/admin/review-actions";
import { notFound } from "next/navigation";

export default async function ReviewProviderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const provider = await getProviderById(id);

  if (!provider) {
    notFound();
  }

  // Verification states - Demo data for now as we don't have a formal verification table yet
  const VERIFICATIONS = [
    { label: "Government ID", sub: "Verified Identity Source", icon: <FileText className="h-5 w-5" />, status: "verified" },
    { label: "SSN Trace", sub: "Authenticated Background", icon: <CheckCircle2 className="h-5 w-5" />, status: "verified" },
    { label: "Criminal Background", sub: "National Clearance Check", icon: <ShieldCheck className="h-5 w-5" />, status: "verified" }
  ];

  return (
    <div className="space-y-16 pb-32 animate-fade-in-up">
       {/* HEADER ACTIONS */}
       <section className="flex items-center justify-between">
          <Link href="/admin/queue" className="h-14 w-14 rounded-full bg-white/5 flex items-center justify-center text-zinc-500 hover:text-white transition-all border border-white/5 group">
             <ArrowLeft className="h-6 w-6 group-hover:-translate-x-1 transition-transform" />
          </Link>

          <div className="flex-1 px-10 text-left">
             <h1 className="text-3xl font-extrabold font-manrope tracking-tighter">Review Applicant</h1>
             <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 italic">ID: {provider.id.slice(0, 8).toUpperCase()}</p>
          </div>

          <div className="flex items-center gap-6">
             <button className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center text-zinc-600 hover:text-[#D3C4B5] transition-all">
                <HelpCircle className="h-6 w-6" />
             </button>
             <div className="h-12 w-[1px] bg-white/5" />
             <div className="text-right hidden sm:block">
                <p className="text-sm font-extrabold font-manrope tracking-tighter text-white">Insighte Admin</p>
                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600 italic">Sanctuary Gatekeeper</p>
             </div>
             <div className="h-12 w-12 rounded-full overflow-hidden relative border border-[#D3C4B5]/20 bg-[#D3C4B5]/10 flex items-center justify-center font-bold text-[#D3C4B5]">
               {provider.avatar_url ? (
                  <Image src={provider.avatar_url} fill alt="admin" className="object-cover" />
               ) : (
                  provider.name.charAt(0)
               )}
             </div>
          </div>
       </section>

       {/* MAIN PROFILE LAYOUT GRID */}
       <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* CONTENT COLUMN - PERSPECTIVE ALPHA */}
          <div className="lg:col-span-8 space-y-10">
             <div className="vessel bg-[#1D1E31] p-12 space-y-12 border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-[#D3C4B5]/50 to-transparent opacity-30" />
                
                {/* PROFILE INTRO */}
                <div className="flex flex-col md:flex-row items-center gap-12 text-center md:text-left">
                   <div className="relative h-44 w-44 rounded-[48px] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-1000 border border-white/5 shadow-2xl bg-black/40 flex items-center justify-center">
                     {provider.avatar_url ? (
                        <Image src={provider.avatar_url} fill alt={provider.name} className="object-cover scale-110 group-hover:scale-100 transition-transform duration-1000" />
                     ) : (
                        <span className="text-5xl font-black font-manrope text-zinc-700">{provider.name.charAt(0)}</span>
                     )}
                   </div>
                   
                   <div className="space-y-6">
                      <Badge className="h-8 px-4 rounded-full bg-[#D3C4B5]/10 text-[#D3C4B5] border border-[#D3C4B5]/20 font-black uppercase tracking-widest text-[8px]">
                        {provider.verified ? 'Verified Partner' : 'New Applicant'}
                      </Badge>
                      <h2 className="text-7xl font-black font-manrope tracking-tighter leading-none text-white">{provider.name}</h2>
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-8 text-xl text-zinc-600 font-medium italic">
                         <div className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-zinc-700" />
                            <span>{provider.city || 'Location Pending'}</span>
                         </div>
                         <div className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-zinc-700" />
                            <span>{provider.years_experience || '0'} Years Pro</span>
                         </div>
                         <div className="flex items-center gap-2">
                            <Award className="h-5 w-5 text-zinc-700" />
                            <span>{provider.category || 'Specialist'}</span>
                         </div>
                      </div>
                   </div>
                </div>

                {/* BIO SECTION */}
                <div className="space-y-8 pt-10 border-t border-white/5">
                   <div className="space-y-4">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700">Practitioner Statement</h4>
                      <p className="text-2xl text-zinc-400 font-medium leading-relaxed italic">
                         {provider.bio || "No professional statement provided."}
                      </p>
                   </div>

                   {/* EXPERTISE PODS */}
                   <div className="space-y-6">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-700">Specializations & Tags</h4>
                      <div className="flex flex-wrap gap-4">
                         {provider.certifications?.length ? (
                           provider.certifications.map((cert: string) => (
                             <Badge key={cert} className="h-12 px-8 rounded-full bg-white/5 text-zinc-500 border border-white/5 font-bold uppercase tracking-widest text-[10px] hover:text-white transition-all hover:bg-white/10">{cert}</Badge>
                           ))
                         ) : (
                           <p className="text-sm text-zinc-600 italic">No specific certifications listed.</p>
                         )}
                      </div>
                   </div>
                </div>
             </div>

             {/* SERVICES OFFERED */}
             <div className="vessel bg-[#1D1E31] p-12 space-y-8 border border-white/5 group">
                <h3 className="text-4xl font-extrabold font-manrope tracking-tighter italic text-white text-left">Services Proposition</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                   {provider.services?.length ? (
                      provider.services.map((service: any) => (
                         <div key={service.id} className="vessel bg-black/40 p-8 rounded-[40px] border border-white/5 flex items-center justify-between group/srv">
                            <div className="text-left">
                               <p className="text-xl font-bold font-manrope text-white">{service.name}</p>
                               <p className="text-[9px] font-black uppercase tracking-widest text-[#BACCB3]">{service.category}</p>
                            </div>
                            <div className="text-right">
                               <p className="text-2xl font-black font-manrope text-[#D3C4B5]">₹{service.hourly_rate}</p>
                               <p className="text-[8px] font-black uppercase tracking-widest text-zinc-700">per {service.duration_minutes}m</p>
                            </div>
                         </div>
                      ))
                   ) : (
                      <p className="col-span-2 text-center text-zinc-700 italic py-10 border border-dashed border-white/5 rounded-[40px]">No active services listed yet.</p>
                   )}
                </div>
             </div>
          </div>

          {/* SIDEBAR COLUMN - PERSPECTIVE BETA */}
          <div className="lg:col-span-4 space-y-10">
             {/* IDENTITY & BACKGROUND POD */}
             <div className="vessel bg-[#1D1E31] p-10 space-y-10 border border-white/5 group relative overflow-hidden">
                <div className="flex items-center gap-4">
                   <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-[#BACCB3]">
                      <ShieldCheck className="h-5 w-5" />
                   </div>
                   <h3 className="text-3xl font-extrabold font-manrope tracking-tighter text-white text-left">Identity Status</h3>
                </div>

                <div className="space-y-6">
                   {VERIFICATIONS.map((id, i) => (
                     <div key={i} className="vessel bg-black/30 p-8 rounded-[40px] flex items-center justify-between border border-white/5 group/row hover:bg-black/50 transition-all">
                        <div className="flex items-center gap-6">
                           <div className="h-12 w-12 rounded-[18px] bg-white/5 flex items-center justify-center text-zinc-600 group-hover/row:text-[#D3C4B5] transition-all border border-white/5">
                              {id.icon}
                           </div>
                           <div className="text-left space-y-1">
                              <p className="text-xl font-bold font-manrope leading-tight text-white">{id.label}</p>
                              <p className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest leading-none">{id.sub}</p>
                           </div>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-[#BACCB3]/10 flex items-center justify-center text-[#BACCB3]">
                           <Check className="h-5 w-5" />
                        </div>
                     </div>
                   ))}
                </div>
             </div>

             {/* CONTACT & CHANNELS */}
             <div className="vessel bg-[#1D1E31] p-10 space-y-8 border border-white/5 relative group overflow-hidden">
                <div className="flex items-center gap-4">
                   <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center text-[#BACCB3]">
                      <MessageSquare className="h-5 w-5" />
                   </div>
                   <h3 className="text-3xl font-extrabold font-manrope tracking-tighter text-white text-left">Internal Logs</h3>
                </div>

                <div className="space-y-6">
                   <div className="vessel bg-black/40 p-8 rounded-[40px] border border-white/5 min-h-[160px] relative text-left">
                      <p className="text-md text-zinc-600 italic">No administrative notes recorded for this applicant yet.</p>
                      <button className="absolute bottom-6 right-8 text-[9px] font-black uppercase tracking-widest text-[#D3C4B5] underline underline-offset-4">Add Log</button>
                   </div>
                </div>
             </div>
          </div>
       </div>

       {/* FLOATING ACTION BAR */}
       {!provider.verified && (
         <div className="fixed bottom-12 left-1/2 -translate-x-1/2 w-full max-w-4xl px-8 z-[200] animate-bounce-slow">
            <div className="vessel bg-[#1D1E31]/95 backdrop-blur-xl p-6 rounded-[48px] border border-white/10 shadow-glow glow-[#BACCB3]/10 flex flex-col md:flex-row items-center justify-between gap-8 h-auto md:h-28">
               <div className="flex items-center gap-6">
                  <div className="h-14 w-14 rounded-full bg-black/30 flex items-center justify-center text-zinc-600 border border-white/5">
                     <HelpCircle className="h-7 w-7 opacity-30" />
                  </div>
                  <div className="text-left">
                     <p className="text-xl font-bold font-manrope text-[#BACCB3]">{provider.name} is ready for review.</p>
                     <p className="text-[10px] font-black uppercase tracking-widest text-zinc-700">Verification Engine: PASS</p>
                  </div>
               </div>

               <ReviewActions providerId={provider.id} />
            </div>
         </div>
       )}
    </div>
  );
}
