import React from "react";
import Image from "next/image";
import { 
  Plus, 
  Search, 
  MapPin, 
  Star,
  ChevronLeft,
  ChevronRight,
  Bookmark,
  SlidersHorizontal
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { getApprovedProviders } from "@/lib/actions/admin";

export default async function FindSpecialistPage() {
  const specialists = await getApprovedProviders();

  return (
    <div className="space-y-16 pb-24 animate-fade-in-up text-zinc-100">
       {/* HEADER & SEARCH pods */}
       <section className="flex flex-col lg:flex-row items-end justify-between gap-12">
          <div className="space-y-4 max-w-2xl text-center lg:text-left">
             <h1 className="text-8xl font-black font-manrope tracking-tighter leading-[0.85] text-white">Find Specialist</h1>
             <p className="text-2xl text-zinc-400 font-medium italic">
                Connecting families with our elite network of developmental and pediatric care experts.
             </p>
          </div>

          <div className="vessel bg-[#1D1E31] p-3 rounded-full flex items-center gap-4 border border-white/5 w-full lg:max-w-md shadow-2xl">
             <div className="h-14 w-14 rounded-full bg-white/5 flex items-center justify-center text-zinc-600">
                <Search className="h-6 w-6" />
             </div>
             <Input 
                className="bg-transparent border-none text-xl font-manrope font-bold placeholder:text-zinc-800 focus-visible:ring-0 text-white" 
                placeholder="Search by name or specialty..."
             />
             <Button className="h-14 w-14 rounded-full bg-[#D3C4B5] text-[#382F24] p-0 flex items-center justify-center shrink-0">
                <SlidersHorizontal className="h-6 w-6" />
             </Button>
          </div>
       </section>

       {/* SPECIALIST GRID */}
       <section className="stagger-1">
          {specialists.length === 0 ? (
            <div className="vessel bg-[#1D1E31] p-24 text-center space-y-6 border border-white/5">
               <p className="text-2xl text-zinc-600 font-medium italic">No approved specialists found in the sanctuary yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               {specialists.map(specialist => (
                  <div key={specialist.id} className="vessel bg-[#1D1E31] p-10 space-y-10 border border-white/5 hover:border-white/10 transition-all group overflow-hidden relative">
                     {/* SPECIALIST INTRO */}
                     <div className="flex items-start justify-between">
                        <div className="flex items-center gap-8 text-left">
                           <div className="relative h-28 w-28 rounded-[40px] overflow-hidden border-2 border-white/5 bg-white/5 flex items-center justify-center font-black text-4xl text-zinc-700">
                              {specialist.name[0]}
                           </div>
                           <div className="space-y-2">
                              <Badge className="h-8 px-4 rounded-full bg-black/40 text-[#BACCB3] border border-[#BACCB3]/20 font-black uppercase tracking-widest text-[8px]">
                                 Available Now
                              </Badge>
                              <h3 className="text-4xl font-extrabold font-manrope tracking-tighter text-white">{specialist.name}</h3>
                              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-600 leading-none">{specialist.category} Specialization</p>
                           </div>
                        </div>
                        <button className="h-12 w-12 rounded-full bg-white/5 flex items-center justify-center text-zinc-800 hover:text-[#D3C4B5] transition-all border border-white/5">
                           <Bookmark className="h-6 w-6" />
                        </button>
                     </div>

                     {/* PERFORMANCE & STATS */}
                     <div className="grid grid-cols-2 gap-6">
                        <div className="vessel bg-black/30 p-8 rounded-[40px] border border-white/5 flex items-baseline justify-between">
                           <div className="flex items-center gap-2 text-white">
                              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                              <span className="text-3xl font-black font-manrope tracking-tighter">5.0</span>
                           </div>
                           <p className="text-[9px] font-black text-zinc-700 uppercase tracking-widest leading-none">Elite Status</p>
                        </div>
                        <div className="vessel bg-black/30 p-8 rounded-[40px] border border-white/5 flex items-baseline justify-between overflow-hidden">
                           <div className="flex items-center gap-2 truncate">
                              <MapPin className="h-5 w-5 text-zinc-700" />
                              <span className="text-xl font-bold font-manrope tracking-tighter truncate text-zinc-400">Main Center</span>
                           </div>
                        </div>
                     </div>

                     {/* BIO / TAGS */}
                     <div className="space-y-4">
                        <p className="text-md text-zinc-500 italic line-clamp-2">{specialist.bio || "No biography provided for this specialist."}</p>
                        <div className="flex flex-wrap gap-3">
                           {specialist.languages?.map((lang: string) => (
                             <Badge key={lang} className="h-10 px-6 rounded-full bg-white/5 text-zinc-600 font-bold uppercase tracking-widest text-[9px] border-none group-hover:bg-white/10 transition-colors">{lang}</Badge>
                           ))}
                           <Badge className="h-10 px-6 rounded-full bg-white/5 text-zinc-600 font-bold uppercase tracking-widest text-[9px] border-none group-hover:bg-white/10 transition-colors uppercase italic">{specialist.experience_years || "8"} EXP</Badge>
                        </div>
                     </div>

                     {/* FOOTER ACTIONS */}
                     <div className="flex items-center justify-between pt-10 border-t border-white/5">
                        <div className="flex -space-x-4">
                           {[1, 2, 3].map(i => (
                             <div key={i} className="h-10 w-10 rounded-full border-2 border-[#1D1E31] bg-zinc-800 flex items-center justify-center font-black text-[10px] text-zinc-700">
                                {i}
                             </div>
                           ))}
                           <div className="h-10 w-24 px-4 pr-1 rounded-full border-2 border-[#1D1E31] bg-black/40 flex items-center justify-center font-black text-[8px] text-zinc-500 uppercase tracking-widest pl-6">
                              +12 Family referrals
                           </div>
                        </div>
                        <button className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-zinc-400 hover:text-[#D3C4B5] transition-colors group/btn">
                           Book Session
                           <div className="h-12 w-12 rounded-full bg-[#BACCB3] text-[#382F24] flex items-center justify-center group-hover/btn:scale-110 transition-transform">
                              <Plus className="h-6 w-6" />
                           </div>
                        </button>
                     </div>
                  </div>
               ))}
            </div>
          )}
       </section>

       {/* PAGINATION */}
       <section className="flex items-center justify-center animate-fade-in-up stagger-2">
          <div className="vessel bg-[#1D1E31] p-3 rounded-full border border-white/5 flex items-center gap-4">
             <button className="h-10 w-10 rounded-full flex items-center justify-center text-zinc-600 hover:text-white hover:bg-white/5 transition-all">
                <ChevronLeft className="h-5 w-5" />
             </button>
             <div className="flex items-center gap-2 font-manrope font-black text-[10px] text-zinc-700 px-4">
                PAGE 01 OF 01
             </div>
             <button className="h-10 w-10 rounded-full flex items-center justify-center text-zinc-600 hover:text-white hover:bg-white/5 transition-all">
                <ChevronRight className="h-5 w-5" />
             </button>
          </div>
       </section>
    </div>
  );
}
