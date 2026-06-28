"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/firebase/config";
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";

const quoteSchema = zod.object({
  quote: zod.string().min(5, "Quote text is required"),
  author: zod.string().min(1, "Author is required"),
  publicationDate: zod.string().min(1, "Date is required"),
  isPublished: zod.boolean(),
  isFeatured: zod.boolean(),
});

type QuoteFormValues = zod.infer<typeof quoteSchema>;

export default function EditQuotePage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<QuoteFormValues>({
    resolver: zodResolver(quoteSchema),
  });

  useEffect(() => {
    if (!id) return;
    const fetchQuote = async () => {
      try {
        const docRef = doc(db, "quotes", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          reset({
            quote: data.quote || data.text || "", 
            author: data.author || "Sheikh Rahil",
            publicationDate: data.publicationDate || new Date().toISOString().split("T")[0],
            isPublished: data.isPublished !== undefined ? data.isPublished : (data.status === 'published'),
            isFeatured: data.isFeatured || false,
          });
        } else {
          alert("Quote not found!");
          router.push("/writeradmin/dashboard/quotes");
        }
      } catch (error) {
        console.error("Error fetching quote:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchQuote();
  }, [id, reset, router]);

  const onSubmit = async (data: QuoteFormValues) => {
    setIsSubmitting(true);
    try {
      const docRef = doc(db, "quotes", id);
      await updateDoc(docRef, {
        ...data,
        status: data.isPublished ? "published" : "draft", // Ensures backward compatibility
        updatedAt: serverTimestamp(),
      });
      alert("Quote updated successfully!");
      router.push("/writeradmin/dashboard/quotes");
    } catch (error) {
      console.error("Error updating quote:", error);
      alert("Failed to update the quote.");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-[60vh]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="animate-fade-in pb-20 max-w-4xl">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/writeradmin/dashboard/quotes" className="p-2 border border-border bg-white rounded-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <span className="font-sans text-xs tracking-widest uppercase text-muted-foreground block mb-1">Editor</span>
          <h1 className="text-3xl font-serif">Edit Quote</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="border border-border bg-white p-8 rounded-sm space-y-6">
          <div className="space-y-2">
            <label className="block text-xs font-sans tracking-wider uppercase text-muted-foreground">Quote Text</label>
            <textarea rows={4} className="w-full px-4 py-3 bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring font-serif text-xl rounded-sm resize-none" {...register("quote")} />
            {errors.quote && <p className="text-xs text-red-600 font-sans mt-1">{errors.quote.message}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            <div className="space-y-2">
              <label className="block text-xs font-sans tracking-wider uppercase text-muted-foreground">Author</label>
              <input type="text" className="w-full px-4 py-3 bg-background border border-border focus:outline-none font-sans rounded-sm" {...register("author")} />
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-sans tracking-wider uppercase text-muted-foreground">Date</label>
              <input type="date" className="w-full px-4 py-3 bg-background border border-border focus:outline-none font-sans rounded-sm" {...register("publicationDate")} />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-6 pt-6 border-t border-border mt-6">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 rounded-sm border-border text-primary" {...register("isPublished")} />
              <span className="text-sm font-sans text-muted-foreground group-hover:text-primary transition-colors">Publish Publicly</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 rounded-sm border-border text-primary" {...register("isFeatured")} />
              <span className="text-sm font-sans text-muted-foreground group-hover:text-primary transition-colors">Feature on Home Page</span>
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 bg-primary text-primary-foreground font-sans tracking-wider uppercase text-xs px-8 py-4 hover:opacity-90 transition-all rounded-sm disabled:opacity-50">
            <Save className="w-4 h-4" />
            {isSubmitting ? "Updating..." : "Update Quote"}
          </button>
        </div>
      </form>
    </div>
  );
}