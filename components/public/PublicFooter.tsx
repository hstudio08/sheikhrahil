import Link from "next/link";

interface PublicFooterProps {
  instagramUrl?: string;
  email?: string;
}

export function PublicFooter({ instagramUrl, email }: PublicFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border mt-20 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
        
        <div className="text-center md:text-left">
          <Link href="/" className="font-serif text-xl text-primary block mb-2">
            Sheikh Rahil
          </Link>
          <p className="font-sans text-xs text-muted-foreground uppercase tracking-widest">
            © {currentYear} All Rights Reserved.
          </p>
        </div>

        <div className="flex items-center gap-6">
          {email && (
            <a 
              href={`mailto:${email}`}
              className="font-sans text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
            >
              Email
            </a>
          )}
          {instagramUrl && (
            <a 
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-sans text-xs uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
            >
              Instagram
            </a>
          )}
        </div>
        
      </div>
    </footer>
  );
}