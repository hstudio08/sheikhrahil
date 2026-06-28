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
  metadataBase: new URL("https://rahilyousuf.vercel.app"), 
  
  // SEO: Core Title & Description targeting name variations
  title: {
    template: "%s | Sheikh Rahil",
    default: "Sheikh Rahil (Rahil Yousuf) | Poet, Writer & Teacher",
  },
  description: "The official digital home for the poetry, quotes, and literary works of Sheikh Rahil (also known as Rahil Yousuf Sheikh). Explore original writings and reflections.",
  
  // SEO: Keywords targeting your specific search queries
  keywords: [
    "Sheikh Rahil", 
    "Rahil Yousuf", 
    "Rahil Yousuf Sheikh", 
    "Poet", 
    "Writer", 
    "Teacher", 
    "Poetry", 
    "Quotes",
    "Literature",
    "Kashmiri Poet" // Add regional keywords if applicable
  ],
  authors: [{ name: "Sheikh Rahil (Rahil Yousuf)" }],
  creator: "Sheikh Rahil",

  // SEO: Favicon Configuration (from your zip file)
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
  },
  manifest: '/site.webmanifest',

  // SEO: Open Graph for rich previews on WhatsApp, Facebook, LinkedIn, etc.
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://rahilyousuf.vercel.app",
    title: "Sheikh Rahil (Rahil Yousuf) | Poet & Writer",
    description: "The official digital home for the poetry, quotes, and literary works of Sheikh Rahil.",
    siteName: "Sheikh Rahil Portfolio",
    // NOTE: Add an image named 'og-image.jpg' (1200x630px) to your public folder for social sharing previews
    images: [
      {
        url: "/og-image.jpg", 
        width: 1200,
        height: 630,
        alt: "Sheikh Rahil - Poet & Writer",
      },
    ],
  },

  // SEO: Twitter Cards for rich previews on X/Twitter
  twitter: {
    card: "summary_large_image",
    title: "Sheikh Rahil (Rahil Yousuf) | Poet & Writer",
    description: "The official digital home for the poetry, quotes, and literary works of Sheikh Rahil.",
    // creator: "@yourtwitterhandle", // Uncomment and add your handle if you have one
    images: ["/og-image.jpg"], 
  },

  // SEO: Search Engine Crawling Rules
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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