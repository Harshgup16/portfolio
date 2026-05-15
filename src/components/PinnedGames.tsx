"use client";

import React, { useRef } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const servicesData = [
  {
    id: "01",
    title: "AI/ML & Data Science",
    desc: "I build intelligent systems using machine learning, deep learning, and data pipelines—turning raw data into real-world solutions.",
    items: [
      { num: "[01]", name: "Machine Learning", sub: "(Scikit-learn, XGBoost, LightGBM, Pandas)" },
      { num: "[02]", name: "Deep Learning & Vision", sub: "(CNNs, TensorFlow, Keras, OpenCV)" },
      { num: "[03]", name: "OCR & Data Intelligence", sub: "(Tesseract, EasyOCR, Medical Report Analysis)" }
    ]
  },
  {
    id: "02",
    title: "LLM Fine-Tuning & GenAI",
    desc: "I develop advanced AI systems using LLM fine-tuning, RAG, and multi-agent architectures for real-world automation.",
    items: [
      { num: "[01]", name: "LLM Fine-Tuning", sub: "(LLaMA-3, QLoRA, LoRA, PEFT)" },
      { num: "[02]", name: "Agentic AI Systems", sub: "(LangGraph, LangChain, Multi-Agent Workflows)" },
      { num: "[03]", name: "Training Optimization", sub: "(TRL, Accelerate, bitsandbytes, Mixed Precision)" }
    ]
  },
  {
    id: "03",
    title: "FullStack Development",
    desc: "I build scalable web applications with clean frontend, secure backend, and production-ready deployment.",
    items: [
      { num: "[01]", name: "Frontend Development", sub: "(React, Streamlit, HTML, CSS, Interactive UI)" },
      { num: "[02]", name: "Backend Engineering", sub: "(FastAPI, Flask, REST APIs, Auth Systems)" },
      { num: "[03]", name: "Database & Deployment", sub: "(MongoDB, MySQL, Vercel, Render, Docker)" }
    ]
  },
  {
    id: "04",
    title: "API Building & Integration",
    desc: "I design efficient APIs and integrate services to automate workflows and connect intelligent systems.",
    items: [
      { num: "[01]", name: "REST API Development", sub: "(FastAPI, Flask, Async APIs)" },
      { num: "[02]", name: "Service Integrations", sub: "(Gemini, Groq, Tavily, Google APIs)" },
      { num: "[03]", name: "Automation Pipelines", sub: "(PDF/Excel Parsing, OCR, Data Extraction)" }
    ]
  }
];

export default function PinnedGames() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    const pinCards = gsap.utils.toArray(".pin-card") as HTMLElement[];

    pinCards.forEach((eachCard, index) => {
      if (index < pinCards.length - 1) {
        ScrollTrigger.create({
          trigger: eachCard,
          start: "top top",
          endTrigger: pinCards[pinCards.length - 1],
          end: "top top",
          pin: true,
          pinSpacing: false
        });

        ScrollTrigger.create({
          trigger: pinCards[index + 1],
          start: "top bottom",
          end: "top top",
          onUpdate: (self) => {
            const progress = self.progress;
            gsap.set(eachCard, {
              scale: 1 - progress * 0.25,
              rotation: index % 2 === 0 ? progress * 5 : -progress * 5,
              rotationX: index % 2 === 0 ? progress * 40 : -progress * 40,
            });
            const overlay = eachCard.querySelector(".overlay");
            if (overlay) {
              gsap.set(overlay, {
                opacity: progress * 0.4
              });
            }
          }
        });
      }
    });
  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="relative w-full bg-[#e5e5e5] text-[#111] overflow-hidden font-sans">
      
      {servicesData.map((service, i) => (
        <section key={service.id} className="pin-card relative w-full min-h-screen bg-[#e5e5e5] flex flex-col justify-center px-6 md:px-[12vw] py-[10vh] border-b border-black/10 [perspective:1000px] will-change-transform">
          <div className="overlay absolute inset-0 bg-black opacity-0 pointer-events-none z-10" />
          
          <div className="w-full max-w-[1200px] mx-auto z-20 flex flex-col items-start mt-12 md:mt-0">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-[#111] mb-6">{service.title}</h2>
            <p className="text-lg md:text-xl lg:text-2xl font-semibold text-[#444] mb-12 max-w-[800px] leading-relaxed">
              {service.desc}
            </p>
            <div className="w-full flex flex-col border-t border-black/20">
              {service.items.map((item, idx) => (
                <div key={idx} className="flex flex-row items-start py-6 md:py-8 border-b border-black/20 w-full group hover:bg-black/5 transition-colors cursor-default">
                  <span className="text-[#a02128] font-mono text-sm md:text-base mr-6 md:mr-12 mt-1 font-bold">{item.num}</span>
                  <div className="flex flex-col">
                    <h3 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight text-[#111]">{item.name}</h3>
                    <p className="text-[#222] text-sm font-semibold md:text-base mt-2">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
