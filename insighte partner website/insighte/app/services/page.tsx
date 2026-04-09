import React from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Image from "next/image";
import { Sparkles, Compass, BookOpen, Brain, Clock, Home, ArrowRight, ShieldCheck, Users, ChevronRight } from "lucide-react";
import { TestimonialsSection } from "@/components/ui/testimonials-section";
import { SchoolLogoScroll } from "@/components/ui/school-logo-scroll";
import { ProgramsGrid } from "@/components/ui/programs-grid";
import { ExploreVerticals } from "@/components/ui/explore-verticals";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export default async function ExploreServices() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
      },
    }
  );

  const { data: curations } = await supabase.from("curations").select("*");

  const getCurationByTitle = (title: string) => {
    return curations?.find(c => c.title === title);
  };

  const seedling = getCurationByTitle("The Seedling Sanctuary");
  const explorer = getCurationByTitle("The Explorer Pathway");
  const scholar = getCurationByTitle("The Scholar's Retreat");
  const neuro = getCurationByTitle("Neuro-Diverse Care");
  const flexible = getCurationByTitle("The Flexible Nest");
  const guidance = getCurationByTitle("Parental Guidance");

  return (
    <div className="bg-[#111224] text-[#e1e0fa] font-sans selection:bg-[#d3c4b5]/30">
      <Navbar />

      <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto relative overflow-hidden">
        {/* Background Accents */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-[#d3c4b5]/10 rounded-full blur-[120px]"></div>
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-[#c8c4db]/10 rounded-full blur-[100px]"></div>

        <header className="mb-24 text-center">
          <span className="text-[#baccb3] font-semibold tracking-[0.2em] uppercase text-sm mb-4 block">The Growth Journey</span>
          <h1 className="text-6xl md:text-8xl font-manrope font-extrabold tracking-tighter text-[#e1e0fa] leading-none mb-8 italic uppercase">
            Your Child's <br/><span className="text-zinc-600">Evolving Pathway</span>
          </h1>
          <p className="text-[#c8c5cd] text-xl max-w-2xl mx-auto leading-relaxed italic opacity-70">
            A sanctuary designed to transition with your family. Explore our vertical roadmap of specialized care and developmental programs.
          </p>
        </header>

        {/* School Partnership Logo Scroll */}
        <section className="mb-32">
          <SchoolLogoScroll />
        </section>

        {/* Explore Verticals Section */}
        <section className="mb-32 relative">
          <div className="flex flex-col items-center text-center mb-16 space-y-4">
            <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#BACCB3] italic">Service Spectrum</span>
            <h2 className="text-4xl md:text-7xl font-manrope font-extrabold tracking-tighter text-[#e1e0fa] leading-none mb-4 italic uppercase">
              Browse <span className="text-zinc-600">Verticals</span>
            </h2>
            <p className="text-zinc-500 max-w-xl text-sm font-medium italic mx-auto">
              Choose a clinical or educational domain to filter our network of specialists and programs tailored for your child's stage.
            </p>
          </div>
          <ExploreVerticals />
        </section>

        {/* Vertical Pathway Layout */}
        <div className="relative">
          {/* Central Line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-transparent via-[#d3c4b5]/80 to-transparent opacity-20 hidden lg:block"></div>
          
          <div className="space-y-48 relative">
            
            {/* Stage 1: The Seedling (Early Years) */}
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
              <div className="w-full lg:w-1/2 order-2 lg:order-1 lg:text-right">
                <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-[#baccb3]/10 text-[#baccb3] mb-6 lg:ml-auto">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Early Foundation</span>
                </div>
                <h2 className="text-5xl md:text-7xl font-manrope font-bold text-[#e1e0fa] mb-6 tracking-tighter">The Seedling Sanctuary</h2>
                <p className="text-[#c8c5cd] text-lg mb-8 leading-relaxed max-w-lg lg:ml-auto italic opacity-80">
                  Focused on sensory exploration and secure attachment. Our infant-led approach ensures your little one feels the warmth of a secondary home.
                </p>
                <div className="flex flex-wrap gap-3 lg:justify-end mb-10">
                  {["Infant Care", "Sensory Play", "Nurture Focus"].map(tag => (
                    <span key={tag} className="px-5 py-2.5 rounded-full bg-[#191A2D] text-zinc-400 text-[10px] font-black uppercase tracking-widest border border-white/5">{tag}</span>
                  ))}
                </div>
                {seedling && (
                  <Link href={`/checkout/curation/${seedling.id}`}>
                    <button className="bg-[#D3C4B5] text-[#382F24] px-10 py-5 rounded-full font-black uppercase tracking-widest text-[10px] hover:shadow-2xl transition-all active:scale-95 flex items-center gap-3 lg:ml-auto">
                      Unlock Pathway <ChevronRight className="w-4 h-4" />
                    </button>
                  </Link>
                )}
              </div>
              
              <div className="relative z-10 w-20 h-20 flex-shrink-0 flex items-center justify-center bg-[#111224] border-2 border-[#d3c4b5]/30 rounded-full shadow-[0_0_60px_rgba(211,196,181,0.1)] hidden lg:flex">
                <span className="text-[#d3c4b5] font-black italic">01</span>
              </div>
              
              <div className="w-full lg:w-1/2 order-1 lg:order-3">
                <div className="aspect-[16/10] rounded-[40px] overflow-hidden shadow-2xl relative group bg-[#1d1e31] border border-white/5">
                  <Image 
                    src="/services/seedling-sanctuary.png" 
                    alt="Seedling environment"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111224]/80 to-transparent opacity-60"></div>
                  <div className="absolute bottom-8 left-8">
                     <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D3C4B5] mb-1 opacity-70">Starting From</p>
                     <p className="text-4xl font-black font-manrope">₹{seedling?.price.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stage 2: The Explorer (Toddler) */}
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
              <div className="w-full lg:w-1/2 order-1">
                <div className="aspect-[16/10] rounded-[40px] overflow-hidden shadow-2xl relative group bg-[#1d1e31] border border-white/5">
                  <Image 
                    src="/services/explorer-pathway.png" 
                    alt="Explorer pathway"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111224]/80 to-transparent opacity-60"></div>
                  <div className="absolute bottom-8 right-8 text-right">
                     <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D3C4B5] mb-1 opacity-70">Transition Invest</p>
                     <p className="text-4xl font-black font-manrope">₹{explorer?.price.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              
              <div className="relative z-10 w-20 h-20 flex-shrink-0 flex items-center justify-center bg-[#111224] border-2 border-[#baccb3]/30 rounded-full shadow-[0_0_60px_rgba(186,204,179,0.1)] hidden lg:flex">
                <span className="text-[#baccb3] font-black italic">02</span>
              </div>
              
              <div className="w-full lg:w-1/2 order-2">
                <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-[#d3c4b5]/10 text-[#d3c4b5] mb-6">
                  <Compass className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Active Discovery</span>
                </div>
                <h2 className="text-5xl md:text-7xl font-manrope font-bold text-[#e1e0fa] mb-6 tracking-tighter">The Explorer Pathway</h2>
                <p className="text-[#c8c5cd] text-lg mb-8 leading-relaxed max-w-lg italic opacity-80">
                  Where curiosity meets capability. We encourage independent problem solving and social integration through guided play and artistic expression.
                </p>
                <div className="flex flex-wrap gap-3 mb-10">
                  {["Social Skills", "Artistic Flow", "Outdoor Discovery"].map(tag => (
                    <span key={tag} className="px-5 py-2.5 rounded-full bg-[#191A2D] text-zinc-400 text-[10px] font-black uppercase tracking-widest border border-white/5">{tag}</span>
                  ))}
                </div>
                {explorer && (
                  <Link href={`/checkout/curation/${explorer.id}`}>
                    <button className="bg-transparent border border-white/20 text-white hover:border-[#D3C4B5] hover:text-[#D3C4B5] px-10 py-5 rounded-full font-black uppercase tracking-widest text-[10px] transition-all active:scale-95 flex items-center gap-3">
                      Begin Journey <ChevronRight className="w-4 h-4" />
                    </button>
                  </Link>
                )}
              </div>
            </div>

            {/* Stage 3: The Scholar (Preschool) */}
            <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
              <div className="w-full lg:w-1/2 order-2 lg:order-1 lg:text-right">
                <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-[#c8c4db]/10 text-[#c8c4db] mb-6 lg:ml-auto">
                  <BookOpen className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Cognitive Ascent</span>
                </div>
                <h2 className="text-5xl md:text-7xl font-manrope font-bold text-[#e1e0fa] mb-6 tracking-tighter">The Scholar's Retreat</h2>
                <p className="text-[#c8c5cd] text-lg mb-8 leading-relaxed max-w-lg lg:ml-auto italic opacity-80">
                  Preparing the mind for future horizons. Our curriculum blends academic readiness with emotional intelligence, ensuring a confident transition to school.
                </p>
                <div className="flex flex-wrap gap-3 lg:justify-end mb-10">
                  {["Literacy Roots", "Logical Logic", "Leadership Labs"].map(tag => (
                    <span key={tag} className="px-5 py-2.5 rounded-full bg-[#191A2D] text-zinc-400 text-[10px] font-black uppercase tracking-widest border border-white/5">{tag}</span>
                  ))}
                </div>
                {scholar && (
                  <Link href={`/checkout/curation/${scholar.id}`}>
                    <button className="bg-[#c8c4db] text-[#1d1e31] px-10 py-5 rounded-full font-black uppercase tracking-widest text-[10px] hover:shadow-2xl transition-all active:scale-95 flex items-center gap-3 lg:ml-auto">
                      Initiate Ascent <ChevronRight className="w-4 h-4" />
                    </button>
                  </Link>
                )}
              </div>
              
              <div className="relative z-10 w-20 h-20 flex-shrink-0 flex items-center justify-center bg-[#111224] border-2 border-[#c8c4db]/30 rounded-full shadow-[0_0_60px_rgba(200,196,219,0.1)] hidden lg:flex">
                <span className="text-[#c8c4db] font-black italic">03</span>
              </div>
              
              <div className="w-full lg:w-1/2 order-1 lg:order-3">
                <div className="aspect-[16/10] rounded-[40px] overflow-hidden shadow-2xl relative group bg-[#1d1e31] border border-white/5">
                  <Image 
                    src="/services/scholar-retreat.png" 
                    alt="Scholar environment"
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-1000 scale-110 group-hover:scale-100" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111224]/80 to-transparent opacity-60"></div>
                  <div className="absolute bottom-8 left-8">
                     <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#D3C4B5] mb-1 opacity-70">Peak Support</p>
                     <p className="text-4xl font-black font-manrope">₹{scholar?.price.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Featured Programs Grid - Maven Style */}
        <section className="mt-64 relative">
          {/* Section Divider */}
          <div className="absolute -top-32 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          
          <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-6">
            <div className="max-w-xl">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#D3C4B5] mb-4 block">Specialized Verticals</span>
              <h3 className="text-6xl font-manrope font-extrabold text-[#e1e0fa] mb-6 tracking-tighter italic uppercase">Clinical <br/> <span className="text-zinc-600">Programs</span></h3>
              <p className="text-[#c8c5cd] leading-relaxed italic opacity-70">Highly targeted clinical pathways designed for specific developmental milestones and therapeutic outcomes.</p>
            </div>
            <Link href="/programs" className="flex items-center gap-3 text-[#d3c4b5] font-black uppercase tracking-widest text-[10px] hover:gap-6 transition-all border-b border-[#d3c4b5]/20 pb-2">
              View All Programs <ArrowRight className="w-5 h-5" />
            </Link>
          </div>

          <ProgramsGrid />
        </section>

        {/* Social Proof: Testimonials */}
        <section className="mt-64 relative">
          <div className="absolute -top-32 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
          <TestimonialsSection />
        </section>

        {/* CTA Section */}
        <section className="mt-64 relative rounded-[60px] overflow-hidden p-12 md:p-32 text-center border border-white/5">
          <div className="absolute inset-0 z-0">
             <div className="absolute inset-0 bg-[#0b0c1f] opacity-90"></div>
             <Image 
              src="/services/cta-bg.png" 
              alt="Nature background"
              fill
              sizes="100vw"
              className="object-cover grayscale opacity-20" 
            />
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-[#111224] to-transparent"></div>
          </div>
          
          <div className="relative z-10 max-w-4xl mx-auto space-y-12">
            <div className="space-y-4">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#BACCB3]">The Final Signal</span>
              <h2 className="text-6xl md:text-9xl font-manrope font-extrabold text-[#e1e0fa] tracking-tighter leading-none italic uppercase">
                Begin Their <br/> <span className="text-[#baccb3]">Ascent</span> Today
              </h2>
            </div>
            
            <p className="text-xl text-zinc-400 italic font-medium leading-relaxed max-w-2xl mx-auto">
              Schedule a private tour of our sanctuary and see how our pathways align with your child's unique potential.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-8 pt-8">
              <Link href="/book">
                 <button className="bg-[#d3c4b5] text-[#382f24] px-14 py-6 rounded-full font-black uppercase tracking-widest text-xs hover:shadow-[0_0_50px_rgba(211,196,181,0.3)] transition-all active:scale-95">
                   Book a Consultation
                 </button>
              </Link>
              <Link href="/specialists">
                 <button className="bg-white/5 backdrop-blur-xl text-white px-14 py-6 rounded-full font-black uppercase tracking-widest text-xs border border-white/10 hover:bg-white/10 transition-all active:scale-95">
                   View Our Architects
                 </button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
