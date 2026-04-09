import { createClient } from "@/lib/supabase/server";
import AdminHubClient from "./AdminHubClient";
import { BreadcrumbNav } from "./components/BreadcrumbNav";

export const dynamic = 'force-dynamic';

export default async function AdminHubPage() {
  const supabase = await createClient();

  // Fetch blog posts for administration
  const { data: posts, error } = await supabase
    .from('blog_posts')
    .select(`
      id, 
      slug, 
      title_en, 
      category, 
      status, 
      created_at, 
      is_professional,
      author:profiles(name)
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Clinical Database Retrieval Error:", error);
  }

  return (
    <main className="min-h-screen bg-[#0a0b1c] p-6 pt-12 md:p-24 space-y-12">
      {/* Structural Breadcrumb */}
      <BreadcrumbNav 
        items={[
          { label: "Admin Sanctuary", href: "/admin" },
          { label: "Wisdom Hub", href: "/admin/hub" }
        ]} 
      />
      
      {/* Principal Orchestrator */}
      <AdminHubClient initialPosts={posts || []} />
    </main>
  );
}
