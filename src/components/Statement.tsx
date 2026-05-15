// import Copy from './Copy';
import React from 'react';

export default function Statement() {
  return (
    <section id="about" className="relative w-full min-h-screen bg-[#e5e5e5] text-black flex flex-col justify-between py-8 px-6 md:py-12 md:px-12 overflow-hidden font-sans">
      {/* Top spacing */}
      <div className="flex-1"></div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center space-y-16 md:space-y-32 w-full">
        {/* Row 1 */}
        <div className="flex items-start justify-between w-full max-w-[1000px] mx-auto px-4 md:px-0">
          <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-black mt-5 md:mt-6"></div>
          <p className="text-3xl md:text-5xl lg:text-[48px] font-medium tracking-tight text-center leading-tight">
            Intelligence shapes the future<br className="hidden md:block"/> not through code alone, but through<br className="hidden md:block"/> systems that learn, reason, and adapt.
          </p>
          <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-black mt-5 md:mt-6"></div>
        </div>

        {/* Row 2 */}
        <div className="flex items-start justify-between w-full max-w-[1000px] mx-auto px-4 md:px-0">
          <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-black mt-5 md:mt-6"></div>
          <p className="text-3xl md:text-5xl lg:text-[48px] font-medium tracking-tight text-center leading-tight">
            It defines how problems are<br className="hidden md:block"/> understood, automated, and<br className="hidden md:block"/>solved at scale.
          </p>
          <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-black mt-5 md:mt-6"></div>
        </div>

        {/* Row 3 */}
        <div className="flex items-start justify-between w-full max-w-[1000px] mx-auto px-4 md:px-0">
          <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-black mt-5 md:mt-6"></div>
          <p className="text-3xl md:text-5xl lg:text-[48px] font-medium tracking-tight text-center leading-tight">
            Create yours.
          </p>
          <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-black mt-5 md:mt-6"></div>
        </div>
      </div>

      
      {/* <div className="flex-1"></div>

      <div className="w-full flex flex-col md:flex-row justify-between items-end pb-2 md:pb-6 text-xs tracking-widest font-mono">
        
        <div className="flex items-end space-x-12 mb-8 md:mb-0">
         
          <div className="flex items-center space-x-2 cursor-pointer group pb-1">
            <div className="w-0 h-0 border-t-[5px] border-t-transparent border-l-[8px] border-l-black border-b-[5px] border-b-transparent group-hover:translate-x-1 transition-transform"></div>
            <span className="font-sans font-medium capitalize text-sm md:text-base">Works</span>
          </div>
        </div>
      </div> */}
    </section>
  );
}
