import React from 'react';

export default function WhatWeDo() {
  return (
    <section className="relative w-full min-h-screen bg-[#e5e5e5] text-[#111] overflow-hidden py-16 md:py-24 px-6 md:px-12 flex flex-col justify-center">
      {/* 
        NOTE: The URL provided had ellipses (...) because it was truncated when copied. 
        Please replace the URL below with the full, un-truncated link for the font to load! 
      */}
      <style dangerouslySetInnerHTML={{__html: `
        @font-face {
          font-family: 'Universo';
          src: url('https://cdn.prod.website-files.com/69aaebc…/69aaebc…_Universo-Black.woff2') format('woff2');
          font-weight: 900;
          font-style: normal;
        }
      `}} />
      
      <div className="max-w-[1600px] w-full mx-auto flex flex-col font-['Universo','Arial_Black',sans-serif]">
        
        {/* ========================================= */}
        {/* MOBILE LAYOUT (Stacked & Centered)          */}
        {/* ========================================= */}
        <div className="flex md:hidden flex-col items-center justify-center text-center w-full pb-10">
          <h1 className="text-[clamp(5rem,24vw,30vh)] font-black leading-[0.85] tracking-wider uppercase m-0 scale-x-[1.2] origin-center">WHO</h1>
          <h1 className="text-[clamp(5rem,24vw,30vh)] font-black leading-[0.85] tracking-wider uppercase m-0 scale-x-[1.2] origin-center mt-2">I</h1>
          <h1 className="text-[clamp(5rem,24vw,30vh)] font-black leading-[0.85] tracking-wider uppercase m-0 scale-x-[1.2] origin-center mt-2">AM</h1>
          
          <div className="w-full flex justify-center mt-12 font-sans px-4">
            <p className="text-[1.3rem] font-semibold leading-snug w-full max-w-[600px] tracking-wide text-[#111]">
              AI means nothing without execution. I build intelligent systems, LLM workflows, and scalable software that create impact.
            </p>
          </div>
        </div>

        {/* ========================================= */}
        {/* DESKTOP LAYOUT (Interlocking Grid)          */}
        {/* ========================================= */}
        <div className="hidden md:flex flex-col w-full">
          {/* Row 1: WHO */}
          <div className="w-full flex justify-start">
            <h1 className="text-[clamp(6rem,21vw,35vh)] font-black leading-[0.85] tracking-wider uppercase m-0 scale-x-[1.4] origin-left">WHO</h1>
          </div>

          {/* Row 2: Paragraph + I */}
          <div className="w-full flex flex-row items-center justify-between relative mt-10">
            
            {/* Paragraph */}
            <div className="w-full flex-1 flex flex-col items-start pl-[12vw] z-10 font-sans pr-8">
              <p className="text-3xl font-normal leading-snug w-full max-w-[600px] tracking-wide text-[#111]">
                AI means nothing without execution. I build intelligent systems, LLM workflows, and scalable software that create impact.
              </p>
            </div>
            
            {/* I */}
            <div className="w-auto flex justify-end pr-[10vw]">
              <h1 className="text-[clamp(6rem,21vw,35vh)] font-black leading-[0.85] tracking-wider uppercase m-0 scale-x-[1.4] origin-right">I</h1>
            </div>
          </div>

          {/* Row 3: AM */}
          <div className="w-full flex justify-start pl-[16vw] mt-6">
            <h1 className="text-[clamp(6rem,21vw,35vh)] font-black leading-[0.85] tracking-wider uppercase m-0 scale-x-[1.4] origin-left">AM</h1>
          </div>
        </div>

      </div>
    </section>
  );
}
