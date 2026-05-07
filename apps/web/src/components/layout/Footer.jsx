"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Instagram,
  Twitter,
  Facebook,
  ArrowUpRight,
  Globe,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
export function Footer({ settings }) {
  const [categories, setCategories] = useState([]);
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const apiBase =
          process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
        const response = await fetch(`${apiBase}/api/v1/categories`);
        const data = await response.json();
        if (data.success) {
          setCategories(data.data.slice(0, 4)); // Only show top 4 categories
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      }
    };
    fetchCategories();
  }, []);
  const handleSubscribe = async () => {
    if (!email) {
      toast.error("Please enter a valid email to subscribe.");
      return;
    }
    setIsSubscribing(true);
    try {
      const apiBase =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
      const response = await fetch(`${apiBase}/api/v1/subscribers/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success(data.message || "Subscribed successfully!");
        setEmail("");
      } else {
        toast.error(data.message || "Failed to subscribe. Please try again.");
      }
    } catch (error) {
      console.error("Subscription error", error);
      toast.error("An error occurred during subscription.");
    } finally {
      setIsSubscribing(false);
    }
  };
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <footer className="relative bg-[#050505] text-white pt-24 pb-12 overflow-hidden">
      {/* Background Decorative Element - Large Brand Name */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 select-none pointer-events-none">
        <span className="text-[15vw] font-black leading-none text-white/1.5 tracking-tighter uppercase">
          <span className="text-primary/5">Rajul</span>Eye
        </span>
      </div>

      <div className="container mx-auto px-6 max-w-[1600px] relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 mb-24">
          {/* Brand & Manifesto Section */}
          <div className="lg:col-span-4 space-y-8">
            <Link href="/" className="inline-block group">
              <div className="flex items-baseline gap-1 select-none transition-transform duration-500 group-hover:scale-105">
                <span className="text-3xl font-black uppercase tracking-tighter">
                  Rajul
                </span>
                <span className="text-3xl font-light uppercase tracking-tighter opacity-40">
                  Eye
                </span>
              </div>
            </Link>
            <p className="text-base text-white/50 font-medium leading-[1.6] max-w-sm italic">
              "Our mission is to engineer visual clarity with architectural
              intent, crafting the interface between your vision and the world."
            </p>

            {/* Social Islands - Integrated here for balance */}
            <div className="flex items-center gap-3 pt-4">
              {[
                { icon: Instagram, label: "Instagram", href: settings?.instagramUrl || "#" },
                { icon: Facebook, label: "Facebook", href: settings?.facebookUrl || "#" },
              ].map((social, i) => (
                <a
                  key={i}
                  href={social.href}
                  className="h-10 w-10 rounded-xl bg-white/3 border border-white/5 flex items-center justify-center text-white/40 hover:text-primary hover:bg-white/8 hover:border-primary/20 transition-all duration-300"
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Links Grid */}
          <div className="lg:col-span-4 grid grid-cols-2 gap-8 pt-4 lg:pt-0">
            <div className="space-y-8">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">
                Categories
              </h4>
              <ul className="space-y-4">
                {categories.length > 0
                  ? categories.map((cat) => (
                      <li key={cat._id}>
                        <Link
                          href={`/collections/${cat.slug}`}
                          className="text-xs font-bold text-white/40 hover:text-white transition-all uppercase tracking-widest flex items-center gap-2 group"
                        >
                          <span className="h-px w-0 bg-primary group-hover:w-3 transition-all duration-500" />
                          {cat.name}
                        </Link>
                      </li>
                    ))
                  : [
                      "Digital Lenses",
                      "Titanium Frames",
                      "Architect Sun",
                      "Heritage Batch",
                    ].map((item) => (
                      <li key={item}>
                        <Link
                          href="/search"
                          className="text-xs font-bold text-white/40 hover:text-white transition-all uppercase tracking-widest flex items-center gap-2 group"
                        >
                          <span className="h-px w-0 bg-primary group-hover:w-3 transition-all duration-500" />
                          {item}
                        </Link>
                      </li>
                    ))}
              </ul>
            </div>

            <div className="space-y-8">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">
                Quick Links
              </h4>
              <ul className="space-y-4">
                {[
                  { label: "About Us", href: "/about" },
                  { label: "Contact Us", href: "/help" },
                  { label: "Terms of Service", href: "/terms" },
                  { label: "Privacy Policy", href: "/terms" },
                ].map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-xs font-bold text-white/40 hover:text-white transition-all uppercase tracking-widest flex items-center gap-2 group"
                    >
                      <span className="h-px w-0 bg-primary group-hover:w-3 transition-all duration-500" />
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Newsletter & Contact Section */}
          <div className="lg:col-span-4 space-y-10 pt-4 lg:pt-0">
            <div className="space-y-6">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">
                Newsletter
              </h4>
              {/* Compact Newsletter */}
              <div className="p-6 rounded-[2rem] bg-white/2 border border-white/5 backdrop-blur-xl relative group overflow-hidden">
                <div className="absolute -top-12 -right-12 w-24 h-24 bg-primary/10 rounded-full blur-2xl" />
                <div className="space-y-4 relative z-10">
                  <p className="text-[11px] font-bold text-white/60 uppercase tracking-widest leading-normal">
                    Get limited drop notifications and tech logs.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                      disabled={isSubscribing}
                      placeholder="identity@domain.com"
                      className="h-10 bg-black/40 border-none rounded-xl px-4 text-[10px] font-bold w-full placeholder:text-white/20 focus:ring-1 focus:ring-primary/30 transition-all font-mono"
                    />
                    <Button
                      onClick={handleSubscribe}
                      disabled={isSubscribing}
                      className="h-10 w-10 rounded-xl p-0 bg-primary text-black hover:scale-105 transition-transform active:scale-95 shrink-0"
                    >
                      {isSubscribing ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <ArrowUpRight className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6 pt-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/60">
                Digital Atelier
              </h4>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">
                    Global HQ
                  </p>
                  <p className="text-[10px] font-bold text-white/60 leading-relaxed uppercase italic whitespace-pre-wrap">
                    {settings?.address || "1028 Signature Tower,\nCyberCity, New Delhi"}
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-[9px] font-black text-white/20 uppercase tracking-widest">
                    Connect
                  </p>
                  <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest hover:text-primary transition-colors cursor-pointer block">
                    {settings?.contactPhone || "+91 (800) 293-2930"}
                  </p>
                  <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest hover:text-primary transition-colors cursor-pointer block truncate underline decoration-primary/20">
                    {settings?.contactEmail || "identity@rajuleye.com"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar - Signature Refined */}
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-12">
            <p className="text-[9px] font-black uppercase tracking-[0.3em] text-white/20">
              © 2026 RAJUL EYE SIGNATURE OPTICS / ALL CALIBRATIONS RESERVED.
            </p>
            <div className="h-px w-12 bg-white/05 hidden md:block" />
            <div
              className="flex items-center gap-2 group cursor-pointer"
              onClick={scrollToTop}
            >
              <span className="text-[9px] font-black uppercase tracking-[.3em] text-primary group-hover:text-white transition-colors">
                Return to Atmosphere
              </span>
              <Globe className="h-3 w-3 text-primary animate-pulse" />
            </div>
          </div>

          <div className="flex items-center gap-8">
            <p className="text-[9px] font-black uppercase tracking-widest text-white/20">
              SYSTEM ARCHITECT /{" "}
              <a
                href="https://asif.mazlis.com"
                target="_blank"
                className="text-primary/60 hover:text-primary transition-colors"
              >
                ASIF IMAM
              </a>
            </p>
          </div>
        </div>

        {/* Animated Scanner Beam - Mobile/Desktop Decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-primary/30 to-transparent -translate-x-full animate-[scan_6s_linear_infinite]" />
      </div>

      <style jsx global>{`
        @keyframes scan {
          from {
            transform: translateX(-100%);
          }
          to {
            transform: translateX(100%);
          }
        }
      `}</style>
    </footer>
  );
}
