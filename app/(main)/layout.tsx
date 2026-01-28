"use client";

import { useEffect } from "react";
import Navbar from "@/components/layout/navbar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    // Set flag bahwa user sudah pernah buka main page
    localStorage.setItem("hasVisitedMain", "true");
  }, []);

  return (
    <>
      {children}
      <Navbar />
    </>
  );
}
