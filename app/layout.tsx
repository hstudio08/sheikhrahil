import type { Metadata } from "next";
import { Cormorant_Garamond, Lora, Inter } from "next/font/google";
import "./globals.css";
import { BackgroundPrefetcher } from "@/components/public/BackgroundPrefetcher";

const cormorant = Cormorant_Garamond({ 
  subsets: ["latin"], 
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const lora = Lora({ 
  subsets: ["latin"],
  variable: "--font-lora",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rahilyousuf.vercel.app"), 
  
  title: {
    template: "%s | Sheikh Rahil Yousuf",
    default: "Sheikh Rahil Yousuf (Rahil Yousuf) | Legendary Poet, Writer & Teacher",
  },
  description: "Explore the literary world of Sheikh Rahil Yousuf (also known as Rahil Yousuf and Sheikh Rahil). A legendary poet, author, and teacher sharing profound poetry, quotes, and writings.",
  
  keywords: [
    "Sheikh Rahil Yousuf", 
    "Rahil Yousuf", 
    "Sheikh Rahil", 
    "Legendary Poet", 
    "Author",
    "Writer", 
    "Teacher", 
    "Poetry", 
    "Quotes",
    "Literature",
  ],
  authors: [{ name: "Sheikh Rahil Yousuf" }],
  creator: "Sheikh Rahil Yousuf",

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

  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://rahilyousuf.vercel.app",
    title: "Sheikh Rahil Yousuf | Legendary Poet, Writer & Teacher",
    description: "The official website for the poetry, quotes, and literary works of Sheikh Rahil Yousuf.",
    siteName: "Sheikh Rahil Yousuf Portfolio",
    images: [
      {
        url: "/og-image.jpg", 
        width: 1200,
        height: 630,
        alt: "Portrait of the legendary poet and writer, Sheikh Rahil Yousuf (Rahil Yousuf)",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Sheikh Rahil Yousuf | Legendary Poet & Writer",
    description: "The official digital home for the poetry, quotes, and literary works of Sheikh Rahil Yousuf.",
    images: ["/og-image.jpg"], 
  },
};

// This is the MAGIC for Google SEO. It explicitly links all your names.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Sheikh Rahil Yousuf",
  "alternateName": ["Rahil Yousuf", "Sheikh Rahil"],
  "jobTitle": ["Poet", "Writer", "Teacher", "Author"],
  "description": "Legendary poet, writer, and teacher known for profound literary works and poetry.",
  "url": "https://rahilyousuf.vercel.app",
  "image": "https://rahilyousuf.vercel.app/og-image.jpg",
  "sameAs": [
    // Add your social media links here if you have them (e.g., Instagram, Twitter)
    // "https://instagram.com/yourhandle",
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${lora.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col selection:bg-primary selection:text-primary-foreground">
        
        {/* Inject Schema.org JSON-LD into the head */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <BackgroundPrefetcher />
        {children}
      </body>
    </html>
  );
}