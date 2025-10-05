"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect } from "react";

/**
 * MoneyTrackerSync Component
 * 
 * Automatically syncs user authentication state to localStorage
 * for the Money Tracker browser extension to access.
 * 
 * This component:
 * - Sets user data in localStorage when user signs in
 * - Removes user data from localStorage when user signs out
 * - Runs automatically in the background
 */
export default function MoneyTrackerSync() {
  const { user, isLoaded } = useUser();

  useEffect(() => {
    // Wait for Clerk to finish loading
    if (!isLoaded) return;

    if (user) {
      // User is signed in - store data for extension
      const userData = {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress || "",
        name: user.fullName || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        imageUrl: user.imageUrl || "",
        createdAt: Date.now(),
      };

      localStorage.setItem("moneyTrackerUser", JSON.stringify(userData));
      console.log("✅ Money Tracker: User data synced to localStorage", userData);
    } else {
      // User is signed out - clear extension data
      localStorage.removeItem("moneyTrackerUser");
      console.log("🔒 Money Tracker: User data cleared from localStorage");
    }
  }, [user, isLoaded]);

  // This component doesn't render anything
  return null;
}
