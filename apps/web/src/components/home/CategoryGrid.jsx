"use client";
import React from "react";
import Link from "next/link";
import { useGetCategoriesQuery } from "@/store/categoryApi";
import { Skeleton } from "@/components/ui/skeleton";
export function CategoryGrid() {
  const { data: result, isLoading } = useGetCategoriesQuery({ isActive: true });
  const allCategories = result?.data || [];
  // Filter mostly the subcategories for eyeglasses that we just added,
  // excluding the root "eyeglasses" category itself if possible.
  // We can just take up to 4 to match the bento grid design.
  const displayCategories = allCategories
    .filter((cat) => cat.slug !== "eyeglasses")
    .slice(0, 4);
  if (isLoading) {
    return (
      <section className="container px-6 md:px-12 mx-auto max-w-[1600px]">
        <div className="flex flex-col mb-10">
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-12 w-64 md:w-96" />
        </div>
        <div className="flex w-full gap-2 sm:gap-4 overflow-hidden">
          <Skeleton className="flex-1 h-12 md:h-14 rounded-full" />
          <Skeleton className="flex-1 h-12 md:h-14 rounded-full" />
          <Skeleton className="flex-1 h-12 md:h-14 rounded-full" />
          <Skeleton className="flex-1 h-12 md:h-14 rounded-full" />
        </div>
      </section>
    );
  }
  return (
    <section className="container px-6 md:px-12 mx-auto max-w-[1600px]">
      <div className="flex flex-col mb-8">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/60 mb-2">
          Refined Selection
        </p>
        <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">
          Curated Vision
        </h2>
      </div>

      <div className="flex w-full gap-2 sm:gap-4 overflow-hidden">
        {displayCategories.map((cat) => (
          <Link
            key={cat.id}
            href={`/search?category=${cat.id}`}
            className="flex-1 flex items-center justify-center py-3 md:py-4 rounded-full border border-primary/20 bg-muted/30 hover:bg-primary hover:text-primary-foreground hover:shadow-lg transition-all duration-300 font-black text-[9px] sm:text-xs md:text-sm lg:text-base uppercase tracking-widest min-w-0"
          >
            <span className="truncate px-1 md:px-2">{cat.name}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
