import { db } from "./config";
import { collection, doc, setDoc, getDocs, deleteDoc, query, orderBy } from "firebase/firestore";
import { Poem } from "@/types";

const COLLECTION_NAME = "poems";

/**
 * Creates a new poem in Firestore.
 * Automatically generates the ID and timestamps.
 */
export async function createPoem(poemData: Omit<Poem, "id" | "createdAt" | "updatedAt">): Promise<string> {
  const docRef = doc(collection(db, COLLECTION_NAME));
  const now = Date.now();
  
  const newPoem: Poem = {
    ...poemData,
    id: docRef.id,
    createdAt: now,
    updatedAt: now,
  };
  
  await setDoc(docRef, newPoem);
  return newPoem.id;
}

/**
 * Retrieves all poems ordered by creation date (newest first).
 */
export async function getPoems(): Promise<Poem[]> {
  const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => doc.data() as Poem);
}

/**
 * Deletes a poem by its ID.
 */
export async function deletePoem(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}