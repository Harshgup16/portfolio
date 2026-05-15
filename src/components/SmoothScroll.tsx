"use client";

import { useEffect, useRef } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function LenisGSAPSync() {
  const lenisRef = useRef<ReturnType<typeof useLenis> | null>(null);

  // Get the Lenis instance
  lenisRef.current = useLenis((lenis) => {
    // Notify ScrollTrigger whenever Lenis scrolls
    ScrollTrigger.update();
  });

  useEffect(() => {
    // Sync Lenis with GSAP's ticker so both run on the same RAF loop
    const tickHandler = (time: number) => {
      lenisRef.current?.raf(time * 1000);
    };
    gsap.ticker.add(tickHandler);

    // Prevent Lenis from running its own RAF (GSAP drives it now)
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickHandler);
    };
  }, []);

  return null;
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.05, smoothWheel: true, autoRaf: false }}>
      <LenisGSAPSync />
      {children}
    </ReactLenis>
  );
}
