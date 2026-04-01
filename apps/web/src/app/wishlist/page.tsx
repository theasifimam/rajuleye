'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useGetWishlistQuery } from '@/store/wishlistApi';
import { useAppSelector } from '@/store/store';
import { selectIsAuthenticated } from '@/store/authSlice';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

export default function WishlistPage() {
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const { data: wishlistData, isLoading } = useGetWishlistQuery(undefined, { skip: !isAuthenticated });

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || isLoading) {
        return <div className="min-h-[60vh] flex items-center justify-center">Loading...</div>;
    }

    const items = isAuthenticated ? (wishlistData?.data?.products || []) : [];

    if (!isAuthenticated || items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center space-y-6">
                <div className="h-32 w-32 bg-rose-50 dark:bg-rose-950/20 rounded-full flex items-center justify-center mb-4 shadow-inner">
                    <Heart className="h-16 w-16 text-rose-500" />
                </div>
                <div>
                    <h1 className="text-3xl font-extrabold tracking-tight mb-2">Your wishlist is empty</h1>
                    <p className="text-lg text-muted-foreground max-w-md mx-auto">
                        Found something you like? Tap the heart icon on any product to save it here for later.
                    </p>
                </div>
                <Button size="lg" className="rounded-full px-8 h-12 text-base shadow-md transition-transform hover:scale-105" asChild>
                    <Link href="/search">Discover Products</Link>
                </Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 md:px-6 py-6 md:py-8 max-w-[1600px]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b pb-6">
                <div>
                    <h1 className="text-2xl md:text-4xl font-extrabold tracking-tight flex items-center gap-3">
                        <Heart className="h-6 w-6 md:h-8 md:w-8 fill-rose-500 text-rose-500" />
                        Stored Favorites
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">
                        {items.length} item{items.length !== 1 ? 's' : ''} saved for later
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {items.map((product) => (
                    <ProductCard key={product.id || product._id} product={product} />
                ))}
            </div>
        </div>
    );
}
