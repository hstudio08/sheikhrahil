"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export function BackgroundPrefetcher() {
  const router = useRouter();

  useEffect(() => {
    // List all the core public routes of your website
    const routes = ["/", "/poems", "/quotes", "/about", "/contact"];

    const prefetchRoutes = () => {
      // router.prefetch loads the route's layout and skeleton (Suspense fallback)
      // directly into the browser's memory. 
      routes.forEach((route) => {
        router.prefetch(route);
      });
    };

    // Wait until the main page has completely finished loading and the browser is resting
    if (typeof window !== "undefined") {
      if ("requestIdleCallback" in window) {
        window.requestIdleCallback(prefetchRoutes);
      } else {
        // Fallback for Safari
        setTimeout(prefetchRoutes, 1500);
      }
    }
  }, [router]);

  return null; // Invisible component
}