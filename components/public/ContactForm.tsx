"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createContactMessage } from "@/lib/firebase/db-messages";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    setErrorMsg("");
    try {
      await createContactMessage({
        name: data.name,
        email: data.email,
        message: data.message,
      });
      setIsSuccess(true);
      reset();
    } catch (error) {
      console.error("Error submitting message:", error);
      setErrorMsg("Something went wrong. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="p-8 border border-border text-center space-y-4 bg-muted/20">
        <h3 className="font-serif text-2xl text-primary">Message Sent</h3>
        <p className="font-sans text-sm text-muted-foreground leading-relaxed">
          Thank you for reaching out. Your message has been received.
        </p>
        <button
          onClick={() => setIsSuccess(false)}
          className="font-sans text-xs uppercase tracking-widest text-primary border-b border-primary pb-1 hover:opacity-70 transition-opacity mt-4"
        >
          Send Another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {errorMsg && (
        <div className="p-4 bg-red-50 text-red-600 font-sans text-xs uppercase tracking-widest text-center border border-red-100">
          {errorMsg}
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="name" className="font-sans text-xs uppercase tracking-widest text-muted-foreground">
          Name
        </label>
        <input
          id="name"
          type="text"
          {...register("name")}
          disabled={isSubmitting}
          className="w-full bg-transparent border-b border-border py-3 font-body text-primary focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
          placeholder="Your name"
        />
        {errors.name && <p className="text-red-500 text-xs font-sans mt-1">{errors.name.message}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="font-sans text-xs uppercase tracking-widest text-muted-foreground">
          Email
        </label>
        <input
          id="email"
          type="email"
          {...register("email")}
          disabled={isSubmitting}
          className="w-full bg-transparent border-b border-border py-3 font-body text-primary focus:outline-none focus:border-primary transition-colors disabled:opacity-50"
          placeholder="Your email address"
        />
        {errors.email && <p className="text-red-500 text-xs font-sans mt-1">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="font-sans text-xs uppercase tracking-widest text-muted-foreground">
          Message
        </label>
        <textarea
          id="message"
          rows={5}
          {...register("message")}
          disabled={isSubmitting}
          className="w-full bg-transparent border-b border-border py-3 font-body text-primary focus:outline-none focus:border-primary transition-colors resize-none disabled:opacity-50"
          placeholder="Write your message here..."
        />
        {errors.message && <p className="text-red-500 text-xs font-sans mt-1">{errors.message.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full px-8 py-4 bg-primary text-primary-foreground font-sans text-xs uppercase tracking-widest hover:opacity-90 transition-opacity disabled:opacity-50 flex justify-center items-center"
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}