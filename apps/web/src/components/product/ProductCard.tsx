'use client';

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from 'next/navigation';
import { ShoppingCart, Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/store/productApi";
import { useGetWishlistQuery, useToggleWishlistMutation } from "@/store/wishlistApi";
import { useAddToCartMutation } from "@/store/cartApi";
import { useAppSelector } from "@/store/store";
import { selectIsAuthenticated } from "@/store/authSlice";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ConfirmModal } from "@/components/ui/confirm-modal";

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const isAuthenticated = useAppSelector(selectIsAuthenticated);
    const { data: wishlistData } = useGetWishlistQuery(undefined, { skip: !isAuthenticated });
    const [toggleWishlistMutation] = useToggleWishlistMutation();
    const [addToCartMutation] = useAddToCartMutation();
    const [mounted, setMounted] = React.useState(false);
    const [showConfirm, setShowConfirm] = React.useState(false);
    const router = useRouter();

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const isWishlisted = isAuthenticated
        ? wishlistData?.data?.products?.some((p) => p.id === product.id || (p as any)._id === product.id)
        : false;

    const discountPercent = product.discountPrice
        ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
        : 0;

    const handleAddToCart = async (e: React.MouseEvent): Promise<boolean> => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            toast.error("Authentication required", {
                description: "Please log in to add items to your cart.",
            });
            return false;
        }

        try {
            await addToCartMutation({ product, qty: 1 }).unwrap();
            toast.success(`${product.name} added to cart!`, {
                description: "Item successfully added to your shopping bag.",
                icon: (
                    <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-muted shadow-sm border border-border/50">
                        <Image
                            src={
                                product.image && typeof product.image === 'string' && product.image.trim() !== ''
                                    ? (product.image.startsWith('http') || product.image.startsWith('/') || product.image.startsWith('data:') ? product.image : `/${product.image}`)
                                    : `data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect fill='%23f1f5f9' width='100' height='100'/%3E%3C/svg%3E`
                            }
                            alt={product.name}
                            fill
                            className="object-cover"
                        />
                    </div>
                ),
            });
            return true;
        } catch (error) {
            toast.error("Failed to add item to cart");
            return false;
        }
    };

    const toggleWishlist = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!isAuthenticated) {
            toast.error("Authentication required", {
                description: "Please log in to add items to your wishlist.",
            });
            return;
        }

        if (isWishlisted) {
            setShowConfirm(true);
        } else {
            try {
                await toggleWishlistMutation(product).unwrap();
                toast("Added to wishlist", {
                    icon: (
                        <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-muted shadow-sm border border-border/50">
                            <Image
                                src={
                                    product.image && typeof product.image === 'string' && product.image.trim() !== ''
                                        ? (product.image.startsWith('http') || product.image.startsWith('/') || product.image.startsWith('data:') ? product.image : `/${product.image}`)
                                        : `data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect fill='%23f1f5f9' width='100' height='100'/%3E%3C/svg%3E`
                                }
                                alt={product.name}
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 flex items-center justify-center bg-red-500/10">
                                <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                            </div>
                        </div>
                    ),
                });
            } catch (err) {
                toast.error("Failed to add to wishlist");
            }
        }
    };

    const confirmRemove = async () => {
        try {
            await toggleWishlistMutation(product).unwrap();
            setShowConfirm(false);
            toast("Removed from wishlist", {
                icon: (
                    <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg bg-muted shadow-sm border border-border/50 opacity-70">
                        <Image
                            src={
                                product.image && typeof product.image === 'string' && product.image.trim() !== ''
                                    ? (product.image.startsWith('http') || product.image.startsWith('/') || product.image.startsWith('data:') ? product.image : `/${product.image}`)
                                    : `data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect fill='%23f1f5f9' width='100' height='100'/%3E%3C/svg%3E`
                            }
                            alt={product.name}
                            fill
                            className="object-cover grayscale"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <Heart className="h-4 w-4 text-white" />
                        </div>
                    </div>
                ),
            });
        } catch (err) {
            toast.error("Failed to remove from wishlist");
        }
    };

    return (
        <Card className="group relative flex flex-col h-full py-0 bg-card border-none shadow-sm hover:shadow-xl transition-all duration-500 rounded-[2rem] overflow-hidden">
            {/* Image Container */}
            <Link
                href={`/product/${(product as any).slug || product.id}`}
                className="relative aspect-[4/5] overflow-hidden bg-muted m-2 rounded-[1.5rem] block"
            >
                {/* Badges */}
                <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
                    {discountPercent > 0 && (
                        <Badge className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-3 py-1 rounded-full shadow-lg border-none">
                            -{discountPercent}%
                        </Badge>
                    )}
                    {!product.inStock && (
                        <Badge variant="secondary" className="backdrop-blur-md bg-white/70 dark:bg-black/70 font-semibold px-3 py-1 rounded-full border-none">
                            Out of Stock
                        </Badge>
                    )}
                </div>

                {/* Wishlist Button */}
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                        "absolute top-3 right-3 z-10 h-10 w-10 rounded-full backdrop-blur-md transition-all duration-300 pointer-events-auto",
                        isWishlisted
                            ? "bg-red-500/10 text-red-500 hover:bg-red-500/20"
                            : "bg-white/50 text-foreground hover:bg-white/80 dark:bg-black/50"
                    )}
                    onClick={toggleWishlist}
                >
                    <Heart className={cn("h-5 w-5 transition-colors", isWishlisted && "fill-current")} />
                </Button>

                {/* Product Image */}
                <Image
                    src={
                        product.image && typeof product.image === 'string' && product.image.trim() !== ''
                            ? (product.image.startsWith('http') || product.image.startsWith('/') || product.image.startsWith('data:') ? product.image : `/${product.image}`)
                            : `data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='800' viewBox='0 0 600 800'%3E%3Crect fill='%23f1f5f9' width='600' height='800'/%3E%3Ctext fill='%2394a3b8' font-family='sans-serif' font-size='30' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3ENo Image%3C/text%3E%3C/svg%3E`
                    }
                    alt={product.name || 'Product'}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                    priority={false}
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Info Overlay at Bottom */}
                <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-5 bg-gradient-to-t from-black/95 via-black/40 to-transparent text-white pt-12 sm:pt-20 transition-all duration-500 group-hover:pt-16 sm:group-hover:pt-24 translate-y-1 sm:translate-y-2 group-hover:translate-y-0">
                    <div className="flex items-center justify-end sm:justify-between mb-1 sm:mb-1.5">
                        <span className="hidden sm:inline-block text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] text-white/70">
                            {typeof product.category === 'object' && product.category !== null ? product.category.name : product.category}
                        </span>
                        <div className="flex items-center gap-1 sm:gap-1.5 bg-white/10 backdrop-blur-md px-1.5 sm:px-2 py-0.5 rounded-full border border-white/10">
                            <Star className="w-2 h-2 sm:w-2.5 sm:h-2.5 fill-primary text-primary" />
                            <span className="text-[9px] sm:text-[11px] font-black tabular-nums">{product.rating}</span>
                        </div>
                    </div>

                    <h3 className="font-black text-xs sm:text-lg leading-[1.1] tracking-tighter mb-1 sm:mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                        {product.name}
                    </h3>

                    <div className="flex items-baseline gap-1.5 sm:gap-2">
                        <span className="text-sm sm:text-xl font-black tracking-tighter text-white">
                            ₹{(product.discountPrice || product.price).toFixed(2)}
                        </span>
                        {product.discountPrice && (
                            <span className="text-[9px] sm:text-[11px] text-white/40 line-through font-semibold">
                                ₹{product.price.toFixed(2)}
                            </span>
                        )}
                    </div>
                </div>
            </Link>

            {/* Action Bar - Hidden on Mobile */}
            <div className="hidden sm:block px-4 pb-4 sm:px-5 sm:pb-5">

                <div className="flex items-center gap-2">
                    <Button
                        onClick={async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const success = await handleAddToCart(e);
                            if (success) {
                                toast.success("Proceeding to checkout...");
                                router.push('/checkout');
                            }
                        }}
                        disabled={!product.inStock}
                        className="flex-[1.5] h-11 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-xl shadow-primary/20 transition-all duration-300 hover:scale-[1.02] active:scale-95 bg-primary text-primary-foreground"
                    >
                        Buy
                    </Button>
                    <Button
                        onClick={handleAddToCart}
                        disabled={!product.inStock}
                        variant="outline"
                        size="icon"
                        className="flex-1 h-11 rounded-2xl border-2 border-primary/10 hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
                    >
                        <ShoppingCart className="h-4 w-4 text-primary" />
                    </Button>
                </div>
            </div>
            <ConfirmModal
                isOpen={showConfirm}
                onClose={() => setShowConfirm(false)}
                onConfirm={confirmRemove}
                title="Remove from Wishlist"
                description={`Are you sure you want to remove ${product.name} from your wishlist?`}
                confirmText="Remove"
                variant="destructive"
            />
        </Card>
    );
}

