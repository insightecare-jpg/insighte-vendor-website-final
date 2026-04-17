"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getPrograms(type?: string) {
  const supabase = await createClient();
  if (!supabase) return [];
  let query = supabase.from("programs").select("*").order("display_order", { ascending: true });
  
  if (type) {
    query = query.eq("type", type);
  }
  
  const { data, error } = await query;
  if (error) {
    console.error("CRITICAL DATABASE FAILURE (Programs Table):", error);
    // Fallback to initial seed data to prevent UI blackout
    return [
      {
        id: "fb-1",
        name: "Shadow Teaching Integration",
        slug: "shadow-teaching",
        type: "core_service",
        description: "1:1 classroom assistance for neurodiverse learners, ensuring seamless social and academic integration.",
        icon_emoji: "🎓",
        tags: ["School-based", "1:1 Support"],
        impact_stat: "500+",
        impact_label: "Schools Reached",
        display_order: 1,
        external_enroll_url: "https://spot6289.graphy.com/courses/Insighte-Childcare-Shadow-Teacher-Training-Program-67334333cab6e42cf30202ec-67334333cab6e42cf30202ec"
      },
      {
        id: "fb-2",
        name: "ABA Momentum Therapy",
        slug: "aba-therapy",
        type: "core_service",
        description: "Evidence-based behavioral intervention focused on communication and social skill development.",
        icon_emoji: "🧠",
        tags: ["Home-based", "Evidence-led"],
        impact_stat: "1200+",
        impact_label: "Success Stories",
        display_order: 2
      },
      {
        id: "fb-3",
        name: "Neuro-Inclusive Classroom Design",
        slug: "neuro-inclusive-classroom",
        type: "course",
        description: "A specialized certification for educators to build sensory-friendly, adaptive learning environments.",
        icon_emoji: "📐",
        course_format: "Hybrid",
        course_audience: "Educators",
        is_featured: true,
        display_order: 3,
        external_enroll_url: "https://spot6289.graphy.com/courses"
      },
      {
        id: "fb-4",
        name: "Family Advocacy Masterclass",
        slug: "family-advocacy",
        type: "course",
        description: "Equipping parents with the tools to navigate school policies and medical systems with clinical precision.",
        icon_emoji: "⚖️",
        course_format: "Online",
        course_audience: "Parents",
        is_featured: false,
        display_order: 4
      },
      {
        id: "fb-5",
        name: "Parent Support Circle",
        slug: "parent-support-circle",
        type: "support_group",
        description: "A secure space for parents of neurodiverse children to share experiences and peer-vetted resources.",
        icon_emoji: "🤝",
        schedule_label: "Every Sat, 5 PM",
        member_count: 85,
        display_order: 5
      },
      {
        id: "fb-6",
        name: "Adult ADHD Nexus",
        slug: "adhd-nexus",
        type: "support_group",
        description: "Professional coaching and community support for adults navigating ADHD in the workplace and home.",
        icon_emoji: "🌀",
        schedule_label: "Alt Thursdays",
        member_count: 42,
        display_order: 6
      }
    ].filter((p: any) => !type || p.type === type);
  }
  return data || [];
}

export async function updateProgram(id: string, data: any) {
  const supabase = await createClient();
  if (!supabase) return { error: "Client not initialized" };
  const { error } = await supabase.from("programs").update(data).eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/programs");
  revalidatePath("/programs");
  return { success: true };
}

export async function deleteProgram(id: string) {
  const supabase = await createClient();
  if (!supabase) return { error: "Client not initialized" };
  const { error } = await supabase.from("programs").delete().eq("id", id);
  if (error) throw error;
  revalidatePath("/admin/programs");
  revalidatePath("/programs");
  return { success: true };
}

export async function createProgram(data: any) {
  const supabase = await createClient();
  if (!supabase) return { error: "Client not initialized" };
  const { error } = await supabase.from("programs").insert(data);
  if (error) throw error;
  revalidatePath("/admin/programs");
  revalidatePath("/programs");
  return { success: true };
}

export async function getProgramStats() {
  const supabase = await createClient();
  if (!supabase) return { total: 0, services: 0, trainings: 0, courses: 0, groups: 0 };
  const { data, error } = await supabase.from("programs").select("type, status");
  if (error) throw error;
  
  const stats = {
    total: data.length,
    services: data.filter((p: any) => p.type === 'core_service').length,
    trainings: data.filter((p: any) => p.type === 'training').length,
    courses: data.filter((p: any) => p.type === 'course').length,
    groups: data.filter((p: any) => p.type === 'support_group').length,
  };
  
  return stats;
}

export async function seedPrograms() {
  const supabase = await createClient();
  if (!supabase) return { error: "Client not initialized" };

  const initialPrograms = [
    // ═══ THE FOUNDATION (Core Services) ═══
    {
      name: "Shadow Teaching Integration",
      slug: "shadow-teaching",
      type: "core_service",
      description: "1:1 classroom assistance for neurodiverse learners, ensuring seamless social and academic integration.",
      icon_emoji: "🎓",
      tags: ["School-based", "1:1 Support"],
      impact_stat: "500+",
      impact_label: "Schools Reached",
      display_order: 1,
      external_enroll_url: "https://spot6289.graphy.com/courses/Insighte-Childcare-Shadow-Teacher-Training-Program-67334333cab6e42cf30202ec-67334333cab6e42cf30202ec"
    },
    {
      name: "ABA Momentum Therapy",
      slug: "aba-therapy",
      type: "core_service",
      description: "Evidence-based behavioral intervention focused on communication and social skill development.",
      icon_emoji: "🧠",
      tags: ["Home-based", "Evidence-led"],
      impact_stat: "1200+",
      impact_label: "Success Stories",
      display_order: 2
    },
    // ═══ INTELLECTUAL CAPITAL / PRECISION TRAININGS (Courses) ═══
    {
      name: "Neuro-Inclusive Classroom Design",
      slug: "neuro-inclusive-classroom",
      type: "course",
      description: "A specialized certification for educators to build sensory-friendly, adaptive learning environments.",
      icon_emoji: "📐",
      course_format: "Hybrid",
      course_audience: "Educators",
      is_featured: true,
      display_order: 3,
      external_enroll_url: "https://spot6289.graphy.com/courses"
    },
    {
      name: "Family Advocacy Masterclass",
      slug: "family-advocacy",
      type: "course",
      description: "Equipping parents with the tools to navigate school policies and medical systems with clinical precision.",
      icon_emoji: "⚖️",
      course_format: "Online",
      course_audience: "Parents",
      is_featured: false,
      display_order: 4
    },
    // ═══ SHARED JOURNEY / COMMUNITY CIRCLES (Support Groups) ═══
    {
      name: "Parent Support Circle",
      slug: "parent-support-circle",
      type: "support_group",
      description: "A secure space for parents of neurodiverse children to share experiences and peer-vetted resources.",
      icon_emoji: "🤝",
      schedule_label: "Every Sat, 5 PM",
      member_count: 85,
      display_order: 5
    },
    {
      name: "Adult ADHD Nexus",
      slug: "adhd-nexus",
      type: "support_group",
      description: "Professional coaching and community support for adults navigating ADHD in the workplace and home.",
      icon_emoji: "🌀",
      schedule_label: "Alt Thursdays",
      member_count: 42,
      display_order: 6
    },
    {
      name: "Special Education Flow",
      slug: "special-education",
      type: "core_service",
      description: "Customized learning pathways for children with global developmental delays (GDD) and high-support needs.",
      icon_emoji: "🎒",
      tags: ["Developmental", "Academic"],
      impact_stat: "400+",
      impact_label: "Academic Milestones",
      display_order: 7
    },
    {
      name: "Counselling & Psychotherapy",
      slug: "counselling",
      type: "core_service",
      description: "Clinical support for emotional regulation, anxiety, and family dynamics using neuro-affirmative frameworks.",
      icon_emoji: "🌸",
      tags: ["Emotional", "Clinical"],
      impact_stat: "800+",
      impact_label: "Clinical Outcomes",
      display_order: 8
    },
    {
      name: "Homecare & Respite",
      slug: "homecare",
      type: "core_service",
      description: "Trained caregivers providing essential support within the home environment, enabling parent respite.",
      icon_emoji: "🏠",
      tags: ["Home-based", "Caregiving"],
      impact_stat: "300+",
      impact_label: "Families Supported",
      display_order: 9
    }
  ];

  const { error } = await supabase.from("programs").upsert(initialPrograms, { onConflict: 'name' });

  if (error) throw error;
  
  revalidatePath("/programs");
  return { success: true };
}

