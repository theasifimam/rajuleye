'use client';

import { Star, Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Product } from "@/store/productApi";
import { Review } from "./types";
import { ReviewForm } from "./ReviewForm";

interface ReviewSectionProps {
    product: Product;
    reviews: Review[];
    isLoggedIn: boolean;
    hasBoughtProduct: boolean;
    orderId?: string;
    user: any;
}

export function ReviewSection({
    product,
    reviews,
    isLoggedIn,
    hasBoughtProduct,
    orderId,
    user,
}: ReviewSectionProps) {
    return (
        <div className="pt-6">
            {/* Aggregate Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 xs:p-6 rounded-[2rem] xs:rounded-[2.5rem] bg-muted/20 border border-border/50 mb-8">
                <div className="flex flex-col items-center justify-center text-center space-y-2 border-b md:border-b-0 md:border-r border-border/50 pb-6 md:pb-0">
                    <p className="text-4xl font-black tracking-tighter">{product.rating}</p>
                    <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(s => (
                            <Star key={s} className={cn("w-3 h-3", s <= Math.round(product.rating) ? "fill-primary text-primary" : "text-muted-foreground/20")} />
                        ))}
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">{product.reviews} Verified Opinions</p>
                </div>
                <div className="col-span-2 space-y-2 py-4 md:py-0 md:px-4">
                    {[5, 4, 3, 2, 1].map((rating) => {
                        const count = reviews.filter(r => Math.round(r.rating) === rating).length;
                        const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                        return (
                            <div key={rating} className="flex items-center gap-3">
                                <span className="text-[10px] font-black w-3">{rating}</span>
                                <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-primary transition-all duration-500"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <span className="text-[10px] font-black text-muted-foreground/40 w-8">
                                    {Math.round(percentage)}%
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-6 mb-12">
                {reviews.map((rev) => (
                    <div key={rev._id} className="p-4 xs:p-6 rounded-[1.5rem] xs:rounded-[2rem] bg-white dark:bg-muted/10 border border-border/40 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {rev.user?.avatar ? (
                                    <div className="h-8 w-8 rounded-full overflow-hidden border border-primary/20">
                                        <Image src={rev.user.avatar} alt={rev.user.name} width={32} height={32} className="object-cover h-full w-full" />
                                    </div>
                                ) : (
                                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-[10px] font-black uppercase">
                                        {rev.user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                                    </div>
                                )}
                                <div>
                                    <p className="text-xs font-black tracking-tight">{rev.user?.name || 'Anonymous User'}</p>
                                    <div className="flex items-center gap-2">
                                        <div className="flex gap-0.5">
                                            {[1, 2, 3, 4, 5].map(s => (
                                                <Star key={s} className={cn("w-2 h-2", s <= rev.rating ? "fill-primary text-primary" : "text-muted-foreground/20")} />
                                            ))}
                                        </div>
                                        <span className="text-[9px] text-muted-foreground/40 font-bold uppercase tracking-widest">
                                            {new Date(rev.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            {rev.isVerifiedPurchase && (
                                <Badge variant="outline" className="h-6 rounded-full border-emerald-500/20 text-emerald-500 bg-emerald-500/5 text-[8px] font-black uppercase tracking-widest px-2">
                                    Verified
                                </Badge>
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed italic">
                            "{rev.comment}"
                        </p>

                        {rev.images && rev.images.length > 0 && (
                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                {rev.images.map((img, i) => (
                                    <div key={i} className="relative h-20 w-20 flex-shrink-0 rounded-2xl overflow-hidden border border-border">
                                        <Image src={img} alt="User Review" fill className="object-cover" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Post Review Section */}
            <div className="pt-8 border-t border-border/50">
                {!hasBoughtProduct ? (
                    <div className="py-8 px-4 xs:py-12 xs:px-6 rounded-[2rem] xs:rounded-[2.5rem] bg-muted/10 border border-dashed border-muted-foreground/20 text-center space-y-4">
                        <div className="h-16 w-16 bg-background rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                            <Lock className="h-8 w-8 text-muted-foreground/40" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-lg font-black tracking-tight">Verified Purchases Only</p>
                            <p className="text-xs text-muted-foreground font-medium max-w-[240px] mx-auto leading-relaxed">
                                Buy now to add review the product. Only verified owners can share their experience in our gallery.
                            </p>
                        </div>
                        {!isLoggedIn && (
                            <Button variant="outline" className="rounded-full px-8 h-12 font-bold text-xs uppercase tracking-widest mt-4">
                                Sign In to Review
                            </Button>
                        )}
                    </div>
                ) : (
                    <ReviewForm
                        user={user}
                        productId={product.id}
                        orderId={orderId!}
                    />
                )}
            </div>
        </div>
    );
}
