"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import Link from "next/link";
import { slugify } from "@/lib/utils/slugify";
import { db } from "@/lib/firebase/config"; // Ensure this points to your client-side firebase config
import { doc, getDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { CloudinaryImage } from "@/types";

const poemSchema = zod.object({
  title: zod.string().min(1, "Title is required"),
  slug: zod.string().min(1, "Slug is required"),
  body: zod.string().min(10, "Poem body must be at least 10 characters"),
  publicationDate: zod.string().min(1, "Publication date is required"),
  status: zod.enum(["draft", "published"]),
  isFeatured: zod.boolean(),
  seoTitle: zod.string().optional(),
  seoDescription: zod.string().optional(),
});

type PoemFormValues = zod.infer<typeof poemSchema>;

export default function EditPoemPage() {
  const params = useParams();
  const id = params?.id as string;
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coverImage, setCoverImage] = useState<CloudinaryImage | null>(null);

  const { register, handleSubmit, control, setValue, reset, formState: { errors } } = useForm<PoemFormValues>({
    resolver: zodResolver(poemSchema),
  });

  useEffect(() => {
    if (!id) return;
    const fetchPoem = async () => {
      try {
        const docRef = doc(db, "poems", id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          reset({
            title: data.title || "",
            slug: data.slug || "",
            body: data.body || "",
            publicationDate: data.publicationDate || new Date().toISOString().split("T")[0],
            status: data.status || "draft",
            isFeatured: data.isFeatured || false,
            seoTitle: data.seoTitle || "",
            seoDescription: data.seoDescription || "",
          });
          if (data.coverImage) setCoverImage(data.coverImage);
        } else {
          alert("Poem not found!");
          router.push("/writeradmin/dashboard/poems");
        }
      } catch (error) {
        console.error("Error fetching poem:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPoem();
  }, [id, reset, router]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setValue("title", newTitle);
    setValue("slug", slugify(newTitle), { shouldValidate: true });
  };

  const onSubmit = async (data: PoemFormValues) => {
    setIsSubmitting(true);
    try {
      const docRef = doc(db, "poems", id);
      await updateDoc(docRef, {
        ...data,
        coverImage,
        thumbnailImage: coverImage, 
        updatedAt: serverTimestamp(),
      });
      alert("Poem updated successfully!");
      router.push("/writeradmin/dashboard/poems");
    } catch (error) {
      console.error("Error updating poem:", error);
      alert("Failed to update the poem.");
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-[60vh]"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  }

  return (
    <div className="animate-fade-in pb-20">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/writeradmin/dashboard/poems" className="p-2 border border-border bg-white rounded-sm text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <span className="font-sans text-xs tracking-widest uppercase text-muted-foreground block mb-1">Editor</span>
          <h1 className="text-3xl font-serif">Edit Poem</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-sans tracking-wider uppercase text-muted-foreground">Poem Title</label>
              <input type="text" className="w-full px-4 py-3 bg-white border border-border focus:outline-none focus:ring-1 focus:ring-ring font-serif text-xl rounded-sm" {...register("title", { onChange: handleTitleChange })} />
              {errors.title && <p className="text-xs text-red-600 font-sans mt-1">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-sans tracking-wider uppercase text-muted-foreground">Poem Body</label>
              <Controller
                name="body"
                control={control}
                render={({ field }) => (
                  <RichTextEditor content={field.value || ""} onChange={field.onChange} placeholder="Let the ink flow..." />
                )}
              />
              {errors.body && <p className="text-xs text-red-600 font-sans mt-1">{errors.body.message}</p>}
            </div>
            
            <div className="border border-border bg-white p-6 rounded-sm space-y-4">
              <h3 className="font-sans text-sm uppercase tracking-wider text-primary border-b border-border pb-2">SEO Metadata</h3>
              <div className="space-y-2"><label className="block text-xs font-sans text-muted-foreground">URL Slug</label><input type="text" className="w-full px-3 py-2 bg-background border border-border focus:outline-none font-sans text-sm rounded-sm" {...register("slug")} /></div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="border border-border bg-white p-6 rounded-sm space-y-6">
              <h3 className="font-sans text-sm uppercase tracking-wider text-primary border-b border-border pb-2">Publishing Settings</h3>
              <div className="space-y-2">
                <label className="block text-xs font-sans text-muted-foreground">Status</label>
                <select className="w-full px-3 py-2 bg-background border border-border focus:outline-none font-sans text-sm rounded-sm" {...register("status")}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="block text-xs font-sans text-muted-foreground">Publication Date</label>
                <input type="date" className="w-full px-3 py-2 bg-background border border-border focus:outline-none font-sans text-sm rounded-sm" {...register("publicationDate")} />
              </div>
              <label className="flex items-center gap-3 cursor-pointer group pt-2">
                <input type="checkbox" className="w-4 h-4 rounded-sm border-border text-primary" {...register("isFeatured")} />
                <span className="text-sm font-sans text-muted-foreground group-hover:text-primary transition-colors">Feature on Home Page</span>
              </label>
            </div>
            <div className="border border-border bg-white p-6 rounded-sm">
               <h3 className="font-sans text-sm uppercase tracking-wider text-primary border-b border-border pb-4 mb-4">Media</h3>
               <ImageUpload label="Cover Artwork" value={coverImage} onChange={setCoverImage} />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="fixed bottom-0 left-0 right-0 md:left-64 bg-white border-t border-border p-4 flex justify-end px-4 md:px-12 z-10">
          <button type="submit" disabled={isSubmitting} className="flex items-center gap-2 bg-primary text-primary-foreground font-sans tracking-wider uppercase text-xs px-6 py-3 hover:opacity-90 transition-all rounded-sm disabled:opacity-50">
            <Save className="w-4 h-4" />
            {isSubmitting ? "Saving Changes..." : "Update Poem"}
          </button>
        </div>
      </form>
    </div>
  );
}