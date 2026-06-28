import { PublicNavbar } from "@/components/public/PublicNavbar";
import { PublicFooter } from "@/components/public/PublicFooter";
import { getAuthorProfile } from "@/lib/firebase/db-settings";
import { BackgroundPrefetcher } from "@/components/public/BackgroundPrefetcher"; // 1. Import it

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getAuthorProfile();

  return (
    <div className="min-h-screen flex flex-col pt-24">
      <PublicNavbar />
      
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </main>

      <PublicFooter 
        instagramUrl={profile?.instagram} 
        email={profile?.email} 
      />
      
      {/* 2. Add it here! It will silently pre-load pages in the background */}
      <BackgroundPrefetcher /> 
    </div>
  );
}