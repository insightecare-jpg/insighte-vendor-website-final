import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { getProviderBySlug } from "@/lib/actions/admin";
import ProfileClient from "@/app/specialists/[id]/ProfileClient";
import { notFound } from "next/navigation";
import { TestimonialsSection } from "@/components/ui/testimonials-section";
import { ArrowRight } from "lucide-react";
export default async function ProviderProfilePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const provider = await getProviderBySlug(slug);

  if (!provider) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#111224] text-white">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 pt-28 md:pt-32 pb-32">
        {/* Back Navigation */}
        <Link href="/specialists" className="inline-flex items-center gap-2 mb-8 text-sm font-medium text-[#c8c5cd] hover:text-white transition-colors group">
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
          ← Back to results
        </Link>

        <ProfileClient provider={provider} />

        {/* ═══════════════════ TESTIMONIALS ═══════════════════ */}
        <div className="mt-20 border-t border-white/5 pt-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-4xl font-extrabold font-manrope text-white mb-4">
              What parents are saying
            </h2>
            <p className="text-[#c8c5cd] max-w-2xl mx-auto">
              Real experiences from families who found the right support through Insighte.
            </p>
          </div>
          <TestimonialsSection />
        </div>

        {/* ═══════════════════ BOTTOM CTA ═══════════════════ */}
        <section className="max-w-4xl mx-auto mt-16 mb-4">
          <div className="relative rounded-3xl md:rounded-[3rem] overflow-hidden min-h-[350px] flex items-center justify-center p-8 md:p-16 text-center border border-white/5 bg-[#191a2d]/40">
            <div className="absolute inset-0 bg-gradient-to-br from-[#1d1e31] via-[#191a2d] to-[#0b0c1f] -z-10" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[40%] bg-[#d3c4b5]/8 blur-[100px] rounded-full -z-10" />
            
            <div className="relative z-10 max-w-2xl space-y-8">
              <h2 className="text-3xl md:text-5xl font-extrabold font-manrope text-[#f0e0d0] tracking-tight leading-tight">
                Ready to take the next step?
              </h2>
              <p className="text-lg text-[#c8c5cd] max-w-lg mx-auto">
                Book a session with {provider.name.split(' ')[0]} today and start seeing the difference.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href={`/book?provider_id=${provider.id}`} className="cta-primary">
                  Book Session Now
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/book" className="cta-secondary">
                  Talk to our Care Team First
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
