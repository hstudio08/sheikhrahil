import { db } from "./config";
import { collection, doc, setDoc, getDocs, deleteDoc, query, orderBy, where, limit, getDoc, updateDoc } from "firebase/firestore";
import { Quote } from "@/types";

const COLLECTION_NAME = "quotes";

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

export async function updateQuote(id: string, quoteData: Partial<Omit<Quote, "id" | "createdAt">>): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, {
    ...quoteData,
    updatedAt: Date.now(),
  });
}

export async function getQuotes(): Promise<Quote[]> {
  const q = query(collection(db, COLLECTION_NAME), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as Quote);
}

export async function getQuoteById(id: string): Promise<Quote | null> {
  const docRef = doc(db, COLLECTION_NAME, id);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return snapshot.data() as Quote;
}

export async function getAllPublishedQuotes(): Promise<Quote[]> {
  const q = query(
    collection(db, COLLECTION_NAME),
    where("isPublished", "==", true),
    orderBy("publicationDate", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as Quote);
}

export async function getLatestPublishedQuotes(limitCount: number = 3): Promise<Quote[]> {
  const q = query(
    collection(db, COLLECTION_NAME),
    where("isPublished", "==", true),
    orderBy("publicationDate", "desc"),
    limit(limitCount)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => doc.data() as Quote);
}

export async function getQuoteBySlug(slug: string): Promise<Quote | null> {
  const q = query(
    collection(db, COLLECTION_NAME),
    where("slug", "==", slug),
    where("isPublished", "==", true),
    limit(1)
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  return snapshot.docs[0].data() as Quote;
}

export async function deleteQuote(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}