"use client";
import { useState } from "react";
import { ProductSlider } from "@/components/product/ProductSlider";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { toast } from "sonner";
import { useToggleWishlistMutation } from "@/store/wishlistApi";
import { useAppSelector } from "@/store/store";
import { selectCurrentUser, selectIsAuthenticated } from "@/store/authSlice";
import { useGetMyOrdersQuery } from "@/store/orderApi";
import { useGetProductReviewsQuery } from "@/store/reviewApi";
import { useGetFramesQuery } from "@/store/frameApi";
import { Check } from "lucide-react";
import { ProductVisuals } from "./components/ProductVisuals";
import { ProductInfo } from "./components/ProductInfo";
import { ProductTabs } from "./components/ProductTabs";
import { MobileActionBar } from "./components/MobileActionBar";
import { AddToCartButton } from "./AddToCartButton";
import { cn } from "@/lib/utils";

const PLANE_GLASS = {
  id: "plane",
  name: "Plane Glass",
  description: "Standard clear glass",
  price: 0,
  discount: 0,
};

export function ProductDetailClient({ product, relatedProducts }) {
  const { data: framesResponse } = useGetFramesQuery();
  const dbFrames = framesResponse?.data || [];

  // Combine Plane Glass with DB frames
  const lensPackages = [
    PLANE_GLASS,
    ...dbFrames.map((f) => ({
      id: f._id,
      name: f.name,
      description: f.description,
      price: f.price,
      discount: f.discount,
    })),
  ];

  const [selectedLens, setSelectedLens] = useState(PLANE_GLASS);
  const [toggleWishlistMutation] = useToggleWishlistMutation();
  const [showConfirm, setShowConfirm] = useState(false);

  // Rating & Auth State
  const user = useAppSelector(selectCurrentUser);
  const isLoggedIn = useAppSelector(selectIsAuthenticated);
  const { data: reviewsResponse, isLoading: reviewsLoading } =
    useGetProductReviewsQuery({ productId: product.id });
  const databaseReviews = reviewsResponse?.data?.reviews || [];
  const { data: ordersResponse } = useGetMyOrdersQuery(
    { page: 1, limit: 100 },
    { skip: !isLoggedIn },
  );
  const orders = ordersResponse?.data?.orders || [];
  const purchasedOrder =
    isLoggedIn && orders.length > 0
      ? orders.find((order) =>
          order.items.some((item) => item.product === product.id),
        )
      : null;
  const hasBoughtProduct = !!purchasedOrder;
  const orderId = purchasedOrder?._id;

  // Modified Product Calculation
  const basePrice = product.price || 0;
  const baseDiscountPrice = product.discountPrice || basePrice;

  const lensPrice = selectedLens.price;
  const lensDiscountPrice =
    lensPrice > 0 ? lensPrice - lensPrice * (selectedLens.discount / 100) : 0;

  const totalPrice = basePrice + lensPrice;
  const finalDiscountPrice =
    product.discountPrice || selectedLens.discount > 0
      ? baseDiscountPrice + lensDiscountPrice
      : undefined;

  const modifiedProduct = {
    ...product,
    price: totalPrice,
    discountPrice: finalDiscountPrice,
    selectedLens: selectedLens.name,
  };

  const discountPercent = modifiedProduct.discountPrice
    ? Math.round(
        ((modifiedProduct.price - modifiedProduct.discountPrice) /
          modifiedProduct.price) *
          100,
      )
    : 0;

  return (
    <div className="flex flex-col min-h-screen lg:pt-32 bg-background pb-32 mt-[-142px] lg:mt-[-128px] md:pb-0">
      <div className="flex flex-col md:container md:mx-auto md:px-8 md:max-w-[1400px]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 xl:gap-24 items-start">
          <div className="flex flex-col space-y-6">
            <ProductVisuals
              product={modifiedProduct}
              discountPercent={discountPercent}
            />

            {/* Lens Section */}
            <div className="space-y-4 pt-4 px-4 md:px-0">
              <h3 className="text-sm font-black uppercase tracking-widest text-primary">
                Select Glasses Type
              </h3>
              <div className="grid grid-cols-4 md:grid-cols-3 gap-2 sm:gap-3">
                {lensPackages.map((lens) => (
                  <div
                    key={lens.id}
                    onClick={() => setSelectedLens(lens)}
                    className={cn(
                      "flex flex-col p-2 sm:p-4 rounded-xl sm:rounded-2xl border-2 cursor-pointer transition-all",
                      selectedLens.id === lens.id
                        ? "border-primary bg-primary/5 shadow-sm scale-[1.02]"
                        : "border-border hover:border-primary/30 hover:bg-muted/50",
                    )}
                  >
                    <div className="flex justify-between items-start mb-1 sm:mb-2">
                      <span className="font-bold text-[10px] sm:text-sm tracking-tight leading-tight line-clamp-1">
                        {lens.name}
                      </span>
                      {selectedLens.id === lens.id && (
                        <Check className="w-3 h-3 sm:w-4 sm:h-4 text-primary shrink-0" />
                      )}
                    </div>
                    <span className="text-[8px] sm:text-xs text-muted-foreground mb-1 sm:mb-3 line-clamp-2">
                      {lens.description}
                    </span>
                    <div className="mt-auto flex flex-col">
                      {lens.price === 0 ? (
                        <span className="font-black text-[10px] sm:text-sm text-primary">
                          Incl.
                        </span>
                      ) : (
                        <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-2">
                          <span className="font-black text-[10px] sm:text-sm text-primary whitespace-nowrap">
                            +₹
                            {(
                              lens.price -
                              lens.price * (lens.discount / 100)
                            ).toFixed(0)}
                          </span>
                          {lens.discount > 0 && (
                            <span className="text-[8px] sm:text-[10px] text-muted-foreground line-through">
                              ₹{lens.price.toFixed(0)}
                            </span>
                          )}
                        </div>
                      )}
                      {lens.discount > 0 && (
                        <span className="text-[8px] sm:text-[10px] font-bold text-emerald-500 mt-0.5">
                          {lens.discount}% OFF
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <ProductInfo product={modifiedProduct} />
            <div className="hidden md:block pt-4">
              <AddToCartButton product={modifiedProduct} selectedLens={selectedLens} />
            </div>
            <ProductTabs
              product={modifiedProduct}
              reviews={databaseReviews}
              isLoggedIn={isLoggedIn}
              hasBoughtProduct={hasBoughtProduct}
              orderId={orderId}
              user={user}
            />
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <section className="mt-32 px-4 md:px-0">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
              <div className="space-y-2">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/40">
                  Similar Mood
                </span>
                <h2 className="text-2xl md:text-5xl font-bold tracking-[-0.03em]">
                  You may also like
                </h2>
              </div>
            </div>
            <ProductSlider products={relatedProducts} />
          </section>
        )}
      </div>

      <MobileActionBar product={modifiedProduct} selectedLens={selectedLens} />

      <style jsx global>{`
        @media (max-width: 767px) {
          .fixed.bottom-0.left-0.z-50.w-full.h-16 {
            display: none !important;
          }
        }
      `}</style>

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={async () => {
          try {
            await toggleWishlistMutation(modifiedProduct).unwrap();
            toast.success("Removed from Wishlist");
            setShowConfirm(false);
          } catch (error) {
            toast.error("Failed to remove from wishlist");
          }
        }}
        title="Remove from Wishlist"
        description={`Are you sure you want to remove ${modifiedProduct.name} from your wishlist?`}
        confirmText="Remove"
        variant="destructive"
      />
    </div>
  );
}
