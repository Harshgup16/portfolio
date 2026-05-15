"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import Logo from "./Logo";

export default function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const linksRef = useRef<(HTMLAnchorElement | null)[]>([]);
  const headerRef = useRef<HTMLDivElement>(null);
  const footerRef = useRef<HTMLDivElement>(null);

  // Scroll visibility logic
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Hide if scrolling down past 50px, show if scrolling up
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  // Disable body scroll when menu is open and trigger animations
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";

      // Header fades in
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 1.0, ease: "expo.out", delay: 0.4 }
      );

      // Links reveal (slide up and fade)
      gsap.fromTo(
        linksRef.current,
        { y: "120%", opacity: 0, rotate: 3 },
        { y: "0%", opacity: 1, rotate: 0, duration: 1.2, stagger: 0.15, ease: "expo.out", delay: 0.45 }
      );

      // Footer fades in
      gsap.fromTo(
        footerRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.0, ease: "expo.out", delay: 0.6 }
      );

    } else {
      document.body.style.overflow = "";
    }
    
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Reset links ref to avoid duplicates on re-renders
  linksRef.current = [];
  const addToLinks = (el: HTMLAnchorElement | null) => {
    if (el && !linksRef.current.includes(el)) {
      linksRef.current.push(el);
    }
  };

  return (
    <>
      {/* Persistent Global Logo (Always Visible) */}
      <div className="fixed top-6 left-6 md:top-8 md:left-8 z-[45] mix-blend-difference text-white pointer-events-auto">
        <Link href="/">
          <Logo filled className="w-16 h-16 md:w-32 md:h-32" />
        </Link>
      </div>

      {/* Smart Hide-on-Scroll Navbar Container */}
      <header className={`fixed top-0 left-0 w-full z-40 pointer-events-none mix-blend-difference transition-transform duration-[600ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${isVisible ? 'translate-y-0' : '-translate-y-[250px]'}`}>

        {/* Trigger Button (Mobile Only) */}
        <button
          onClick={() => setIsOpen(true)}
          className="md:hidden absolute top-6 right-6 h-12 flex items-center text-white text-sm font-semibold tracking-widest uppercase hover:text-gray-300 transition-colors pointer-events-auto"
        >
          Menu
        </button>

        {/* Desktop Center Links */}
        <div className="hidden md:flex absolute top-12 left-1/2 -translate-x-1/2 text-white gap-10 lg:gap-16 font-semibold text-lg tracking-wide pointer-events-auto">
          {[
            { name: "About", href: "/#about" },
            { name: "Experience", href: "/experience" },
            { name: "Projects", href: "/projects" },
            { name: "Certificates", href: "/certificates" },
            { name: "Reach out", href: "mailto:hkgupta160420@gmail.com" },
          ].map((link) => {
            const isMailto = link.href.startsWith("mailto:");
            const LinkContent = (
              <div className="relative overflow-hidden">
                <div className="transition-transform duration-[600ms] ease-[cubic-bezier(0.76,0,0.24,1)] group-hover:-translate-y-full">
                  <span className="block leading-tight">{link.name}</span>
                  <span className="absolute top-full left-0 block leading-tight">{link.name}</span>
                </div>
              </div>
            );

            if (isMailto) {
              return (
                <a key={link.name} href={link.href} className="group hover-underline inline-block pb-0.5">
                  {LinkContent}
                </a>
              );
            }

            return (
              <Link key={link.name} href={link.href} className="group hover-underline inline-block pb-0.5">
                {LinkContent}
              </Link>
            );
          })}
        </div>

        {/* Desktop Right (Discover + Animated Line) */}
        <div className="hidden md:flex absolute top-10 right-10 text-white items-start gap-6 text-lg font-semibold pointer-events-auto">
          <span className="mt-1">Discover</span>
          {/* Animated Line Container */}
          <div className="relative w-[1px] h-20 bg-white/20 overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-[40%] bg-white animate-[scrollDown_2.5s_ease-in-out_infinite]" />
          </div>
        </div>

      </header>

      {/* Fullscreen Overlay */}
      <div 
        className={`fixed inset-0 z-50 bg-[#111111] text-white flex flex-col transition-transform duration-[900ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${
          isOpen ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* Top Header */}
        <div ref={headerRef} className="flex justify-between items-center p-6 md:p-8 text-sm font-medium">
          <span className="text-xl md:text-2xl font-bold tracking-wide">Harsh Gupta</span>
          <button onClick={() => setIsOpen(false)} className="text-xs hover:text-gray-300 transition-colors uppercase tracking-widest">
            Close
          </button>
        </div>

        {/* Main Links */}
        <div className="flex-1 flex flex-col justify-center px-8 gap-4 mt-12">
          <div className="overflow-hidden p-2 -m-2">
            <Link ref={addToLinks} href="/projects" onClick={() => setIsOpen(false)} className="block text-5xl font-medium tracking-tight hover:text-gray-300 transition-colors transform-gpu origin-left">
              Projects
            </Link>
          </div>
          <div className="overflow-hidden p-2 -m-2">
            <Link ref={addToLinks} href="/experience" onClick={() => setIsOpen(false)} className="block text-5xl font-medium tracking-tight hover:text-gray-300 transition-colors transform-gpu origin-left">
              Experience
            </Link>
          </div>
          <div className="overflow-hidden p-2 -m-2">
            <Link ref={addToLinks} href="/certificates" onClick={() => setIsOpen(false)} className="block text-5xl font-medium tracking-tight hover:text-gray-300 transition-colors transform-gpu origin-left">
              Certificates
            </Link>
          </div>
          <div className="overflow-hidden p-2 -m-2">
            <Link ref={addToLinks} href="/#about" onClick={() => setIsOpen(false)} className="block text-5xl font-medium tracking-tight hover:text-gray-300 transition-colors transform-gpu origin-left">
              About
            </Link>
          </div>
          <div className="overflow-hidden p-2 -m-2">
            <a href="mailto:hkgupta160420@gmail.com" onClick={() => setIsOpen(false)} className="block text-5xl font-medium tracking-tight hover:text-gray-300 transition-colors transform-gpu origin-left">
              Reach out
            </a>
          </div>
        </div>

        {/* Footer */}
        <div ref={footerRef} className="p-8 pb-12 flex flex-col gap-4">
          <span className="text-gray-500 text-sm">Socials</span>
          <div className="flex gap-6 text-sm font-medium">
            <a href="https://www.linkedin.com/in/harshgup16/" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">LinkedIn</a>
            <a href="https://github.com/Harshgup16" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">Github</a>
            <a href="#" target="_blank" rel="noopener noreferrer" className="hover:text-gray-300 transition-colors">Codeforces</a>
          </div>
        </div>
      </div>
    </>
  );
}
