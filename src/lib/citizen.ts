"use client";

import { useEffect, useState } from "react";
import { DEMO_PROFILE } from "./data";

/**
 * Demo citizen session — prototype sign-in stored in localStorage.
 * No real credentials or sensitive data are collected. PROTOTYPE ONLY.
 */

const KEY = "sevasetu-demo-citizen";

export function isSignedIn(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(KEY) === "1";
}

export function signInDemo(): void {
  window.localStorage.setItem(KEY, "1");
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
