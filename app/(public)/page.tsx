import Image from "next/image";
import Link from "next/link";
import { getAuthorProfile } from "@/lib/firebase/db-settings";
import { adminDb } from "@/lib/firebase/admin";
import { ContactForm } from "@/components/public/ContactForm";
import { ArrowRight } from "lucide-react";
import FeaturedQuotesBlock from "@/components/public/FeaturedQuotesBlock";

export const revalidate = 0;

async function getFeaturedPoems() {
  try {
    const snapshot = await adminDb
      .collection("poems")
      .where("status", "==", "published")
      .where("isFeatured", "==", true)
      .orderBy("publicationDate", "desc")
      .limit(4) // Fetching 4 to fit perfectly in a desktop grid row
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

async function getFeaturedQuotes() {
  try {
    const snapshot = await adminDb
      .collection("quotes")
      .where("isPublished", "==", true) 
      .where("isFeatured", "==", true)
      .orderBy("publicationDate", "desc")
      .limit(6) // Restored to fetch multiple for the slider
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
  const aboutImage = profile?.portrait;
  
  const [featuredPoems, featuredQuotes] = await Promise.all([
    getFeaturedPoems(),
    getFeaturedQuotes(),
  ]);

  return (
    <main className="relative flex flex-col items-center w-full overflow-hidden bg-background">
      
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
        
        {/* 1. EDITORIAL HERO SECTION */}
        <section className="relative w-full pt-32 pb-24 md:pt-40 md:pb-32 flex flex-col-reverse md:flex-row items-center gap-16 md:gap-24 animate-fade-in">
          {/* Text Content */}
          <div className="w-full md:w-1/2 flex flex-col items-center text-center md:items-start md:text-left z-10">
            <span className="font-sans text-xs md:text-sm uppercase tracking-[0.3em] text-muted-foreground mb-6 font-medium">
              Author & Poet
            </span>
            <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl leading-[1.1] font-normal mb-8 text-primary">
              Sheikh Rahil
            </h1>
            <p className="font-body text-base md:text-lg text-muted-foreground leading-relaxed max-w-md mb-12">
              Hailing from the serene valley of Jammu and Kashmir, exploring life's profound questions, spiritual reflection, and the human experience. Author of the magnum opus, <span className="italic font-medium text-primary">Inklings and My Pen</span>.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <Link 
                href="/poems" 
                className="px-8 py-3.5 bg-primary text-primary-foreground rounded-full font-sans text-xs tracking-[0.2em] uppercase transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/20"
              >
                Explore Poems
              </Link>
              <Link 
                href="/quotes" 
                className="px-8 py-3.5 bg-transparent text-primary border border-primary/20 rounded-full font-sans text-xs tracking-[0.2em] uppercase transition-all duration-300 hover:border-primary"
              >
                Quotes
              </Link>
            </div>
          </div>

          {/* Hero Image (Portrait) */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-end">
            <div className="relative w-[280px] h-[380px] md:w-[400px] md:h-[540px] overflow-hidden rounded-2xl bg-muted/30">
              {profile?.portrait?.url ? (
                <Image 
                  src={profile.portrait.url} 
                  alt="Portrait of Sheikh Rahil"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center transition-transform duration-1000 hover:scale-105"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-muted-foreground font-sans text-xs uppercase tracking-widest">Portrait</span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 2. THE QUOTE SLIDER */}
        {featuredQuotes.length > 0 && (
          <FeaturedQuotesBlock quotes={featuredQuotes} />
        )}

        {/* 3. FEATURED POEMS (Smaller Cards, Grid Layout) */}
        <section className="w-full py-24 md:py-32">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 md:mb-16 gap-6 border-b border-border/50 pb-8">
            <div>
              <h3 className="font-serif text-4xl md:text-5xl text-primary">Featured Poems</h3>
            </div>
            <Link href="/poems" className="group flex items-center gap-3 font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors">
              View Archive 
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>

          {/* Grid updated to 4 columns on large screens to make cards smaller */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
            {featuredPoems.length > 0 ? (
              featuredPoems.map((poem: any) => (
                <article key={poem.id} className="group cursor-pointer flex flex-col gap-5">
                  <div className="relative w-full aspect-[4/5] overflow-hidden rounded-xl bg-muted/20">
                    {poem.coverImage?.url ? (
                      <Image
                        src={poem.coverImage.url}
                        alt={poem.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-muted-foreground font-sans text-xs uppercase tracking-widest">Artwork</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-3">
                    <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-muted-foreground block">
                      {poem.readTime || "3 min read"}
                    </span>
                    <h4 className="font-serif text-2xl text-primary group-hover:text-primary/70 transition-colors line-clamp-2 leading-tight">
                      {poem.title}
                    </h4>
                    <p className="font-body text-sm text-muted-foreground leading-relaxed line-clamp-3">
                      {poem.excerpt || "Read the full piece to explore this literary work..."}
                    </p>
                  </div>
                </article>
              ))
            ) : (
              <p className="font-body text-muted-foreground italic col-span-full">
                Poetry collections will be featured here.
              </p>
            )}
          </div>
        </section>

        {/* 4. ABOUT - TWO COLUMN EDITORIAL WITH BOTTOM IMAGE */}
        <section className="w-full py-32 md:py-40">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
            
            {/* Left Column: Title & Secondary Image */}
            <div className="lg:col-span-5 flex flex-col gap-10">
              <h3 className="font-serif text-4xl md:text-5xl text-primary">
                The Author
              </h3>
              
              <div className="relative w-full aspect-[4/5] max-w-sm overflow-hidden rounded-xl bg-muted/20 hidden md:block">
                {aboutImage?.url ? (
                  <Image 
                    src={aboutImage.url} 
                    alt="Sheikh Rahil | Rahil Yousuf | Sheikh Rahil Yousuf - A poet, teacher and author"
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-muted/30">
                     <span className="text-muted-foreground font-sans text-xs uppercase tracking-widest">Author Photo</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Text Content */}
            <div className="lg:col-span-7 space-y-8 font-body text-lg text-muted-foreground leading-relaxed font-light">
              <p>
                Born in the serene village of Hattigam, Tehsil Srigufwara, Jammu and Kashmir, Rahil Yousuf is an Indian author, poet, and scholar of English literature. His academic journey began at Sir Syed Memorial School, Mahind, where his curiosity for learning and passion for literature first took root.
              </p>
              <p>
                Although he initially pursued the science stream during his higher secondary education, his enduring love for language and the humanities inspired him to change course. He earned a B.A. (Honours) in English Language and Literature, followed by a Master's degree in English Literature.
              </p>
              <p>
                Rahil Yousuf's writings are deeply rooted in philosophical inquiry, spiritual reflection, and a profound appreciation of nature and the human experience. His literary style is distinguished by linguistic richness, contemplative depth, and a timeless search for meaning beyond the ordinary.
              </p>
              
              {/* Mobile Image Fallback (Shown only on small screens) */}
              <div className="relative w-full aspect-[4/5] max-w-xs mx-auto overflow-hidden rounded-xl bg-muted/20 md:hidden mt-8">
                {aboutImage?.url && (
                  <Image 
                    src={aboutImage.url} 
                    alt="Sheikh Rahil | Rahil Yousuf | Sheikh Rahil Yousuf - A poet, teacher and author"
                    fill
                    className="object-cover"
                  />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 5. MINIMAL CONTACT SECTION */}
        <section className="w-full py-24 md:py-32 border-t border-border/50">
          <div className="max-w-2xl mx-auto space-y-16">
            <div className="text-center space-y-6">
              <h2 className="font-serif text-4xl text-primary">Get in Touch</h2>
              <p className="font-body text-muted-foreground">
                For literary inquiries, readings, or quiet conversation.
              </p>
            </div>
            
            <div className="w-full">
              <ContactForm />
            </div>
          </div>
        </section>
        
      </div>
    </main>
  );
}
