"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGetFramesQuery } from "@/store/frameApi";
import { useAddToCartMutation } from "@/store/cartApi";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Check, ArrowLeft, Loader2 } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const PLANE_GLASS = {
  id: "plane",
  name: "Plane Glass",
  description: "Standard clear glass",
  price: 0,
  discount: 0,
};

export function SelectLensClient({ product }) {
  const router = useRouter();
  const { data: framesResponse, isLoading: framesLoading } = useGetFramesQuery();
  const dbFrames = framesResponse?.data || [];

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
  const [addToCartMutation] = useAddToCartMutation();
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async () => {
    setIsAdding(true);
    try {
      const payload = {
        product,
        qty: 1,
        lensType: selectedLens.name,
        frameId: selectedLens.id !== "plane" ? selectedLens.id : null,
        frameName: selectedLens.name,
        framePrice: selectedLens.price,
        isPlaneGlass: selectedLens.id === "plane",
      };
      await addToCartMutation(payload).unwrap();
      toast.success("Added to Cart with selected lens!");
      router.push("/cart");
    } catch (error) {
      toast.error("Failed to add to cart");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-6 md:py-12 max-w-4xl">
      <Button variant="ghost" onClick={() => router.back()} className="mb-6 gap-2">
        <ArrowLeft className="h-4 w-4" /> Back to Product
      </Button>

      <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
        <div className="relative w-full md:w-48 h-48 rounded-2xl overflow-hidden bg-muted border">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 mb-1">Step 2: Select Lens</p>
          <h1 className="text-3xl font-black uppercase tracking-tighter mb-2">{product.name}</h1>
          <p className="text-sm text-muted-foreground">{product.description}</p>
          <p className="text-xl font-bold mt-2">₹{product.price?.toFixed(2)}</p>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h2 className="text-xl font-black uppercase tracking-tight mb-2">Select Lens Type</h2>
          <p className="text-sm text-muted-foreground mb-4">Choose the lens that fits your needs.</p>
        </div>

        {framesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Skeleton className="h-[150px] rounded-2xl" />
            <Skeleton className="h-[150px] rounded-2xl" />
            <Skeleton className="h-[150px] rounded-2xl" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {lensPackages.map((lens) => (
              <div
                key={lens.id}
                onClick={() => setSelectedLens(lens)}
                className={cn(
                  "flex flex-col p-6 rounded-2xl border-2 cursor-pointer transition-all",
                  selectedLens.id === lens.id
                    ? "border-primary bg-primary/5 shadow-lg scale-[1.02]"
                    : "border-border hover:border-primary/30 hover:bg-muted/50"
                )}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-base tracking-tight">
                    {lens.name}
                  </span>
                  {selectedLens.id === lens.id && (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                </div>
                <span className="text-xs text-muted-foreground mb-4">
                  {lens.description}
                </span>
                <div className="mt-auto flex flex-col">
                  {lens.price === 0 ? (
                    <span className="font-black text-sm text-primary">
                      Included
                    </span>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="font-black text-base text-primary">
                        +₹
                        {(
                          lens.price -
                          lens.price * (lens.discount / 100)
                        ).toFixed(2)}
                      </span>
                      {lens.discount > 0 && (
                        <span className="text-xs text-muted-foreground line-through">
                          ₹{lens.price.toFixed(2)}
                        </span>
                      )}
                    </div>
                  )}
                  {lens.discount > 0 && (
                    <span className="text-[10px] font-bold text-emerald-500 mt-1">
                      {lens.discount}% OFF
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-12 flex flex-col md:flex-row justify-between items-center bg-muted/50 p-6 rounded-3xl border">
        <div className="mb-4 md:mb-0">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 mb-1">Total Estimate</p>
          <p className="text-2xl font-black">
            ₹{(product.price + (selectedLens.price - (selectedLens.price * (selectedLens.discount / 100)))).toFixed(2)}
          </p>
        </div>
        <Button
          onClick={handleAddToCart}
          disabled={isAdding}
          size="lg"
          className="w-full md:w-auto h-14 rounded-full px-10 font-bold uppercase tracking-widest text-xs"
        >
          {isAdding ? <Loader2 className="w-4 h-4 animate-spin" /> : "Proceed to Cart"}
        </Button>
      </div>
    </div>
  );
}
