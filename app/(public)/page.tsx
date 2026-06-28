import Image from "next/image";
import Link from "next/link";
import { getAuthorProfile } from "@/lib/firebase/db-settings";

// Revalidate this page every 1 hour (ISR) to keep stats/profile fresh without hammering the database
export const revalidate = 3600; 

export default async function HomePage() {
  const profile = await getAuthorProfile();

  return (
    <div className="animate-fade-in flex flex-col min-h-[70vh] justify-center pt-10 pb-20">
      
      {/* 1. HERO SECTION */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        
        {/* Typography / Copy Side */}
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

        {/* Portrait Side */}
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
      </section>

      {/* Placeholders for exact strict ordering (We will build these in Part B) */}
      {/* 2. Featured Quotes */}
      {/* 3. View All Quotes Button */}
      {/* 4. Featured Poems */}
      {/* 5. View All Poems Button */}
      {/* 6. About Sheikh Rahil */}
      {/* 7. Contact Section */}

    </div>
  );
}