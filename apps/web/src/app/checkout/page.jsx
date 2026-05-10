"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGetCartQuery, useClearCartMutation } from "@/store/cartApi";
import { useCreateOrderMutation, useVerifyPaymentMutation, useCancelOrderMutation } from "@/store/orderApi";
import { useAppSelector } from "@/store/store";
import { useGetProfileQuery } from "@/store/authApi";
import { selectCurrentUser, selectIsAuthenticated } from "@/store/authSlice";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  CheckCircle2,
  MapPin,
  ChevronDown,
  Check,
  Plus,
  Home,
  Briefcase,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { AddressDialog } from "@/components/profile/AddressDialog";

export default function CheckoutPage() {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const { data: cartData, isLoading: isCartLoading } = useGetCartQuery(
    undefined,
    { skip: !isAuthenticated },
  );
  const [clearCart] = useClearCartMutation();
  const [createOrder] = useCreateOrderMutation();
  const [verifyPayment] = useVerifyPaymentMutation();
  const [cancelOrder] = useCancelOrderMutation();
  const { data: profileData } = useGetProfileQuery(undefined, {
    skip: !isAuthenticated,
  });
  const authUser = useAppSelector(selectCurrentUser);
  const user = profileData?.data || authUser;
  const addresses = user?.addresses || [];
  const prevAddressesLength = React.useRef(addresses.length);
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("online");
  const [mounted, setMounted] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Set initial selected address or select newest when added
  useEffect(() => {
    if (mounted && addresses.length > 0) {
      if (addresses.length > prevAddressesLength.current) {
        // Address was added, select the newest one (usually last in array)
        const newest = addresses[addresses.length - 1];
        setSelectedAddressId(newest._id || null);
      } else if (selectedAddressId === null) {
        const primary = addresses.find((a) => a.isDefault) || addresses[0];
        setSelectedAddressId(primary._id || null);
      }
    }
    prevAddressesLength.current = addresses.length;
  }, [mounted, addresses, selectedAddressId]);

  const items = (cartData?.data?.items || []).filter(
    (item) => item && item.product,
  );

  useEffect(() => {
    if (mounted && !isCartLoading && items.length === 0 && !isSuccess) {
      router.push("/cart");
    }
  }, [mounted, isCartLoading, items.length, isSuccess, router]);

  if (!mounted || isCartLoading) {
    return null;
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
  const handleCheckout = async (e) => {
    e.preventDefault();
    if (!selectedAddressId) {
      toast.error("Please select a shipping address");
      return;
    }
    setIsProcessing(true);
    try {
      const response = await createOrder({
        shippingAddress: primaryAddress,
        paymentMethod: paymentMethod, // 'online' or 'cod'
        notes: "",
      }).unwrap();

      if (response.data?.razorpayOrder) {
        const { razorpayOrder, key, order } = response.data;
        
        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => {
          const options = {
            key: key,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            name: "RajulEye",
            description: "Purchase Order",
            order_id: razorpayOrder.id,
            handler: async function (response) {
               try {
                 setIsProcessing(true);
                 await verifyPayment({
                   razorpay_order_id: response.razorpay_order_id,
                   razorpay_payment_id: response.razorpay_payment_id,
                   razorpay_signature: response.razorpay_signature
                 }).unwrap();
                 await clearCart().unwrap();
                 setIsProcessing(false);
                 setIsSuccess(true);
               } catch (e) {
                 toast.error("Payment verification failed");
                 setIsProcessing(false);
               }
            },
            prefill: {
              name: user?.name || "Customer",
              email: user?.email || "",
              contact: user?.mobile || "",
            },
            theme: {
              color: "#000000",
            },
            modal: {
              ondismiss: async function() {
                setIsProcessing(false);
                toast.error("Payment cancelled");
                try {
                  if (order?._id) {
                    await cancelOrder(order._id).unwrap();
                  }
                } catch (e) {
                  console.error("Failed to cancel pending order", e);
                }
              }
            }
          };
          const rzp1 = new window.Razorpay(options);
          rzp1.open();
        };
        script.onerror = () => {
          setIsProcessing(false);
          toast.error("Failed to load payment gateway");
        };
        document.body.appendChild(script);
      } else {
        // Fallback or COD
        await clearCart().unwrap();
        setIsProcessing(false);
        setIsSuccess(true);
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to place order");
      setIsProcessing(false);
    }
  };
  const getIcon = (type) => {
    if (!type) return MapPin;
    const t = type.toLowerCase();
    if (t.includes("home")) return Home;
    if (t.includes("office") || t.includes("work")) return Briefcase;
    return MapPin;
  };
  const primaryAddress =
    addresses.find((a) => a._id === selectedAddressId) ||
    addresses.find((a) => a.isDefault) ||
    addresses[0];
  const otherAddresses = addresses.filter((a) => a._id !== selectedAddressId);
  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-12 text-center animate-in fade-in zoom-in duration-500">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full" />
          <CheckCircle2 className="relative h-32 w-32 text-primary drop-shadow-lg shrink-0" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
          Order Confirmed
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-md mx-auto font-medium">
          Thank you for your purchase. We've sent a confirmation email with your
          order details.
        </p>
        <Button
          size="lg"
          className="rounded-full shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all text-sm uppercase font-black tracking-widest px-10 h-16 bg-primary text-primary-foreground"
          asChild
        >
          <Link href="/">Continue Shopping</Link>
        </Button>
      </div>
    );
  }
  if (items.length === 0 && !isSuccess) {
    return null;
  }
  return (
    <div className="container mx-auto px-4 py-8 md:py-12 max-w-6xl">
      <Link
        href="/cart"
        className="inline-flex items-center text-xs font-bold uppercase tracking-widest text-muted-foreground/60 hover:text-primary transition-all mb-8 group"
      >
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />{" "}
        Back to Cart
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        <div className="lg:col-span-7">
          <h2 className="text-3xl font-black mb-8 tracking-tighter">
            Checkout Details
          </h2>
          <form
            id="checkout-form"
            onSubmit={handleCheckout}
            className="space-y-10"
          >
            {/* Contact Info */}
            <div className="space-y-6">
              <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground/50">
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                    Email
                  </label>
                  <Input
                    type="email"
                    defaultValue={user?.email || ""}
                    className="h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-primary/50 text-base px-5 shadow-inner font-bold"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                    Phone
                  </label>
                  <Input
                    type="tel"
                    defaultValue={user?.mobile || ""}
                    className="h-14 rounded-2xl bg-muted/30 border-none focus-visible:ring-primary/50 text-base px-5 shadow-inner font-bold"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Address - Card Selection */}
            <div className="space-y-6 pt-10 border-t">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground/50">
                  Shipping Address
                </h3>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsAddressModalOpen(true)}
                  className="h-9 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary/20"
                >
                  <Plus className="mr-1.5 h-3.5 w-3.5" /> Add New
                </Button>
              </div>

              <div className="space-y-4">
                {/* Primary/Selected Address */}
                {primaryAddress ? (
                  <div className="relative group p-6 rounded-[2rem] bg-primary/5 border-2 border-primary shadow-lg animate-in fade-in zoom-in duration-500">
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-2xl bg-primary text-white flex items-center justify-center shrink-0">
                        {React.createElement(getIcon(primaryAddress.label), {
                          className: "h-6 w-6",
                        })}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-black uppercase tracking-[0.2em] text-primary">
                            {primaryAddress.label}
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-primary text-white text-[8px] font-black uppercase tracking-widest">
                            Active
                          </span>
                        </div>
                        <p className="font-bold text-lg tracking-tight leading-tight mb-1">
                          {primaryAddress.fullName}
                        </p>
                        <p className="text-muted-foreground font-medium text-sm mb-1">
                          {primaryAddress.line1}
                          {primaryAddress.line2 && `, ${primaryAddress.line2}`}
                        </p>
                        <p className="text-muted-foreground font-medium text-sm">
                          {primaryAddress.city}, {primaryAddress.state}{" "}
                          {primaryAddress.pincode}
                        </p>
                      </div>
                      <div className="h-6 w-6 rounded-full bg-primary text-white flex items-center justify-center">
                        <Check className="h-3.5 w-3.5" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => setIsAddressModalOpen(true)}
                    className="p-10 border-2 border-dashed border-muted-foreground/20 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-muted/30 transition-all opacity-60 hover:opacity-100"
                  >
                    <div className="h-14 w-14 rounded-full bg-muted flex items-center justify-center">
                      <Plus className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="font-black uppercase tracking-widest text-xs">
                      Add Shipping Address
                    </p>
                  </div>
                )}

                {/* Other Addresses List */}
                {otherAddresses.length > 0 && (
                  <div className="pt-4 space-y-3">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-2">
                      Other Saved Addresses
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {otherAddresses.map((addr) => {
                        const Icon = getIcon(addr.label);
                        return (
                          <button
                            key={addr._id}
                            type="button"
                            onClick={() =>
                              setSelectedAddressId(addr._id || null)
                            }
                            className="flex items-center gap-4 p-4 rounded-3xl border border-border/50 bg-card hover:bg-muted/50 hover:border-primary/30 transition-all text-left group"
                          >
                            <div className="h-10 w-10 rounded-xl bg-muted group-hover:bg-primary/10 group-hover:text-primary transition-colors flex items-center justify-center shrink-0">
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-black text-[10px] uppercase tracking-widest text-primary/70">
                                {addr.label}
                              </p>
                              <p className="text-sm font-bold truncate text-muted-foreground group-hover:text-foreground transition-colors">
                                {addr.line1}
                              </p>
                            </div>
                            <ChevronDown className="h-4 w-4 text-muted-foreground/40 -rotate-90" />
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Payment Selection */}
            <div className="space-y-6">
              <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground/50 border-t pt-10">
                Payment Method
              </h3>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant={paymentMethod === "online" ? "default" : "outline"}
                  className={`flex-1 rounded-2xl h-14 font-black transition-all ${paymentMethod === "online" ? "shadow-inner" : "bg-muted/30 border-none"}`}
                  onClick={() => setPaymentMethod("online")}
                >
                  Pay Online (Razorpay)
                </Button>
                <Button
                  type="button"
                  variant={paymentMethod === "cod" ? "default" : "outline"}
                  className={`flex-1 rounded-2xl h-14 font-black transition-all ${paymentMethod === "cod" ? "shadow-inner" : "bg-muted/30 border-none"}`}
                  onClick={() => setPaymentMethod("cod")}
                >
                  Cash on Delivery
                </Button>
              </div>

              {paymentMethod === "online" && (
                <div className="p-4 rounded-2xl border-2 border-primary/20 bg-primary/5 flex items-center gap-4 mt-6">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Secure Payment via Razorpay</p>
                    <p className="text-xs text-muted-foreground mt-1">Cards, UPI, NetBanking, Wallets supported.</p>
                  </div>
                </div>
              )}
              {paymentMethod === "cod" && (
                <div className="p-4 rounded-2xl border-2 border-muted bg-muted/30 flex items-center gap-4 mt-6">
                  <div className="h-10 w-10 rounded-xl bg-background flex items-center justify-center shrink-0">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Pay on Delivery</p>
                    <p className="text-xs text-muted-foreground mt-1">You can pay using cash or UPI upon delivery.</p>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>

        <div className="lg:col-span-5 md:order-last">
          <div className="sticky top-24 bg-linear-to-br from-card to-muted/20 rounded-[2.5rem] border shadow-xl p-8">
            <h2 className="text-2xl font-black mb-6 tracking-tight">
              Order Summary
            </h2>
            <div className="space-y-6 max-h-[40vh] overflow-auto pr-2 scrollbar-hide">
              {items.map((item, index) => (
                <div
                  key={
                    item._id ||
                    item.product?.id ||
                    item.product?._id ||
                    `item-${index}`
                  }
                  className="flex gap-4 items-center group"
                >
                  <div className="relative w-24 h-24 rounded-[1.5rem] overflow-hidden bg-muted shrink-0 shadow-inner">
                    <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] font-black h-6 w-6 rounded-full flex items-center justify-center z-10 shadow-lg ring-2 ring-background">
                      {item.qty}
                    </span>
                    <img
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
                          : `data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Crect fill='%23f1f5f9' width='100' height='100'/%3E%3C/svg%3E`
                      }
                      alt={item.product?.name || "Product"}
                      className="object-cover w-full h-full transform group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-extrabold text-base line-clamp-2 tracking-tight">
                      {item.product?.name}
                    </p>
                    <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60 mt-1">
                      {typeof item.product.category === "object" &&
                      item.product.category !== null
                        ? item.product.category.name
                        : item.product.category}
                    </p>
                    {item.lensType && (
                      <p className="text-[10px] font-bold text-primary/70 mt-0.5">
                        Lens: {item.lensType}
                        {item.frameName && item.frameName !== 'Plane Glass' ? ` • Frame: ${item.frameName}` : ''}
                      </p>
                    )}
                    {item.powerSubmissionMethod && (
                      <p className="text-[10px] font-bold text-indigo-600 mt-0.5">
                        Power: {item.powerSubmissionMethod === 'saved' ? 'Saved' : item.powerSubmissionMethod === 'manual' ? 'Manual' : item.powerSubmissionMethod === 'upload' ? 'Uploaded' : item.powerSubmissionMethod === 'whatsapp' ? 'WhatsApp' : 'Skipped'}
                      </p>
                    )}
                    <p className="font-black text-lg mt-1">
                      ₹
                      {(
                        (item.priceAtAdd ||
                          item.product.discountPrice ||
                          item.product.price) * item.qty
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 space-y-4 border-t border-dashed border-border/50 pt-8 font-medium text-sm">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground/80">Subtotal</span>
                <span className="font-bold">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground/80">Tax (8%)</span>
                <span className="font-bold">₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t">
                <span className="text-xl font-black tracking-tight">Total</span>
                <span className="text-2xl font-black text-primary">
                  ₹{total.toFixed(2)}
                </span>
              </div>
            </div>

            <Button
              type="submit"
              form="checkout-form"
              className="w-full mt-8 h-16 rounded-full text-sm uppercase tracking-widest font-black shadow-xl hover:shadow-2xl transition-all active:scale-[0.98] bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-[1.02]"
              disabled={isProcessing}
            >
              {isProcessing
                ? "Processing Order..."
                : `Pay ₹${total.toFixed(2)}`}
            </Button>
            <p className="text-[10px] font-bold text-center text-muted-foreground mt-4 uppercase tracking-[0.2em] flex items-center justify-center gap-1.5 opacity-60">
              Secure checkout by{" "}
              <span className="text-primary font-black">RajulEye</span>
            </p>
          </div>
        </div>
      </div>

      <AddressDialog
        isOpen={isAddressModalOpen}
        onOpenChange={setIsAddressModalOpen}
      />
    </div>
  );
}
