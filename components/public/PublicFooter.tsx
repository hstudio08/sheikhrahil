import Link from "next/link";

interface PublicFooterProps {
  instagramUrl?: string | null;
  email?: string | null;
}

export function PublicFooter({ instagramUrl, email }: PublicFooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        <div className="text-center md:text-left space-y-2">
          <Link href="/" className="font-serif text-2xl tracking-tight text-primary hover:opacity-80 transition-opacity">
            Sheikh Rahil
          </Link>
          <p className="font-sans text-xs text-muted-foreground">
            © {currentYear} Sheikh Rahil. All rights reserved.
          </p>
          
          {/* Updated Developer Credit Section */}
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-1.5 pt-1">
            <span className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground">
              Designed and developed by
            </span>
            <a
              href="https://qurevo.in"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-1.5 font-sans text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
            >
              <img
                src="https://res.cloudinary.com/dpqsadqxj/image/upload/q_auto/f_auto/v1780941361/logo_p83oao_oke7zd0000_sdggc1.webp"
                alt="Qurevo Technologies Logo"
                className="w-3.5 h-3.5 object-contain opacity-70 group-hover:opacity-100 transition-opacity"
              />
              <span className="font-semibold">Qurevo Technologies</span>
            </a>
          </div>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
          <Link href="/poems" className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
            Poems
          </Link>
          <Link href="/quotes" className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
            Quotes
          </Link>
          {/* Fixed: Changed <link> to <Link> */}
          <Link href="/privacy" className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
            Privacy Policy
          </Link>
          <Link href="/contact" className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
            Contact
          </Link>
          {instagramUrl ? (
            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
            >
              Instagram
            </a>
          ) : null}
          {email ? (
            <a
              href={`mailto:${email}`}
              className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
            >
              Email
            </a>
          ) : null}
        </nav>

      </div>
    </footer>
  );
}