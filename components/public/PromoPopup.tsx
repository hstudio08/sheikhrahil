"use client";

import { useState, useEffect } from "react";

export function PromoPopup() {
  const [isMounted, setIsMounted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Trigger the popup exactly 5 seconds after the website loads
    // Because we removed sessionStorage, this timer will run on EVERY refresh or revisit
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    // Wait for the fade-out animation to complete before removing from DOM
    setTimeout(() => setIsClosed(true), 500); 
  };

  // Prevent hydration mismatch and hide if closed
  if (!isMounted || isClosed) return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-500 ease-in-out ${
        isVisible 
          ? "opacity-100 backdrop-blur-md bg-black/30 pointer-events-auto" 
          : "opacity-0 backdrop-blur-none bg-black/0 pointer-events-none"
      }`}
    >
      {/* Glassmorphism / Liquid Morphism Container */}
      <div 
        className={`relative w-[90%] max-w-md overflow-hidden rounded-[2rem] border border-white/50 border-b-white/20 border-r-white/20 bg-gradient-to-br from-[#8fe1f7]/40 via-[#8fe1f7]/10 to-sky-300/20 p-8 text-center shadow-[0_20px_40px_-10px_rgba(143,225,247,0.4)] backdrop-blur-2xl transition-all duration-700 ease-out transform ${
          isVisible ? "translate-y-0 scale-100 opacity-100" : "translate-y-12 scale-95 opacity-0"
        }`}
      >
        {/* 1. Liquid Inner Light Reflection */}
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/30 pointer-events-none" />

        {/* 2. Soft Grainy Texture Overlay */}
        <div 
          className="absolute inset-0 opacity-[0.25] mix-blend-overlay pointer-events-none" 
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }}
        />
        
        {/* 3. Content Wrapper (Keeps your text/buttons above the grain and reflections) */}
        <div className="relative z-10">
          
          {/* Close Button */}
          <button 
            onClick={handleClose}
            className="absolute -top-2 -right-2 text-white/70 hover:text-white transition-colors focus:outline-none"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>

          {/* Company Logo / Branding */}
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-white/20 shadow-[inset_0_2px_10px_rgba(255,255,255,0.4)] backdrop-blur-md">
            <img
              src="https://res.cloudinary.com/dpqsadqxj/image/upload/q_auto/f_auto/v1780941361/logo_p83oao_oke7zd0000_sdggc1.webp"
              alt="Qurevo Technologies Logo"
              className="w-8 h-8 object-contain drop-shadow-md"
            />
          </div>

          {/* Text Content */}
          <h3 className="mb-2 font-serif text-2xl font-semibold text-white drop-shadow-sm">
            Want a Website?
          </h3>
          <p className="mb-6 font-sans text-sm text-sky-50 leading-relaxed drop-shadow-sm">
            Personal Portfolio, Business Site, EdTech Platform, or a scalable E-Commerce store—we build digital experiences that perform.
          </p>

          {/* Call to Action Button */}
          <a
            href="https://qurevo.in"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClose}
            className="inline-block w-full rounded-xl bg-white/90 px-6 py-3 font-sans text-sm font-bold tracking-wide text-sky-900 transition-all hover:bg-white hover:scale-[1.02] active:scale-95 shadow-[0_5px_20px_rgba(255,255,255,0.4)]"
          >
            Visit Qurevo Technologies
          </a>
        </div>
      </div>
    </div>
  );
}