"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Save, 
  UserCircle, 
  MapPin, 
  Globe, 
  Sparkles, 
  AlertCircle, 
  Loader2, 
  Plus, 
  Trash2, 
  GraduationCap, 
  Briefcase, 
  CheckCircle2,
  CloudUpload,
  MessageSquare,
  Eye,
  EyeOff,
  Rocket
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { 
  getProfileDetails, 
  updateProfileDetails, 
  getProviderReviews, 
  toggleReviewLive,
  submitProfileForReview 
} from "@/lib/actions/provider/core";
import Image from "next/image";

export default function ProviderProfile() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState<any>(null);
  const [partner, setPartner] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);

  const [isAddingEdu, setIsAddingEdu] = useState(false);
  const [isAddingExp, setIsAddingExp] = useState(false);
  const [newEdu, setNewEdu] = useState({ degree: '', school: '', year: '' });
  const [newExp, setNewExp] = useState({ role: '', company: '', duration: '' });

  useEffect(() => {
    async function loadData() {
      const [pRes, rRes] = await Promise.all([
        getProfileDetails(),
        getProviderReviews()
      ]);
      
      if (pRes.success) {
        setProfile(pRes.profile);
        setPartner(pRes.partner);
      }
      if (rRes.success) {
        setReviews(rRes.reviews || []);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    const result = await updateProfileDetails(
      { full_name: profile.full_name, bio: profile.bio },
      { 
        name: partner.name, 
        experience_years: partner.experience_years, 
        city: partner.city, 
        location: partner.location, 
        languages: partner.languages,
        academic_experience: partner.academic_experience,
        professional_experience: partner.professional_experience,
        about: partner.about,
        approach: partner.approach,
        parent_insights: partner.parent_insights
      }
    );
    if (result.success) {
      toast.success("Profile Updated", { description: "Your changes have been saved." });
    } else {
      toast.error(result.error || "Sync failure");
    }
    setSaving(false);
  };

  const handleAddEdu = () => {
    if (!newEdu.degree || !newEdu.school) return;
    const updatedEdu = [...(partner.academic_experience || []), newEdu];
    setPartner({ ...partner, academic_experience: updatedEdu });
    setNewEdu({ degree: '', school: '', year: '' });
    setIsAddingEdu(false);
  };

  const handleAddExp = () => {
    if (!newExp.role || !newExp.company) return;
    const updatedExp = [...(partner.professional_experience || []), newExp];
    setPartner({ ...partner, professional_experience: updatedExp });
    setNewExp({ role: '', company: '', duration: '' });
    setIsAddingExp(false);
  };
  
  const handleAddInsight = (text: string) => {
    const updated = [...(partner.parent_insights || []), text];
    setPartner({ ...partner, parent_insights: updated });
  };
  
  const generateInsightsHeuristic = () => {
    const keywords = ["progress", "focus", "confidence", "communication", "calm", "engaging", "growth"];
    const found: string[] = [];
    reviews.forEach(r => {
      keywords.forEach(k => {
        if (r.content?.toLowerCase().includes(k)) {
          const phrase = `Improved ${k} and engagement`;
          if (!found.includes(phrase)) found.push(phrase);
        }
      });
    });
    if (found.length === 0) found.push("Measuring progress milestones every month");
    setPartner({ ...partner, parent_insights: found.slice(0, 6) });
    toast.success("Insights Generated", { description: "Analyzed feedback trends." });
  };

  const handleToggleReview = async (reviewId: string, currentStatus: boolean) => {
    const result = await toggleReviewLive(reviewId, !currentStatus);
    if (result.success) {
      setReviews(prev => prev.map(r => r.id === reviewId ? { ...r, is_featured: !currentStatus } : r));
      toast.success(!currentStatus ? "Review is now Live" : "Review hidden");
    }
  };

  const handleSubmitReview = async () => {
    const result = await submitProfileForReview();
    if (result.success) {
      setPartner({ ...partner, status: 'PENDING_REVIEW' });
      toast.success("Profile Submitted", { description: "Insighte HQ will review your updates shortly." });
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 italic text-zinc-600">
        <Loader2 className="h-10 w-10 animate-spin text-[#D3C4B5]" />
        <p className="text-[10px] font-black uppercase tracking-[0.3em]">Loading Profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-[1600px] mx-auto px-4 lg:px-10 pb-20 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 mt-12 mb-16">
        <div className="space-y-4">
          <Badge className="bg-[#D3C4B5]/10 text-[#D3C4B5] border-none rounded-full px-6 py-1.5 text-[10px] font-black uppercase tracking-widest italic">
            My Profile // Settings
          </Badge>
          <div className="flex items-center gap-6">
            <h1 className="text-6xl md:text-8xl font-black tracking-tighter italic uppercase text-white leading-none">
              My <br/> <span className="text-[#D3C4B5]">Profile.</span>
            </h1>
            {partner?.status === 'LIVE' ? (
              <Badge className="bg-[#BACCB3] text-[#111224] h-10 px-6 rounded-full font-black text-[10px] uppercase italic">Profile Live</Badge>
            ) : (
              <Badge className="bg-orange-500 text-[#111224] h-10 px-6 rounded-full font-black text-[10px] uppercase italic">{partner?.status?.replace('_', ' ') || 'DRAFT'}</Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4">
           {partner?.status !== 'PENDING_REVIEW' && partner?.status !== 'LIVE' && (
             <Button 
                onClick={handleSubmitReview}
                variant="outline"
                className="h-20 px-8 rounded-3xl border-white/10 text-white font-black uppercase tracking-widest text-[11px] hover:bg-white hover:text-black transition-all"
             >
                <Rocket className="h-5 w-5 mr-3" />
                Go Live
             </Button>
           )}
           <Button 
            onClick={handleSave}
            disabled={saving}
            className="h-20 px-12 rounded-3xl bg-[#D3C4B5] text-[#111224] font-black uppercase tracking-widest text-[11px] hover:scale-105 transition-all shadow-2xl flex items-center gap-3"
          >
            {saving ? <Loader2 className="h-5 w-5 animate-spin" /> : <Save className="h-5 w-5" />}
            Save Profile
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-12">
        
        {/* LEFT: VISUAL IDENTITY (4/12) */}
        <div className="xl:col-span-4 space-y-10">
           <div className="vessel bg-[#111224] p-12 rounded-[4rem] border border-white/5 space-y-10 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 pointer-events-none" />
              
              <div className="relative z-10 mx-auto w-64 h-64 rounded-[3.5rem] bg-[#1D1E31] p-1 border border-white/10 group-hover:border-[#D3C4B5]/30 transition-all duration-700 overflow-hidden shadow-inner">
                 <Image src={partner?.avatar_url || `https://i.pravatar.cc/300?u=${partner?.id}`} alt="" fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" />
                 <label className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-all cursor-pointer backdrop-blur-sm">
                    <CloudUpload className="h-12 w-12 text-[#D3C4B5]" />
                    <input type="file" className="hidden" />
                 </label>
              </div>

              <div className="relative z-10 text-center space-y-3">
                 <h3 className="text-4xl font-black italic uppercase text-white tracking-tighter leading-none">{partner?.name || "Full Name"}</h3>
                 <Badge className="bg-[#BACCB3]/10 text-[#BACCB3] border-none font-black uppercase tracking-widest px-4 py-1 text-[8px] italic">Verified Instructor</Badge>
              </div>

              <div className="relative z-10 pt-10 border-t border-white/5 grid grid-cols-2 gap-8 text-center">
                 <div>
                    <p className="text-[8px] font-black uppercase text-zinc-600 italic">Experience</p>
                    <p className="text-xl font-black italic text-white">{partner?.experience_years || 0} Years</p>
                 </div>
                 <div>
                    <p className="text-[8px] font-black uppercase text-zinc-600 italic">Global Rank</p>
                    <p className="text-xl font-black italic text-[#BACCB3]">#42</p>
                 </div>
              </div>
           </div>

           {/* SPATIAL CONTEXT */}
           <div className="vessel bg-[#1D1E31]/40 border border-white/5 p-12 rounded-[3.5rem] space-y-10 shadow-xl">
              <div className="flex items-center gap-4">
                 <MapPin className="h-8 w-8 text-[#D3C4B5]" />
                 <h4 className="text-2xl font-black italic uppercase tracking-tight text-white leading-none">My Location.</h4>
              </div>
              <div className="space-y-6">
                 <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                       <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-700 ml-4 italic">Primary City</label>
                       <Input value={partner?.city || ''} onChange={e => setPartner({...partner, city: e.target.value})} className="bg-[#0A0B1A] border-none h-16 rounded-2xl px-6 font-bold text-white uppercase italic shadow-inner" placeholder="BANGALORE" />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[9px] font-black uppercase tracking-[0.2em] text-zinc-700 ml-4 italic">Operational Studio</label>
                       <Input value={partner?.location || ''} onChange={e => setPartner({...partner, location: e.target.value})} className="bg-[#0A0B1A] border-none h-16 rounded-2xl px-6 font-bold text-white uppercase italic shadow-inner" placeholder="INDIRANAGAR" />
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* RIGHT: CLINICAL THESIS (8/12) */}
        <div className="xl:col-span-8 space-y-12">
           
           <div className="vessel bg-[#111224] border border-white/5 p-12 rounded-[4rem] space-y-10 shadow-2xl">
              <div className="flex items-center justify-between">
                 <div className="space-y-1">
                    <h3 className="text-4xl font-black italic uppercase text-white tracking-tight leading-none">My <span className="text-[#D3C4B5]">Bio.</span></h3>
                    <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest italic leading-none ml-1">Tell students about your teaching style and experience</p>
                 </div>
                 <Badge className="bg-white/5 text-zinc-600 px-6 py-2 rounded-full font-black text-[9px] uppercase italic">Profile Data Sync Active</Badge>
              </div>

              <Textarea 
                value={profile?.bio || ''} 
                onChange={e => setProfile({...profile, bio: e.target.value})}
                className="bg-[#1D1E31]/40 border border-white/5 rounded-[3rem] p-12 min-h-[350px] text-zinc-400 font-medium text-lg italic leading-relaxed focus:ring-1 ring-[#D3C4B5]/30 scrollbar-hide resize-none shadow-inner" 
                placeholder="WHO ARE YOU? WHAT DO YOU TEACH?..."
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                     <label className="text-[10px] font-black uppercase tracking-widest text-zinc-700 ml-4 italic">Professional Name</label>
                     <Input value={partner?.name || ''} onChange={e => setPartner({...partner, name: e.target.value})} className="bg-[#1D1E31] border-none h-16 rounded-2xl px-8 font-black text-white italic shadow-inner uppercase text-sm" placeholder="e.g. Dr. Sarah" />
                  </div>
                  <div className="space-y-4">
                     <label className="text-[10px] font-black uppercase tracking-widest text-zinc-700 ml-4 italic">Years of Experience</label>
                     <Input type="number" value={partner?.experience_years || 0} onChange={e => setPartner({...partner, experience_years: parseInt(e.target.value)})} className="bg-[#1D1E31] border-none h-16 rounded-2xl px-8 font-black text-white italic shadow-inner text-sm" placeholder="5" />
                  </div>
              </div>
           </div>

           {/* ABOUT & APPROACH SECTIONS */}
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="vessel bg-[#111224] border border-white/5 p-12 rounded-[4rem] space-y-6 shadow-2xl">
                 <div className="space-y-1">
                    <h3 className="text-3xl font-black italic uppercase text-white tracking-tight leading-none">About <span className="text-[#D3C4B5]">Me.</span></h3>
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest italic ml-1">Your detailed professional background</p>
                 </div>
                 <Textarea 
                   value={partner?.about || ''} 
                   onChange={e => setPartner({...partner, about: e.target.value})}
                   className="bg-[#1D1E31]/40 border border-white/5 rounded-[2.5rem] p-8 min-h-[250px] text-zinc-400 font-medium text-sm italic leading-relaxed focus:ring-1 ring-[#D3C4B5]/30 scrollbar-hide resize-none shadow-inner" 
                   placeholder="DESCRIBE YOUR JOURNEY..."
                 />
              </div>

              <div className="vessel bg-[#111224] border border-white/5 p-12 rounded-[4rem] space-y-6 shadow-2xl">
                 <div className="space-y-1">
                    <h3 className="text-3xl font-black italic uppercase text-white tracking-tight leading-none">Teaching <span className="text-[#D3C4B5]">Approach.</span></h3>
                    <p className="text-[9px] font-black text-zinc-600 uppercase tracking-widest italic ml-1">Your educational philosophy</p>
                 </div>
                 <Textarea 
                   value={partner?.approach || ''} 
                   onChange={e => setPartner({...partner, approach: e.target.value})}
                   className="bg-[#1D1E31]/40 border border-white/5 rounded-[2.5rem] p-8 min-h-[250px] text-zinc-400 font-medium text-sm italic leading-relaxed focus:ring-1 ring-[#D3C4B5]/30 scrollbar-hide resize-none shadow-inner" 
                   placeholder="HOW DO YOU WORK WITH CHILDREN?..."
                 />
              </div>
           </div>

           {/* PARENT INSIGHTS ANALYZER */}
           <div className="vessel bg-[#111224] border border-white/5 p-12 rounded-[4rem] space-y-10 shadow-2xl">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                    <Sparkles className="h-8 w-8 text-[#BACCB3]" />
                    <h3 className="text-4xl font-black italic uppercase text-white tracking-tight leading-none">Parent <span className="text-[#D3C4B5]">Insights.</span></h3>
                 </div>
                 <Button 
                   onClick={generateInsightsHeuristic}
                   className="h-14 px-8 rounded-2xl bg-white/5 text-[#D3C4B5] border border-[#D3C4B5]/20 font-black uppercase text-[10px] italic hover:bg-[#D3C4B5] hover:text-[#111224] transition-all"
                 >
                   Analyze Testimonials
                 </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {(partner?.parent_insights || []).map((insight: string, idx: number) => (
                   <div key={idx} className="flex items-center justify-between p-6 bg-[#1D1E31]/40 rounded-2xl border border-white/5 group">
                      <div className="flex items-center gap-3">
                         <CheckCircle2 className="h-4 w-4 text-[#BACCB3]" />
                         <span className="text-sm font-medium text-zinc-300 italic">{insight}</span>
                      </div>
                      <button 
                        onClick={() => {
                          const updated = partner.parent_insights.filter((_: any, i: number) => i !== idx);
                          setPartner({ ...partner, parent_insights: updated });
                        }}
                        className="opacity-0 group-hover:opacity-100 text-red-500/50 transition-all font-bold"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                   </div>
                 ))}
                 <div className="p-2 border border-dashed border-white/10 rounded-2xl flex items-center px-4">
                    <Input 
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAddInsight((e.target as HTMLInputElement).value);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }}
                      className="bg-transparent border-none h-10 text-xs text-zinc-500 italic shadow-none focus-visible:ring-0" 
                      placeholder="+ Add insight manually" 
                    />
                 </div>
              </div>
           </div>

           {/* ACADEMIC & PROFESSIONAL GRIDS */}
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="vessel bg-[#111224] border border-white/5 p-10 rounded-[3.5rem] space-y-8 shadow-2xl">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <GraduationCap className="h-6 w-6 text-[#D3C4B5]" />
                       <h4 className="text-xl font-black italic uppercase tracking-tighter text-white">Education.</h4>
                    </div>
                    <Button 
                      onClick={() => setIsAddingEdu(true)}
                      variant="ghost" 
                      size="icon" 
                      className="h-10 w-10 rounded-full border border-white/5 text-[#BACCB3]"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                 </div>
                 <div className="space-y-4">
                    {partner?.academic_experience?.map((edu: any, idx: number) => (
                      <div key={idx} className="p-6 bg-[#0A0B1A] border border-white/5 rounded-2xl flex justify-between items-center group">
                        <div>
                          <p className="text-[11px] font-black text-white italic">{edu.degree}</p>
                          <p className="text-[9px] font-bold text-zinc-700 uppercase">{edu.school} // {edu.year}</p>
                        </div>
                        <button 
                          onClick={() => {
                            const updated = partner.academic_experience.filter((_: any, i: number) => i !== idx);
                            setPartner({ ...partner, academic_experience: updated });
                          }}
                          className="opacity-0 group-hover:opacity-100 text-red-500 transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    {(!partner?.academic_experience || partner.academic_experience.length === 0) && (
                      <p className="text-[10px] font-bold text-zinc-800 uppercase italic p-6 text-center border border-dashed border-white/5 rounded-2xl">Add your qualifications</p>
                    )}
                 </div>
              </div>

              <div className="vessel bg-[#111224] border border-white/5 p-10 rounded-[3.5rem] space-y-8 shadow-2xl">
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <Briefcase className="h-6 w-6 text-[#D3C4B5]" />
                       <h4 className="text-xl font-black italic uppercase tracking-tighter text-white">Experience.</h4>
                    </div>
                    <Button 
                      onClick={() => setIsAddingExp(true)}
                      variant="ghost" 
                      size="icon" 
                      className="h-10 w-10 rounded-full border border-white/5 text-[#BACCB3]"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                 </div>
                 <div className="space-y-4">
                    {partner?.professional_experience?.map((exp: any, idx: number) => (
                      <div key={idx} className="p-6 bg-[#0A0B1A] border border-white/5 rounded-2xl flex justify-between items-center group">
                        <div>
                          <p className="text-[11px] font-black text-white italic">{exp.role}</p>
                          <p className="text-[9px] font-bold text-zinc-700 uppercase">{exp.company} // {exp.duration}</p>
                        </div>
                        <button 
                          onClick={() => {
                            const updated = partner.professional_experience.filter((_: any, i: number) => i !== idx);
                            setPartner({ ...partner, professional_experience: updated });
                          }}
                          className="opacity-0 group-hover:opacity-100 text-red-500 transition-all"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    {(!partner?.professional_experience || partner.professional_experience.length === 0) && (
                      <p className="text-[10px] font-bold text-zinc-800 uppercase italic p-6 text-center border border-dashed border-white/5 rounded-2xl">Add your professional path</p>
                    )}
                 </div>
              </div>
           </div>

           {/* TESTIMONIALS SECTION */}
           <div className="vessel bg-[#111224] border border-white/5 p-12 rounded-[4rem] space-y-10 shadow-2xl">
              <div className="flex items-center gap-4">
                 <MessageSquare className="h-8 w-8 text-[#BACCB3]" />
                 <h3 className="text-4xl font-black italic uppercase text-white tracking-tight">Student <span className="text-[#BACCB3]">Feedback.</span></h3>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                 {reviews.map((review) => (
                   <div key={review.id} className="p-10 rounded-[3rem] bg-[#0A0B1A] border border-white/5 space-y-6 relative group overflow-hidden">
                      <div className="absolute top-8 right-8 flex gap-2">
                        <button 
                          onClick={() => handleToggleReview(review.id, review.is_featured)}
                          className={cn(
                            "h-12 px-5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 transition-all",
                            review.is_featured ? "bg-[#BACCB3] text-[#111224]" : "bg-white/5 text-zinc-700"
                          )}
                        >
                          {review.is_featured ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                          {review.is_featured ? 'Public' : 'Hidden'}
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                         <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map(star => (
                              <Sparkles key={star} className={cn("h-4 w-4", star <= review.rating ? "text-yellow-500 fill-yellow-500" : "text-zinc-800")} />
                            ))}
                         </div>
                         <p className="text-white font-medium italic text-lg leading-relaxed">"{review.content}"</p>
                         <div>
                            <p className="text-[11px] font-black text-[#D3C4B5] uppercase italic">{review.parent_name || 'Anonymous Parent'}</p>
                            <p className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">{new Date(review.created_at).toLocaleDateString()}</p>
                         </div>
                      </div>
                   </div>
                 ))}
                 {reviews.length === 0 && (
                   <div className="col-span-full p-20 border border-dashed border-white/10 rounded-[4rem] text-center space-y-4">
                      <p className="text-[11px] font-black text-zinc-700 uppercase tracking-[0.3em] italic uppercase">No feedback entries found yet.</p>
                   </div>
                 )}
              </div>
           </div>
        </div>
      </div>

      {/* dialogs remain same */}
      <Dialog open={isAddingEdu} onOpenChange={setIsAddingEdu}>
         <DialogContent className="bg-[#111224] border border-white/10 text-white max-w-lg p-12 rounded-[3.5rem] shadow-2xl">
           <DialogHeader className="space-y-4">
             <DialogTitle className="text-4xl font-black italic uppercase tracking-tighter">Add <span className="text-[#D3C4B5]">Education.</span></DialogTitle>
           </DialogHeader>
           <div className="space-y-6 py-10">
             <div className="space-y-2">
               <label className="text-[9px] font-black uppercase text-zinc-700 italic ml-2">Degree / Certification</label>
               <Input 
                 value={newEdu.degree} 
                 onChange={e => setNewEdu({...newEdu, degree: e.target.value})}
                 className="h-16 bg-[#1D1E31] border-none rounded-2xl px-6 text-sm font-bold placeholder:text-zinc-800"
                 placeholder="e.g. MSc Behavioral Science"
               />
             </div>
             <div className="space-y-2">
               <label className="text-[9px] font-black uppercase text-zinc-700 italic ml-2">School / University</label>
               <Input 
                 value={newEdu.school} 
                 onChange={e => setNewEdu({...newEdu, school: e.target.value})}
                 className="h-16 bg-[#1D1E31] border-none rounded-2xl px-6 text-sm font-bold placeholder:text-zinc-800"
                 placeholder="e.g. University of Mumbai"
               />
             </div>
             <div className="space-y-2">
               <label className="text-[9px] font-black uppercase text-zinc-700 italic ml-2">Year</label>
               <Input 
                 value={newEdu.year} 
                 onChange={e => setNewEdu({...newEdu, year: e.target.value})}
                 className="h-16 bg-[#1D1E31] border-none rounded-2xl px-6 text-sm font-bold placeholder:text-zinc-800"
                 placeholder="2018"
               />
             </div>
           </div>
           <DialogFooter>
             <Button onClick={handleAddEdu} className="w-full h-16 bg-[#BACCB3] text-[#111224] font-black uppercase text-[10px] rounded-2xl italic">Confirm Addition</Button>
           </DialogFooter>
         </DialogContent>
      </Dialog>

      <Dialog open={isAddingExp} onOpenChange={setIsAddingExp}>
         <DialogContent className="bg-[#111224] border border-white/10 text-white max-w-lg p-12 rounded-[3.5rem] shadow-2xl">
           <DialogHeader className="space-y-4">
             <DialogTitle className="text-4xl font-black italic uppercase tracking-tighter">Add <span className="text-[#D3C4B5]">Experience.</span></DialogTitle>
           </DialogHeader>
           <div className="space-y-6 py-10">
             <div className="space-y-2">
               <label className="text-[9px] font-black uppercase text-zinc-700 italic ml-2">Role Title</label>
               <Input 
                 value={newExp.role} 
                 onChange={e => setNewExp({...newExp, role: e.target.value})}
                 className="h-16 bg-[#1D1E31] border-none rounded-2xl px-6 text-sm font-bold placeholder:text-zinc-800"
                 placeholder="e.g. Special Educator"
               />
             </div>
             <div className="space-y-2">
               <label className="text-[9px] font-black uppercase text-zinc-700 italic ml-2">Organization</label>
               <Input 
                 value={newExp.company} 
                 onChange={e => setNewExp({...newExp, company: e.target.value})}
                 className="h-16 bg-[#1D1E31] border-none rounded-2xl px-6 text-sm font-bold placeholder:text-zinc-800"
                 placeholder="e.g. Inclusive Mind School"
               />
             </div>
             <div className="space-y-2">
               <label className="text-[9px] font-black uppercase text-zinc-700 italic ml-2">Duration</label>
               <Input 
                 value={newExp.duration} 
                 onChange={e => setNewExp({...newExp, duration: e.target.value})}
                 className="h-16 bg-[#1D1E31] border-none rounded-2xl px-6 text-sm font-bold placeholder:text-zinc-800"
                 placeholder="2020 - Present"
               />
             </div>
           </div>
           <DialogFooter>
             <Button onClick={handleAddExp} className="w-full h-16 bg-[#BACCB3] text-[#111224] font-black uppercase text-[10px] rounded-2xl italic">Confirm Addition</Button>
           </DialogFooter>
         </DialogContent>
      </Dialog>

    </div>
  );
}
