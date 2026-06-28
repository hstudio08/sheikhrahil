import Link from "next/link";

export function PublicFooter() {
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
        </div>

        <nav className="flex items-center gap-6">
          <Link href="/poems" className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
            Poems
          </Link>
          <Link href="/quotes" className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
            Quotes
          </Link>
          <Link href="/about" className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
            About
          </Link>
          <Link href="/contact" className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">
            Contact
          </Link>
        </nav>

      </div>
    </footer>
  );
}