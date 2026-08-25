"use client";

import { useEffect, useState } from "react";
import { DEMO_PROFILE } from "./data";

/**
 * Demo citizen session — prototype sign-in stored in localStorage.
 * No real credentials or sensitive data are collected. PROTOTYPE ONLY.
 *
 * Each browser session gets an unguessable random "citizen key" (UUID).
 * It is attached to submitted applications/grievances and required to read
 * them back — acting as a lightweight ownership token for the demo.
 */

const KEY = "sevasetu-demo-citizen";
const CITIZEN_KEY = "sevasetu-citizen-key";

export function isSignedIn(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(KEY) === "1";
}

/** Unguessable per-session ownership token for this demo citizen's records. */
export function getCitizenKey(): string {
  let key = window.localStorage.getItem(CITIZEN_KEY);
  if (!key) {
    key = crypto.randomUUID();
    window.localStorage.setItem(CITIZEN_KEY, key);
  }
  return key;
}

export function signInDemo(): void {
  window.localStorage.setItem(KEY, "1");
  getCitizenKey();
  window.dispatchEvent(new Event("sevasetu-auth"));
}

export function signOutDemo(): void {
  window.localStorage.removeItem(KEY);
  window.dispatchEvent(new Event("sevasetu-auth"));
}

export function getCitizen() {
  return DEMO_PROFILE;
}

/** React hook tracking demo sign-in state across components. */
export function useCitizenSession() {
  const [signedIn, setSignedIn] = useState(false);
  useEffect(() => {
    const sync = () => setSignedIn(isSignedIn());
    sync();
    window.addEventListener("sevasetu-auth", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("sevasetu-auth", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  return { signedIn, citizen: DEMO_PROFILE };
}
