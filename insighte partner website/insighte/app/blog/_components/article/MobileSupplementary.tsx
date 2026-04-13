"use client";

import React, { useState } from "react";
import { ChevronDown, Music, ListCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface MobileSupplementaryProps {
  children: React.ReactNode;
  label: string;
  icon: React.ReactNode;
}

export function MobileSupplementary({ children, label, icon }: MobileSupplementaryProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-t border-white/5 last:border-b last:border-white/5">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-6 flex items-center justify-between group"
      >
        <div className="flex items-center gap-3">
          <div className="text-accent">{icon}</div>
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/60 group-hover:text-white transition-colors">
            {label}
          </span>
        </div>
        <ChevronDown 
          size={16} 
          className={cn("text-zinc-500 transition-transform duration-300", isOpen && "rotate-180")} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="pb-8">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
