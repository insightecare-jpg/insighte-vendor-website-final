import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find Certified Therapists & Child Specialists",
  description: "Browse verified speech therapists, occupational therapists, behavioral specialists, and special educators. Verified by Insighte.",
  openGraph: {
    title: "Find Certified Therapists & Child Specialists | Insighte",
    description: "Verified experts for speech, behavior, and occupational therapy. Matched to your child's needs.",
  }
};

export default function SpecialistsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
