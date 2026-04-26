'use client';
import { useState } from 'react';
import { ProductSlider } from "@/components/product/ProductSlider";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { toast } from "sonner";
import { useToggleWishlistMutation } from "@/store/wishlistApi";
import { useAppSelector } from '@/store/store';
import { selectCurrentUser, selectIsAuthenticated } from '@/store/authSlice';
import { useGetMyOrdersQuery } from '@/store/orderApi';
import { useGetProductReviewsQuery } from '@/store/reviewApi';
import { ProductVisuals } from "./components/ProductVisuals";
import { ProductInfo } from "./components/ProductInfo";
import { ProductTabs } from "./components/ProductTabs";
import { MobileActionBar } from "./components/MobileActionBar";
export function ProductDetailClient({ product, relatedProducts }) {
    const [toggleWishlistMutation] = useToggleWishlistMutation();
    const [showConfirm, setShowConfirm] = useState(false);
    // Rating & Auth State
    const user = useAppSelector(selectCurrentUser);
    const isLoggedIn = useAppSelector(selectIsAuthenticated);
    const { data: reviewsResponse, isLoading: reviewsLoading } = useGetProductReviewsQuery({ productId: product.id });
    const databaseReviews = reviewsResponse?.data?.reviews || [];
    const { data: ordersResponse } = useGetMyOrdersQuery({ page: 1, limit: 100 }, { skip: !isLoggedIn });
    const orders = ordersResponse?.data?.orders || [];
    const purchasedOrder = isLoggedIn && orders.length > 0 ? orders.find(order => order.items.some(item => item.product === product.id)) : null;
    const hasBoughtProduct = !!purchasedOrder;
    const orderId = purchasedOrder?._id;
    const discountPercent = product.discountPrice
        ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
        : 0;
    return (<div className="flex flex-col min-h-screen lg:pt-32 bg-background pb-32 mt-[-142px] lg:mt-[-128px] md:pb-0">
            <div className="flex flex-col md:container md:mx-auto md:px-8 md:max-w-[1400px]">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 xl:gap-24 items-start">
                    <ProductVisuals product={product} discountPercent={discountPercent}/>

                    <div className="flex flex-col">
                        <ProductInfo product={product}/>
                        <ProductTabs product={product} reviews={databaseReviews} isLoggedIn={isLoggedIn} hasBoughtProduct={hasBoughtProduct} orderId={orderId} user={user}/>
                    </div>
                </div>

                {relatedProducts.length > 0 && (<section className="mt-32 px-4 md:px-0">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
                            <div className="space-y-2">
                                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary/40">Similar Mood</span>
                                <h2 className="text-2xl md:text-5xl font-bold tracking-[-0.03em]">You may also like</h2>
                            </div>
                        </div>
                        <ProductSlider products={relatedProducts}/>
                    </section>)}
            </div>

            <MobileActionBar product={product}/>

            <style jsx global>{`
                @media (max-width: 767px) {
                    .fixed.bottom-0.left-0.z-50.w-full.h-16 {
                        display: none !important;
                    }
                }
            `}</style>

            <ConfirmModal isOpen={showConfirm} onClose={() => setShowConfirm(false)} onConfirm={async () => {
            try {
                await toggleWishlistMutation(product).unwrap();
                toast.success("Removed from Wishlist");
                setShowConfirm(false);
            }
            catch (error) {
                toast.error("Failed to remove from wishlist");
            }
        }} title="Remove from Wishlist" description={`Are you sure you want to remove ${product.name} from your wishlist?`} confirmText="Remove" variant="destructive"/>
        </div>);
}
