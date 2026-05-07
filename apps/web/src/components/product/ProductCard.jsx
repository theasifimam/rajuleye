"use client";
import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingCart, Heart, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  useGetWishlistQuery,
  useToggleWishlistMutation,
} from "@/store/wishlistApi";
import { useAddToCartMutation } from "@/store/cartApi";
import { useAppSelector } from "@/store/store";
import { selectIsAuthenticated, selectCurrentUser } from "@/store/authSlice";
import { useGetProfileQuery } from "@/store/authApi";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { LensPowerDialog } from "@/app/product/[id]/components/LensPowerDialog";

export function ProductCard({ product }) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { data: wishlistData } = useGetWishlistQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [toggleWishlistMutation] = useToggleWishlistMutation();
  const [addToCartMutation] = useAddToCartMutation();
  const authUser = useAppSelector(selectCurrentUser);
  const { data: profileData } = useGetProfileQuery(undefined, {
    skip: !isAuthenticated,
  });
  const user = profileData?.data || authUser;

  const [mounted, setMounted] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);
  const [isPowerDialogOpen, setIsPowerDialogOpen] = React.useState(false);
  const [pendingCallback, setPendingCallback] = React.useState(null);
  const router = useRouter();
  React.useEffect(() => {
    setMounted(true);
  }, []);
  const isWishlisted = isAuthenticated
    ? wishlistData?.data?.products?.some(
        (p) => p.id === product.id || p._id === product.id,
      )
    : false;
  const discountPercent = product.discountPrice
    ? Math.round(
        ((product.price - product.discountPrice) / product.price) * 100,
      )
    : 0;
  const handleAddToCart = async (e, callback = null) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.error("Authentication required", {
        description: "Please log in to add items to your cart.",
      });
      return false;
    }

    if (
      ["eyeglasses", "contact-lenses", "reading-glasses"].includes(product.type)
    ) {
      setPendingCallback(() => callback);
      setIsPowerDialogOpen(true);
      return false;
    }

    return proceedToCart(callback);
  };

  const proceedToCart = async (callback = null, selectedPower = null) => {
    try {
      const payload = { product, qty: 1 };
      if (selectedPower) {
        payload.selectedPower = selectedPower;
      }
      await addToCartMutation(payload).unwrap();

      if (callback) {
        callback();
      } else {
        toast.success(`${product.name} added to cart!`, {
          description: "Item successfully added to your shopping bag.",
          icon: (
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-muted shadow-sm border border-border/50">
              <Image
                src={
                  product.image &&
                  typeof product.image === "string" &&
                  product.image.trim() !== ""
                    ? product.image.startsWith("http") ||
                      product.image.startsWith("/") ||
                      product.image.startsWith("data:")
                      ? product.image
                      : `/${product.image}`
                    : `data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect fill='%23f1f5f9' width='100' height='100'/%3E%3C/svg%3E`
                }
                alt={product.name}
                fill
                className="object-cover"
              />
            </div>
          ),
        });
      }
      return true;
    } catch (error) {
      toast.error("Failed to add item to cart");
      return false;
    }
  };
  const toggleWishlist = async (e) => {
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
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-muted shadow-sm border border-border/50">
              <Image
                src={
                  product.image &&
                  typeof product.image === "string" &&
                  product.image.trim() !== ""
                    ? product.image.startsWith("http") ||
                      product.image.startsWith("/") ||
                      product.image.startsWith("data:")
                      ? product.image
                      : `/${product.image}`
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
          <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-muted shadow-sm border border-border/50 opacity-70">
            <Image
              src={
                product.image &&
                typeof product.image === "string" &&
                product.image.trim() !== ""
                  ? product.image.startsWith("http") ||
                    product.image.startsWith("/") ||
                    product.image.startsWith("data:")
                    ? product.image
                    : `/${product.image}`
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
    <Card className="group relative flex flex-col h-full bg-transparent border-none shadow-none hover:shadow-none transition-all duration-500 overflow-visible">
      {/* Image Container */}
      <div className="relative aspect-4/5 w-full overflow-hidden bg-[#F8F8F8] dark:bg-[#151515] rounded-[1.5rem] sm:rounded-[2.5rem] transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-primary/5">
        <Link
          href={`/product/${product.slug || product.id}`}
          className="absolute inset-0 z-0"
        >
          <Image
            src={
              product.image &&
              typeof product.image === "string" &&
              product.image.trim() !== ""
                ? product.image.startsWith("http") ||
                  product.image.startsWith("/") ||
                  product.image.startsWith("data:")
                  ? product.image
                  : `/${product.image}`
                : `data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='800' viewBox='0 0 600 800'%3E%3Crect fill='%23f1f5f9' width='600' height='800'/%3E%3Ctext fill='%2394a3b8' font-family='sans-serif' font-size='30' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3ENo Image%3C/text%3E%3C/svg%3E`
            }
            alt={product.name || "Product"}
            fill
            className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            priority={false}
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
          {discountPercent > 0 && (
            <Badge className="bg-primary/90 text-primary-foreground backdrop-blur-md font-bold px-3 py-1 rounded-full shadow-lg border-none text-[10px] tracking-tight">
              -{discountPercent}%
            </Badge>
          )}
          {!product.inStock && (
            <Badge
              variant="secondary"
              className="backdrop-blur-md bg-white/80 dark:bg-black/80 text-red-600 dark:text-red-400 font-bold px-3 py-1 rounded-full border-none text-[10px]"
            >
              Out of Stock
            </Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <Button
          variant="ghost"
          size="icon"
          className={cn(
            "absolute top-4 right-4 z-10 h-10 w-10 rounded-full transition-all duration-300 backdrop-blur-md",
            isWishlisted
              ? "bg-white dark:bg-black shadow-lg text-red-500"
              : "bg-white/60 dark:bg-black/60 text-foreground/70 hover:text-foreground hover:bg-white dark:hover:bg-black",
          )}
          onClick={toggleWishlist}
        >
          <Heart
            className={cn(
              "h-5 w-5 transition-colors",
              isWishlisted && "fill-current",
            )}
          />
        </Button>

        {/* Quick Action Overlay (Desktop) */}
        <div className="absolute inset-x-4 bottom-4 z-10 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 hidden sm:flex gap-2">
          <Button
            onClick={(e) => {
              handleAddToCart(e, () => {
                toast.success("Proceeding to checkout...");
                router.push("/checkout");
              });
            }}
            disabled={!product.inStock}
            className="flex-2 h-12 rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] bg-primary text-primary-foreground hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-primary/20 border-none"
          >
            Buy Now
          </Button>
          <Button
            onClick={(e) => handleAddToCart(e)}
            disabled={!product.inStock}
            variant="outline"
            size="icon"
            className="h-12 w-12 rounded-3xl bg-white/90 dark:bg-black/90 backdrop-blur-md border-none shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
          >
            <ShoppingCart className="h-4 w-4 text-primary" />
          </Button>
        </div>
      </div>

      {/* Info Section */}
      <Link
        href={`/product/${product.slug || product.id}`}
        className="mt-2 sm:mt-5 px-1 flex flex-col gap-0.5 sm:gap-1"
      >
        <div className="flex items-center justify-between mb-0.5 sm:mb-1">
          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.15em] sm:tracking-[0.2em] text-muted-foreground/60">
            {typeof product.category === "object" && product.category !== null
              ? product.category.name
              : product.category}
          </span>
          <div className="flex items-center gap-1 bg-primary/5 px-1.5 sm:px-2 py-0.5 rounded-full">
            <Star className="w-2 sm:w-2.5 h-2 sm:h-2.5 fill-primary text-primary" />
            <span className="text-[10px] sm:text-[11px] font-black tabular-nums">
              {product.rating}
            </span>
          </div>
        </div>

        <h3 className="font-bold text-sm sm:text-lg tracking-tight leading-tight line-clamp-1 group-hover:text-primary transition-colors duration-300">
          {product.name}
        </h3>

        <div className="flex items-center gap-2 sm:gap-3 mt-0.5 sm:mt-1">
          <span className="text-base sm:text-xl font-black tracking-tighter">
            ₹{(product.discountPrice || product.price).toFixed(2)}
          </span>
          {product.discountPrice && (
            <span className="text-[10px] sm:text-sm text-muted-foreground/40 line-through font-bold">
              ₹{product.price.toFixed(2)}
            </span>
          )}
        </div>
      </Link>

      {/* Mobile Action Buttons (Only visible on small screens) */}
      <div className="sm:hidden px-1 mt-2">
        <Button
          onClick={(e) => handleAddToCart(e)}
          disabled={!product.inStock}
          className="w-full h-9 rounded-2xl font-black text-[9px] uppercase tracking-widest bg-primary text-primary-foreground shadow-lg shadow-primary/10"
        >
          Add to Cart
        </Button>
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

      <LensPowerDialog
        isOpen={isPowerDialogOpen}
        onClose={() => setIsPowerDialogOpen(false)}
        user={user}
        productName={product.name}
        onConfirm={(power) => {
          setIsPowerDialogOpen(false);
          proceedToCart(pendingCallback, power);
        }}
      />
    </Card>
  );
}
