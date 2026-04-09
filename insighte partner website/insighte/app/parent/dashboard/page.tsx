import React from "react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { 
  Heart, 
  Settings, 
  Bell, 
  Calendar, 
  Clock, 
  Plus, 
  TrendingUp, 
  MessageSquare, 
  ShieldCheck, 
  Sparkles,
  ChevronRight,
  ArrowRight,
  MapPin,
  Mic,
  Brain,
  Accessibility,
  Grid,
  MessageCircle,
  Video,
  FileText,
  Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/server";

export default async function SanctuaryDashboard() {
  const supabase = await createClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login");
  }

  // Fetch Parent Data
  const { data: parent } = await supabase
    .from("parents")
    .select("*")
    .eq("id", user.id)
    .single();

  const firstName = parent?.name?.split(" ")[0] || "Parent";

  // Fetch Children
  const { data: children } = await supabase
    .from("children")
    .select("*")
    .eq("parent_id", user.id);

  // Fetch Next Session
  const { data: nextSession } = await supabase
    .from("bookings")
    .select(`
      *,
      provider:providers(*),
      service:services(*)
    `)
    .eq("parent_id", user.id)
    .eq("status", "upcoming")
    .order("start_time", { ascending: true })
    .limit(1)
    .single();

  return (
    <div className="min-h-screen bg-[#111224] text-[#e1e0fa] font-inter overflow-x-hidden selection:bg-[#baccb3] selection:text-[#253423] pb-24 lg:pb-0">
      <Navbar />

      <main className="mx-auto max-w-7xl px-4 sm:px-6 pt-32 pb-32 flex flex-col gap-12 animate-fade-in-up">
        
        {/* Hero Greeting */}
        <section className="flex flex-col md:flex-row items-end justify-between gap-8 pt-4">
           <div className="space-y-2">
              <h1 className="font-manrope text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#e1e0fa] mb-2 leading-tight">
                Hello, {firstName}
              </h1>
              <p className="text-[#baccb3] font-medium tracking-wide flex items-center gap-3 text-sm md:text-base">
                <span className="w-2.5 h-2.5 rounded-full bg-[#baccb3] shadow-[0_0_8px_#baccb3]"></span>
                Your sanctuary is ready.
              </p>
           </div>
           
           <div className="hidden md:flex gap-4">
              <Button className="h-14 rounded-full bg-[#191a2d] px-8 font-black uppercase tracking-widest text-[10px] text-[#e1e0fa] border border-[#47464c]/30 hover:bg-[#27283c] transition-all">
                 <Settings className="mr-2 h-4 w-4" /> Manage Profile
              </Button>
              <Link href="/onboarding">
                <Button className="h-14 rounded-full bg-[#d3c4b5] text-[#382f24] px-8 font-black uppercase tracking-widest text-[10px] hover:shadow-[0_0_20px_rgba(200,196,219,0.3)] hover:bg-[#f0e0d0] active:scale-95 transition-all">
                   <Plus className="mr-2 h-4 w-4" /> Add Child
                </Button>
              </Link>
           </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
           
           {/* LEFT COLUMN: Children & Next Session */}
           <div className="lg:col-span-2 space-y-10 lg:space-y-12">
              
              {/* Children Carousel */}
              <section className="space-y-6">
                <div className="flex justify-between items-end">
                  <h2 className="font-manrope text-xl md:text-2xl font-bold text-[#e1e0fa] px-2">Your children</h2>
                  <Link href="/parent/settings" className="flex md:hidden text-[10px] uppercase font-bold tracking-widest text-[#919097] hover:text-[#baccb3]">Manage</Link>
                </div>
                
                {/* Warm Sand Curved Platform */}
                <div className="relative bg-[#282016]/40 rounded-3xl p-6 pt-12 mt-10 bg-[radial-gradient(circle_at_bottom_left,rgba(50,51,71,1)_0%,rgba(200,196,219,0.05)_100%)] shadow-2xl border border-[#47464c]/10">
                  <div className="absolute -top-10 left-0 right-0 flex justify-center gap-8">
                    {children && children.length > 0 ? (
                      children.map((child: any) => (
                        <div key={child.id} className="group flex flex-col items-center gap-3 cursor-pointer">
                          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full p-1 bg-gradient-to-tr from-[#d3c4b5] to-[#baccb3] shadow-[0_20px_40px_rgba(11,12,31,0.5)] group-hover:scale-105 group-active:scale-95 transition-transform duration-300">
                            <div className="w-full h-full rounded-full overflow-hidden border-4 border-[#1D1E31] bg-[#111224] flex items-center justify-center text-2xl font-black text-[#d3c4b5]">
                              {child.name.charAt(0)}
                            </div>
                          </div>
                          <span className="font-manrope font-bold text-[#f0e0d0] group-hover:text-white transition-colors">{child.name}</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-[#c8c5cd] text-sm mt-4">No children profiles found.</p>
                    )}

                    {/* Add Built-in */}
                    <Link href="/onboarding" className="group flex flex-col items-center gap-3 cursor-pointer">
                      <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#47464c] bg-[#191a2d] flex items-center justify-center group-hover:bg-[#323347] group-active:scale-95 transition-all">
                         <Plus className="h-6 w-6 text-[#919097] group-hover:text-[#baccb3]" />
                      </div>
                      <span className="font-manrope font-bold text-[#919097] group-hover:text-[#baccb3] transition-colors">Add</span>
                    </Link>
                  </div>
                  
                  <div className="text-center mt-16 md:mt-24">
                    <p className="text-[#c8c5cd] text-sm md:text-base px-4 italic leading-relaxed max-w-lg mx-auto">
                      {children && children.length > 0 
                        ? `${children[0].name} is progressing beautifully in their social interaction goals. Last session showed 15% improvement in sustained attention.` 
                        : "Welcome to Insighte. Complete your child's profile to unlock personalized insights."}
                    </p>
                  </div>
                </div>
              </section>

              {/* Next Session Card */}
              <section className="space-y-6">
                 <div className="flex justify-between items-end">
                    <h2 className="font-manrope text-xl md:text-2xl font-bold text-[#e1e0fa] px-2">Next session</h2>
                    <Link href="/parent/sessions" className="text-[10px] font-black uppercase tracking-widest text-[#baccb3] hover:text-[#d6e8ce] transition-all flex items-center gap-2">
                       Full Calendar <ArrowRight className="h-3 w-3" />
                    </Link>
                 </div>
                 
                 {nextSession ? (
                    <div className="bg-[#1D1E31] rounded-3xl p-8 relative overflow-hidden shadow-[0_20px_80px_rgba(11,12,31,0.8)] border border-[#47464c]/30 group hover:border-[#baccb3]/20 transition-colors cursor-pointer">
                        <div className="absolute top-0 right-0 p-6 z-10">
                        <span className="bg-[#baccb3]/10 text-[#baccb3] text-xs font-bold px-4 py-1.5 rounded-full uppercase tracking-widest">Upcoming</span>
                        </div>
                        
                        <div className="absolute -right-20 -bottom-20 w-64 h-64 bg-[#d3c4b5]/5 blur-[60px] rounded-full group-hover:scale-150 transition-transform duration-1000"></div>

                        <div className="flex flex-col gap-8 relative z-10">
                        <div className="space-y-2">
                            <h3 className="font-manrope text-3xl md:text-4xl font-extrabold text-[#f0e0d0]">{nextSession.service?.title || "Therapy Session"}</h3>
                            <p className="text-[#c8c5cd] font-medium flex items-center gap-2 text-lg">
                            <ShieldCheck className="w-5 h-5 text-[#919097]" /> with {nextSession.provider?.name || "Care Provider"}
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-8 bg-[#111224]/50 w-max p-4 rounded-2xl border border-[#47464c]/20">
                            <div className="flex flex-col">
                            <span className="text-[#8a879c] text-[10px] uppercase font-bold tracking-[0.2em] mb-1">Date</span>
                            <span className="text-[#e1e0fa] font-semibold flex items-center gap-2">
                                <Clock className="w-4 h-4 text-[#baccb3]" /> 
                                {new Date(nextSession.start_time).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                            </span>
                            </div>
                        </div>
                        
                        <button className="w-full md:w-auto md:self-start bg-[#d3c4b5] py-5 px-10 rounded-full text-[#382f24] font-manrope font-extrabold text-lg md:text-xl hover:shadow-[0_0_30px_rgba(200,196,219,0.3)] hover:bg-[#f0e0d0] active:scale-[0.98] transition-all flex items-center justify-center gap-3">
                            Prepare for session <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                        </div>
                    </div>
                 ) : (
                    <div className="bg-[#1D1E31] rounded-3xl p-8 border border-dashed border-[#47464c] flex flex-col items-center justify-center text-center gap-4">
                        <Calendar className="w-12 h-12 text-[#919097]" />
                        <div className="space-y-2">
                            <h3 className="font-manrope text-xl font-bold text-[#e1e0fa]">No upcoming sessions</h3>
                            <p className="text-[#c8c5cd] text-sm max-w-sm mx-auto">You don't have any sessions scheduled right now. Ready to book your next visit?</p>
                        </div>
                        <Link href="/book">
                            <Button className="mt-4 bg-[#baccb3] text-[#221a11] hover:bg-[#d6e8ce] rounded-full px-8 py-6 uppercase font-black text-[10px] tracking-widest">
                                Book New Session
                            </Button>
                        </Link>
                    </div>
                 )}
              </section>
           </div>
           
           {/* RIGHT COLUMN: Discover Services & Quick Actions */}
           <aside className="space-y-10 lg:space-y-12 animate-fade-in-up stagger-2">
              
              {/* Discover Services Bento */}
              <section className="space-y-6">
                <h2 className="font-manrope text-xl md:text-2xl font-bold text-[#e1e0fa] px-2">Discover services</h2>
                <div className="grid grid-cols-2 gap-4">
                  {/* Service 1 */}
                  <div className="bg-[#191a2d] p-8 rounded-3xl flex flex-col items-center gap-4 text-center hover:bg-[#323347] transition-colors group cursor-pointer border border-transparent hover:border-[#47464c]/20">
                    <div className="w-16 h-16 rounded-full bg-[#3b4b38] flex items-center justify-center text-[#baccb3] group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(186,204,179,0.15)]">
                      <Mic className="w-7 h-7" />
                    </div>
                    <span className="font-manrope font-bold text-[#e1e0fa]">Speech</span>
                  </div>
                  {/* Service 2 */}
                  <div className="bg-[#191a2d] p-8 rounded-3xl flex flex-col items-center gap-4 text-center hover:bg-[#323347] transition-colors group cursor-pointer border border-transparent hover:border-[#47464c]/20">
                    <div className="w-16 h-16 rounded-full bg-[#222031] flex items-center justify-center text-[#c8c4db] group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(200,196,219,0.15)]">
                      <Brain className="w-7 h-7" />
                    </div>
                    <span className="font-manrope font-bold text-[#e1e0fa]">OT</span>
                  </div>
                  {/* Service 3 */}
                  <div className="bg-[#191a2d] p-8 rounded-3xl flex flex-col items-center gap-4 text-center hover:bg-[#323347] transition-colors group cursor-pointer border border-transparent hover:border-[#47464c]/20">
                    <div className="w-16 h-16 rounded-full bg-[#282016] flex items-center justify-center text-[#d3c4b5] group-hover:scale-110 transition-transform duration-300 shadow-[0_0_20px_rgba(211,196,181,0.15)]">
                      <Accessibility className="w-7 h-7" />
                    </div>
                    <span className="font-manrope font-bold text-[#e1e0fa]">Behavioral</span>
                  </div>
                  {/* Service 4 */}
                  <Link href="/book" className="bg-[#191a2d] p-8 rounded-3xl flex flex-col items-center gap-4 text-center hover:bg-[#323347] transition-colors group cursor-pointer border border-transparent hover:border-[#47464c]/20">
                    <div className="w-16 h-16 rounded-full bg-[#47464c]/20 flex items-center justify-center text-[#c8c5cd] group-hover:scale-110 transition-transform duration-300">
                      <Grid className="w-7 h-7" />
                    </div>
                    <span className="font-manrope font-bold text-[#e1e0fa]">View All</span>
                  </Link>
                </div>
              </section>

              {/* Progress Detail Summary (Replaced Quick Actions) */}
              <div className="bg-[#D3C4B5] p-10 rounded-3xl space-y-4 text-[#382F24] relative overflow-hidden group hover:scale-[1.02] transition-transform shadow-[0_20px_80px_rgba(211,196,181,0.1)]">
                 <Sparkles className="h-8 w-8 opacity-40 absolute top-8 right-8 text-[#382F24]" />
                 <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-[#382F24]/60">Sanctuary Insight</h4>
                 <p className="text-xl font-extrabold font-manrope leading-tight pr-6">
                    {children && children.length > 0
                        ? `${children[0].name}'s social engagement peaked by 15% this week in sessions.`
                        : "Complete the onboarding to unlock real-time developmental insights for your child."}
                 </p>
                 <button className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 pt-6 transition-all hover:text-[#4f453a] group-hover:gap-3">
                   View Full Report <ArrowRight className="w-4 h-4" />
                 </button>
                 <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/20 blur-[60px]" />
              </div>
              
           </aside>
        </div>
      </main>

      {/* Floating Bottom Navigation (Mobile Only) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex lg:hidden justify-around items-center max-w-md mx-auto rounded-[3rem] mb-6 mx-6 px-4 py-3 bg-[#1D1E31]/90 backdrop-blur-2xl shadow-[0_20px_80px_rgba(11,12,31,0.6)] bg-gradient-to-bl from-[#323347] to-[#111224] border border-[#47464c]/30">
        <a className="flex flex-col items-center justify-center text-[#F0E0D0] relative after:content-[''] after:absolute after:-bottom-1 after:w-1.5 after:h-1.5 after:bg-[#d6e8ce] after:rounded-full after:shadow-[0_0_8px_#d6e8ce] active:scale-95 duration-200 py-2 px-4" href="#">
          <Heart className="w-6 h-6 mb-1 fill-current" />
          <span className="font-inter text-[10px] font-bold tracking-wide">Home</span>
        </a>
        <a className="flex flex-col items-center justify-center text-[#c8c5cd]/60 hover:text-[#baccb3] transition-colors active:scale-95 duration-200 py-2 px-4" href="#">
          <Users className="w-6 h-6 mb-1" />
          <span className="font-inter text-[10px] font-bold tracking-wide">Children</span>
        </a>
        <a className="flex flex-col items-center justify-center text-[#c8c5cd]/60 hover:text-[#baccb3] transition-colors active:scale-95 duration-200 py-2 px-4" href="/parent/messages">
          <MessageSquare className="w-6 h-6 mb-1" />
          <span className="font-inter text-[10px] font-bold tracking-wide">Messages</span>
        </a>
        <a className="flex flex-col items-center justify-center text-[#c8c5cd]/60 hover:text-[#baccb3] transition-colors active:scale-95 duration-200 py-2 px-4" href="/parent/settings">
          <Settings className="w-6 h-6 mb-1" />
          <span className="font-inter text-[10px] font-bold tracking-wide">Settings</span>
        </a>
      </nav>

      <Footer />
    </div>
  );
}
