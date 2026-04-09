import { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ArrowRight, Star, MapPin, ShieldCheck, Clock } from "lucide-react";

// ─── SERVICE METADATA ────────────────────────────────────────────────────────

const SERVICES: Record<string, {
  slug: string;
  icon: string;
  name: string;
  tagline: string;
  description: string;
  color: string;
  accentBg: string;
  accent: string;
  specialists: number;
  seoTitle: string;
  seoDescription: string;
  faqs: { q: string; a: string }[];
  whenToSeek: string[];
  cities: string[];
}> = {
  "speech-therapy": {
    slug: "speech-therapy",
    icon: "🗣️",
    name: "Speech & Language Therapy",
    tagline: "Helping children communicate with confidence",
    description: "Our speech-language pathologists work with children who have speech delays, stuttering, late talking, articulation disorders, and language processing challenges. Early intervention leads to the best outcomes.",
    color: "rgba(139,127,240,0.12)",
    accentBg: "rgba(139,127,240,0.08)",
    accent: "#c5b8f8",
    specialists: 48,
    seoTitle: "Speech Therapist in Bangalore | Speech & Language Therapy for Children",
    seoDescription: "Find verified speech therapists and language specialists for children in Bangalore, Delhi, and online. Covering speech delays, stuttering, late talkers, and more.",
    whenToSeek: [
      "Your child isn't saying single words by 12–15 months",
      "Your child's speech is hard to understand after age 3",
      "Your child stutters frequently",
      "Your child struggles to follow simple instructions",
      "Your child has been diagnosed with autism or hearing loss",
    ],
    faqs: [
      { q: "When should I see a speech therapist?", a: "If your child isn't meeting typical language milestones or if you have any concerns about their communication, a professional assessment is a great first step. Earlier is always better." },
      { q: "How long does speech therapy take?", a: "Duration varies. Many children show significant progress within 3–6 months of weekly sessions. The therapist will create a personalized plan after an initial assessment." },
      { q: "Is online speech therapy effective?", a: "Yes! Research shows telehealth speech therapy is just as effective as in-person for many goals, especially for older children who can engage well on screen." },
    ],
    cities: ["Bangalore", "Delhi", "Kerala", "Whitefield", "Indiranagar", "Koramangala"],
  },
  "academic-tutoring": {
    slug: "academic-tutoring",
    icon: "📐",
    name: "Academic Tutoring",
    tagline: "Bridging learning gaps, building lasting confidence",
    description: "Expert tutors covering CBSE, ICSE, and IB curricula — from primary foundations to board exams. We match your child with a tutor who understands their learning style, not just the syllabus.",
    color: "rgba(24,95,165,0.12)",
    accentBg: "rgba(24,95,165,0.08)",
    accent: "#85B7EB",
    specialists: 134,
    seoTitle: "Math Tutor & Academic Tutoring in Bangalore | CBSE, ICSE, IB",
    seoDescription: "Find expert academic tutors in Bangalore for CBSE, ICSE, and IB students. Maths, Science, English, and more. In-home, online, and centre-based sessions.",
    whenToSeek: [
      "Your child is falling behind in key subjects",
      "Exam scores are dropping despite effort",
      "Your child loses motivation to study",
      "Switching from CBSE to IB or vice versa",
      "Preparing for board exams or entrance tests",
    ],
    faqs: [
      { q: "How do I find the right tutor for my child?", a: "We match based on your child's curriculum, learning style, gaps, and schedule. You can also filter by board (CBSE/ICSE/IB) and subject." },
      { q: "Do tutors come home?", a: "Yes. Many tutors on Insighte offer home visits (especially in Bangalore). You can also choose online sessions for flexibility." },
      { q: "Are group or 1:1 sessions available?", a: "Both. Individual sessions are most effective for targeted support, while small groups work well for enrichment and exam prep." },
    ],
    cities: ["Bangalore", "HSR Layout", "Whitefield", "Delhi", "Koramangala", "Jayanagar"],
  },
  "autism-support": {
    slug: "autism-support",
    icon: "🧩",
    name: "Autism & Neurodiversity Support",
    tagline: "Celebrating every way a mind can work",
    description: "Specialists in ABA therapy, early intervention, ESDM, and sensory integration — combined with a neuro-affirming approach that honours your child's strengths while building essential life skills.",
    color: "rgba(29,158,117,0.12)",
    accentBg: "rgba(29,158,117,0.08)",
    accent: "#5DCAA5",
    specialists: 31,
    seoTitle: "Autism Support Specialist in Bangalore | ABA, Early Intervention, Sensory",
    seoDescription: "Find autism & neurodiversity specialists in Bangalore and online. Covering ABA therapy, early intervention, ADHD, sensory processing, and inclusive education support.",
    whenToSeek: [
      "Your child has received an autism diagnosis",
      "You're noticing signs of sensory sensitivities",
      "Your child has difficulty with social interaction",
      "You want a second opinion on a developmental concern",
      "You need support navigating the school system",
    ],
    faqs: [
      { q: "What is ABA therapy?", a: "Applied Behavior Analysis (ABA) is an evidence-based approach that helps children with autism develop communication, social, and daily living skills through positive reinforcement." },
      { q: "Is diagnosis required before booking?", a: "No. Many families book a developmental assessment first. Our specialists can work with or without a formal diagnosis." },
      { q: "Do you support ADHD as well?", a: "Yes. Many of our neurodiversity specialists work with ADHD, dyslexia, and other learning differences alongside autism." },
    ],
    cities: ["Bangalore", "Delhi", "Online", "Koramangala", "Whitefield", "HSR Layout"],
  },
  "child-counselling": {
    slug: "child-counselling",
    icon: "💬",
    name: "Child Counselling",
    tagline: "Safe space for young minds to grow",
    description: "Child psychologists and counsellors supporting anxiety, school refusal, emotional regulation, grief, trauma, and family transitions. Evidence-based approaches, tailored to each child's age and needs.",
    color: "rgba(216,90,48,0.12)",
    accentBg: "rgba(216,90,48,0.08)",
    accent: "#F0997B",
    specialists: 57,
    seoTitle: "Child Psychologist & Counsellor in Bangalore | Anxiety, Behaviour, Emotions",
    seoDescription: "Find verified child psychologists and counsellors in Bangalore and online. Supporting anxiety, school refusal, emotional challenges, ADHD, and family transitions.",
    whenToSeek: [
      "Your child is experiencing persistent anxiety or worry",
      "School refusal or avoidance has become a pattern",
      "Your child has gone through a significant life change",
      "Emotional outbursts are affecting family life",
      "Your child seems withdrawn or sad for extended periods",
    ],
    faqs: [
      { q: "How is child counselling different from therapy?", a: "The terms are often used interchangeably. Child counsellors focus on emotional wellbeing and coping skills, while child psychologists also conduct assessments and diagnoses." },
      { q: "Do parents attend sessions?", a: "It varies. For younger children, parents are often involved. For adolescents, privacy and trust are prioritised. Your specialist will recommend the best approach." },
      { q: "Is online counselling appropriate for children?", a: "Yes, particularly for older children and adolescents. Young children typically do better with in-person sessions." },
    ],
    cities: ["Bangalore", "Delhi", "Online", "Jayanagar", "Indiranagar"],
  },
  "arts-enrichment": {
    slug: "arts-enrichment",
    icon: "🎨",
    name: "Arts, Music & Drama",
    tagline: "Creative expression for holistic development",
    description: "Music teachers, drama coaches, visual arts instructors, and dance educators — fostering creativity, self-expression, and confidence in children of all ages.",
    color: "rgba(186,117,23,0.12)",
    accentBg: "rgba(186,117,23,0.08)",
    accent: "#EF9F27",
    specialists: 62,
    seoTitle: "Music, Arts & Drama Classes for Children in Bangalore",
    seoDescription: "Find music teachers, drama coaches, and art tutors for children in Bangalore. Carnatic, Western, dance, visual arts, and theatre — for ages 3 and up.",
    whenToSeek: [
      "Your child shows interest in music, art, or performance",
      "You want to develop your child's creativity and expression",
      "Your child needs a confidence boost through arts",
      "Looking for structured music exams (Trinity, ABRSM, etc.)",
      "Your child has sensory needs that respond well to music",
    ],
    faqs: [
      { q: "What age can children start music lessons?", a: "Children as young as 3 can begin with simple music exploration. Formal instrument lessons typically start around 5–6." },
      { q: "What styles of music do you offer?", a: "Both Western and Indian classical (Carnatic, Hindustani). Plus contemporary styles including guitar, keyboard, Bollywood vocals, and more." },
      { q: "Can arts therapy help children with special needs?", a: "Yes. Music therapy and drama therapy are evidence-based interventions used with autism, ADHD, trauma, and anxiety." },
    ],
    cities: ["Bangalore", "Koramangala", "Jayanagar", "Online"],
  },
  "sports-development": {
    slug: "sports-development",
    icon: "🏅",
    name: "Sports & Physical Development",
    tagline: "Building bodies, building minds",
    description: "Certified sports coaches, fitness trainers, and adaptive PE specialists working with children on motor development, fitness, team sports, and physical confidence.",
    color: "rgba(59,109,17,0.12)",
    accentBg: "rgba(59,109,17,0.08)",
    accent: "#97C459",
    specialists: 19,
    seoTitle: "Sports Coach & Physical Development for Children in Bangalore",
    seoDescription: "Find certified sports coaches and physical development specialists for children in Bangalore. Motor skills, adaptive PE, fitness, and team sports for ages 3–18.",
    whenToSeek: [
      "Your child has delayed motor development milestones",
      "Your child lacks confidence in physical activity",
      "Looking for structured sports coaching",
      "Your child has physical disabilities or special needs",
      "Preparing for school sports competitions",
    ],
    faqs: [
      { q: "What is adaptive physical education?", a: "Adaptive PE is a modified physical education program for children with disabilities, ensuring they can participate safely and benefit from physical activity." },
      { q: "Can coaches come to our home?", a: "Yes. Many coaches offer home visits, particularly for younger children working on fundamental movement skills." },
      { q: "At what age should children start structured sport?", a: "Fundamental movement skills (running, jumping, throwing) should be developed from ages 3–6. Structured team sports typically suit children from age 6–8." },
    ],
    cities: ["Bangalore", "Delhi", "Whitefield", "HSR Layout"],
  },
  "college-counselling": {
    slug: "college-counselling",
    icon: "🎓",
    name: "College & Career Counselling",
    tagline: "Navigate admissions with clarity and confidence",
    description: "Expert counsellors for US/UK university admissions, IIT-JEE strategy, NEET preparation, stream selection, and long-term career mapping.",
    color: "rgba(139,127,240,0.12)",
    accentBg: "rgba(139,127,240,0.08)",
    accent: "#c5b8f8",
    specialists: 23,
    seoTitle: "College Counsellor in Bangalore | US/UK Admissions, IIT-JEE, Career Guidance",
    seoDescription: "Find expert college and career counsellors in Bangalore. US/UK university admissions, IIT-JEE, NEET, stream selection, and career mapping for Class 9–12 students.",
    whenToSeek: [
      "Your child is in Class 9–12 and unsure about stream or career",
      "You're targeting US/UK university admissions",
      "Your child needs IIT-JEE or NEET strategy guidance",
      "College applications feel overwhelming",
      "Your child needs essay coaching and interview prep",
    ],
    faqs: [
      { q: "When should we start college counselling?", a: "Ideally in Class 10–11 for Indian admissions, and Class 9–10 for international universities (especially US). Early planning maximises options." },
      { q: "Do you help with scholarship applications?", a: "Yes. Our counsellors can guide you through merit-based scholarships, need-based aid applications, and essay writing for both Indian and international institutions." },
      { q: "What universities have your students gotten into?", a: "Our counsellors have helped students gain admission to IITs, NITs, Oxford, Cambridge, NUS, and Ivy League universities." },
    ],
    cities: ["Bangalore", "Delhi", "Online", "Koramangala"],
  },
  "occupational-therapy": {
    slug: "occupational-therapy",
    icon: "🧬",
    name: "Occupational Therapy",
    tagline: "Building skills for everyday independence",
    description: "Paediatric occupational therapists supporting fine motor skills, sensory processing, self-care, school readiness, and daily living activities for children of all abilities.",
    color: "rgba(24,95,165,0.12)",
    accentBg: "rgba(24,95,165,0.08)",
    accent: "#85B7EB",
    specialists: 26,
    seoTitle: "Occupational Therapist for Children in Bangalore | Sensory, Fine Motor, ADL",
    seoDescription: "Find paediatric occupational therapists in Bangalore and online. Supporting sensory processing, fine motor skills, school readiness, and daily living skills.",
    whenToSeek: [
      "Your child has difficulty with writing or self-care tasks",
      "Sensory sensitivities are affecting daily life",
      "Your child struggles with focus or sitting still",
      "Fine motor or gross motor delays are present",
      "Your child has autism, ADHD, or cerebral palsy",
    ],
    faqs: [
      { q: "What does an occupational therapist do for children?", a: "OTs help children build the skills they need to participate in daily activities — from handwriting and self-dressing to managing sensory sensitivities and improving attention." },
      { q: "How do you know if my child needs OT?", a: "Common signs include difficulty with fine motor tasks, sensory over- or under-sensitivity, trouble with self-care, or poor organisation and attention." },
      { q: "Can occupational therapy be done at home?", a: "Yes. Home-based OT is highly effective as it allows the therapist to work within the child's natural environment, making skills more transferable." },
    ],
    cities: ["Bangalore", "Indiranagar", "Whitefield", "Delhi", "Online"],
  },
};

// ─── GENERATE METADATA ───────────────────────────────────────────────────────

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const svc = SERVICES[slug];
  if (!svc) return { title: "Service | Insighte" };
  return {
    title: svc.seoTitle,
    description: svc.seoDescription,
    keywords: [`${svc.name} Bangalore`, `child specialist India`, `${svc.slug.replace(/-/g, " ")} near me`],
    openGraph: {
      title: svc.seoTitle,
      description: svc.seoDescription,
      type: "website",
    },
  };
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const svc = SERVICES[slug];

  if (!svc) {
    return (
      <div style={{ background: "#0d0f1a", minHeight: "100vh", color: "#e8e2d8" }}>
        <Navbar />
        <div className="flex flex-col items-center justify-center py-40 text-center px-6">
          <h1 style={{ fontSize: 32, color: "#f0ece4", marginBottom: 12 }}>Service not found</h1>
          <p style={{ color: "#5a5466", marginBottom: 24 }}>We couldn't find the service you're looking for.</p>
          <Link
            href="/specialists"
            style={{ color: "#8b7ff0", textDecoration: "none", fontSize: 14 }}
          >
            Browse all specialists →
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ background: "#0d0f1a", minHeight: "100vh", color: "#e8e2d8", fontFamily: "'DM Sans', 'Inter', sans-serif" }}>
      <Navbar />

      <main style={{ paddingTop: 96, paddingBottom: 80 }}>

        {/* ─── HERO ─── */}
        <section
          style={{
            maxWidth: 900,
            margin: "0 auto",
            padding: "48px 24px 60px",
            textAlign: "center",
            position: "relative",
          }}
        >
          {/* Glow */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: "50%",
              transform: "translateX(-50%)",
              width: 500,
              height: 300,
              background: "radial-gradient(ellipse, rgba(139,127,240,0.1) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />

          {/* Breadcrumb */}
          <div style={{ marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 12, color: "#5a5466" }}>
            <Link href="/" style={{ color: "#5a5466", textDecoration: "none" }}>Home</Link>
            <span>›</span>
            <Link href="/specialists" style={{ color: "#5a5466", textDecoration: "none" }}>Services</Link>
            <span>›</span>
            <span style={{ color: "#8a8591" }}>{svc.name}</span>
          </div>

          {/* Icon */}
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              background: svc.color,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 36,
              margin: "0 auto 24px",
            }}
          >
            {svc.icon}
          </div>

          {/* Badge */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(255,255,255,0.06)",
              border: "0.5px solid rgba(255,255,255,0.12)",
              borderRadius: 100,
              padding: "4px 14px",
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: svc.accent,
              marginBottom: 20,
            }}
          >
            {svc.specialists} verified specialists
          </div>

          <h1
            style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
              fontSize: "clamp(32px, 5vw, 52px)",
              color: "#f0ece4",
              lineHeight: 1.15,
              marginBottom: 16,
            }}
          >
            {svc.name}
          </h1>
          <p
            style={{
              fontSize: "clamp(14px, 2vw, 17px)",
              color: "#8a8591",
              maxWidth: 560,
              margin: "0 auto 32px",
              lineHeight: 1.65,
            }}
          >
            {svc.description}
          </p>

          {/* City pills */}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 8, marginBottom: 32 }}>
            {svc.cities.map((city) => (
              <span
                key={city}
                style={{
                  fontSize: 11,
                  padding: "4px 12px",
                  borderRadius: 100,
                  background: "rgba(255,255,255,0.04)",
                  border: "0.5px solid rgba(255,255,255,0.1)",
                  color: "#8a8591",
                }}
              >
                📍 {city}
              </span>
            ))}
          </div>

          {/* CTA */}
          <Link
            href={`/specialists?category=${encodeURIComponent(svc.name)}`}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "#e8e2d8",
              color: "#0d0f1a",
              borderRadius: 100,
              padding: "14px 32px",
              fontSize: 14,
              fontWeight: 600,
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            Find {svc.name} Specialists →
          </Link>
        </section>

        {/* ─── WHEN TO SEEK ─── */}
        <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 48px" }}>
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "0.5px solid rgba(255,255,255,0.08)",
              borderRadius: 16,
              padding: "32px 28px",
            }}
          >
            <h2
              style={{
                fontFamily: "'DM Serif Display', Georgia, serif",
                fontSize: "clamp(22px, 3vw, 28px)",
                color: "#f0ece4",
                marginBottom: 20,
              }}
            >
              Signs your child may need support
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {svc.whenToSeek.map((sign, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 12,
                    padding: "12px 0",
                    borderBottom: i < svc.whenToSeek.length - 1 ? "0.5px solid rgba(255,255,255,0.06)" : "none",
                  }}
                >
                  <div
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: "50%",
                      background: svc.accentBg,
                      border: `0.5px solid ${svc.accent}40`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    <span style={{ fontSize: 10, color: svc.accent }}>✓</span>
                  </div>
                  <span style={{ fontSize: 14, color: "#c8c2d0", lineHeight: 1.5 }}>{sign}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ─── FAQS ─── */}
        <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 60px" }}>
          <h2
            style={{
              fontFamily: "'DM Serif Display', Georgia, serif",
              fontSize: "clamp(22px, 3vw, 28px)",
              color: "#f0ece4",
              marginBottom: 20,
            }}
          >
            Frequently asked questions
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {svc.faqs.map((faq, i) => (
              <div
                key={i}
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "0.5px solid rgba(255,255,255,0.08)",
                  borderRadius: 12,
                  padding: "20px 24px",
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 600, color: "#e0daea", marginBottom: 8 }}>
                  {faq.q}
                </div>
                <div style={{ fontSize: 13, color: "#6b6475", lineHeight: 1.6 }}>{faq.a}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ─── BOTTOM CTA ─── */}
        <section style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px" }}>
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "0.5px solid rgba(255,255,255,0.08)",
              borderRadius: 16,
              padding: "40px 32px",
              textAlign: "center",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: "10%",
                right: "10%",
                height: 1,
                background: `linear-gradient(90deg, transparent, ${svc.accent}60, transparent)`,
              }}
            />
            <h2
              style={{
                fontFamily: "'DM Serif Display', Georgia, serif",
                fontSize: "clamp(22px, 3vw, 30px)",
                color: "#f0ece4",
                marginBottom: 12,
              }}
            >
              Ready to find the right {svc.name.toLowerCase()} specialist?
            </h2>
            <p style={{ fontSize: 14, color: "#5a5466", marginBottom: 28 }}>
              Browse {svc.specialists} verified experts matched to your child's needs and location.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <Link
                href={`/specialists?category=${encodeURIComponent(svc.name)}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "#e8e2d8",
                  color: "#0d0f1a",
                  borderRadius: 100,
                  padding: "12px 24px",
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Browse Specialists →
              </Link>
              <Link
                href="/book"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  background: "transparent",
                  color: svc.accent,
                  border: `0.5px solid ${svc.accent}40`,
                  borderRadius: 100,
                  padding: "12px 24px",
                  fontSize: 13,
                  fontWeight: 600,
                  textDecoration: "none",
                }}
              >
                Get a Recommendation (Free)
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
