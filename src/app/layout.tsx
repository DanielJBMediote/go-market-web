import { GlobalModal } from "@/components/modal";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/auth-provider";
import { ClientCartProvider } from "@/contexts/client-cart-provider";
import { ModalProvider } from "@/contexts/modal-provider";
import { QueryProvider } from "@/contexts/query-provider";
import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Geist, Geist_Mono } from "next/font/google";
import React from "react";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Go Market",
  description: "Another e-commerce website.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background`}>
        <ThemeProvider
          storageKey="go-market-theme"
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            <ModalProvider>
              <AuthProvider>
                <ClientCartProvider>{children}</ClientCartProvider>
                <Toaster richColors position="top-right" />
              </AuthProvider>
              <GlobalModal />
            </ModalProvider>
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
