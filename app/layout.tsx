import React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "sonner";
import "./globals.css";
import { ThemeProvider } from "@/lib/theme-provider";
import { ReduxProvider } from "./services/Provider/Providers";
import { CartProvider } from "./services/Provider/CartProvider";

export const metadata: Metadata = {
  title: "Invest - Stock Investment Platform",
  description: "Modern stock investment platform for managing portfolios",
  generator: "devsupgroup.com",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-white dark:bg-darkbg" suppressHydrationWarning>
        <NextTopLoader
          color="#0CB055"
          initialPosition={0.08}
          crawlSpeed={200}
          height={3}
          crawl={true}
          showSpinner={true}
          easing="ease"
          speed={200}
          shadow="0 0 10px #2299DD,0 0 5px #2299DD"
        />
        <ReduxProvider>
          <CartProvider>
            <ThemeProvider>{children}</ThemeProvider>
          </CartProvider>
        </ReduxProvider>
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
