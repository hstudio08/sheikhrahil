import { rtdb } from "./config";
import { ref, push, set, get, query, orderByChild, equalTo } from "firebase/database";
import { Comment } from "@/types";

const basePath = "comments";

/**
 * Submits a new comment to the Realtime Database.
 * All new comments default to 'pending' status for admin approval.
 */
export async function submitComment(
  targetId: string, 
  targetType: "poem" | "quote",
  data: { name: string; email: string; content: string }
): Promise<string> {
  // Store comments grouped by the specific targetId for efficient querying
  const commentsRef = ref(rtdb, `${basePath}/${targetId}`);
  const newCommentRef = push(commentsRef);
  
  const now = Date.now();
  const comment: Comment = {
    id: newCommentRef.key as string,
    targetId,
    targetType,
    name: data.name,
    email: data.email,
    content: data.content,
    status: "pending",
    createdAt: now,
  };

  await set(newCommentRef, comment);
  return comment.id;
}

/**
 * Retrieves ONLY approved comments for public display.
 */
export async function getApprovedComments(targetId: string): Promise<Comment[]> {
  const commentsRef = ref(rtdb, `${basePath}/${targetId}`);
  const approvedQuery = query(commentsRef, orderByChild("status"), equalTo("approved"));
  
  try {
    const snapshot = await get(approvedQuery);
    if (!snapshot.exists()) return [];

    const comments: Comment[] = [];
    snapshot.forEach((childSnapshot) => {
      comments.push(childSnapshot.val() as Comment);
    });

    // Sort descending (newest first)
    return comments.sort((a, b) => b.createdAt - a.createdAt);
  } catch (error) {
    console.error("Error fetching approved comments:", error);
    return [];
  }
}

/**
 * Updates a comment's status (used by the Admin Panel).
 */
export async function updateCommentStatus(
  targetId: string, 
  commentId: string, 
  status: "approved" | "rejected"
): Promise<void> {
  const statusRef = ref(rtdb, `${basePath}/${targetId}/${commentId}/status`);
  await set(statusRef, status);
}