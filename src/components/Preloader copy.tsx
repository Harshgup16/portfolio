"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import Logo from "./Logo";
import { useAudio } from "./AudioProvider";

interface PreloaderProps {
  onComplete?: () => void;
}

// const words = ["Hello", "Bonjour", "Ciao", "Olà", "やあ", "Hallå", "Guten tag", "Hallo"];
const words = [
  "Welcome",
  "Bienvenue",      // French
  "Benvenuto",      // Italian
  "Bem-vindo",      // Portuguese
  "ようこそ",         // Japanese
  "Välkommen",      // Swedish
  "Willkommen",     // German
  "Welkom"          // Dutch
];


export default function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const logoRef = useRef<SVGSVGElement | null>(null);
  const logoWrapperRef = useRef<HTMLDivElement | null>(null);
  const textRef = useRef<HTMLParagraphElement | null>(null);
  const curveRef = useRef<SVGPathElement | null>(null);
  const hasAnimated = useRef(false);
  const [visible, setVisible] = useState(true);
  const [currentWord, setCurrentWord] = useState(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const { playMusic } = useAudio();

  useEffect(() => {
    setDimensions({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  useLayoutEffect(() => {
    // Prevent animation from running multiple times
    if (hasAnimated.current) return;

    const container = containerRef.current;
    const text = textRef.current;
    const curvePath = curveRef.current;
    
    if (!container || !text || !curvePath || dimensions.width === 0) return;

    // Wait a bit to ensure Logo is rendered
    const logoPath = logoRef.current?.querySelector("path") as SVGPathElement | null;
    
    if (!logoPath) {
      console.log("Logo path not found yet");
      return;
    }

    // Mark as animated
    hasAnimated.current = true;

    const logoLength = logoPath.getTotalLength();
    const { width, height } = dimensions;

    // Set up initial states
    gsap.set(logoPath, {
      strokeDasharray: logoLength,
      strokeDashoffset: logoLength,
      fill: "transparent",
      stroke: "#e3e4d8",
    });

    // ensure wrapper has neutral transform origin/scale
    if (logoWrapperRef.current) {
      gsap.set(logoWrapperRef.current, { scale: 1, transformOrigin: "50% 50%", opacity: 1 });
    }

    gsap.set(text, {
      opacity: 0,
      y: 20,
    });

    // Set up curve path
    const initialPath = `M0 0 L${width} 0 L${width} ${height} Q${width/2} ${height + 300} 0 ${height} L0 0`;
    const targetPath = `M0 0 L${width} 0 L${width} ${height} Q${width/2} ${height} 0 ${height} L0 0`;
    
    gsap.set(curvePath, {
      attr: { d: initialPath },
    });

    // Main timeline
    const tl = gsap.timeline({
      defaults: { ease: "power2.out" },
      onComplete: () => {
        setTimeout(() => {
          setVisible(false);
          playMusic();
          onComplete?.();
        }, 100);
      },
    });

    // Animate words cycling - slower transitions
    const wordTimeline = gsap.timeline({ repeat: 0 });
    words.forEach((_, index) => {
      if (index === 0) {
        wordTimeline.call(() => setCurrentWord(index), [], 0.5); // Start first word at 0.5s (when text fades in)
      } else {
        wordTimeline.call(() => setCurrentWord(index), [], "+=0.5");
      }
    });

    tl.set(container, { opacity: 1 })
      .to(text, { opacity: 1, y: 0, duration: 0.5 }, 0.5) // Text fades in at 0.5s
      .add(wordTimeline, 0.5) // Start word cycling at 0.5s (when text is visible)
      .to(logoPath, { strokeDashoffset: 0, duration: 2, ease: "power2.inOut" }, 0.5)
      .to(logoPath, { fill: "#e3e4d8", duration: 1, ease: "power2.out" }, "-=2.0")
      .to(text, { opacity: 0, y: -20, duration: 0.3 }, "-=0.5")
      .to(curvePath, {
        attr: { d: targetPath },
        duration: 0.7,
        ease: "cubic-bezier(0.76, 0, 0.24, 1)",
      }, "-=0.3");

    // After fill, scale the logo wrapper so it appears to zoom in and fill the screen, then fade out
    const logoRect = logoWrapperRef.current?.getBoundingClientRect();
    if (logoWrapperRef.current && logoRect) {
      const maxDim = Math.max(width, height);
      const logoMax = Math.max(logoRect.width, logoRect.height);
      const targetScale = Math.max(1, (maxDim / logoMax) * 5);

      tl.to(logoWrapperRef.current, {
        scale: targetScale,
        duration: 0.6,
        ease: "power2.in",
      }, "+=0.05")
        .to(container, { opacity: 0, duration: 0.4 }, "-=0.05");
    } else {
      // fallback: just fade out
      tl.to(container, { opacity: 0, duration: 0.4 }, "-=0.2");
    }

    return () => {
      tl.kill();
      wordTimeline.kill();
    };
  }, [onComplete, dimensions]);

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-60 flex items-center justify-center"
      style={{ backgroundColor: "#222", color: "#fff" }}
      aria-hidden={!visible}
    >
      <div className="flex flex-col items-center gap-8 relative z-10">
        <div className="p-6 opacity-0" ref={logoWrapperRef}>
          <Logo ref={logoRef} className="w-32 h-32 md:w-48 md:h-48" />
        </div>
        <p 
          ref={textRef}
          className="text-[#e3e4d8] text-2xl md:text-3xl font-light tracking-wide opacity-0 transform translate-y-5"
        >
          {words[currentWord]}
        </p>
      </div>
      
      {dimensions.width > 0 && (
        <svg className="fixed inset-0 w-full h-full pointer-events-none">
          <path 
            ref={curveRef}
            fill="black"
          />
        </svg>
      )}
    </div>
  );
}