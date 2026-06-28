import { rtdb } from "./config";
import { ref, runTransaction, get, child } from "firebase/database";

/**
 * Gets the current like count for a specific content item (poem or quote).
 */
export async function getLikeCount(contentId: string): Promise<number> {
  const dbRef = ref(rtdb);
  try {
    const snapshot = await get(child(dbRef, `likes/${contentId}`));
    if (snapshot.exists()) {
      return snapshot.val() as number;
    }
    return 0;
  } catch (error) {
    console.error("Error fetching likes:", error);
    return 0;
  }
}

/**
 * Toggles a like (increments or decrements) safely using transactions.
 * This prevents race conditions if multiple users like simultaneously.
 */
export async function toggleLike(contentId: string, isLiking: boolean): Promise<void> {
  const likeRef = ref(rtdb, `likes/${contentId}`);
  
  try {
    await runTransaction(likeRef, (currentLikes: number | null) => {
      let nextLikes = currentLikes || 0;
      
      if (isLiking) {
        nextLikes += 1;
      } else {
        nextLikes = Math.max(0, nextLikes - 1);
      }
      
      return nextLikes;
    });
  } catch (error) {
    console.error("Error updating like transaction:", error);
    throw error;
  }
}