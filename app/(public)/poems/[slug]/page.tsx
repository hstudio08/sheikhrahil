import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { adminDb } from "@/lib/firebase/admin";
import { ShareMenu } from "@/components/public/ShareMenu";
import { ArrowLeft } from "lucide-react";
import { LikeButton } from "@/components/public/LikeButton";
import { PrintButton } from "@/components/public/PrintButton";

export const revalidate = 3600;

interface PoemPageProps {
  params: Promise<{ slug: string }>;
}

// 1. ROBUST FETCHER: Checks for slug, falls back to document ID automatically.
async function getPoemBySlugOrId(slugOrId: string) {
  try {
    // First try by slug
    const slugSnapshot = await adminDb
      .collection("poems")
      .where("slug", "==", slugOrId)
      .limit(1)
      .get();

    if (!slugSnapshot.empty) {
      return { id: slugSnapshot.docs[0].id, ...slugSnapshot.docs[0].data() } as any;
    }

    // Fallback: Try by ID (fixes the broken links for older/manual poems)
    const docRef = await adminDb.collection("poems").doc(slugOrId).get();
    if (docRef.exists) {
      return { id: docRef.id, ...docRef.data() } as any;
    }

    return null;
  } catch (error) {
    console.error("Error fetching poem:", error);
    return null;
  }
}

export async function generateMetadata({ params }: PoemPageProps): Promise<Metadata> {
  const { slug } = await params;
  const poem = await getPoemBySlugOrId(slug);

  if (!poem) {
    return { title: "Poem Not Found" };
  }

  // Strip HTML from the body for the description if no SEO description is provided
  const strippedBody = poem.body ? poem.body.replace(/<[^>]+>/g, '').slice(0, 150) + "..." : "";
  const description = poem.seoDescription || strippedBody;

  return {
    title: poem.seoTitle || `${poem.title} | Sheikh Rahil`,
    description,
    openGraph: {
      title: poem.seoTitle || poem.title,
      description,
      url: `https://sheikhrahil.com/poems/${slug}`,
      type: "article",
      images: poem.coverImage?.url ? [poem.coverImage.url] : [],
    },
  };
}

export default async function SinglePoemPage({ params }: PoemPageProps) {
  const { slug } = await params;
  const poem = await getPoemBySlugOrId(slug);

  if (!poem) {
    notFound();
  }

  const formattedDate = new Date(poem.publicationDate || poem.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article className="min-h-screen pt-32 pb-24 bg-background animate-fade-in">
      <div className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-12 space-y-16">
        
        {/* Editorial Back Button */}
        <Link 
          href="/poems" 
          className="group inline-flex items-center gap-3 font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-primary transition-colors print:hidden"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Archive
        </Link>

        {/* Premium Header */}
        <header className="space-y-8 text-center border-b border-border/50 pb-12">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif text-primary tracking-tight leading-tight">
            {poem.title}
          </h1>
          <div className="flex items-center justify-center gap-4 font-sans text-xs uppercase tracking-[0.2em] text-muted-foreground">
            <span>{formattedDate}</span>
            <span className="text-primary/30">•</span>
            <span>Sheikh Rahil</span>
          </div>
        </header>

        {/* Cover Image is hidden during print */}
        {poem.coverImage?.url && (
          <div className="relative w-full aspect-[4/3] md:aspect-[21/9] overflow-hidden rounded-2xl bg-muted/20 print:hidden">
            <Image
              src={poem.coverImage.url}
              alt={poem.coverImage.altText || poem.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Poem Content: Uses font-body (Lora) for elegant readability */}
        <div 
          className="prose prose-neutral max-w-none font-body text-lg md:text-xl leading-[2.5] text-muted-foreground space-y-6 whitespace-pre-wrap print:text-black print:text-base mx-auto"
          dangerouslySetInnerHTML={{ __html: poem.body }}
        />

        <footer className="pt-16 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-8 print:hidden">
          <div className="flex items-center gap-8">
            
            {/* The extra <span> has been removed since LikeButton natively outputs "Like" */}
            <LikeButton targetId={poem.id} />

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