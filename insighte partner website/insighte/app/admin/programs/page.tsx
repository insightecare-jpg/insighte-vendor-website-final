"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  Filter, 
  ArrowRight, 
  Package, 
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function AdminProgramsPage() {
  const supabase = createClient();
  const [programs, setPrograms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  // Form State
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    image_url: "",
    features: [] as string[]
  });

  const [newFeature, setNewFeature] = useState("");

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("curations")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
       toast.error("Failed to load clinical programs.");
    } else {
       setPrograms(data || []);
    }
    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.category) return;

    const payload = {
      ...formData,
      price: parseFloat(formData.price as string),
    };

    if (editingId) {
      const { error } = await supabase.from("curations").update(payload).eq("id", editingId);
      if (error) toast.error("Curation update failed.");
      else {
         toast.success("Program details synchronized.");
         setEditingId(null);
      }
    } else {
      const { error } = await supabase.from("curations").insert([payload]);
      if (error) toast.error("Failed to manifest new curation.");
      else {
         toast.success("New care package launched.");
         setIsAdding(false);
      }
    }
    
    setFormData({ title: "", description: "", price: "", category: "", image_url: "", features: [] });
    fetchPrograms();
  };

  const deleteProgram = async (id: string) => {
     if(!confirm("Decommission this care program? This action is irreversible.")) return;

     const { error } = await supabase.from("curations").delete().eq("id", id);
     if (error) toast.error("Decommission protocol failed.");
     else {
        toast.success("Program archived.");
        fetchPrograms();
     }
  };

  const addFeature = () => {
     if (newFeature.trim()) {
        setFormData({ ...formData, features: [...formData.features, newFeature.trim()] });
        setNewFeature("");
     }
  };

  const removeFeature = (index: number) => {
     const updated = formData.features.filter((_, i) => i !== index);
     setFormData({ ...formData, features: updated });
  };

  const filtered = programs.filter(p => 
     p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
     p.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-16 pb-24 animate-fade-in-up">
       {/* HEADER ARCHITECTURE */}
       <header className="flex flex-col lg:flex-row items-end justify-between gap-12 text-zinc-100">
          <div className="space-y-4 max-w-2xl text-center lg:text-left">
             <div className="flex items-center gap-4 justify-center lg:justify-start">
               <Badge className="bg-[#BACCB3]/10 text-[#BACCB3] border-none rounded-full px-6 py-1.5 text-[9px] font-black uppercase tracking-widest italic">
                  Institutional Assets
               </Badge>
             </div>
             <h1 className="text-8xl font-black font-manrope tracking-tighter leading-[0.85] italic uppercase">
                Program <br/> <span className="text-[#D3C4B5]">Curation.</span>
             </h1>
             <p className="text-2xl text-zinc-600 font-medium italic max-w-lg">
                Manage the high-density curated care packages offered across the Insighte Sanctuary.
             </p>
          </div>

          <div className="flex items-center gap-4">
             <div className="relative group">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 group-hover:text-[#D3C4B5] transition-colors" />
                <Input 
                   placeholder="Search programs..."
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="h-16 w-80 pl-16 rounded-full bg-[#1D1E31]/50 border-white/5 focus:border-[#D3C4B5]/40 text-sm font-bold shadow-2xl transition-all"
                />
             </div>
             <Button 
                onClick={() => { setIsAdding(true); setEditingId(null); }}
                className="h-16 px-10 rounded-full bg-[#D3C4B5] text-[#382F24] font-black uppercase tracking-widest text-[9px] hover:shadow-2xl hover:scale-105 transition-all"
             >
                New Curation <Plus className="ml-3 h-4 w-4" />
             </Button>
          </div>
       </header>

       {/* ADD/EDIT MODAL OVERLAY */}
       {(isAdding || editingId) && (
         <div className="fixed inset-0 z-[200] flex items-center justify-center p-8 bg-[#111224]/90 backdrop-blur-2xl">
            <div className="vessel bg-[#1D1E31] w-full max-w-4xl p-16 rounded-[4rem] border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] relative overflow-hidden flex flex-col md:flex-row gap-16">
               <div className="absolute top-0 right-0 h-[500px] w-[500px] bg-[#D3C4B5]/5 blur-[120px] rounded-full -mr-64 -mt-64" />
               
               <div className="flex-1 space-y-8">
                  <h2 className="text-6xl font-black font-manrope italic uppercase tracking-tighter text-white">
                     {editingId ? "Refine" : "Launch"} <br/> <span className="text-[#D3C4B5]">Curation.</span>
                  </h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                     <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2 space-y-2">
                           <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Program Title</p>
                           <Input 
                              required 
                              value={formData.title} 
                              onChange={(e) => setFormData({...formData, title: e.target.value})}
                              className="bg-[#111224] border-none rounded-2xl h-14 px-6 text-sm font-bold shadow-inner"
                           />
                        </div>
                        <div className="space-y-2">
                           <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Category Tag</p>
                           <Input 
                              required 
                              value={formData.category} 
                              onChange={(e) => setFormData({...formData, category: e.target.value})}
                              className="bg-[#111224] border-none rounded-2xl h-14 px-6 text-sm font-bold shadow-inner"
                              placeholder="e.g. Therapy, Tutoring"
                           />
                        </div>
                        <div className="space-y-2">
                           <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Pricing (INR)</p>
                           <Input 
                              required 
                              type="number"
                              value={formData.price} 
                              onChange={(e) => setFormData({...formData, price: e.target.value})}
                              className="bg-[#111224] border-none rounded-2xl h-14 px-6 text-sm font-bold shadow-inner"
                           />
                        </div>
                     </div>

                     <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Asset URL (Cover Image)</p>
                        <Input 
                           value={formData.image_url} 
                           onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                           className="bg-[#111224] border-none rounded-2xl h-14 px-6 text-sm font-bold shadow-inner"
                           placeholder="https://..."
                        />
                     </div>

                     <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Clinical Impact (Features)</p>
                        <div className="flex gap-4 mb-4">
                           <Input 
                              value={newFeature} 
                              onChange={(e) => setNewFeature(e.target.value)}
                              placeholder="Add a program benefit..."
                              className="bg-[#111224] border-none rounded-2xl h-14 px-6 text-sm font-bold shadow-inner"
                           />
                           <Button type="button" onClick={addFeature} className="h-14 w-14 rounded-2xl bg-[#D3C4B5] text-[#382F24] p-0"><Plus className="h-6 w-6" /></Button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                           {formData.features.map((f, i) => (
                              <Badge key={i} className="bg-white/5 border border-white/10 px-4 py-2 rounded-full text-[10px] font-bold text-zinc-400 group cursor-pointer hover:border-red-500/50" onClick={() => removeFeature(i)}>
                                 {f} <X className="ml-2 h-3 w-3 inline opacity-0 group-hover:opacity-100 transition-opacity" />
                              </Badge>
                           ))}
                        </div>
                     </div>

                     <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Description Narrative</p>
                        <textarea 
                           required 
                           rows={3}
                           value={formData.description} 
                           onChange={(e) => setFormData({...formData, description: e.target.value})}
                           className="w-full bg-[#111224] border-none rounded-2xl p-6 text-sm font-bold resize-none shadow-inner"
                        />
                     </div>

                     <div className="flex items-center gap-4 pt-6">
                        <Button 
                           type="submit" 
                           className="h-16 flex-1 rounded-2xl bg-[#D3C4B5] text-[#382F24] font-black uppercase tracking-widest text-[9px] hover:shadow-2xl transition-all"
                        >
                           Confirm Sync
                        </Button>
                        <Button 
                           type="button"
                           onClick={() => { setIsAdding(false); setEditingId(null); }}
                           className="h-16 px-10 rounded-2xl bg-white/5 text-zinc-500 font-black uppercase tracking-widest text-[9px] hover:bg-white/10"
                        >
                           Dismiss
                        </Button>
                     </div>
                  </form>
               </div>
            </div>
         </div>
       )}

       {/* PROGRAMS GRID */}
       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
          {loading ? (
             Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-[400px] rounded-[3rem] bg-[#1D1E31]/50 animate-pulse" />
             ))
          ) : filtered.length === 0 ? (
             <div className="col-span-full h-96 flex flex-col items-center justify-center space-y-6 text-zinc-700">
                <AlertCircle className="h-16 w-16" />
                <p className="text-xl font-bold italic">No active curations detected in the sanctuary database.</p>
             </div>
          ) : (
            filtered.map((p) => (
              <div key={p.id} className="vessel bg-[#1D1E31] rounded-[3.5rem] border border-white/5 overflow-hidden group hover:border-[#D3C4B5]/20 transition-all shadow-2xl flex flex-col h-full">
                 <div className="h-48 bg-[#111224] relative overflow-hidden">
                    {p.image_url ? (
                       <img src={p.image_url} className="h-full w-full object-cover grayscale opacity-40 group-hover:opacity-100 group-hover:scale-110 transition-all duration-1000" />
                    ) : (
                       <div className="h-full w-full flex items-center justify-center text-zinc-800">
                          <ImageIcon className="h-20 w-20" />
                       </div>
                    )}
                    <Badge className="absolute top-8 left-8 bg-black/80 backdrop-blur-md text-[#D3C4B5] border-none px-6 py-2 rounded-full text-[9px] font-black tracking-[0.2em] uppercase">
                       {p.category}
                    </Badge>
                 </div>
                 
                 <div className="p-10 flex-1 flex flex-col">
                    <div className="flex-1 space-y-4">
                       <h3 className="text-3xl font-black font-manrope tracking-tighter text-white leading-tight group-hover:text-[#D3C4B5] transition-colors">{p.title}</h3>
                       <p className="text-sm text-zinc-500 font-medium leading-relaxed italic line-clamp-3">
                          {p.description}
                       </p>
                       <div className="flex flex-wrap gap-2 py-4">
                          {p.features?.slice(0, 3).map((f: string, i: number) => (
                             <div key={i} className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-[#BACCB3]">
                                <CheckCircle2 className="h-3 w-3" />
                                {f}
                             </div>
                          ))}
                       </div>
                    </div>
                    
                    <div className="pt-8 border-t border-white/5 flex items-center justify-between">
                       <div className="space-y-1">
                          <p className="text-[9px] font-black uppercase tracking-widest text-zinc-700 leading-none">Starting from</p>
                          <p className="text-2xl font-black font-manrope text-white">₹{p.price}</p>
                       </div>
                       
                       <div className="flex items-center gap-2">
                          <button 
                             onClick={() => {
                                setEditingId(p.id);
                                setFormData({
                                   title: p.title,
                                   description: p.description || "",
                                   price: p.price.toString(),
                                   category: p.category || "",
                                   image_url: p.image_url || "",
                                   features: p.features || []
                                });
                             }}
                             className="h-12 w-12 rounded-2xl bg-white/5 text-zinc-500 hover:text-[#D3C4B5] border border-white/5 flex items-center justify-center transition-all"
                          >
                             <Edit3 className="h-5 w-5" />
                          </button>
                          <button 
                             onClick={() => deleteProgram(p.id)}
                             className="h-12 w-12 rounded-2xl bg-white/5 text-zinc-500 hover:text-red-400 border border-white/5 flex items-center justify-center transition-all"
                          >
                             <Trash2 className="h-5 w-5" />
                          </button>
                       </div>
                    </div>
                 </div>
              </div>
            ))
          )}
       </div>
    </div>
  );
}
