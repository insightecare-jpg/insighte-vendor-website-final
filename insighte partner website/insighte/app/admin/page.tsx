import { 
  Users, 
  ShieldCheck, 
  Calendar, 
  TrendingUp, 
  ArrowUpRight, 
  Activity, 
  Plus,
  Search,
  Clock,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { getAllFamilies, getPendingApprovals, getAllBookings, getTotalRevenue } from "@/lib/actions/admin";

export default async function AdminOverviewPage() {
  const [families, pending, bookings, revenue] = await Promise.all([
    getAllFamilies(),
    getPendingApprovals(),
    getAllBookings(),
    getTotalRevenue()
  ]);

  const STATS = [
    { label: "Active Families", value: families.length.toString(), change: "+0%", icon: <Users className="h-5 w-5" /> },
    { label: "Pending Approvals", value: pending.length.toString(), change: `${pending.length} critical`, icon: <ShieldCheck className="h-5 w-5" /> },
    { label: "Bookings Today", value: bookings.length.toString(), change: "+0%", icon: <Calendar className="h-5 w-5" /> },
    { label: "Monthly Revenue", value: `₹${(revenue/1000).toFixed(1)}k`, change: "+12%", icon: <TrendingUp className="h-5 w-5" /> },
  ];

  const RECENT_ALERTS = [
    { type: "system", title: "Supabase Integration Live", time: "just now", priority: "high" },
    { type: "system", title: "Schema Migration Complete", time: "5m ago", priority: "normal" },
  ];

  return (
    <div className="space-y-16 pb-24 animate-fade-in-up">
       {/* HEADER & WELCOME */}
       <section className="flex flex-col lg:flex-row items-end justify-between gap-12 text-zinc-100">
          <div className="space-y-4 max-w-2xl text-center lg:text-left">
             <h1 className="text-8xl font-black font-manrope tracking-tighter leading-[0.85]">Sanctuary Overview</h1>
             <p className="text-2xl text-zinc-400 font-medium italic">
                The pulse of Insighte. Monitoring connections, approvals, and the growth of our child-first sanctuary.
             </p>
          </div>

          <div className="flex items-center gap-4">
             <Button className="h-16 px-10 rounded-full bg-[#D3C4B5] text-[#382F24] font-black uppercase tracking-widest text-[9px] hover:bg-white transition-all shadow-glow glow-[#D3C4B5]/20">
                Generate Report <Activity className="ml-3 h-4 w-4" />
             </Button>
          </div>
       </section>

       {/* STATS GRID */}
       <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <div key={i} className="vessel bg-[#1D1E31] p-10 space-y-6 border border-white/5 hover:border-white/10 transition-all group">
               <div className="flex items-center justify-between">
                  <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500 group-hover:text-[#D3C4B5] transition-all">
                     {stat.icon}
                  </div>
                  <Badge className="h-8 px-4 rounded-full bg-black/40 text-[#BACCB3] border border-white/5 font-black text-[9px]">
                     {stat.change}
                  </Badge>
               </div>
               <div>
                  <h2 className="text-5xl font-black font-manrope tracking-tighter text-white">{stat.value}</h2>
                  <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mt-2">{stat.label}</p>
               </div>
            </div>
          ))}
       </section>

       {/* MAIN DASHBOARD CONTENT */}
       <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* ACTION CENTER */}
          <div className="lg:col-span-8 space-y-10">
             <div className="vessel bg-[#1D1E31] p-12 space-y-12 border border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-[#D3C4B5]/50 to-transparent opacity-30" />
                
                <div className="flex items-center justify-between">
                   <h3 className="text-4xl font-extrabold font-manrope tracking-tighter italic text-white">Pending Operations</h3>
                   <Link href="/admin/queue" className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors group/link">
                      <span className="text-[9px] font-black uppercase tracking-widest">Go to queue</span>
                      <ArrowUpRight className="h-4 w-4 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                   </Link>
                </div>

                <div className="space-y-6">
                   {pending.length === 0 ? (
                     <div className="p-12 text-center text-zinc-600 italic">No pending applications in the sanctuary.</div>
                   ) : (
                     pending.map((item, i) => (
                       <div key={i} className="vessel bg-black/30 p-8 rounded-[48px] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 group/item hover:bg-black/50 transition-all">
                          <div className="flex items-center gap-6 text-left">
                             <div className="h-16 w-16 rounded-[24px] bg-white/5 border border-white/10 flex items-center justify-center font-manrope font-black text-xs text-zinc-600 group-hover/item:text-[#D3C4B5] transition-all">
                                {item.name.split(' ').map((n: string)=>n[0]).join('')}
                             </div>
                             <div className="space-y-1">
                                <h4 className="text-2xl font-bold font-manrope leading-tight text-white">{item.name}</h4>
                                <p className="text-[9px] font-black uppercase tracking-widest text-[#BACCB3]">{item.category}</p>
                             </div>
                          </div>

                          <div className="flex-1 max-w-xs w-full space-y-3">
                             <div className="flex items-center justify-between">
                                <p className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Review Required</p>
                                <p className="text-xs font-bold font-manrope text-white">0%</p>
                             </div>
                             <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden p-0.5 border border-white/5">
                                <div className="h-full bg-[#D3C4B5] rounded-full" style={{ width: `0%` }} />
                             </div>
                          </div>

                          <Link href={`/admin/queue/${item.id}`}>
                            <Button className="h-14 px-8 rounded-full bg-white/5 text-[#D3C4B5] font-black uppercase tracking-widest text-[8px] hover:bg-[#D3C4B5] hover:text-[#382F24] transition-all border border-white/5">Review</Button>
                          </Link>
                       </div>
                     ))
                   )}
                </div>
             </div>
          </div>

          {/* SIDEBAR PODS */}
          <div className="lg:col-span-4 space-y-10">
             {/* ALERTS & NOTIFICATIONS */}
             <div className="vessel bg-[#1D1E31] p-10 space-y-8 border border-white/5 relative overflow-hidden group">
                <div className="flex items-center gap-4">
                   <div className="h-10 w-10 rounded-full bg-white/5 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-[#BACCB3]" />
                   </div>
                   <h3 className="text-3xl font-extrabold font-manrope tracking-tighter text-white">Live Activity</h3>
                </div>

                <div className="space-y-8">
                   {RECENT_ALERTS.map((alert, i) => (
                     <div key={i} className="flex gap-6 group/alert cursor-pointer ring-0 hover:ring-1 ring-white/5 rounded-[24px] p-2 transition-all">
                        <div className={cn(
                          "h-12 w-1.5 rounded-full transition-all group-hover/alert:h-14",
                          alert.priority === 'critical' ? 'bg-red-500' : alert.priority === 'high' ? 'bg-[#D3C4B5]' : 'bg-green-500/40'
                        )} />
                        <div className="space-y-2 text-left">
                           <p className="text-xl font-bold font-manrope leading-tight group-hover/alert:text-[#D3C4B5] transition-colors text-white">{alert.title}</p>
                           <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 italic leading-none">{alert.time} — Sanctuary System</p>
                        </div>
                     </div>
                   ))}
                </div>

                <button className="h-16 w-full rounded-full bg-white/5 text-zinc-500 font-black uppercase tracking-widest text-[9px] hover:text-white transition-all border border-white/5">
                   Show All Events
                </button>
             </div>

             {/* QUICK ACCESS ACTIONS */}
             <div className="grid grid-cols-2 gap-6">
                <button className="vessel bg-white/5 h-48 border border-white/5 flex flex-col items-center justify-center space-y-4 hover:bg-[#D3C4B5] group transition-all text-center p-6">
                   <div className="h-16 w-16 rounded-full bg-black/40 flex items-center justify-center text-zinc-600 group-hover:text-[#382F24] transition-all">
                      <Plus className="h-8 w-8" />
                   </div>
                   <span className="text-[9px] font-black uppercase tracking-widest group-hover:text-[#382F24]">Invite Specialist</span>
                </button>
                <Link href="/admin/hub" className="w-full">
                  <div className="vessel bg-white/5 h-48 border border-white/5 flex flex-col items-center justify-center space-y-4 hover:bg-[#BACCB3] group transition-all text-center p-6 cursor-pointer">
                    <div className="h-16 w-16 rounded-full bg-black/40 flex items-center justify-center text-zinc-600 group-hover:text-[#253423] transition-all">
                        <FileText className="h-8 w-8" />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest group-hover:text-[#253423]">Manage Wisdom Hub</span>
                  </div>
                </Link>
             </div>
          </div>
       </div>
    </div>
  );
}
