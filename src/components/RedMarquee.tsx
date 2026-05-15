"use client";

import { useEffect, useState } from "react";
import { Marquee as MarqueeContainer, MarqueeContent, MarqueeItem, MarqueeFade } from "@/components/ui/marquee";

const words = [
  "ACCURACY",
  "PRECISION",
  "INNOVATION",
  "PERFORMANCE",
  "SCALABILITY",
  "INTELLIGENCE",
];

export default function RedMarquee() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <MarqueeContainer className="bg-[#a02128] text-white py-8 md:py-10">
      <MarqueeFade side="left" className="from-[#a02128] to-transparent w-32" />
      <MarqueeFade side="right" className="from-[#a02128] to-transparent w-32" />
      
      <MarqueeContent autoFill={true} speed={60} className="overflow-hidden">
        {words.map((word, index) => (
          <MarqueeItem key={index} className="flex gap-12 md:gap-16 mx-6 md:mx-8">
            <span className="text-4xl md:text-5xl font-bold tracking-widest">{word}</span>
            <span className="text-4xl md:text-5xl font-bold opacity-80">✽</span>
          </MarqueeItem>
        ))}
      </MarqueeContent>
    </MarqueeContainer>
  );
}
