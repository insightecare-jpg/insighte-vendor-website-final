import React from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Users, 
  ShieldCheck, 
  Plus, 
  MoreVertical,
  Clock,
  ArrowUpRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getPendingApprovals } from "@/lib/actions/admin";

export default async function QueuePage() {
  const pending = await getPendingApprovals();

  const RECENT_ACTIVITY = [
    { provider: "Database Sync", specialty: "System", date: "Today", stage: "Ready", color: "bg-blue-500/10 text-blue-400" },
  ];

  return (
    <div className="space-y-16 pb-20 text-zinc-100">
       {/* HEADER SECTION */}
       <section className="flex flex-col md:flex-row items-center justify-between gap-8 animate-fade-in-up">
          <div className="space-y-4 text-center md:text-left">
             <div className="flex items-center justify-center md:justify-start gap-4">
                <h1 className="text-6xl font-extrabold font-manrope tracking-tighter leading-none text-white">Provider Approval Queue</h1>
                <Badge className="h-10 px-6 rounded-full bg-[#1D1E31] text-[#D3C4B5] border border-white/5 font-black uppercase tracking-widest text-[9px]">
                  {pending.length} Pending Review
                </Badge>
             </div>
             <p className="text-xl text-zinc-400 font-medium italic max-w-xl">
                Review and verify new childcare specialist applications. Maintain the institutional standard of Sanctuary excellence.
             </p>
          </div>
       </section>

       {/* APPLICANT GRID */}
       <section className="animate-fade-in-up stagger-1">
          {pending.length === 0 ? (
            <div className="vessel bg-[#1D1E31] p-24 text-center space-y-6 border border-white/5">
               <ShieldCheck className="h-16 w-16 mx-auto text-zinc-700 opacity-20" />
               <p className="text-2xl text-zinc-600 font-medium italic">All applications have been processed. Great work.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
               {pending.map((applicant) => (
                  <div key={applicant.id} className="vessel bg-[#1D1E31] p-10 space-y-10 group hover:scale-[1.02] transition-all duration-700 hover:bg-[#252640] shadow-3xl overflow-hidden relative border border-white/5">
                     <div className="flex items-start justify-between">
                        <div className="relative h-24 w-24 rounded-[32px] overflow-hidden bg-white/5 flex items-center justify-center font-black text-zinc-700">
                           {applicant.name[0]}
                        </div>
                        <Badge className="h-8 px-4 rounded-full bg-[#D3C4B5]/10 text-[#D3C4B5] border border-[#D3C4B5]/20 font-black uppercase tracking-widest text-[8px]">New Applicant</Badge>
                     </div>

                     <div className="space-y-4">
                        <h3 className="text-3xl font-extrabold font-manrope tracking-tighter text-white">{applicant.name}</h3>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#BACCB3]">{applicant.category} Specialty</p>
                     </div>

                     <div className="space-y-6 pt-6 border-t border-white/5">
                        <div className="flex items-center justify-between">
                           <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Verification Status</p>
                           <p className="text-lg font-bold font-manrope text-[#BACCB3]">15%</p>
                        </div>
                        <div className="h-3 w-full bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/5">
                           <div className="h-full bg-gradient-to-r from-[#D3C4B5] to-[#BACCB3] rounded-full shadow-glow glow-[#BACCB3]/30" style={{ width: `15%` }} />
                        </div>
                     </div>

                     <div className="flex flex-wrap gap-2 pt-4">
                        {applicant.languages?.map((lang: string) => (
                          <Badge key={lang} className="h-8 px-4 rounded-full bg-white/5 text-zinc-400 font-bold uppercase tracking-widest text-[8px] border-none">{lang}</Badge>
                        ))}
                     </div>

                     <Link href={`/admin/queue/${applicant.id}`}>
                        <Button className="h-16 w-full mt-6 rounded-full bg-[#D3C4B5] text-[#382F24] font-black uppercase tracking-widest text-[9px] hover:shadow-2xl shadow-[#D3C4B5]/10 transition-all">
                          Review Application
                        </Button>
                     </Link>
                  </div>
               ))}
               
               {/* MANUAL INVITE CARD */}
               <div className="vessel bg-transparent border-4 border-dashed border-white/5 p-10 flex flex-col items-center justify-center text-center space-y-8 hover:border-[#D3C4B5]/20 transition-all group pointer-events-auto cursor-pointer">
                  <div className="h-24 w-24 rounded-full bg-white/5 flex items-center justify-center text-zinc-700 group-hover:text-[#D3C4B5] transition-all">
                     <Plus className="h-10 w-10" />
                  </div>
                  <div className="space-y-2">
                     <h3 className="text-3xl font-extrabold font-manrope tracking-tighter text-zinc-700">Manual Invite</h3>
                     <p className="text-xs font-medium text-zinc-800 italic max-w-[200px] mx-auto">Send an application link to a known provider architecture.</p>
                  </div>
               </div>
            </div>
          )}
       </section>

       {/* ACTIVITY LOG */}
       <section className="animate-fade-in-up stagger-2">
          <div className="vessel bg-[#1D1E31] p-0 rounded-[48px] overflow-hidden border border-white/5">
             <div className="p-10 border-b border-white/5 flex items-center justify-between">
                <h2 className="text-3xl font-black font-manrope tracking-tighter uppercase italic text-white">Recent Activity Log</h2>
                <Button variant="ghost" className="text-xs font-black uppercase tracking-widest text-[#D3C4B5]">View Full History</Button>
             </div>

             <div className="overflow-x-auto">
                <table className="w-full text-left font-white">
                   <thead>
                      <tr className="border-b border-white/5 text-[10px] font-black uppercase tracking-[0.3em] text-zinc-700">
                         <th className="px-12 py-10">Provider</th>
                         <th className="px-12 py-10">Specialty</th>
                         <th className="px-12 py-10">Submitted Date</th>
                         <th className="px-12 py-10">Stage</th>
                         <th className="px-12 py-10">Action</th>
                      </tr>
                   </thead>
                   <tbody className="divide-y divide-white/5">
                      {RECENT_ACTIVITY.map((act, i) => (
                        <tr key={i} className="group hover:bg-white/5 transition-all text-white">
                           <td className="px-12 py-10">
                              <div className="flex items-center gap-6">
                                 <div className="h-12 w-12 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-black text-white">{act.provider.split(' ').map(n=>n[0]).join('')}</div>
                                 <span className="text-xl font-bold font-manrope">{act.provider}</span>
                              </div>
                           </td>
                           <td className="px-12 py-10 text-xl font-bold font-manrope text-zinc-500">{act.specialty}</td>
                           <td className="px-12 py-10 text-xl font-bold font-manrope text-zinc-500">{act.date}</td>
                           <td className="px-12 py-10">
                              <Badge className={cn("h-10 px-6 rounded-full font-black uppercase tracking-widest text-[9px] border-none", act.color)}>
                                 {act.stage}
                              </Badge>
                           </td>
                           <td className="px-12 py-10">
                              <button className="h-10 w-10 flex items-center justify-center hover:bg-white/10 rounded-full text-zinc-600 hover:text-white transition-all">
                                 <MoreVertical className="h-5 w-5" />
                              </button>
                           </td>
                        </tr>
                      ))}
                   </tbody>
                </table>
             </div>
          </div>
       </section>
    </div>
  );
}
