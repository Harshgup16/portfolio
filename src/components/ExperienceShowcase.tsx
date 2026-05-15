"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const experiences = [
  {
    company: "EnviroWealth",
    role: "Data Scientist Intern",
    duration: "Nov 2025 - March 2026",
    description: `"He demonstrated outstanding technical expertise, exceptional problem-solving skills, strong initiative, and remarkable dedication throughout the internship. Even while working remotely, he consistently delivered high-quality results, collaborated seamlessly with the team, showed a proactive attitude, and went above and beyond to ensure project success."`,
    tech: ["Data Science", "Python", "Remote"],
    link: "https://envirowealth.in/",
  },
  {
    company: "Mintzy",
    role: "Software Engineering Intern",
    duration: "Nov 2025 - Jan 2026",
    description: `"Your work on software development, system improvement, and support in project execution and technical implementation was appreciated and contributed positively to our ongoing projects."`,
    tech: ["Software Engineering", "System Improvement", "Remote"],
    link: "https://mintzy.in/",
  },
  {
    company: "The Red Users",
    role: "Cybersecurity Intern",
    duration: "2025",
    description: "Remote cybersecurity internship involving security analysis and threat mitigation.",
    tech: ["Cybersecurity", "Analysis", "Remote"],
    link: "https://theredusers.com/",
  },
];

const TOTAL_PAD = String(experiences.length).padStart(2, "0");

export default function ExperienceShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Desktop row animations
    const rows = gsap.utils.toArray(".experience-row");
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
    const cards = gsap.utils.toArray(".experience-card");
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
            Experience
          </h1>
          <p className="text-lg md:text-2xl mt-6 text-[#141414]/60 max-w-2xl">
            A track record of my remote internships, professional roles, and practical industry experience.
          </p>
        </div>

        {/* ============================================================ */}
        {/* DESKTOP LAYOUT (List view) */}
        {/* ============================================================ */}
        <div className="hidden lg:block">
          <div className="w-full border-b border-[#141414]/20 pb-4 mb-4 flex text-sm uppercase tracking-widest text-[#141414]/40 font-semibold">
            <div className="w-[10%] text-[#a02128]">No.</div>
            <div className="w-[40%] text-[#a02128]">Company / Duration</div>
            <div className="w-[40%] text-[#a02128]">Role / Details</div>
            <div className="w-[10%] text-right text-[#a02128]">Certificate</div>
          </div>

          {experiences.map((exp, i) => (
            <div 
              key={i} 
              className="experience-row group border-b border-[#141414]/10 hover:border-[#141414]/50 transition-colors duration-500 py-8 flex items-center cursor-default"
            >
              <div className="w-[10%] text-2xl font-black text-[#a02128] transition-colors duration-500">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="w-[40%] pr-8">
                <h2 className="text-4xl lg:text-5xl font-bold uppercase tracking-tight mb-2 group-hover:translate-x-4 transition-transform duration-500">
                  {exp.company}
                </h2>
                <p className="text-[#141414]/60 font-medium tracking-wide uppercase text-sm mt-3 group-hover:translate-x-4 transition-transform duration-500 delay-75">
                  {exp.duration}
                </p>
              </div>
              <div className="w-[40%] flex flex-col gap-3 pr-8">
                <span className="text-2xl font-medium italic">{exp.role}</span>
                <p className="text-[#141414]/70 leading-relaxed text-sm">
                  {exp.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {exp.tech.map((t, idx) => (
                    <span key={idx} className="text-xs border border-[#141414]/20 rounded-full px-3 py-1 group-hover:border-[#141414]/60 transition-colors duration-500">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="w-[10%] text-right text-lg font-medium">
                <a href={exp.link} target="_blank" rel="noopener noreferrer" className="text-[#141414]/50 hover:text-[#a02128] transition-colors duration-300 underline underline-offset-4">
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
          {experiences.map((exp, i) => (
            <article key={i} className="experience-card flex flex-col gap-0 border-t border-[#141414]/10 pt-8">
              {/* Counter & Certificate Link */}
              <div className="mb-6 flex justify-between items-start">
                <h2 className="text-[4rem] font-black leading-none tracking-tight text-[#a02128]">
                  {String(i + 1).padStart(2, "0")}
                  <span className="text-2xl font-normal text-[#141414]/30 ml-1">
                    /{TOTAL_PAD}
                  </span>
                </h2>
                <a href={exp.link} target="_blank" rel="noopener noreferrer" className="text-sm font-semibold text-[#141414]/60 hover:text-[#a02128] mt-3 underline underline-offset-4 transition-colors">
                  Link ↗
                </a>
              </div>

              {/* Title row */}
              <div className="flex flex-col gap-2 mb-4">
                <h3 className="text-3xl sm:text-4xl font-bold uppercase tracking-tight leading-tight">
                  {exp.company}
                </h3>
                <span className="text-xl italic text-[#141414]/80 font-medium">
                  {exp.role}
                </span>
                <span className="text-sm uppercase tracking-widest font-bold text-[#141414]/50 mt-1">
                  {exp.duration}
                </span>
              </div>

              {/* Subtitle / Description */}
              <p className="text-base sm:text-lg text-[#141414]/80 mt-2 mb-6 leading-relaxed">
                {exp.description}
              </p>

              {/* Tech stack */}
              <div className="flex flex-wrap gap-2 mt-auto">
                {exp.tech.map((t, idx) => (
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
