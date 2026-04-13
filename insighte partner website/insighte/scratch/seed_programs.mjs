
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function seed() {
  const initialPrograms = [
    {
      name: "Shadow Teaching Integration",
      type: "core_service",
      description: "1:1 classroom assistance for neurodiverse learners, ensuring seamless social and academic integration.",
      icon_emoji: "🎓",
      tags: ["School-based", "1:1 Support"],
      impact_stat: "500+",
      impact_label: "Schools Reached",
      display_order: 1
    },
    {
      name: "ABA Momentum Therapy",
      type: "core_service",
      description: "Evidence-based behavioral intervention focused on communication and social skill development.",
      icon_emoji: "🧠",
      tags: ["Home-based", "Evidence-led"],
      impact_stat: "1200+",
      impact_label: "Success Stories",
      display_order: 2
    },
    {
      name: "Neuro-Inclusive Classroom Design",
      type: "course",
      description: "A specialized certification for educators to build sensory-friendly, adaptive learning environments.",
      icon_emoji: "📐",
      course_format: "Hybrid",
      course_audience: "Educators",
      is_featured: true,
      display_order: 3
    },
    {
      name: "Family Advocacy Masterclass",
      type: "course",
      description: "Equipping parents with the tools to navigate school policies and medical systems with clinical precision.",
      icon_emoji: "⚖️",
      course_format: "Online",
      course_audience: "Parents",
      is_featured: false,
      display_order: 4
    },
    {
      name: "Parent Support Circle",
      type: "support_group",
      description: "A secure space for parents of neurodiverse children to share experiences and peer-vetted resources.",
      icon_emoji: "🤝",
      schedule_label: "Every Sat, 5 PM",
      member_count: 85,
      display_order: 5
    },
    {
      name: "Adult ADHD Nexus",
      type: "support_group",
      description: "Professional coaching and community support for adults navigating ADHD in the workplace and home.",
      icon_emoji: "🌀",
      schedule_label: "Alt Thursdays",
      member_count: 42,
      display_order: 6
    }
  ];

  const { error } = await supabase.from("programs").upsert(initialPrograms, { onConflict: 'name' });
  if (error) {
     console.error(error);
  } else {
     console.log("Programs Seeded!");
  }
}

seed();
