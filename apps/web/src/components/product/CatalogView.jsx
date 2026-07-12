"use client";
import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useGetCategoriesQuery } from "@/store/categoryApi";
import {
  useGetProductsQuery,
  useGetFilterOptionsQuery,
} from "@/store/productApi";
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
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function CatalogView({ initialFilters = {}, basePath = "/search" }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const urlQuery = searchParams.get("q");

  const [query, setQuery] = useState(urlQuery || "");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [sort, setSort] = useState(searchParams.get("sort") || "featured");

  const { data: categoryData } = useGetCategoriesQuery({});
  const { data: filterOptionsData } = useGetFilterOptionsQuery();

  const dynamicCategories = categoryData?.data || [];
  const filterOptions = filterOptionsData?.data || {};

  const parseArrayParam = (param) => {
    const val = searchParams.get(param);
    return val ? val.split(",") : [];
  };

  const currentFilters = {
    category: searchParams.get("category") || initialFilters.category || null,
    type: searchParams.get("type") || initialFilters.type || null,
    gender: searchParams.has("gender")
      ? parseArrayParam("gender")
      : initialFilters.gender || [],
    styles: searchParams.has("styles")
      ? parseArrayParam("styles")
      : initialFilters.styles || [],
    usage: searchParams.has("usage")
      ? parseArrayParam("usage")
      : initialFilters.usage || [],
    faceShapes: searchParams.has("faceShapes")
      ? parseArrayParam("faceShapes")
      : initialFilters.faceShapes || [],
    materials: searchParams.has("materials")
      ? parseArrayParam("materials")
      : initialFilters.materials || [],
    colors: searchParams.has("colors")
      ? parseArrayParam("colors")
      : initialFilters.colors || [],
    lensFeatures: searchParams.has("lensFeatures")
      ? parseArrayParam("lensFeatures")
      : initialFilters.lensFeatures || [],
    frameType:
      searchParams.get("frameType") || initialFilters.frameType || null,
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
      if (query) updateUrl({ q: query });
    }, 500);
    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    if (urlQuery !== null && urlQuery !== query) {
      setQuery(urlQuery);
    }
  }, [urlQuery]);

  const updateUrl = (newParams) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(newParams).forEach(([key, value]) => {
      if (
        value === null ||
        value === undefined ||
        value === "" ||
        (Array.isArray(value) && value.length === 0)
      ) {
        params.delete(key);
      } else if (Array.isArray(value)) {
        params.set(key, value.join(","));
      } else {
        params.set(key, value);
      }
    });

    router.push(`${basePath}?${params.toString()}`, { scroll: false });
  };

  const handleFilterChange = (newFilters) => {
    updateUrl(newFilters);
  };

  let apiSort = "-createdAt";
  if (sort === "asc") apiSort = "price";
  if (sort === "desc") apiSort = "-price";

  const apiQuery = {
    search: debouncedQuery || undefined,
    sort: apiSort,
    ...currentFilters,
  };

  Object.keys(apiQuery).forEach((key) => {
    if (
      apiQuery[key] === null ||
      (Array.isArray(apiQuery[key]) && apiQuery[key].length === 0)
    ) {
      delete apiQuery[key];
    } else if (Array.isArray(apiQuery[key])) {
      apiQuery[key] = apiQuery[key].join(",");
    }
  });

  const { data: result, isLoading, isFetching } = useGetProductsQuery(apiQuery);
  const products = result?.data.products || [];

  const { data: bottomProductsData } = useGetProductsQuery({
    type: "eyeglasses",
    limit: 3,
  });
  const bottomProducts = bottomProductsData?.data.products || [];

  return (
    <div className="container mx-auto px-4 md:px-6 py-6 md:py-8 max-w-[1400px]">
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 w-full md:max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products..."
              className="pl-10 h-12 bg-muted/50 rounded-full"
            />
            {isFetching && (
              <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground animate-spin" />
            )}
          </div>

          {/* Mobile Filter Button */}
          <div className="md:hidden shrink-0">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-full border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all shadow-sm"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[85vw] sm:w-[400px] p-0 inset-y-4 right-4 h-[calc(100%-2rem)] rounded-4xl border overflow-hidden shadow-2xl"
              >
                <div className="flex flex-col h-full">
                  <div className="p-6 bg-muted/50 border-b shrink-0">
                    <h2 className="text-2xl font-black tracking-tighter">
                      Filter & Sort
                    </h2>
                  </div>
                  <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    <FilterSidebar
                      categories={dynamicCategories}
                      filterOptions={filterOptions}
                      currentFilters={currentFilters}
                      onFilterChange={handleFilterChange}
                    />
                    <div className="space-y-4 pt-4 border-t border-dashed">
                      <h3 className="text-sm font-black uppercase tracking-widest text-primary/60 px-1">
                        Sort Results
                      </h3>
                      <div className="grid grid-cols-1 gap-2">
                        {[
                          { id: "featured", label: "Featured", icon: Flame },
                          {
                            id: "asc",
                            label: "Price: Low to High",
                            icon: ArrowDownAZ,
                          },
                          {
                            id: "desc",
                            label: "Price: High to Low",
                            icon: ArrowUpZA,
                          },
                        ].map((item) => (
                          <button
                            key={item.id}
                            onClick={() => {
                              setSort(item.id);
                              updateUrl({
                                sort: item.id === "featured" ? null : item.id,
                              });
                            }}
                            className={cn(
                              "flex items-center gap-4 p-4 rounded-3xl text-sm font-bold transition-all border-2",
                              sort === item.id
                                ? "bg-primary/5 border-primary text-primary"
                                : "bg-transparent border-transparent hover:bg-muted",
                            )}
                          >
                            <div
                              className={cn(
                                "h-10 w-10 rounded-2xl flex items-center justify-center transition-colors",
                                sort === item.id
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-muted-foreground",
                              )}
                            >
                              <item.icon className="h-5 w-5" />
                            </div>
                            {item.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="p-6 border-t bg-muted/30 shrink-0">
                    <Button
                      className="w-full h-14 rounded-[1.5rem] font-bold text-base shadow-xl"
                      onClick={() =>
                        document
                          .querySelector("[data-radix-collection-item]")
                          ?.click()
                      }
                    >
                      Apply Changes
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        <div className="hidden md:block w-72 shrink-0 sticky top-32 max-h-[calc(100vh-140px)] overflow-y-auto pr-2 custom-scrollbar">
          <FilterSidebar
            categories={dynamicCategories}
            filterOptions={filterOptions}
            currentFilters={currentFilters}
            onFilterChange={handleFilterChange}
          />
        </div>

        <div className="flex-1 w-full">

          <div className="hidden md:flex justify-end items-center mb-6">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-muted-foreground uppercase tracking-widest">
                Sort by:
              </span>
              <div className="flex bg-muted/50 p-1 rounded-2xl border border-transparent">
                {[
                  { id: "featured", label: "Featured" },
                  { id: "asc", label: "Lowest Price" },
                  { id: "desc", label: "Highest Price" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setSort(item.id);
                      updateUrl({
                        sort: item.id === "featured" ? null : item.id,
                      });
                    }}
                    className={cn(
                      "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                      sort === item.id
                        ? "bg-background shadow-sm text-primary"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {isLoading && products.length === 0 ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 pb-20 md:pb-0">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
              {products.length === 0 && (
                <div className="col-span-full py-20 text-center text-muted-foreground flex flex-col items-center">
                  <Search className="h-12 w-12 mb-4 opacity-50" />
                  <p className="text-xl font-bold text-foreground">
                    No perfect match found
                  </p>
                  <p className="text-sm mt-2 max-w-md">
                    Try adjusting your filters or search query to find the
                    signature piece you're looking for.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => router.push(basePath)}
                    className="mt-6 rounded-2xl h-12 px-8 font-bold"
                  >
                    Clear all filters
                  </Button>
                </div>
              )}
            </div>
          )}

          {bottomProducts.length > 0 && (
            <div className="mt-20 border-t pt-16">
              <h2 className="text-2xl md:text-3xl font-black tracking-tighter mb-8">
                You Might Also Like
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {bottomProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
