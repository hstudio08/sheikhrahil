import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getQuoteBySlug } from "@/lib/firebase/db-quotes";
import { ShareMenu } from "@/components/public/ShareMenu";
import { Heart, ArrowLeft } from "lucide-react";
import { LikeButton } from "@/components/public/LikeButton";


export const revalidate = 3600;

interface QuotePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: QuotePageProps): Promise<Metadata> {
  const { slug } = await params;
  const quote = await getQuoteBySlug(slug);

  if (!quote) {
    return { title: "Quote Not Found" };
  }

  // Ensure the description is plain text for SEO
  const description = quote.seoDescription || `"${quote.quote.slice(0, 150)}..." - ${quote.author}`;

  return {
    title: quote.seoTitle || `Quote by ${quote.author} | Sheikh Rahil`,
    description,
    openGraph: {
      title: quote.seoTitle || `Quote by ${quote.author}`,
      description,
      url: `https://sheikhrahil.com/quotes/${slug}`,
      type: "article",
      images: quote.backgroundImage ? [quote.backgroundImage.url] : [],
    },
  };
}

export default async function SingleQuotePage({ params }: QuotePageProps) {
  const { slug } = await params;
  const quote = await getQuoteBySlug(slug);

  if (!quote) {
    notFound();
  }

  const formattedDate = new Date(quote.publicationDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen pt-32 pb-24 flex flex-col items-center justify-center">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <Link href="/quotes" className="inline-flex items-center gap-2 font-sans text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Archive
        </Link>

        <div className="relative border border-border bg-background p-12 sm:p-20 overflow-hidden min-h-[50vh] flex flex-col justify-center">
          {quote.backgroundImage && (
            <>
              <Image
                src={quote.backgroundImage.url}
                alt={quote.backgroundImage.altText || "Quote Background"}
                fill
                className="object-cover opacity-10 z-0"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent z-0" />
            </>
          )}

          <div className="relative z-10 space-y-12 text-center">
            <blockquote className="space-y-8">
              <p className="font-serif text-3xl sm:text-4xl md:text-5xl leading-relaxed text-primary">
                "{quote.quote}"
              </p>
              <footer className="font-sans text-xs uppercase tracking-widest text-muted-foreground">
                — {quote.author}
              </footer>
            </blockquote>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 pt-12 border-t border-border/50">
              <span className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground">
                {formattedDate}
              </span>
              
              <div className="flex items-center gap-6">
                <button aria-label="Like Quote" className="flex items-center gap-2 hover:text-primary transition-colors text-muted-foreground">
                  <LikeButton targetId={quote.id} />
                  <span className="font-sans text-[10px] uppercase tracking-widest">Like</span>
                </button>
                <ShareMenu title={`Quote by ${quote.author}`} url={`https://sheikhrahil.com/quotes/${slug}`} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}