import Image from "next/image";
import Link from "next/link";
import { Poem } from "@/types";

interface PoemCardProps {
  poem: Poem;
}

export function PoemCard({ poem }: PoemCardProps) {
  const formattedDate = new Date(poem.publicationDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="group flex flex-col gap-6 cursor-pointer">
      <Link href={`/poems/${poem.slug}`} className="block relative aspect-[4/5] overflow-hidden bg-muted border border-border">
        {poem.coverImage ? (
          <Image
            src={poem.coverImage.url}
            alt={poem.coverImage.altText || poem.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-white">
            <span className="font-serif text-muted-foreground italic">No cover image</span>
          </div>
        )}
      </Link>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground">
            {formattedDate}
          </span>
          <span className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground">
            3 Min Read {/* We can calculate this dynamically later based on word count */}
          </span>
        </div>
        
        <Link href={`/poems/${poem.slug}`} className="block group-hover:text-primary/80 transition-colors">
          <h3 className="font-serif text-2xl text-primary leading-tight">
            {poem.title}
          </h3>
        </Link>
        
        <div className="pt-2">
          <Link 
            href={`/poems/${poem.slug}`}
            className="inline-flex items-center font-sans text-xs uppercase tracking-widest text-primary border-b border-primary pb-1 hover:opacity-70 transition-opacity"
          >
            Read Poem
          </Link>
        </div>
      </div>
    </article>
  );
}