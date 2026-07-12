// src/app/layout.tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const sfPro = localFont({
  src: [
    { path: "./fonts/SFPro-Regular.otf", weight: "400", style: "normal" },
    { path: "./fonts/SFPro-Medium.otf", weight: "500", style: "normal" },
    { path: "./fonts/SFPro-Bold.otf", weight: "700", style: "normal" },
  ],
  variable: "--font-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Sociality",
  description: "Social media app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sfPro.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}