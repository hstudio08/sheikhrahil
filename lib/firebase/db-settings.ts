import { db } from "./config";
import { doc, setDoc, getDoc, collection, getCountFromServer } from "firebase/firestore";
import { AuthorProfile } from "@/types";

const COLLECTION_NAME = "settings";
const DOCUMENT_ID = "profile";

export async function getAuthorProfile(): Promise<AuthorProfile | null> {
  const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
  const snapshot = await getDoc(docRef);
  
  if (snapshot.exists()) {
    return snapshot.data() as AuthorProfile;
  }
  return null;
}

export async function saveAuthorProfile(data: Omit<AuthorProfile, "updatedAt">): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, DOCUMENT_ID);
  
  const profile: AuthorProfile = {
    ...data,
    updatedAt: Date.now(),
  };
  
  await setDoc(docRef, profile, { merge: true });
}

// Utility to get live stats for the Dashboard
export async function getDashboardStats() {
  const poemsCount = await getCountFromServer(collection(db, "poems"));
  const quotesCount = await getCountFromServer(collection(db, "quotes"));
  
  return {
    poems: poemsCount.data().count,
    quotes: quotesCount.data().count,
  };
}