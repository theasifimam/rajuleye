"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useGetCategoriesQuery } from "@/store/categoryApi";
import { useGetProductsQuery, useGetFilterOptionsQuery } from "@/store/productApi";
import { ProductCard } from "@/components/product/ProductCard";
import { FilterSidebar } from "@/components/product/FilterSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  SlidersHorizontal,
  ArrowDownAZ,
  ArrowUpZA,
  Flame,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { CatalogView } from "@/components/product/CatalogView";

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-[50vh]">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      }
    >
      <CatalogView basePath="/search" />
    </Suspense>
  );
}
