import Image from "next/image";
import Link from "next/link";
import { Quote } from "@/types";
import { Heart, Share2 } from "lucide-react";

interface QuoteCardProps {
  quote: Quote;
}

export function QuoteCard({ quote }: QuoteCardProps) {
  // Format date natively for performance (e.g., "October 12, 2023")
  const formattedDate = new Date(quote.publicationDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="group relative flex flex-col justify-between p-8 sm:p-12 border border-border bg-background hover:border-primary/20 transition-colors min-h-[400px] overflow-hidden">
      {/* Optional Background Image with Overlay */}
      {quote.backgroundImage && (
        <>
          <Image
            src={quote.backgroundImage.url}
            alt={quote.backgroundImage.altText || "Quote Background"}
            fill
            className="object-cover opacity-10 group-hover:opacity-20 transition-opacity duration-500 z-0"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-0" />
        </>
      )}

      {/* Quote Content */}
      <div className="relative z-10 flex-grow flex items-center justify-center">
        <blockquote className="space-y-6 text-center">
          <p className="font-serif text-2xl sm:text-3xl lg:text-4xl leading-relaxed text-primary">
            "{quote.quote}"
          </p>
          <footer className="font-sans text-xs uppercase tracking-widest text-muted-foreground">
            — {quote.author}
          </footer>
        </blockquote>
      </div>

      {/* Footer / Meta */}
      <div className="relative z-10 flex items-center justify-between pt-8 mt-8 border-t border-border/50">
        <span className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground">
          {formattedDate}
        </span>
        
        <div className="flex items-center gap-4 text-muted-foreground">
          <button aria-label="Like Quote" className="hover:text-primary transition-colors">
            <Heart className="w-4 h-4" />
          </button>
          <button aria-label="Share Quote" className="hover:text-primary transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
          <Link 
            href={`/quotes/${quote.slug}`}
            className="font-sans text-[10px] uppercase tracking-widest hover:text-primary transition-colors ml-4 border-l border-border/50 pl-4"
          >
            Read More
          </Link>
        </div>
      </div>
    </div>
  );
}