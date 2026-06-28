import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://rahilyousuf.vercel.app";

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0, // Home page gets the highest priority
    },
    {
      url: `${baseUrl}/poems`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9, // High priority because this is your main content
    },
    {
      url: `${baseUrl}/quotes`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5, // Lower priority for the contact page
    },
  ];
}