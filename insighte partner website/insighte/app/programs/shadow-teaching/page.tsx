"use client";

import React from "react";
import ProgramTemplate from "@/components/programs/ProgramTemplate";

export default function ShadowTeachingProgram() {
  return (
    <ProgramTemplate 
      title="Shadow Teaching"
      subtitle="The Inclusion Bridge"
      heroImage="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2844&auto=format&fit=crop"
      accentColor="#8b7ff0"
      description="Professional classroom support specialists who work alongside your child in mainstream schools, facilitating social and academic learning without singling them out."
      services={[
        "Classroom Accommodations",
        "Social Scripting & Cues",
        "Sensory Break Management",
        "Peer Advocacy & Inclusion",
        "Modified Lesson Delivery",
        "Behavioral Support"
      ]}
      features={[
        {
          title: "IEP-Aligned Implementation",
          description: "Our shadows don't just 'watch'—they execute specific goals defined in your child's Individualized Education Plan."
        },
        {
          title: "The 'Invisible' Support Model",
          description: "We use fading techniques to ensure the child gains independence and doesn't become shadow-dependent."
        },
        {
          title: "Teacher-Parent Syncing",
          description: "We act as the clinical bridge between the school classroom and the home therapy team."
        },
        {
          title: "Social Emotional Learning (SEL)",
          description: "Direct on-ground support for navigating playground dynamics and classroom social hierarchies."
        }
      ]}
      process={[
        "School Observation Visit",
        "Collaboration with Teachers",
        "Shadow Matching & Placement",
        "Quarterly Review Meetings"
      ]}
      benefits={[
        {
          title: "Radical School Inclusion",
          description: "Enables children with divergent profiles to thrive in mainstream academic environments."
        },
        {
          title: "Academic Momentum",
          description: "Bridges the gap between classroom speed and individual processing needs."
        },
        {
          title: "Safety & Regulation",
          description: "Proactive management of sensory triggers before they lead to classroom meltdowns."
        }
      ]}
      experts={[
        { name: "Anjali S.", role: "Lead Shadow Mentor", impact: "15+ Schools Certified", image: "https://i.pravatar.cc/300?u=anjali" },
        { name: "Vikram K.", role: "Special Educator", impact: "Mainstream Inclusion Spec.", image: "https://i.pravatar.cc/300?u=vikram" },
        { name: "Megha P.", role: "Behavioral Assist", impact: "ADHD Support Expert", image: "https://i.pravatar.cc/300?u=megha" }
      ]}
    />
  );
}
