import Image from "next/image";
import Link from "next/link";
import { getAuthorProfile } from "@/lib/firebase/db-settings";
import { adminDb } from "@/lib/firebase/admin";
import { PoemCard } from "@/components/public/PoemCard";
import { ContactForm } from "@/components/public/ContactForm";
import { Button } from "@/components/ui/button";
import { FeaturedQuotesSlider } from "@/components/public/FeaturedQuotesSlider";

export const revalidate = 3600;

async function getFeaturedPoems() {
  try {
    const snapshot = await adminDb
      .collection("poems")
      .where("status", "==", "published")
      .where("isFeatured", "==", true)
      .orderBy("publicationDate", "desc")
      .limit(4) // Increased to 4 because cards are smaller
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching featured poems:", error);
    return [];
  }
}

// Find the getFeaturedQuotes function in app/(public)/page.tsx and update it:

async function getFeaturedQuotes() {
  try {
    const snapshot = await adminDb
      .collection("quotes")
      .where("isPublished", "==", true) // Changed from status == 'published'
      .where("isFeatured", "==", true)
      .orderBy("publicationDate", "desc")
      .limit(6)
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching featured quotes:", error);
    return [];
  }
}

export default async function HomePage() {
  const profile = await getAuthorProfile();
  
  const [featuredPoems, featuredQuotes] = await Promise.all([
    getFeaturedPoems(),
    getFeaturedQuotes(),
  ]);

  return (
    <main className="flex flex-col w-full overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex flex-col lg:flex-row items-center justify-center gap-16 px-6 sm:px-8 lg:px-12 py-32 max-w-7xl mx-auto w-full">
        <div className="flex-1 space-y-8 text-center lg:text-left z-10 order-2 lg:order-1">
          <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl text-primary tracking-tight">
            Sheikh Rahil
          </h1>
          
          <div className="space-y-4 max-w-2xl mx-auto lg:mx-0">
            <h2 className="font-sans text-sm md:text-base uppercase tracking-widest text-muted-foreground font-semibold">
              Indian Author • Poet • Scholar of English Literature
            </h2>
            <p className="font-body text-lg md:text-xl text-muted-foreground leading-relaxed">
              Hailing from the serene valley of Jammu and Kashmir, Rahil Yousuf explores life's profound questions, spiritual reflection, and the human experience. Author of the magnum opus, <span className="italic font-medium text-primary">Inklings and My Pen</span>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-6 justify-center lg:justify-start pt-4">
            <Link href="/poems">
              <Button size="lg" className="rounded-none px-8 font-sans uppercase tracking-widest text-xs h-12">
                Explore Poems
              </Button>
            </Link>
            <Link href="/quotes">
              <Button variant="outline" size="lg" className="rounded-none px-8 font-sans uppercase tracking-widest text-xs h-12 border-primary text-primary hover:bg-primary/5">
                Explore Quotes
              </Button>
            </Link>
          </div>
        </div>

        <div className="flex-1 flex justify-center lg:justify-end w-full order-1 lg:order-2">
          <div className="relative group w-full max-w-sm md:max-w-md aspect-[3/4] p-[2px] bg-gradient-to-br from-slate-300 via-slate-100 to-slate-400 shadow-2xl transition-transform duration-700">
            <div className="relative w-full h-full overflow-hidden bg-muted">
              {profile?.portrait?.url ? (
                <Image
                  src={profile.portrait.url}
                  alt="Sheikh Rahil - Indian Author, Poet, and Scholar"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                  <span className="text-muted-foreground font-sans text-xs uppercase tracking-widest">Portrait</span>
                </div>
              )}
            </div>
            
            <div className="absolute -bottom-6 -left-6 md:-bottom-8 md:-left-8 px-8 py-4 bg-white/40 backdrop-blur-md border border-white/50 shadow-[0_8px_30px_rgba(0,0,0,0.1)] z-20 rounded-sm pointer-events-none">
               <span 
                 className="italic text-2xl md:text-3xl text-primary font-medium tracking-wide drop-shadow-sm" 
                 style={{ fontFamily: "'Great Vibes', 'Allura', 'Playfair Display', cursive" }}
               >
                 Sheikh Rahil
               </span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED QUOTES - AUTO SLIDER */}
      <section className="py-24 bg-muted/20 overflow-hidden w-full">
        <div className="max-w-7xl mx-auto space-y-12 w-full">
          <div className="text-center space-y-4 px-6">
            <h2 className="font-serif text-4xl text-primary">Featured Quotes</h2>
            <div className="h-px w-16 bg-primary/20 mx-auto"></div>
          </div>
          
          {featuredQuotes.length > 0 ? (
            <FeaturedQuotesSlider quotes={featuredQuotes as any[]} />
          ) : (
            <p className="text-center font-body text-muted-foreground italic px-6">Literary quotes will be featured here.</p>
          )}

          {/* ALL QUOTES BUTTON */}
          <div className="flex justify-center pt-4 px-6">
             <Link href="/quotes">
               <Button className="rounded-full px-10 font-sans uppercase tracking-widest text-xs h-12 shadow-sm">
                 All Quotes
               </Button>
             </Link>
          </div>
        </div>
      </section>

      {/* 3. FEATURED POEMS - SMALLER CARDS, OPTIMIZED GRID */}
      <section className="py-24 px-6 sm:px-8 lg:px-12 max-w-7xl mx-auto w-full">
        <div className="space-y-12">
          <div className="text-center space-y-4">
            <h2 className="font-serif text-4xl text-primary">Featured Poems</h2>
            <div className="h-px w-16 bg-primary/20 mx-auto"></div>
          </div>
          
          {/* Using a tighter grid for smaller cards: 2 on mobile, 3 on tablet, 4 on desktop */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
             {featuredPoems.length > 0 ? (
              featuredPoems.map((poem: any) => <PoemCard key={poem.id} poem={poem} />)
            ) : (
              <p className="text-center col-span-full font-body text-muted-foreground italic">Poetry collections will be featured here.</p>
            )}
          </div>

          <div className="flex justify-center pt-8">
             <Link href="/poems">
               <Button variant="ghost" className="font-sans uppercase tracking-widest text-xs hover:bg-transparent hover:opacity-70">
                 View All Poems &rarr;
               </Button>
             </Link>
          </div>
        </div>
      </section>

      {/* 4. ABOUT SHEIKH RAHIL */}
      <section className="py-24 bg-muted/20 px-6 sm:px-8 lg:px-12">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="text-center space-y-4">
            <h2 className="font-serif text-4xl text-primary">About the Author</h2>
            <div className="h-px w-16 bg-primary/20 mx-auto"></div>
          </div>

          <div className="space-y-12 font-body text-lg text-primary leading-relaxed">
            <div className="space-y-4">
              <h3 className="font-sans text-xs uppercase tracking-widest text-muted-foreground">Biography – The Story Begins</h3>
              <p>Born in the serene village of Hattigam, Tehsil Srigufwara, Jammu and Kashmir, Rahil Yousuf is an Indian author, poet, and scholar of English literature. He is the son of Mohd Yousuf Sheikh and Shameema. His academic journey began at Sir Syed Memorial School, Mahind, where his curiosity for learning and passion for literature first took root.</p>
              <p>Although he initially pursued the science stream during his higher secondary education, his enduring love for language and the humanities inspired him to change course. He earned a B.A. (Honours) in English Language and Literature, followed by a Master's degree in English Literature. Demonstrating academic excellence, he further qualified both the UGC-NET and JKSET examinations in English.</p>
              <p>His literary journey took shape with the publication of his debut and magnum opus, <i>Inklings and My Pen</i> (2022), published by Notion Press. The work marked the beginning of a voice dedicated to exploring life's profound questions through poetry and prose.</p>
            </div>

            <div className="space-y-4">
              <h3 className="font-sans text-xs uppercase tracking-widest text-muted-foreground">Writing Philosophy</h3>
              <p>Rahil Yousuf's writings are deeply rooted in philosophical inquiry, spiritual reflection, and a profound appreciation of nature and the human experience. His literary style is distinguished by linguistic richness, contemplative depth, and a timeless search for meaning beyond the ordinary.</p>
              <p>Through poetry and prose alike, he seeks not merely to entertain but to inspire readers to reflect on life, faith, resilience, and the enduring power of words. His work invites readers into a dialogue with the self, encouraging introspection while celebrating the beauty of existence and the transformative potential of literature.</p>
            </div>
            
            <div className="pt-8 text-center">
               <Link href="/about">
                 <Button variant="outline" className="rounded-none px-8 font-sans uppercase tracking-widest text-xs h-12 border-primary text-primary hover:bg-primary/5">
                   Read Full Profile
                 </Button>
               </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. CONTACT SECTION */}
      <section className="py-24 px-6 sm:px-8 lg:px-12 border-t border-border">
        <div className="max-w-3xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="font-serif text-4xl text-primary">Get in Touch</h2>
            <div className="h-px w-16 bg-primary/20 mx-auto"></div>
            <p className="font-body text-muted-foreground pt-4">
              For literary inquiries, readings, or quiet conversation.
            </p>
          </div>
          
          <div className="bg-background border border-border p-8 md:p-12 shadow-sm">
            <ContactForm />
          </div>
        </div>
      </section>
      
    </main>
  );
}