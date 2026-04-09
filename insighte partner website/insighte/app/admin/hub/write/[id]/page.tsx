import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import EditorClient from "../components/EditorClient";

export const dynamic = 'force-dynamic';

export default async function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch the clinical protocol for editing
  const { data: post, error } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !post) {
    console.error("Clinical Protocol Resolution Error:", error);
    return notFound();
  }

  return (
    <div className="h-screen overflow-hidden bg-[#0a0b1c]">
      <EditorClient initialData={post} />
    </div>
  );
}
