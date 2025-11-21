// FIX: Import `React` to make the `React` namespace available and to support JSX.
import React from "react";
import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "Sole Searcher",
  description: "A modern, high-end e-commerce store for exclusive sneakers.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap" rel="stylesheet" />
        <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />
      </head>
      <body className="bg-gray-50 text-gray-800" style={{fontFamily: "'Inter', sans-serif"}}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
