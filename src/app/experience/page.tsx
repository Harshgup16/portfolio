"use client";

import ExperienceShowcase from "@/components/ExperienceShowcase";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";

export default function ExperiencePage() {
  return (
    <main className="relative w-full overflow-x-hidden bg-[#e5e5e5] text-[#141414]">
      <ExperienceShowcase />
      <Footer />
      <BottomNav />
    </main>
  );
}
