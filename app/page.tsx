"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    const hasVisitedMain = localStorage.getItem("hasVisitedMain");
    
    if (hasVisitedMain === "true") {
      // Sudah pernah buka main page, redirect ke home
      router.push("/home");
    } else {
      // Belum pernah buka main page, redirect ke onboarding
      router.push("/onboarding");
    }
  }, [router]);

  return null;
}
