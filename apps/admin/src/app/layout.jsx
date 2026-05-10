import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ThemeProvider";
import { StoreProvider } from "@/store/StoreProvider";
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});
const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});
export const metadata = {
    title: "RajulEye | Admin Panel",
    description: "Premium E-commerce Admin Dashboard",
};
export default async function RootLayout({ children, }) {
    let settings = null;
    try {
        const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const res = await fetch(`${apiBase}/api/v1/settings`, {
            next: { revalidate: 60 },
        });
        const json = await res.json();
        settings = json.data;
    } catch (error) {
        console.error("Failed to fetch settings for admin layout", error);
    }

    const customStyle = settings?.primaryColor
        ? {
            "--primary": settings.primaryColor,
            "--sidebar-primary": settings.primaryColor,
            }
        : {};

    return (<html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`} style={customStyle}>
        <StoreProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            {children}
            <Toaster position="bottom-right" closeButton/>
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>);
}
