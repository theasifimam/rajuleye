'use client';
import { ProductImageCarousel } from "@/components/product/ProductImageCarousel";
import { Globe, Lock, RotateCcw } from "lucide-react";
export function ProductVisuals({ product, discountPercent }) {
    return (<div className="relative -mt-0 md:mt-0">
            <div className="sticky top-24 space-y-8">
                <div className="relative group">
                    {discountPercent > 0 && (<div className="absolute top-20 left-4 md:top-8 md:left-8 z-20">
                            <div className="bg-primary text-primary-foreground px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] shadow-2xl">
                                -{discountPercent}% OFF
                            </div>
                        </div>)}
                    <ProductImageCarousel images={product.images} name={product.name}/>
                </div>

                {/* Trust Strip - Desktop Only */}
                <div className="hidden lg:grid grid-cols-3 gap-8 py-8 border-t border-muted-foreground/10">
                    {[
            { icon: Globe, label: "Sustainability", desc: "Eco-conscious sourcing" },
            { icon: Lock, label: "Secure", desc: "Encrypted transactions" },
            { icon: RotateCcw, label: "30-Day", desc: "Hassle-free returns" }
        ].map((item, i) => (<div key={i} className="flex flex-col items-center text-center gap-3">
                            <div className="p-3 bg-white dark:bg-muted rounded-2xl shadow-sm border border-border/50">
                                <item.icon className="h-4 w-4 text-muted-foreground"/>
                            </div>
                            <div className="space-y-0.5">
                                <p className="text-[10px] font-black uppercase tracking-widest">{item.label}</p>
                                <p className="text-[9px] text-muted-foreground/60 font-medium leading-tight">{item.desc}</p>
                            </div>
                        </div>))}
                </div>
            </div>
        </div>);
}
