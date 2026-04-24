"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

// Limit in milliseconds (30 minutes)
const INACTIVITY_LIMIT = 30 * 60 * 1000;

export function InactivityLogout() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const logout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/auth/login");
            router.refresh();
          },
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
      // Fallback redirect
      window.location.href = "/auth/login";
    }
  };

  const resetTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    
    // Only set timer if there is an active session
    if (session) {
      timerRef.current = setTimeout(logout, INACTIVITY_LIMIT);
    }
  };

  useEffect(() => {
    if (!session) {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // List of events to listen for to detect activity
    const events = [
      "mousedown",
      "mousemove",
      "keydown",
      "scroll",
      "touchstart",
      "click",
    ];

    // Initialize the timer
    resetTimer();

    // Add event listeners
    const handleActivity = () => resetTimer();
    
    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    // Cleanup
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [session]);

  return null;
}
