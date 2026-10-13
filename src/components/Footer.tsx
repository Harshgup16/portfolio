"use client";

import React from "react";
import { useAudio } from "./AudioProvider";

export default function Footer() {
  const { playHover, playClick } = useAudio();

  return (
    <footer 
      id="reachout"
      className="relative w-full h-[60vh] md:h-[80vh]"
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      <div className="fixed bottom-0 w-full h-[60vh] md:h-[80vh] bg-[#141414] flex flex-col items-center justify-end overflow-hidden pb-8 md:pb-12">
        
        {/* Some text or links can go here in the future above the big logo */}
        <div className="flex-1 flex flex-col items-center justify-center text-[#e5e5e5] space-y-4">
          <p className="text-xl md:text-3xl font-serif italic">Let&apos;s build something great together.</p>
          <a
            href="mailto:hkgupta160420@gmail.com"
            onMouseEnter={playHover}
            onClick={playClick}
            className="text-sm md:text-base uppercase tracking-widest border-b border-[#e5e5e5]/30 pb-1 hover:border-[#e5e5e5] transition-colors"
          >
            Get in touch
          </a>
          
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 text-sm md:text-base font-semibold pt-4">
            <a
              href="https://www.linkedin.com/in/harshgup16/"
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={playHover}
              onClick={playClick}
              className="hover:text-gray-400 transition-colors"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/Harshgup16"
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={playHover}
              onClick={playClick}
              className="hover:text-gray-400 transition-colors"
            >
              GitHub
            </a>
            <a
              href="https://codeforces.com/"
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={playHover}
              onClick={playClick}
              className="hover:text-gray-400 transition-colors"
            >
              Codeforces
            </a>
            <a
              href="https://leetcode.com/"
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={playHover}
              onClick={playClick}
              className="hover:text-gray-400 transition-colors"
            >
              Leetcode
            </a>
          </div>
        </div>

        {/* The massive SVG Logo at the bottom */}
        <div className="w-[90%] md:w-[80%] max-w-7xl text-[#e5e5e5]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/footer.svg" alt="Harsh Gupta" className="w-full h-auto" />
        </div>

        <div className="absolute bottom-2 md:bottom-4 left-6 md:left-12 right-6 md:right-12 flex justify-between items-center text-base md:text-xl font-bold tracking-wide text-[#e5e5e5]">
          <span>&copy; 2026</span>
          <span>By ( Harsh Gupta )</span>
        </div>
      </div>
    </footer>
  );
}
