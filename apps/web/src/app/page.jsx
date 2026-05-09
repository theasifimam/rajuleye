"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Eye, ShieldCheck } from "lucide-react";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { ProductSlider } from "@/components/product/ProductSlider";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { useGetProductsQuery } from "@/store/productApi";

export default function Home() {
  const { data: productsData, isLoading } = useGetProductsQuery({ limit: 8 });
  const FEATURED_PRODUCTS = productsData?.data.products || [];
  return (
    <div className="flex flex-col gap-12 pb-24">
      {/* Hero Section */}
      <HeroCarousel />

      {/* Bento Categories */}
      <CategoryGrid />

      {/* Featured Products */}
      <section className="container px-6 md:px-12 mx-auto max-w-[1600px]">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter">
              Iconic Silhouettes
            </h2>
            <p className="text-sm text-muted-foreground font-medium">
              Trending eye-wear essentials.
            </p>
          </div>
          <Link
            href="/search"
            className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-widest hover:text-primary transition-colors"
          >
            View All{" "}
            <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
        <ProductSlider products={FEATURED_PRODUCTS} />
      </section>

      {/* Tech/Innovation Banner */}
      <section className="container px-4 md:px-12 mx-auto max-w-[1600px] mt-8">
        <div className="rounded-[2.5rem] md:rounded-[3.5rem] bg-primary text-primary-foreground p-8 py-12 md:p-20 flex flex-col md:flex-row items-center justify-between gap-10 md:gap-12 overflow-hidden relative shadow-xl">
          <div className="absolute left-0 top-0 w-full h-full opacity-20 pointer-events-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(0,0,0,0.3),transparent)] blur-3xl opacity-40" />
          </div>

          <div className="z-10 flex flex-col gap-8 flex-1">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-foreground/10 border border-primary-foreground/10 text-[9px] font-black uppercase tracking-[0.3em]">
                Innovation Hub
              </div>
              <h3 className="text-4xl md:text-7xl font-black uppercase leading-[0.9] tracking-tighter">
                Beyond
                <br />
                Static Vision
              </h3>
              <p className="text-primary-foreground/80 md:text-xl font-medium max-w-md tracking-tight">
                Our lenses adapt to your lifestyle, filtering harmful spectrums
                while enhancing neural focus.
              </p>
            </div>

            <div className="flex flex-wrap gap-8 py-4 border-t border-primary-foreground/20">
              <div className="flex flex-col gap-1">
                <ShieldCheck className="h-5 w-5 text-primary-foreground" />
                <span className="text-[10px] font-black uppercase tracking-widest pt-1">
                  99.8% UV Block
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <Eye className="h-5 w-5 text-primary-foreground" />
                <span className="text-[10px] font-black uppercase tracking-widest pt-1">
                  HD Clarity
                </span>
              </div>
            </div>
          </div>

          <div className="z-10 shrink-0 w-full md:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="rounded-full w-full md:w-auto px-12 h-16 border-2 border-primary-foreground hover:bg-primary-foreground hover:text-primary font-black text-xs uppercase tracking-[0.2em] transition-all bg-transparent text-primary-foreground"
              asChild
            >
              <Link href="/search">Book Consult</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
