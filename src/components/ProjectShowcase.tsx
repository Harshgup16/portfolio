"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const projects = [
  {
    name: "MULTI-PDF RAG Chatbot",
    category: "AI / GenAI",
    subtitle: "Multi-Agent RAG System",
    description: "A full-stack AI-powered RAG platform that allows users to chat with multiple PDFs in real time. Built with LangGraph, FastAPI, Supabase, and Gemini embeddings, the system features multi-agent routing, user-scoped vector retrieval, live streaming responses, and scalable document intelligence for seamless conversational search across large datasets.",
    tech: ["Python", "LangChain", "FastAPI", "React", "Supabase"],
    link: "https://ai-multipdf-rag.vercel.app/",
  },
  {
    name: "Mother's Day Tribute (Winner)",
    category: "Frontend Development",
    subtitle: "Award-winning Web Experience",
    description: "An award-winning Mother's Day web experience built as a digital love letter to mothers. It blends emotional storytelling, a 3D memory gallery, smooth animations, smart search, theme switching, and responsive design to create a heartfelt tribute that feels personal, modern, and memorable.",
    tech: ["Next.js", "TypeScript", "Three.js", "Tailwind CSS", "shadcn/ui"],
    link: "https://mothers-day-to-my-mom.vercel.app/",
  },
  {
    name: "HOPS (1st Runner-Up)",
    category: "AI Healthcare",
    subtitle: "Medical Report Translator",
    description: "An AI-powered healthcare assistant designed to make medical reports easier to understand for rural users. The app translates complex medical language into simple summaries and native languages, improving accessibility through AI.",
    tech: ["Streamlit", "AI/ML", "Python"],
    link: "https://github.com/Harshgup16/HOPS",
  },
  {
    name: "Kitty Konnect",
    category: "Web Development",
    subtitle: "Real-time Chat App",
    description: "A modern real-time messaging platform featuring secure authentication, instant messaging, and community channels. Built with a playful UI and smooth user experience to make online conversations more engaging.",
    tech: ["Next.js", "Socket.io", "Tailwind CSS", "Node.js"],
    link: "https://kitty-konnect.vercel.app/",
  },
  {
    name: "Agentic Blog Writer",
    category: "AI / GenAI",
    subtitle: "Multi-Agent Blog Generator",
    description: "An intelligent multi-agent AI writing system that autonomously researches, plans, and generates high-quality technical blogs in real time. Powered by LangGraph, Groq Llama 3.3 70B, and Tavily Search, the platform uses specialized AI agents for routing, research, orchestration, and parallel content generation to create structured, fact-based, and highly readable articles.",
    tech: ["LangGraph", "Groq", "Streamlit", "Python", "Tavily"],
    link: "https://blog-llm-harshgup16.streamlit.app/",
  },
  {
    name: "SoulSync",
    category: "Desktop App",
    subtitle: "Collaborative Music Player",
    description: "A beautifully designed desktop music player with real-time JAM sessions that let users listen together from anywhere. Includes playlist syncing, live playback updates, and a smooth pastel-inspired interface.",
    tech: ["ElectronJS", "HTML/CSS/JS", "Supabase"],
    link: "https://github.com/Harshgup16/electron-songapp",
  },
  {
    name: "Number Plate Detection",
    category: "ML / Vision",
    subtitle: "Computer Vision Pipeline",
    description: "An automated pipeline for detecting and recognizing vehicle number plates from raw image feeds in real-time.",
    tech: ["YOLOv8", "OpenCV", "PyTorch", "Python"],
    link: "https://github.com/Harshgup16/license_plate_detection",
  },
  {
    name: "3D Piano",
    category: "WebGL / 3D",
    subtitle: "Interactive Musical Experience",
    description:
      "An immersive 3D piano experience built with React and Three.js that transforms music interaction into a visually engaging web experience. Features smooth animations, realistic key interactions, dynamic lighting, and responsive controls for a creative blend of music and frontend engineering.",
    tech: ["React", "Three.js", "WebGL", "JavaScript"],
    link: "https://3d-piano-rho.vercel.app/",
  },
  {
    name: "3D Earth",
    category: "WebGL / 3D",
    subtitle: "Interactive 3D Globe",
    description:
      "A visually immersive 3D Earth experience rendered directly in the browser. Users can explore a glowing interactive globe enhanced with smooth animations and modern WebGL effects.",
    tech: ["Three.js", "WebGL"],
    link: "https://3d-earth-pi.vercel.app/",
  },
  {
    name: "3D Donut Landing Page",
    category: "WebGL / 3D",
    subtitle: "Customizable 3D Experience",
    description:
      "A creative and interactive 3D landing page featuring a fully customizable donut model. Designed to blend smooth animations, modern visuals, and engaging interactions into a unique web experience.",
    tech: ["Three.js", "WebGL"],
    link: "https://donut-kappa-ten.vercel.app/",
  },

];

const TOTAL_PAD = String(projects.length).padStart(2, "0");

export default function ProjectShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Desktop row animations
    const rows = gsap.utils.toArray(".project-row");
    rows.forEach((row: any) => {
      gsap.fromTo(row,
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: {
            trigger: row,
            start: "top 85%",
          }
        }
      );
    });

    // Mobile card animations
    const cards = gsap.utils.toArray(".project-card");
    cards.forEach((card: any) => {
      gsap.fromTo(card,
        { opacity: 0, y: 50 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
          }
        }
      );
    });

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="min-h-screen bg-[#e5e5e5] text-[#141414] pt-32 pb-40">
      <div className="px-6 md:px-12 max-w-[1400px] mx-auto">
        
        {/* Header */}
        <div className="mb-20 md:mb-32">
          <h1 className="text-[3rem] md:text-[6rem] lg:text-[8rem] font-medium leading-none tracking-tight uppercase">
            Projects
          </h1>
          <p className="text-lg md:text-2xl mt-6 text-[#141414]/60 max-w-2xl">
            A curated selection of my work across AI, Machine Learning, and Full-Stack Development.
          </p>
        </div>

        {/* ============================================================ */}
        {/* DESKTOP LAYOUT (List view) */}
        {/* ============================================================ */}
        <div className="hidden lg:block">
          <div className="w-full border-b border-[#141414]/20 pb-4 mb-4 flex text-sm uppercase tracking-widest text-[#141414]/40 font-semibold">
            <div className="w-[10%] text-[#a02128]">No.</div>
            <div className="w-[40%] text-[#a02128]">Project</div>
            <div className="w-[40%] text-[#a02128]">Role / Tech</div>
            <div className="w-[10%] text-right text-[#a02128]">Link</div>
          </div>

          {projects.map((p, i) => (
            <div 
              key={i} 
              className="project-row group border-b border-[#141414]/10 hover:border-[#141414]/50 transition-colors duration-500 py-8 flex items-center cursor-default"
            >
              <div className="w-[10%] text-2xl font-black text-[#a02128] transition-colors duration-500">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="w-[40%] pr-8">
                <h2 className="text-4xl lg:text-5xl font-bold uppercase tracking-tight mb-2 group-hover:translate-x-4 transition-transform duration-500">
                  {p.name}
                </h2>
                <p className="text-[#141414]/60 italic group-hover:translate-x-4 transition-transform duration-500 delay-75">
                  {p.description}
                </p>
              </div>
              <div className="w-[40%] flex flex-col gap-3 pr-8">
                <span className="text-xl font-medium">{p.category}</span>
                <div className="flex flex-wrap gap-2">
                  {p.tech.map((t, idx) => (
                    <span key={idx} className="text-xs border border-[#141414]/20 rounded-full px-3 py-1 group-hover:border-[#141414]/60 transition-colors duration-500">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="w-[10%] text-right text-lg font-medium">
                <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-[#141414]/50 hover:text-[#a02128] transition-colors duration-300 underline underline-offset-4">
                  Link ↗
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* ============================================================ */}
        {/* MOBILE LAYOUT (Stacked text cards, similar to Spotlight) */}
        {/* ============================================================ */}
        <div className="lg:hidden flex flex-col gap-16">
          {projects.map((p, i) => (
            <article key={i} className="project-card flex flex-col gap-0 border-t border-[#141414]/10 pt-8">
              {/* Counter */}
              <div className="mb-6 flex justify-between items-start">
                <h2 className="text-[4rem] font-black leading-none tracking-tight text-[#a02128]">
                  {String(i + 1).padStart(2, "0")}
                  <span className="text-2xl font-normal text-[#141414]/30 ml-1">
                    /{TOTAL_PAD}
                  </span>
                </h2>
                <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-[#141414]/60 hover:text-[#a02128] mt-3 underline underline-offset-4 transition-colors">
                  Link ↗
                </a>
              </div>

              {/* Title row */}
              <div className="flex flex-col gap-2 mb-4">
                <h3 className="text-3xl sm:text-4xl font-bold uppercase tracking-tight leading-tight">
                  {p.name}
                </h3>
                <span className="text-lg italic text-[#141414]/60">
                  {p.category}
                </span>
              </div>

              {/* Subtitle / Description */}
              <p className="text-base sm:text-lg text-[#141414]/80 mt-2 mb-6 leading-relaxed">
                {p.description}
              </p>

              {/* Tech stack */}
              <div className="flex flex-wrap gap-2 mt-auto">
                {p.tech.map((t, idx) => (
                  <span key={idx} className="text-xs uppercase tracking-wider font-semibold border border-[#141414]/20 rounded-full px-3 py-1 text-[#141414]/70">
                    {t}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>

      </div>
    </div>
  );
}
