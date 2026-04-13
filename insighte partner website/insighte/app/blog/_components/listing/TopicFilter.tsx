"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface TopicFilterProps {
  topics: string[];
  activeTopic: string;
  onTopicChange: (topic: string) => void;
}

export function TopicFilter({ topics, activeTopic, onTopicChange }: TopicFilterProps) {
  return (
    <div className="w-full overflow-x-auto no-scrollbar pb-4 -mx-6 px-6">
      <div className="flex items-center gap-3 min-w-max">
        <button
          onClick={() => onTopicChange("all")}
          className={cn(
            "px-6 h-10 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap",
            activeTopic === "all"
              ? "bg-[#D3C4B5]/10 border-[#D3C4B5] text-[#D3C4B5]"
              : "bg-white/5 border-white/5 text-zinc-500 hover:border-white/20"
          )}
        >
          All topics
        </button>
        {topics.map((topic) => (
          <button
            key={topic}
            onClick={() => onTopicChange(topic)}
            className={cn(
              "px-6 h-10 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all whitespace-nowrap",
              activeTopic === topic
                ? "bg-[#D3C4B5]/10 border-[#D3C4B5] text-[#D3C4B5]"
                : "bg-white/5 border-white/5 text-zinc-500 hover:border-white/20"
            )}
          >
            {topic}
          </button>
        ))}
      </div>
    </div>
  );
}
