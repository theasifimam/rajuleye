"use client";
import * as React from "react";
import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

export function ProductImageCarousel({ images, name }) {
  const [api, setApi] = React.useState();
  const [current, setCurrent] = React.useState(0);
  React.useEffect(() => {
    if (!api) {
      return;
    }
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);
  const scrollTo = (index) => {
    api?.scrollTo(index);
  };
  const validImages =
    images?.filter(
      (img) => img && typeof img === "string" && img.trim() !== "",
    ) || [];
  const displayImages =
    validImages.length > 0
      ? validImages.map((img) =>
          img.startsWith("http") ||
          img.startsWith("/") ||
          img.startsWith("data:")
            ? img
            : `/${img}`,
        )
      : [
          `data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='800' viewBox='0 0 800 800'%3E%3Crect fill='%23f1f5f9' width='800' height='800'/%3E%3Ctext fill='%2394a3b8' font-family='sans-serif' font-size='30' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3EImage 1 Pending%3C/text%3E%3C/svg%3E`,
          `data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='800' viewBox='0 0 800 800'%3E%3Crect fill='%23f1f5f9' width='800' height='800'/%3E%3Ctext fill='%2394a3b8' font-family='sans-serif' font-size='30' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3EImage 2 Pending%3C/text%3E%3C/svg%3E`,
          `data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='800' viewBox='0 0 800 800'%3E%3Crect fill='%23f1f5f9' width='800' height='800'/%3E%3Ctext fill='%2394a3b8' font-family='sans-serif' font-size='30' font-weight='bold' x='50%25' y='50%25' text-anchor='middle'%3EImage 3 Pending%3C/text%3E%3C/svg%3E`,
        ];
  return (
    <div className="relative w-full group">
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent>
          {displayImages.map((image, index) => (
            <CarouselItem key={index}>
              <div className="relative aspect-square w-full md:rounded-[2.5rem] rounded-none overflow-hidden bg-muted transition-all duration-300">
                <Image
                  src={image}
                  alt={`${name} - Image ${index + 1}`}
                  fill
                  priority={index === 0}
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {displayImages.length > 1 && (
          <>
            <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <CarouselPrevious className="static translate-x-0 h-12 w-12 border-white/20 bg-black/20 hover:bg-black/40 text-white shadow-2xl backdrop-blur-md pointer-events-auto rounded-full transition-all hover:scale-110" />
              <CarouselNext className="static translate-x-0 h-12 w-12 border-white/20 bg-black/20 hover:bg-black/40 text-white shadow-2xl backdrop-blur-md pointer-events-auto rounded-full transition-all hover:scale-110" />
            </div>
          </>
        )}

        {/* Thumbnails / Indicators overlayed on the carousel */}
        {displayImages.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 justify-center max-w-[90%] px-2 py-2 rounded-2xl bg-black/10 backdrop-blur-md border border-white/10 overflow-x-auto scrollbar-hide">
            {displayImages.map((image, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={cn(
                  "relative w-12 h-12 sm:w-16 sm:h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 active:scale-95",
                  current === index
                    ? "border-primary shadow-lg scale-105"
                    : "border-white/20 grayscale-0 opacity-70 hover:opacity-100"
                )}
              >
                <Image
                  src={image}
                  alt={`${name} thumb ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="64px"
                />
              </button>
            ))}
          </div>
        )}
      </Carousel>
    </div>
  );
}
