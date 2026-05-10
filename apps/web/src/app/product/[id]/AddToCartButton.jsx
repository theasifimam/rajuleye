"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  useGetWishlistQuery,
  useToggleWishlistMutation,
} from "@/store/wishlistApi";
import { useAddToCartMutation } from "@/store/cartApi";
import { useAppSelector } from "@/store/store";
import { selectIsAuthenticated, selectCurrentUser } from "@/store/authSlice";
import { useGetProfileQuery } from "@/store/authApi";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, Minus, Plus } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { LensPowerDialog } from "./components/LensPowerDialog";

export function AddToCartButton({ product, compact = false, selectedLens }) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { data: wishlistData } = useGetWishlistQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [toggleWishlistMutation] = useToggleWishlistMutation();
  const [addToCartMutation] = useAddToCartMutation();
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isPowerDialogOpen, setIsPowerDialogOpen] = useState(false);
  const [pendingCallback, setPendingCallback] = useState(null);

  const authUser = useAppSelector(selectCurrentUser);
  const { data: profileData } = useGetProfileQuery(undefined, {
    skip: !isAuthenticated,
  });
  const user = profileData?.data || authUser;

  // Fix hydration issues by tracking mounted state
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const isWishlisted = isAuthenticated
    ? wishlistData?.data?.products?.some(
        (p) => p.id === product.id || p._id === product.id,
      )
    : false;

  const handleAddToCart = async (callback) => {
    if (!isAuthenticated) {
      toast.error("Authentication required", {
        description: "Please log in to add items to your cart.",
      });
      return;
    }

    if (selectedLens && selectedLens.id !== "plane") {
      setPendingCallback(() => callback);
      setIsPowerDialogOpen(true);
      return;
    }

    proceedToCart(callback);
  };

  const proceedToCart = async (callback, selectedPower = null, powerSubmissionMethod = null) => {
    setIsAdding(true);
    try {
      const payload = {
        product,
        qty: quantity,
        lensType: selectedLens?.name || "",
        frameId:
          selectedLens?.id && selectedLens.id !== "plane"
            ? selectedLens.id
            : null,
        frameName: selectedLens?.name || "",
        framePrice: selectedLens?.price || 0,
        isPlaneGlass: selectedLens?.id === "plane",
      };
      if (selectedPower) {
        payload.selectedPower = selectedPower;
      }
      if (powerSubmissionMethod) {
        payload.powerSubmissionMethod = powerSubmissionMethod;
      }
      await addToCartMutation(payload).unwrap();
      if (callback) {
        callback();
      } else {
        toast.success("Bag Updated", {
          description: `Added ${quantity} item${quantity > 1 ? "s" : ""} to your selection.`,
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
    } catch (error) {
      toast.error("Failed to add item to cart");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-6 w-full",
        compact ? "max-w-none" : "max-w-md",
      )}
    >
      {!compact && (
        <div className="flex items-center gap-6">
          {/* Minimalist Quantity Pill */}
          <div className="flex items-center bg-white dark:bg-muted rounded-full border border-border shadow-sm px-2 py-1 h-14">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full hover:bg-muted transition-colors disabled:opacity-30"
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              disabled={quantity <= 1 || isAdding}
            >
              <Minus className="h-3 w-3" />
            </Button>
            <span className="w-10 text-center text-sm font-black tabular-nums">
              {quantity}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-full hover:bg-muted transition-colors"
              onClick={() => setQuantity(quantity + 1)}
              disabled={isAdding}
            >
              <Plus className="h-3 w-3" />
            </Button>
          </div>

          {/* Total Price Display */}
          <div className="flex flex-col">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 leading-none mb-1">
              Total
            </span>
            <span className="text-xl font-bold tracking-tight text-primary">
              ₹{((product.discountPrice || product.price) * quantity).toFixed(2)}
            </span>
          </div>
        </div>
      )}

      <div className="flex flex-row gap-3 w-full">
        <Button
          onClick={() => handleAddToCart()}
          variant="outline"
          disabled={!product.inStock || isAdding}
          size="icon"
          className={cn(
            "rounded-full transition-all duration-500 relative overflow-hidden border-2 border-primary/20 hover:bg-primary/5 shrink-0",
            compact ? "h-12 w-12" : "h-16 w-16",
            isAdding && "opacity-0",
          )}
        >
          <ShoppingCart
            className={cn(compact ? "h-5 w-5" : "h-6 w-6", "text-primary")}
          />
        </Button>

        {!compact && (
          <Button
            variant="outline"
            size="icon"
            className={cn(
              "h-16 w-16 rounded-full border border-border transition-all duration-500 shrink-0",
              isWishlisted
                ? "bg-rose-50 text-rose-500 border-rose-200 dark:bg-rose-950/20 dark:border-rose-900"
                : "bg-white dark:bg-muted hover:border-rose-300",
            )}
            onClick={async () => {
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
                  toast.success("Added to Wishlist");
                } catch (error) {
                  toast.error("Failed to add to wishlist");
                }
              }
            }}
          >
            <Heart
              className={cn(
                "h-5 w-5 transition-all ease-in-out text-primary duration-500",
                isWishlisted && "fill-current scale-110",
              )}
            />
          </Button>
        )}

        <Button
          onClick={() => {
            const isNonPlaneLens = selectedLens && selectedLens.id !== "plane";
            if (isNonPlaneLens) {
              // Non-plane lens selected → go to select power page
              router.push(`/select-power?product=${product.id}&lens=${selectedLens?.name || ""}&lensId=${selectedLens?.id || ""}&lensPrice=${selectedLens?.price || 0}`);
            } else {
              // Plane glass or no lens → direct to checkout
              handleAddToCart(() => {
                router.push("/checkout");
              });
            }
          }}
          disabled={!product.inStock || isAdding}
          size="lg"
          className={cn(
            "flex-[1.5] rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest sm:tracking-[0.2em] transition-all duration-500 relative overflow-hidden bg-primary text-primary-foreground hover:scale-[1.02] shadow-xl shadow-primary/20",
            compact ? "h-12" : "h-16",
            isAdding && "opacity-80 scale-[0.98]",
          )}
        >
          <span className="flex items-center gap-3">
            {selectedLens && selectedLens.id !== "plane" ? "Select Power" : "Buy Now"}
          </span>
        </Button>

        {isAdding && (
          <div className="absolute inset-0 flex items-center justify-center animate-in fade-in zoom-in duration-300">
            <div className="h-4 w-4 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        )}
      </div>
      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={async () => {
          try {
            await toggleWishlistMutation(product).unwrap();
            toast.success("Removed from Wishlist");
            setShowConfirm(false);
          } catch (error) {
            toast.error("Failed to remove from wishlist");
          }
        }}
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
        onConfirm={(power, method) => {
          setIsPowerDialogOpen(false);
          proceedToCart(pendingCallback, power, method);
        }}
      />
    </div>
  );
}
