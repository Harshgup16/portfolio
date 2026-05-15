"use client";

import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

const certificates = [
  
  {
    name: "Algouniversity",
    issuer: "AlgoUniversity",
    topic: ["Software Engineering", "Algorithms"],
    image: "/certificate/Algouniversity.png",
  },
  {
    name: "HOPS - Hackathon Winner",
    issuer: "Hackathon",
    topic: ["AI", "Web Development"],
    image: "/certificate/HOPS - hackathon winner.jpg",
  },
  {
    name: "AWS Certified Machine Learning Engineer - Associate",
    issuer: "Amazon Web Services",
    topic: ["Machine Learning", "Cloud"],
    image: "/certificate/AWS Certified Machine Learning Engineer - Associate.png",
  },
  {
    name: "IBM Data Analysis with Python",
    issuer: "IBM",
    topic: ["Data Analysis", "Python"],
    image: "/certificate/IBM Data Analysis with Python.png",
  },
  {
    name: "IIIT-Gwalior Hackathon",
    issuer: "IIIT-Gwalior",
    topic: ["Hackathon", "Problem Solving"],
    image: "/certificate/IIIT-Gwalior Hackathon.jpeg",
  },
  {
    name: "Matlab Certificate",
    issuer: "MathWorks",
    topic: ["MATLAB", "Engineering"],
    image: "/certificate/Matlab Certificate.png",
  },
  {
    name: "Udemy Data Science",
    issuer: "Udemy",
    topic: ["Data Science", "Python"],
    image: "/certificate/Udemy Data Science.png",
  },
];

const TOTAL_PAD = String(certificates.length).padStart(2, "0");

export default function CertificateShowcase() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Desktop row animations
    const rows = gsap.utils.toArray(".certificate-row");
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
    const cards = gsap.utils.toArray(".certificate-card");
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
            Certificates
          </h1>
          <p className="text-lg md:text-2xl mt-6 text-[#141414]/60 max-w-2xl">
            A collection of my certifications and achievements across AI, Data Science, and Software Engineering.
          </p>
        </div>

        {/* ============================================================ */}
        {/* DESKTOP LAYOUT (List view) */}
        {/* ============================================================ */}
        <div className="hidden lg:block">
          <div className="w-full border-b border-[#141414]/20 pb-4 mb-4 flex text-sm uppercase tracking-widest text-[#141414]/40 font-semibold">
            <div className="w-[10%]">No.</div>
            <div className="w-[40%]">Certificate</div>
            <div className="w-[20%]">Topic</div>
            <div className="w-[30%] text-right">Preview</div>
          </div>

          {certificates.map((cert, i) => (
            <div 
              key={i} 
              className="certificate-row group border-b border-[#141414]/10 hover:border-[#141414]/50 transition-colors duration-500 py-8 flex items-center cursor-default"
            >
              <div className="w-[10%] text-2xl font-black text-[#a02128] transition-colors duration-500">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="w-[40%] pr-8">
                <h2 className="text-3xl lg:text-4xl font-bold uppercase tracking-tight mb-2 group-hover:translate-x-4 transition-transform duration-500">
                  {cert.name}
                </h2>
                <p className="text-[#141414]/60 font-medium tracking-wide uppercase text-sm mt-3 group-hover:translate-x-4 transition-transform duration-500 delay-75">
                  {cert.issuer}
                </p>
              </div>
              <div className="w-[20%] flex flex-col gap-3 pr-8">
                <div className="flex flex-col items-start gap-2">
                  {cert.topic.map((t, idx) => (
                    <span key={idx} className="text-xs border border-[#141414]/20 rounded-full px-3 py-1 group-hover:border-[#141414]/60 transition-colors duration-500">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
              <div className="w-[30%] flex justify-end">
                <a href={cert.image} target="_blank" rel="noopener noreferrer" className="block w-64 h-40 relative overflow-hidden rounded-md border border-[#141414]/20 group-hover:border-[#141414]/60 transition-colors duration-500">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={cert.image} alt={cert.name} className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* ============================================================ */}
        {/* MOBILE LAYOUT (Stacked text cards, similar to Spotlight) */}
        {/* ============================================================ */}
        <div className="lg:hidden flex flex-col gap-16">
          {certificates.map((cert, i) => (
            <article key={i} className="certificate-card flex flex-col gap-0 border-t border-[#141414]/10 pt-8">
              {/* Counter */}
              <div className="mb-6 flex justify-between items-start">
                <h2 className="text-[4rem] font-black leading-none tracking-tight text-[#a02128]">
                  {String(i + 1).padStart(2, "0")}
                  <span className="text-2xl font-normal text-[#141414]/30 ml-1">
                    /{TOTAL_PAD}
                  </span>
                </h2>
              </div>

              {/* Title row */}
              <div className="flex flex-col gap-2 mb-4">
                <h3 className="text-3xl sm:text-4xl font-bold uppercase tracking-tight leading-tight">
                  {cert.name}
                </h3>
                <span className="text-xl italic text-[#141414]/80 font-medium">
                  {cert.issuer}
                </span>
              </div>

              {/* Tech stack / Topic */}
              <div className="flex flex-wrap gap-2 mt-2 mb-6">
                {cert.topic.map((t, idx) => (
                  <span key={idx} className="text-xs uppercase tracking-wider font-semibold border border-[#141414]/20 rounded-full px-3 py-1 text-[#141414]/70">
                    {t}
                  </span>
                ))}
              </div>

              {/* Image Preview */}
              <div className="w-full mt-auto rounded-md overflow-hidden border border-[#141414]/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={cert.image} alt={cert.name} className="w-full h-auto object-cover" />
              </div>
            </article>
          ))}
        </div>

      </div>
    </div>
  );
}
