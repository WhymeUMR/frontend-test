import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "Оформление заказа",
  description: "Мобильная форма оформления заказа",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`${geistSans.variable} h-full antialiased`}>
      <body className="min-h-full bg-muted/30 flex flex-col">
        <div className="mx-auto w-full max-w-md min-h-screen bg-background shadow-sm flex flex-col">
          {children}
        </div>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
