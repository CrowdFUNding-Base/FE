import type { Metadata } from "next";
import "@/styles/globals.css";
import {
  SFCompactRegular,
  SFCompactMedium,
  SFCompactSemibold,
  SFCompactBold,
} from "@/utils/helpers/font";
import Web3Provider from "@/components/Contexts/Web3Provider";
import Navbar from "@/components/layout/navbar";

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
        className={`${SFCompactRegular.variable}  ${SFCompactMedium.variable} ${SFCompactSemibold.variable} ${SFCompactBold.variable} antialiased`}
      >
        <Web3Provider>
          {children}
          <Navbar />
        </Web3Provider>
      </body>
    </html>
  );
}

