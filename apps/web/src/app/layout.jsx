import { Inter } from "next/font/google";
import "./globals.css";
import { Suspense } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { BottomNav } from "@/components/layout/BottomNav";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";
import { AuthDialog } from "@/components/auth/AuthDialog";
import { ThemeProvider } from "@/components/theme-provider";
import { StoreProvider } from "@/store/StoreProvider";
const inter = Inter({ subsets: ["latin"] });
export async function generateMetadata() {
  let settings = null;
  try {
    const res = await fetch(`http://localhost:5000/api/v1/settings`, { next: { revalidate: 60 } });
    const json = await res.json();
    settings = json.data;
  } catch (error) {
    console.error("Failed to fetch settings for metadata");
  }

  return {
    title: settings?.homePageHeadingTitle || "Rajul Eye - Signature Optics",
    description: settings?.description || "Bespoke high-end eyewear and precision lens technology.",
    openGraph: {
      images: settings?.previewImage ? [`http://localhost:5000${settings.previewImage}`] : [],
    }
  };
}
export default async function RootLayout({ children, }) {
  let settings = null;
  try {
    const res = await fetch(`http://localhost:5000/api/v1/settings`, { next: { revalidate: 60 } });
    const json = await res.json();
    settings = json.data;
  } catch (error) {
    console.error("Failed to fetch settings for layout");
  }

  const customStyle = settings?.primaryColor ? { '--primary': settings.primaryColor, '--sidebar-primary': settings.primaryColor } : {};

  return (<html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen bg-background text-foreground antialiased flex flex-col overflow-x-hidden`} style={customStyle}>
        <StoreProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <Suspense fallback={null}>
              <Navbar settings={settings} />
            </Suspense>
            <main className="flex-1 pb-28 lg:pb-0 pt-28 lg:pt-32 overflow-x-hidden">
              {children}
              <Footer settings={settings} />
            </main>
            <BottomNav />
            <AuthDialog />
            <Toaster position="top-center"/>
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>);
}
