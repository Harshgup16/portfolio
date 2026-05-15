"use client";

import { useRef } from "react";
import { useLenis } from "lenis/react";
import HeroPortrait from "@/components/HeroPortrait";
import Marquee from "@/components/Marquee";
import Statement from "@/components/Statement";
import WhatWeDo from "@/components/WhatWeDo";
import PinnedGames from "@/components/PinnedGames";
import Spotlight from "@/components/Spotlight";
import RedMarquee from "@/components/RedMarquee";
import BentoGrid from "@/components/BentoGrid";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);

  // Use Lenis scroll callback for parallax — stays perfectly in sync
  // with smooth scrolling (no fighting between Lenis and Framer Motion).
  useLenis((lenis) => {
    if (!heroRef.current) return;
    const scroll = lenis.scroll;
    // Parallax: hero moves at 0.4x scroll speed (scrolls away slower)
    const y = Math.min(scroll * 0.4, 400);
    heroRef.current.style.transform = `translate3d(0, ${y}px, 0)`;
  });

  return (
    <main className="relative w-full overflow-x-hidden bg-black text-white">
      <section className="relative h-screen w-full">
        <div ref={heroRef} className="w-full h-full will-change-transform">
          <HeroPortrait />
        </div>
      </section>
      <div className="relative z-20 bg-black">
        <Marquee />
        <Statement />
        <WhatWeDo />
        <PinnedGames />
        <Spotlight />
        <RedMarquee />
        <BentoGrid />
      </div>
      <Footer />
      <BottomNav />
    </main>
  );
}
