import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
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
      .limit(24)
      .get();

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : null,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : null,
        publicationDate: data.publicationDate?.toDate ? data.publicationDate.toDate().toISOString() : null,
      };
    });
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
      .limit(6)
      .get();

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate ? data.createdAt.toDate().toISOString() : null,
        updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate().toISOString() : null,
        publicationDate: data.publicationDate?.toDate ? data.publicationDate.toDate().toISOString() : null,
      };
    });
  } catch (error) {
    console.error("Error fetching featured quotes:", error);
    return [];
  }
}
// ------------------------------------------------------------------
// 1. GEMINI-STYLE SKELETON LOADING
// ------------------------------------------------------------------
function PageSkeleton() {
  const shimmer = "animate-pulse bg-primary/10 rounded-2xl"; // Elegant, soft pulse
  
  return (
    <div className="w-full space-y-32 py-16">
      {/* Hero Skeleton */}
      <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-12">
        <div className="w-full md:w-1/2 flex flex-col gap-6">
          <div className={`h-4 w-32 ${shimmer}`} />
          <div className={`h-24 md:h-32 w-full max-w-md ${shimmer}`} />
          <div className={`h-20 w-full max-w-sm ${shimmer}`} />
          <div className={`h-14 w-40 rounded-full ${shimmer}`} />
        </div>
        <div className="w-full md:w-1/2 flex justify-end">
          <div className={`w-[85%] max-w-[340px] aspect-[4/5] md:aspect-[3/4] ${shimmer} rounded-[2rem]`} />
        </div>
      </div>

      {/* Poems Grid Skeleton */}
      <div className="space-y-8">
        <div className="flex justify-between items-end">
          <div className={`h-10 w-48 ${shimmer}`} />
          <div className={`h-4 w-24 ${shimmer}`} />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 lg:gap-5">
          {[...Array(10)].map((_, i) => (
            <div key={i} className={`aspect-square md:aspect-auto md:h-[180px] ${shimmer}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ------------------------------------------------------------------
// 2. ASYNC DATA COMPONENT
// ------------------------------------------------------------------
async function AsyncPageContent() {
  const profile = await getAuthorProfile();
  const aboutImage = profile?.portrait;
  
  const [featuredPoems, featuredQuotes] = await Promise.all([
    getFeaturedPoems(),
    getFeaturedQuotes(),
  ]);

  return (
    <>
     {/* 1. EDITORIAL HERO SECTION (SEO & 3D Interactive) */}
        <section 
          aria-label="Introduction to Sheikh Rahil"
          className="relative w-full pt-16 pb-20 md:pt-32 md:pb-32 flex flex-col-reverse md:flex-row items-center justify-between gap-12 md:gap-16 lg:gap-24 animate-fade-in"
        >
          {/* Left: Text Content */}
          <div className="w-full md:w-1/2 flex flex-col items-center text-center md:items-start md:text-left z-10 flex-shrink-0">
            
            {/* Elegant Subtitle */}
            <div className="inline-flex items-center gap-4 mb-6 md:mb-8">
              <span className="h-[1px] w-8 bg-primary/30 hidden md:block" aria-hidden="true" />
              <span className="font-sans text-xs md:text-sm uppercase tracking-[0.3em] text-muted-foreground font-semibold">
                Indian Author & Poet
              </span>
            </div>

            {/* Main SEO Title */}
            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] leading-[1.05] tracking-tight font-medium mb-6 md:mb-8 text-primary drop-shadow-sm relative">
              Sheikh Rahil
              <span className="sr-only"> - Official Digital Archive</span>
            </h1>

            {/* Keyword-Rich Biography Snippet */}
            <p className="font-body text-base md:text-lg lg:text-xl text-muted-foreground/90 leading-relaxed max-w-[90%] md:max-w-md mb-10 md:mb-12 font-light">
              Hailing from the serene valley of <strong>Jammu and Kashmir</strong>, exploring life's profound questions, spiritual reflection, and the human experience. Author of the acclaimed poetry collection, <strong className="italic font-medium text-primary">Inklings and My Pen</strong>.
            </p>
            
            {/* Interactive Call to Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 w-full sm:w-auto">
              <Link 
                href="/poems" 
                className="group relative w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-primary text-primary-foreground rounded-full font-sans text-xs sm:text-sm tracking-[0.15em] uppercase overflow-hidden transition-all duration-500 hover:bg-foreground hover:text-background hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:-translate-y-1"
              >
                <span className="relative z-10">Explore Poems</span>
                {/* Subtle shine effect */}
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
              </Link>
              <Link 
                href="/quotes" 
                className="w-full sm:w-auto flex items-center justify-center px-8 py-4 bg-transparent text-primary border border-primary/20 rounded-full font-sans text-xs sm:text-sm tracking-[0.15em] uppercase transition-all duration-300 hover:border-primary hover:bg-primary hover:text-primary-foreground hover:-translate-y-1 hover:shadow-lg"
              >
                Discover Quotes
              </Link>
            </div>
          </div>

          {/* Right: 3D Interactive Hero Image */}
          {/* The parent container holds the 'perspective' to create real 3D depth */}
          <div className="w-full md:w-1/2 flex justify-center md:justify-end relative group [perspective:1200px]">
            
            {/* Ambient background glow that intensifies on hover */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 blur-3xl rounded-full -z-10 pointer-events-none transition-all duration-700 group-hover:bg-primary/10 group-hover:scale-105" />
            
            {/* The 3D tilting card */}
            <div className="relative w-[85%] max-w-[340px] sm:max-w-[400px] aspect-[4/5] md:aspect-[3/4] overflow-hidden rounded-[2rem] bg-muted/20 ring-1 ring-border/50 transition-all duration-700 ease-out [transform-style:preserve-3d] group-hover:[transform:rotateY(-12deg)_rotateX(6deg)_scale(1.03)] shadow-2xl group-hover:shadow-[20px_20px_40px_rgba(0,0,0,0.15)]">
              
              {profile?.portrait?.url ? (
                <Image 
                  src={profile.portrait.url} 
                  alt="Sheikh Rahil - Indian Author, Poet, and Scholar of English Literature"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-center transition-all duration-700"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted/40 to-muted/10">
                  <span className="text-muted-foreground font-sans text-xs uppercase tracking-widest">Portrait</span>
                </div>
              )}

              {/* Dynamic lighting overlay to enhance the 3D effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </div>
          </div>
        </section>

      {/* 2. THE QUOTE SLIDER */}
      {featuredQuotes.length > 0 && (
        <FeaturedQuotesBlock quotes={featuredQuotes} />
      )}

     {/* 3. COMPACT EDITORIAL FEATURED POEMS (With Thumbnails) */}
      <section className="relative w-full py-24 md:py-32">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-14 gap-4 border-b border-border/50 pb-8">
          <div>
            <h2 className="font-serif text-4xl md:text-5xl text-primary tracking-tight mb-3">
              Selected Works
            </h2>
            <p className="font-sans text-sm text-muted-foreground tracking-wide">
              Curated pieces from the archives.
            </p>
          </div>
          <Link 
            href="/poems" 
            className="group inline-flex items-center gap-3 font-sans text-xs uppercase tracking-[0.2em] text-primary hover:text-primary/70 transition-colors"
          >
            View All Archive
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Grid stays compact: 2 columns on mobile, up to 5 on wide screens 
          Increased gap slightly to accommodate images gracefully
        */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
          {featuredPoems?.length > 0 ? (
            featuredPoems.map((poem: any) => (
              <Link
                href={`/poems/${poem.slug}`}
                key={poem.id}
                className="group relative flex flex-col cursor-pointer"
              >
                {/* Image Thumbnail with Hover Zoom */}
                <div className="relative w-full aspect-square sm:aspect-[4/5] overflow-hidden rounded-xl bg-muted/20 mb-4 shadow-sm group-hover:shadow-lg transition-all duration-500 ring-1 ring-border/40 group-hover:ring-primary/20">
                  {poem.coverImage?.url ? (
                    <Image
                      src={poem.coverImage.url}
                      alt={poem.title}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-muted/40 to-muted/10">
                      <span className="text-muted-foreground font-sans text-[10px] uppercase tracking-widest">Artwork</span>
                    </div>
                  )}
                  {/* Subtle darkening overlay on hover to make it feel tactile */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-500" />
                </div>

                {/* Text Content */}
                <div className="flex flex-col flex-1 px-1">
                  <span className="font-sans text-[9px] uppercase tracking-[0.2em] text-muted-foreground mb-2 block opacity-70 group-hover:opacity-100 transition-opacity">
                    {poem.readTime || "Read Piece"}
                  </span>
                  <h3 className="font-serif text-base sm:text-lg font-medium text-foreground leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                    {poem.title}
                  </h3>
                </div>
              </Link>
            ))
          ) : (
            <p className="font-body text-muted-foreground italic col-span-full">
              Poetry collections will be featured here.
            </p>
          )}
        </div>
      </section>

      {/* 4. ABOUT - TWO COLUMN EDITORIAL (SEO Optimized) */}
      <section className="w-full py-24 md:py-32" id="about">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-center">
          
          {/* Left Column: Image & Decorative Elements */}
          <div className="lg:col-span-5 flex flex-col gap-10 relative">
            
            {/* Decorative background accent */}
            <div className="absolute -inset-6 bg-primary/5 rounded-3xl -z-10 hidden md:block" />

            <div className="relative w-full aspect-[4/5] max-w-sm overflow-hidden rounded-2xl bg-muted/20 hidden md:block shadow-2xl shadow-primary/10 ring-1 ring-border/50 group">
              <Image 
                src="https://res.cloudinary.com/mtferpxm/image/upload/v1782663744/480926814_660210776439547_302238137659663353_n_tg0fti.jpg" 
                alt="Sheikh Rahil - Indian Author, Poet, and Scholar of English Literature"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-all duration-1000 group-hover:scale-105 group-hover:contrast-110"
              />
              {/* Elegant overlay gradient for depth */}
              <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            </div>
          </div>

          {/* Right Column: SEO Text Content */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            
            {/* SEO Heavily Focused Heading */}
            <div className="space-y-4">
              <span className="font-sans text-xs sm:text-sm uppercase tracking-[0.3em] text-primary/70 font-semibold block">
                About The Author
              </span>
              <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl text-primary leading-[1.05] tracking-tight font-medium relative inline-block">
                Sheikh Rahil
                {/* Decorative underline */}
                <span className="absolute -bottom-4 left-0 w-24 h-[2px] bg-primary/40" />
              </h2>
            </div>

            <div className="font-body text-lg text-muted-foreground leading-relaxed font-light mt-6 space-y-6">
              <p className="hover:text-foreground transition-colors duration-300">
                Born in the serene village of Hattigam, Tehsil Srigufwara, Jammu and Kashmir, <strong>Sheikh Rahil (Rahil Yousuf)</strong> is an Indian author, poet, and scholar of English literature. His academic journey began at Sir Syed Memorial School, Mahind, where his curiosity for learning and passion for literature first took root.
              </p>
              <p className="hover:text-foreground transition-colors duration-300">
                Although he initially pursued the science stream during his higher secondary education, his enduring love for language and the humanities inspired him to change course. He earned a B.A. (Honours) in English Language and Literature, followed by a Master's degree in English Literature.
              </p>
              <p className="hover:text-foreground transition-colors duration-300">
                <strong>Sheikh Rahil's</strong> writings are deeply rooted in philosophical inquiry, spiritual reflection, and a profound appreciation of nature and the human experience. His literary style is distinguished by linguistic richness, contemplative depth, and a timeless search for meaning beyond the ordinary.
              </p>
            </div>
            
            {/* Mobile Image Fallback (Shown only on small screens) */}
            <div className="relative w-full aspect-[4/5] max-w-xs mx-auto overflow-hidden rounded-2xl bg-muted/20 md:hidden mt-8 shadow-xl shadow-primary/5 ring-1 ring-border/50 group">
              <Image 
                src="https://res.cloudinary.com/mtferpxm/image/upload/v1782663744/480926814_660210776439547_302238137659663353_n_tg0fti.jpg" 
                alt="Sheikh Rahil - Indian Author, Poet, and Scholar of English Literature"
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-1000 group-hover:scale-105"
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// ------------------------------------------------------------------
// 3. MAIN PAGE EXPORT
// ------------------------------------------------------------------
export default function HomePage() {
  return (
    <main className="relative flex flex-col items-center w-full overflow-hidden bg-background">
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 lg:px-24">
        
        {/* Suspense boundary wraps the data-heavy components. 
            Shows PageSkeleton instantly while Firebase loads. */}
        <Suspense fallback={<PageSkeleton />}>
          <AsyncPageContent />
        </Suspense>

        {/* 5. MINIMAL CONTACT SECTION (Synchronous, loads instantly) */}
        <section className="w-full py-24 md:py-32 border-t border-border/20">
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