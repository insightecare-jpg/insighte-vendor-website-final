"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { 
  Plus, 
  Trash2, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertCircle,
  LayoutGrid,
  Tags
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const CATEGORIES = ["Therapy", "Tutoring", "Extra Curricular", "Counselling", "Other"];

interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  created_at: string;
}

export default function AdminServicesPage() {
  const supabase = createClient();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newService, setNewService] = useState({ name: "", category: "Therapy", description: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchServices = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("service_library")
      .select("*")
      .order("category", { ascending: true })
      .order("name", { ascending: true });
    
    if (error) {
      toast.error("Failed to fetch services");
    } else {
      setServices(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleAddService = async () => {
    if (!newService.name) {
      toast.error("Service name is required");
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase
      .from("service_library")
      .insert([newService]);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Service added successfully");
      setIsAddOpen(false);
      setNewService({ name: "", category: "Therapy", description: "" });
      fetchServices();
    }
    setIsSubmitting(false);
  };

  const handleDeleteService = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service? It may affect provider profiles.")) return;

    const { error } = await supabase
      .from("service_library")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete service");
    } else {
      toast.success("Service deleted");
      fetchServices();
    }
  };

  const filteredServices = services.filter(s => 
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-12">
      {/* HEADER SECTION */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
         <div className="space-y-3">
            <div className="flex items-center gap-3">
               <Badge className="bg-[#BACCB3]/10 text-[#BACCB3] border-none rounded-full px-6 py-1.5 text-[9px] font-black uppercase tracking-widest">
                  System Architecture
               </Badge>
               <div className="h-1.5 w-1.5 rounded-full bg-[#BACCB3] blur-[1px] animate-pulse" />
            </div>
            <h1 className="text-4xl md:text-6xl font-manrope font-extrabold tracking-tighter italic uppercase text-white leading-[0.9]">
               Service <br/>
               <span className="text-[#D3C4B5]">Library</span>
            </h1>
            <p className="text-sm font-medium text-zinc-500 max-w-md">
               Manage global service offerings and clinical verticals available for educators and parents.
            </p>
         </div>

         <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
               <button className="h-14 px-8 rounded-full bg-[#D3C4B5] text-[#382F24] font-black uppercase tracking-widest text-[9px] hover:shadow-[0_0_30px_rgba(211,196,181,0.2)] transition-all flex items-center gap-3">
                  <Plus className="h-5 w-5" /> Initialize Service
               </button>
            </DialogTrigger>
            <DialogContent className="bg-[#1D1E31] border border-white/10 text-white rounded-[2rem] p-8 max-w-md">
               <DialogHeader>
                  <DialogTitle className="text-2xl font-manrope font-extrabold italic uppercase tracking-tighter">New Service Registry</DialogTitle>
               </DialogHeader>
               <div className="space-y-6 pt-6">
                  <div className="space-y-2">
                     <p className="text-[10px] font-black uppercase tracking-widest text-[#D3C4B5] ml-2">Service Identity</p>
                     <Input 
                        placeholder="e.g. Speech Therapy" 
                        value={newService.name}
                        onChange={(e) => setNewService({...newService, name: e.target.value})}
                        className="bg-[#111224] border-none rounded-2xl h-14 px-6 text-sm font-bold"
                     />
                  </div>
                  <div className="space-y-2">
                     <p className="text-[10px] font-black uppercase tracking-widest text-[#D3C4B5] ml-2">Clinical Vertical</p>
                     <Select 
                        value={newService.category} 
                        onValueChange={(val) => setNewService({...newService, category: val})}
                     >
                        <SelectTrigger className="bg-[#111224] border-none rounded-2xl h-14 px-6 text-sm font-bold">
                           <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#1D1E31] border-white/10 text-white">
                           {CATEGORIES.map(cat => (
                             <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                           ))}
                        </SelectContent>
                     </Select>
                  </div>
                  <div className="space-y-2">
                     <p className="text-[10px] font-black uppercase tracking-widest text-[#D3C4B5] ml-2">Description (Optional)</p>
                     <textarea 
                        rows={3}
                        value={newService.description}
                        onChange={(e) => setNewService({...newService, description: e.target.value})}
                        className="w-full bg-[#111224] border-none rounded-2xl p-6 text-sm font-bold resize-none"
                        placeholder="Define the scope of this intervention..."
                     />
                  </div>
               </div>
               <DialogFooter className="pt-6">
                  <Button 
                     onClick={handleAddService} 
                     disabled={isSubmitting}
                     className="h-14 w-full rounded-full bg-[#D3C4B5] text-[#382F24] font-black uppercase tracking-widest text-[9px]"
                  >
                     {isSubmitting ? "Registering..." : "Add to Library"}
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </section>

      {/* FILTER & SEARCH */}
      <div className="vessel bg-[#1D1E31] p-10 rounded-[3rem] border border-white/5 space-y-10">
         <div className="flex flex-col md:flex-row justify-between gap-6">
            <div className="relative flex-grow max-w-xl group">
               <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-600 group-focus-within:text-[#D3C4B5] transition-colors" />
               <Input 
                  type="text" 
                  placeholder="Filter the service index..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-16 w-full rounded-full bg-[#111224] border-none px-16 text-md font-medium placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-[#D3C4B5]/30 shadow-inner"
               />
            </div>
            <div className="flex gap-4">
               <button className="h-16 px-8 rounded-full bg-white/5 border border-white/5 text-zinc-500 hover:text-white transition-all flex items-center gap-3">
                  <Filter className="h-4 w-4" /> Filter
               </button>
            </div>
         </div>

         {/* SERVICE TABLE/GRID */}
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
               [1, 2, 3].map(i => <div key={i} className="h-40 bg-[#111224] rounded-[2rem] animate-pulse" />)
            ) : filteredServices.map(service => (
               <div key={service.id} className="group relative vessel bg-[#111224] p-8 rounded-[2.5rem] border border-white/5 hover:border-[#D3C4B5]/20 transition-all hover:-translate-y-1">
                  <div className="flex justify-between items-start mb-6">
                     <div className="h-12 w-12 rounded-2xl bg-[#D3C4B5]/10 flex items-center justify-center text-[#D3C4B5]">
                        <Tags className="h-6 w-6" />
                     </div>
                     <button 
                        onClick={() => handleDeleteService(service.id)}
                        className="h-10 w-10 rounded-full flex items-center justify-center text-zinc-600 hover:text-red-400 hover:bg-red-400/10 transition-all opacity-0 group-hover:opacity-100"
                     >
                        <Trash2 className="h-4 w-4" />
                     </button>
                  </div>
                  <div className="space-y-2">
                     <p className="text-[10px] font-black uppercase tracking-widest text-[#BACCB3]">{service.category}</p>
                     <h3 className="text-2xl font-manrope font-extrabold tracking-tighter text-white">{service.name}</h3>
                     <p className="text-xs text-zinc-600 font-medium line-clamp-2">{service.description || "System established clinical offering."}</p>
                  </div>
                  <div className="mt-8 flex items-center justify-between">
                     <span className="text-[9px] font-black uppercase tracking-widest text-zinc-800">UUID: {service.id.slice(0, 8)}</span>
                     <div className="flex items-center gap-2">
                        <div className="h-1 w-1 rounded-full bg-[#BACCB3]" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#BACCB3]">Status: Active</span>
                     </div>
                  </div>
               </div>
            ))}

            {!loading && filteredServices.length === 0 && (
               <div className="col-span-full py-20 text-center space-y-6">
                  <LayoutGrid className="h-16 w-16 text-zinc-800 mx-auto" />
                  <p className="text-xl font-manrope font-bold text-zinc-600 italic">No services indexed in this vertical.</p>
               </div>
            )}
         </div>
      </div>
    </div>
  );
}
