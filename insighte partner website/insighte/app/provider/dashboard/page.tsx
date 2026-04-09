"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  Heart, 
  User, 
  Settings, 
  LayoutDashboard, 
  Plus, 
  Save, 
  ArrowRight,
  ShieldCheck,
  Languages,
  Tags,
  Baby,
  Calendar,
  FileText,
  CreditCard,
  Award,
  Zap,
  Star,
  ExternalLink,
  CheckCircle2,
  Clock,
  ChevronRight,
  TrendingUp,
  Target
} from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const AGE_GROUPS = [
  "Toddlers (2-4)",
  "Early Childhood (5-8)",
  "Middle Childhood (9-12)",
  "Adolescence (13-18)",
  "Young Adults (19+)"
];

export default function ProviderDashboard() {
  const supabase = createClient();
  const [provider, setProvider] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [sessionDoc, setSessionDoc] = useState({
    notes: "",
    recommendations: "",
    internal_clinical_notes: ""
  });
  const [isSavingDoc, setIsSavingDoc] = useState(false);

  useEffect(() => {
    async function fetchData() {
      let { data: { user } } = await supabase.auth.getUser();
      
      // FOR DEV TESTING: Mock a user if none exists (only locally)
      if (!user && process.env.NODE_ENV === 'development') {
        const { data: testProviders } = await supabase.from('providers').select('id').limit(1);
        if (testProviders && testProviders[0]) {
           user = { id: testProviders[0].id } as any;
           console.warn("Dev Mode: Mocking provider session for testing.");
        }
      }

      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch provider data
      const { data: providerData } = await supabase
        .from("providers")
        .select("*")
        .eq("id", user.id)
        .single();
      
      if (providerData) setProvider(providerData);

      // Fetch services library
      const { data: libraryData } = await supabase
        .from("service_library")
        .select("*");
      
      if (libraryData) setServices(libraryData);

      // Fetch bookings
      const { data: bookingData } = await supabase
        .from("bookings")
        .select("*, services(*), parents(*)")
        .eq("provider_id", user.id)
        .order("start_time", { ascending: true });
      
      if (bookingData) setBookings(bookingData);

      // Fetch reviews
      const { data: reviewData } = await supabase
        .from("reviews")
        .select("*")
        .eq("provider_id", user.id);
      
      if (reviewData) setReviews(reviewData);

      // Fetch payments
      const { data: paymentData } = await supabase
        .from("payments")
        .select("*, bookings(*)")
        .order("created_at", { ascending: false });
      
      if (paymentData) setPayments(paymentData);

      setLoading(false);
    }
    fetchData();
  }, []);

  // Fetch session notes when a booking is selected
  useEffect(() => {
    async function fetchSession() {
      if (!selectedBooking) return;
      
      const { data, error } = await supabase
        .from("sessions")
        .select("*")
        .eq("booking_id", selectedBooking.id)
        .single();
      
      if (data) {
        setSessionDoc({
          notes: data.notes || "",
          recommendations: data.recommendations || "",
          internal_clinical_notes: data.internal_clinical_notes || ""
        });
      } else {
        setSessionDoc({
          notes: "",
          recommendations: "",
          internal_clinical_notes: ""
        });
      }
    }
    fetchSession();
  }, [selectedBooking]);

  const awardXP = async (amount: number) => {
    if (!provider) return;
    const newXP = (provider.xp || 0) + amount;
    const newLevel = Math.floor(newXP / 1000) + 1;
    
    const { error } = await supabase
      .from("providers")
      .update({ 
        xp: newXP, 
        level: newLevel, 
        points: (provider.points || 0) + amount 
      })
      .eq("id", provider.id);
      
    if (!error) {
      setProvider({ 
        ...provider, 
        xp: newXP, 
        level: newLevel, 
        points: (provider.points || 0) + amount 
      });
      toast.success(`Success! +${amount} XP gained. Connection Before Correction.`);
    }
  };

  const handleSaveSession = async () => {
    if (!selectedBooking) return;
    setIsSavingDoc(true);

    const { error: sessionError } = await supabase
      .from("sessions")
      .upsert({
        booking_id: selectedBooking.id,
        ...sessionDoc,
        updated_at: new Date().toISOString()
      }, { onConflict: 'booking_id' });

    if (sessionError) {
      toast.error("Failed to commit clinical notes. Check connection.");
    } else {
      // Mark booking as completed if it was upcoming
      if (selectedBooking.status === 'upcoming') {
        const { error: bookingError } = await supabase
          .from("bookings")
          .update({ status: 'completed' })
          .eq("id", selectedBooking.id);
        
        if (!bookingError) {
          setBookings(prev => prev.map(b => 
            b.id === selectedBooking.id ? { ...b, status: 'completed' } : b
          ));
          awardXP(100); // 100 XP for completing a session and taking notes
        }
      } else {
        awardXP(10); // Small XP boost for updating notes
      }
      toast.success("Clinical intelligence synchronized.");
    }
    setIsSavingDoc(false);
  };

  const handleUpdate = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("providers")
      .update({
        specializations: provider.specializations,
        age_groups: provider.age_groups,
        bio: provider.bio,
        name: provider.name
      })
      .eq("id", provider.id);

    if (error) {
       toast.error("Discovery update failed. Please retry.");
    } else {
       toast.success("Profile sync complete. Your updates are live.");
    }
    setSaving(false);
  };

  const toggleSpecialization = (spec: string) => {
    const current = provider.specializations || [];
    const updated = current.includes(spec) 
      ? current.filter((s: string) => s !== spec)
      : [...current, spec];
    setProvider({ ...provider, specializations: updated });
  };

  const toggleAgeGroup = (age: string) => {
    const current = provider.age_groups || [];
    const updated = current.includes(age) 
      ? current.filter((a: string) => a !== age)
      : [...current, age];
    setProvider({ ...provider, age_groups: updated });
  };

  if (loading) return (
     <div className="min-h-screen bg-[#111224] flex items-center justify-center">
        <div className="h-8 w-8 rounded-full border-2 border-[#D3C4B5] border-t-transparent animate-spin" />
     </div>
  );

  return (
    <div className="bg-[#111224] text-[#e1e0fa] min-h-screen flex flex-col font-inter selection:bg-[#D3C4B5]/30">
      {/* Navigation Hub */}
      <nav className="h-24 px-8 border-b border-white/5 flex items-center justify-between backdrop-blur-3xl sticky top-0 z-[100] bg-[#111224]/80">
         <div className="flex items-center gap-4">
            <Link href="/" className="group flex items-center gap-4">
               <div className="h-10 w-10 rounded-full bg-[#D3C4B5] text-[#382F24] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Heart className="h-5 w-5 fill-current" />
               </div>
               <span className="text-xl font-black tracking-tighter italic uppercase text-white">Insighte Node</span>
            </Link>
         </div>

         {/* TAB NAVIGATION */}
         <div className="hidden md:flex items-center bg-white/5 p-1.5 rounded-2xl border border-white/5 scale-90 lg:scale-100">
            {[
               { id: 'overview', icon: LayoutDashboard, label: 'Overview' },
               { id: 'schedule', icon: Calendar, label: 'Schedule' },
               { id: 'clinic', icon: FileText, label: 'Clinic' },
               { id: 'vault', icon: CreditCard, label: 'Vault' },
               { id: 'identity', icon: User, label: 'Identity' }
            ].map(tab => (
               <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                     "flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                     activeTab === tab.id 
                        ? "bg-[#D3C4B5] text-[#382F24] shadow-lg" 
                        : "text-zinc-500 hover:text-white hover:bg-white/5"
                  )}
               >
                  <tab.icon className="h-4 w-4" />
                  {tab.label}
               </button>
            ))}
         </div>

         <div className="flex items-center gap-6">
            <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-[#BACCB3]/5 border border-[#BACCB3]/20 rounded-full">
               <Zap className="h-3 w-3 text-[#BACCB3] fill-current" />
               <span className="text-[10px] font-black text-[#BACCB3] uppercase tracking-widest">{provider?.points || 0} XP</span>
            </div>
            <div className="h-10 w-[1px] bg-white/5" />
            <div className="text-right hidden sm:block">
               <p className="text-[10px] font-black uppercase text-white tracking-widest">{provider?.name}</p>
               <p className="text-[9px] font-bold text-[#BACCB3] tracking-tighter uppercase italic">Lvl {provider?.level || 1} Specialist</p>
            </div>
         </div>
      </nav>

      <main className="flex-1 max-w-7xl mx-auto w-full px-8 py-12">
         
         {/* TAB: OVERVIEW */}
         {activeTab === 'overview' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
               <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                  <div className="space-y-4">
                     <Badge className="bg-[#BACCB3]/10 text-[#BACCB3] border-none rounded-full px-6 py-1.5 text-[9px] font-black uppercase tracking-widest italic">
                        Command Center
                     </Badge>
                     <h1 className="text-5xl font-manrope font-black tracking-tighter italic uppercase text-white leading-none">
                        Clinical <br/> <span className="text-[#D3C4B5]">Intelligence.</span>
                     </h1>
                  </div>
                  
                  {/* GAMIFICATION LEVEL CARD */}
                  <div className="vessel bg-[#1D1E31] p-6 rounded-[2.5rem] border border-white/5 flex items-center gap-6 min-w-[320px]">
                     <div className="h-16 w-16 rounded-2xl bg-[#D3C4B5] text-[#382F24] flex items-center justify-center shadow-xl shrink-0">
                        <Award className="h-8 w-8" />
                     </div>
                     <div className="flex-1 space-y-3">
                        <div className="flex justify-between items-end">
                           <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Level {provider?.level || 1} Progress</p>
                           <p className="text-[10px] font-black text-white">{provider?.xp || 0}/1000 XP</p>
                        </div>
                        <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden p-[2px]">
                           <div 
                              className="h-full bg-gradient-to-r from-[#D3C4B5] to-[#BACCB3] rounded-full transition-all duration-1000"
                              style={{ width: `${(provider?.xp % 1000) / 10}%` }}
                           />
                        </div>
                     </div>
                  </div>
               </div>

               {/* BENTO STATS */}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                     { label: 'Upcoming Today', value: bookings.filter(b => b.status === 'upcoming').length, icon: Calendar, color: 'text-[#D3C4B5]' },
                     { label: 'Total Impact', value: bookings.length, icon: Heart, color: 'text-[#BACCB3]' },
                     { label: 'Avg Rating', value: provider?.average_rating || '5.0', icon: Star, color: 'text-yellow-500' },
                     { label: 'Est. Earnings', value: `₹${payments.reduce((acc, curr) => acc + Number(curr.amount), 0)}`, icon: CreditCard, color: 'text-[#F0E0D0]' }
                  ].map((stat, i) => (
                     <div key={i} className="vessel bg-[#1D1E31] p-8 rounded-[2.5rem] border border-white/5 space-y-4 hover:border-white/10 transition-all group">
                        <div className={cn("h-12 w-12 rounded-2xl bg-white/5 flex items-center justify-center transition-transform group-hover:scale-110", stat.color)}>
                           <stat.icon className="h-6 w-6" />
                        </div>
                        <div>
                           <p className="text-[10px] font-black uppercase tracking-widest text-zinc-500 mb-1">{stat.label}</p>
                           <p className="text-3xl font-manrope font-black text-white">{stat.value}</p>
                        </div>
                     </div>
                  ))}
               </div>

               {/* RECENT ACTIVITY & UPCOMING QUICK VIEW */}
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-8 vessel bg-[#1D1E31] p-10 rounded-[3rem] border border-white/5 space-y-8">
                     <div className="flex items-center justify-between">
                        <div className="space-y-1">
                           <h3 className="text-2xl font-manrope font-extrabold tracking-tight italic uppercase">Next Sessions</h3>
                           <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 underline decoration-[#D3C4B5]">Your immediate priorities for today.</p>
                        </div>
                        <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-[#D3C4B5]" onClick={() => setActiveTab('schedule')}>
                           View All <ArrowRight className="h-3 w-3 ml-2" />
                        </Button>
                     </div>
                     
                     <div className="space-y-4">
                        {bookings.filter(b => b.status === 'upcoming').slice(0, 3).length > 0 ? (
                           bookings.filter(b => b.status === 'upcoming').slice(0, 3).map(booking => (
                              <div key={booking.id} className="p-6 rounded-2xl bg-[#111224] border border-white/5 flex items-center justify-between group hover:bg-white/5 transition-all">
                                 <div className="flex items-center gap-6">
                                    <div className="h-14 w-14 rounded-full bg-[#BACCB3]/10 flex items-center justify-center text-[#BACCB3] relative">
                                       <Clock className="h-6 w-6" />
                                       <div className="absolute -top-1 -right-1 h-4 w-4 bg-[#D3C4B5] rounded-full border-2 border-[#111224] animate-pulse" />
                                    </div>
                                    <div className="space-y-1">
                                       <p className="text-sm font-black text-white">{booking.parents?.name}</p>
                                       <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                                          {new Date(booking.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {booking.services?.title}
                                       </p>
                                    </div>
                                 </div>
                                 <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {booking.meeting_link ? (
                                       <a href={booking.meeting_link} target="_blank" rel="noopener noreferrer">
                                          <Button size="sm" className="h-10 rounded-xl bg-[#D3C4B5] text-[#382F24] font-black uppercase text-[9px] tracking-widest px-6">
                                             Join Meet
                                          </Button>
                                       </a>
                                    ) : (
                                       <Badge className="bg-white/5 text-zinc-600 border-none px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-widest">No Link Sync</Badge>
                                    )}
                                    <Button size="icon" variant="ghost" className="h-10 w-10 rounded-xl border border-white/10" onClick={() => { setSelectedBooking(booking); setActiveTab('clinic'); }}>
                                       <FileText className="h-4 w-4" />
                                    </Button>
                                 </div>
                              </div>
                           ))
                        ) : (
                           <div className="py-20 text-center space-y-4">
                              <div className="h-16 w-16 mx-auto rounded-full bg-white/5 flex items-center justify-center text-zinc-800">
                                 <Calendar className="h-8 w-8" />
                              </div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">No sessions on the immediate horizon.</p>
                           </div>
                        )}
                     </div>
                  </div>

                  {/* SIDEBAR: COMMUNITY / GAMIFICATION LEADERBOARD PREVIEW */}
                  <div className="lg:col-span-4 space-y-8">
                     <div className="vessel bg-[#1D1E31] p-8 rounded-[2.5rem] border border-white/5 space-y-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4">
                           <TrendingUp className="h-5 w-5 text-[#BACCB3]" />
                        </div>
                        <h4 className="text-xl font-manrope font-black tracking-tighter text-white uppercase italic">Impact Leaderboard</h4>
                        <div className="space-y-4">
                           {[
                              { name: 'Dr. Sarah', pts: '4.8k', role: 'Clinical Lead' },
                              { name: 'Mark J.', pts: '3.2k', role: 'Behavioral Path' },
                              { name: 'Trisha P.', pts: '2.9k', role: 'Occupational Th.' }
                           ].map((item, i) => (
                              <div key={i} className="flex items-center justify-between group">
                                 <div className="flex items-center gap-3">
                                    <span className="text-[9px] font-black text-zinc-600">{i + 1}</span>
                                    <div className="h-8 w-8 rounded-full bg-white/5 border border-white/5 p-1">
                                       <div className="h-full w-full rounded-full bg-zinc-800 animate-pulse" />
                                    </div>
                                    <div>
                                       <p className="text-[10px] font-black text-white italic">{item.name}</p>
                                       <p className="text-[8px] font-bold text-zinc-600 uppercase">{item.role}</p>
                                    </div>
                                 </div>
                                 <Badge className="bg-[#BACCB3]/10 text-[#BACCB3] border-none text-[8px] font-black">{item.pts} XP</Badge>
                              </div>
                           ))}
                        </div>
                        <Button className="w-full h-12 rounded-2xl bg-white/5 text-zinc-400 font-black uppercase text-[9px] tracking-widest border border-white/5 hover:text-white transition-all">
                           View Community
                        </Button>
                     </div>
                  </div>
               </div>
            </div>
         )}

         {/* TAB: SCHEDULE */}
         {activeTab === 'schedule' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
               <div className="space-y-4 text-center max-w-2xl mx-auto">
                  <Badge className="bg-[#D3C4B5]/10 text-[#D3C4B5] border-none rounded-full px-6 py-1.5 text-[9px] font-black uppercase tracking-widest italic">
                     Time Management
                  </Badge>
                  <h2 className="text-5xl font-manrope font-black tracking-tighter italic uppercase text-white shadow-xl">
                     Session <span className="text-[#D3C4B5]">Logistics.</span>
                  </h2>
               </div>

               <div className="vessel bg-[#1D1E31] rounded-[3rem] border border-white/5 overflow-hidden">
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="border-b border-white/5 bg-white/5">
                           <th className="p-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">Service / Booking</th>
                           <th className="p-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">Client / Parent</th>
                           <th className="p-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">DateTime</th>
                           <th className="p-8 text-[10px] font-black uppercase tracking-widest text-zinc-500">Clinical Hub</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-white/5">
                        {bookings.map(booking => (
                           <tr key={booking.id} className="group hover:bg-white/5 transition-all">
                              <td className="p-8">
                                 <div className="space-y-1">
                                    <p className="text-sm font-black text-white group-hover:text-[#D3C4B5] transition-colors">{booking.services?.title}</p>
                                    <Badge className="bg-white/5 text-zinc-600 border-none text-[8px] font-black uppercase px-3">{booking.status}</Badge>
                                 </div>
                              </td>
                              <td className="p-8 font-bold text-zinc-400">{booking.parents?.name}</td>
                              <td className="p-8">
                                 <div className="space-y-1">
                                    <p className="text-xs font-black text-white">{new Date(booking.start_time).toLocaleDateString()}</p>
                                    <p className="text-[10px] font-bold text-zinc-600 italic">
                                       {new Date(booking.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                 </div>
                              </td>
                              <td className="p-8 text-right">
                                 <div className="flex items-center gap-4 justify-end">
                                    {booking.status === 'upcoming' && booking.meeting_link && (
                                       <a href={booking.meeting_link} target="_blank" rel="noopener noreferrer">
                                          <Button size="sm" className="h-10 rounded-xl bg-[#BACCB3] text-[#253423] font-black uppercase text-[9px] tracking-widest px-6 shadow-lg shadow-[#BACCB3]/10">
                                             Join Meet
                                          </Button>
                                       </a>
                                    )}
                                    <Button size="icon" variant="ghost" className="h-10 w-10 rounded-xl border border-white/10 hover:bg-white/5" onClick={() => { setSelectedBooking(booking); setActiveTab('clinic'); }}>
                                       <FileText className="h-4 w-4" />
                                    </Button>
                                 </div>
                              </td>
                           </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
         )}

         {/* TAB: CLINIC (Notes) */}
         {activeTab === 'clinic' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
               <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                  <div className="lg:col-span-4 space-y-8">
                     <div className="space-y-4">
                        <Badge className="bg-[#BACCB3]/10 text-[#BACCB3] border-none rounded-full px-6 py-1.5 text-[9px] font-black uppercase tracking-widest italic">
                           Records Hub
                        </Badge>
                        <h2 className="text-5xl font-manrope font-black tracking-tighter italic uppercase text-white leading-none">
                           Clinical <br/> <span className="text-[#D3C4B5]">Protocols.</span>
                        </h2>
                        <p className="text-sm font-medium text-zinc-500 max-w-xs">
                           Maintain secure session documentation and follow-up recommendations for your families.
                        </p>
                     </div>
 
                     <div className="vessel bg-[#1D1E31] p-6 rounded-[2.5rem] border border-white/5 space-y-4">
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 ml-2">Session History</p>
                        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                           {[...bookings].sort((a, b) => new Date(b.start_time).getTime() - new Date(a.start_time).getTime()).slice(0, 15).map(b => (
                              <button 
                                 key={b.id} 
                                 onClick={() => setSelectedBooking(b)}
                                 className={cn(
                                    "w-full p-4 rounded-2xl border transition-all flex items-center justify-between group",
                                    selectedBooking?.id === b.id 
                                       ? "bg-[#D3C4B5] border-transparent" 
                                       : "bg-[#111224] border-white/5 hover:border-[#D3C4B5]/30 text-white"
                                 )}
                              >
                                 <div className="text-left">
                                    <p className={cn(
                                       "text-[10px] font-black uppercase",
                                       selectedBooking?.id === b.id ? "text-[#382F24]" : "text-white"
                                    )}>{b.parents?.name}</p>
                                    <p className={cn(
                                       "text-[8px] font-bold uppercase tracking-tighter",
                                       selectedBooking?.id === b.id ? "text-[#382F24]/60" : "text-zinc-600"
                                    )}>{new Date(b.start_time).toLocaleDateString()}</p>
                                 </div>
                                 <ChevronRight className={cn(
                                    "h-3 w-3",
                                    selectedBooking?.id === b.id ? "text-[#382F24]" : "text-zinc-800"
                                 )} />
                              </button>
                           ))}
                        </div>
                     </div>
                  </div>
 
                  <div className="lg:col-span-8">
                     {selectedBooking ? (
                        <div className="vessel bg-[#1D1E31] p-10 rounded-[3rem] border border-white/5 space-y-8 animate-in fade-in zoom-in-95 duration-500">
                           <div className="flex items-center justify-between border-b border-white/5 pb-8">
                              <div className="flex items-center gap-6">
                                 <div className="h-16 w-16 rounded-2xl bg-[#D3C4B5]/10 flex items-center justify-center text-[#D3C4B5]">
                                    <FileText className="h-8 w-8" />
                                 </div>
                                 <div className="space-y-1">
                                    <h3 className="text-2xl font-manrope font-black tracking-tight italic uppercase text-white">
                                       Session with {selectedBooking.parents?.name}
                                    </h3>
                                    <p className="text-[10px] font-bold text-[#BACCB3] uppercase tracking-widest">
                                       Service: {selectedBooking.services?.title} • {new Date(selectedBooking.start_time).toLocaleDateString()}
                                    </p>
                                 </div>
                              </div>
                              <Badge className={cn(
                                 "px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest italic",
                                 selectedBooking.status === 'completed' ? "bg-[#BACCB3]/20 text-[#BACCB3]" : "bg-[#D3C4B5]/20 text-[#D3C4B5]"
                              )}>
                                 {selectedBooking.status}
                              </Badge>
                           </div>

                           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="space-y-4">
                                 <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Clinical Observation</label>
                                 <textarea 
                                    value={sessionDoc.notes}
                                    onChange={(e) => setSessionDoc({...sessionDoc, notes: e.target.value})}
                                    className="w-full bg-[#111224] border border-white/5 rounded-[2rem] p-8 text-sm font-bold min-h-[250px] resize-none focus:ring-1 ring-[#D3C4B5]/50 outline-none transition-all"
                                    placeholder="The heart of the session. Record progress, neuro-affirming observations, and connection points..."
                                 />
                              </div>
                              <div className="space-y-8">
                                 <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-[#BACCB3] ml-2">Family Recommendations</label>
                                    <textarea 
                                       value={sessionDoc.recommendations}
                                       onChange={(e) => setSessionDoc({...sessionDoc, recommendations: e.target.value})}
                                       className="w-full bg-[#111224] border border-white/5 rounded-[2rem] p-6 text-sm font-bold min-h-[120px] resize-none focus:ring-1 ring-[#BACCB3]/50 outline-none transition-all placeholder:text-zinc-800"
                                       placeholder="What should the family focus on this week? Direct, supportive advice..."
                                    />
                                 </div>
                                 <div className="space-y-4">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-zinc-700 ml-2">Internal Clinical Index (Private)</label>
                                    <textarea 
                                       value={sessionDoc.internal_clinical_notes}
                                       onChange={(e) => setSessionDoc({...sessionDoc, internal_clinical_notes: e.target.value})}
                                       className="w-full bg-[#111224] border border-white/5 rounded-[2rem] p-6 text-sm font-bold min-h-[120px] resize-none focus:ring-1 ring-white/10 outline-none transition-all grayscale opacity-60 hover:opacity-100 transition-opacity placeholder:text-zinc-800"
                                       placeholder="Strictly clinical metadata, diagnostic insights, or institutional notes..."
                                    />
                                 </div>
                              </div>
                           </div>

                           <div className="pt-4 flex justify-end gap-6">
                              <Button 
                                 variant="ghost" 
                                 className="text-[10px] font-black uppercase tracking-widest text-zinc-600"
                                 onClick={() => setSelectedBooking(null)}
                              >
                                 Close Record
                              </Button>
                              <Button 
                                 disabled={isSavingDoc}
                                 onClick={handleSaveSession}
                                 className="h-16 px-12 rounded-2xl bg-[#D3C4B5] text-[#382F24] font-black uppercase text-[10px] tracking-widest hover:shadow-2xl transition-all active:scale-95"
                              >
                                 {isSavingDoc ? "Syncing..." : <><Save className="h-4 w-4 mr-2" /> Commit Clinical Intelligence</>}
                              </Button>
                           </div>
                        </div>
                     ) : (
                        <div className="vessel bg-[#1D1E31] p-10 rounded-[3rem] border border-white/5 min-h-[660px] flex flex-col items-center justify-center text-center space-y-6">
                           <div className="h-24 w-24 rounded-full bg-white/5 flex items-center justify-center text-zinc-800 transition-transform hover:scale-110 active:scale-90 cursor-pointer group">
                              <FileText className="h-10 w-10 group-hover:text-[#D3C4B5] transition-colors" />
                           </div>
                           <div className="space-y-2">
                              <h4 className="text-xl font-black text-white italic underline decoration-[#BACCB3] decoration-4 underline-offset-8">Select a Session to Document</h4>
                              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest max-w-xs mx-auto">Click a record on the left to initialize clinical notes for that meeting.</p>
                           </div>
                        </div>
                     )}
                  </div>
               </div>
            </div>
          )}

                {/* TAB: VAULT (Payments) */}
         {activeTab === 'vault' && (
            <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="vessel bg-[#1D1E31] p-10 rounded-[3rem] border border-white/5 space-y-8 lg:col-span-2">
                     <div className="flex items-center justify-between">
                        <div className="space-y-1">
                           <h3 className="text-3xl font-manrope font-black tracking-tight italic uppercase text-white">Financial Statement</h3>
                           <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Verification of therapeutic financial sync across sessions.</p>
                        </div>
                        <div className="h-12 w-12 rounded-2xl bg-[#D3C4B5]/10 flex items-center justify-center text-[#D3C4B5]">
                           <CreditCard className="h-6 w-6" />
                        </div>
                     </div>
 
                     <div className="space-y-4">
                        <div className="grid grid-cols-4 px-6 pb-2 text-[8px] font-black uppercase tracking-[0.2em] text-zinc-700">
                           <span>Reference</span>
                           <span>Type</span>
                           <span>Date</span>
                           <span className="text-right">Amount</span>
                        </div>
                        {payments.length > 0 ? (
                           payments.map(payment => (
                              <div key={payment.id} className="p-6 rounded-2xl bg-[#111224] border border-white/5 flex items-center justify-between group hover:border-[#BACCB3]/20 transition-all">
                                 <div className="grid grid-cols-4 w-full items-center">
                                    <div className="flex items-center gap-4">
                                       <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-500 group-hover:text-[#BACCB3]">
                                          <ShieldCheck className="h-4 w-4" />
                                       </div>
                                       <div>
                                          <p className="text-[10px] font-black text-white uppercase tracking-tighter">#{payment.id.slice(0, 8)}</p>
                                          <p className="text-[8px] font-bold text-zinc-700">Booking: {payment.booking_id.slice(0, 5)}</p>
                                       </div>
                                    </div>
                                    <div className="text-[9px] font-black text-[#BACCB3] uppercase tracking-widest italic">{payment.status}</div>
                                    <div className="text-[9px] font-bold text-zinc-500">{new Date(payment.created_at).toLocaleDateString()}</div>
                                    <div className="text-right">
                                       <p className="text-lg font-manrope font-black text-white group-hover:text-[#BACCB3] transition-colors">₹{payment.amount}</p>
                                    </div>
                                 </div>
                              </div>
                           ))
                        ) : (
                           <div className="py-20 text-center space-y-4">
                              <div className="h-16 w-16 mx-auto rounded-full bg-white/5 flex items-center justify-center text-zinc-900">
                                 <CreditCard className="h-8 w-8" />
                              </div>
                              <p className="text-[10px] font-black uppercase tracking-widest text-zinc-700">No payout records detected in the vault.</p>
                           </div>
                        )}
                     </div>
                  </div>
 
                  <div className="space-y-8">
                     {/* SETTLEMENT CARD */}
                     <div className="vessel bg-[#BACCB3] p-10 rounded-[3rem] text-[#253423] space-y-8 shadow-2xl shadow-[#BACCB3]/20 relative overflow-hidden group">
                        <div className="absolute -bottom-8 -right-8 h-32 w-32 bg-[#253423]/5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-1000" />
                        
                        <div className="space-y-2">
                           <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Verified Balance</p>
                           <h4 className="text-5xl font-manrope font-black tracking-tighter italic">₹{payments.reduce((acc, curr) => acc + Number(curr.amount), 0)}</h4>
                        </div>

                        <div className="space-y-4 pt-10 border-t border-black/10">
                           <div className="flex justify-between items-center">
                              <span className="text-[10px] font-black uppercase opacity-60">Payout Tier</span>
                              <Badge className="bg-[#111224] text-white border-none text-[8px] font-black px-3 py-1">Premium Specialist</Badge>
                           </div>
                           <div className="flex justify-between items-center">
                              <span className="text-[10px] font-black uppercase opacity-60">Next Cycle</span>
                              <span className="text-[10px] font-black italic underline decoration-black underline-offset-4">Automatic (T+1)</span>
                           </div>
                        </div>

                        <Button 
                           onClick={() => {
                              toast.success("Withdrawal initiated. High-density financial sync in progress.");
                              awardXP(20); // Small XP for financial engagement
                           }}
                           className="w-full h-16 rounded-2xl bg-[#111224] text-white font-black uppercase text-[9px] tracking-widest hover:bg-black transition-all shadow-xl"
                        >
                           Request Immediate Release
                        </Button>
                     </div>

                     {/* ANALYTICS PREVIEW */}
                     <div className="vessel bg-[#1D1E31] p-8 rounded-[2.5rem] border border-white/5 space-y-6">
                        <h5 className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Yield Analytics</h5>
                        <div className="space-y-4">
                           <div className="flex items-center justify-between">
                              <p className="text-[10px] font-bold text-white">Sessions this month</p>
                              <Badge variant="outline" className="text-[9px] border-white/10 text-[#BACCB3]">{bookings.filter(b => b.status === 'completed').length}</Badge>
                           </div>
                           <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                              <div className="h-full bg-[#BACCB3] w-2/3" />
                           </div>
                           <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-tighter italic">Top 10% of specialists in your region.</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         )}

         {/* TAB: IDENTITY (Existing Profile Sync) */}
         {activeTab === 'identity' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
               {/* LEFT: PROFILE EDIT */}
               <div className="lg:col-span-4 space-y-10">
                  <div className="space-y-4">
                     <Badge className="bg-[#BACCB3]/10 text-[#BACCB3] border-none rounded-full px-6 py-1.5 text-[9px] font-black uppercase tracking-widest italic">
                        Identity Architecture
                     </Badge>
                     <h1 className="text-5xl font-manrope font-black tracking-tighter italic uppercase text-white leading-none">
                        Discovery <br/> <span className="text-[#D3C4B5]">Sync.</span>
                     </h1>
                  </div>

                  <div className="vessel bg-[#1D1E31] p-8 rounded-[3rem] border border-white/5 space-y-8 relative overflow-hidden group shadow-2xl">
                     <div className="absolute top-0 right-0 h-32 w-32 bg-[#D3C4B5]/5 blur-[60px] rounded-full group-hover:scale-150 transition-transform duration-1000" />
                     
                     <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#D3C4B5] mb-2 px-2">Display Name</p>
                        <Input 
                           value={provider?.name || ""} 
                           onChange={(e) => setProvider({...provider, name: e.target.value})}
                           className="bg-[#111224] border-none rounded-2xl h-14 px-6 text-sm font-bold shadow-inner focus:ring-1 ring-[#D3C4B5]/50"
                        />
                     </div>

                     <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[#D3C4B5] mb-2 px-2">Narrative Bio</p>
                        <textarea 
                           rows={4}
                           value={provider?.bio || ""}
                           onChange={(e) => setProvider({...provider, bio: e.target.value})}
                           className="w-full bg-[#111224] border-none rounded-2xl p-6 text-sm font-bold resize-none shadow-inner focus:ring-1 ring-[#D3C4B5]/50 outline-none placeholder:text-zinc-800"
                           placeholder="Share your therapeutic methodology..."
                        />
                     </div>

                     <Button 
                        onClick={handleUpdate}
                        disabled={saving}
                        className="h-16 w-full rounded-2xl bg-[#D3C4B5] text-[#382F24] font-black uppercase tracking-widest text-[10px] hover:shadow-2xl transition-all hover:-translate-y-1 active:scale-95"
                     >
                        {saving ? "Syncing..." : <><Save className="h-4 w-4 mr-2" /> Commit Profile Sync</>}
                     </Button>
                  </div>
               </div>

               {/* RIGHT: CLINICAL CONFIG */}
               <div className="lg:col-span-8 space-y-16">
                  
                  {/* CLINICAL SERVICES SELECTION */}
                  <div className="space-y-8">
                     <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-[#D3C4B5]/10 flex items-center justify-center text-[#D3C4B5]">
                           <Tags className="h-7 w-7" />
                        </div>
                        <div className="space-y-1">
                           <h3 className="text-3xl font-manrope font-black tracking-tighter italic uppercase italic">Clinical Verticals</h3>
                           <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Select the specific interventions you offer in the Sanctuary.</p>
                        </div>
                     </div>

                     <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                        {services.map(service => (
                           <button
                              key={service.id}
                              onClick={() => toggleSpecialization(service.name)}
                              className={cn(
                                 "h-16 px-6 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border flex items-center justify-between group/btn",
                                 provider.specializations?.includes(service.name)
                                    ? "bg-[#D3C4B5] text-[#382F24] border-transparent shadow-xl scale-[1.02]"
                                    : "bg-[#1D1E31] text-zinc-500 border-white/5 hover:border-[#D3C4B5]/30"
                              )}
                           >
                              {service.name}
                              {provider.specializations?.includes(service.name) && <Plus className="h-4 w-4 rotate-45" />}
                           </button>
                        ))}
                     </div>
                  </div>

                  {/* AGE GROUP SELECTION */}
                  <div className="space-y-8">
                     <div className="flex items-center gap-4">
                        <div className="h-14 w-14 rounded-2xl bg-[#BACCB3]/10 flex items-center justify-center text-[#BACCB3]">
                           <Baby className="h-7 w-7" />
                        </div>
                        <div className="space-y-1">
                           <h3 className="text-3xl font-manrope font-black tracking-tighter italic uppercase italic">Target Demographics</h3>
                           <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Identify the age groups within your clinical scope.</p>
                        </div>
                     </div>

                     <div className="flex flex-wrap gap-4">
                        {AGE_GROUPS.map(age => (
                           <button
                              key={age}
                              onClick={() => toggleAgeGroup(age)}
                              className={cn(
                                 "px-8 h-16 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border group/age",
                                 provider.age_groups?.includes(age)
                                    ? "bg-[#BACCB3] text-[#253423] border-transparent shadow-xl scale-[1.02]"
                                    : "bg-[#1D1E31] text-zinc-500 border-white/5 hover:border-[#BACCB3]/30"
                              )}
                           >
                              {age}
                           </button>
                        ))}
                     </div>
                  </div>
               </div>
            </div>
         )}
      </main>

      <Footer />
    </div>
  );
}
