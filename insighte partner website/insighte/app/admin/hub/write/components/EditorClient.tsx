"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Save, 
  Eye, 
  Settings, 
  CheckCircle2, 
  AlertCircle,
  FileText,
  MessageSquare,
  Share2,
  Trash2,
  Upload,
  Globe,
  Lock,
  Loader2
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

interface BlogPost {
  id?: string;
  slug: string;
  title_en: string;
  category: string;
  content_en: string;
  summary_bullets_en: string[];
  status: "draft" | "published";
  is_professional: boolean;
  is_peer_reviewed: boolean;
  reading_time_min?: number;
  featured_image_url?: string;
  video_url?: string;
  podcast_url?: string;
}

export default function EditorClient({ initialData }: { initialData?: BlogPost }) {
  const [data, setData] = useState<BlogPost>(initialData || {
    slug: "",
    title_en: "",
    category: "Development",
    content_en: "",
    summary_bullets_en: ["", "", ""],
    status: "draft",
    is_professional: false,
    is_peer_reviewed: false,
    reading_time_min: 5,
    video_url: "",
    podcast_url: ""
  });
  
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const supabase = createClient();
  const router = useRouter();
  const { toast } = useToast();

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const payload = {
        ...data,
        updated_at: new Date().toISOString()
      };

      let error;
      if (data.id) {
        ({ error } = await supabase.from('blog_posts').update(payload).eq('id', data.id));
      } else {
        ({ error } = await supabase.from('blog_posts').insert([payload]));
      }

      if (error) throw error;

      toast({
        title: "Clinical Protocol Synchronized",
        description: "The Wisdom Hub ledger has been updated successfully.",
        variant: "default",
      });
      
      if (!data.id) {
         router.push('/admin/hub');
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Synchronization Interrupted",
        description: "Could not persist changes to the clinical ledger.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0b1c] animate-fade-in text-white/90">
      {/* Top Bar - Administrative Navigation */}
      <div className="fixed top-0 left-0 right-0 h-24 bg-[#0a0b1c]/80 backdrop-blur-3xl border-b border-white/5 z-50 flex items-center justify-between px-10">
        <div className="flex items-center gap-8">
           <Link href="/admin/hub">
              <button className="h-12 w-12 rounded-full border border-white/5 flex items-center justify-center hover:bg-white/5 transition-colors">
                <ArrowLeft size={18} />
              </button>
           </Link>
           <div className="space-y-1">
              <h1 className="text-sm font-black uppercase tracking-[0.4em] italic text-[#D3C4B5]">Wisdom Composer</h1>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-700">Protocol ID: {data.id || 'New Sequence'}</p>
           </div>
        </div>
        
        <div className="flex items-center gap-6">
           <button 
             onClick={() => setIsPreview(!isPreview)}
             className={cn(
               "h-14 px-8 rounded-full border border-white/5 flex items-center gap-3 text-[10px] font-black uppercase tracking-widest transition-all",
               isPreview ? "bg-[#D3C4B5] text-[#382F24]" : "text-zinc-600 hover:text-white"
             )}
           >
             <Eye size={16} /> {isPreview ? 'Exit Preview' : 'Preview Clinic'}
           </button>
           
           <button 
             onClick={handleSave}
             disabled={isSaving}
             className="h-14 px-10 rounded-full bg-[#BACCB3] text-[#2D332B] font-black uppercase tracking-widest text-[11px] flex items-center gap-4 hover:shadow-[0_0_50px_rgba(186,204,179,0.3)] transition-all active:scale-95 disabled:opacity-50"
           >
              {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} strokeWidth={3} />}
              Execute Protocol
           </button>
        </div>
      </div>

      <div className="pt-24 flex h-screen overflow-hidden">
        {/* Workspace - Principal Content Area */}
        <div className={cn(
          "flex-1 overflow-y-auto p-12 transition-all duration-700 scrollbar-hide",
          isPreview ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"
        )}>
          <div className="max-w-[900px] mx-auto space-y-12 pb-40">
             {/* Title Control */}
             <textarea 
               value={data.title_en}
               onChange={(e) => setData({...data, title_en: e.target.value})}
               placeholder="Article Title..."
               className="w-full bg-transparent text-6xl md:text-8xl font-manrope font-extrabold tracking-tighter uppercase italic text-white placeholder:text-zinc-900 border-none outline-none resize-none leading-none pt-20"
               rows={2}
             />

             {/* Summary Bullets - Clinical High Density */}
             <div className="vessel p-12 space-y-8 bg-[#111224]/50 border border-white/5 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4">
                   <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center text-zinc-800 group-hover:text-[#BACCB3] transition-colors">
                      <Settings size={14} />
                   </div>
                </div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600 italic">Quick Insight Sequence</h3>
                <div className="space-y-6">
                  {data.summary_bullets_en.map((bullet, idx) => (
                    <div key={idx} className="flex gap-6 group/bullet">
                       <span className="text-zinc-800 font-manrope font-black italic text-xl mt-1">{idx + 1}.</span>
                       <input 
                         type="text"
                         value={bullet}
                         onChange={(e) => {
                            const newBullets = [...data.summary_bullets_en];
                            newBullets[idx] = e.target.value;
                            setData({...data, summary_bullets_en: newBullets});
                         }}
                         placeholder="Ingest core clinical finding..."
                         className="flex-1 bg-transparent border-b border-white/5 py-2 text-sm font-medium focus:border-[#BACCB3] transition-all outline-none"
                       />
                    </div>
                  ))}
                </div>
             </div>

             {/* Main Clinical Body */}
             <div className="space-y-6">
                <div className="flex items-center justify-between">
                   <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-800 italic">Document Registry</h3>
                   <div className="flex gap-4">
                      <div className="h-10 px-4 rounded-full bg-white/5 border border-white/5 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-zinc-600">
                         <FileText size={14} /> Markdown Core
                      </div>
                   </div>
                </div>
                <textarea 
                  value={data.content_en}
                  onChange={(e) => setData({...data, content_en: e.target.value})}
                  placeholder="Initiate document flow... use Markdown for clinical precision."
                  className="w-full bg-[#0d0e22] rounded-[40px] p-12 min-h-[800px] border border-white/5 text-lg font-manrope leading-relaxed focus:ring-2 focus:ring-[#D3C4B5]/20 transition-all outline-none resize-none shadow-inner"
                />
             </div>
          </div>
        </div>

        {/* Clinical Preview Layer */}
        {isPreview && (
          <div className="fixed inset-0 top-24 bottom-0 bg-[#0a0b1c] z-40 overflow-y-auto scrollbar-hide pt-20 pb-40 animate-in fade-in zoom-in-95 duration-500">
            <div className="max-w-[700px] mx-auto space-y-20">
               <div className="space-y-6 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <span className="h-[1px] w-20 bg-white/5" />
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-800">Previewing Clinical Protocol</span>
                    <span className="h-[1px] w-20 bg-white/5" />
                  </div>
                  <h1 className="text-5xl md:text-7xl font-manrope font-extrabold text-white tracking-tighter uppercase italic leading-none">{data.title_en}</h1>
               </div>
               
               <div className="vessel bg-[#111224]/50 border-white/5 p-16">
                  <div className="prose prose-invert prose-zinc max-w-none prose-h2:text-[10px] prose-h2:font-black prose-h2:uppercase prose-h2:tracking-[0.4em] prose-h2:text-[#D3C4B5] prose-h2:border-b prose-h2:border-white/5 prose-h2:pb-4 prose-p:font-manrope prose-p:text-zinc-400 prose-p:leading-relaxed prose-p:text-lg">
                    <ReactMarkdown>{data.content_en}</ReactMarkdown>
                  </div>
               </div>
            </div>
          </div>
        )}

        {/* Control Sidebar - High Technical Density */}
        <div className="w-[450px] border-l border-white/5 bg-[#0d0e22]/50 backdrop-blur-3xl overflow-y-auto p-12 space-y-12 scrollbar-hide">
           <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-zinc-600 italic">Clinical Parameters</h3>
           
           <div className="space-y-10">
              {/* Category selector */}
              <div className="space-y-4">
                 <label className="text-[9px] font-black uppercase tracking-widest text-zinc-800">Domain Sequence</label>
                 <select 
                   value={data.category}
                   onChange={(e) => setData({...data, category: e.target.value})}
                   className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-[10px] font-black uppercase tracking-widest outline-none focus:border-[#D3C4B5] transition-colors appearance-none"
                 >
                   <option>Development</option>
                   <option>Education</option>
                   <option>Clinical Research</option>
                   <option>Parenting</option>
                   <option>Community</option>
                 </select>
              </div>

              {/* Slug Control */}
              <div className="space-y-4">
                 <label className="text-[9px] font-black uppercase tracking-widest text-zinc-800">Neural Path (Slug)</label>
                 <input 
                   type="text" 
                   value={data.slug}
                   onChange={(e) => setData({...data, slug: e.target.value})}
                   placeholder="e.g. understanding-neurodiversity"
                   className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-[11px] font-medium transition-colors outline-none focus:border-[#BACCB3]"
                 />
              </div>

              {/* Cinematic Media Integration */}
              <div className="space-y-6">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-600 italic">Cinematic Media Registry</h4>
                 
                 <div className="space-y-4">
                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-800">YouTube Masterclass URL</label>
                    <div className="relative group">
                       <input 
                         type="text" 
                         value={data.video_url || ''}
                         onChange={(e) => setData({...data, video_url: e.target.value})}
                         placeholder="https://youtube.com/watch?v=..."
                         className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-[11px] font-medium transition-colors outline-none focus:border-[#BACCB3] group-hover:border-white/20"
                       />
                       <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity">
                          <Globe size={14} className="text-[#BACCB3]" />
                       </div>
                    </div>
                 </div>

                 <div className="space-y-4">
                    <label className="text-[9px] font-black uppercase tracking-widest text-zinc-800">Apple Podcast Sequence</label>
                    <div className="relative group">
                       <input 
                         type="text" 
                         value={data.podcast_url || ''}
                         onChange={(e) => setData({...data, podcast_url: e.target.value})}
                         placeholder="https://podcasts.apple.com/..."
                         className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-6 text-[11px] font-medium transition-colors outline-none focus:border-[#D3C4B5] group-hover:border-white/20"
                       />
                       <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20 group-focus-within:opacity-100 transition-opacity">
                          <Share2 size={14} className="text-[#D3C4B5]" />
                       </div>
                    </div>
                 </div>
              </div>

              {/* Toggles - High Interaction Style */}
              <div className="space-y-6">
                 <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-white/10 transition-all cursor-pointer group"
                      onClick={() => setData({...data, is_professional: !data.is_professional})}>
                    <div className="space-y-1">
                       <h4 className="text-[10px] font-black uppercase tracking-widest">Professional Tier</h4>
                       <p className="text-[9px] text-zinc-800">Restrict logic to clinical scope</p>
                    </div>
                    <div className={cn(
                      "h-6 w-12 rounded-full border border-white/10 relative transition-all",
                      data.is_professional ? "bg-[#BACCB3]" : "bg-transparent"
                    )}>
                       <div className={cn(
                         "h-4 w-4 rounded-full bg-white absolute top-1 transition-all",
                         data.is_professional ? "right-1" : "left-1 shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                       )} />
                    </div>
                 </div>

                 <div className="flex items-center justify-between p-6 bg-white/5 rounded-3xl border border-white/5 hover:border-white/10 transition-all cursor-pointer group"
                      onClick={() => setData({...data, is_peer_reviewed: !data.is_peer_reviewed})}>
                    <div className="space-y-1">
                       <h4 className="text-[10px] font-black uppercase tracking-widest">Peer Reviewed</h4>
                       <p className="text-[9px] text-zinc-800">Add clinical validation badge</p>
                    </div>
                    <div className={cn(
                      "h-6 w-12 rounded-full border border-white/10 relative transition-all",
                      data.is_peer_reviewed ? "bg-[#D3C4B5]" : "bg-transparent"
                    )}>
                       <div className={cn(
                         "h-4 w-4 rounded-full bg-white absolute top-1 transition-all",
                         data.is_peer_reviewed ? "right-1" : "left-1 shadow-[0_0_10px_rgba(255,255,255,0.2)]"
                       )} />
                    </div>
                 </div>
              </div>

              {/* Advanced Registry */}
              <div className="vessel bg-white/[0.02] p-8 space-y-6">
                 <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-zinc-600">
                    <Loader2 size={14} /> Optimization Metrics
                 </div>
                 <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-black/20 rounded-2xl border border-white/5">
                       <div className="text-[8px] text-zinc-800 uppercase tracking-widest mb-1">Time (Min)</div>
                       <input 
                         type="number" 
                         value={data.reading_time_min}
                         onChange={(e) => setData({...data, reading_time_min: parseInt(e.target.value)})}
                         className="bg-transparent text-lg font-black italic outline-none w-full"
                       />
                    </div>
                    <div className="p-4 bg-black/20 rounded-2xl border border-white/5">
                       <div className="text-[8px] text-zinc-800 uppercase tracking-widest mb-1">Visibility</div>
                       <select 
                         value={data.status}
                         onChange={(e) => setData({...data, status: e.target.value as 'draft'|'published'})}
                         className="bg-transparent text-xs font-black uppercase tracking-widest italic outline-none w-full appearance-none"
                       >
                          <option value="draft">Draft</option>
                          <option value="published">Published</option>
                       </select>
                    </div>
                 </div>
              </div>
           </div>
           
           <div className="pt-20">
              <button 
                onClick={() => {}} // Delete logic
                className="w-full h-14 rounded-full border border-red-400/20 text-red-400/40 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-red-400/5 hover:text-red-400 transition-all flex items-center justify-center gap-4 group"
              >
                <Trash2 size={16} className="opacity-40 group-hover:opacity-100 transition-all" /> purge clinical record
              </button>
           </div>
        </div>
      </div>
    </div>
  );
}
