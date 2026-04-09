"use client";

import { motion } from "framer-motion";
import { Search, MapPin, Star, ArrowRight, ShieldCheck, Heart } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#FAFAF9] text-[#1F2937] font-sans selection:bg-indigo-600 selection:text-white">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background Depth Elements */}
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-indigo-100/30 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-[20%] right-[-5%] w-[35%] h-[35%] bg-rose-100/30 rounded-full blur-[100px] -z-10" />

        <div className="max-auto max-w-7xl relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-10"
            >
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/50 backdrop-blur-md rounded-full border border-indigo-100 shadow-sm animate-float">
                <span className="flex h-2 w-2 rounded-full bg-indigo-600" />
                <span className="text-sm font-medium text-indigo-900 tracking-tight">Vetted Care Professionals</span>
              </div>

              <h1 className="text-6xl md:text-8xl font-extrabold tracking-[-0.03em] leading-[0.9] text-primary">
                Gentle care for <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-indigo-400">every family.</span>
              </h1>

              <p className="text-xl md:text-2xl text-text-secondary max-w-xl leading-relaxed text-balance">
                The Insighte Care Platform matches your family with trusted therapists, shadow teachers, and educators. Connection before correction.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:shadow-float active:scale-95 transition-all duration-300">
                  Find a Professional
                </button>
                <button className="px-8 py-4 bg-white/70 backdrop-blur-xl border border-indigo-100 text-indigo-900 rounded-2xl font-bold text-lg hover:bg-white active:scale-95 transition-all duration-300">
                  How it Works
                </button>
              </div>

              <div className="flex items-center space-x-12 pt-12 border-t border-indigo-100">
                <div className="flex flex-col">
                  <span className="text-4xl font-black text-indigo-900 leading-none tracking-tight">500+</span>
                  <span className="text-sm font-semibold uppercase tracking-widest text-[#6B7280] pt-1">Families Served</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-4xl font-black text-indigo-900 leading-none tracking-tight">98%</span>
                  <span className="text-sm font-semibold uppercase tracking-widest text-[#6B7280] pt-1">Parent Trust</span>
                </div>
              </div>
            </motion.div>

            {/* Right Card / Visual */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
              className="relative"
            >
              <div className="relative z-10 p-8 glass-dark rounded-5xl border border-white/10 overflow-hidden min-h-[500px] flex flex-col justify-between group cursor-grab active:cursor-grabbing">
                {/* Floating "Next Session" Trust Card */}
                <div className="absolute top-8 left-8 p-4 bg-white/90 backdrop-blur-xl rounded-3xl border border-white shadow-float max-w-xs animate-float">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-600 font-bold text-xl">
                      TR
                    </div>
                    <div>
                      <p className="text-sm font-bold text-indigo-950">Next Session with Trisha</p>
                      <p className="text-xs font-semibold text-indigo-600 uppercase tracking-widest">Tomorrow at 4PM</p>
                    </div>
                  </div>
                </div>

                <div className="pt-40">
                  <h3 className="text-4xl font-bold text-white leading-tight">Vetted professionals across India.</h3>
                  <p className="text-lg text-white/70 mt-4 leading-relaxed tracking-wide">
                    Internal partners, external experts, and premium Royale educators are all vatted by our world-class medical team.
                  </p>
                </div>

                <div className="flex space-x-4 pt-10 overflow-x-auto pb-4 custom-scrollbar">
                  {["Occupational Therapy", "Shadow Teaching", "Educators", "Speech Therapy"].map((tag) => (
                    <span key={tag} className="px-5 py-2 whitespace-nowrap bg-white/10 backdrop-blur-md rounded-full text-white font-semibold border border-white/5 text-sm uppercase tracking-wider">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Discovery Section Pre-fetch */}
      <section className="py-24 bg-white px-6">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
            <div className="space-y-4">
              <h2 className="text-5xl font-extrabold tracking-tight text-indigo-950 leading-[1.1]">Recommended for you.</h2>
              <p className="text-xl text-text-secondary max-w-2xl">Vetted by Insighte Clinical Directors for your specific needs.</p>
            </div>
            <button className="hidden md:flex items-center space-x-2 px-6 py-3 bg-indigo-50 text-indigo-600 rounded-2xl font-bold hover:bg-indigo-100 transition-all active:scale-95 group">
              <span>View All Professionals</span>
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Nitya S.", role: "Special Educator", rating: 4.8, price: "₹1,200", city: "Bangalore" },
              { name: "Arjun K.", role: "Shadow Teacher", rating: 4.9, price: "₹15,000 / mo", city: "Mumbai" },
              { name: "Meera V.", role: "OT Specialist", rating: 5.0, price: "₹1,500", city: "Gurgaon" },
            ].map((provider, i) => (
              <motion.div 
                key={provider.name}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * i }}
                className="group relative bg-[#F9FAFB] rounded-4xl p-1 overflow-hidden transition-all duration-500 hover:ring-2 hover:ring-indigo-200/50"
              >
                <div className="aspect-[4/3] bg-indigo-900 relative rounded-[calc(2.5rem-4px)] overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                  <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                    <div>
                      <p className="text-white font-bold text-2xl tracking-tight">{provider.name}</p>
                      <p className="text-white/80 font-bold text-sm uppercase tracking-widest">{provider.role}</p>
                    </div>
                    <div className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full flex items-center gap-1 border border-white/20">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-white text-xs font-bold">{provider.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center gap-2 text-[#6B7280]">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm font-bold tracking-wide">{provider.city}</span>
                  </div>
                  <div className="flex items-center justify-between items-center">
                    <span className="text-xl font-black text-indigo-950">{provider.price}</span>
                    <button className="h-10 w-10 bg-white shadow-sm border border-indigo-100 rounded-xl flex items-center justify-center text-indigo-600 hover:bg-indigo-600 hover:text-white transition-colors">
                      <ArrowRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Elements */}
       <section className="py-20 bg-indigo-950 text-white px-6">
        <div className="mx-auto max-w-7xl">
          <div className="grid md:grid-cols-4 gap-12 text-center md:text-left">
            <div className="space-y-4">
              <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto md:mx-0">
                <ShieldCheck className="h-7 w-7 text-indigo-400" />
              </div>
              <h4 className="text-xl font-bold">Vetted Profiles</h4>
              <p className="text-white/60 font-medium tracking-wide">Multi-step identity and background verification by independent agencies.</p>
            </div>
            <div className="space-y-4">
              <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto md:mx-0">
                <Star className="h-7 w-7 text-indigo-400" />
              </div>
              <h4 className="text-xl font-bold">100% Quality Bar</h4>
              <p className="text-white/60 font-medium tracking-wide">Periodic reviews and clinical audits to maintain premium service standards.</p>
            </div>
            <div className="space-y-4">
              <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto md:mx-0">
                <Heart className="h-7 w-7 text-indigo-400" />
              </div>
              <h4 className="text-xl font-bold">Zero Hard Failures</h4>
              <p className="text-white/60 font-medium tracking-wide">UI and communication designed to reduce anxiety and increase progress.</p>
            </div>
            <div className="space-y-4">
              <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto md:mx-0">
                <MapPin className="h-7 w-7 text-indigo-400" />
              </div>
              <h4 className="text-xl font-bold">At-Home Excellence</h4>
              <p className="text-white/60 font-medium tracking-wide">Shadow teachers and therapists delivered directly to your front door.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer / Contact Band */}
      <footer className="py-12 px-6 border-t border-indigo-100 bg-[#FAFAF9]">
        <div className="mx-auto max-w-7xl flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start space-y-2">
            <span className="text-2xl font-black tracking-tighter text-indigo-950 uppercase italic">INSIGHTE</span>
            <p className="text-xs font-bold text-[#6B7280] tracking-widest uppercase mb-1">Empowering Neuro-inclusive India</p>
          </div>
          <div className="flex gap-10">
            {["Terms", "Privacy", "Support"].map(link => (
              <a key={link} href="#" className="text-sm font-black text-indigo-950 uppercase tracking-widest hover:text-indigo-600 transition-colors">
                {link}
              </a>
            ))}
          </div>
          <p className="text-sm font-bold text-[#6B7280]">© 2026 Insighte. All rights reserved.</p>
        </div>
      </footer>
    </main>
  );
}
