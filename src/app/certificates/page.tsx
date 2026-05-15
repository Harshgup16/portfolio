"use client";

import CertificateShowcase from "@/components/CertificateShowcase";
import Footer from "@/components/Footer";
import BottomNav from "@/components/BottomNav";

export default function CertificatesPage() {
  return (
    <main className="relative w-full overflow-x-hidden bg-[#e5e5e5] text-[#141414]">
      <CertificateShowcase />
      <Footer />
      <BottomNav />
    </main>
  );
}
