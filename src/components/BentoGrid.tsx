"use client";

import React from "react";

/* ------------------------------------------------------------------ */
/*  Grid cell types                                                     */
/* ------------------------------------------------------------------ */
type LogoCell = { type: "logo"; name: string; img?: string };
type StatCell = { type: "stat"; value: string; label: string; sub: string };
type ImageCell = { type: "image"; gradient: string };

type Cell = LogoCell | StatCell | ImageCell;

/* ------------------------------------------------------------------ */
/*  Data — swap with your real logos / stats later                      */
/* ------------------------------------------------------------------ */
const cells: Cell[] = [
  // Row 1 (AI & ML focus)
  { type: "logo", name: "TensorFlow", img: "/experties/tensorflow.png" },
  { type: "logo", name: "PyTorch", img: "/experties/pytorch.png" },
  { type: "logo", name: "LangChain", img: "/experties/langchain.png" },
  { type: "logo", name: "LangGraph", img: "/experties/langgraph.png" },
  { type: "logo", name: "Hugging Face", img: "/experties/hugging face.png" },
  { type: "logo", name: "Streamlit", img: "/experties/streamlit.png" },

  // Row 2 (Backend & Databases)
  { type: "logo", name: "Python", img: "/experties/python.png" },
  { type: "logo", name: "FastAPI", img: "/experties/fastapi.png" },
  { type: "logo", name: "Flask", img: "/experties/flask.png" },
  { type: "logo", name: "MongoDB", img: "/experties/mongo db.png" },
  { type: "logo", name: "Supabase", img: "/experties/supabase.png" },
  { type: "logo", name: "Docker", img: "/experties/docker.png" },

  // Row 3 (Frontend & Tools)
  { type: "logo", name: "Next.js", img: "/experties/next js.png" },
  { type: "logo", name: "React", img: "/experties/react.png" },
  { type: "logo", name: "Tailwind CSS", img: "/experties/tailwind css.png" },
  { type: "logo", name: "GSAP", img: "/experties/gsap.png" },
  { type: "logo", name: "Three.js", img: "/experties/three js.png" },
  { type: "logo", name: "GitHub", img: "/experties/github.png" },
];

/* ------------------------------------------------------------------ */
/*  Individual cell renderers                                           */
/* ------------------------------------------------------------------ */
function LogoTile({ cell }: { cell: LogoCell }) {
  return (
    <div className="w-full h-full flex items-center justify-center p-4">
      {cell.img ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={cell.img} alt={cell.name} className="max-w-[80%] max-h-[80%] object-contain" />
      ) : (
        <span className="text-sm md:text-base font-bold tracking-wide text-[#111] uppercase text-center leading-tight">
          {cell.name}
        </span>
      )}
    </div>
  );
}

function StatTile({ cell }: { cell: StatCell }) {
  return (
    <div className="w-full h-full flex flex-col justify-end p-5">
      <h3 className="text-[3rem] md:text-[3.5rem] font-black leading-none tracking-tight text-[#111] mb-2 font-serif italic">
        {cell.value}
      </h3>
      <p className="text-sm md:text-base font-semibold text-[#111] leading-snug">
        {cell.label}
      </p>
      <p className="text-xs md:text-sm text-[#777] mt-1 leading-snug">
        {cell.sub}
      </p>
    </div>
  );
}

function ImageTile({ cell }: { cell: ImageCell }) {
  return (
    <div
      className="w-full h-full"
      style={{ background: cell.gradient }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                           */
/* ------------------------------------------------------------------ */
export default function BentoGrid() {
  return (
    <section className="w-full bg-[#e5e5e5]">
      <div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 w-full"
        style={{
          gridAutoRows: "minmax(140px, 1fr)",
        }}
      >
        {cells.map((cell, i) => (
          <div
            key={i}
            className="relative border border-black/10 aspect-square sm:aspect-auto overflow-hidden transition-all duration-300 hover:bg-black/[0.03]"
          >
            {cell.type === "logo" && <LogoTile cell={cell} />}
            {cell.type === "stat" && <StatTile cell={cell} />}
            {cell.type === "image" && <ImageTile cell={cell} />}
          </div>
        ))}
      </div>
    </section>
  );
}
