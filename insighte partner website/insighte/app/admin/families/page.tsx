import React from "react";
import Image from "next/image";
import { 
  Plus, 
  MapPin, 
  Users, 
  ArrowUpRight, 
  TrendingUp, 
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getAllFamilies, type Family, type Child } from "@/lib/actions/admin";

export default async function FamilySanctuaryPage() {
  const families = await getAllFamilies();

  return (
    <div className="space-y-16 pb-24 text-zinc-100">
       {/* HEADER & STATS PODS */}
       <section className="flex flex-col lg:flex-row items-end justify-between gap-12 animate-fade-in-up">
          <div className="space-y-4 max-w-2xl text-center lg:text-left">
             <h1 className="text-8xl font-black font-manrope tracking-tighter leading-[0.85]">Family Sanctuary</h1>
             <p className="text-2xl text-zinc-400 font-medium italic">
                Nurturing connections between {families.length} registered families and our developmental programs.
             </p>
          </div>

          <div className="flex items-center gap-6 w-full lg:w-auto overflow-hidden">
             <div className="vessel bg-[#1D1E31] p-8 min-w-[200px] flex-1 lg:flex-none space-y-4 border border-white/5">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Registered Families</p>
                <div className="flex items-baseline gap-2">
                   <h2 className="text-4xl font-manrope font-black text-white">{families.length}</h2>
                   <span className="text-[10px] font-bold text-[#BACCB3]">+0%</span>
                </div>
             </div>
             <div className="vessel bg-[#1D1E31] p-8 min-w-[200px] flex-1 lg:flex-none space-y-4 border border-white/5">
                <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Revenue Forecast</p>
                <div className="flex items-baseline gap-2">
                   <h2 className="text-4xl font-manrope font-black text-white">₹0.0k</h2>
                   <TrendingUp className="h-4 w-4 text-[#BACCB3]" />
                </div>
             </div>
          </div>
       </section>

       {/* FAMILY GRID */}
       <section className="animate-fade-in-up stagger-1">
          {families.length === 0 ? (
            <div className="vessel bg-[#1D1E31] p-24 text-center space-y-6 border border-white/5">
               <Users className="h-16 w-16 mx-auto text-zinc-700 opacity-20" />
               <p className="text-2xl text-zinc-600 font-medium italic">No families registered in the sanctuary yet.</p>
               <Button className="h-14 px-10 rounded-full bg-white/5 text-zinc-400 border border-white/5 hover:text-white transition-all">Invite First Family</Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               {families.map((family: Family) => (
                  <div key={family.id} className="vessel bg-[#1D1E31] p-10 space-y-10 border border-white/5 hover:border-white/10 transition-all group overflow-hidden relative">
                     {/* PARENT INTRO */}
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                           <div className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-white/5 group-hover:border-[#D3C4B5]/20 transition-all bg-white/5 flex items-center justify-center font-black text-zinc-700">
                              {family.name[0]}
                           </div>
                           <div className="text-left space-y-1">
                              <h3 className="text-3xl font-extrabold font-manrope tracking-tighter text-white">{family.name}</h3>
                              <div className="flex items-center gap-2 text-zinc-500">
                                 <MapPin className="h-3 w-3" />
                                 <span className="text-[10px] font-bold tracking-tight">Main Campus</span>
                              </div>
                           </div>
                        </div>
                        <Badge className="h-10 px-6 rounded-full font-black uppercase tracking-widest text-[9px] border border-white/5 bg-white/5 text-zinc-500">
                           Active Plan
                        </Badge>
                     </div>

                     {/* CHILDREN STACK */}
                     <div className="space-y-6">
                        {family.children?.map((child: Child, iNum: number) => (
                          <div key={iNum} className="vessel bg-black/30 p-8 rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-6 border border-white/5">
                             <div className="text-left space-y-1">
                                <h4 className="text-2xl font-bold font-manrope text-white">{child.name}</h4>
                                <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{child.age} Years</p>
                             </div>
                             <div className="flex flex-wrap gap-2 justify-end text-white">
                                {child.goals?.split(',').map((tag: string) => (
                                  <Badge key={tag} className="h-8 px-4 rounded-full bg-white/5 text-zinc-400 font-black uppercase tracking-widest text-[8px] border-none">{tag.trim()}</Badge>
                                ))}
                             </div>
                          </div>
                        ))}
                     </div>

                     {/* FOOTER ACTIONS */}
                     <div className="flex items-center justify-between pt-10 border-t border-white/5">
                        <div className="flex items-center gap-4">
                           <CheckCircle2 className="h-5 w-5 text-[#BACCB3]" />
                           <span className="text-md font-bold italic text-zinc-500">
                             Payments: Current
                           </span>
                        </div>
                        <button className="flex items-center gap-3 text-sm font-black uppercase tracking-widest text-zinc-400 hover:text-[#D3C4B5] transition-colors group/btn">
                           View Profile
                           <ArrowUpRight className="h-5 w-5 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
                        </button>
                     </div>
                  </div>
               ))}
            </div>
          )}
       </section>

       {/* PAGINATION POD */}
       <section className="flex items-center justify-center animate-fade-in-up stagger-2">
          <div className="vessel bg-[#1D1E31] p-3 rounded-full border border-white/5 flex items-center gap-4">
             <button className="h-10 w-10 rounded-full flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/5 transition-all">
                <ChevronLeft className="h-5 w-5" />
             </button>
             <div className="flex items-center gap-2">
                {[1].map((p, i) => (
                  <button 
                    key={i}
                    className={cn(
                      "h-10 w-10 rounded-full text-xs font-black transition-all",
                      p === 1 ? "bg-[#BACCB3] text-[#382F24]" : "text-zinc-500 hover:text-white"
                    )}
                  >
                    {p}
                  </button>
                ))}
             </div>
             <button className="h-10 w-10 rounded-full flex items-center justify-center text-zinc-500 hover:text-white hover:bg-white/5 transition-all">
                <ChevronRight className="h-5 w-5" />
             </button>
          </div>
       </section>

       {/* INVITE PARENT FAB */}
       <div className="fixed bottom-12 right-12 z-[200]">
          <Button className="h-20 w-20 rounded-full bg-[#D3C4B5] text-[#382F24] p-0 shadow-3xl shadow-[#D3C4B5]/40 hover:scale-110 transition-all border-4 border-[#111224]">
             <Users className="h-8 w-8" />
             <div className="absolute -top-1 -right-1 h-6 w-6 bg-white rounded-full flex items-center justify-center text-[#111224]">
                <Plus className="h-4 w-4" />
             </div>
          </Button>
       </div>
    </div>
  );
}
