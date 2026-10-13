"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useAudio } from "./AudioProvider";

gsap.registerPlugin(ScrollTrigger);

function LazyVideo({
  src,
  className,
  isActive,
  name
}: {
  src: string;
  className?: string;
  isActive?: boolean;
  name: string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const safeSrc = encodeURI(src);

  // Active state: externally controlled by desktop ScrollTrigger, or inView on mobile, or hovered
  const shouldPlay = (isActive !== undefined ? isActive : inView) || isHovered;

  useEffect(() => {
    if (isActive !== undefined) return;

    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.2, rootMargin: "100px 0px 100px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [isActive]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (shouldPlay) {
      // Must set DOM properties explicitly before calling play() for browser autoplay policy
      video.defaultMuted = true;
      video.muted = true;
      video.playsInline = true;

      if (!video.src || video.src === "") {
        video.src = safeSrc;
        video.load();
      }

      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setHasError(false);
          })
          .catch(() => {
            // Silently handle autoplay catch
          });
      }
    } else {
      if (video.src && !video.paused) {
        video.pause();
        setIsPlaying(false);
      }
    }
  }, [shouldPlay, safeSrc]);

  return (
    <div
      ref={containerRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-full h-full bg-[#181818] overflow-hidden rounded-lg group select-none"
    >
      {/* Sleek Fallback Card / Buffering state */}
      <div
        className={`absolute inset-0 flex flex-col items-center justify-center p-4 bg-gradient-to-br from-[#222222] to-[#121212] transition-opacity duration-500 pointer-events-none z-0 ${
          isPlaying && !hasError ? "opacity-0" : "opacity-100"
        }`}
      >
        <div className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center text-white/60 mb-2 group-hover:scale-110 transition-transform">
          <span className="text-sm font-sans pl-0.5">▶</span>
        </div>
        <span className="text-xs uppercase tracking-widest text-white/50 font-mono text-center px-2">
          {name}
        </span>
      </div>

      <video
        ref={videoRef}
        loop
        muted
        playsInline
        preload="metadata"
        onError={() => setHasError(true)}
        className={`relative z-10 ${className} transition-opacity duration-500 ${
          isPlaying && !hasError ? "opacity-100" : "opacity-0"
        }`}
      />
    </div>
  );
}

const projects: {
  img?: string;
  video?: string;
  containVideo?: boolean;
  name: string;
  category: string;
  subtitle: string;
  link?: string;
}[] = [
  {
    video: "/projects/MultiPDF-RAG.mp4",
    containVideo: true,
    name: "PDF RAG Chatbot",
    category: "AI / GenAI",
    subtitle: "Multi-Agent RAG System",
    link: "https://ai-multipdf-rag.vercel.app/",
  },
  {
    video: "/projects/Number Plate Detection.mp4",
    name: "Number Plate Detection",
    category: "ML / Vision",
    subtitle: "Computer Vision Pipeline",
    link: "https://github.com/Harshgup16/license_plate_detection",
  },
  {
    video: "/projects/Kitty Konnect.mp4",
    name: "Kitty Konnect",
    category: "Web Development",
    subtitle: "Real-time Chat App",
    link: "https://kitty-konnect.vercel.app/",
  },
  {
    video: "/projects/3D-Piano.mp4",
    name: "3D Piano",
    category: "Front-end",
    subtitle: "React + Three.js",
    link: "https://3d-piano-rho.vercel.app/",
  },
];

const TOTAL = projects.length;
const TOTAL_PAD = String(TOTAL).padStart(2, "0");

export default function Spotlight() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const bridgeRef = useRef<HTMLElement>(null);
  const desktopRef = useRef<HTMLElement>(null);
  const [activeIdx, setActiveIdx] = useState(0);
  const activeIdxRef = useRef(0);
  const { playHover, playClick, playStep } = useAudio();

  useGSAP(
    () => {
      const bridge = bridgeRef.current;
      const desktop = desktopRef.current;
      if (!bridge) return;

      /* -------------------------------------------------------------- */
      /*  Bridge: scroll-driven color morph  #e5e5e5 → #141414           */
      /* -------------------------------------------------------------- */
      const bridgeText = bridge.querySelector<HTMLParagraphElement>(".bridge-text");

      gsap.to(bridge, {
        backgroundColor: "#141414",
        ease: "none",
        scrollTrigger: {
          trigger: bridge,
          start: "top 80%",
          end: "top 10%",
          scrub: true,
        },
      });

      if (bridgeText) {
        gsap.fromTo(
          bridgeText,
          { opacity: 0, y: 40, color: "#333" },
          {
            opacity: 1,
            y: 0,
            color: "#ffffff",
            ease: "none",
            scrollTrigger: {
              trigger: bridge,
              start: "top 70%",
              end: "top 20%",
              scrub: true,
            },
          }
        );
      }

      /* -------------------------------------------------------------- */
      /*  Desktop-only: Spotlight pinned scroll (skip on mobile)         */
      /* -------------------------------------------------------------- */
      if (!desktop || window.innerWidth < 1024) return;

      const projectIndex = desktop.querySelector<HTMLHeadingElement>(".spotlight-index");
      const imagesContainer = desktop.querySelector<HTMLDivElement>(".spotlight-images");
      const imgs = desktop.querySelectorAll<HTMLAnchorElement>(".spotlight-img");
      const names = desktop.querySelectorAll<HTMLParagraphElement>(".spotlight-name");
      const namesContainer = desktop.querySelector<HTMLDivElement>(".spotlight-names");

      if (!projectIndex || !imagesContainer || !namesContainer || imgs.length === 0)
        return;

      const sectionH = desktop.offsetHeight;
      const pad = parseFloat(getComputedStyle(desktop).paddingTop);
      const indexH = projectIndex.offsetHeight;
      const namesH = namesContainer.offsetHeight;
      const imagesH = imagesContainer.offsetHeight;

      const moveIndex = sectionH - pad * 2 - indexH;
      const moveNames = sectionH - pad * 2 - namesH;
      const moveImages = window.innerHeight - imagesH;
      const threshold = window.innerHeight / 2;

      ScrollTrigger.create({
        trigger: desktop,
        start: "top top",
        end: `+=${window.innerHeight * 5}px`,
        pin: true,
        pinSpacing: true,
        scrub: 1,
        onUpdate: (self) => {
          const progress = self.progress;
          const currentIdx = Math.min(Math.floor(progress * TOTAL) + 1, TOTAL);
          const zeroBased = Math.min(Math.floor(progress * TOTAL), TOTAL - 1);

          // Update active project only when the index changes to avoid React render spam
          if (activeIdxRef.current !== zeroBased) {
            activeIdxRef.current = zeroBased;
            setActiveIdx(zeroBased);
            playStep();
          }

          projectIndex.textContent = `${String(currentIdx).padStart(2, "0")}/${TOTAL_PAD}`;
          gsap.set(projectIndex, { y: progress * moveIndex });
          gsap.set(imagesContainer, { y: progress * moveImages });

          imgs.forEach((img) => {
            const rect = img.getBoundingClientRect();
            gsap.set(img, {
              opacity: rect.top <= threshold && rect.bottom >= threshold ? 1 : 0.45,
            });
          });

          names.forEach((p, i) => {
            const start = i / TOTAL;
            const end = (i + 1) / TOTAL;
            const proj = Math.max(0, Math.min(1, (progress - start) / (end - start)));
            gsap.set(p, { y: -proj * moveNames });
            gsap.set(p, { color: proj > 0 && proj < 1 ? "#fff" : "#4a4a4a" });
          });
        },
      });
    },
    { scope: wrapperRef }
  );

  return (
    <div ref={wrapperRef} className="bg-[#141414]">
      {/* Bridge – color morph from PinnedGames (#e5e5e5) → Spotlight (#141414) */}
      <section
        ref={bridgeRef}
        className="relative w-full h-screen flex justify-center items-center text-center overflow-hidden"
        style={{ backgroundColor: "#e5e5e5" }}
      >
        <p className="bridge-text text-[clamp(2rem,4vw,4rem)] font-medium leading-snug opacity-0">
          A collection of selected works
        </p>
      </section>

      {/* ============================================================ */}
      {/*  DESKTOP – pinned scroll (hidden on mobile)                   */}
      {/* ============================================================ */}
      <section
        ref={desktopRef}
        className="spotlight-section relative w-full h-screen p-8 overflow-hidden bg-[#141414] text-white hidden lg:block"
      >
        {/* Counter – top-left */}
        <div>
          <h1 className="spotlight-index uppercase text-[clamp(3rem,5vw,7rem)] font-normal leading-none will-change-transform">
            01/{TOTAL_PAD}
          </h1>
        </div>

        {/* Centre image column: removed -z-[1] to fix browser stacking layer occlusion */}
        <div className="spotlight-images absolute top-0 left-1/2 -translate-x-1/2 w-[35%] flex flex-col gap-4 py-[50svh] z-10 will-change-transform">
          {projects.map((p, i) => (
            <a
              key={i}
              href={p.link}
              target={p.link?.startsWith("http") ? "_blank" : undefined}
              rel={p.link?.startsWith("http") ? "noopener noreferrer" : undefined}
              onMouseEnter={playHover}
              onClick={playClick}
              className="spotlight-img w-full aspect-video opacity-50 overflow-hidden transition-all duration-300 block cursor-pointer rounded-lg shadow-2xl"
            >
              {p.video ? (
                <LazyVideo
                  src={p.video}
                  name={p.name}
                  isActive={activeIdx === i}
                  className={`w-full h-full ${
                    p.containVideo ? "object-contain bg-black/40 rounded-lg" : "object-cover"
                  }`}
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={p.img} alt={p.name} className="w-full h-full object-cover rounded-lg" />
              )}
            </a>
          ))}
        </div>

        {/* Names – bottom-right */}
        <div className="spotlight-names absolute right-8 bottom-8 flex flex-col items-end z-20">
          {projects.map((p, i) => (
            <p
              key={i}
              className="spotlight-name text-2xl font-medium leading-snug text-[#4a4a4a] transition-colors duration-300 will-change-transform"
            >
              {p.name}
            </p>
          ))}
        </div>
      </section>

      {/* ============================================================ */}
      {/*  MOBILE – stacked cards (hidden on desktop)                   */}
      {/* ============================================================ */}
      <section className="lg:hidden bg-[#141414] text-white px-5 py-12">
        <div className="flex flex-col gap-14">
          {projects.map((p, i) => (
            <article key={i} className="flex flex-col gap-0">
              {/* Counter */}
              <div className="mb-4">
                <h2 className="text-[4rem] font-black leading-none tracking-tight">
                  {String(i + 1).padStart(2, "0")}
                  <span className="text-2xl font-normal text-white/50 ml-1">
                    /{TOTAL_PAD}
                  </span>
                </h2>
              </div>

              {/* Image / Video */}
              <a
                href={p.link}
                target={p.link?.startsWith("http") ? "_blank" : undefined}
                rel={p.link?.startsWith("http") ? "noopener noreferrer" : undefined}
                onMouseEnter={playHover}
                onClick={playClick}
                className="w-full aspect-video overflow-hidden block cursor-pointer rounded-lg shadow-xl"
              >
                {p.video ? (
                  <LazyVideo
                    src={p.video}
                    name={p.name}
                    className={`w-full h-full ${
                      p.containVideo ? "object-contain bg-black/40 rounded-lg" : "object-cover"
                    }`}
                  />
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover rounded-lg" />
                )}
              </a>

              {/* Title row */}
              <div className="flex items-baseline justify-between mt-4">
                <h3 className="text-2xl font-bold uppercase tracking-tight leading-tight">
                  {p.name}
                </h3>
                <span className="text-base italic text-white/60 shrink-0 ml-4">
                  {p.category}
                </span>
              </div>

              {/* Subtitle */}
              <p className="text-base italic text-white/40 mt-1">
                {p.subtitle}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* More Projects link */}
      <div className="bg-[#141414] pt-8 pb-20 md:pt-10 md:pb-20 flex justify-center">
        <Link
          href="/projects"
          onMouseEnter={playHover}
          onClick={playClick}
          className="group flex items-center gap-4 text-white/40 hover:text-white transition-colors duration-300"
        >
          <span className="text-lg md:text-2xl tracking-[0.3em] uppercase font-light">
            More Projects
          </span>
          <span className="text-3xl transition-transform duration-300 group-hover:translate-x-2">
            →
          </span>
        </Link>
      </div>
    </div>
  );
}
