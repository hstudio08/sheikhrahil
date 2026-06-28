"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";
import { slugify } from "@/lib/utils/slugify";
import { createQuote } from "@/lib/firebase/db-quotes";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { CloudinaryImage } from "@/types";

const quoteSchema = zod.object({
  quote: zod.string().min(5, "Quote must be at least 5 characters"),
  author: zod.string().min(1, "Author is required"),
  slug: zod.string().min(1, "Slug is required"),
  publicationDate: zod.string().min(1, "Publication date is required"),
  isPublished: zod.boolean(),
  seoTitle: zod.string().optional(),
  seoDescription: zod.string().optional(),
});

type QuoteFormValues = zod.infer<typeof quoteSchema>;

export default function CreateQuotePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState<CloudinaryImage | null>(null);
  
  const today = new Date().toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      author: "Sheikh Rahil",
      isPublished: false,
      publicationDate: today,
    },
  });

  // Generate a slug based on the first 5 words of the quote
  const handleQuoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setValue("quote", text);
    
    // Extract first 5 words for the auto-slug
    const firstFewWords = text.split(/\s+/).slice(0, 5).join(" ");
    if (firstFewWords.trim().length > 0) {
      setValue("slug", slugify(firstFewWords), { shouldValidate: true });
    }
  };

  const onSubmit = async (data: QuoteFormValues) => {
    setIsSubmitting(true);
    try {
      await createQuote({
        ...data,
        backgroundImage,
        thumbnail: backgroundImage, 
      });
      router.push("/writeradmin/dashboard/quotes");
    } catch (error) {
      console.error("Error creating quote:", error);
      alert("Failed to save the quote.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="animate-fade-in pb-20">
      <div className="flex items-center gap-4 mb-8">
        <Link 
          href="/writeradmin/dashboard/quotes"
          className="p-2 border border-border bg-white rounded-sm text-muted-foreground hover:text-primary hover:bg-background transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <span className="font-sans text-xs tracking-widest uppercase text-muted-foreground block mb-1">
            Editor
          </span>
          <h1 className="text-3xl font-serif">Add Quote</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            
            <div className="space-y-2">
              <label className="block text-xs font-sans tracking-wider uppercase text-muted-foreground">
                Quote Text
              </label>
              <textarea
                rows={5}
                placeholder="Write the quote here..."
                className="w-full px-6 py-6 bg-white border border-border focus:outline-none focus:ring-1 focus:ring-ring font-serif text-2xl md:text-3xl leading-relaxed rounded-sm resize-none"
                {...register("quote", { onChange: handleQuoteChange })}
              />
              {errors.quote && <p className="text-xs text-red-600 font-sans mt-1">{errors.quote.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-sans tracking-wider uppercase text-muted-foreground">
                Author Attribution
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-white border border-border focus:outline-none focus:ring-1 focus:ring-ring font-sans text-sm rounded-sm"
                {...register("author")}
              />
              {errors.author && <p className="text-xs text-red-600 font-sans mt-1">{errors.author.message}</p>}
            </div>
            
            {/* SEO Section */}
            <div className="border border-border bg-white p-6 rounded-sm space-y-4">
              <h3 className="font-sans text-sm uppercase tracking-wider text-primary border-b border-border pb-2">SEO Metadata</h3>
              
              <div className="space-y-2">
                <label className="block text-xs font-sans text-muted-foreground">URL Slug</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring font-sans text-sm rounded-sm"
                  {...register("slug")}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-sans text-muted-foreground">SEO Title (Optional)</label>
                <input
                  type="text"
                  placeholder="Overrides default title for search engines"
                  className="w-full px-3 py-2 bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring font-sans text-sm rounded-sm"
                  {...register("seoTitle")}
                />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-sans text-muted-foreground">SEO Description (Optional)</label>
                <textarea
                  rows={2}
                  className="w-full px-3 py-2 bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring font-sans text-sm rounded-sm resize-none"
                  {...register("seoDescription")}
                />
              </div>
            </div>

          </div>

          <div className="space-y-6">
            
            <div className="border border-border bg-white p-6 rounded-sm space-y-6">
              <h3 className="font-sans text-sm uppercase tracking-wider text-primary border-b border-border pb-2">Publishing</h3>
              
              <label className="flex items-center gap-3 cursor-pointer group pt-2">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded-sm border-border text-primary focus:ring-primary"
                  {...register("isPublished")}
                />
                <span className="text-sm font-sans text-muted-foreground group-hover:text-primary transition-colors">
                  Publish Publicly
                </span>
              </label>

              <div className="space-y-2">
                <label className="block text-xs font-sans text-muted-foreground">Publication Date</label>
                <input
                  type="date"
                  className="w-full px-3 py-2 bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring font-sans text-sm rounded-sm"
                  {...register("publicationDate")}
                />
              </div>
            </div>

            <div className="border border-border bg-white p-6 rounded-sm">
               <h3 className="font-sans text-sm uppercase tracking-wider text-primary border-b border-border pb-4 mb-4">Visual Theme</h3>
               <ImageUpload 
                 label="Background Imagery"
                 value={backgroundImage} 
                 onChange={setBackgroundImage} 
               />
               <p className="text-xs text-muted-foreground mt-3 leading-relaxed">
                 This image will be used as the immersive background for the single quote view.
               </p>
            </div>

          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 md:left-64 bg-white border-t border-border p-4 flex justify-end px-4 md:px-12 z-10">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-primary text-primary-foreground font-sans tracking-wider uppercase text-xs px-6 py-3 hover:opacity-90 transition-all rounded-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? "Committing to Archive..." : "Save Quote"}
          </button>
        </div>
      </form>
    </div>
  );
}