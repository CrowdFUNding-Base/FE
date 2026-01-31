import type { Metadata } from "next";
import "@/styles/globals.css";
import {
  SFCompactRegular,
  SFCompactMedium,
  SFCompactSemibold,
  SFCompactBold,
} from "@/utils/helpers/font";
import Web3Provider from "@/components/Contexts/Web3Provider";

export const metadata: Metadata = {
  title: "crowdFUNding",
  description: "Crowdfunding platform with gamification",
  other: {
    "base:app_id": "697e04f5c6a03f3fe39cb5ce",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${SFCompactRegular.variable}  ${SFCompactMedium.variable} ${SFCompactSemibold.variable} ${SFCompactBold.variable} antialiased scrollbar-hide overflow-y-auto`}
      >
        <Web3Provider>
          {children}
        </Web3Provider>
      </body>
    </html>
  );
}

