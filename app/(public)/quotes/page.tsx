import { Metadata } from "next";
import { getAllPublishedQuotes } from "@/lib/firebase/db-quotes";
import { QuotesArchive } from "@/components/public/QuotesArchive";

export const revalidate = 3600; // ISR: Revalidate every hour

export const metadata: Metadata = {
  title: "Quotes | Sheikh Rahil",
  description: "A collection of contemplations, thoughts, and selected quotes by Sheikh Rahil.",
  openGraph: {
    title: "Quotes | Sheikh Rahil",
    description: "A collection of contemplations, thoughts, and selected quotes by Sheikh Rahil.",
    url: "https://sheikhrahil.com/quotes",
    type: "website",
  },
};

export default async function QuotesPage() {
  const quotes = await getAllPublishedQuotes();

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <header className="space-y-6 text-center max-w-2xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-serif text-primary tracking-tight">
            Contemplations
          </h1>
          <p className="font-body text-lg text-muted-foreground leading-relaxed">
            A repository of isolated thoughts and excerpts. Browse the complete collection, 
            filter chronologically, or search for a specific passage.
          </p>
        </header>

        {/* Interactive Client Component */}
        <QuotesArchive initialQuotes={quotes} />
        
      </div>
    </div>
  );
}