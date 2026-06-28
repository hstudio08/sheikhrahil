export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center animate-fade-in">
      <span className="font-sans text-sm tracking-widest uppercase text-muted-foreground mb-4">
        Author & Poet
      </span>
      <h1 className="text-5xl md:text-7xl font-serif mb-6">
        Sheikh Rahil
      </h1>
      <p className="max-w-2xl font-body text-lg md:text-xl leading-relaxed text-muted-foreground">
        The digital home is currently being constructed. Everything here will revolve 
        around literature, elegant typography, and a timeless reading experience.
      </p>
    </div>
  );
}