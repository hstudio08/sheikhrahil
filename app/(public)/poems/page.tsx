import { Metadata } from "next";
import { getAllPublishedPoems } from "@/lib/firebase/db-poems";
import { PoemsArchive } from "@/components/public/PoemsArchive";

export const revalidate = 0; // ISR: Revalidate every hour

export const metadata: Metadata = {
  title: "Poems | Sheikh Rahil",
  description: "Explore the complete archive of poetry and written prose by Sheikh Rahil.",
  openGraph: {
    title: "Poems | Sheikh Rahil",
    description: "Explore the complete archive of poetry and written prose by Sheikh Rahil.",
    url: "https://sheikhrahil.com/poems",
    type: "website",
  },
};

export default async function PoemsPage() {
  const poems = await getAllPublishedPoems();

  return (
    <div className="min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Header */}
        <header className="space-y-6 text-center max-w-2xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-serif text-primary tracking-tight">
            The Archive
          </h1>
          <p className="font-body text-lg text-muted-foreground leading-relaxed">
            A complete collection of published poetry. Browse chronologically, 
            filter by year, or search for a specific word or title.
          </p>
        </header>

        {/* Interactive Client Component */}
        <PoemsArchive initialPoems={poems} />
        
      </div>
    </div>
  );
}