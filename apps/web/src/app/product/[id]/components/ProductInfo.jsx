'use client';
import { Star, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { AddToCartButton } from "../AddToCartButton";

export function ProductInfo({ product, lensPackages, selectedLens, onLensSelect }) {
    return (<div className="flex flex-col space-y-8 px-4 md:px-0 -mt-6 md:mt-0 relative z-10 bg-background rounded-t-[2.5rem] md:rounded-none pt-8 md:pt-0">
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60">
                        {typeof product.category === 'object' && product.category !== null ? product.category.name : product.category}
                    </span>
                    {product.rating > 4.5 && (<Badge className="bg-emerald-500/10 text-emerald-600 border-none rounded-full text-[9px] font-bold uppercase tracking-widest py-1">
                            Highly Rated
                        </Badge>)}
                </div>

                <h1 className="text-2xl xs:text-3xl md:text-6xl lg:text-7xl font-bold tracking-[-0.04em] leading-[1.1] md:leading-[0.95] text-balance">
                    {product.name}
                </h1>

                <div className="flex items-center gap-4 pt-1">
                    <div className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5 fill-current text-primary"/>
                        <span className="text-sm font-bold tracking-tight">{product.rating}</span>
                        <span className="text-xs text-muted-foreground/60 font-medium">({product.reviews})</span>
                    </div>
                    <div className="h-1 w-1 rounded-full bg-muted-foreground/20"/>
                    <div className="flex items-center gap-2">
                        <div className={cn("w-2 h-2 rounded-full", product.inStock ? "bg-emerald-500" : "bg-red-500")}/>
                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/80">
                            {product.inStock ? "In Stock" : "Sold Out"}
                        </span>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <p className="text-base md:text-xl text-muted-foreground font-medium leading-relaxed">
                    {product.description}
                </p>
                <div className="flex items-center gap-4">
                    <span className="text-2xl xs:text-3xl md:text-6xl font-bold tracking-tighter">
                        ₹{(product.discountPrice || product.price).toFixed(2)}
                    </span>
                    {product.discountPrice && (<span className="text-lg xs:text-xl text-muted-foreground/40 line-through font-medium tracking-tight">
                            ₹{product.price.toFixed(2)}
                        </span>)}
                </div>
            </div>

            <div className="space-y-4 pt-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-primary">Select Glasses Type</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {lensPackages.map((lens) => (
                        <div 
                            key={lens.id}
                            onClick={() => onLensSelect(lens)}
                            className={cn(
                                "flex flex-col p-4 rounded-2xl border-2 cursor-pointer transition-all",
                                selectedLens.id === lens.id 
                                    ? "border-primary bg-primary/5 shadow-sm scale-[1.02]" 
                                    : "border-border hover:border-primary/30 hover:bg-muted/50"
                            )}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-bold text-sm tracking-tight">{lens.name}</span>
                                {selectedLens.id === lens.id && <Check className="w-4 h-4 text-primary" />}
                            </div>
                            <span className="text-xs text-muted-foreground mb-3">{lens.description}</span>
                            <div className="mt-auto flex flex-col">
                                {lens.price === 0 ? (
                                    <span className="font-black text-sm text-primary">Included</span>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <span className="font-black text-sm text-primary">+₹{(lens.price - (lens.price * (lens.discount/100))).toFixed(2)}</span>
                                        {lens.discount > 0 && (
                                            <span className="text-[10px] text-muted-foreground line-through">₹{lens.price.toFixed(2)}</span>
                                        )}
                                    </div>
                                )}
                                {lens.discount > 0 && (
                                    <span className="text-[10px] font-bold text-emerald-500 mt-1">{lens.discount}% OFF</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Optional Varieties */}
            {(product.frameColor || product.size?.lensWidth || product.lensType) && (<div className="flex flex-wrap gap-2 pt-2">
                    {product.frameColor && (<span className="text-[11px] font-bold uppercase tracking-widest text-primary/80 bg-primary/10 rounded-full px-3 py-1">
                            {product.frameColor}
                        </span>)}
                    {product.size?.lensWidth && (<span className="text-[11px] font-bold uppercase tracking-widest text-primary/80 bg-primary/10 rounded-full px-3 py-1">
                            Size: {product.size.lensWidth}mm
                        </span>)}
                    {product.lensType && (<span className="text-[11px] font-bold uppercase tracking-widest text-primary/80 bg-primary/10 rounded-full px-3 py-1">
                            Power: {product.lensType.replace(/-/g, ' ')}
                        </span>)}
                </div>)}

            {/* Quantity and Cart - Hidden on mobile, visible on desktop */}
            <div className="hidden md:block pt-4">
                <AddToCartButton product={product}/>
            </div>
        </div>);
}
