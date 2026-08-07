"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function LazyVideo({ src, className }: { src: string; className?: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!video.src) {
              video.src = src;
              video.load();
              setIsLoaded(true);
            }
            video.play().catch(() => {});
          } else {
            if (video.src) {
              video.pause();
            }
          }
        });
      },
      { rootMargin: "300px 0px 300px 0px" }
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, [src]);

  return (
    <video
      ref={videoRef}
      loop
      muted
      playsInline
      preload="none"
      className={className}
    />
  );
}

const projects: { img?: string; video?: string; containVideo?: boolean; name: string; category: string; subtitle: string; link?: string; }[] = [
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

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function Spotlight() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const bridgeRef = useRef<HTMLElement>(null);
  const desktopRef = useRef<HTMLElement>(null);

  useGSAP(() => {
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
        const currentIdx = Math.min(
          Math.floor(progress * TOTAL) + 1,
          TOTAL
        );

        projectIndex.textContent = `${String(currentIdx).padStart(2, "0")}/${TOTAL_PAD}`;
        gsap.set(projectIndex, { y: progress * moveIndex });
        gsap.set(imagesContainer, { y: progress * moveImages });

        imgs.forEach((img) => {
          const rect = img.getBoundingClientRect();
          gsap.set(img, {
            opacity: rect.top <= threshold && rect.bottom >= threshold ? 1 : 0.5,
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
  }, { scope: wrapperRef });

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */
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

        {/* Centre image column */}
        <div className="spotlight-images absolute top-0 left-1/2 -translate-x-1/2 w-[35%] flex flex-col gap-2 py-[50svh] -z-[1] will-change-transform">
          {projects.map((p, i) => (
            <a
              key={i}
              href={p.link}
              target={p.link?.startsWith('http') ? "_blank" : undefined}
              rel={p.link?.startsWith('http') ? "noopener noreferrer" : undefined}
              className="spotlight-img w-full aspect-video opacity-50 overflow-hidden transition-all duration-300 block cursor-pointer"
            >
              {p.video ? (
                <LazyVideo src={p.video} className={`w-full h-full ${p.containVideo ? 'object-contain bg-black/20 rounded-lg' : 'object-cover'}`} />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
              )}
            </a>
          ))}
        </div>

        {/* Names – bottom-right */}
        <div className="spotlight-names absolute right-8 bottom-8 flex flex-col items-end">
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
                target={p.link?.startsWith('http') ? "_blank" : undefined}
                rel={p.link?.startsWith('http') ? "noopener noreferrer" : undefined}
                className="w-full aspect-video overflow-hidden block cursor-pointer"
              >
                {p.video ? (
                  <LazyVideo src={p.video} className={`w-full h-full ${p.containVideo ? 'object-contain bg-black/20 rounded-lg' : 'object-cover'}`} />
                ) : (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
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
          className="group flex items-center gap-4 text-white/40 hover:text-white transition-colors duration-300"
        >
          <span className="text-lg md:text-2xl tracking-[0.3em] uppercase font-light">More Projects</span>
          <span className="text-3xl transition-transform duration-300 group-hover:translate-x-2">→</span>
        </Link>
      </div>
    </div>
  );
}
