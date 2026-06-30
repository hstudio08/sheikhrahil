import { PublicNavbar } from "@/components/public/PublicNavbar";
import { PublicFooter } from "@/components/public/PublicFooter";
import { getAuthorProfile } from "@/lib/firebase/db-settings";
import { BackgroundPrefetcher } from "@/components/public/BackgroundPrefetcher"; // 1. Import it
import { hasSession } from "@/lib/firebase/auth-actions";
import { PromoPopup } from "@/components/public/PromoPopup";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getAuthorProfile();
  
  // 1. Check if the user is logged in as an admin securely on the server
  const isAdmin = await hasSession();

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
      
      {/* Silently pre-load pages in the background */}
      <BackgroundPrefetcher /> 

      {/* 2. Conditionally render the promo popup ONLY if they are NOT an admin */}
      {!isAdmin && <PromoPopup />}
    </div>
  );
}