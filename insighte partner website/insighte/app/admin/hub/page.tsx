"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Search, 
  Filter, 
  FileText, 
  Video, 
  Headphones, 
  Star, 
  Edit3, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  Download,
  Sparkles,
  Zap,
  MoreVertical
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { formatRelative } from "date-fns";
import { createClient } from "@/lib/supabase/client";

export default function BlogCMSPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDrafting, setIsDrafting] = useState(false);
  const [draftTopic, setDraftTopic] = useState("");
  const supabase = createClient();

  useEffect(() => {
    fetchPosts();
  }, []);

  async function handleAIDraft() {
    if (!draftTopic) return toast.error("Editorial Topic Required.");
    try {
      setIsDrafting(true);
      const res = await fetch("/api/ai/blog-draft", {
        method: "POST",
        body: JSON.stringify({ topic: draftTopic, audience: "parent_sanctuary", tone: "empathetic" }),
      });
      const data = await res.json();
      
      const { data: newPost, error } = await supabase.from("blog_posts").insert({
        title_en: data.title,
        excerpt: data.excerpt,
        html_content: data.html_content,
        tags: data.tags,
        reading_time_minutes: data.read_time,
        status: "draft",
        slug: data.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
      }).select().single();

      if (error) throw error;
      toast.success("Intelligence Engine Seeding Complete.");
      router.push(`/admin/hub/${newPost.id}/edit`);
    } catch (err) {
      toast.error("Intelligence Synchronization Failed.");
    } finally {
      setIsDrafting(false);
    }
  }

  async function handleImportCSV(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      const rows = text.split('\n').map(row => row.split(','));
      // Basic CSV header mapping
      const headers = rows[0].map(h => h.trim().toLowerCase());
      const dataRows = rows.slice(1).filter(r => r.length > 1);

      toast.loading(`Synchronizing ${dataRows.length} editorial nodes...`);

      for (const row of dataRows) {
        const postData: any = {};
        headers.forEach((header, i) => {
          postData[header] = row[i]?.trim();
        });

        await supabase.from("blog_posts").insert({
          title_en: postData.title || postData.name,
          excerpt: postData.excerpt || postData.description,
          category: postData.category || "General",
          status: "published",
          published_at: new Date().toISOString(),
          slug: (postData.title || postData.name)?.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, ''),
          content_type: (postData.type || "article").toLowerCase(),
          audience: "parent_sanctuary"
        });
      }

      toast.dismiss();
      toast.success("Bulk Ingestion Complete.");
      fetchPosts();
    };
    reader.readAsText(file);
  }

  async function fetchPosts() {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      setPosts(data || []);
    } catch (err) {
      toast.error("Failed to synchronize editorial library.");
    } finally {
      setIsLoading(false);
    }
  }

  const filtered = posts.filter(p => 
    p.title_en?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    total: posts.length,
    published: posts.filter(p => p.status === 'published').length,
    drafts: posts.filter(p => p.status === 'draft').length,
    articles: posts.filter(p => p.content_type === 'article').length,
    videos: posts.filter(p => p.content_type === 'video').length,
    podcasts: posts.filter(p => p.content_type === 'podcast').length,
  };

  if (isLoading) return <div className="p-40 text-center font-black uppercase tracking-[0.4em] text-[10px] text-zinc-600">Hydrating Wisdom Engine...</div>;

  return (
    <main className="min-h-screen bg-[#0a0b1c] p-6 pt-12 md:p-24 space-y-12 font-sans">
      {/* ─── CMS HEADER ──────────────────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12">
        <div className="space-y-6">
          <div className="flex items-center gap-3 text-[#BACCB3] font-black uppercase tracking-[0.3em] text-[10px]">
            <Zap className="h-3 w-3" /> Editorial Sovereignty // Wisdom Hub
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter text-white uppercase italic leading-[0.8] mix-blend-plus-lighter">
            Blog <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#BACCB3] via-white to-[#D3C4B5]">CMS.</span>
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-4">
           <Button className="h-16 px-10 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-3xl hover:bg-[#BACCB3] transition-all shadow-2xl shadow-black active:scale-95" onClick={() => router.push('/admin/hub/new')}>
              <Plus className="h-4 w-4 mr-2" /> New Publication
           </Button>
           <div className="relative">
              <input 
                type="file" 
                accept=".csv" 
                onChange={handleImportCSV}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Button variant="ghost" className="h-16 px-8 border border-white/5 bg-white/5 text-zinc-400 font-black uppercase text-[10px] tracking-widest rounded-3xl hover:bg-white/10 hover:text-white transition-all">
                <Download className="h-4 w-4 mr-2" /> Import CSV
              </Button>
           </div>
           <Button type="button" className="h-16 px-8 bg-gradient-to-tr from-[#8b7ff0] to-[#c5b8f8] text-white font-black uppercase text-[10px] tracking-widest rounded-3xl hover:scale-105 transition-all shadow-xl" onClick={() => setIsDrafting(true)}>
              <Sparkles className="h-4 w-4 mr-2" /> AI Draft
           </Button>
        </div>
      </div>

      {/* ─── QUICK STATS ──────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap gap-4">
         {[
           { label: "Total Posts", value: stats.total, color: "text-white" },
           { label: "Published", value: stats.published, color: "text-[#BACCB3]" },
           { label: "Drafts", value: stats.drafts, color: "text-[#D3C4B5]" },
           { label: "Articles", value: stats.articles, color: "text-zinc-400" },
           { label: "Videos", value: stats.videos, color: "text-red-400" },
           { label: "Podcasts", value: stats.podcasts, color: "text-blue-400" },
         ].map(s => (
           <div key={s.label} className="px-6 py-3 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center gap-4">
              <span className="text-[10px] font-black uppercase tracking-widest text-zinc-600">{s.label}</span>
              <span className={cn("text-lg font-black", s.color)}>{s.value}</span>
           </div>
         ))}
      </div>

      {/* ─── CONTENT REGISTRY ───────────────────────────────────────────────────── */}
      <div className="vessel bg-[#111224]/50 backdrop-blur-3xl rounded-[3rem] border border-white/5 overflow-hidden shadow-2xl">
        <div className="p-8 border-b border-white/5 bg-[#111224]/30 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative group">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 transition-colors group-focus-within:text-white" />
            <Input 
              placeholder="Explore the archive..." 
              className="w-full md:w-96 h-12 bg-black/40 border-white/5 rounded-full pl-14 text-xs font-bold uppercase tracking-widest"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            {["Editorial Picks", "Trending", "Clinical Master", "Parental Navigation"].map(cat => (
              <button key={cat} className="px-4 h-10 rounded-full border border-white/5 text-[9px] font-black uppercase tracking-widest text-zinc-500 hover:text-white hover:bg-white/5 transition-all">
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
             <thead>
               <tr className="border-b border-white/5 text-[10px] font-black uppercase tracking-widest text-zinc-600">
                  <th className="px-8 py-6">Publication Details</th>
                  <th className="px-8 py-6">Category</th>
                  <th className="px-8 py-6">Target Audience</th>
                  <th className="px-8 py-6">Temporal Meta</th>
                  <th className="px-8 py-6">Status</th>
                  <th className="px-8 py-6 text-right">Actions</th>
               </tr>
             </thead>
             <tbody>
               {filtered.map(post => (
                 <tr key={post.id} className="group border-b border-white/5 hover:bg-white/[0.03] transition-all cursor-pointer">
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-6">
                          <div className="h-14 w-14 rounded-2xl bg-zinc-900 overflow-hidden border border-white/5 flex-shrink-0 group-hover:scale-105 transition-transform shadow-xl relative">
                             {post.cover_image_url ? (
                               <img src={post.cover_image_url} alt="Cover" className="h-full w-full object-cover" />
                             ) : (
                               <div className="h-full w-full flex items-center justify-center bg-white/5">
                                  <FileText className="h-6 w-6 text-zinc-800" />
                               </div>
                             )}
                             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <span className={cn("p-1.5 rounded-lg bg-black/60", post.content_type === 'video' ? 'text-red-400' : post.content_type === 'podcast' ? 'text-blue-400' : 'text-zinc-400')}>
                                   {post.content_type === 'video' ? <Video size={12} /> : post.content_type === 'podcast' ? <Headphones size={12} /> : <FileText size={12} />}
                                </span>
                             </div>
                          </div>
                          <div>
                             <div className="text-sm font-black text-white group-hover:text-[#BACCB3] transition-colors line-clamp-1">{post.title_en}</div>
                             <div className="text-[10px] font-medium text-zinc-600 line-clamp-1 uppercase tracking-widest mt-1 italic">{post.slug}</div>
                          </div>
                          {post.is_featured && <Star className="h-3 w-3 text-[#D3C4B5] fill-[#D3C4B5] flex-shrink-0" />}
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-500">{post.category || "General"}</span>
                    </td>
                    <td className="px-8 py-6">
                       <span className={cn(
                         "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border",
                         post.audience === 'clinical_pro' ? "bg-red-500/10 text-red-500 border-red-500/20" : 
                         post.audience === 'parent_sanctuary' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : 
                         "bg-white/5 text-zinc-500 border-white/5"
                       )}>
                          {post.audience?.replace('_', ' ') || "ENTIRE HUB"}
                       </span>
                    </td>
                    <td className="px-8 py-6">
                       <div className="space-y-1">
                          <div className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">
                             {post.status === 'published' ? formatRelative(new Date(post.published_at || post.created_at), new Date()) : "Editorial Queue"}
                          </div>
                          <div className="text-[9px] font-bold text-zinc-700 italic">{post.reading_time_minutes || 5} MIN READ</div>
                       </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className={cn(
                         "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest",
                         post.status === 'published' ? "bg-[#BACCB3]/10 text-[#BACCB3] border border-[#BACCB3]/20" : 
                         post.status === 'draft' ? "bg-[#D3C4B5]/10 text-[#D3C4B5] border border-[#D3C4B5]/20" : 
                         "bg-zinc-800 text-zinc-500 border border-zinc-700"
                       )}>
                          {post.status === 'published' ? <CheckCircle2 size={10} /> : <FileText size={10} />}
                          {post.status}
                       </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                       <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-white/10" onClick={() => router.push(`/admin/hub/${post.id}/edit`)}>
                             <Edit3 className="h-4 w-4 text-zinc-400 hover:text-white" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-white/10">
                             <Eye className="h-4 w-4 text-zinc-600 hover:text-white" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-red-500/10 border border-transparent hover:border-red-500/20">
                             <Trash2 className="h-4 w-4 text-red-500/60 hover:text-red-500" />
                          </Button>
                       </div>
                    </td>
                 </tr>
               ))}
             </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="py-24 text-center space-y-4">
               <div className="h-20 w-20 rounded-full bg-white/5 border border-white/5 flex items-center justify-center mx-auto opacity-50">
                  <FileText className="h-8 w-8 text-zinc-800" />
               </div>
               <p className="text-[10px] font-black uppercase tracking-widest text-zinc-700">The Editorial archive is Currently Empty.</p>
            </div>
          )}
        </div>
      </div>

      {/* ─── AI DRAFT MODAL ─────────────────────────────────────────────────── */}
      {isDrafting && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#0a0b1c]/80 backdrop-blur-xl">
           <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             className="w-full max-w-xl bg-[#111224] border border-white/10 rounded-[3rem] p-12 shadow-3xl space-y-8"
           >
              <div className="space-y-4 text-center">
                 <div className="h-20 w-20 bg-gradient-to-tr from-[#8b7ff0] to-[#c5b8f8] rounded-full flex items-center justify-center mx-auto shadow-2xl">
                    <Sparkles className="h-10 w-10 text-white animate-pulse" />
                 </div>
                 <h2 className="text-3xl font-black tracking-tighter uppercase italic text-white">AI Content Seed.</h2>
                 <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest leading-relaxed">
                    Insighte Intelligence will draft a clinical article <br/> based on your core topic.
                 </p>
              </div>

              <div className="space-y-4">
                 <label className="text-[10px] font-black uppercase tracking-widest text-[#BACCB3]">Editorial Topic</label>
                 <Input 
                   placeholder="e.g. Managing ADHD Meltdowns with Sensory Integration" 
                   className="h-16 bg-white/5 border-white/5 rounded-2xl px-6 text-sm font-bold placeholder:text-zinc-700"
                   value={draftTopic}
                   onChange={(e) => setDraftTopic(e.target.value)}
                 />
              </div>

              <div className="flex flex-col gap-4">
                 <Button 
                   className="h-16 bg-white text-black font-black uppercase text-[10px] tracking-widest rounded-2xl hover:bg-[#8b7ff0] hover:text-white transition-all shadow-xl"
                   onClick={handleAIDraft}
                   disabled={isDrafting && !!draftTopic && draftTopic.length < 5} 
                 >
                    {isDrafting && draftTopic ? <span className="animate-spin mr-2">●</span> : <Zap className="h-4 w-4 mr-2" />}
                    Generate Draft
                 </Button>
                 <Button variant="ghost" className="h-14 font-black uppercase text-[10px] tracking-widest text-zinc-500" onClick={() => setIsDrafting(false)}>
                    Abort
                 </Button>
              </div>
           </motion.div>
        </div>
      )}
    </main>
  );
}
