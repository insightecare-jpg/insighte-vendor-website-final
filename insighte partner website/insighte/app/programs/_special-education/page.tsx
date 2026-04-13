"use client";

import React from "react";
import ProgramTemplate from "@/components/programs/ProgramTemplate";

export default function SpecialEducationProgram() {
  return (
    <ProgramTemplate 
      title="Special Ed"
      subtitle="The Learning Blueprint"
      heroImage="https://images.unsplash.com/photo-1576091160550-217359f4ecf8?q=80&w=2940&auto=format&fit=crop"
      accentColor="#5DCAA5"
      description="Identifying specific learning needs through clinical diagnostics and creating actionable, personalized learning strategies that bridge the gap between potential and performance."
      services={[
        "Diagnostic Assessments",
        "Remedial Education",
        "IEP Design & Mentorship",
        "Literacy & Numeracy Support",
        "Study Skills Coaching",
        "School Accommodation Planning"
      ]}
      features={[
        {
          title: "Multi-sensory Instruction",
          description: "We use Orton-Gillingham and other evidence-based pathways to teach children who learn differently."
        },
        {
          title: "Strengths-Based IEPs",
          description: "Our learning plans focus on the child's leverage points, not just their deficits."
        },
        {
          title: "Adaptive Tech Integration",
          description: "Training in tools that help with dyslexia, dysgraphia, and processing delays."
        },
        {
          title: "Transition Readiness",
          description: "Preparing students for board exams (NIOS, IGCSE) and college transitions."
        }
      ]}
      process={[
        "Baseline Cognitive Review",
        "Strategy Development",
        "Weekly Implementation",
        "Monthly Progress Mapping"
      ]}
      benefits={[
        {
          title: "Academic Confidence",
          description: "When children understand *how* they learn, they stop feeling 'stupid' and start feeling capable."
        },
        {
          title: "Clear Developmental Roadmaps",
          description: "Parents get a granular monthly view of exactly where the learning gaps are closing."
        },
        {
          title: "Reduced Homework Friction",
          description: "Strategies that make after-school work more efficient and less combative."
        }
      ]}
      experts={[
        { name: "Kavita B.", role: "Senior Special Educator", impact: "Dyslexia Specialist", image: "https://i.pravatar.cc/300?u=kavita" },
        { name: "Deepak S.", role: "LD Consultant", impact: "NIOS/IGCSE Advisor", image: "https://i.pravatar.cc/300?u=deepak" },
        { name: "Rina M.", role: "Remedial Instructor", impact: "Multi-sensory Teaching", image: "https://i.pravatar.cc/300?u=rina" }
      ]}
    />
  );
}
