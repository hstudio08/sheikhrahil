import type { Metadata } from "next";
import { Cormorant_Garamond, Lora, Inter } from "next/font/google";
import "./globals.css";
import { BackgroundPrefetcher } from "@/components/public/BackgroundPrefetcher";

// Typography: Elegant serif for headings
const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

// Typography: Highly readable serif for poetry body
const lora = Lora({ 
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

// Typography: Clean sans for functional UI elements (dates, small buttons)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    template: "%s | Sheikh Rahil",
    default: "Sheikh Rahil | Poet, Writer & Teacher",
  },
  description: "The official digital home for the poetry, quotes, and writings of Sheikh Rahil.",
  metadataBase: new URL("https://rahilyousuf.vercel.app"), 
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${lora.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col selection:bg-primary selection:text-primary-foreground">
        
        {/* Silently pre-fetches all main routes in the background so clicks are instant */}
        <BackgroundPrefetcher />

        {/* Global content wrapper */}
        {children}
      </body>
    </html>
  );
}