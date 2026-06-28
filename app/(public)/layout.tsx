import { PublicNavbar } from "@/components/public/PublicNavbar";
import { PublicFooter } from "@/components/public/PublicFooter";
import { getAuthorProfile } from "@/lib/firebase/db-settings";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch settings server-side to pass into the footer seamlessly
  const profile = await getAuthorProfile();

  return (
    <div className="min-h-screen flex flex-col pt-24">
      <PublicNavbar />
      
      {/* The main reading area is constrained for perfect line-lengths and readability */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {children}
      </main>

      <PublicFooter 
        instagramUrl={profile?.instagram} 
        email={profile?.email} 
      />
    </div>
  );
}