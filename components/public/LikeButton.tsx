"use client";

import { useState, useEffect } from "react";
import { Heart } from "lucide-react";
import { getLikeCount, toggleLike } from "@/lib/firebase/rtdb-likes";

interface LikeButtonProps {
  targetId: string;
}

export function LikeButton({ targetId }: LikeButtonProps) {
  const [likes, setLikes] = useState<number>(0);
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  const [isLiking, setIsLiking] = useState<boolean>(false);

  useEffect(() => {
    // Check local storage to see if this browser already liked it
    const localLiked = localStorage.getItem(`liked_${targetId}`);
    if (localLiked) {
      setHasLiked(true);
    }

    // Fetch initial count
    const fetchLikes = async () => {
      const count = await getLikeCount(targetId);
      setLikes(count);
    };
    fetchLikes();
  }, [targetId]);

  const handleLike = async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    const newHasLiked = !hasLiked;
    
    // Optimistic UI update for instantaneous feedback
    setHasLiked(newHasLiked);
    setLikes((prev) => (newHasLiked ? prev + 1 : Math.max(0, prev - 1)));

    try {
      if (newHasLiked) {
        localStorage.setItem(`liked_${targetId}`, "true");
      } else {
        localStorage.removeItem(`liked_${targetId}`);
      }
      
      await toggleLike(targetId, newHasLiked);
    } catch (error) {
      // Revert optimistic update if database fails
      console.error("Failed to toggle like:", error);
      setHasLiked(!newHasLiked);
      setLikes((prev) => (!newHasLiked ? prev + 1 : Math.max(0, prev - 1)));
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <button 
      onClick={handleLike}
      disabled={isLiking}
      aria-label={hasLiked ? "Unlike" : "Like"} 
      className={`flex items-center gap-2 transition-colors ${
        hasLiked ? "text-red-500" : "text-muted-foreground hover:text-primary"
      }`}
    >
      <Heart className={`w-5 h-5 transition-transform ${hasLiked ? "fill-current scale-110" : ""}`} />
      <span className="font-sans text-[10px] uppercase tracking-widest">
        {likes > 0 ? `${likes} ` : ""}Like{likes !== 1 && likes > 0 ? "s" : ""}
      </span>
    </button>
  );
}