"use client";

import React, { useState, useEffect, use } from "react";
import { 
  ArrowLeft, 
  Save, 
  Globe, 
  Eye, 
  Image as ImageIcon, 
  Type, 
  Video, 
  Headphones, 
  Tag, 
  User, 
  Sparkles,
  ChevronRight,
  Send,
  Calendar,
  Layers
} from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";

export default function PostEditorPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isNew = id === "new";
  const supabase = createClient();

  const [post, setPost] = useState<any>({
    title_en: "",
    slug: "",
    excerpt: "",
    content_type: "article",
    category: "Editorial Picks",
    audience: "entire_hub",
    status: "draft",
    author_name: "Insighte Editorial",
    is_featured: false,
    tags: [],
  });

  const [isLoading, setIsLoading] = useState(!isNew);
  const [isSaving, setIsSaving] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({ openOnClick: false }),
      Image.configure({ inline: true }),
    ],
    content: "",
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "prose prose-invert max-w-none focus:outline-none min-h-[500px] text-zinc-300 font-medium italic",
      },
    },
    onUpdate: ({ editor }) => {
      setPost((prev: any) => ({ ...prev, html_content: editor.getHTML() }));
    },
  });

  useEffect(() => {
    if (!isNew) {
      fetchPost();
    }
  }, [id]);

  async function fetchPost() {
    try {
      const { data, error } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("id", id)
        .single();
      
      if (error) throw error;
      setPost(data);
      if (editor && data.html_content) {
        editor.commands.setContent(data.html_content);
      }
    } catch (err) {
      toast.error("Failed to retrieve publication content.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSave(status?: string) {
    try {
      setIsSaving(true);
      const payload = { ...post, status: status || post.status };
      if (status === 'published' && !post.published_at) {
        payload.published_at = new Date().toISOString();
      }

      let error;
      if (isNew) {
        const { error: err } = await supabase.from("blog_posts").insert(payload);
        error = err;
      } else {
        const { error: err } = await supabase.from("blog_posts").update(payload).eq("id", id);
        error = err;
      }

      if (error) throw error;
      toast.success(status === 'published' ? "Editorial Synchronized Globally." : "Draft Preserved Successfully.");
      router.push("/admin/hub");
    } catch (err) {
      toast.error("Critical Synchronization Error.");
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) return <div className="p-40 text-center font-black uppercase tracking-[0.4em] text-[10px] text-zinc-600">Extracting Editorial Context...</div>;

  return (
    <main className="min-h-screen bg-[#0a0b1c] text-white">
      {/* ─── STICKY ACTION BAR ────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 h-24 bg-[#0a0b1c]/80 backdrop-blur-3xl border-b border-white/5 px-8 md:px-16 flex items-center justify-between">
        <div className="flex items-center gap-8">
           <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full border border-white/5" onClick={() => router.push('/admin/hub')}>
              <ArrowLeft className="h-4 w-4" />
           </Button>
           <div className="h-8 w-px bg-white/5 hidden md:block" />
           <div className="hidden md:block">
              <div className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Publication Mode</div>
              <div className="text-xs font-black uppercase tracking-tight text-[#BACCB3]">{isNew ? "Creating New Entry" : "Refining Editorial"}</div>
           </div>
        </div>

        <div className="flex items-center gap-4">
           <Button variant="ghost" className="h-12 px-6 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10" onClick={() => handleSave('draft')}>
              {isSaving ? "Preserving..." : "Save Draft"}
           </Button>
           <Button className="h-12 px-10 rounded-full bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-[#BACCB3] transition-all shadow-2xl active:scale-95" onClick={() => handleSave('published')}>
              <Send className="h-3.5 w-3.5 mr-2" /> Publish Live
           </Button>
        </div>
      </nav>

      <div className="p-8 md:p-16 max-w-[1600px] mx-auto grid grid-cols-12 gap-16">
        {/* ─── LEFT PANEL: EDITORIAL CONTENT ────────────────────────────────────── */}
        <div className="col-span-12 lg:col-span-8 space-y-12">
           <div className="space-y-6">
              <Input 
                placeholder="Enter Title..." 
                className="text-4xl md:text-6xl font-black bg-transparent border-none placeholder:text-zinc-800 focus-visible:ring-0 p-0 h-auto italic tracking-tighter"
                value={post.title_en}
                onChange={(e) => setPost({ ...post, title_en: e.target.value })}
              />
              <Textarea 
                placeholder="Editorial Excerpt (The Hook)..."
                className="min-h-[100px] bg-white/[0.02] border-white/5 rounded-3xl p-8 text-lg font-medium italic text-zinc-400 focus:border-[#D3C4B5]/40 transition-all"
                value={post.excerpt}
                onChange={(e) => setPost({ ...post, excerpt: e.target.value })}
              />
           </div>

           {/* Content Mode Toggle */}
           <div className="flex items-center gap-2 p-1.5 bg-white/[0.02] border border-white/5 rounded-full w-fit">
              {[
                { id: 'article', icon: Type, label: 'Article' },
                { id: 'video', icon: Video, label: 'Video Embed' },
                { id: 'podcast', icon: Headphones, label: 'Podcast' },
              ].map(t => (
                <button 
                  key={t.id}
                  onClick={() => setPost({ ...post, content_type: t.id })}
                  className={cn(
                    "flex items-center gap-3 px-6 h-10 rounded-full text-[9px] font-black uppercase tracking-widest transition-all",
                    post.content_type === t.id ? "bg-[#1D1E31] text-white shadow-xl" : "text-zinc-600 hover:text-zinc-400"
                  )}
                >
                  <t.icon className="h-3 w-3" /> {t.label}
                </button>
              ))}
           </div>

           {post.content_type === 'video' && (
              <div className="space-y-4 p-8 rounded-[3rem] bg-black/40 border border-white/5 border-dashed">
                 <label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Video Integration (YouTube / Vimeo / Mux)</label>
                 <Input 
                   placeholder="https://..." 
                   className="h-14 bg-white/5 border-white/10 rounded-2xl pl-6 text-sm font-medium"
                   value={post.video_url}
                   onChange={(e) => setPost({ ...post, video_url: e.target.value })}
                 />
                 {post.video_url && (
                   <div className="aspect-video rounded-3xl bg-zinc-900 overflow-hidden flex items-center justify-center italic text-[10px] text-zinc-700">
                      [ Video Source Connected ]
                   </div>
                 )}
              </div>
           )}

           {/* RICH TEXT EDITOR */}
           <div className="vessel bg-white/[0.01] border border-white/5 rounded-[3.5rem] p-12 min-h-[700px]">
              <div className="flex items-center gap-4 mb-12 border-b border-white/5 pb-6 overflow-x-auto no-scrollbar">
                 {/* Barebones formatting tools - in real scenario more would be here */}
                 <Button variant="ghost" size="sm" className="h-10 px-4 rounded-xl text-[10px] font-black uppercase border border-white/5 text-zinc-500">H2</Button>
                 <Button variant="ghost" size="sm" className="h-10 px-4 rounded-xl text-[10px] font-black uppercase border border-white/5 text-zinc-500">H3</Button>
                 <Button variant="ghost" size="sm" className="h-10 px-4 rounded-xl text-[10px] font-black uppercase border border-white/5 text-zinc-500 underline">Link</Button>
                 <Button variant="ghost" size="sm" className="h-10 px-4 rounded-xl text-[10px] font-black uppercase border border-white/5 text-zinc-500 italic">Quote</Button>
                 <div className="flex-1" />
                 <Button variant="ghost" size="sm" className="h-10 px-6 bg-gradient-to-tr from-[#8b7ff0] to-[#c5b8f8] text-white font-black uppercase text-[10px] tracking-widest rounded-full">
                    <Sparkles className="h-3 w-3 mr-2" /> Write with AI
                 </Button>
              </div>
              <EditorContent editor={editor} />
           </div>
        </div>

        {/* ─── RIGHT PANEL: METADATA & SIDEBAR ─────────────────────────────────── */}
        <div className="col-span-12 lg:col-span-4 space-y-10">
           {/* COVER ASSET */}
           <div className="space-y-6">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#BACCB3]">Cover Asset // Atmospheric Head</label>
              <div className="aspect-square rounded-[3rem] bg-zinc-900 border-2 border-dashed border-white/5 flex flex-col items-center justify-center gap-4 group cursor-pointer relative overflow-hidden">
                 {post.cover_image_url ? (
                   <img src={post.cover_image_url} alt="Cover" className="h-full w-full object-cover" />
                 ) : (
                   <>
                     <ImageIcon className="h-10 w-10 text-zinc-800 group-hover:text-white transition-colors" />
                     <p className="text-[10px] font-black text-zinc-700 uppercase tracking-widest group-hover:text-zinc-500">Inject Imagery</p>
                   </>
                 )}
                 <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-6 py-2 rounded-full border border-white/20 text-[10px] font-black uppercase tracking-widest">Update Asset</span>
                 </div>
              </div>
           </div>

           {/* TAXONOMY */}
           <div className="grid grid-cols-1 gap-6">
              <div className="space-y-3">
                 <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Editorial Category</label>
                 <select 
                   className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl px-6 text-sm font-bold uppercase tracking-widest appearance-none focus:outline-none"
                   value={post.category}
                   onChange={(e) => setPost({ ...post, category: e.target.value })}
                 >
                    <option>Editorial Picks</option>
                    <option>Trending Narratives</option>
                    <option>Clinical Master Series</option>
                    <option>Parental Navigation</option>
                 </select>
              </div>
              <div className="space-y-3">
                 <label className="text-[10px] font-black uppercase tracking-widest text-zinc-600">Target Audience</label>
                 <select 
                   className="w-full h-14 bg-white/5 border border-white/5 rounded-2xl px-6 text-sm font-bold uppercase tracking-widest appearance-none focus:outline-none"
                   value={post.audience}
                   onChange={(e) => setPost({ ...post, audience: e.target.value })}
                 >
                    <option value="entire_hub">Entire Hub</option>
                    <option value="parent_sanctuary">Parent Sanctuary</option>
                    <option value="clinical_pro">Clinical Pro-Series</option>
                 </select>
              </div>
           </div>

           {/* AUTHORING */}
           <div className="p-8 rounded-[2.5rem] bg-white/[0.02] border border-white/5 space-y-6">
              <label className="text-[10px] font-black uppercase tracking-widest text-[#D3C4B5]">Clinical Authorship</label>
              <div className="flex items-center gap-4 border-b border-white/5 pb-6">
                 <div className="h-12 w-12 rounded-full bg-zinc-800 border border-white/5 overflow-hidden">
                    <img src={post.author_avatar_url || "https://i.pravatar.cc/100"} alt="Author" />
                 </div>
                 <div className="flex-1">
                    <Input 
                      placeholder="Author Name..." 
                      className="h-10 bg-transparent border-none p-0 text-sm font-black italic focus-visible:ring-0"
                      value={post.author_name}
                      onChange={(e) => setPost({ ...post, author_name: e.target.value })}
                    />
                    <div className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest">Master Contributor</div>
                 </div>
              </div>
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-2">
                    <Tag className="h-3.5 w-3.5 text-zinc-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Featured Placement</span>
                 </div>
                 <button 
                   onClick={() => setPost({ ...post, is_featured: !post.is_featured })}
                   className={cn(
                     "h-6 w-12 rounded-full transition-all relative",
                     post.is_featured ? "bg-[#BACCB3]" : "bg-zinc-800"
                   )}
                 >
                    <div className={cn("absolute top-1 h-4 w-4 rounded-full bg-white transition-all", post.is_featured ? "right-1" : "left-1")} />
                 </button>
              </div>
           </div>

           {/* GOVERNANCE CTA */}
           <div className="space-y-4">
              <Button variant="ghost" className="w-full h-14 rounded-2xl border border-white/5 text-zinc-500 text-[10px] font-black uppercase tracking-widest hover:text-white transition-all">
                 <Eye className="h-4 w-4 mr-2" /> Preview Production Page
              </Button>
              <div className="text-center">
                 <p className="text-[8px] font-bold uppercase tracking-[0.3em] text-zinc-700">Publication ID: {id}</p>
              </div>
           </div>
        </div>
      </div>
    </main>
  );
}
