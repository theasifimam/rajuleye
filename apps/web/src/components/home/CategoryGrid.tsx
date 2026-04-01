'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useGetCategoriesQuery } from '@/store/categoryApi';
import { Skeleton } from '@/components/ui/skeleton';

export function CategoryGrid() {
    const { data: result, isLoading } = useGetCategoriesQuery({ isActive: true });
    const allCategories = result?.data || [];

    // Filter mostly the subcategories for eyeglasses that we just added,
    // excluding the root "eyeglasses" category itself if possible.
    // We can just take up to 4 to match the bento grid design.
    const displayCategories = allCategories
        .filter(cat => cat.slug !== 'eyeglasses')
        .slice(0, 4);

    if (isLoading) {
        return (
            <section className="container px-6 md:px-12 mx-auto max-w-[1600px]">
                <div className="flex flex-col mb-10">
                    <Skeleton className="h-4 w-32 mb-2" />
                    <Skeleton className="h-12 w-64 md:w-96" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 h-[800px] md:h-[600px]">
                    <Skeleton className="col-span-2 row-span-2 rounded-3xl md:rounded-[3rem]" />
                    <Skeleton className="col-span-2 md:col-span-1 border rounded-3xl md:rounded-[3rem]" />
                    <Skeleton className="col-span-1 rounded-3xl md:rounded-[3rem]" />
                    <Skeleton className="col-span-1 rounded-3xl md:rounded-[3rem]" />
                </div>
            </section>
        );
    }

    // Fallbacks if not enough categories
    const cat1 = displayCategories[0];
    const cat2 = displayCategories[1];
    const cat3 = displayCategories[2];
    const cat4 = displayCategories[3];

    return (
        <section className="container px-6 md:px-12 mx-auto max-w-[1600px]">
            <div className="flex flex-col mb-10">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground/60 mb-2">Refined Selection</p>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">Architectural Optics</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 h-[800px] md:h-[600px]">
                {/* Main Category */}
                {cat1 && (
                    <Link
                        href={`/search?category=${cat1.id}`}
                        className="group relative col-span-2 row-span-2 overflow-hidden rounded-3xl md:rounded-[3rem] bg-zinc-100 dark:bg-zinc-900 shadow-lg"
                    >
                        <Image
                            src={cat1.image || "https://images.unsplash.com/photo-1542295669297-4d352b042bce?w=800&q=80"}
                            alt={cat1.name}
                            fill
                            className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                            sizes="(max-width: 768px) 100vw, 50vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-6 md:p-10">
                            <div className="space-y-1">
                                <span className="text-[8px] md:text-[10px] font-bold text-white/60 tracking-widest uppercase">Precision Crafted</span>
                                <h3 className="text-2xl md:text-5xl font-black text-white uppercase tracking-tighter">{cat1.name}</h3>
                            </div>
                        </div>
                    </Link>
                )}

                {/* Category 2 */}
                {cat2 && (
                    <Link
                        href={`/search?category=${cat2.id}`}
                        className="group relative col-span-2 md:col-span-1 overflow-hidden rounded-3xl md:rounded-[3rem] bg-zinc-200 dark:bg-zinc-800"
                    >
                        <Image
                            src={cat2.image || 'https://images.unsplash.com/photo-1503443207922-dff7d543fd0e?w=800&q=80'}
                            alt={cat2.name}
                            fill
                            className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                            sizes="(max-width: 768px) 50vw, 25vw"
                        />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors duration-500" />
                        <div className="absolute inset-x-0 bottom-0 p-8">
                            <h3 className="text-xl md:text-2xl font-black text-white uppercase tracking-tight">{cat2.name}</h3>
                        </div>
                    </Link>
                )}

                {/* Category 3 */}
                {cat3 && (
                    <Link
                        href={`/search?category=${cat3.id}`}
                        className="group relative col-span-1 overflow-hidden rounded-3xl md:rounded-[3rem] bg-zinc-300 dark:bg-zinc-700"
                    >
                        <Image
                            src={cat3.image || 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=800&q=80'}
                            alt={cat3.name}
                            fill
                            className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60 group-hover:opacity-100"
                            sizes="(max-width: 768px) 50vw, 25vw"
                        />
                        <div className="absolute inset-0 flex items-center justify-center p-6 bg-black/10">
                            <h3 className="text-lg md:text-xl font-black text-white uppercase text-center tracking-tighter leading-none">{cat3.name}</h3>
                        </div>
                    </Link>
                )}

                {/* Category 4 */}
                {cat4 && (
                    <Link
                        href={`/search?category=${cat4.id}`}
                        className="group relative col-span-1 overflow-hidden rounded-3xl md:rounded-[3rem] bg-black"
                    >
                        <Image
                            src={cat4.image || 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=800&q=80'}
                            alt={cat4.name}
                            fill
                            className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-50 group-hover:opacity-100"
                            sizes="(max-width: 768px) 50vw, 25vw"
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 bg-primary/20 backdrop-blur-[2px]">
                            <Sparkles className="h-6 w-6 text-white mb-2" />
                            <h3 className="text-xl font-black text-white uppercase tracking-widest">{cat4.name}</h3>
                        </div>
                    </Link>
                )}
            </div>
        </section>
    );
}
