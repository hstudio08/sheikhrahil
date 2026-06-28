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
  { href: "/about", label: "About" }, // Added assuming you have this from the layout!
  { href: "/contact", label: "Contact" },
];

export function PublicNavbar() {
  const pathname = usePathname();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  // High-performance scroll listener
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

  // Prevent scrolling when mobile menu is open
  React.useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Floating Liquid Glass Navbar */}
      <header
        className={cn(
          "fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-5xl z-50 transition-all duration-500 ease-out rounded-full",
          isScrolled 
            ? "bg-background/70 backdrop-blur-lg border border-border/50 shadow-[0_8px_30px_rgba(0,0,0,0.08)] py-3" 
            : "bg-background/40 backdrop-blur-sm border border-border/20 shadow-sm py-4 hover:bg-background/60"
        )}
      >
        <div className="px-6 md:px-8 flex items-center justify-between">
          
          {/* Logo / Author Name */}
          <Link href="/" className="outline-none">
            <motion.span 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.95 }}
              className="inline-block font-serif text-xl tracking-wide text-primary transition-colors"
            >
              Sheikh Rahil
            </motion.span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {NAV_LINKS.map((link) => {
              const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="relative px-4 py-2 group outline-none"
                >
                  <motion.span 
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      "relative z-10 font-sans text-[11px] font-semibold uppercase tracking-[0.2em] transition-colors duration-300",
                      isActive 
                        ? "text-primary" 
                        : "text-muted-foreground group-hover:text-primary"
                    )}
                  >
                    {link.label}
                  </motion.span>
                  
                  {/* Smooth sliding active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="desktop-nav-active-pill"
                      className="absolute inset-0 bg-primary/5 rounded-full -z-0"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Menu Toggle */}
          <motion.button
            whileTap={{ scale: 0.85 }}
            className="md:hidden p-2 -mr-2 text-primary focus:outline-none rounded-full bg-primary/0 hover:bg-primary/5 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            <AnimatePresence mode="wait">
              {isMobileMenuOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <X size={20} strokeWidth={1.5} />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                  <Menu size={20} strokeWidth={1.5} />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Darken background slightly */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-background/20 backdrop-blur-sm z-40 md:hidden"
            />
            
            {/* Dropdown Card */}
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="fixed inset-x-4 top-24 z-50 bg-background/90 backdrop-blur-xl border border-border/50 shadow-2xl rounded-3xl p-4 md:hidden flex flex-col overflow-hidden"
            >
              {NAV_LINKS.map((link, index) => {
                const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));
                return (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 + 0.1 }}
                    key={link.href}
                  >
                    <Link
                      href={link.href}
                      className={cn(
                        "relative flex items-center p-4 rounded-2xl transition-all duration-300 overflow-hidden active:scale-[0.98]",
                        isActive 
                          ? "bg-primary/5 text-primary" 
                          : "text-muted-foreground hover:text-primary hover:bg-muted/50"
                      )}
                    >
                      <span className="relative z-10 font-sans text-sm font-semibold uppercase tracking-[0.2em]">
                        {link.label}
                      </span>
                      
                      {isActive && (
                        <motion.div 
                          layoutId="mobile-nav-active-indicator"
                          className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-r-full" 
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}