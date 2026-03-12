import React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";
import "../../app/globals.css";
import { ThemeProvider } from "@/lib/theme-provider";

import { Navbar } from "@/components/Layout/Navbar";
import { Footer } from "@/components/Layout/Footer";

export const metadata: Metadata = {
  title: "Invest - Stock Investment Platform",
  description: "Modern stock investment platform for managing portfolios",
  generator: "devsupgroup.com",
};

export default function HomeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white dark:bg-darkbg" suppressHydrationWarning>
        <ThemeProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>

        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
