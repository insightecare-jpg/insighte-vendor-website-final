import React from "react";
import Image from "next/image";
import { 
  Plus, 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  MessageSquare, 
  X,
  RefreshCw,
  Calendar,
  Waves,
  CalendarCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getAdminBookings, type AdminBooking } from "@/lib/actions/admin";

export default async function BookingsHubPage() {
  const allBookings = await getAdminBookings();

  // Simple categorization by time for demo (real logic would parse the start_time)
  const morningSessions = allBookings.filter((b: AdminBooking) => {
    const hour = parseInt(b.start_time.split(":")[0]);
    return hour < 12;
  });

  const afternoonSessions = allBookings.filter((b: AdminBooking) => {
    const hour = parseInt(b.start_time.split(":")[0]);
    return hour >= 12;
  });

  const DAYS = [
    { day: "MON", date: "12", active: true },
    { day: "TUE", date: "13", active: false },
    { day: "WED", date: "14", active: false },
    { day: "THU", date: "15", active: false },
    { day: "FRI", date: "16", active: false },
    { day: "SAT", date: "17", active: false },
    { day: "SUN", date: "18", active: false },
  ];

  return (
    <div className="space-y-12 pb-24 text-zinc-100">
       {/* HEADER SECTION */}
       <section className="flex flex-col md:flex-row items-center justify-between gap-8 animate-fade-in-up">
          <div className="space-y-3">
             <h1 className="text-6xl font-extrabold font-manrope tracking-tighter leading-none text-white">Admin Dashboard</h1>
             <p className="text-xl text-zinc-400 font-medium italic max-w-xl">
                Manage therapeutic sessions and classroom schedules in your sanctuary of calm efficiency.
             </p>
          </div>
          <div className="flex items-center gap-6">
             <Button variant="outline" className="h-16 px-10 rounded-full border-white/5 bg-[#1D1E31] text-zinc-300 font-black uppercase tracking-widest text-[10px] hover:text-[#D3C4B5] transition-all">
                <Filter className="h-5 w-5 mr-3" /> Filters
             </Button>
             <Button className="h-16 px-10 rounded-full bg-[#D3C4B5] text-[#382F24] font-black uppercase tracking-widest text-[10px] hover:bg-white transition-all shadow-2xl shadow-[#D3C4B5]/20">
                <Plus className="h-5 w-5 mr-3" /> New Booking
             </Button>
          </div>
       </section>

       {/* DATE PICKER POD */}
       <section className="animate-fade-in-up stagger-1">
          <div className="vessel bg-[#1D1E31]/40 border border-white/10 p-4 rounded-[48px] flex items-center gap-6 overflow-hidden max-w-2xl">
             <button className="h-14 w-14 rounded-full bg-white/5 flex items-center justify-center text-zinc-600 hover:text-white transition-all">
                <ChevronLeft className="h-6 w-6" />
             </button>
             
             <div className="flex-1 flex items-center justify-around overflow-x-auto no-scrollbar py-2">
                {DAYS.map(day => (
                  <button 
                    key={day.date}
                    className={cn(
                      "flex flex-col items-center justify-center gap-1 min-w-[80px] h-[90px] rounded-[32px] transition-all duration-500",
                      day.active 
                        ? "bg-[#BACCB3] text-[#382F24] shadow-2xl shadow-[#BACCB3]/20" 
                        : "text-zinc-500 hover:text-zinc-200 hover:bg-white/5"
                    )}
                  >
                    <span className="text-[10px] font-black tracking-widest">{day.day}</span>
                    <span className="text-2xl font-manrope font-black">{day.date}</span>
                  </button>
                ))}
             </div>

             <button className="h-14 w-14 rounded-full bg-white/5 flex items-center justify-center text-zinc-600 hover:text-white transition-all">
                <ChevronRight className="h-6 w-6" />
             </button>
          </div>
       </section>

       {/* MORNING SESSIONS */}
       <section className="space-y-12 animate-fade-in-up stagger-2">
          <div className="flex items-center gap-8">
             <div className="h-[1px] flex-1 bg-white/5" />
             <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-700">Morning Sessions</h2>
             <div className="h-[1px] flex-1 bg-white/5" />
          </div>

          <div className="grid grid-cols-1 gap-10">
             {morningSessions.length === 0 ? (
               <div className="vessel bg-[#1D1E31] p-24 text-center border border-white/5">
                  <p className="text-xl text-zinc-600 font-medium italic">No sessions scheduled for this morning.</p>
               </div>
             ) : (
               morningSessions.map((booking) => (
                <div key={booking.id} className="vessel bg-[#1D1E31] p-12 space-y-10 group relative border border-white/5 overflow-hidden">
                    <div className="absolute top-0 right-0 h-40 w-40 bg-gradient-to-bl from-[#BACCB3]/5 to-transparent pointer-events-none" />
                    
                    <div className="flex flex-col md:flex-row items-center gap-10">
                      <div className="h-20 w-20 rounded-[28px] bg-black/40 flex items-center justify-center p-5 border border-white/5">
                          <div className="h-full w-full bg-[#382F24] rounded-full p-2 flex items-center justify-center shadow-inner text-white font-black">
                            {booking.child_name[0]}
                          </div>
                      </div>

                      <div className="flex-1 space-y-4 text-center md:text-left">
                          <div className="flex flex-col md:flex-row items-center gap-6">
                            <h3 className="text-4xl font-extrabold font-manrope tracking-tighter text-white">{booking.child_name}</h3>
                            <Badge className="h-10 px-6 rounded-full bg-[#3D4536]/40 text-[#BACCB3] border border-[#BACCB3]/20 font-black uppercase tracking-widest text-[9px] mix-blend-screen">{booking.service_category}</Badge>
                          </div>
                          <div className="flex items-center justify-center md:justify-start gap-4 text-xl text-zinc-500 font-medium italic">
                            <Clock className="h-5 w-5 text-zinc-700" />
                            <span>{booking.start_time} - {booking.end_time}</span>
                          </div>
                      </div>

                      <div className="flex items-center gap-4">
                          <button className="h-14 w-14 rounded-full bg-white/5 flex items-center justify-center text-zinc-500 hover:text-white transition-all border border-white/5">
                            <RefreshCw className="h-6 w-6" />
                          </button>
                          <button className="h-14 w-14 rounded-full bg-white/5 flex items-center justify-center text-zinc-500 hover:text-white transition-all border border-white/5">
                            <MessageSquare className="h-6 w-6" />
                          </button>
                          <button className="h-14 w-14 rounded-full bg-white/5 flex items-center justify-center text-zinc-500 hover:text-red-400 transition-all border border-white/5">
                            <X className="h-6 w-6" />
                          </button>
                      </div>
                    </div>

                    <div className="bg-black/30 rounded-[40px] p-8 mt-10 flex flex-col md:flex-row items-center justify-between gap-8 border border-white/5">
                      <div className="flex items-center gap-6">
                          <div className="relative h-14 w-14 rounded-full bg-white/10 flex items-center justify-center font-black text-zinc-700 border-2 border-[#D3C4B5]/20">
                            {booking.provider_name[0]}
                          </div>
                          <div className="text-left">
                            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 mb-1">Assigned Provider</p>
                            <p className="text-xl font-bold font-manrope text-white">{booking.provider_name}</p>
                          </div>
                      </div>

                      <Badge className={cn("h-10 px-6 rounded-full font-black uppercase tracking-widest text-[9px]", 
                        booking.status === 'confirmed' ? "bg-[#BACCB3]/10 text-[#BACCB3]" : "bg-zinc-800 text-zinc-500")}>
                        {booking.status}
                      </Badge>
                    </div>
                </div>
               ))
             )}
          </div>
       </section>

       {/* AFTERNOON SESSIONS */}
       <section className="space-y-12 animate-fade-in-up stagger-3 pt-12">
          <div className="flex items-center gap-8">
             <div className="h-[1px] flex-1 bg-white/5" />
             <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-700">Afternoon Sessions</h2>
             <div className="h-[1px] flex-1 bg-white/5" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
             {afternoonSessions.length === 0 ? (
               <div className="lg:col-span-3 vessel bg-[#1D1E31] p-24 text-center border border-white/5">
                  <p className="text-xl text-zinc-600 font-medium italic">No afternoon sessions scheduled.</p>
               </div>
             ) : (
               afternoonSessions.map((booking) => (
                <div key={booking.id} className="vessel bg-[#1D1E31] p-10 space-y-10 group border border-white/5 hover:border-white/10 transition-all flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <div className="h-14 w-14 rounded-full bg-white/5 flex items-center justify-center text-[#D3C4B5]">
                          <CalendarCheck className="h-7 w-7" />
                      </div>
                      <span className="text-xl font-black font-manrope tracking-tighter text-zinc-500">{booking.start_time}</span>
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-3xl font-extrabold font-manrope tracking-tighter text-white">{booking.child_name}</h3>
                      <p className="text-md text-[#BACCB3] font-medium font-black uppercase tracking-widest text-[10px]">{booking.service_category}</p>
                    </div>
                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                       <span className="text-sm font-bold text-zinc-500">{booking.provider_name}</span>
                       <button className="text-[10px] font-black uppercase tracking-widest text-[#D3C4B5]">View Details</button>
                    </div>
                </div>
               ))
             )}
          </div>
       </section>

       {/* FLOATING ACTION BUTTON */}
       <div className="fixed bottom-12 right-12 z-[200]">
          <Button className="h-20 w-20 rounded-full bg-[#D3C4B5] text-[#382F24] p-0 shadow-3xl shadow-[#D3C4B5]/40 hover:scale-110 transition-all border-4 border-[#111224]">
             <Plus className="h-8 w-8" />
          </Button>
       </div>
    </div>
  );
}
