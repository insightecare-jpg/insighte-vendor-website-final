"use client";

import React from "react";
import ProgramTemplate from "@/components/programs/ProgramTemplate";

export default function CounsellingProgram() {
  return (
    <ProgramTemplate 
      title="Counselling"
      subtitle="Psychological Resilience"
      heroImage="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=2787&auto=format&fit=crop"
      accentColor="#F0997B"
      description="Licensed child psychologists and developmental therapists helping with anxiety, school transitions, emotional regulation, and family dynamics using neuro-affirmative frameworks."
      services={[
        "Play-Based Therapy",
        "CBT for Adolescents",
        "Family Systems Counselling",
        "Trauma-Informed Care",
        "Anxiety Management",
        "Executive Function Coaching"
      ]}
      features={[
        {
          title: "Neuro-Affirmative Approach",
          description: "We don't try to 'cure' neurodivergence; we help build self-advocacy and emotional resilience within it."
        },
        {
          title: "Safe Disclosure Spaces",
          description: "A private, high-trust environment for children and teens to express what they cannot in school or social settings."
        },
        {
          title: "Therapeutic Continuity",
          description: "Our psychologists work with our shadows and OT team to ensure a 360-degree support ecosystem."
        },
        {
          title: "Parental Support Circles",
          description: "Dedicated sessions for parents to manage their own mental health and caregiver burnout."
        }
      ]}
      process={[
        "Initial Intake Interview",
        "Clinical Observation",
        "Therapeutic Goal Setting",
        "Ongoing Support Cycles"
      ]}
      benefits={[
        {
          title: "Emotional Regulation",
          description: "Equipping children with the internal tools to manage big feelings and sensory storms."
        },
        {
          title: "Improved Family Cohesion",
          description: "Helping parents and siblings understand and support the child's perspective more effectively."
        },
        {
          title: "Social Confidence",
          description: "Building the self-esteem necessary to navigate difficult social environments."
        }
      ]}
      experts={[
        { name: "Dr. Aruna R.", role: "Clinical Psychologist", impact: "Developmental Specialist", image: "https://i.pravatar.cc/300?u=aruna" },
        { name: "Kevin J.", role: "Adolescent Counselor", impact: "Teen Resilience Coach", image: "https://i.pravatar.cc/300?u=kevin" },
        { name: "Sofia L.", role: "Play Therapist", impact: "Early Emotional Support", image: "https://i.pravatar.cc/300?u=sofia" }
      ]}
    />
  );
}
