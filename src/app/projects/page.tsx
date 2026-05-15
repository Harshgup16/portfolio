"use client";

import ProjectShowcase from "@/components/ProjectShowcase";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";

export default function ProjectsPage() {
  return (
    <main className="relative w-full overflow-x-hidden bg-[#e5e5e5] text-[#141414]">
      <ProjectShowcase />
      <Footer />
      <BottomNav />
    </main>
  );
}
