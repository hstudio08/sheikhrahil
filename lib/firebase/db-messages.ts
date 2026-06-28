import { db } from "./config";
import { collection, doc, setDoc } from "firebase/firestore";
import { ContactMessage } from "@/types";

const COLLECTION_NAME = "messages";

/**
 * Creates a new contact message in Firestore.
 */
export async function createContactMessage(
  messageData: Omit<ContactMessage, "id" | "createdAt" | "isRead">
): Promise<string> {
  const docRef = doc(collection(db, COLLECTION_NAME));
  const now = Date.now();
  
  const newMessage: ContactMessage = {
    ...messageData,
    id: docRef.id,
    isRead: false,
    createdAt: now,
  };
  
  await setDoc(docRef, newMessage);
  return newMessage.id;
}