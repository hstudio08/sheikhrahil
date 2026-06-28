import { db } from "./config";
import { collection, doc, setDoc, getDocs, deleteDoc, query, orderBy, where, limit } from "firebase/firestore";
import { Poem } from "@/types";

const COLLECTION_NAME = "poems";

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

export async function getPoems(): Promise<Poem[]> {
  const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => doc.data() as Poem);
}

export async function getAllPublishedPoems(): Promise<Poem[]> {
  const q = query(
    collection(db, COLLECTION_NAME),
    where("status", "==", "published"),
    orderBy("publicationDate", "desc")
  );
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => doc.data() as Poem);
}

export async function getFeaturedPublishedPoems(limitCount: number = 3): Promise<Poem[]> {
  const q = query(
    collection(db, COLLECTION_NAME),
    where("status", "==", "published"),
    where("isFeatured", "==", true),
    orderBy("publicationDate", "desc"),
    limit(limitCount)
  );
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map((doc) => doc.data() as Poem);
}

/**
 * Fetches a single published poem by its unique slug.
 */
export async function getPoemBySlug(slug: string): Promise<Poem | null> {
  const q = query(
    collection(db, COLLECTION_NAME),
    where("slug", "==", slug),
    where("status", "==", "published"),
    limit(1)
  );
  const snapshot = await getDocs(q);
  
  if (snapshot.empty) {
    return null;
  }
  
  return snapshot.docs[0].data() as Poem;
}

export async function deletePoem(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}