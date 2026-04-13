"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Save, Image as ImageIcon, Video, Mic, RefreshCw } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';

export default function BlogAdminClient() {
  const supabase = createClient();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    title_en: "",
    slug: "",
    category: "",
    video_url: "",
    podcast_url: "",
    cover_image_url: ""
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      Link.configure({ openOnClick: false }),
    ],
    content: '<p>Start writing your rich media blog here...</p>',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none min-h-[300px] border border-white/10 p-6 rounded-2xl bg-white/5',
      },
    },
  });

  const fetchBlogs = async () => {
    setLoading(true);
    const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
    setBlogs(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleEdit = (blog: any) => {
    setEditingId(blog.id);
    setFormData({
      title_en: blog.title_en || "",
      slug: blog.slug || "",
      category: blog.category || "Neurodiversity",
      video_url: blog.video_url || "",
      podcast_url: blog.podcast_url || "",
      cover_image_url: blog.cover_image_url || ""
    });
    if (editor) {
      editor.commands.setContent(blog.html_content || blog.content_markdown || '');
    }
  };

  const handleCreate = () => {
    setEditingId("new");
    setFormData({
      title_en: "New Insight",
      slug: `new-insight-${Date.now()}`,
      category: "Parenting",
      video_url: "",
      podcast_url: "",
      cover_image_url: ""
    });
    if (editor) {
      editor.commands.setContent('<p>Start writing...</p>');
    }
  };

  const handleSave = async () => {
    const html_content = editor?.getHTML() || "";
    // Extremely basic html to markdown for fallback (we should primarily rely on HTML going forward)
    const content_markdown = editor?.getText() || "";

    const payload = {
      ...formData,
      html_content,
      content_markdown,
      status: "published"
    };

    if (editingId === "new") {
      await supabase.from('blog_posts').insert([payload]);
    } else {
      await supabase.from('blog_posts').update(payload).eq('id', editingId);
    }
    
    setEditingId(null);
    fetchBlogs();
  };

  const handleDelete = async (id: string) => {
    if(window.confirm("Delete this blog?")) {
      await supabase.from('blog_posts').delete().eq('id', id);
      fetchBlogs();
    }
  };

  const addImageToEditor = () => {
    const url = window.prompt("Image URL:");
    if (url && editor) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  return (
    <div className="p-10 text-white min-h-screen bg-[#0d0f1a]">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-black uppercase tracking-widest text-[#f0ece4]">Blog Management</h1>
        <button onClick={handleCreate} className="px-6 py-3 bg-[#8b7ff0] text-[#0d0f1a] font-bold uppercase tracking-widest rounded-xl hover:bg-white transition-colors flex items-center gap-2">
          <Plus size={16} /> Create New
        </button>
      </div>

      {editingId ? (
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl space-y-6">
           <div className="flex justify-between items-center border-b border-white/10 pb-4">
             <h2 className="text-xl font-bold uppercase">{editingId === "new" ? "Create Insight" : "Edit Insight"}</h2>
             <button onClick={() => setEditingId(null)} className="text-sm font-bold opacity-50 hover:opacity-100">CANCEL</button>
           </div>
           
           <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest opacity-50">Title</label>
                <input value={formData.title_en} onChange={e => setFormData({...formData, title_en: e.target.value})} className="w-full bg-[#111224] p-4 rounded-xl border border-white/10" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest opacity-50">Slug (URL)</label>
                <input value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full bg-[#111224] p-4 rounded-xl border border-white/10" />
              </div>
           </div>

           <div className="space-y-2">
             <label className="text-xs font-bold uppercase tracking-widest opacity-50">Cover Image URL</label>
             <input value={formData.cover_image_url} onChange={e => setFormData({...formData, cover_image_url: e.target.value})} className="w-full bg-[#111224] p-4 rounded-xl border border-white/10" />
           </div>

           <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest opacity-50 text-[#8b7ff0] flex items-center gap-2"><Video size={14}/> YouTube Video URL</label>
                <input placeholder="e.g. https://youtube.com/watch?v=..." value={formData.video_url} onChange={e => setFormData({...formData, video_url: e.target.value})} className="w-full bg-[#111224] p-4 rounded-xl border border-[#8b7ff0]/30" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest opacity-50 text-[#1d9e75] flex items-center gap-2"><Mic size={14}/> Apple Podcast URL</label>
                <input placeholder="e.g. https://podcasts.apple.com/..." value={formData.podcast_url} onChange={e => setFormData({...formData, podcast_url: e.target.value})} className="w-full bg-[#111224] p-4 rounded-xl border border-[#1d9e75]/30" />
              </div>
           </div>

           <div className="space-y-2 !mt-10">
              <div className="flex justify-between items-center">
                 <label className="text-xs font-bold uppercase tracking-widest opacity-50">Rich Editor</label>
                 <button onClick={addImageToEditor} className="text-xs font-bold bg-white/10 px-3 py-1 rounded-md hover:bg-white/20 flex gap-2"><ImageIcon size={14} /> Insert Image</button>
              </div>
              <div className="mt-2">
                <EditorContent editor={editor} />
              </div>
           </div>

           <button onClick={handleSave} className="w-full py-4 mt-6 bg-[#8b7ff0] text-[#0d0f1a] font-black uppercase tracking-widest rounded-xl hover:bg-white transition-all shadow-[0_0_30px_rgba(139,127,240,0.3)]">
             Save Insight
           </button>
        </div>
      ) : (
        <div className="space-y-4">
          {loading ? (
             <div className="p-10 flex justify-center"><RefreshCw className="animate-spin opacity-50" /></div>
          ) : (
            blogs.map((b) => (
              <div key={b.id} className="flex items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors">
                <div>
                  <h3 className="text-lg font-bold text-white">{b.title_en}</h3>
                  <div className="flex items-center gap-4 text-xs mt-2 opacity-50 font-bold uppercase">
                    <span>{new Date(b.created_at).toLocaleDateString()}</span>
                    <span>•</span>
                    <span className="text-[#8b7ff0]">{b.category}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button onClick={() => handleEdit(b)} className="p-3 bg-white/10 rounded-xl hover:bg-white hover:text-black transition-colors"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(b.id)} className="p-3 bg-red-500/20 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-colors"><Trash2 size={16} /></button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
