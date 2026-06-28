"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { submitComment, getApprovedComments } from "@/lib/firebase/rtdb-comments";
import { Comment } from "@/types";

const commentSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  content: z.string().min(3, "Comment must be at least 3 characters."),
});

type CommentFormValues = z.infer<typeof commentSchema>;

interface CommentSectionProps {
  targetId: string;
  targetType: "poem" | "quote";
}

export function CommentSection({ targetId, targetType }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
  });

  useEffect(() => {
    const fetchComments = async () => {
      setIsLoading(true);
      const approved = await getApprovedComments(targetId);
      setComments(approved);
      setIsLoading(false);
    };
    fetchComments();
  }, [targetId]);

  const onSubmit = async (data: CommentFormValues) => {
    setIsSubmitting(true);
    setErrorMsg("");
    setSubmitSuccess(false);

    try {
      await submitComment(targetId, targetType, {
        name: data.name,
        email: data.email,
        content: data.content,
      });
      setSubmitSuccess(true);
      reset();
    } catch (error) {
      console.error("Error submitting comment:", error);
      setErrorMsg("Failed to submit comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 border-t border-border mt-16 print:hidden">
      <div className="space-y-16">
        
        {/* Comment Form */}
        <div className="space-y-8">
          <h3 className="font-serif text-3xl text-primary">Leave a Thought</h3>
          
          {submitSuccess && (
            <div className="p-4 bg-muted/20 border border-border text-center">
              <p className="font-sans text-xs text-muted-foreground uppercase tracking-widest">
                Thank you. Your comment is awaiting moderation.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {errorMsg && <p className="text-red-500 text-xs font-sans">{errorMsg}</p>}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <input
                  type="text"
                  {...register("name")}
                  placeholder="Your Name"
                  disabled={isSubmitting}
                  className="w-full bg-transparent border-b border-border py-3 font-body text-primary focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
                />
                {errors.name && <p className="text-red-500 text-[10px] uppercase font-sans mt-1">{errors.name.message}</p>}
              </div>

              <div className="space-y-2">
                <input
                  type="email"
                  {...register("email")}
                  placeholder="Your Email (will not be published)"
                  disabled={isSubmitting}
                  className="w-full bg-transparent border-b border-border py-3 font-body text-primary focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
                />
                {errors.email && <p className="text-red-500 text-[10px] uppercase font-sans mt-1">{errors.email.message}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <textarea
                {...register("content")}
                rows={4}
                placeholder="Write your comment here..."
                disabled={isSubmitting}
                className="w-full bg-transparent border-b border-border py-3 font-body text-primary focus:outline-none focus:border-primary transition-colors resize-none disabled:opacity-50"
              />
              {errors.content && <p className="text-red-500 text-[10px] uppercase font-sans mt-1">{errors.content.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 bg-transparent border border-border text-primary font-sans text-xs uppercase tracking-widest hover:bg-background transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Submitting..." : "Submit Comment"}
            </button>
          </form>
        </div>

        {/* Display Comments */}
        <div className="space-y-8 pt-8 border-t border-border/50">
          <h3 className="font-serif text-2xl text-primary">
            Thoughts ({comments.length})
          </h3>
          
          {isLoading ? (
            <p className="font-sans text-xs uppercase tracking-widest text-muted-foreground animate-pulse">Loading comments...</p>
          ) : comments.length > 0 ? (
            <div className="space-y-8">
              {comments.map((comment) => (
                <div key={comment.id} className="space-y-2">
                  <div className="flex items-baseline gap-3">
                    <span className="font-serif text-lg text-primary">{comment.name}</span>
                    <span className="font-sans text-[10px] uppercase tracking-widest text-muted-foreground">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="font-body text-muted-foreground leading-relaxed whitespace-pre-wrap">
                    {comment.content}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="font-sans text-xs uppercase tracking-widest text-muted-foreground">
              No thoughts have been shared yet.
            </p>
          )}
        </div>

      </div>
    </section>
  );
}