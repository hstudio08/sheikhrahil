"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Quote } from "@/types";

const ROTATION_INTERVAL = 2000;

export function FeaturedQuotesSlider({ quotes }: { quotes: Quote[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setActiveIndex(0);
  }, [quotes.length]);

  useEffect(() => {
    if (quotes.length <= 1) return;

    const intervalId = window.setInterval(() => {
      setActiveIndex((currentIndex) => (currentIndex + 1) % quotes.length);
    }, ROTATION_INTERVAL);

    return () => window.clearInterval(intervalId);
  }, [quotes.length]);

  if (!quotes || quotes.length === 0) return null;

  const normalizedActiveIndex = activeIndex % quotes.length;
  const activeQuote = quotes[normalizedActiveIndex];
  const formattedDate = new Date(activeQuote.publicationDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="relative w-full overflow-hidden px-4 py-3 sm:px-6">
      <style>{`
        @keyframes featured-quote-reveal {
          from {
            opacity: 0;
            transform: translateY(6px);
            filter: blur(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
            filter: blur(0);
          }
        }

        .featured-quote-reveal {
          animation: featured-quote-reveal 500ms cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @media (prefers-reduced-motion: reduce) {
          .featured-quote-reveal {
            animation: none;
          }
        }
      `}</style>

      <div
        key={activeQuote.id}
        className="featured-quote-reveal relative mx-auto w-full max-w-3xl"
      >
        <div className="relative min-h-[150px] overflow-hidden rounded-lg border border-black/5 bg-white/70 shadow-[0_10px_35px_-28px_rgba(0,0,0,0.55)] backdrop-blur-md sm:min-h-[165px]">
          {activeQuote.backgroundImage?.url ? (
            <>
              <Image
                src={activeQuote.backgroundImage.url}
                alt={`Quote by ${activeQuote.author || "Sheikh Rahil"}`}
                fill
                className="object-cover opacity-10 transition-transform duration-1000 ease-out"
                sizes="(max-width: 768px) 100vw, 768px"
              />
              <div className="absolute inset-0 bg-gradient-to-br from-white/95 via-white/85 to-muted/70" />
            </>
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-white via-muted/40 to-background" />
          )}

          <Link
            href={`/quotes/${activeQuote.slug}`}
            className="group/card relative z-10 flex min-h-[150px] flex-col justify-between gap-5 p-5 transition-colors sm:min-h-[165px] sm:p-6"
          >
            <div className="space-y-4">
              <div className="h-px w-12 bg-primary/20 transition-all duration-500 group-hover/card:w-16 group-hover/card:bg-primary/35" />

              <blockquote className="line-clamp-2 font-serif text-xl leading-snug text-primary transition-colors group-hover/card:text-primary/75 sm:text-2xl">
                "{activeQuote.quote}"
              </blockquote>
            </div>

            <div className="flex flex-col gap-3 border-t border-primary/10 pt-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="font-sans text-[9px] uppercase tracking-widest text-muted-foreground">
                <span>{activeQuote.author || "Sheikh Rahil"}</span>
                <span className="mx-2 inline-block h-1 w-1 rounded-full bg-muted-foreground/40 align-middle" />
                <span>{formattedDate}</span>
              </div>

              {quotes.length > 1 && (
                <div className="flex items-center gap-1.5" aria-hidden="true">
                  {quotes.map((quote, index) => (
                    <span
                      key={quote.id}
                      className={`h-1 rounded-full transition-all duration-500 ${
                        index === normalizedActiveIndex
                          ? "w-5 bg-primary"
                          : "w-1 bg-primary/25"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
