import { Metadata } from "next";
import { getAuthorProfile } from "@/lib/firebase/db-settings";
import { ContactForm } from "@/components/public/ContactForm";

export const metadata: Metadata = {
  title: "Contact | Sheikh Rahil",
  description: "Get in touch with Sheikh Rahil for literary inquiries, readings, or quiet conversation.",
};

export default async function ContactPage() {
  const profile = await getAuthorProfile();

  return (
    <div className="animate-fade-in max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-16 min-h-[80vh] flex flex-col justify-center">
      
      <div className="text-center space-y-6">
        <h1 className="font-serif text-5xl md:text-6xl text-primary">Get in Touch</h1>
        <p className="font-body text-lg text-muted-foreground max-w-xl mx-auto">
          For literary inquiries, readings, or quiet conversation. Please use the form below to send a secure message.
        </p>
      </div>

      <div className="bg-background border border-border p-6 sm:p-12 shadow-sm">
        <ContactForm />
      </div>

      {(profile?.email || profile?.instagram) && (
        <div className="flex flex-col items-center space-y-6 pt-12 border-t border-border">
          <span className="font-sans text-xs uppercase tracking-widest text-muted-foreground">Direct Channels</span>
          <div className="flex gap-12">
            {profile.email && (
              <a 
                href={`mailto:${profile.email}`} 
                className="font-body text-lg text-primary hover:opacity-70 transition-opacity underline-offset-4 hover:underline"
              >
                Email
              </a>
            )}
            {profile.instagram && (
              <a 
                href={profile.instagram} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="font-body text-lg text-primary hover:opacity-70 transition-opacity underline-offset-4 hover:underline"
              >
                Instagram
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}