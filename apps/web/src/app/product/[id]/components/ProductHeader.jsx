'use client';
import { ChevronLeft, Heart, Share2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { toast } from "sonner";
export function ProductHeader({ scrolled, isWishlisted, product, toggleItem, setShowConfirm }) {
    return (<>
            {/* Mobile App Header - High-end Glass Island */}
            <header className={cn("fixed top-4 left-4 right-4 z-[100] transition-all duration-500 md:hidden", scrolled ? "translate-y-0 opacity-100" : "translate-y-0")}>
                <div className={cn("flex items-center justify-between h-14 px-4 rounded-2xl border transition-all duration-500", scrolled
            ? "bg-background/80 backdrop-blur-2xl border-border shadow-lg"
            : "bg-black/20 backdrop-blur-md border-white/10 shadow-sm")}>
                    <Button variant="ghost" size="icon" className={cn("rounded-xl h-10 w-10 flex items-center justify-center transition-all", scrolled ? "bg-muted text-foreground" : "bg-white/10 text-white")} onClick={() => window.history.back()}>
                        <ChevronLeft className="h-6 w-6"/>
                    </Button>

                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className={cn("rounded-xl h-10 w-10 transition-all", scrolled ? "bg-muted text-foreground" : "bg-white/10 text-white", isWishlisted && "text-rose-500 fill-rose-500")} onClick={() => {
            if (isWishlisted) {
                setShowConfirm(true);
            }
            else {
                toggleItem(product);
                toast.success("Added to Wishlist");
            }
        }}>
                            <Heart className={cn("h-5 w-5", isWishlisted && "fill-current")}/>
                        </Button>
                        <Button variant="ghost" size="icon" className={cn("rounded-xl h-10 w-10 transition-all", scrolled ? "bg-muted text-foreground" : "bg-white/10 text-white")}>
                            <Share2 className="h-5 w-5"/>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Desktop Header */}
            <div className="hidden md:flex container mx-auto px-8 max-w-[1400px] pt-32 items-center justify-between mb-8">
                <Link href="/search" className="group flex items-center gap-3 text-xs font-black uppercase tracking-[0.25em] text-muted-foreground/40 hover:text-primary transition-all">
                    <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1"/>
                    Back to Shop
                </Link>
                <div className="flex items-center gap-6">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/20">Ref: {product.id}</span>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="icon" className={cn("rounded-full h-11 w-11 border border-border hover:border-rose-300 hover:bg-rose-50 transition-all", isWishlisted && "bg-rose-50 text-rose-500 border-rose-200 fill-rose-500")} onClick={() => {
            if (isWishlisted) {
                setShowConfirm(true);
            }
            else {
                toggleItem(product);
                toast.success("Added to Wishlist");
            }
        }}>
                            <Heart className={cn("h-4 w-4", isWishlisted && "fill-current")}/>
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-full h-11 w-11 border border-border hover:border-primary/30 hover:bg-primary/5 transition-all">
                            <Share2 className="h-4 w-4"/>
                        </Button>
                    </div>
                </div>
            </div>
        </>);
}
