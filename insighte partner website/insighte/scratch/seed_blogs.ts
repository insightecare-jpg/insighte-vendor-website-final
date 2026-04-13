import { createClient } from "@supabase/supabase-js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

const initialBlogs = [
    {
      "title_en": "Our Inclusive Education Network: Schools Supporting Neurodiverse Learners",
      "slug": "inclusive-education-network-india",
      "category": "Educator Wisdom",
      "summary_bullets": [
        "Inclusion consulting for institutions",
        "Seamless shadow teacher integration",
        "Partnerships with 50+ leading schools"
      ],
      "content_markdown": "# Connection Before Correction in Schools\n\nAt Insighte, our mission is to build a strong inclusive education ecosystem. We partner with International IB, IGCSE, CBSE, and ICSE schools to ensure every child has a seat at the table.\n\n## The Role of the Shadow Teacher\n\nA shadow teacher isn't just an assistant; they are the bridge between the child's internal world and the classroom's social rhythm.\n\n> Effective inclusion isn't about making the child 'fit' the school. It's about adapting the school's response to the child's unique processing style.",
      "status": "published",
      "content_type": "article",
      "reading_time_minutes": 5,
      "cover_image_url": "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2800&auto=format&fit=crop"
    },
    {
      "title_en": "A Neuroaffirmative Method: Social Cues Without Masking",
      "slug": "social-cues-without-masking",
      "category": "Parent Sanctuary",
      "summary_bullets": [
        "Emotional literacy vs. scripts",
        "Justification-based learning",
        "Advocating against 'masking' exhaustion"
      ],
      "content_markdown": "# Authenticity is the Goal\n\nUnderstanding social cues requires a nuanced, affirming approach. For too long, 'social skills' meant teaching children to hide their true selves to make others comfortable.\n\n## The Neuroaffirmative Shift\n\nWe focus on **Emotional Literacy**. Instead of 'Look me in the eye,' we ask, 'How do you feel when you're overwhelmed?'",
      "status": "published",
      "content_type": "video",
      "video_url": "https://www.youtube.com/watch?v=RIsV65JkHms",
      "reading_time_minutes": 7,
      "cover_image_url": "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2940&auto=format&fit=crop"
    },
    {
      "title_en": "When Big Emotions Arise: Managing Triggers",
      "slug": "big-emotions-managing-triggers",
      "category": "Educator Insights",
      "summary_bullets": [
        "Mapping sensory triggers by age",
        "The 15-minute co-regulation rule",
        "Sensory-first classroom design"
      ],
      "content_markdown": "# Navigating the Emotional Storm\n\nEvery child experiences big emotions, but when children learn to recognise and manage their emotional triggers, they gain a powerful sense of control.",
      "status": "published",
      "content_type": "article",
      "reading_time_minutes": 6,
      "cover_image_url": "https://images.unsplash.com/photo-1513258496099-48168024adb0?q=80&w=2940&auto=format&fit=crop"
    }
];

async function seed() {
  console.log("Seeding blogs...");
  const formattedBlogs = initialBlogs.map(b => ({
    ...b,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }));

  const { error: delError } = await supabase.from("blog_posts").delete().in('slug', initialBlogs.map(b => b.slug));
  if (delError) console.error("Del Error:", delError);

  const { data, error } = await supabase.from("blog_posts").insert(formattedBlogs);
  if (error) {
    console.error("Insert Error:", error.message);
    if (error.message.includes("violates row-level security")) {
        console.log("RLS Violation! You need to disable RLS or use service key.");
    }
    return;
  }
  console.log("Successfully seeded!");
}

seed();
