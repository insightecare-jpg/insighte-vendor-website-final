import React from "react";
import GuidedTriageClient from "@/components/triage/GuidedTriageClient";

export const metadata = {
  title: "Guided Triage | Insighte",
  description: "Find the right specialist for your child tailored to your requirements.",
};

export default function TriagePage() {
  return <GuidedTriageClient />;
}
