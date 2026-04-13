"use client";

import React, { useRef, useState, useEffect } from "react";
import { Play, Pause, FastForward, Rewind, Download, Volume2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface AudioPlayerProps {
  url: string;
  title: string;
}

export function AudioPlayer({ url, title }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) audioRef.current.pause();
      else audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleScrub = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const speeds = [0.8, 1, 1.25, 1.5, 2];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  return (
    <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-6">
      <audio 
        ref={audioRef} 
        src={url} 
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
      />
      
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent">
          <Volume2 size={16} />
        </div>
        <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Audio Companion</span>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={togglePlay}
            className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:bg-accent transition-colors shadow-lg"
          >
            {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} className="ml-1" fill="currentColor" />}
          </button>
          
          <div className="flex-grow space-y-1">
            <input 
              type="range"
              min="0"
              max={duration || 0}
              step="0.1"
              value={currentTime}
              onChange={handleScrub}
              className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-accent"
            />
            <div className="flex justify-between text-[10px] font-medium text-zinc-500 tabular-nums">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex gap-1.5">
            {speeds.map((s) => (
              <button
                key={s}
                onClick={() => setPlaybackRate(s)}
                className={cn(
                  "px-2.5 py-1 rounded-md text-[9px] font-bold border transition-all",
                  playbackRate === s 
                    ? "bg-white text-black border-white" 
                    : "bg-white/5 border-white/5 text-zinc-500 hover:border-white/10"
                )}
              >
                {s}x
              </button>
            ))}
          </div>

          <a 
            href={url} 
            download 
            className="p-2 rounded-full hover:bg-white/5 text-zinc-500 hover:text-white transition-colors"
          >
            <Download size={14} />
          </a>
        </div>
      </div>
    </div>
  );
}
