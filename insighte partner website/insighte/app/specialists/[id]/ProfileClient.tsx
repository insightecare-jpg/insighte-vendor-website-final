"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { 
  Heart, 
  MapPin, 
  Star, 
  ShieldCheck, 
  Clock, 
  Quote,
  Sparkles,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronDown,
  GraduationCap,
  Briefcase,
  Plus,
  User
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

function Accordion({ title, icon, children, defaultOpen = false }: { title: string, icon: React.ReactNode, children: React.ReactNode, defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="bg-[#191a2d]/60 rounded-2xl border border-white/5 overflow-hidden">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-14 px-6 flex items-center justify-between group transition-colors hover:bg-white/5"
      >
        <div className="flex items-center gap-3">
          <div className="text-[#baccb3]">{icon}</div>
          <span className="text-xs font-bold text-[#c8c5cd]">{title}</span>
        </div>
        <ChevronDown className={cn("h-4 w-4 text-zinc-600 transition-transform duration-400", isOpen && "rotate-180 text-white")} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} 
            className="px-6 pb-6"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProfileClient({ provider }: { provider: any }) {
  const [serviceFilter, setServiceFilter] = useState("All");

  const services = provider.services || [];
  const reviews = provider.reviews || [];
  const slots = provider.slots || [];
  const allTags = Array.from(new Set([
    ...(provider.specializations || provider.specialisations || []),
    ...(provider.category ? [provider.category] : [])
  ]));
  const price = provider.first_session_price || provider.consultation_fee || provider.rate || (services?.[0]?.price) || "450";
  const bookings = provider.booking_count || provider.total_bookings || 120;
  const filterCategories = ["All", "1:1 Call", "Priority DM", "Digital Product", "Package"];
  const filteredServices = serviceFilter === "All" ? services : services.filter((s: any) => s.type === serviceFilter);

  return (
    <div className="max-w-6xl mx-auto">

      {/* ═══ ABOVE-THE-FOLD HERO ═══ */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-16">
        
        {/* Left: Photo + Quick Stats */}
        <div className="lg:col-span-4 space-y-6">
          <div className="relative w-full aspect-square max-w-[320px] mx-auto lg:mx-0 rounded-3xl overflow-hidden border-2 border-white/5 bg-[#191a2d]">
            {(() => {
              const category = (provider.category || provider.provider_type || "").toLowerCase();
              let fallback = "/images/experts/special_educator.png";
              if (category.includes("speech")) fallback = "/images/experts/speech_therapist.png";
              else if (category.includes("autism") || category.includes("aba")) fallback = "/images/experts/autism_specialist.png";
              else if (category.includes("counsel") || category.includes("behavior")) fallback = "/images/experts/behavioral_specialist.png";
              
              return (
                <Image
                  src={provider.avatar_url || provider.profile_image || fallback}
                  fill
                  alt={provider.name}
                  sizes="(max-width: 768px) 100vw, 320px"
                  priority
                  className="object-cover"
                />
              );
            })()}
            {provider.verified !== false && (
              <div className="absolute top-4 right-4 bg-[#baccb3] p-2 rounded-xl shadow-lg">
                <ShieldCheck className="w-4 h-4 text-[#111224]" />
              </div>
            )}
          </div>
        </div>
        
        {/* Right: Key Decision Info */}
        <div className="lg:col-span-8 flex flex-col justify-center space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Badge className="bg-[#baccb3]/10 text-[#baccb3] border-none rounded-full px-4 py-1 text-[10px] font-bold">
                <ShieldCheck className="w-3 h-3 mr-1" /> Verified
              </Badge>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-[#d3c4b5] fill-[#d3c4b5]" />
                <span className="text-sm font-bold text-white">{provider.rating || "4.9"}</span>
                <span className="text-xs text-[#c8c5cd]">({reviews.length || "50"}+ reviews)</span>
              </div>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold font-manrope tracking-tight text-white mb-2">{provider.name}</h1>
            <p className="text-base text-[#d3c4b5] font-medium">{provider.category || "Care Specialist"}</p>
          </div>
          
          {/* Quick Facts Row */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-[#c8c5cd]">
            {provider.experience_years && (
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-[#baccb3]" /> {provider.experience_years}+ years experience
              </span>
            )}
            <span className="flex items-center gap-1.5">
              <Check className="w-4 h-4 text-[#baccb3]" /> {bookings}+ families supported
            </span>
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#d3c4b5]" /> {provider.city || "Bangalore"} {provider.mode && `• ${provider.mode}`}
            </span>
          </div>

          {/* Specialization Tags */}
          <div className="flex flex-wrap gap-2">
            {allTags.slice(0, 6).map(tag => (
              <span key={tag as string} className="px-3.5 py-1.5 rounded-lg bg-white/5 border border-white/5 text-xs font-bold text-[#c8c5cd]">
                {tag as string}
              </span>
            ))}
          </div>

          {/* Price + CTA */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-4 border-t border-white/5">
            <div>
              <p className="text-xs text-[#c8c5cd] mb-1">From</p>
              <span className="text-3xl font-extrabold text-white">₹{price}</span>
              <span className="text-sm text-[#c8c5cd]">/session</span>
            </div>
            <div className="flex items-center gap-3 flex-1 w-full sm:w-auto">
              <Link href={`/book/${provider.id}`} className="flex-1 sm:flex-initial">

                <Button className="w-full sm:w-auto h-14 px-10 rounded-full bg-[#d3c4b5] text-[#382f24] font-bold text-sm hover:bg-white transition-all shadow-xl shadow-[#d3c4b5]/10 active:scale-95 flex items-center gap-3">
                  Book Session <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <span className="text-xs text-[#baccb3] flex items-center gap-1.5 whitespace-nowrap">
                <Clock className="w-3.5 h-3.5" /> Available today
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ BELOW THE FOLD ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: About, Approach, Credentials */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* About */}
          <div className="bg-[#191a2d]/60 rounded-2xl border border-white/5 p-8 shadow-xl">
            <h2 className="text-xl font-bold font-manrope text-white mb-4 italic">About</h2>
            <p className="text-[#c8c5cd] leading-relaxed italic">
              {provider.about || provider.bio || `${provider.name} is a dedicated specialist who works with children and families using evidence-based, neuro-affirming methods.`}
            </p>
          </div>

          {/* Approach */}
          <div className="bg-[#191a2d]/60 rounded-2xl border border-white/5 p-8 shadow-xl">
            <h2 className="text-xl font-bold font-manrope text-white mb-4 italic">Approach</h2>
            {provider.approach ? (
              <p className="text-[#c8c5cd] leading-relaxed italic whitespace-pre-line">{provider.approach}</p>
            ) : (
              <ul className="space-y-3 text-[#c8c5cd] italic">
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-[#baccb3] mt-1 shrink-0" />
                  <span>Play-based, child-centered methods that make sessions engaging</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-[#baccb3] mt-1 shrink-0" />
                  <span>Neuro-affirming practice that celebrates how your child learns</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-[#baccb3] mt-1 shrink-0" />
                  <span>Regular progress updates so you always know what's working</span>
                </li>
              </ul>
            )}
          </div>

          {/* Parent Outcomes (Insights Analyzer) */}
          <div className="vessel bg-[#191a2d]/60 rounded-2xl border border-white/5 p-8 shadow-2xl">
            <h2 className="text-xl font-bold font-manrope text-white mb-6 italic flex items-center gap-3">
               <Sparkles className="h-5 w-5 text-[#D3C4B5]" />
               What parents report after sessions
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(provider.parent_insights || [
                "Improved communication and social skills",
                "Better focus and attention at school",
                "Reduced anxiety and emotional regulation",
                "More confidence in daily activities",
                "Stronger family understanding and support",
                "Measurable progress milestones every month"
              ]).map((outcome: string, i: number) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/5 text-sm text-[#c8c5cd] italic">
                   <CheckCircle2 className="w-4 h-4 text-[#baccb3] shrink-0" />
                   <span>{outcome}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Credentials */}
          <Accordion title="Education & Credentials" icon={<GraduationCap className="h-4 w-4" />}>
            <div className="space-y-4 pt-3">
              {(provider.academic_experience || []).length > 0 ? (
                provider.academic_experience.map((edu: any, i: number) => (
                  <div key={i} className="border-l-2 border-[#baccb3]/20 pl-4 space-y-0.5">
                    <p className="text-sm font-bold text-white uppercase italic">{edu.degree}</p>
                    <p className="text-xs text-[#c8c5cd]">{edu.school} • {edu.year}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-zinc-600 italic">Credentials pending verification</p>
              )}
            </div>
          </Accordion>

          <Accordion title="Work Experience" icon={<Briefcase className="h-4 w-4" />}>
            <div className="space-y-4 pt-3">
              {(provider.professional_experience || []).length > 0 ? (
                provider.professional_experience.map((work: any, i: number) => (
                  <div key={i} className="border-l-2 border-[#d3c4b5]/20 pl-4 space-y-0.5">
                    <p className="text-sm font-bold text-white uppercase italic">{work.role}</p>
                    <p className="text-xs text-[#c8c5cd]">{work.company} • {work.duration}</p>
                  </div>
                ))
              ) : (
                <p className="text-xs text-zinc-600 italic">Experience details pending</p>
              )}
            </div>
          </Accordion>
        </div>

        {/* Right Column: Services, Reviews, Booking */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Services */}
          <div className="bg-[#191a2d]/60 rounded-2xl border border-white/5 p-6">
            <h2 className="text-lg font-bold font-manrope text-white mb-4">Services & Pricing</h2>
            <div className="flex flex-wrap gap-2 mb-5">
              {filterCategories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setServiceFilter(cat)}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all",
                    serviceFilter === cat
                      ? "bg-[#baccb3] text-[#111224]"
                      : "bg-white/5 text-[#c8c5cd] hover:bg-white/10"
                  )}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="space-y-3">
              {filteredServices.length === 0 ? (
                <p className="text-sm text-zinc-600 py-6 text-center italic">No services listed in this category</p>
              ) : (
                filteredServices.map((service: any) => (
                  <div key={service.id} className="bg-white/5 rounded-xl p-5 border border-white/5 hover:border-[#d3c4b5]/20 transition-all group">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <Badge className="bg-[#d3c4b5]/10 text-[#d3c4b5] border-none mb-2 text-[9px] font-bold rounded-md px-2 py-0.5">
                          {service.type}
                        </Badge>
                        <h3 className="text-base font-bold text-white leading-tight">{service.title}</h3>
                      </div>
                      <span className="text-xl font-extrabold text-white shrink-0 ml-4">₹{service.price}</span>
                    </div>
                    <p className="text-xs text-[#c8c5cd] leading-relaxed mb-3 line-clamp-2">
                      {service.description || "Book a personalized session"}
                    </p>
                    <Link href={`/book/${provider.id}?service_id=${service.id}`}>

                      <Button size="sm" className="w-full h-10 bg-[#d3c4b5] text-[#382f24] rounded-lg text-xs font-bold hover:bg-white transition-all active:scale-95">
                        Book This Session <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </Button>
                    </Link>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Reviews */}
          <div className="bg-[#191a2d]/60 rounded-2xl border border-white/5 p-6">
            <h2 className="text-lg font-bold font-manrope text-white mb-4">
              Reviews <span className="text-sm font-normal text-[#c8c5cd]">({reviews.length || "0"})</span>
            </h2>
            <div className="space-y-4">
              {reviews.length === 0 ? (
                <p className="text-sm text-zinc-600 py-4 text-center italic">No reviews yet — be the first!</p>
              ) : (
                reviews.slice(0, 4).map((rev: any) => (
                  <div key={rev.id} className="bg-white/5 rounded-xl p-5 border border-white/5">
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="h-3.5 w-3.5 text-[#d3c4b5] fill-current" />
                      ))}
                    </div>
                    <p className="text-sm text-[#c8c5cd] leading-relaxed mb-3 line-clamp-3">"{rev.content}"</p>
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-full bg-[#d3c4b5]/10 flex items-center justify-center text-xs font-bold text-[#d3c4b5]">
                        {rev.parent_name?.[0] || "P"}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-white">{rev.parent_name}</p>
                        <p className="text-[10px] text-zinc-600">Verified Parent</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Booking CTA (Sticky on Mobile) */}
          <div className="bg-gradient-to-br from-[#d3c4b5]/10 to-[#baccb3]/10 rounded-2xl border border-[#d3c4b5]/20 p-8 text-center space-y-4">
            <h3 className="text-xl font-bold font-manrope text-[#f0e0d0]">Ready to start?</h3>
            <p className="text-sm text-[#c8c5cd]">Book a session with {provider.name.split(' ')[0]} and take the first step.</p>
            <Link href={`/book/${provider.id}`}>

              <Button className="w-full h-14 rounded-full bg-[#d3c4b5] text-[#382f24] font-bold text-sm hover:bg-white transition-all shadow-xl shadow-[#d3c4b5]/15 active:scale-95 flex items-center justify-center gap-3">
                Book Session Now <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Available Slots */}
          {slots.length > 0 && (
            <div className="bg-[#191a2d]/60 rounded-2xl border border-white/5 p-6">
              <h2 className="text-lg font-bold font-manrope text-white mb-4">Available This Week</h2>
              <div className="grid grid-cols-2 gap-3">
                {slots.map((slot: any) => {
                  const startTime = slot.start_time ? new Date(slot.start_time) : null;
                  const isValidDate = startTime && !isNaN(startTime.getTime());
                  
                  if (!isValidDate) return null;

                  return (
                    <Link key={slot.id} href={`/book/${provider.id}?slot_id=${slot.id}`}>

                      <button className="w-full flex flex-col items-center p-4 rounded-xl bg-white/5 border border-white/5 hover:border-[#baccb3]/30 hover:bg-[#baccb3]/5 transition-all">
                        <span className="text-[10px] font-bold text-[#c8c5cd]">
                          {startTime.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })}
                        </span>
                        <span className="text-lg font-bold text-white mt-1">
                          {startTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true })}
                        </span>
                      </button>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ═══ MOBILE STICKY BOOK BAR ═══ */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-4 py-3 bg-[#111224]/95 backdrop-blur-2xl border-t border-white/5 flex items-center justify-between">
        <div>
          <p className="text-lg font-bold text-white">₹{price}<span className="text-xs text-[#c8c5cd] font-normal">/session</span></p>
          <p className="text-[10px] text-[#baccb3] flex items-center gap-1"><Clock className="w-3 h-3" /> Available today</p>
        </div>
        <Link href={`/book/${provider.id}`}>

          <Button className="h-12 px-8 rounded-full bg-[#d3c4b5] text-[#382f24] font-bold text-sm hover:bg-white active:scale-95 shadow-lg">
            Book Now
          </Button>
        </Link>
      </div>
    </div>
  );
}
