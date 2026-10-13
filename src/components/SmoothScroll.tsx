"use client";

import { useEffect } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function LenisGSAPSync() {
  const lenis = useLenis();

  useEffect(() => {
    // Prevent browser auto-scroll restoration jump on reload
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    if (!lenis) return;

    // Connect Lenis scroll to ScrollTrigger update
    const handleScroll = () => {
      ScrollTrigger.update();
    };
    lenis.on("scroll", handleScroll);

    // Drive Lenis directly from GSAP ticker on a unified RAF loop
    const tickHandler = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tickHandler);

    // Standard lag smoothing: smoothly absorbs frame drops without visual stutter
    gsap.ticker.lagSmoothing(500, 33);

    return () => {
      lenis.off("scroll", handleScroll);
      gsap.ticker.remove(tickHandler);
    };
  }, [lenis]);

  return null;
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.08, smoothWheel: true, autoRaf: false }}>
      <LenisGSAPSync />
      {children}
    </ReactLenis>
  );
}
