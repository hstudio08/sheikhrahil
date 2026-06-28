"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as zod from "zod";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase/config";
import { createSession } from "@/lib/firebase/auth-actions";

const loginSchema = zod.object({
  email: zod.string().email("Please enter a valid email address"),
  password: zod.string().min(6, "Password must be at least 6 characters"),
});

type LoginFormValues = zod.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    setServerError(null);

    try {
      // 1. Authenticate against Firebase Auth Client SDK
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);
      
      // 2. Extract JWT Token
      const idToken = await userCredential.user.getIdToken();
      
      // 3. Persist HTTP-only cookie via Server Action
      await createSession(idToken);
      
      // 4. Force route refresh to dashboard
      router.push("/writeradmin/dashboard");
      router.refresh();
    } catch (error: any) {
      console.error("Auth error:", error);
      setServerError("Invalid email or password parameters. Access denied.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md border border-border bg-white p-8 md:p-10 shadow-sm rounded-sm animate-fade-in">
        <div className="text-center mb-8">
          <span className="font-sans text-xs tracking-widest uppercase text-muted-foreground block mb-2">
            Secure Entry
          </span>
          <h2 className="text-3xl font-serif">Literary Studio CMS</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {serverError && (
            <div className="p-3 bg-red-50 border border-red-200 text-sm text-red-700 font-sans rounded-sm">
              {serverError}
            </div>
          )}

          <div className="space-y-1">
            <label className="block text-xs font-sans tracking-wider uppercase text-muted-foreground">
              Administrator Email
            </label>
            <input
              type="email"
              disabled={isLoading}
              className="w-full px-4 py-2 bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring font-sans text-sm transition-all"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-xs text-red-600 font-sans mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-sans tracking-wider uppercase text-muted-foreground">
              Security Key Matrix
            </label>
            <input
              type="password"
              disabled={isLoading}
              className="w-full px-4 py-2 bg-background border border-border focus:outline-none focus:ring-1 focus:ring-ring font-sans text-sm transition-all"
              {...register("password")}
            />
            {errors.password && (
              <p className="text-xs text-red-600 font-sans mt-1">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-primary-foreground font-sans tracking-widest uppercase text-xs py-3 hover:opacity-90 transition-all disabled:opacity-50"
          >
            {isLoading ? "Verifying Credentials..." : "Authenticate Workspace"}
          </button>
        </form>
      </div>
    </div>
  );
}