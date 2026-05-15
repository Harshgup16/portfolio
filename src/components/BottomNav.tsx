"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Logo from "./Logo";
import { useAudio } from "./AudioProvider";

export default function BottomNav() {
  const navRef = useRef<HTMLDivElement>(null);
  const { isPlaying, togglePlay } = useAudio();
  const [currentDate, setCurrentDate] = useState("AUGUST 2024—NOW");

  useEffect(() => {
    const date = new Date();
    
    // Force date to exactly match India Standard Time (IST)
    const formatter = new Intl.DateTimeFormat('en-IN', {
      timeZone: 'Asia/Kolkata',
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
    
    const parts = formatter.formatToParts(date);
    const day = parts.find(p => p.type === 'day')?.value || '01';
    const month = parts.find(p => p.type === 'month')?.value || 'Jan';
    const year = parts.find(p => p.type === 'year')?.value || '2024';
    
    setCurrentDate(`${day}'${month} ${year}—NOW`);
  }, []);



  return (
    <div 
      ref={navRef} 
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center"
    >
      <div className="nav-item flex items-center space-x-2 mb-2 text-black">
        <div className="w-0 h-0 border-l-[5px] border-l-transparent border-t-[8px] border-t-black border-r-[5px] border-r-transparent"></div>
        <span className="font-sans font-medium uppercase text-[10px] md:text-[11px] tracking-[0.2em] font-semibold">{currentDate}</span>
      </div>

      <div className="flex items-stretch h-auto min-h-[40px] md:min-h-[48px] text-white font-sans text-[10px] md:text-[12px] uppercase tracking-widest gap-0.5">
        
        <Link 
          href="/"
          className="nav-item shadow-lg relative bg-[#a02128] flex items-center justify-center w-12 md:w-16 px-2 py-2 cursor-pointer"
        >
          <div className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-white/60"></div>
          <div className="absolute top-1 right-1 w-1.5 h-1.5 border-t border-r border-white/60"></div>
          <div className="absolute bottom-1 left-1 w-1.5 h-1.5 border-b border-l border-white/60"></div>
          <div className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r border-white/60"></div>
          <Logo filled className="w-5 h-5 md:w-6 md:h-6" />
        </Link>

        <div 
          className="nav-item shadow-lg relative bg-[#a02128] flex items-center justify-center px-5 py-2 md:px-8 gap-3 cursor-pointer"
          onClick={togglePlay}
        >
          <div className="absolute top-1 left-1 w-1.5 h-1.5 border-t border-l border-white/60"></div>
          <div className="absolute top-1 right-1 w-1.5 h-1.5 border-t border-r border-white/60"></div>
          <div className="absolute bottom-1 left-1 w-1.5 h-1.5 border-b border-l border-white/60"></div>
          <div className="absolute bottom-1 right-1 w-1.5 h-1.5 border-b border-r border-white/60"></div>
          <span>Sound</span>
          
          {/* Animated Record Player (Uiverse) */}
          <div className="w-8 h-8 rounded-[2px] relative flex items-center justify-center transform scale-[0.85] md:scale-100 origin-center">
            {/* Plate */}
            <div className={`flex items-center justify-center w-[28px] h-[28px] bg-[#111] rounded-full shadow-md ${isPlaying ? 'animate-[spin_2s_linear_infinite]' : ''}`}>
              <div className="flex items-center justify-center w-[20px] h-[20px] rounded-full border-[1px] border-t-white/80 border-b-white/80 border-l-[#111] border-r-[#111]">
                <div className="flex items-center justify-center w-[12px] h-[12px] bg-white rounded-full">
                  <div className="w-[4px] h-[4px] bg-[#111] rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Player Arm */}
            <div className="absolute bottom-[2px] right-[2px] flex flex-col items-center justify-center -rotate-45 w-[5px] h-[14px]">
              <div className="w-[5px] h-[5px] bg-white rounded-full z-10 absolute top-0 shadow-sm"></div>
              <div className="w-[2px] h-[11px] bg-white absolute bottom-0 shadow-sm"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
