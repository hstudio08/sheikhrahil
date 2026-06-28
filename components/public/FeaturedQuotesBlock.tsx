"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function FeaturedQuotesBlock({ quotes }: { quotes: any[] }) {
  const [current, setCurrent] = useState(0);
  const [animState, setAnimState] = useState<"idle" | "exit" | "enter">("idle");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const goTo = useCallback((next: number) => {
    if (next === current || animState !== "idle") return;
    setAnimState("exit");
    setTimeout(() => {
      setCurrent(next);
      setAnimState("enter");
      setTimeout(() => setAnimState("idle"), 500);
    }, 400);
  }, [current, animState]);

  const startInterval = useCallback(() => {
    if (quotes.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setCurrent((c) => {
        const next = (c + 1) % quotes.length;
        goTo(next);
        return c; // Prevents immediate state change, allowing goTo to handle the transition
      });
    }, 2000); // 2 seconds as requested
  }, [quotes.length, goTo]);

  useEffect(() => {
    startInterval();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startInterval]);

  if (!quotes || quotes.length === 0) return null;

  const quote = quotes[current];

  const slideClass =
    animState === "exit"
      ? "opacity-0 -translate-y-4"
      : animState === "enter"
      ? "opacity-0 translate-y-4"
      : "opacity-100 translate-y-0";

  return (
    <section 
      className="w-full py-24 md:py-32 flex flex-col items-center"
      onMouseEnter={() => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }}
      onMouseLeave={startInterval}
    >
      <div className="w-full max-w-4xl mx-auto px-6 text-center flex flex-col items-center">
        
        {/* Header & Dot Indicators */}
        <div className="flex flex-col items-center gap-6 mb-12">
          <span className="font-sans text-[10px] tracking-[0.2em] uppercase text-muted-foreground font-medium">
            Featured Thoughts
          </span>

          <div className="flex gap-3">
            {quotes.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  if (intervalRef.current) clearInterval(intervalRef.current);
                  goTo(i);
                }}
                aria-label={`Quote ${i + 1}`}
                className={`transition-all duration-500 ease-in-out rounded-full ${
                  i === current
                    ? "w-8 h-1.5 bg-primary"
                    : "w-1.5 h-1.5 bg-primary/20 hover:bg-primary/50"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Quote Content */}
        <div className={`transition-all duration-500 ease-in-out min-h-[180px] flex flex-col items-center justify-center ${slideClass}`}>
          <span className="font-serif text-6xl text-primary/20 block leading-none h-10 mb-2">"</span>
          <p className="font-serif text-2xl md:text-4xl leading-tight text-primary font-normal max-w-3xl">
            {quote.quote || quote.text}
          </p>
          {(quote.author || quote.source) && (
            <div className="mt-8 flex flex-col items-center gap-4">
              <div className="w-8 h-px bg-primary/20" />
              <p className="font-sans text-sm uppercase tracking-widest text-muted-foreground">
                — {quote.author || quote.source}
              </p>
            </div>
          )}
        </div>

        {/* Footer Link */}
        <Link
        href="/quotes"
        className="group flex items-center gap-2 mt-16 px-5 py-2 rounded-lg bg-primary text-white font-sans text-xs uppercase tracking-[0.2em] shadow-md transition-all duration-300 hover:bg-primary/90 hover:shadow-lg"
      >
        View Archive
        <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
      </Link>

      </div>
    </section>
  );
}