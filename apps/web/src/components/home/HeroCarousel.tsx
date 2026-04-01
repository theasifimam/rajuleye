'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
    Carousel,
    CarouselContent,
    CarouselItem,
} from '@/components/ui/carousel';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Autoplay from 'embla-carousel-autoplay';
import { cn } from '@/lib/utils';
import { useGetBannersQuery } from '@/store/bannerApi';
import { Skeleton } from '@/components/ui/skeleton';

export function HeroCarousel() {
    const { data: result, isLoading } = useGetBannersQuery({ status: 'Active', placement: 'Hero Slider' });
    const banners = result?.data || [];

    const [api, setApi] = React.useState<any>();
    const [current, setCurrent] = React.useState(0);

    const plugin = React.useRef(
        Autoplay({ delay: 5000, stopOnInteraction: true })
    );

    React.useEffect(() => {
        if (!api) return;

        setCurrent(api.selectedScrollSnap());
        api.on("select", () => {
            setCurrent(api.selectedScrollSnap());
        });
    }, [api]);

    return (
        <div className="relative w-full mt-[-112px] lg:mt-[-128px]">
            <Carousel
                setApi={setApi}
                plugins={[plugin.current]}
                className="w-full"
                onMouseEnter={plugin.current.stop}
                onMouseLeave={plugin.current.reset}
            >
                <CarouselContent>
                    {isLoading ? (
                        <CarouselItem>
                            <section className="relative w-full h-[600px] md:h-[850px] bg-muted overflow-hidden">
                                <Skeleton className="h-full w-full" />
                            </section>
                        </CarouselItem>
                    ) : banners.length > 0 ? (
                        banners.map((slide, index) => (
                            <CarouselItem key={slide.id || index}>
                                <section className="relative w-full h-[600px] md:h-[850px] bg-muted overflow-hidden">
                                    <Image
                                        src={slide.image.startsWith('http') ? slide.image : slide.image.startsWith('/') ? slide.image : `/${slide.image}`}
                                        alt={slide.title}
                                        fill
                                        priority={index === 0}
                                        className="object-cover"
                                    />
                                    <div className={cn("absolute inset-0 bg-gradient-to-r flex items-center pt-20 md:pt-32 from-black/80 via-black/40 to-transparent")}>
                                        <div className="container px-6 md:px-12 mx-auto max-w-[1600px]">
                                            <div className="max-w-2xl space-y-6 text-white animate-in fade-in slide-in-from-left-8 duration-1000">
                                                {slide.label && (
                                                    <div className="inline-block py-1.5 px-4 rounded-full bg-white/10 backdrop-blur-xl border border-white/10 text-[10px] font-black uppercase tracking-[0.3em] mb-4">
                                                        {slide.label}
                                                    </div>
                                                )}
                                                <h1 className="text-5xl md:text-9xl font-black tracking-tighter leading-[0.85] uppercase">
                                                    {slide.title}
                                                </h1>
                                                <p className="text-lg md:text-2xl text-white/70 max-w-lg font-medium tracking-tight leading-relaxed">
                                                    {slide.description}
                                                </p>
                                                {slide.buttonLink && (
                                                    <div className="pt-6 flex gap-4">
                                                        <Button size="lg" className="rounded-full px-10 h-14 md:h-16 font-black text-xs uppercase tracking-[0.2em] bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xl hover:scale-105 transition-all border-none" asChild>
                                                            <Link href={slide.buttonLink}>
                                                                Explore <ArrowRight className="ml-3 h-5 w-5" />
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </section>
                            </CarouselItem>
                        ))
                    ) : (
                        <CarouselItem>
                            <section className="relative w-full h-[600px] md:h-[850px] bg-muted overflow-hidden flex items-center justify-center">
                                <div className="absolute inset-0 bg-gradient-to-b from-background/20 to-background/80 flex items-center justify-center">
                                    <div className="text-center space-y-6 max-w-2xl px-6 animate-in fade-in zoom-in duration-700">
                                        <div className="inline-block py-1.5 px-4 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-[0.3em] text-primary mb-2">
                                            Admin Action Required
                                        </div>
                                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-foreground">
                                            No Campaigns Active
                                        </h2>
                                        <p className="text-lg md:text-xl text-muted-foreground font-medium">
                                            The marketing visually is currently unpopulated. Please launch a campaign from the Command Center to display it here.
                                        </p>
                                        <div className="pt-8">
                                            <Button size="lg" className="rounded-full px-10 h-14 md:h-16 font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:scale-105 transition-all" asChild>
                                                <a href="http://localhost:3001/banners" target="_blank" rel="noopener noreferrer">
                                                    Open Admin Panel <ArrowRight className="ml-3 h-5 w-5" />
                                                </a>
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </section>
                        </CarouselItem>
                    )}
                </CarouselContent>
            </Carousel>

            {/* Pagination */}
            <div className="absolute bottom-10 left-12 flex gap-4 z-20">
                {(banners.length > 0 ? banners : [1]).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => api?.scrollTo(index)}
                        className={cn(
                            "h-1 transition-all duration-700 rounded-full",
                            current === index ? "w-16 bg-primary" : "w-4 bg-white/20 hover:bg-white/40"
                        )}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
}
