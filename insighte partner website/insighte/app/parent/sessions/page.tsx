import React from "react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { 
  Bell, 
  ArrowRight,
  Calendar,
  Video,
  ChevronRight,
  Clock,
  Heart,
  Users,
  MessageSquare,
  Settings,
  Activity,
  BrainCircuit,
  Baby
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { createClient } from "@/lib/supabase/server";

export default async function SanctuarySessions() {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  // Fetch Parent Data
  const { data: parent } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  // Fetch Upcoming Sessions
  const { data: upcomingSessions } = await supabase
    .from("bookings")
    .select(`
      *,
      provider:partners(*),
      service:services(*),
      child:children(*)
    `)
    .eq("user_id", user.id)
    .gte("start_time", new Date().toISOString())
    .order("start_time", { ascending: true });

  // Separate sessions into "Today" and "Upcoming" (Next Week / Future)
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const sessionsToday = (upcomingSessions as any[])?.filter((session: any) => {
    const sessionDate = new Date(session.start_time);
    return sessionDate >= today && sessionDate < tomorrow;
  }) || [];

  const sessionsFuture = (upcomingSessions as any[])?.filter((session: any) => {
    const sessionDate = new Date(session.start_time);
    return sessionDate >= tomorrow;
  }) || [];

  return (
    <div className="min-h-screen bg-[#111224] text-[#e1e0fa] font-inter pb-32">
      <Navbar />

      <main className="pt-28 px-4 sm:px-6 max-w-3xl mx-auto animate-fade-in-up">
        {/* Editorial Header */}
        <section className="mb-12 space-y-2">
          <div className="flex items-center gap-3">
             <Link href="/parent/dashboard" className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 transition-colors border border-white/10 md:hidden mb-4">
                <ChevronRight className="w-5 h-5 text-white rotate-180" />
             </Link>
          </div>
          <h1 className="font-manrope text-4xl md:text-5xl font-extrabold tracking-tight text-[#f0e0d0] mb-2">Upcoming Sessions</h1>
          <p className="text-[#c8c5cd] text-lg">Your sanctuary's schedule for growth and healing.</p>
        </section>

        {/* Today Section */}
        {sessionsToday.length > 0 && (
          <section className="mb-14">
            <div className="flex items-center gap-4 mb-8">
              <span className="font-manrope font-bold text-sm uppercase tracking-[0.2em] text-[#baccb3]">Today</span>
              <div className="h-[1px] flex-grow bg-[#47464c]/30"></div>
            </div>

            {sessionsToday.map(session => (
              <div key={session.id} className="relative group mb-8 cursor-pointer">
                <Link href={`/parent/sessions/${session.id}`} className="block">
                  <div className="absolute -inset-1 bg-gradient-to-r from-[#282016] to-[#27283c] rounded-3xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                  <div className="relative bg-[#d3c4b5] text-[#382f24] rounded-3xl p-8 shadow-2xl overflow-hidden border border-[#d3c4b5]/50 group-hover:border-[#f0e0d0] transition-colors">
                    {/* Subtle Glow */}
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#c8c4db]/20 blur-[60px] rounded-full"></div>
                    
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="font-manrope text-3xl font-extrabold tracking-tight mb-1">{session.child?.name || "Child Session"}</h3>
                        <div className="flex items-center gap-2 text-[#4f453a] font-medium">
                          <Activity className="w-5 h-5" />
                          <span>{session.provider?.name || "Provider"} • {session.service?.title}</span>
                        </div>
                      </div>
                      <div className="bg-[#382f24]/10 rounded-2xl px-5 py-3 flex flex-col items-center">
                        <span className="text-[10px] uppercase font-bold tracking-widest opacity-60">Time</span>
                        <span className="font-manrope font-extrabold text-xl">
                          {new Date(session.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 mb-8 text-[#4f453a]">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-5 h-5" />
                        <span className="font-semibold">{new Date(session.start_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Video className="w-5 h-5" />
                        <span className="font-semibold">Telehealth Vessel</span>
                      </div>
                    </div>

                    <button className="w-full bg-[#382f24] text-[#f0e0d0] rounded-full py-5 font-manrope font-extrabold text-lg flex items-center justify-center gap-3 hover:shadow-[0_0_30px_rgba(200,196,219,0.4)] hover:bg-[#221a11] transition-all active:scale-[0.98]">
                      Join Session
                      <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>
                </Link>
              </div>
            ))}
          </section>
        )}

        {/* Future Sessions Section */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <span className="font-manrope font-bold text-sm uppercase tracking-[0.2em] text-[#8a879c]">Coming Up</span>
            <div className="h-[1px] flex-grow bg-[#47464c]/20"></div>
          </div>

          <div className="grid gap-6">
            {sessionsFuture.length > 0 ? (
              sessionsFuture.map(session => (
                <Link href={`/parent/sessions/${session.id}`} key={session.id}>
                  <div className="bg-gradient-to-br from-[#1d1e31] to-[#111224] rounded-3xl p-6 border border-[#47464c]/30 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:bg-[#27283c] hover:border-[#baccb3]/30 transition-all cursor-pointer group">
                    <div className="flex items-center gap-6">
                      <div className="w-16 h-16 rounded-2xl bg-[#323347] flex items-center justify-center text-[#d3c4b5] border border-[#47464c]/20 shadow-inner group-hover:bg-[#d3c4b5]/10 group-hover:text-[#f0e0d0] transition-colors">
                        <Baby className="w-8 h-8" />
                      </div>
                      <div>
                        <h4 className="font-manrope text-xl font-bold text-[#f0e0d0] group-hover:text-white transition-colors">{session.child?.name || "Child Session"}</h4>
                        <p className="text-[#c8c5cd] text-sm mb-2">{session.provider?.name} • {session.service?.title}</p>
                        <div className="flex items-center gap-3 text-[#baccb3] text-[10px] font-bold uppercase tracking-widest bg-[#baccb3]/10 w-fit px-3 py-1.5 rounded-full">
                          <span>{new Date(session.start_time).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                          <span className="w-1 h-1 rounded-full bg-[#baccb3]/50"></span>
                          <span>{new Date(session.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>
                    </div>
                    <button className="bg-[#323347] text-[#e1e0fa] px-6 py-3 rounded-full font-bold text-sm border border-[#47464c]/40 hover:bg-[#282016] hover:text-[#f0e0d0] transition-all">
                      Details
                    </button>
                  </div>
                </Link>
              ))
            ) : (
               <div className="text-center p-12 bg-[#1d1e31] rounded-3xl border border-dashed border-[#47464c]/50">
                  <Calendar className="w-12 h-12 text-[#47464c] mx-auto mb-4" />
                  <h3 className="font-manrope text-xl font-bold text-[#e1e0fa] mb-2">No upcoming sessions</h3>
                  <p className="text-[#8a879c]">When you book a session, it will appear here.</p>
                  <Link href="/book">
                     <Button className="mt-6 bg-[#baccb3] text-[#221a11] hover:bg-[#d6e8ce] rounded-full px-8 py-6 uppercase font-black text-[10px] tracking-widest">
                        Book a Session
                     </Button>
                  </Link>
               </div>
            )}
          </div>
        </section>
      </main>

      {/* Floating Bottom Navigation (Mobile Only) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex lg:hidden justify-around items-center max-w-md mx-auto rounded-[3rem] mb-6 mx-6 px-4 py-3 bg-[#1D1E31]/90 backdrop-blur-2xl shadow-[0_20px_80px_rgba(11,12,31,0.6)] bg-gradient-to-bl from-[#323347] to-[#111224] border border-[#47464c]/30">
        <Link className="flex flex-col items-center justify-center text-[#c8c5cd]/60 hover:text-[#baccb3] transition-colors active:scale-95 duration-200 py-2 px-4" href="/parent/dashboard">
          <Heart className="w-6 h-6 mb-1" />
          <span className="font-inter text-[10px] font-bold tracking-wide">Home</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-[#F0E0D0] relative after:content-[''] after:absolute after:-bottom-1 after:w-1.5 after:h-1.5 after:bg-[#d6e8ce] after:rounded-full after:shadow-[0_0_8px_#d6e8ce] active:scale-95 duration-200 py-2 px-4" href="/parent/sessions">
          <Calendar className="w-6 h-6 mb-1 fill-current" />
          <span className="font-inter text-[10px] font-bold tracking-wide">Sessions</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-[#c8c5cd]/60 hover:text-[#baccb3] transition-colors active:scale-95 duration-200 py-2 px-4" href="/parent/messages">
          <MessageSquare className="w-6 h-6 mb-1" />
          <span className="font-inter text-[10px] font-bold tracking-wide">Messages</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-[#c8c5cd]/60 hover:text-[#baccb3] transition-colors active:scale-95 duration-200 py-2 px-4" href="/parent/settings">
          <Settings className="w-6 h-6 mb-1" />
          <span className="font-inter text-[10px] font-bold tracking-wide">Settings</span>
        </Link>
      </nav>
    </div>
  );
}
