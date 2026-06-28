"use client";

import { useState, useEffect } from "react";
import { Share2, Link as LinkIcon } from "lucide-react";

interface ShareMenuProps {
  title: string;
  url: string;
}

// Custom SVGs matching the Lucide design language to replace the removed brand icons
const TwitterIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

export function ShareMenu({ title, url }: ShareMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  useEffect(() => {
    // Safely check for navigator and the share property without upsetting TypeScript
    if (typeof window !== "undefined" && typeof navigator !== "undefined" && "share" in navigator) {
      setCanNativeShare(true);
    }
  }, []);

  const handleNativeShare = async () => {
    try {
      if ("share" in navigator) {
        // Cast to any to bypass the TS missing property error
        await (navigator as any).share({
          title,
          url,
        });
      }
    } catch (error) {
      console.error("Error sharing natively:", error);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      setIsOpen(false);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  if (canNativeShare) {
    return (
      <button 
        onClick={handleNativeShare} 
        className="flex items-center gap-2 hover:text-primary transition-colors text-muted-foreground" 
        aria-label="Share"
      >
        <Share2 className="w-4 h-4" />
        <span className="font-sans text-[10px] uppercase tracking-widest">Share</span>
      </button>
    );
  }

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="flex items-center gap-2 hover:text-primary transition-colors text-muted-foreground" 
        aria-label="Share options"
      >
        <Share2 className="w-4 h-4" />
        <span className="font-sans text-[10px] uppercase tracking-widest">Share</span>
      </button>
      
      {isOpen && (
        <div className="absolute bottom-full right-0 mb-3 p-2 bg-background border border-border shadow-sm flex items-center gap-2 z-50 animate-fade-in">
          <button 
            onClick={copyToClipboard} 
            className="p-3 hover:bg-muted text-muted-foreground hover:text-primary transition-colors" 
            title={isCopied ? "Copied!" : "Copy Link"}
          >
            <LinkIcon className="w-4 h-4" />
          </button>
          <a 
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="p-3 hover:bg-muted text-muted-foreground hover:text-primary transition-colors" 
            title="Share on X"
          >
            <TwitterIcon className="w-4 h-4" />
          </a>
          <a 
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="p-3 hover:bg-muted text-muted-foreground hover:text-primary transition-colors" 
            title="Share on Facebook"
          >
            <FacebookIcon className="w-4 h-4" />
          </a>
          <a 
            href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="p-3 hover:bg-muted text-muted-foreground hover:text-primary transition-colors" 
            title="Share on LinkedIn"
          >
            <LinkedinIcon className="w-4 h-4" />
          </a>
        </div>
      )}
    </div>
  );
}