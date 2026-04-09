import React from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  ArrowRight, 
  CheckCircle2, 
  Compass, 
  Heart, 
  ShieldCheck, 
  Sparkles, 
  Users, 
  Clock, 
  Brain,
  Video,
  Home,
  Star,
  Check,
  Search,
  MessageSquare,
  ChevronDown
} from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { FeaturedSpecialists } from "@/components/programs/featured-specialists";
import { createClient } from "@/lib/supabase/server";
import { SERVICE_GROUPS } from "@/lib/constants";


interface VerticalContent {
  slug: string;
  meta: {
    title: string;
    description: string;
  };
  hero: {
    h1: string;
    copy: string;
    ctaPrimary: string;
    ctaSecondary: string;
    image: string;
  };
  whoThisIsFor: string[];
  whatSupportLooksLike: string[];
  signsBenefit: string[];
  ourApproach: {
    title: string;
    points: { title: string; desc: string }[];
  };
  whyChooseInsighte: string[];
  faqs: { q: string; a: string }[];
  category: string;
}

const VERTICALS: Record<string, VerticalContent> = {
  "speech-therapy": {
    slug: "speech-therapy",
    category: "Therapy",
    meta: {
      title: "Speech Therapy for Children in Bangalore | Insighte",
      description: "Find trusted speech therapists in Bangalore for children. Get support for speech delay, articulation, language development, and social communication at home or online."
    },
    hero: {
      h1: "Speech Therapy for Children in Bangalore",
      copy: "Help your child build communication with confidence. At Insighte, we connect families with trusted speech therapists who support children with speech delay, articulation difficulties, language development, social communication, and related needs. Sessions are available at home or online.",
      ctaPrimary: "Find a Speech Therapist",
      ctaSecondary: "Book a Consultation",
      image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=1200"
    },
    whoThisIsFor: [
      "are late to start speaking",
      "struggle to form words clearly",
      "have difficulty understanding or expressing language",
      "find back-and-forth communication hard",
      "need support with social communication",
      "need communication support alongside autism, ADHD, or learning differences"
    ],
    whatSupportLooksLike: [
      "speech clarity and pronunciation",
      "receptive language development",
      "expressive language building",
      "vocabulary and sentence building",
      "social communication strategies",
      "communication confidence",
      "parent coaching and home carryover"
    ],
    signsBenefit: [
      "Not meeting language milestones by age 2",
      "Difficult for family/strangers to understand speech",
      "Frustration when trying to communicate needs",
      "Limited eye contact or social engagement",
      "Repeating words without understanding (echolalia)",
      "Preference for gestures over spoken words"
    ],
    ourApproach: {
      title: "Look at the child as a whole",
      points: [
          { title: "Neurodiversity-Affirming", desc: "We celebrate different communication styles and focus on functional connection." },
          { title: "Child-Centred", desc: "Protocols follow the child's interests and natural engagement patterns." },
          { title: "Play-Based", desc: "Communication is built through joy and shared activity, not just drills." },
          { title: "Collaborative", desc: "Parents are active partners in the therapy loop for daily progress." }
      ]
    },
    whyChooseInsighte: [
      "Verified child specialists",
      "Home and online options",
      "Support for neurodivergent children",
      "Parent guidance built into the process",
      "Easy scheduling and follow-up"
    ],
    faqs: [
      { q: "How do I know if my child needs speech therapy?", a: "If your child is struggling with speech clarity, language development, communication, or interaction, an initial consultation can help understand whether support may be useful." },
      { q: "Do you offer speech therapy at home in Bangalore?", a: "Yes. Depending on location and specialist availability, home sessions may be available." },
      { q: "Do you offer online speech therapy for children?", a: "Yes. Online sessions may work well for many children, especially with parent involvement and the right fit." },
      { q: "Can speech therapy help autistic children?", a: "Speech therapy can support communication in many different ways, including spoken language, social communication, and alternative ways of expressing needs." }
    ]
  },
  "counselling-for-children": {
    slug: "counselling-for-children",
    category: "Counselling",
    meta: {
      title: "Child Counselling in Bangalore for Emotional Growth | Insighte",
      description: "Nurture your child's emotional well-being with verified child counselors in Bangalore. Support for social skills, anxiety, confidence, and behavioral harmony at home or online."
    },
    hero: {
      h1: "Counselling for Children in Bangalore",
      copy: "A sanctuary for emotional intelligence and resilience. Our child-led protocols ensure every voice is heard and every feeling is validated, helping children navigate social, emotional, and developmental milestones with confidence.",
      ctaPrimary: "Find a Child Counselor",
      ctaSecondary: "Book a Session",
      image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=1200"
    },
    whoThisIsFor: [
      "struggling with big emotions or meltdowns",
      "facing social anxiety or school-related stress",
      "navigating family transitions or changes",
      "building self-esteem and confidence",
      "developing social-emotional skills",
      "neurodivergent children needing emotional support patterns"
    ],
    whatSupportLooksLike: [
      "Play-based emotional exploration",
      "Developing healthy coping mechanisms",
      "Social skills and peer interaction support",
      "Building confidence and self-regulation",
      "Family guidance and home strategies",
      "Neuro-affirming behavioral harmony patterns"
    ],
    signsBenefit: [
      "Persistent sadness or withdrawal",
      "Difficulty regulating anger or frustration",
      "Extreme school refusal or social avoidance",
      "Low self-confidence and negative self-talk",
      "Difficulty forming or keeping friendships",
      "Major changes in sleep or eating patterns"
    ],
    ourApproach: {
        title: "Connection Before Correction",
        points: [
            { title: "Empathetic Play", desc: "We use play as the 'natural language' of the child to process emotions." },
            { title: "Safe Exploration", desc: "A judgement-free sanctuary for expressing complex thoughts." },
            { title: "Strengths-Based", desc: "Focusing on what's right with the child, not just what's wrong." },
            { title: "Family-Aligned", desc: "We equip parents to be the emotional anchor for their children." }
        ]
    },
    whyChooseInsighte: [
      "Verified clinical psychologists",
      "Child-Rights centered approach",
      "Safe, private online sessions",
      "Consistent, weightless clinical care"
    ],
    faqs: [
      { q: "Is online child counselling effective?", a: "Yes. For many children, being in their safe home space allows for deeper expression and better implementation of strategies." },
      { q: "How long is a virtual session?", a: "Standard sessions range from 45 to 60 minutes, tailored to the child's attention span and clinical needs." },
      { q: "Do parents participate?", a: "Parent involvement is usually encouraged, as it helps create a more supportive environment in the long run." }
    ]
  },
  "counselling-online": {
    slug: "counselling-online",
    category: "Counselling",
    meta: {
      title: "Online Counselling for Children & Families | Insighte Sanctuary",
      description: "Access world-class child counselling from anywhere. Our online sessions combine clinical expertise with weightless, human connection for neurodivergent children."
    },
    hero: {
      h1: "Online Counselling in the Sanctuary",
      copy: "Distance should never be a barrier to clinical excellence. Our online sanctuary brings specialist care directly to your child's most comfortable space, ensuring seamless connection and support.",
      ctaPrimary: "Find an Online Counselor",
      ctaSecondary: "Book Virtual Session",
      image: "https://images.unsplash.com/photo-1573497621451-9969199d7990?auto=format&fit=crop&q=80&w=1200"
    },
    whoThisIsFor: [
      "families living outside Bangalore",
      "children who feel safest in their own home",
      "parents seeking expert guidance remotely",
      "maintaining continuity of care while traveling",
      "flexible scheduling for busy families",
      "neuro-divergent individuals preferring virtual interfaces"
    ],
    whatSupportLooksLike: [
      "Interactive virtual therapeutic play",
      "Parent-led home implementation strategies",
      "Digital visual aids and communication tools",
      "Regular video check-ins and progress tracking",
      "Weightless, low-friction clinical support",
      "Empowering the home ecosystem effectively"
    ],
    signsBenefit: [],
    ourApproach: {
        title: "Connection Without Borders",
        points: [
            { title: "Virtual Sanctuary", desc: "Creating a safe, private space through the screen." },
            { title: "Tech-Enabled Empathy", desc: "Using digital tools to bridge the physical gap." },
            { title: "Parent-Partnered", desc: "Co-creating the therapeutic environment at home." },
            { title: "Seamless Continuity", desc: "Consistent support regardless of location." }
        ]
    },
    whyChooseInsighte: [
      "Verified clinical psychologists",
      "Child-Rights centered approach",
      "Safe, private online sessions",
      "Neuro-inclusive clinical framework"
    ],
    faqs: [
      { q: "What is the right age for a child to start counselling?", a: "Counselling can be beneficial at any age. For younger children, it is often more play-based and parent-collaborative." },
      { q: "Is counselling same as behavioral therapy?", a: "While they overlap, child counselling focuses more on emotional processing, resilience, and inner-wellbeing, while behavioral therapy often targets specific functional goals." },
      { q: "Can online counselling be as effective for kids?", a: "Yes, especially for older children or when focused on parent-guided play for younger ones. It provides a comfortable home environment." }
    ]
  },
  "behavioral-therapy": {
    slug: "behavioral-therapy",
    category: "Therapy",
    meta: {
        title: "Behavioral Therapy for Kids in Bangalore | Insighte",
        description: "Evidence-based behavioral therapy for children in Bangalore. Personalized ABA and functional skill building to support independence and social growth at home or online."
    },
    hero: {
        h1: "Behavioral Therapy for Children in Bangalore",
        copy: "Support your child's functional independence and social growth. Our behavioral therapy protocols focus on building meaningful life skills and reducing frustration through evidence-based, neuro-affirmative interventions.",
        ctaPrimary: "Find a Behavioral Specialist",
        ctaSecondary: "Request a Baseline Audit",
        image: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&q=80&w=1200"
    },
    whoThisIsFor: [
        "developing functional independence skills",
        "improving social interaction and engagement",
        "reducing frustration-based meltdowns",
        "learning daily living skills (toileting, feeding, etc.)",
        "developing self-regulation patterns",
        "autistic or ADHD children needing structured skill acquisition"
    ],
    whatSupportLooksLike: [
        "Functional Behavior Assessment (FBA)",
        "Daily living skill mastery",
        "Positive reinforcement cycles",
        "Social engagement training",
        "Reducing restrictive patterns",
        "Parent-mediated intervention coaching",
        "School-shadowing and integration support"
    ],
    signsBenefit: [
        "Frequent meltdowns that interfere with life",
        "Difficulty with transitions or routine changes",
        "Inability to communicate basic needs",
        "Lack of awareness of social boundaries",
        "Challenges with basic self-care tasks",
        "Need for high levels of structure to function"
    ],
    ourApproach: {
        title: "Functional & Affirming",
        points: [
            { title: "Science-Backed", desc: "Utilizing principles of ABA and CBT for measurable progress." },
            { title: "Zero Harm", desc: "Strictly neuro-affirmative; we never use punishment or force." },
            { title: "Contextual Growth", desc: "Working in the child's natural environment for better carryover." },
            { title: "Empowerment First", desc: "Focused on making the child more independent, not just compliant." }
        ]
    },
    whyChooseInsighte: [
        "BCBA and experienced BCaBA guides",
        "Data-driven progress tracking",
        "Home-based intervention specialists",
        "Seamless integration with school plans",
        "Focus on long-term functional autonomy"
    ],
    faqs: [
        { q: "Is behavioral therapy same as teaching?", a: "It's specialized teaching focused on functional behaviors and social-communication skills that help a child thrive in their daily life." },
        { q: "How many hours of therapy are needed?", a: "Every child is different. We start with a baseline audit to recommend the right intensity for your child." },
        { q: "Do you provide home-based behavioral therapy?", a: "Yes, we specialize in bringing clinical expertise to the home sanctuary where children learn best." }
    ]
  },
  "early-intervention": {
    slug: "early-intervention",
    category: "Therapy",
    meta: {
        title: "Early Intervention Services in Bangalore | Insighte",
        description: "Maximize your child's developmental potential with high-impact early intervention in Bangalore. Multidisciplinary support for children ages 2-8 at home or online."
    },
    hero: {
        h1: "Early Intervention for Children in Bangalore",
        copy: "The most crucial years deserve the most expert care. Our early intervention protocols (ages 2-8) combine SLP, OT, and Special Education to create high-velocity developmental progress when the brain is most plastic.",
        ctaPrimary: "Initialize Early Ascent",
        ctaSecondary: "Book Baseline Assessment",
        image: "https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=1200"
    },
    whoThisIsFor: [
        "children aged 2 to 8 years",
        "experiencing global developmental delay",
        "with recent autism or ADHD diagnosis",
        "needing school-readiness preparation",
        "with speech, motor, or social lags",
        "families seeking a concentrated progress cycle"
    ],
    whatSupportLooksLike: [
        "Multidisciplinary clinical mapping",
        "Intensive speech and language work",
        "Sensory-motor integration (OT)",
        "Foundational literacy and numeracy",
        "Social-emotional baseline building",
        "Parent empowerment bootcamps",
        "Transitioning to mainstream schooling"
    ],
    signsBenefit: [
        "Not hitting physical or social milestones",
        "Delayed speech or lack of eye contact",
        "Rigid play or lack of imitation skills",
        "Sensory sensitivities to sound/touch",
        "Difficulty following simple instructions",
        "Preference for solitary play over interaction"
    ],
    ourApproach: {
        title: "High-Velocity, High-Empathy",
        points: [
            { title: "Critical Window", desc: "We target the prime developmental phase to maximize results." },
            { title: "Team Coordination", desc: "Speech, OT, and Ed working as one unified clinical unit." },
            { title: "Intensive Cycles", desc: "Structured, high-frequency sessions for rapid skill gain." },
            { title: "Holistic Blueprint", desc: "Mapping the child's entire ecosystem for success." }
        ]
    },
    whyChooseInsighte: [
        "Integrated therapy teams",
        "Highest success rate in school entry",
        "Home-based clinical setups",
        "Evidence-based ESDM and ABA loops",
        "Compassionate parent navigation"
    ],
    faqs: [
        { q: "Why is early intervention so important?", a: "Early intervention capitalizes on neuroplasticity, allowing for much faster skill acquisition and better long-term outcomes." },
        { q: "What professionals are involved?", a: "Typically a mix of Special Educators, Speech Therapists, and Occupational Therapists, all coordinated by a clinical lead." },
        { q: "How long does a cycle last?", a: "We typically work in 3-6 month intensive blocks with regular reassessments." }
    ]
  },
  "special-education-at-home": {
    slug: "special-education-at-home",
    category: "Tutoring",
    meta: {
        title: "Special Education at Home in Bangalore | Insighte",
        description: "Personalized learning support with expert special educators in Bangalore. Tailored curriculum and 1-on-1 teaching for children with learning needs in their home sanctuary."
    },
    hero: {
        h1: "Special Education at Home in Bangalore",
        copy: "Learning that adapts to your child, not the other way around. We bring qualified special educators to your home to deliver 1-on-1 support for literacy, numeracy, and school curriculum integration for neuro-diverse learners.",
        ctaPrimary: "Find a Special Educator",
        ctaSecondary: "Request Learning Audit",
        image: "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?auto=format&fit=crop&q=80&w=1200"
    },
    whoThisIsFor: [
        "children with Dyslexia, Dysgraphia, or Dyscalculia",
        "learners needing curriculum adaptation",
        "students with focus or attention challenges",
        "children not coping in large school environments",
        "homeschooled neuro-diverse children",
        "preparing for NIOS or board transitions"
    ],
    whatSupportLooksLike: [
        "Individualized Education Plan (IEP)",
        "Remedial literacy and numeracy",
        "Multisensory teaching methods",
        "Executive function coaching",
        "Curriculum modification",
        "Exam preparation and stress management",
        "Teacher-parent coordination"
    ],
    signsBenefit: [
        "Significant lag in reading or writing skills",
        "Consistent struggle with school homework",
        "Anxiety related to academic performance",
        "Difficulty organizing tasks or thoughts",
        "Strong intelligence but weak grades",
        "Lack of progress despite school tutoring"
    ],
    ourApproach: {
        title: "Learning Without Barriers",
        points: [
            { title: "Bespoke Curriculum", desc: "We redesign lessons based on your child's learning style." },
            { title: "Success-Oriented", desc: "Building confidence by starting with what the child knows." },
            { title: "Multisensory", desc: "Using visual, auditory, and kinesthetic tools to teach." },
            { title: "Weightless Pressure", desc: "Focus on mastery and joy, not just grades and competition." }
        ]
    },
    whyChooseInsighte: [
        "B.Ed/M.Ed (Special Ed) qualified educators",
        "Flexible home-based scheduling",
        "Expertise in NIOS and IB/IGCSE accommodations",
        "Regular 360-degree progress audits",
        "Holistic clinical oversight"
    ],
    faqs: [
        { q: "Is this the same as normal home tuition?", a: "No. Special education utilizes specific clinical teaching strategies (like Orton-Gillingham) to cross learning gaps that normal tuition cannot." },
        { q: "Can we use this alongside school?", a: "Yes, many families use home-based special ed to help their child keep up and thrive in their mainstream school." },
        { q: "How do you track progress?", a: "We create specific, measurable goals in an IEP and provide monthly progress reports." }
    ]
  },
  "family-counselling": {
    slug: "family-counselling",
    category: "Counselling",
    meta: {
        title: "Family Counselling & Parenting Support in Bangalore | Insighte",
        description: "Rebuild connection and harmony with expert family therapists in Bangalore. Support for parenting alignment, communication, and family transitions."
    },
    hero: {
        h1: "Family Counselling in Bangalore",
        copy: "Create a Roadmap for Family Harmony. We help families navigate the complexities of neuro-diversity, transitions, and communication through a holistic, klinical, and human-centered lens.",
        ctaPrimary: "Connect with a Family Therapist",
        ctaSecondary: "Free Preliminary Chat",
        image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?auto=format&fit=crop&q=80&w=1200"
    },
    whoThisIsFor: [
        "families navigating a new diagnosis",
        "parents struggling to align on strategies",
        "siblings of neuro-diverse children",
        "families facing high levels of daily stress",
        "navigating divorce, loss, or relocation",
        "improving overall family communication"
    ],
    whatSupportLooksLike: [
        "Ecosystem dynamic assessment",
        "Parenting alignment workshops",
        "Sibling support and education",
        "Communication protocol building",
        "Stress management for the unit",
        "Conflict resolution mediation",
        "Long-term family wellness planning"
    ],
    signsBenefit: [
        "Frequent conflict between family members",
        "Feeling 'stuck' in negative cycles",
        "Different parenting styles causing tension",
        "Sibling resentment or withdrawal",
        "Total family isolation from social support",
        "Parental burnout and chronic fatigue"
    ],
    ourApproach: {
        title: "The Family Ecosystem",
        points: [
            { title: "Circular Perspective", desc: "We look at how everyone's actions affect each other." },
            { title: "Empowerment", desc: "Giving parents the tools to be their own clinical captains." },
            { title: "Inclusion", desc: "Ensuring the child's voice remains central to family goals." },
            { title: "Resilience-Focused", desc: "Building the internal 'muscle' of the family unit." }
        ]
    },
    whyChooseInsighte: [
        "Specialists in neuro-diverse family dynamics",
        "Private home or virtual sessions",
        "Safe space for difficult conversations",
        "Actionable home strategies (no vague advice)",
        "Deep clinical empathy"
    ],
    faqs: [
        { q: "Does the child need to be present?", a: "Sessions vary; some are just for parents, some involve the whole family. We decide the structure collaboratively." },
        { q: "How long does family therapy take?", a: "Typically 6-12 sessions can create significant shifts in family rhythm." },
        { q: "Is this different from parenting training?", a: "Yes. It's deeper—focused on the emotional relationships, not just the behavior management." }
    ]
  },
  "career-counselling": {
    slug: "career-counselling",
    category: "Counselling",
    meta: {
        title: "Career & Transition Counselling for Teens in Bangalore | Insighte",
        description: "Expert career guidance for neuro-diverse teens and young adults in Bangalore. Pathway design for university and professional transitions."
    },
    hero: {
        h1: "Career Counselling in Bangalore",
        copy: "Mapping Future Vistas with Clinical Clarity. We find the intersection of passion and clinical strengths for neuro-diverse learners transitioning to college, university, or the professional world.",
        ctaPrimary: "Consult a Career Guide",
        ctaSecondary: "View VISTA Framework",
        image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=1200"
    },
    whoThisIsFor: [
        "teenagers (13-18) choosing streams/boards",
        "neuro-diverse young adults (19+) entering workforce",
        "students needing NIOS to University mapping",
        "learners with ADHD/Autism needing transition support",
        "career changers seeking inclusive pathways",
        "building workplace self-advocacy skills"
    ],
    whatSupportLooksLike: [
        "Vocational interest mapping",
        "Clinical strength-based assessment",
        "College application support",
        "Resume and interview coaching",
        "Workplace accommodation planning",
        "Self-advocacy training",
        "Mentor pairing and industry links"
    ],
    signsBenefit: [
        "Total confusion about post-school options",
        "Severe anxiety about career choices",
        "Apathy or lack of motivation for studies",
        "Interests that don't match school performance",
        "Fear of workplace social demands",
        "Need for non-traditional academic paths"
    ],
    ourApproach: {
        title: "Charting Your Own VISTA",
        points: [
            { title: "Neuro-Inclusive", desc: "We prioritize careers where neuro-diverse traits are strengths." },
            { title: "Future-Proof", desc: "Focusing on sustainable, long-term vocational wellbeing." },
            { title: "Practical Steps", desc: "Clear, weightless transitions with documented milestones." },
            { title: "Voice & Choice", desc: "The student leads the discovery process, not the parents." }
        ]
    },
    whyChooseInsighte: [
        "Experts in neuro-diverse employment",
        "Global university transition knowledge",
        "Safe, non-judgmental discovery phase",
        "Continuous support during transition",
        "Focus on identity and autonomy"
    ],
    faqs: [
        { q: "Is this only for teenagers?", a: "While we start at age 13, we also work with adults in their early 20s navigating their first jobs." },
        { q: "Can you help with NIOS students?", a: "Absolutely. We are leaders in mapping NIOS outcomes to higher education." },
        { q: "Do you use psychometric tests?", a: "Yes, but we use them as starting points for conversation, not absolute rules." }
    ]
  },
  "support-group-for-parents": {
    slug: "support-group-for-parents",
    category: "Extra Curricular",
    meta: {
        title: "Parent Support Groups in Bangalore | The Insighte Sanctuary",
        description: "Join the Insighte Parent Collective. Facilitated support groups in Bangalore for families of neuro-diverse children. Find wisdom, empathy, and advocacy."
    },
    hero: {
        h1: "Parent Support Groups in Bangalore",
        copy: "You were never meant to walk this path alone. Join a curated collective of intentional parents for facilitated sessions that prioritize your wisdom, your well-being, and your child's ascent.",
        ctaPrimary: "Join the Collective",
        ctaSecondary: "View Upcoming Circles",
        image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&q=80&w=1200"
    },
    whoThisIsFor: [
        "parents of neuro-diverse children",
        "families feeling social isolation",
        "parents seeking authentic shared wisdom",
        "advocating for children in schools",
        "managing the stress of care navigation",
        "looking for inclusive social connection"
    ],
    whatSupportLooksLike: [
        "Facilitated emotional check-ins",
        "Guest expert deep-dives (law, medical, ed)",
        "Private community platform access",
        "Advocacy toolkits and school navigation",
        "Respite and wellness workshops",
        "Shared resource libraries",
        "Safe, moderated venting spaces"
    ],
    signsBenefit: [
        "Feeling misunderstood by friends or family",
        "Intense 'caregiver burnout' and fatigue",
        "Endless searching for specialists alone",
        "Fear of the future without a roadmap",
        "Lack of social outlets for the whole family",
        "Wanting to help others through your journey"
    ],
    ourApproach: {
        title: "We Are Your Sanctuary",
        points: [
            { title: "Non-Judgmental", desc: "A safe space where every challenge is normalized." },
            { title: "Wisdom-Sharing", desc: "The collective knowledge of 100+ parents is your guide." },
            { title: "Well-Being First", desc: "If the parent isn't okay, the child's progress is capped." },
            { title: "Empowered Action", desc: "Moving from survival to advocacy and joy." }
        ]
    },
    whyChooseInsighte: [
        "Scientifically facilitated groups",
        "Safe, moderate, and verified community",
        "Direct access to Insighte clinical team",
        "Holistic family social events",
        "Advocacy and legal support linkages"
    ],
    faqs: [
        { q: "Is there a fee to join?", a: "Some sessions are free community events, while our intensive facilitated cohorts have a subscription fee." },
        { q: "Are the sessions online or offline?", a: "We offer both! Online circles for convenience and offline meetups for deep connection." },
        { q: "Is my privacy protected?", a: "Yes. All circles operate under strict confidentiality agreements to ensure safe sharing." }
    ]
  }
};

const FALLBACK_DATA: VerticalContent = VERTICALS["counselling-for-children"];

export default async function ProgramLanding({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = VERTICALS[slug] || FALLBACK_DATA;
  
  const supabase = await createClient();
  let specialists: any[] = [];
  
  if (supabase) {
    const group = SERVICE_GROUPS.find(g => g.name === data.category);
    
    let query = supabase
      .from("providers")
      .select("*, services(*)")
      .order("rating", { ascending: false })
      .limit(3);
      
    if (group) {
      // If we have a group, filter by specializations that match the group's services
      query = query.contains("services", group.services);
    } else {
      query = query.eq("category", data.category);
    }

    const { data: specialistsData } = await query;
    
    if (specialistsData) {
      specialists = specialistsData;
    }
  }

  return (
    <div className="bg-[#111224] text-[#e1e0fa] font-sans selection:bg-[#d3c4b5]/30">
      <Navbar />

      <main className="pt-24 md:pt-32">
        {/* 1. Hero Section */}
        <section className="px-6 py-16 md:py-32 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-[#d3c4b5]/5 blur-[120px] -z-10 rounded-full animate-pulse"></div>
          
          <div className="flex-1 space-y-10 animate-fade-in-up">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#191a2d] border border-white/5">
                <span className="w-2 h-2 rounded-full bg-[#baccb3] animate-pulse"></span>
                <span className="text-[10px] md:text-xs font-black text-[#baccb3] uppercase tracking-widest italic">Vertical Pathway</span>
              </div>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-manrope font-extrabold tracking-tighter text-[#f0e0d0] leading-[1.05] italic uppercase">
                {data.hero.h1.split(' ').slice(0, -2).join(' ')} <br/>
                <span className="text-zinc-600">{data.hero.h1.split(' ').slice(-2).join(' ')}</span>
              </h1>
            </div>
            
            <p className="text-xl text-[#c8c5cd] leading-relaxed italic max-w-2xl font-medium opacity-80">
              {data.hero.copy}
            </p>
            
            <div className="pt-8 flex flex-col sm:flex-row gap-6">
               <Link href={`/specialists?category=${data.category}`}>
                  <button className="h-20 px-12 rounded-full bg-[#d3c4b5] text-[#382f24] font-black uppercase tracking-widest text-xs hover:shadow-glow shadow-[#d3c4b5]/20 hover:scale-105 active:scale-95 transition-all">
                    {data.hero.ctaPrimary}
                  </button>
               </Link>
               <button className="h-20 px-12 rounded-full bg-white/5 text-white font-black uppercase tracking-widest text-xs border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center gap-3">
                 {data.hero.ctaSecondary} <ArrowRight className="w-4 h-4" />
               </button>
            </div>
          </div>
          
          <div className="flex-1 relative aspect-[4/5] w-full max-w-sm lg:max-w-md xl:max-w-lg mx-auto rounded-[80px] overflow-hidden shadow-2xl group border border-white/10 animate-fade-in-up delay-300">
             <Image 
               src={data.hero.image}
               alt={data.hero.h1}
               fill
               className="object-cover grayscale group-hover:grayscale-0 transition-all duration-[2000ms] scale-[1.1] group-hover:scale-100"
             />
             <div className="absolute inset-0 bg-gradient-to-t from-[#0b0c1f]/80 to-transparent"></div>
             <div className="absolute bottom-12 left-12 right-12 p-8 glass-card border border-white/20 rounded-3xl backdrop-blur-3xl">
                <div className="flex items-center gap-4 mb-2">
                   <ShieldCheck className="w-5 h-5 text-[#baccb3]" />
                   <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#baccb3] italic">Sanctuary Verified</p>
                </div>
                <h4 className="text-xl font-bold font-manrope text-white">Clinical Excellence</h4>
             </div>
          </div>
        </section>

        {/* 2. Who this is for */}
        <section className="px-6 py-32 bg-[#191a2d] relative overflow-hidden">
           <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-24 items-start">
              <div className="lg:w-1/3 space-y-6">
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#d3c4b5] italic">Parental Intent</span>
                 <h2 className="text-5xl font-manrope font-extrabold tracking-tighter italic uppercase text-[#f0e0d0] leading-none">Who This <br/><span className="text-zinc-600">Is For.</span></h2>
                 <p className="text-zinc-500 italic max-w-xs leading-relaxed pt-4">Identifying the resonance points where our support meets your child's needs.</p>
              </div>
              <div className="lg:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                 {data.whoThisIsFor.map((item, idx) => (
                   <div key={idx} className="flex items-start gap-5 group p-6 rounded-3xl hover:bg-white/5 transition-all">
                      <div className="h-8 w-8 rounded-full bg-[#111224] flex items-center justify-center border border-white/5 group-hover:border-[#d3c4b5]/40 shrink-0 mt-1 transition-all">
                         <Check className="w-4 h-4 text-[#d3c4b5]" />
                      </div>
                      <span className="text-lg text-[#c8c5cd] group-hover:text-white transition-colors">{item}</span>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* 3. What support looks like */}
        <section className="px-6 py-40 max-w-7xl mx-auto">
           <div className="flex flex-col items-center text-center mb-24 space-y-6">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#baccb3] italic">Protocol Execution</span>
              <h2 className="text-5xl md:text-7xl font-manrope font-extrabold tracking-tighter italic uppercase text-[#f0e0d0] leading-none">
                 What Support <br/><span className="text-zinc-600">Actually Looks Like.</span>
              </h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1px bg-white/5 border border-white/5 rounded-[60px] overflow-hidden">
              {data.whatSupportLooksLike.map((feat, idx) => (
                <div key={idx} className="bg-[#111224] p-12 space-y-6 hover:bg-[#191a2d] transition-all">
                   <div className="h-10 w-10 flex items-center justify-center rounded-2xl bg-white/5 text-[#baccb3]">
                      <Sparkles className="w-5 h-5" />
                   </div>
                   <h4 className="text-2xl font-manrope font-extrabold tracking-tighter uppercase italic">{feat}</h4>
                </div>
              ))}
           </div>
        </section>

        {/* 4. Signs your child may benefit */}
        <section className="px-6 py-40 bg-[#1d1e31]/40 border-y border-white/5 relative overflow-hidden">
           <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#c8c4db]/5 blur-[120px] rounded-full"></div>
           <div className="max-w-5xl mx-auto">
              <div className="text-center space-y-6 mb-24">
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#c8c4db] italic">Observational Mapping</span>
                 <h2 className="text-5xl font-manrope font-extrabold tracking-tighter italic uppercase">Signs Your Child <br/><span className="text-zinc-600">May Benefit.</span></h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {data.signsBenefit.map((sign, idx) => (
                   <div key={idx} className="vessel bg-[#111224]/50 p-8 rounded-[2rem] border border-white/5 flex items-center gap-6 group hover:border-[#c8c4db]/30 transition-all">
                      <div className="text-4xl font-manrope font-black text-white/5 group-hover:text-[#c8c4db]/10 transition-colors">{(idx + 1).toString().padStart(2, '0')}</div>
                      <p className="text-[#c8c5cd] group-hover:text-white transition-colors italic">{sign}</p>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* 5. Our approach */}
        <section className="px-6 py-40 max-w-7xl mx-auto text-center">
           <div className="space-y-8 mb-32">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#d3c4b5] italic">Sanctuary DNA</span>
              <h2 className="text-6xl md:text-8xl font-manrope font-extrabold tracking-tighter italic uppercase leading-[0.9]">
                 {data.ourApproach.title.split(' ').slice(0, 3).join(' ')} <br/>
                 <span className="text-zinc-600">{data.ourApproach.title.split(' ').slice(3).join(' ')}</span>
              </h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
              {data.ourApproach.points.map((point, idx) => (
                <div key={idx} className="space-y-6 text-center group">
                   <div className="h-20 w-20 bg-white/5 rounded-[30px] flex items-center justify-center mx-auto text-[#d3c4b5] group-hover:scale-110 group-hover:bg-[#d3c4b5]/10 transition-all">
                      <Compass className="w-8 h-8" />
                   </div>
                   <div className="space-y-3">
                      <h4 className="text-xl font-manrope font-black uppercase tracking-tight italic">{point.title}</h4>
                      <p className="text-zinc-500 text-sm italic py-2">{point.desc}</p>
                   </div>
                </div>
              ))}
           </div>
        </section>

        {/* 6. Meet the specialists - Curated Button */}
        <section className="px-6 py-40 bg-[#191a2d]">
           <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="space-y-6">
                 <h2 className="text-5xl md:text-7xl font-manrope font-extrabold tracking-tighter italic uppercase text-[#f0e0d0] leading-none">
                    Meet the <br/><span className="text-zinc-600">Specialists.</span>
                 </h2>
                 <p className="text-lg text-zinc-500 italic max-w-sm">Every guide on our platform is hand-vetted for this specific vertical.</p>
              </div>
              <Link href={`/specialists?category=${data.category}`}>
                 <button className="group h-24 px-20 rounded-full bg-white text-black font-black uppercase tracking-widest text-[10px] flex items-center gap-6 hover:bg-[#d3c4b5] transition-all overflow-hidden relative">
                    <span className="relative z-10 transition-transform group-hover:-translate-x-2">View Verified Index</span>
                    <Search className="relative z-10 w-5 h-5 transition-transform group-hover:scale-125" />
                 </button>
              </Link>
           </div>
        </section>

        {/* 6b. Featured Specialists */}
        <FeaturedSpecialists specialists={specialists} category={data.category} />

        {/* 7. Why families choose Insighte */}
        <section className="px-6 py-40 max-w-4xl mx-auto">
           <div className="text-center space-y-24">
              <h2 className="text-5xl font-manrope font-extrabold tracking-tighter italic uppercase text-[#f0e0d0]">
                 Why Families <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d3c4b5] to-[#baccb3]">Choose Insighte.</span>
              </h2>
              
              <div className="flex flex-wrap justify-center gap-y-12 gap-x-24">
                 {data.whyChooseInsighte.map((item, idx) => (
                   <div key={idx} className="flex flex-col items-center gap-4 group">
                      <div className="h-14 w-14 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10 group-hover:bg-[#baccb3]/10 group-hover:border-[#baccb3]/30 transition-all">
                         <Star className="w-6 h-6 text-[#baccb3]" />
                      </div>
                      <span className="text-sm font-black uppercase tracking-widest italic">{item}</span>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* 8. FAQs */}
        <section className="px-6 py-40 bg-[#1d1e31]/40 border-t border-white/5">
           <div className="max-w-3xl mx-auto space-y-20">
              <div className="text-center space-y-6">
                 <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#c8c4db] italic">Clinical Consensus</span>
                 <h2 className="text-5xl font-manrope font-extrabold tracking-tighter italic uppercase">Common <br/><span className="text-zinc-600">Questions.</span></h2>
              </div>
              
              <div className="space-y-6">
                 {data.faqs.map((faq, idx) => (
                   <div key={idx} className="group vessel bg-[#111224]/80 p-10 rounded-[3rem] border border-white/5 hover:border-[#c8c4db]/20 transition-all">
                      <div className="flex justify-between items-start gap-8 mb-4">
                         <h4 className="text-xl font-manrope font-extrabold tracking-tight italic uppercase group-hover:text-white transition-colors">{faq.q}</h4>
                      </div>
                      <p className="text-zinc-500 italic leading-relaxed text-sm">{faq.a}</p>
                   </div>
                 ))}
              </div>
           </div>
        </section>

        {/* 9. Final CTA */}
        <section className="px-6 py-64 text-center max-w-5xl mx-auto relative overflow-hidden">
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[#d3c4b5]/5 blur-[150px] -z-10 rounded-full"></div>
           
           <div className="space-y-16 relative z-10 animate-fade-in-up">
              <h2 className="text-6xl md:text-9xl font-manrope font-extrabold tracking-tighter leading-[0.8] italic uppercase mb-16">
                 Choose the <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d3c4b5] via-[#f0e0d0] to-[#baccb3]">Vetted Path.</span>
              </h2>
              <div className="flex flex-col md:flex-row justify-center gap-8">
                 <Link href={`/specialists?category=${data.category}`}>
                    <button className="h-24 px-16 rounded-full bg-[#d3c4b5] text-[#111224] font-black uppercase tracking-[0.2em] text-xs hover:shadow-glow shadow-[#d3c4b5]/30 hover:scale-105 transition-all">
                       Find a Specialist
                    </button>
                 </Link>
                 <button className="h-24 px-16 rounded-full bg-white/5 text-white font-black uppercase tracking-[0.2em] text-xs border border-white/10 hover:bg-white/20 transition-all flex items-center justify-center gap-4">
                    Speak to Our Team <MessageSquare className="w-5 h-5" />
                 </button>
              </div>
              <p className="text-xs text-zinc-600 font-bold uppercase tracking-[0.4em] pt-12">Clinical navigation support available locally.</p>
           </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
