"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { MapPin, UserPlus, X, Loader2 } from "lucide-react";
import { createSpecialist } from "../actions/specialists";

export default function AddSpecialistForm({ onCancel }: { onCancel: () => void }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    tier: 'partner',
    location: '',
    bio: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const res = await createSpecialist(formData);
    setLoading(false);
    if (res.success) {
        onCancel();
    } else {
        alert(res.error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-[#191a2d] border border-[#7c6ff7]/20 rounded-[2.5rem] p-10 space-y-8 shadow-3xl shadow-[#7c6ff7]/5 relative">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 rounded-2xl bg-[#7c6ff7]/10 flex items-center justify-center text-[#7c6ff7]">
            <UserPlus className="h-6 w-6" />
        </div>
        <div>
            <h3 className="text-xl font-black italic uppercase text-white tracking-tight">Onboard New Specialist</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600 italic">This will create a provider profile and send an invitation.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 ml-1">First Name</label>
            <Input 
                required
                value={formData.firstName}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                placeholder="John" 
                className="bg-[#111224] border-white/5 rounded-xl h-12 text-xs font-bold text-white placeholder:text-zinc-800" 
            />
        </div>
        <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 ml-1">Last Name</label>
            <Input 
                required
                value={formData.lastName}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                placeholder="Doe" 
                className="bg-[#111224] border-white/5 rounded-xl h-12 text-xs font-bold text-white placeholder:text-zinc-800" 
            />
        </div>
        <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 ml-1">Email Address</label>
            <Input 
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="john@insighte.care" 
                className="bg-[#111224] border-white/5 rounded-xl h-12 text-xs font-bold text-white placeholder:text-zinc-800" 
            />
        </div>
        <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 ml-1">Phone Number</label>
            <Input 
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="+91 98765 43210" 
                className="bg-[#111224] border-white/5 rounded-xl h-12 text-xs font-bold text-white placeholder:text-zinc-800" 
            />
        </div>

        <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 ml-1">Specialization Tier</label>
            <Select onValueChange={(val) => setFormData({...formData, tier: val})} defaultValue="partner">
                <SelectTrigger className="bg-[#111224] border-white/5 rounded-xl h-12 text-[10px] font-bold text-white">
                    <SelectValue placeholder="Choose Tier..." />
                </SelectTrigger>
                <SelectContent className="bg-[#1d1e31] border-white/10 text-white">
                    <SelectItem value="insighte" className="text-xs font-bold italic">Insighte Specialist</SelectItem>
                    <SelectItem value="premium" className="text-xs font-bold italic">Premium Partner</SelectItem>
                    <SelectItem value="partner" className="text-xs font-bold italic">General Partner</SelectItem>
                </SelectContent>
            </Select>
        </div>

        <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 ml-1">Primary Location</label>
            <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-700" />
                <Input 
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="City / Center Name" 
                    className="pl-10 bg-[#111224] border-white/5 rounded-xl h-12 text-xs font-bold text-white placeholder:text-zinc-800" 
                />
            </div>
        </div>

        <div className="space-y-2 lg:col-span-2">
            <label className="text-[9px] font-black uppercase tracking-widest text-zinc-500 ml-1">Clinical Portfolio / Short Bio</label>
            <Textarea 
                value={formData.bio}
                onChange={(e) => setFormData({...formData, bio: e.target.value})}
                placeholder="Describe administrative background and expertise..." 
                className="bg-[#111224] border-white/5 rounded-xl min-h-[48px] h-12 py-3 text-xs font-bold text-white placeholder:text-zinc-800 resize-none" 
            />
        </div>
      </div>

      <div className="flex items-center gap-4 pt-4">
        <Button 
            disabled={loading}
            type="submit"
            className="h-14 px-10 rounded-2xl bg-[#7c6ff7] text-white font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-[#7c6ff7]/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
        >
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Send Invite & Create Profile"}
        </Button>
        <button type="button" onClick={onCancel} className="text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-white transition-all ml-4">
            Cancel Onboarding
        </button>
      </div>
    </form>
  );
}
