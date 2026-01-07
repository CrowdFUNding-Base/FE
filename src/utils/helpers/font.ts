import localFont from "next/font/local";

export const SFCompactRegular = localFont({
  src: "./fonts/SF-Compact-Rounded-Regular.ttf",
  display: "swap",
  weight: "400",
  variable: "--font-sf-compact-regular",
});

export const SFCompactMedium = localFont({
  src: "./fonts/SF-Compact-Rounded-Medium.ttf",
  display: "swap",
  weight: "500",
  variable: "--font-sf-compact-medium",
});

export const SFCompactSemibold = localFont({
  src: "./fonts/SF-Compact-Rounded-Semibold.ttf",
  display: "swap",
  weight: "600",
  variable: "--font-sf-compact-semibold",
});

export const SFCompactBold = localFont({
  src: "./fonts/SF-Compact-Rounded-Bold.ttf",
  display: "swap",
  weight: "700",
  variable: "--font-sf-compact-bold",
});
