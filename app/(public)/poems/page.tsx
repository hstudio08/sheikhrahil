import { Metadata } from "next";
import { Suspense } from "react";
import { getAllPublishedPoems } from "@/lib/firebase/db-poems";
import { PoemsArchive } from "@/components/public/PoemsArchive";

export const revalidate = 0; // 0 = Always fetch fresh data on reload

export const metadata: Metadata = {
  title: "Poems | Sheikh Rahil",
  description: "Explore the complete archive of poetry and written prose by Sheikh Rahil.",
  openGraph: {
    title: "Poems | Sheikh Rahil",
    description: "Explore the complete archive of poetry and written prose by Sheikh Rahil.",
    url: "https://rahilyousuf.vercel.app/poems",
    type: "website",
  },
};

// ------------------------------------------------------------------
// 1. GEMINI-STYLE SKELETON LOADING
// ------------------------------------------------------------------
function ArchiveSkeleton() {
  const shimmer = "animate-pulse bg-primary/10 rounded-xl";
  
  return (
    <div className="w-full space-y-16">
      {/* Header Skeleton */}
      <div className="space-y-6 max-w-2xl mx-auto flex flex-col items-center">
        <div className={`h-14 w-64 md:w-80 ${shimmer}`} />
        <div className={`h-4 w-full ${shimmer}`} />
        <div className={`h-4 w-4/5 ${shimmer}`} />
      </div>

      {/* Search & Filter Bar Skeleton */}
      <div className={`h-14 w-full max-w-3xl mx-auto rounded-full ${shimmer}`} />

      {/* Archive Grid Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mt-12">
        {[...Array(6)].map((_, i) => (
          <div key={i} className={`h-[300px] w-full ${shimmer}`} />
        ))}
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// 2. ASYNC DATA COMPONENT (Handles the Fix)
// ------------------------------------------------------------------
async function AsyncPoemsContent() {
  const rawPoems = await getAllPublishedPoems();

  // FIX: Next.js strictly blocks passing Firebase Timestamps (which have hidden .toJSON() methods) 
  // from Server Components to Client Components. We must manually flatten them into plain strings.
  const serializedPoems = rawPoems.map((poem: any) => {
    // 1. Shallow clone the object
    const serialized = { ...poem };

    // 2. Check for Firebase Timestamps or JS Dates and convert to ISO Strings
    const dateFields = ["createdAt", "updatedAt", "publicationDate"];
    
    dateFields.forEach((field) => {
      if (serialized[field]) {
        if (typeof serialized[field].toDate === "function") {
          // It's a Firebase Timestamp
          serialized[field] = serialized[field].toDate().toISOString();
        } else if (serialized[field] instanceof Date) {
          // It's a JS Date
          serialized[field] = serialized[field].toISOString();
        }
      }
    });

    // 3. Force it into a standard JSON POJO (Plain Old Javascript Object)
    // This strips out any remaining invisible prototype methods that Next.js hates.
    return JSON.parse(JSON.stringify(serialized));
  });

  return (
    <div className="space-y-16 animate-fade-in">
      {/* Header */}
      <header className="space-y-6 text-center max-w-2xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-serif text-primary tracking-tight drop-shadow-sm">
          The Archive
        </h1>
        <p className="font-body text-lg text-muted-foreground leading-relaxed font-light">
          A complete collection of published poetry. Browse chronologically, 
          filter by year, or search for a specific word or title.
        </p>
      </header>

      {/* Interactive Client Component 
          Now receiving perfectly safe, serialized JSON data */}
      <PoemsArchive initialPoems={serializedPoems} />
    </div>
  );
}

// ------------------------------------------------------------------
// 3. MAIN PAGE EXPORT
// ------------------------------------------------------------------
export default function PoemsPage() {
  return (
    <div className="min-h-screen pt-24 md:pt-32 pb-24 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Suspense boundary traps the data load and instantly shows the Skeleton */}
        <Suspense fallback={<ArchiveSkeleton />}>
          <AsyncPoemsContent />
        </Suspense>

      </div>
    </div>
  );
}