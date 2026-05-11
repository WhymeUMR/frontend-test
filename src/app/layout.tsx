import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { QueryProvider } from "@/components/query-provider";
import { TokenProvider } from "@/components/token-provider";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "TableCRM — Оформление заказа",
  description: "Мобильная форма оформления заказа TableCRM",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#6163ff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full bg-muted/30 flex flex-col">
        <TokenProvider>
          <QueryProvider>
            <div className="mx-auto w-full max-w-md min-h-screen bg-background shadow-sm flex flex-col">
              {children}
            </div>
            <Toaster richColors position="top-center" />
          </QueryProvider>
        </TokenProvider>
      </body>
    </html>
  );
}
