import type { Metadata } from "next";
import { Cormorant_Garamond, Lora, Inter } from "next/font/google";
import "./globals.css";

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
  metadataBase: new URL("https://your-production-url.com"), 
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${lora.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col">
        {/* We removed the global max-w-7xl wrapper here so the admin panel can be edge-to-edge. 
            We will apply public constraints directly to public layouts in Phase 6. */}
        {children}
      </body>
    </html>
  );
}