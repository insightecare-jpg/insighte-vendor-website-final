"use client";

import React from "react";
import ProgramTemplate from "@/components/programs/ProgramTemplate";

export default function HomecareProgram() {
  return (
    <ProgramTemplate 
      title="Home Therapy"
      subtitle="Sanctuary in Environment"
      heroImage="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=3040&auto=format&fit=crop"
      accentColor="#1d9e75"
      description="Personalized neuro-affirming therapy (Special Ed, ABA, Speech) delivered in the comfort and safety of your own home, engineered for family progress."
      services={[
        "Applied Behavior Analysis (ABA)",
        "Occupational Therapy (OT)",
        "Speech & Language Pathology",
        "Sensory Diet Integration",
        "Special Education Support",
        "Behavioral Modification"
      ]}
      features={[
        {
          title: "Real-time Data Transparency",
          description: "End-of-session reports delivered instantly via the Insighte App, tracking every developmental milestone."
        },
        {
          title: "Clinical Senior Oversight",
          description: "Every home intervention is supervised by a BCBA or Clinical Lead to ensure technical accuracy."
        },
        {
          title: "Environmental Optimization",
          description: "We don't just teach the child; we help you set up home environments that reduce sensory triggers."
        },
        {
          title: "Family-Centric Coaching",
          description: "We empower parents with the same tools our therapists use, ensuring support continues after we leave."
        }
      ]}
      process={[
        "Clinical Discovery Call",
        "Home Environment Audit",
        "IEP Design & Launch",
        "Bi-weekly Progress Reviews"
      ]}
      benefits={[
        {
          title: "Reduced Transition Anxiety",
          description: "Eliminate the stress of clinic commutes. Therapy happens where the child is most comfortable."
        },
        {
          title: "Naturalistic Generalization",
          description: "Skills learned in the actual home environment stick better and transfer to daily life instantly."
        },
        {
          title: "Intensive 1:1 Density",
          description: "Focused attention without the distractions of a multi-child clinic setting."
        }
      ]}
      experts={[
        { name: "Saritha V.", role: "Senior ABA Therapist", impact: "800+ Hours Home Support", image: "https://i.pravatar.cc/300?u=saritha" },
        { name: "Rahul M.", role: "Speech Pathologist", impact: "Early Language Spec.", image: "https://i.pravatar.cc/300?u=rahul" },
        { name: "Priya D.", role: "Occupational Therapist", impact: "Sensory Integration Expert", image: "https://i.pravatar.cc/300?u=priya" }
      ]}
    />
  );
}
