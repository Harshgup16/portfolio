"use client";

import { useEffect, useState } from "react";
import { Marquee as MarqueeContainer, MarqueeContent, MarqueeItem, MarqueeFade } from "@/components/ui/marquee";

const technologies = [
  "AI/ML",
  "LLMs",
  "GenAI",
  "Python",
  "FastAPI",
  "React",
  "Next.js",
  "MongoDB",
  "TensorFlow",
  "PyTorch",
  "LangChain",
  "RAG",
  "OpenCV",
];

export default function Marquee() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <MarqueeContainer className="bg-black text-white py-6 md:py-8 border-y border-black/10">
      <MarqueeFade side="left" className="from-black to-transparent w-32" />
      <MarqueeFade side="right" className="from-black to-transparent w-32" />
      
      <MarqueeContent autoFill={true} speed={60} className="overflow-hidden">
        {technologies.map((tech, index) => (
          <MarqueeItem key={index} className="flex gap-12 md:gap-16 mx-6 md:mx-8">
            <span className="text-3xl md:text-7/2xl font-bold tracking-widest">{tech}</span>
            <span className="text-3xl md:text-7/2xl font-bold opacity-80">✽</span>
          </MarqueeItem>
        ))}
      </MarqueeContent>
    </MarqueeContainer>
  );
}