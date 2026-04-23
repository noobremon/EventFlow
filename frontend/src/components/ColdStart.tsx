"use client";

import { useEffect } from "react";

export function ColdStart() {
  useEffect(() => {
    // Ping the backend to wake it up from a cold start on Render
    fetch("https://event-platform-backend-5mnw.onrender.com/health")
      .then((res) => res.json())
      .then((data) => console.log("Backend wake up successful:", data))
      .catch((err) => console.error("Error waking up backend:", err));
  }, []);

  return null; // This component doesn't render anything
}
