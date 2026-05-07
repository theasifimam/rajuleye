'use client';
import * as React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, } from '@/components/ui/carousel';
import { ProductCard } from './ProductCard';
export function ProductSlider({ products, title }) {
    return (<div className="w-full space-y-4">
            {title && (<div className="flex items-center justify-between">
                    <h2 className="text-xl md:text-2xl font-bold tracking-tight">{title}</h2>
                </div>)}
            <Carousel opts={{
            align: "start",
            loop: false,
        }} className="w-full relative group">
                <CarouselContent className="-ml-1.5 md:-ml-4">
                    {products.map((product) => (<CarouselItem key={product.id} className="pl-1.5 md:pl-4 basis-1/2 lg:basis-1/4">
                            <div className="p-0.5 sm:p-1 h-full">
                                <ProductCard product={product}/>
                            </div>
                        </CarouselItem>))}
                </CarouselContent>
                <div className="hidden md:flex absolute top-1/2 -translate-y-1/2 left-4 right-4 justify-between pointer-events-none z-10">
                    <CarouselPrevious className="static translate-x-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto bg-background/80 backdrop-blur-sm border-border/50 shadow-xl"/>
                    <CarouselNext className="static translate-x-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-auto bg-background/80 backdrop-blur-sm border-border/50 shadow-xl"/>
                </div>
            </Carousel>
        </div>);
}
