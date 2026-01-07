import type { Metadata } from "next";
import "@/styles/globals.css";
import {
  SFCompactRegular,
  SFCompactSemibold,
  SFCompactBold,
} from "@/utils/helpers/font";

export const metadata: Metadata = {
  title: "crowdFUNding",
  description: "Crowdfunding platform with gamification",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${SFCompactRegular.variable} ${SFCompactSemibold.variable} ${SFCompactBold.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

