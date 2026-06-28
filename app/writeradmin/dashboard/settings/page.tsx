"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { Save } from "lucide-react";
import { getAuthorProfile, saveAuthorProfile } from "@/lib/firebase/db-settings";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { ImageUpload } from "@/components/admin/ImageUpload";
import { CloudinaryImage } from "@/types";

const profileSchema = zod.object({
  name: zod.string().min(1, "Name is required"),
  subtitle: zod.string().min(1, "Subtitle is required"),
  email: zod.string().email("Valid email required"),
  instagram: zod.string().url("Must be a valid URL").or(zod.string().length(0)),
  biography: zod.string().min(10, "Biography is required"),
  writingPhilosophy: zod.string(),
  teachingJourney: zod.string(),
});

type ProfileFormValues = zod.infer<typeof profileSchema>;

export default function SettingsDashboardPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [portrait, setPortrait] = useState<CloudinaryImage | null>(null);

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: "Sheikh Rahil",
      subtitle: "Poet • Writer • Teacher",
      email: "",
      instagram: "",
      biography: "",
      writingPhilosophy: "",
      teachingJourney: "",
    },
  });

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getAuthorProfile();
        if (data) {
          reset({
            name: data.name,
            subtitle: data.subtitle,
            email: data.email,
            instagram: data.instagram,
            biography: data.biography,
            writingPhilosophy: data.writingPhilosophy,
            teachingJourney: data.teachingJourney,
          });
          if (data.portrait) setPortrait(data.portrait);
        }
      } catch (error) {
        console.error("Failed to load profile", error);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, [reset]);

  const onSubmit = async (data: ProfileFormValues) => {
    setIsSubmitting(true);
    try {
      await saveAuthorProfile({ ...data, portrait });
      alert("Profile updated successfully.");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save settings.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="text-muted-foreground font-sans text-sm animate-pulse">Loading configurations...</div>;
  }

  return (
    <div className="animate-fade-in pb-20">
      <div className="border-b border-border pb-6 mb-8">
        <span className="font-sans text-xs tracking-widest uppercase text-muted-foreground block mb-1">
          Identity & Contact
        </span>
        <h1 className="text-4xl font-serif">About & Settings</h1>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-6">
            <div className="border border-border bg-white p-6 rounded-sm space-y-6">
               <h3 className="font-sans text-sm uppercase tracking-wider text-primary border-b border-border pb-2">Biography & Content</h3>
               
               <div className="space-y-2">
                 <label className="block text-xs font-sans tracking-wider uppercase text-muted-foreground">Full Biography</label>
                 <Controller
                   name="biography"
                   control={control}
                   render={({ field }) => (
                     <RichTextEditor content={field.value} onChange={field.onChange} placeholder="The story begins..." />
                   )}
                 />
               </div>

               <div className="space-y-2">
                 <label className="block text-xs font-sans tracking-wider uppercase text-muted-foreground">Writing Philosophy</label>
                 <textarea
                   rows={4}
                   className="w-full px-4 py-3 bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring font-sans text-sm rounded-sm resize-none"
                   {...register("writingPhilosophy")}
                 />
               </div>

               <div className="space-y-2">
                 <label className="block text-xs font-sans tracking-wider uppercase text-muted-foreground">Teaching Journey</label>
                 <textarea
                   rows={4}
                   className="w-full px-4 py-3 bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring font-sans text-sm rounded-sm resize-none"
                   {...register("teachingJourney")}
                 />
               </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="border border-border bg-white p-6 rounded-sm space-y-4">
              <h3 className="font-sans text-sm uppercase tracking-wider text-primary border-b border-border pb-2">Identity Details</h3>
              
              <div className="space-y-2">
                <label className="block text-xs font-sans text-muted-foreground">Author Name</label>
                <input type="text" className="w-full px-3 py-2 bg-background border border-border focus:outline-none font-sans text-sm rounded-sm" {...register("name")} />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-sans text-muted-foreground">Subtitle / Tagline</label>
                <input type="text" className="w-full px-3 py-2 bg-background border border-border focus:outline-none font-sans text-sm rounded-sm" {...register("subtitle")} />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-sans text-muted-foreground">Public Email</label>
                <input type="email" className="w-full px-3 py-2 bg-background border border-border focus:outline-none font-sans text-sm rounded-sm" {...register("email")} />
              </div>

              <div className="space-y-2">
                <label className="block text-xs font-sans text-muted-foreground">Instagram URL</label>
                <input type="url" className="w-full px-3 py-2 bg-background border border-border focus:outline-none font-sans text-sm rounded-sm" {...register("instagram")} />
              </div>
            </div>

            <div className="border border-border bg-white p-6 rounded-sm">
               <h3 className="font-sans text-sm uppercase tracking-wider text-primary border-b border-border pb-4 mb-4">Portrait</h3>
               <ImageUpload label="Author Photo" value={portrait} onChange={setPortrait} />
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
            {isSubmitting ? "Updating Identity..." : "Save Settings"}
          </button>
        </div>
      </form>
    </div>
  );
}