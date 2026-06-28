"use server";

import { cookies } from "next/headers";

const COOKIE_NAME = "rahil_admin_session";

/**
 * Creates an encrypted HTTP-only session cookie containing the authentication token.
 * Valid for 5 days.
 */
export async function createSession(idToken: string) {
  const cookieStore = await cookies();
  
  cookieStore.set(COOKIE_NAME, idToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 5, // 5 days
    path: "/",
  });
}

/**
 * Destroys the administration session cookie.
 */
export async function removeSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

/**
 * Helper to check if a session cookie exists on the server.
 */
export async function hasSession(): Promise<boolean> {
  const cookieStore = await cookies();
  return cookieStore.has(COOKIE_NAME);
}