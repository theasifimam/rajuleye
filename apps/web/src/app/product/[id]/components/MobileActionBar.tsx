'use client';

import { Product } from "@/store/productApi";
import { AddToCartButton } from "../AddToCartButton";

interface MobileActionBarProps {
    product: Product;
}

export function MobileActionBar({ product }: MobileActionBarProps) {
    return (
        <div className="fixed bottom-0 left-0 right-0 z-[110] p-4 bg-background/80 backdrop-blur-xl border-t border-border md:hidden safe-area-bottom shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)]">
            <div className="flex items-center gap-4 max-w-lg mx-auto">
                <div className="flex flex-col min-w-[100px]">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50 leading-none mb-1">Total</p>
                    <p className="text-lg font-bold tracking-tight">${(product.discountPrice || product.price).toFixed(2)}</p>
                </div>
                <AddToCartButton product={product} compact />
            </div>
        </div>
    );
}
