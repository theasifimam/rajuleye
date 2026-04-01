'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { useGetCategoriesQuery } from '@/store/categoryApi';
import { useGetProductsQuery } from '@/store/productApi';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, SlidersHorizontal, ArrowDownAZ, ArrowUpZA, Flame, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

function SearchPageContent() {
    const searchParams = useSearchParams();
    const urlCategorySlug = searchParams.get('category');
    const urlQuery = searchParams.get('q');
    const [urlSyncedSlug, setUrlSyncedSlug] = useState<string | null>(null);

    const [query, setQuery] = useState(urlQuery || '');
    const [debouncedQuery, setDebouncedQuery] = useState('');
    const [category, setCategory] = useState<string | null>(null);
    const [sort, setSort] = useState<'featured' | 'asc' | 'desc'>('featured');

    // Fetch dynamic categories
    const { data: categoryData } = useGetCategoriesQuery({});
    const dynamicCategories = categoryData?.data || [];

    // Debounce search input
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedQuery(query);
        }, 500);
        return () => clearTimeout(handler);
    }, [query]);

    // Sync query from URL
    useEffect(() => {
        if (urlQuery !== null && urlQuery !== query) {
            setQuery(urlQuery);
        }
    }, [urlQuery]);

    // Sync category ID from URL parameter
    useEffect(() => {
        if (urlCategorySlug !== urlSyncedSlug && dynamicCategories.length > 0) {
            setUrlSyncedSlug(urlCategorySlug);
            if (urlCategorySlug) {
                const matchedCat = dynamicCategories.find(
                    (c) => c.slug === urlCategorySlug || c.name.toLowerCase() === urlCategorySlug.toLowerCase()
                );
                if (matchedCat) {
                    setCategory(matchedCat.id);
                }
            } else {
                setCategory(null);
            }
        }
    }, [urlCategorySlug, urlSyncedSlug, dynamicCategories]);

    // Map UI sort to API sort format
    let apiSort = '-createdAt';
    if (sort === 'asc') apiSort = 'price';
    if (sort === 'desc') apiSort = '-price';

    // Fetch products based on live filters
    const { data: result, isLoading, isFetching } = useGetProductsQuery({
        search: debouncedQuery || undefined,
        category: category || undefined,
        sort: apiSort,
    });

    const products = result?.data.products || [];

    return (
        <div className="container mx-auto px-4 md:px-6 py-6 md:py-8 max-w-6xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Search Results</h1>
                <div className="relative w-full md:max-w-md">
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
            </div>

            <div className="flex items-center gap-3 mb-8 overflow-x-auto pb-4 hide-scroll px-1">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" className="h-10 rounded-2xl gap-2 border-2 hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all px-5 shadow-sm">
                            <SlidersHorizontal className="h-4 w-4" />
                            <span className="font-bold text-sm">Filters</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="w-[85vw] sm:w-[400px] p-0 !inset-y-4 !right-4 !h-[calc(100%-2rem)] rounded-4xl border overflow-hidden shadow-2xl">
                        <div className="flex flex-col h-full">
                            <div className="p-8 bg-muted/50 border-b">
                                <h2 className="text-2xl font-black tracking-tighter">Filter & Sort</h2>
                                <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-1">Refine your results</p>
                            </div>

                            <div className="flex-1 overflow-y-auto p-8 space-y-8">
                                <div className="space-y-4">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-primary/60 px-1">Categories</h3>
                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => setCategory(null)}
                                            className={cn(
                                                "px-5 py-2.5 rounded-2xl text-xs font-bold transition-all border-2",
                                                category === null
                                                    ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20"
                                                    : "bg-transparent border-muted hover:border-primary/30"
                                            )}
                                        >
                                            All Products
                                        </button>
                                        {dynamicCategories.map((cat) => (
                                            <button
                                                key={cat.id}
                                                onClick={() => setCategory(cat.id)}
                                                className={cn(
                                                    "px-5 py-2.5 rounded-2xl text-xs font-bold transition-all border-2",
                                                    category === cat.id
                                                        ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20"
                                                        : "bg-transparent border-muted hover:border-primary/30"
                                                )}
                                            >
                                                {cat.name}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-4 pt-4 border-t border-dashed">
                                    <h3 className="text-sm font-black uppercase tracking-widest text-primary/60 px-1">Sort Results</h3>
                                    <div className="grid grid-cols-1 gap-2">
                                        {[
                                            { id: 'featured', label: 'Featured', icon: Flame },
                                            { id: 'asc', label: 'Price: Low to High', icon: ArrowDownAZ },
                                            { id: 'desc', label: 'Price: High to Low', icon: ArrowUpZA }
                                        ].map((item) => (
                                            <button
                                                key={item.id}
                                                onClick={() => setSort(item.id as any)}
                                                className={cn(
                                                    "flex items-center gap-4 p-4 rounded-3xl text-sm font-bold transition-all border-2",
                                                    sort === item.id
                                                        ? "bg-primary/5 border-primary text-primary"
                                                        : "bg-transparent border-transparent hover:bg-muted"
                                                )}
                                            >
                                                <div className={cn(
                                                    "h-10 w-10 rounded-2xl flex items-center justify-center transition-colors",
                                                    sort === item.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                                                )}>
                                                    <item.icon className="h-5 w-5" />
                                                </div>
                                                {item.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 border-t bg-muted/30">
                                <Button className="w-full h-14 rounded-[1.5rem] font-bold text-base shadow-xl" onClick={() => (document.querySelector('[data-radix-collection-item]') as any)?.click()}>
                                    Apply Changes
                                </Button>
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>

                <div className="w-px h-8 bg-border/60 mx-1 shrink-0" />

                <button
                    onClick={() => setCategory(null)}
                    className={cn(
                        "whitespace-nowrap h-10 px-6 rounded-2xl text-xs font-bold transition-all border-2 flex items-center justify-center",
                        category === null
                            ? "bg-primary border-primary text-primary-foreground shadow-md"
                            : "bg-muted/50 border-transparent hover:border-primary/20"
                    )}
                >
                    All
                </button>
                {dynamicCategories.map((cat) => (
                    <button
                        key={cat.id}
                        onClick={() => setCategory(cat.id)}
                        className={cn(
                            "whitespace-nowrap h-10 px-6 rounded-2xl text-xs font-bold transition-all border-2 flex items-center justify-center",
                            category === cat.id
                                ? "bg-primary border-primary text-primary-foreground shadow-md"
                                : "bg-muted/50 border-transparent hover:border-primary/20"
                        )}
                    >
                        {cat.name}
                    </button>
                ))}
            </div>

            {isLoading && products.length === 0 ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                </div>
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 pb-20 md:pb-0">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}

                    {products.length === 0 && (
                        <div className="col-span-full py-12 text-center text-muted-foreground flex flex-col items-center">
                            <Search className="h-12 w-12 mb-4 opacity-50" />
                            <p className="text-lg">No products found matching your criteria.</p>
                            <Button variant="link" onClick={() => { setQuery(''); setCategory(null); }} className="mt-2 text-primary">
                                Clear filters
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={
            <div className="flex justify-center items-center min-h-[50vh]">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
        }>
            <SearchPageContent />
        </Suspense>
    );
}
