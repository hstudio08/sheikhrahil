// ==========================================
// SHARED MEDIA INTERFACE
// ==========================================
export interface CloudinaryImage {
  publicId: string;
  url: string;
  width: number;
  height: number;
  format: string;
  altText?: string;
}

// ==========================================
// FIRESTORE COLLECTIONS
// ==========================================
export interface Poem {
  id: string;
  title: string;
  slug: string;
  body: string; // Tiptap HTML string
  publicationDate?: string | null; // ISO String (YYYY-MM-DD)
  coverImage?: CloudinaryImage | null;
  thumbnailImage?: CloudinaryImage | null;
  isFeatured: boolean;
  status: "draft" | "published";
  seoTitle?: string;
  seoDescription?: string;
  excerpt?: string;
  readTime?: string;
  createdAt: number; // Unix Timestamp
  updatedAt: number; // Unix Timestamp
}

export interface Quote {
  id: string;
  quote: string;
  author: string; // Defaults to "Sheikh Rahil"
  slug: string;
  publicationDate: string; // ISO String (YYYY-MM-DD)
  backgroundImage?: CloudinaryImage | null;
  thumbnail?: CloudinaryImage | null;
  seoTitle?: string;
  seoDescription?: string;
  isPublished: boolean;
  isFeatured: boolean; // <-- ADDED THIS FOR QUOTES
  createdAt: number;
  updatedAt: number;
}

export interface AuthorProfile {
  name: string;
  subtitle: string;
  portrait?: CloudinaryImage | null;
  biography: string;
  writingPhilosophy: string;
  teachingJourney: string;
  email: string;
  instagram: string;
  updatedAt: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  isRead: boolean;
  createdAt: number;
}

export interface MediaAsset {
  id: string;
  asset: CloudinaryImage;
  uploadedAt: number;
}

// ==========================================
// REALTIME DATABASE SCHEMAS
// ==========================================
export interface Comment {
  id: string;
  targetId: string; 
  targetType: "poem" | "quote";
  name: string;
  email: string;
  content: string;
  status: "pending" | "approved" | "rejected";
  createdAt: number;
}

export interface LikesCount {
  [targetId: string]: number; 
}