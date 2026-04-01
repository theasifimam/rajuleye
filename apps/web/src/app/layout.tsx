import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { ThemeProvider } from "@/components/theme-provider";
import { StoreProvider } from "@/store/StoreProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Rajul Eye - Signature Optics",
  description: "Bespoke high-end eyewear and precision lens technology.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased flex flex-col overflow-x-hidden`}>
        <StoreProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Navbar />
            <main className="flex-1 pb-28 lg:pb-0 pt-28 lg:pt-32 overflow-x-hidden">
              {children}
              <Footer />
            </main>
            <BottomNav />
            <AuthDialog />
            <Toaster position="top-center" />
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
