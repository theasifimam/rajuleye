"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
} from "@/store/cartApi";
import { useAppSelector } from "@/store/store";
import { selectIsAuthenticated } from "@/store/authSlice";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  LogIn,
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { toast } from "sonner";
export default function CartPage() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { data: cartData, isLoading } = useGetCartQuery(undefined, {
    skip: !isAuthenticated,
  });
  const [updateCartItemMutation] = useUpdateCartItemMutation();
  const [removeFromCartMutation] = useRemoveFromCartMutation();
  const [mounted, setMounted] = useState(false);
  const [isRemoving, setIsRemoving] = useState(null);
  useEffect(() => {
    setMounted(true);
  }, []);
  console.log(cartData, "cartData-----------------------------------");
  if (!mounted || isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        Loading...
      </div>
    );
  }
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center space-y-6">
        <div className="h-32 w-32 bg-muted rounded-full flex items-center justify-center mb-4 shadow-inner">
          <LogIn className="h-16 w-16 text-muted-foreground/50" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">
            Sign in to view cart
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Please log in to your account to view or modify your shopping cart.
          </p>
        </div>
      </div>
    );
  }
  const items = (cartData?.data?.items || []).filter(
    (item) => item && item.product,
  );
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center space-y-6">
        <div className="h-32 w-32 bg-muted rounded-full flex items-center justify-center mb-4 shadow-inner">
          <ShoppingBag className="h-16 w-16 text-muted-foreground/50" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">
            Your cart is empty
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Looks like you haven't added anything to your cart yet. Let's change
            that!
          </p>
        </div>
        <Button
          size="lg"
          className="rounded-full px-8 h-12 text-base shadow-md transition-transform hover:scale-105"
          asChild
        >
          <Link href="/">Start Shopping</Link>
        </Button>
      </div>
    );
  }
  const subtotal = items.reduce((total, item) => {
    const itemPrice =
      item.priceAtAdd ||
      item.product?.discountPrice ||
      item.product?.price ||
      0;
    return total + itemPrice * item.qty;
  }, 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;
  const handleUpdateQuantity = async (productId, qty) => {
    try {
      await updateCartItemMutation({ productId, qty }).unwrap();
    } catch (error) {
      toast.error("Failed to update quantity");
    }
  };
  const handleRemoveItem = async (productId) => {
    try {
      await removeFromCartMutation(productId).unwrap();
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Failed to remove item");
    }
  };
  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
      <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-8">
        Shopping Cart
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
        <div className="lg:col-span-2 space-y-6">
          <ul className="space-y-6">
            {items.map((item) => (
              <li
                key={item.product?.id || item.product?._id}
                className="p-4 md:p-6 bg-card rounded-[2rem] border-none shadow-md hover:shadow-lg transition-shadow flex flex-col sm:flex-row gap-4 md:gap-8 items-start sm:items-center"
              >
                <div className="relative w-full sm:w-32 h-32 md:w-40 md:h-40 rounded-[1.5rem] overflow-hidden bg-muted shrink-0 shadow-inner">
                  <Image
                    src={
                      item.product?.images &&
                      item.product.images.length > 0 &&
                      typeof item.product.images[0] === "string" &&
                      item.product.images[0].trim() !== ""
                        ? item.product.images[0].startsWith("http") ||
                          item.product.images[0].startsWith("/") ||
                          item.product.images[0].startsWith("data:")
                          ? item.product.images[0]
                          : `/${item.product.images[0]}`
                        : `data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='800' viewBox='0 0 600 800'%3E%3Crect fill='%23f1f5f9' width='600' height='800'/%3E%3Ctext fill='%2394a3b8' font-family='sans-serif' font-size='30' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3ENo Image%3C/text%3E%3C/svg%3E`
                    }
                    alt={item.product?.name || "Product"}
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="flex flex-col flex-1 min-w-0 w-full h-full justify-between self-stretch py-2">
                  <div className="flex justify-between items-start gap-4 mb-4">
                    <div className="space-y-1">
                      <Link
                        href={`/product/${item.product?.id || item.product?._id}`}
                        className="font-extrabold text-lg md:text-xl line-clamp-2 hover:text-primary transition-colors tracking-tight"
                      >
                        {item.product?.name}
                      </Link>
                      <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                        {typeof item.product?.category === "object" &&
                        item.product?.category !== null
                          ? item.product.category.name
                          : item.product?.category || "Vision"}
                      </p>
                      {item.lensType && (
                        <p className="text-[10px] font-bold text-primary/70 mt-0.5">
                          Lens: {item.lensType}
                          {item.frameName && item.frameName !== 'Plane Glass' ? ` • Frame: ${item.frameName}` : ''}
                        </p>
                      )}
                      {item.powerSubmissionMethod && (
                        <p className="text-[10px] font-bold text-indigo-600 mt-0.5">
                          Power: {item.powerSubmissionMethod === 'saved' ? '✓ Saved' : item.powerSubmissionMethod === 'manual' ? '✏️ Manual' : item.powerSubmissionMethod === 'upload' ? '📄 Uploaded' : item.powerSubmissionMethod === 'whatsapp' ? '💬 WhatsApp' : '⏭ Skipped'}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="font-black text-xl md:text-2xl shrink-0 tracking-tighter">
                        ₹
                        {(
                          (item.priceAtAdd ||
                            item.product?.discountPrice ||
                            item.product?.price) * item.qty
                        ).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center bg-muted/50 rounded-full border border-border/50 shadow-sm px-1 py-1 h-12">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-full hover:bg-white dark:hover:bg-muted transition-colors text-muted-foreground"
                        onClick={() =>
                          handleUpdateQuantity(
                            item.product?.id || item.product?._id,
                            item.qty - 1,
                          )
                        }
                        disabled={item.qty <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-10 text-center text-sm font-black tabular-nums">
                        {item.qty}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-10 w-10 rounded-full hover:bg-white dark:hover:bg-muted transition-colors text-muted-foreground"
                        onClick={() =>
                          handleUpdateQuantity(
                            item.product?.id || item.product?._id,
                            item.qty + 1,
                          )
                        }
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500/80 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-full h-12 w-12 transition-all"
                      onClick={() =>
                        setIsRemoving(item.product?.id || item.product?._id)
                      }
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <ConfirmModal
            isOpen={!!isRemoving}
            onClose={() => setIsRemoving(null)}
            onConfirm={() => {
              if (isRemoving) {
                handleRemoveItem(isRemoving);
                setIsRemoving(null);
              }
            }}
            title="Remove Item"
            description="Are you sure you want to remove this item from your cart? This action cannot be undone."
            confirmText="Remove"
            variant="destructive"
          />
        </div>

        <div className="lg:col-span-1">
          <div className="bg-linear-to-br from-card to-muted/20 rounded-[2.5rem] border shadow-xl p-8 sticky top-24">
            <h2 className="text-2xl font-black mb-6 tracking-tight">
              Order Summary
            </h2>

            <div className="space-y-4 text-sm md:text-base">
              <div className="flex justify-between font-medium">
                <span className="text-muted-foreground">Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-muted-foreground">
                  Estimated Tax (8%)
                </span>
                <span>₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-green-600 font-semibold">Free</span>
              </div>

              <Separator className="my-4" />

              <div className="flex justify-between items-center pb-2">
                <span className="text-xl font-black">Total</span>
                <span className="text-2xl font-black text-primary">
                  ₹{total.toFixed(2)}
                </span>
              </div>
            </div>

            <Button
              className="w-full mt-8 h-16 rounded-full text-sm uppercase tracking-widest font-black shadow-xl hover:shadow-2xl transition-all active:scale-[0.98] bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02]"
              asChild
            >
              <Link href="/checkout">
                Proceed to Checkout <ArrowRight className="ml-3 h-4 w-4" />
              </Link>
            </Button>

            <p className="text-xs text-center text-muted-foreground mt-4 font-medium flex items-center justify-center gap-1.5">
              Secure checkout rounded by{" "}
              <span className="text-primary font-black">RajulEye</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
