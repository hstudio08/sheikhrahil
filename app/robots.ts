import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // CRITICAL: Block search engines from indexing your admin dashboard
      disallow: ["/writeradmin/"], 
    },
    sitemap: "https://rahilyousuf.vercel.app/sitemap.xml",
  };
}