"use client";

import { useEffect } from "react";

export default function MainNoNavLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    localStorage.setItem("hasVisitedMain", "true");
  }, []);

  return (
    <>
      {children}
    </>
  );
}