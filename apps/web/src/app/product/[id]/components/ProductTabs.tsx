'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2 } from "lucide-react";
import { Product } from "@/store/productApi";
import { ReviewSection } from "./ReviewSection";
import { Review } from "./types";

interface ProductTabsProps {
    product: Product;
    reviews: Review[];
    isLoggedIn: boolean;
    hasBoughtProduct: boolean;
    orderId?: string;
    user: any;
}

export function ProductTabs({
    product,
    reviews,
    isLoggedIn,
    hasBoughtProduct,
    orderId,
    user,
}: ProductTabsProps) {
    return (
        <div className="pt-6">
            <Tabs defaultValue="details" className="w-full">
                <TabsList className="bg-transparent border-b border-muted-foreground/10 w-full justify-start rounded-none h-12 p-0 gap-4 xs:gap-8 overflow-x-auto scrollbar-hide">
                    {["details", "shipping", "reviews"].map((tab) => (
                        <TabsTrigger
                            key={tab}
                            value={tab}
                            className="relative h-full rounded-none bg-transparent px-4 text-[10px] font-black uppercase tracking-[0.2em] data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:absolute data-[state=active]:after:bottom-0 data-[state=active]:after:left-0 data-[state=active]:after:h-[2px] data-[state=active]:after:w-full data-[state=active]:after:bg-primary transition-all capitalize"
                        >
                            {tab === 'reviews' ? 'Opinions' : tab === 'shipping' ? 'Returns' : 'Details'}
                        </TabsTrigger>
                    ))}
                </TabsList>

                <TabsContent value="details" className="pt-6 px-4 space-y-6 text-sm leading-relaxed text-muted-foreground font-medium">
                    <p>
                        Engineered for visual excellence. Our frames combine medical-grade titanium with hand-refined Italian acetate to ensure unparalleled comfort and a bespoke architectural silhouette.
                    </p>
                    <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-3">
                            {[
                                "Medical-Grade Materials",
                                "Distortion-Free Lenses",
                                "Universal Bridge Fit",
                                "AR Nano-Coating"
                            ].map((text, i) => (
                                <li key={i} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-primary list-none">
                                    <CheckCircle2 className="h-3 w-3 text-primary" />
                                    {text}
                                </li>
                            ))}
                        </div>

                        <div className="p-4 rounded-3xl bg-primary/5 border border-primary/10">
                            <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-2">Technical Specification</p>
                            <p className="text-[11px] font-medium leading-normal opacity-70">
                                All Rajul Eye signature frames are prescription-ready. Our signature "V-Hinge" system tested to 50,000 cycles for life-long integrity. Each lens features 100% UVA/UVB protection as standard.
                            </p>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="shipping" className="pt-6 px-4">
                    <div className="grid grid-cols-2 gap-6">
                        {[
                            { label: "Transit", val: "2-4 Days" },
                            { label: "Cost", val: "Free" },
                            { label: "Window", val: "30 Days" },
                            { label: "Support", val: "24/7" }
                        ].map((stat, i) => (
                            <div key={i} className="space-y-1 p-4 rounded-2xl bg-muted/30 border border-border/50">
                                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">{stat.label}</p>
                                <p className="text-[11px] font-bold">{stat.val}</p>
                            </div>
                        ))}
                    </div>
                </TabsContent>

                <TabsContent value="reviews" className="pt-6 px-4">
                    <ReviewSection
                        product={product}
                        reviews={reviews}
                        isLoggedIn={isLoggedIn}
                        hasBoughtProduct={hasBoughtProduct}
                        orderId={orderId}
                        user={user}
                    />
                </TabsContent>
            </Tabs>
        </div>
    );
}
