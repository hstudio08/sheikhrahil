import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getPoemBySlug } from "@/lib/firebase/db-poems";
import { ShareMenu } from "@/components/public/ShareMenu";
import { Heart, Printer, ArrowLeft } from "lucide-react";
import { LikeButton } from "@/components/public/LikeButton";
import { PrintButton } from "@/components/public/PrintButton";


export const revalidate = 3600;

interface PoemPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PoemPageProps): Promise<Metadata> {
  const { slug } = await params;
  const poem = await getPoemBySlug(slug);

  if (!poem) {
    return { title: "Poem Not Found" };
  }

  // Strip HTML from the body for the description if no SEO description is provided
  const strippedBody = poem.body.replace(/<[^>]+>/g, '').slice(0, 150) + "...";
  const description = poem.seoDescription || strippedBody;

  return {
    title: poem.seoTitle || `${poem.title} | Sheikh Rahil`,
    description,
    openGraph: {
      title: poem.seoTitle || poem.title,
      description,
      url: `https://sheikhrahil.com/poems/${slug}`,
      type: "article",
      images: poem.coverImage ? [poem.coverImage.url] : [],
    },
  };
}

export default async function SinglePoemPage({ params }: PoemPageProps) {
  const { slug } = await params;
  const poem = await getPoemBySlug(slug);

  if (!poem) {
    notFound();
  }

  const formattedDate = new Date(poem.publicationDate).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="min-h-screen pt-32 pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        <Link href="/poems" className="inline-flex items-center gap-2 font-sans text-[10px] uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors print:hidden">
          <ArrowLeft className="w-4 h-4" />
          Back to Archive
        </Link>

        <header className="space-y-8 text-center border-b border-border pb-12">
          <h1 className="text-5xl md:text-6xl font-serif text-primary tracking-tight">
            {poem.title}
          </h1>
          <div className="flex items-center justify-center gap-4 font-sans text-xs uppercase tracking-widest text-muted-foreground">
            <span>{formattedDate}</span>
            <span>•</span>
            <span>Sheikh Rahil</span>
          </div>
        </header>

        {/* Cover Image is hidden during print */}
        {poem.coverImage && (
          <div className="relative w-full aspect-[16/9] md:aspect-[21/9] overflow-hidden border border-border print:hidden">
            <Image
              src={poem.coverImage.url}
              alt={poem.coverImage.altText || poem.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Tiptap preserves whitespace, so we use whitespace-pre-wrap to honor the poetic line breaks */}
        <div 
          className="prose prose-neutral max-w-none font-serif text-lg md:text-xl leading-loose text-primary space-y-6 whitespace-pre-wrap print:text-black print:text-base"
          dangerouslySetInnerHTML={{ __html: poem.body }}
        />

        <footer className="pt-12 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6 print:hidden">
  <div className="flex items-center gap-6">
    <div className="flex items-center gap-2 text-muted-foreground">
      <LikeButton targetId={poem.id} />
      <span className="font-sans text-[10px] uppercase tracking-widest">
        Like
      </span>
    </div>

    <ShareMenu
      title={poem.title}
      url={`https://sheikhrahil.com/poems/${slug}`}
    />
  </div>

  <PrintButton />
</footer>

      </div>
    </article>
  );
}