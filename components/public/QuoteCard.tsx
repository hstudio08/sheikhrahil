"use client";

import Image from "next/image";
import Link from "next/link";
import { Quote } from "@/types";
import { LikeButton } from "@/components/public/LikeButton";
import { ShareMenu } from "@/components/public/ShareMenu";

export function QuoteCard({ quote }: { quote: Quote }) {
  // Format the date elegantly
  const formattedDate = new Date(quote.publicationDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="group relative w-full flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4 sm:p-5 bg-white/60 backdrop-blur-md border border-black/5 rounded-xl shadow-[0_2px_10px_-3px_rgba(0,0,0,0.02)] hover:shadow-md hover:border-black/10 transition-all duration-300 overflow-hidden">
      
      {/* Sleek Thumbnail if image exists */}
      {quote.backgroundImage?.url && (
        <Link href={`/quotes/${quote.slug}`} className="shrink-0 relative z-10 w-full sm:w-24 h-24 sm:h-20 rounded-lg overflow-hidden border border-black/5 block group-hover:opacity-90 transition-opacity">
          <Image
            src={quote.backgroundImage.url}
            alt={`Quote by ${quote.author || "Sheikh Rahil"}`}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, 96px"
          />
        </Link>
      )}

      {/* Content Area */}
      <div className="flex-1 min-w-0 space-y-2 relative z-10">
        <Link href={`/quotes/${quote.slug}`} className="block">
          <blockquote className="font-serif text-lg sm:text-xl text-primary leading-snug line-clamp-3 sm:line-clamp-2 group-hover:text-primary/70 transition-colors">
            "{quote.quote}"
          </blockquote>
        </Link>
        <div className="font-sans text-[10px] sm:text-xs uppercase tracking-wider text-muted-foreground flex items-center gap-2">
          <span>{quote.author || "Sheikh Rahil"}</span>
          <span className="w-1 h-1 rounded-full bg-muted-foreground/40"></span>
          <span>{formattedDate}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 shrink-0 pt-3 sm:pt-0 w-full sm:w-auto justify-end sm:justify-start border-t sm:border-t-0 border-border/50 sm:border-transparent mt-2 sm:mt-0 relative z-10">
        {/* Adjusted Props to match standard definitions */}
        <LikeButton targetId={quote.id} />
        <ShareMenu 
          url={`${typeof window !== 'undefined' ? window.location.origin : ''}/quotes/${quote.slug}`} 
          title={`Quote by ${quote.author || "Sheikh Rahil"}`} 
        />
      </div>
    </div>
  );
}

// Google-Style Blue Skeleton Loader for the Wide Layout
export function QuoteCardSkeleton() {
  return (
    <div className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4 sm:p-5 bg-white border border-blue-100/60 rounded-xl shadow-sm animate-pulse relative overflow-hidden">
      {/* Subtle blue shimmer base */}
      <div className="absolute inset-0 bg-blue-50/30 z-0 pointer-events-none"></div>

      {/* Thumbnail Skeleton */}
      <div className="relative z-10 w-full sm:w-24 h-24 sm:h-20 shrink-0 rounded-lg bg-blue-100/70" />
      
      {/* Text Skeleton */}
      <div className="relative z-10 flex-1 w-full space-y-3 py-1">
        <div className="h-4 sm:h-5 bg-blue-200/60 rounded w-full max-w-[90%]" />
        <div className="h-4 sm:h-5 bg-blue-200/60 rounded w-full max-w-[65%]" />
        <div className="h-2.5 bg-blue-200/40 rounded w-32 mt-3" />
      </div>
      
      {/* Actions Skeleton */}
      <div className="relative z-10 flex items-center gap-2 shrink-0 pt-3 sm:pt-0 w-full sm:w-auto justify-end sm:justify-start mt-2 sm:mt-0">
        <div className="h-9 w-9 rounded-full bg-blue-100/80" />
        <div className="h-9 w-9 rounded-full bg-blue-100/80" />
      </div>
    </div>
  );
}
