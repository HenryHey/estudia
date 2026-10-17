import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist } from "next/font/google";
import { defaultLocale, t } from "@/lib/i18n";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: t(defaultLocale, "home.title"),
  description: t(defaultLocale, "home.intro"),
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang={defaultLocale} className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
