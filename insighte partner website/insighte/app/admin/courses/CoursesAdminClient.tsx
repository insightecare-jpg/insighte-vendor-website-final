"use client";

import React, { useState, useEffect } from "react";
import { Plus, Edit2, Trash2, Video, RefreshCw, Layers } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export default function CoursesAdminClient() {
  const supabase = createClient();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    price: 0,
    payment_link: "",
    is_live: false,
    cover_image_url: ""
  });

  const fetchCourses = async () => {
    setLoading(true);
    const { data } = await supabase.from('courses').select('*').order('created_at', { ascending: false });
    setCourses(data || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleEdit = (course: any) => {
    setEditingId(course.id);
    setFormData({
      title: course.title || "",
      slug: course.slug || "",
      description: course.description || "",
      price: course.price || 0,
      payment_link: course.payment_link || "",
      is_live: course.is_live || false,
      cover_image_url: course.cover_image_url || ""
    });
  };

  const handleCreate = () => {
    setEditingId("new");
    setFormData({
      title: "New Masterclass",
      slug: `course-${Date.now()}`,
      description: "",
      price: 1500,
      payment_link: "",
      is_live: false,
      cover_image_url: ""
    });
  };

  const handleSave = async () => {
    const payload = {
      ...formData,
      status: "published"
    };

    if (editingId === "new") {
      await supabase.from('courses').insert([payload]);
    } else {
      await supabase.from('courses').update(payload).eq('id', editingId);
    }
    
    setEditingId(null);
    fetchCourses();
  };

  const handleDelete = async (id: string) => {
    if(window.confirm("Delete this course entirely?")) {
      await supabase.from('courses').delete().eq('id', id);
      fetchCourses();
    }
  };

  return (
    <div className="p-10 text-white min-h-screen bg-[#0d0f1a]">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-4">
          <Layers size={32} className="text-[#8b7ff0]" />
          <h1 className="text-3xl font-black uppercase tracking-widest text-[#f0ece4]">Courses LMS Engine</h1>
        </div>
        <button onClick={handleCreate} className="px-6 py-3 bg-[#8b7ff0] text-[#0d0f1a] font-bold uppercase tracking-widest rounded-xl hover:bg-white transition-colors flex items-center gap-2">
          <Plus size={16} /> Add Program
        </button>
      </div>

      {editingId ? (
        <div className="bg-white/5 border border-white/10 p-8 rounded-3xl space-y-6">
           <div className="flex justify-between items-center border-b border-white/10 pb-4">
             <h2 className="text-xl font-bold uppercase">{editingId === "new" ? "Create New Program" : "Configure Program"}</h2>
             <button onClick={() => setEditingId(null)} className="text-sm font-bold opacity-50 hover:opacity-100">CANCEL</button>
           </div>
           
           <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest opacity-50">Title</label>
                <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full bg-[#111224] p-4 rounded-xl border border-white/10 text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest opacity-50">Slug (URL)</label>
                <input value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full bg-[#111224] p-4 rounded-xl border border-white/10 text-white" />
              </div>
           </div>

           <div className="space-y-2">
             <label className="text-xs font-bold uppercase tracking-widest opacity-50">Program Synopsis</label>
             <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-[#111224] p-4 rounded-xl border border-white/10 text-white min-h-[120px]" />
           </div>

           <div className="space-y-2">
             <label className="text-xs font-bold uppercase tracking-widest opacity-50">Cover Image URL</label>
             <input value={formData.cover_image_url} onChange={e => setFormData({...formData, cover_image_url: e.target.value})} className="w-full bg-[#111224] p-4 rounded-xl border border-white/10 text-white" />
           </div>

           <div className="grid grid-cols-3 gap-6 pt-4 border-t border-white/10">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest opacity-50 text-[#1d9e75]">Price (INR)</label>
                <input type="number" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full bg-[#111224] p-4 rounded-xl border border-[#1d9e75]/30 text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest opacity-50 text-[#8b7ff0]">Razorpay/Stripe Link</label>
                <input placeholder="https://buy.stripe.com/..." value={formData.payment_link} onChange={e => setFormData({...formData, payment_link: e.target.value})} className="w-full bg-[#111224] p-4 rounded-xl border border-[#8b7ff0]/30 text-white" />
              </div>
              <div className="space-y-2 flex flex-col justify-center items-center h-full bg-[#111224] rounded-xl border border-white/10">
                <label className="text-xs font-bold uppercase tracking-widest opacity-50 text-white mb-2">Delivery Mode</label>
                <button 
                  onClick={() => setFormData({...formData, is_live: !formData.is_live})}
                  className={`px-4 py-2 font-bold uppercase tracking-widest text-xs rounded-full border ${formData.is_live ? 'bg-[#ff6b6b] border-[#ff6b6b] text-white' : 'bg-transparent border-white/20 text-white/50'}`}
                >
                  {formData.is_live ? "🔴 LIVE COHORT" : "▶️ PRE-RECORDED"}
                </button>
              </div>
           </div>

           <button onClick={handleSave} className="w-full py-4 mt-6 bg-[#8b7ff0] text-[#0d0f1a] font-black uppercase tracking-widest rounded-xl hover:bg-white transition-all shadow-[0_0_30px_rgba(139,127,240,0.3)]">
             Deploy Program
           </button>
        </div>
      ) : (
        <div className="space-y-4">
          {loading ? (
             <div className="p-10 flex justify-center"><RefreshCw className="animate-spin opacity-50" /></div>
          ) : (
            courses.map((c) => (
              <div key={c.id} className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 transition-colors gap-4">
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center font-bold text-lg ${c.is_live ? 'bg-[#ff6b6b]/20 text-[#ff6b6b]' : 'bg-[#1d9e75]/20 text-[#1d9e75]'}`}>
                    {c.is_live ? <Video size={20} /> : <Layers size={20} />}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white mb-1">{c.title}</h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs opacity-50 font-bold uppercase tracking-widest">
                      <span className={c.is_live ? "text-[#ff6b6b]" : "text-[#1d9e75]"}>{c.is_live ? "Live Sessions" : "Self-Paced"}</span>
                      <span>•</span>
                      <span>₹{c.price}</span>
                      <span>•</span>
                      <span>{new Date(c.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
                  <button onClick={() => handleEdit(c)} className="flex-1 md:flex-none py-3 px-6 bg-white/10 rounded-xl hover:bg-white hover:text-black transition-colors font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2"><Edit2 size={14} /> Configure</button>
                  <button onClick={() => handleDelete(c.id)} className="p-3 bg-red-500/10 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition-colors"><Trash2 size={16} /></button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
