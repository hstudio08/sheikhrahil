import { db } from "./config";
import { collection, doc, setDoc, getDocs, deleteDoc, query, orderBy } from "firebase/firestore";
import { Quote } from "@/types";

const COLLECTION_NAME = "quotes";

/**
 * Creates a new quote in Firestore.
 */
export async function createQuote(quoteData: Omit<Quote, "id" | "createdAt" | "updatedAt">): Promise<string> {
  const docRef = doc(collection(db, COLLECTION_NAME));
  const now = Date.now();
  
  const newQuote: Quote = {
    ...quoteData,
    id: docRef.id,
    createdAt: now,
    updatedAt: now,
  };
  
  await setDoc(docRef, newQuote);
  return newQuote.id;
}

/**
 * Retrieves all quotes ordered by creation date (newest first).
 */
export async function getQuotes(): Promise<Quote[]> {
  const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => doc.data() as Quote);
}

/**
 * Deletes a quote by its ID.
 */
export async function deleteQuote(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}