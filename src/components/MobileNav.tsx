"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import Logo from "./Logo";

// ─── Character Pool ────────────────────────────────────────────────────────────
const CHAR_POOL = ["H", "A", "R", "S", "H", "h", "a", "r", "s", "h"];
const BITMAP_SIZE = 128; // rasterize characters at 128px for crisp rendering

// Pre-rasterize characters once into ImageBitmap via OffscreenCanvas / Canvas
async function prerasterizeChars(pool: string[]): Promise<Map<string, ImageBitmap>> {
  const cache = new Map<string, ImageBitmap>();
  for (const char of pool) {
    if (cache.has(char)) continue;
    const canvas = document.createElement("canvas");
    canvas.width = BITMAP_SIZE;
    canvas.height = BITMAP_SIZE;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#ffffff";
    ctx.font = `900 ${BITMAP_SIZE * 0.75}px sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(char, BITMAP_SIZE / 2, BITMAP_SIZE / 2);
    const bitmap = await createImageBitmap(canvas);
    cache.set(char, bitmap);
  }
  return cache;
}

// ─── Physics particle ─────────────────────────────────────────────────────────
type PhysicsParticle = {
  char: string;
  bitmap: ImageBitmap;
  size: number;   // Display size in CSS px
  x: number;
  y: number;
  vx: number;
  vy: number;
  opacity: number;
  rotation: number;
  angularV: number;
};

const GRAVITY = 1400;
const RESTITUTION = 0.65;
const FRICTION = 0.22;
const PHYSICS_H = 220;

function buildParticles(
  bitmapCache: Map<string, ImageBitmap>,
  canvasW: number
): PhysicsParticle[] {
  const chars = Array.from(bitmapCache.keys());
  if (chars.length === 0) return [];
  const isSmallScreen = canvasW < 640;
  const count = isSmallScreen ? 140 : 280; // lots of uniform character particles!
  const particles: PhysicsParticle[] = [];

  for (let i = 0; i < count; i++) {
    const char = CHAR_POOL[i % CHAR_POOL.length]!;
    const bitmap = bitmapCache.get(char)!;
    const size = isSmallScreen ? 20 : 24; // all same size

    const x = Math.random() * Math.max(10, canvasW - size);
    const y = PHYSICS_H - size - Math.random() * 35;

    particles.push({
      char,
      bitmap,
      size,
      x,
      y,
      vx: (Math.random() - 0.5) * 320,
      vy: -(220 + Math.random() * 550),
      opacity: 0.20 + Math.random() * 0.25,
      rotation: (Math.random() - 0.5) * 40,
      angularV: (Math.random() - 0.5) * 5,
    });
  }
  return particles;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const headerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  // Physics bounce canvas
  const rafRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const closingRef = useRef<boolean>(false);
  const closingStartRef = useRef<number>(0);
  const physCanvasRef = useRef<HTMLCanvasElement>(null);
  const physParticlesRef = useRef<PhysicsParticle[]>([]);
  const physLastTimeRef = useRef<number>(0);
  const physOpacityRef = useRef<number>(0);

  // Pre-rasterized character bitmaps
  const bitmapCacheRef = useRef<Map<string, ImageBitmap> | null>(null);

  // ── Scroll hide ────────────────────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // ── Pre-rasterize character pool once ──────────────────────────────────────
  useEffect(() => {
    prerasterizeChars(CHAR_POOL).then((cache) => {
      bitmapCacheRef.current = cache;
    });
    return () => {
      bitmapCacheRef.current?.forEach((bm) => bm.close());
    };
  }, []);

  // Cache context ref to avoid getContext() every frame
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);

  // ── Physics step ───────────────────────────────────────────────────────────
  const stepPhysics = useCallback((dt: number) => {
    const canvas = physCanvasRef.current;
    if (!canvas) return;

    if (!ctxRef.current) ctxRef.current = canvas.getContext("2d");
    const ctx = ctxRef.current;
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const W = canvas.width / dpr;
    const floor = PHYSICS_H - 4;
    const globalOpacity = physOpacityRef.current;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const particles = physParticlesRef.current;

    // Apply DPR scale once for the whole frame
    ctx.save();
    ctx.scale(dpr, dpr);

    for (const p of particles) {
      // Physics integration
      p.vy += GRAVITY * dt;
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.rotation += p.angularV;

      // Floor bounce
      if (p.y + p.size >= floor) {
        p.y = floor - p.size;
        p.vy = -Math.abs(p.vy) * RESTITUTION;
        p.vx *= FRICTION;
        p.angularV *= 0.7;
        if (Math.abs(p.vy) < 30) p.vy = 0;
      }

      // Wall bounce
      if (p.x < 0) {
        p.x = 0;
        p.vx = Math.abs(p.vx) * RESTITUTION;
        p.angularV = -p.angularV * 0.6;
      } else if (p.x + p.size > W) {
        p.x = W - p.size;
        p.vx = -Math.abs(p.vx) * RESTITUTION;
        p.angularV = -p.angularV * 0.6;
      }

      // Draw character bitmap directly with high performance
      ctx.globalAlpha = globalOpacity * p.opacity;
      const cx = p.x + p.size / 2;
      const cy = p.y + p.size / 2;
      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.drawImage(p.bitmap, -p.size / 2, -p.size / 2, p.size, p.size);
      ctx.restore();
    }

    ctx.restore();
  }, []);

  // ── Main animation loop ────────────────────────────────────────────────────
  const runAnimation = useCallback((timestamp: number) => {
    const physDt = physLastTimeRef.current === 0
      ? 0
      : Math.min((timestamp - physLastTimeRef.current) / 1000, 0.05);
    physLastTimeRef.current = timestamp;

    if (closingRef.current) {
      const closeElapsed = timestamp - closingStartRef.current;
      const closeFade = Math.max(0, 1 - closeElapsed / 350);
      physOpacityRef.current = closeFade;
      if (closeFade <= 0) {
        const pc = physCanvasRef.current;
        if (pc) ctxRef.current?.clearRect(0, 0, pc.width, pc.height);
        return;
      }
    } else {
      physOpacityRef.current = Math.min(1, (timestamp - startTimeRef.current) / 500);
    }

    stepPhysics(physDt);
    rafRef.current = requestAnimationFrame(runAnimation);
  }, [stepPhysics]);

  // ── Open / close ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";

      gsap.fromTo(headerRef.current, { opacity: 0, y: -20 }, { opacity: 1, y: 0, duration: 1.0, ease: "expo.out", delay: 0.4 });
      gsap.fromTo(linksRef.current, { y: "120%", opacity: 0, rotate: 3 }, { y: "0%", opacity: 1, rotate: 0, duration: 1.2, stagger: 0.15, ease: "expo.out", delay: 0.45 });
      gsap.fromTo(footerRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 1.0, ease: "expo.out", delay: 0.6 });

      const dpr = window.devicePixelRatio || 1;
      const W = window.innerWidth;

      const physCanvas = physCanvasRef.current;
      if (physCanvas && bitmapCacheRef.current) {
        ctxRef.current = null; // reset cached ctx when canvas resets
        physCanvas.width = W * dpr;
        physCanvas.height = PHYSICS_H * dpr;
        physCanvas.style.width = `${W}px`;
        physCanvas.style.height = `${PHYSICS_H}px`;
        physParticlesRef.current = buildParticles(bitmapCacheRef.current, W);
      }

      closingRef.current = false;
      physOpacityRef.current = 0;
      startTimeRef.current = 0;
      physLastTimeRef.current = 0;

      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame((ts) => {
        startTimeRef.current = ts;
        physLastTimeRef.current = ts;
        runAnimation(ts);
      });

      const handleResize = () => {
        const newW = window.innerWidth;
        const newDpr = window.devicePixelRatio || 1;
        const pc = physCanvasRef.current;
        if (pc) {
          ctxRef.current = null;
          pc.width = newW * newDpr;
          pc.height = PHYSICS_H * newDpr;
          pc.style.width = `${newW}px`;
          pc.style.height = `${PHYSICS_H}px`;
          // Clamp particles within new bounds
          for (const p of physParticlesRef.current) {
            if (p.x + p.size > newW) p.x = Math.max(0, newW - p.size);
          }
        }
      };

      window.addEventListener("resize", handleResize);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("resize", handleResize);
      };
    } else {
      document.body.style.overflow = "";
      closingRef.current = true;
      closingStartRef.current = performance.now();
    }

    return () => { document.body.style.overflow = ""; };
  }, [isOpen, runAnimation]);

  // ── Cleanup ────────────────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  linksRef.current = [];
  const addToLinks = (el: HTMLAnchorElement | null) => {
    if (el && !linksRef.current.includes(el)) linksRef.current.push(el);
  };

  return (
    <>
      {/* Logo */}
      <div className="fixed top-6 left-6 md:top-8 md:left-8 z-[45] mix-blend-difference text-white pointer-events-auto">
        <Link href="/"><Logo filled className="w-16 h-16 md:w-32 md:h-32" /></Link>
      </div>

      {/* Header bar */}
      <header className={`fixed top-0 left-0 w-full z-40 pointer-events-none mix-blend-difference transition-transform duration-[600ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${isVisible ? "translate-y-0" : "-translate-y-[250px]"}`}>
        <button
          onClick={() => setIsOpen(true)}
          className="md:hidden absolute top-6 right-6 h-12 flex items-center text-white text-sm font-semibold tracking-widest uppercase hover:text-gray-300 transition-colors pointer-events-auto"
        >
          Menu
        </button>

        <div className="hidden md:flex absolute top-12 left-1/2 -translate-x-1/2 text-white gap-10 lg:gap-16 font-semibold text-lg tracking-wide pointer-events-auto">
          {[
            { name: "About", href: "/#about" },
            { name: "Experience", href: "/experience" },
            { name: "Projects", href: "/projects" },
            { name: "Certificates", href: "/certificates" },
            { name: "Reach out", href: "mailto:hkgupta160420@gmail.com" },
          ].map((link) => {
            const isMailto = link.href.startsWith("mailto:");
            const LinkContent = (
              <div className="relative overflow-hidden">
                <div className="transition-transform duration-[600ms] ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full">
                  <span className="block leading-tight">{link.name}</span>
                  <span className="absolute top-full left-0 block leading-tight">{link.name}</span>
                </div>
              </div>
            );
            if (isMailto) return <a key={link.name} href={link.href} className="group hover-underline inline-block pb-0.5">{LinkContent}</a>;
            return <Link key={link.name} href={link.href} className="group hover-underline inline-block pb-0.5">{LinkContent}</Link>;
          })}
        </div>

        <div className="hidden md:flex absolute top-10 right-10 text-white items-start gap-6 text-lg font-semibold pointer-events-auto">
          <span className="mt-1">Discover</span>
          <div className="relative w-[1px] h-20 bg-white/20 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[40%] bg-white animate-[scrollDown_2.5s_ease-in-out_infinite]" />
          </div>
        </div>
      </header>

      {/* Fullscreen overlay */}
      <div
        className={`fixed inset-0 z-[55] bg-[#111111] text-white flex flex-col transition-transform duration-[900ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${isOpen ? "translate-y-0" : "-translate-y-full"}`}
      >
        {/* Physics bounce canvas — pinned to bottom */}
        <canvas
          ref={physCanvasRef}
          aria-hidden="true"
          className="absolute bottom-0 left-0 pointer-events-none"
          style={{ zIndex: 2, height: `${PHYSICS_H}px` }}
        />

        {/* Nav content */}
        <div className="relative flex flex-col h-full" style={{ zIndex: 1 }}>
          <div ref={headerRef} className="flex justify-between items-center p-6 md:p-8 text-sm font-medium">
            <span className="text-xl md:text-2xl font-bold tracking-wide">Harsh Gupta</span>
            <button onClick={() => setIsOpen(false)} className="text-xs hover:text-gray-300 transition-colors uppercase tracking-widest">
              Close
            </button>
          </div>

          <div className="flex-1 flex flex-col justify-center px-8 gap-4 mt-12">
            {[
              { label: "Projects", href: "/projects" },
              { label: "Experience", href: "/experience" },
              { label: "Certificates", href: "/certificates" },
              { label: "About", href: "/#about" },
            ].map(({ label, href }) => (
              <div key={label} className="overflow-hidden p-2 -m-2">
                <Link ref={addToLinks} href={href} onClick={() => setIsOpen(false)} className="block text-5xl font-medium tracking-tight hover:text-gray-300 transition-colors transform-gpu origin-left">
                  {label}
                </Link>
              </div>
            ))}
            <div className="overflow-hidden p-2 -m-2">
              <a href="mailto:hkgupta160420@gmail.com" onClick={() => setIsOpen(false)} className="block text-5xl font-medium tracking-tight hover:text-gray-300 transition-colors transform-gpu origin-left">
                Reach out
              </a>
            </div>
          </div>

          <div ref={footerRef} className="p-8 pb-12 flex flex-col gap-4">
            <span className="text-gray-500 text-sm">Socials</span>
            <div className="flex gap-6 text-sm font-medium">
              <a href="https://www.linkedin.com/in/harshgup16/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">LinkedIn</a>
              <a href="https://github.com/Harshgup16" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">Github</a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">Codeforces</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
