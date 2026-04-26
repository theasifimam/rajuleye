'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package, Layers } from 'lucide-react';
import { cn } from '@/lib/utils';
export default function ProductsLayout({ children, }) {
    const pathname = usePathname();
    const tabs = [
        {
            id: 'products',
            label: 'Signature Pieces',
            href: '/products',
            icon: Package,
        },
        {
            id: 'categories',
            label: 'Collection Categories',
            href: '/products/categories',
            icon: Layers,
        },
    ];
    return (<div className="space-y-8 md:space-y-12 pb-10">
            <div className="flex justify-center">
                <div className="bg-card py-2 px-2 border border-primary/10 rounded-[2rem] shadow-xs backdrop-blur-md flex items-center gap-1">
                    {tabs.map((tab) => {
            const isActive = pathname === tab.href;
            const Icon = tab.icon;
            return (<Link key={tab.id} href={tab.href} className={cn("rounded-[1.5rem] px-10 py-4 text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 flex items-center gap-2", isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "text-muted-foreground hover:text-foreground hover:bg-primary/5")}>
                                <Icon className="h-4 w-4"/>
                                {tab.label}
                            </Link>);
        })}
                </div>
            </div>
            {children}
        </div>);
}
