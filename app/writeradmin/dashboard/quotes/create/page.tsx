"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, Image as ImageIcon } from "lucide-react";
import { createQuote } from "@/lib/firebase/db-quotes";
import { slugify } from "@/lib/utils/slugify";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { CloudinaryImage } from "@/types";

export default function CreateQuotePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [quoteText, setQuoteText] = useState("");
  const [author, setAuthor] = useState("Sheikh Rahil");
  const [publicationDate, setPublicationDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [slug, setSlug] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState<CloudinaryImage | null>(null);

  // Auto-generate slug from quote text (first 6 words)
  useEffect(() => {
    if (quoteText && !slug) {
      const words = quoteText.split(" ").slice(0, 6).join(" ");
      setSlug(slugify(words));
    }
  }, [quoteText, slug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!quoteText.trim()) {
      setError("Quote text is required.");
      return;
    }
    if (!slug.trim()) {
      setError("Slug is required for the URL.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await createQuote({
        quote: quoteText.trim(),
        author: author.trim() || "Sheikh Rahil",
        slug: slugify(slug),
        publicationDate,
        backgroundImage,
        isPublished,
        isFeatured,
      });

      router.push("/writeradmin/dashboard/quotes");
      router.refresh();
    } catch (err: any) {
      console.error("Failed to create quote:", err);
      setError(err.message || "Failed to create quote. Please try again.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="animate-fade-in max-w-4xl mx-auto pb-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-border pb-6 mb-8 gap-4">
        <div className="flex items-center gap-4">
          <Link 
            href="/writeradmin/dashboard/quotes"
            className="p-2 hover:bg-muted rounded-full transition-colors"
            title="Back to Quotes"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </Link>
          <div>
            <span className="font-sans text-xs tracking-widest uppercase text-muted-foreground block mb-1">
              Library Management
            </span>
            <h1 className="text-3xl font-serif">Add New Quote</h1>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-sm font-sans text-sm border border-red-100">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-border rounded-sm p-6 space-y-6 shadow-sm">
              
              {/* Quote Text */}
              <div className="space-y-2">
                <label htmlFor="quote" className="font-sans text-xs uppercase tracking-widest text-muted-foreground">
                  Quote Text *
                </label>
                <textarea
                  id="quote"
                  value={quoteText}
                  onChange={(e) => setQuoteText(e.target.value)}
                  placeholder="Enter the literary quote here..."
                  className="w-full min-h-[150px] p-4 bg-background border border-input rounded-sm font-serif text-lg focus:outline-none focus:ring-1 focus:ring-primary resize-y"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Author */}
                <div className="space-y-2">
                  <label htmlFor="author" className="font-sans text-xs uppercase tracking-widest text-muted-foreground">
                    Author
                  </label>
                  <input
                    id="author"
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    className="w-full h-10 px-3 bg-background border border-input rounded-sm font-sans text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                {/* Slug */}
                <div className="space-y-2">
                  <label htmlFor="slug" className="font-sans text-xs uppercase tracking-widest text-muted-foreground">
                    URL Slug *
                  </label>
                  <input
                    id="slug"
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. quote-about-life"
                    className="w-full h-10 px-3 bg-background border border-input rounded-sm font-sans text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
              </div>

              {/* Publication Date */}
              <div className="space-y-2">
                <label htmlFor="date" className="font-sans text-xs uppercase tracking-widest text-muted-foreground">
                  Publication Date *
                </label>
                <input
                  id="date"
                  type="date"
                  value={publicationDate}
                  onChange={(e) => setPublicationDate(e.target.value)}
                  className="w-full md:w-1/2 h-10 px-3 bg-background border border-input rounded-sm font-sans text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                  required
                />
              </div>
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            
            {/* Publishing Options */}
            <div className="bg-white border border-border rounded-sm p-6 space-y-6 shadow-sm">
              <h3 className="font-sans text-xs uppercase tracking-widest text-muted-foreground border-b border-border pb-2">
                Publishing
              </h3>
              
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={isPublished}
                      onChange={(e) => setIsPublished(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-10 h-5 rounded-full transition-colors ${isPublished ? 'bg-primary' : 'bg-muted-foreground/30'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform ${isPublished ? 'translate-x-5' : 'translate-x-0'}`}></div>
                  </div>
                  <span className="font-sans text-sm font-medium group-hover:text-primary transition-colors">
                    {isPublished ? "Published (Visible)" : "Draft (Hidden)"}
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={isFeatured}
                      onChange={(e) => setIsFeatured(e.target.checked)}
                      className="sr-only"
                    />
                    <div className={`w-10 h-5 rounded-full transition-colors ${isFeatured ? 'bg-blue-600' : 'bg-muted-foreground/30'}`}></div>
                    <div className={`absolute left-1 top-1 bg-white w-3 h-3 rounded-full transition-transform ${isFeatured ? 'translate-x-5' : 'translate-x-0'}`}></div>
                  </div>
                  <span className="font-sans text-sm font-medium group-hover:text-primary transition-colors flex flex-col">
                    <span>Feature on Homepage</span>
                    <span className="text-[10px] text-muted-foreground font-normal">Shows in the marquee slider</span>
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground font-sans tracking-wider uppercase text-xs h-12 rounded-sm hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                {isSubmitting ? "Saving..." : "Save Quote"}
              </button>
            </div>

            {/* Media Upload */}
            <div className="bg-white border border-border rounded-sm p-6 space-y-4 shadow-sm">
              <div className="flex items-center gap-2 border-b border-border pb-2">
                <ImageIcon className="w-4 h-4 text-muted-foreground" />
                <h3 className="font-sans text-xs uppercase tracking-widest text-muted-foreground">
                  Background Image
                </h3>
              </div>
              <p className="text-xs text-muted-foreground font-sans">
                Optional. This image will appear as an elegant backdrop on the quote cards.
              </p>
              
              <ImageUpload
                value={backgroundImage}
                onChange={(image) => setBackgroundImage(image)}
                label="Upload Quote Background"
              />
            </div>

          </div>
        </div>
      </form>
    </div>
  );
}