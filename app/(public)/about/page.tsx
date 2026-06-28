import Image from "next/image";
import { getAuthorProfile } from "@/lib/firebase/db-settings";
import { Metadata } from "next";

export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {
  const profile = await getAuthorProfile();
  return {
    title: `About ${profile?.name || "Sheikh Rahil"} - Poet, Writer, Teacher`,
    description: profile?.biography?.slice(0, 160) || "Learn more about the literary journey, biography, and writing philosophy of Sheikh Rahil.",
  };
}

export default async function AboutPage() {
  const profile = await getAuthorProfile();

  if (!profile) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <p className="font-sans text-xs uppercase tracking-widest text-muted-foreground">Author profile not found.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-24">
      
      {/* 1. Header & Portrait */}
      <section className="flex flex-col items-center text-center space-y-12">
        <div className="space-y-4">
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-primary">{profile.name}</h1>
          <p className="font-sans text-xs uppercase tracking-widest text-muted-foreground">{profile.subtitle}</p>
        </div>
        
        {profile.portrait ? (
          <div className="relative w-full max-w-md aspect-[3/4] border border-border shadow-sm bg-muted/20">
            <Image
              src={profile.portrait.url}
              alt={`Portrait of ${profile.name}`}
              fill
              className="object-cover grayscale-0 transition-all duration-700"
              priority
            />
          </div>
        ) : (
          <div className="w-full max-w-md aspect-[3/4] border border-border bg-background flex items-center justify-center">
            <span className="font-sans text-xs uppercase tracking-widest text-muted-foreground">Portrait Unavailable</span>
          </div>
        )}
      </section>

      {/* 2. Biography */}
      {profile.biography && (
        <section className="space-y-8">
          <div className="border-b border-border pb-4">
            <h2 className="font-sans text-xs uppercase tracking-widest text-muted-foreground">Biography</h2>
          </div>
          <div className="font-body text-lg md:text-xl text-primary leading-relaxed whitespace-pre-wrap">
            {profile.biography}
          </div>
        </section>
      )}

      {/* 3. Writing Philosophy */}
      {profile.writingPhilosophy && (
        <section className="space-y-8 bg-muted/30 p-8 sm:p-12 border border-border">
          <div className="border-b border-border/50 pb-4">
            <h2 className="font-sans text-xs uppercase tracking-widest text-muted-foreground">Writing Philosophy</h2>
          </div>
          <div className="font-body text-lg md:text-xl text-primary leading-relaxed whitespace-pre-wrap italic">
            "{profile.writingPhilosophy}"
          </div>
        </section>
      )}

      {/* 4. Teaching Journey */}
      {profile.teachingJourney && (
        <section className="space-y-8">
          <div className="border-b border-border pb-4">
            <h2 className="font-sans text-xs uppercase tracking-widest text-muted-foreground">Teaching Journey</h2>
          </div>
          <div className="font-body text-lg md:text-xl text-primary leading-relaxed whitespace-pre-wrap">
            {profile.teachingJourney}
          </div>
        </section>
      )}
    </div>
  );
}