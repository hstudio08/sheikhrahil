"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/poems", label: "Poems" },
  { href: "/quotes", label: "Quotes" },
  { href: "/contact", label: "Contact" },
];

export function PublicNavbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // High-performance scroll listener using requestAnimationFrame 
  // Ensures we don't block the main thread or cause layout thrashing
  React.useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu automatically on route change
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Floating Liquid Glass Navbar
        - fixed top-6 for floating effect
        - backdrop-blur-md + bg-white/60 for liquid glassmorphism
        - border-black/10 & shadow for the slight dark boundary effect
      */}
      <header
        className={cn(
          "fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-5xl z-50 transition-all duration-500 ease-out rounded-full",
          isScrolled 
            ? "bg-white/60 backdrop-blur-md border border-black/10 shadow-[0_8px_30px_rgba(0,0,0,0.06)] py-3" 
            : "bg-white/30 backdrop-blur-sm border border-black/5 shadow-sm py-4 hover:bg-white/50"
        )}
      >
        <div className="px-6 md:px-8 flex items-center justify-between">
          
          {/* Logo / Author Name */}
          <Link 
            href="/" 
            className="font-serif text-xl tracking-wide text-primary hover:opacity-70 transition-opacity"
          >
            Sheikh Rahil
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "font-sans text-xs uppercase tracking-widest transition-all duration-300",
                    isActive 
                      ? "text-primary font-medium" 
                      : "text-muted-foreground hover:text-primary"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-primary focus:outline-none hover:opacity-70 transition-opacity"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={20} strokeWidth={1.5} /> : <Menu size={20} strokeWidth={1.5} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="fixed inset-x-4 top-24 z-40 bg-white/80 backdrop-blur-xl border border-black/10 shadow-2xl rounded-2xl p-6 md:hidden flex flex-col space-y-2"
          >
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "font-sans text-sm uppercase tracking-widest transition-colors block py-3 border-b border-border/40 last:border-0",
                    isActive 
                      ? "text-primary font-medium" 
                      : "text-muted-foreground hover:text-primary hover:bg-black/5 rounded-md px-2 -mx-2"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}