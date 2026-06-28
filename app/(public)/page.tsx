import Image from "next/image";
import Link from "next/link";
import { getAuthorProfile } from "@/lib/firebase/db-settings";
import { getLatestPublishedQuotes } from "@/lib/firebase/db-quotes";
import { getFeaturedPublishedPoems } from "@/lib/firebase/db-poems";
import { QuoteCard } from "@/components/public/QuoteCard";
import { PoemCard } from "@/components/public/PoemCard";
import { ContactForm } from "@/components/public/ContactForm";

export const revalidate = 3600; 

export default async function HomePage() {
  const [profile, featuredQuotes, featuredPoems] = await Promise.all([
    getAuthorProfile(),
    getLatestPublishedQuotes(2),
    getFeaturedPublishedPoems(3)
  ]);

  return (
    <div className="animate-fade-in flex flex-col min-h-screen">
      
      {/* 1. HERO SECTION */}
      <section className="min-h-[70vh] flex flex-col justify-center pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="order-2 lg:order-1 space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <span className="font-sans text-xs tracking-[0.2em] uppercase text-muted-foreground block">
                {profile?.subtitle || "Poet • Writer • Teacher"}
              </span>
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif text-primary leading-none tracking-tight">
                {profile?.name || "Sheikh Rahil"}
              </h1>
            </div>
            
            <p className="font-body text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl mx-auto lg:mx-0">
              Welcome to my digital home. A quiet space dedicated to literature, 
              contemplation, and the architecture of words.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-4">
              <Link 
                href="/poems"
                className="w-full sm:w-auto px-8 py-3 bg-primary text-primary-foreground font-sans text-xs uppercase tracking-widest hover:opacity-90 transition-opacity text-center"
              >
                Explore Poems
              </Link>
              <Link 
                href="/quotes"
                className="w-full sm:w-auto px-8 py-3 bg-transparent border border-border text-primary font-sans text-xs uppercase tracking-widest hover:bg-background transition-colors text-center"
              >
                Explore Quotes
              </Link>
            </div>
          </div>

          <div className="order-1 lg:order-2 flex justify-center lg:justify-end">
            {profile?.portrait ? (
              <div className="relative w-64 h-80 sm:w-80 sm:h-96 lg:w-96 lg:h-[32rem] rounded-sm overflow-hidden border border-border shadow-sm">
                <Image 
                  src={profile.portrait.url}
                  alt={`Portrait of ${profile.name}`}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            ) : (
              <div className="w-64 h-80 sm:w-80 sm:h-96 lg:w-96 lg:h-[32rem] rounded-sm border border-border bg-white flex items-center justify-center">
                <span className="font-sans text-xs uppercase tracking-widest text-muted-foreground">
                  Portrait Unavailable
                </span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2 & 3. FEATURED QUOTES SECTION */}
      {featuredQuotes && featuredQuotes.length > 0 && (
        <section className="py-24 bg-muted/30 border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <div className="text-center space-y-4">
              <h2 className="font-serif text-4xl lg:text-5xl text-primary">Contemplations</h2>
              <p className="font-sans text-xs uppercase tracking-widest text-muted-foreground">
                Selected Thoughts & Passages
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featuredQuotes.map((quote) => (
                <QuoteCard key={quote.id} quote={quote} />
              ))}
            </div>

            <div className="flex justify-center pt-8">
              <Link 
                href="/quotes"
                className="px-8 py-3 bg-transparent border border-border text-primary font-sans text-xs uppercase tracking-widest hover:bg-background transition-colors text-center"
              >
                View All Quotes
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 4 & 5. FEATURED POEMS SECTION */}
      {featuredPoems && featuredPoems.length > 0 && (
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border pb-8">
              <div className="space-y-4">
                <h2 className="font-serif text-4xl lg:text-5xl text-primary">Selected Works</h2>
                <p className="font-sans text-xs uppercase tracking-widest text-muted-foreground">
                  Recent Poetry & Prose
                </p>
              </div>
              <Link 
                href="/poems"
                className="hidden md:inline-block font-sans text-xs uppercase tracking-widest text-primary border-b border-primary pb-1 hover:opacity-70 transition-opacity"
              >
                View Complete Archive
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {featuredPoems.map((poem) => (
                <PoemCard key={poem.id} poem={poem} />
              ))}
            </div>

            <div className="flex justify-center md:hidden pt-8">
              <Link 
                href="/poems"
                className="w-full sm:w-auto px-8 py-3 bg-transparent border border-border text-primary font-sans text-xs uppercase tracking-widest hover:bg-background transition-colors text-center"
              >
                View Complete Archive
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 6. ABOUT SECTION */}
      {profile?.biography && (
        <section className="py-24 bg-muted/30 border-t border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8">
                <h2 className="font-serif text-4xl lg:text-5xl text-primary">About the Author</h2>
                <div className="font-body text-lg text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {profile.biography.slice(0, 400)}...
                </div>
                <div>
                  <Link 
                    href="/about"
                    className="font-sans text-xs uppercase tracking-widest text-primary border-b border-primary pb-1 hover:opacity-70 transition-opacity"
                  >
                    Read Full Biography
                  </Link>
                </div>
              </div>
              
              <div className="flex justify-center lg:justify-end">
                <div className="relative w-full max-w-sm aspect-[3/4] bg-background border border-border">
                  {profile?.portrait && (
                    <Image 
                      src={profile.portrait.url}
                      alt={`Portrait of ${profile.name}`}
                      fill
                      className="grayscale-0 transition-all duration-700"
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 7. CONTACT SECTION */}
      <section className="py-24 border-t border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-4">
            <h2 className="font-serif text-4xl lg:text-5xl text-primary">Get in Touch</h2>
            <p className="font-body text-lg text-muted-foreground">
              For literary inquiries, readings, or quiet conversation.
            </p>
          </div>
          
          <ContactForm />
        </div>
      </section>

    </div>
  );
}