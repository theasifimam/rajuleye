'use client';
import React from 'react';
import { LifeBuoy, BookOpen, MessageCircle, ShieldCheck, Zap, ArrowRight, ZapIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
const supportCategories = [
    {
        icon: BookOpen,
        title: "Documentation",
        description: "Comprehensive guides on managing your boutique, products, and advanced settings.",
        action: "View Docs",
        color: "text-blue-500",
        bg: "bg-blue-500/10"
    },
    {
        icon: MessageCircle,
        title: "Priority Support",
        description: "Direct line to our administrative specialists for immediate technical assistance.",
        action: "Open Ticket",
        color: "text-primary",
        bg: "bg-primary/10"
    },
    {
        icon: ShieldCheck,
        title: "Security Protocols",
        description: "Review and manage your administrative access logs and security fortress settings.",
        action: "Audit Logs",
        color: "text-emerald-500",
        bg: "bg-emerald-500/10"
    },
    {
        icon: Zap,
        title: "System Status",
        description: "Real-time updates on global boutique synchronization and engine performance.",
        action: "Check Status",
        color: "text-amber-500",
        bg: "bg-amber-500/10"
    }
];
export default function SupportPage() {
    return (<div className="p-8 max-w-7xl mx-auto space-y-12">
            {/* Header Section */}
            <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-primary/10 via-transparent to-transparent blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"/>
                <div className="relative flex items-center gap-6">
                    <div className="h-20 w-20 rounded-3xl bg-primary/10 flex items-center justify-center border border-primary/20 shadow-2xl shadow-primary/5">
                        <LifeBuoy className="h-10 w-10 text-primary animate-pulse"/>
                    </div>
                    <div>
                        <h1 className="text-4xl font-black tracking-tighter uppercase italic flex items-center gap-4">
                            Help Center
                            <span className="h-2 w-2 rounded-full bg-primary animate-ping"/>
                        </h1>
                        <p className="text-muted-foreground font-medium tracking-wide uppercase text-xs mt-2 flex items-center gap-2">
                            <span className="h-px w-8 bg-primary/30"/>
                            Administrative Matrix Support & Documentation
                        </p>
                    </div>
                </div>
            </div>

            {/* Support Hero Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {supportCategories.map((category, index) => (<motion.div key={category.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="group relative bg-card/40 backdrop-blur-xl border border-border/50 rounded-[2rem] p-8 hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5 flex flex-col">
                        <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3", category.bg)}>
                            <category.icon className={cn("h-7 w-7", category.color)}/>
                        </div>
                        <h3 className="text-lg font-black uppercase tracking-tight mb-2 italic">{category.title}</h3>
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed mb-8 opacity-80 group-hover:opacity-100 transition-opacity flex-1">
                            {category.description}
                        </p>
                        <Button variant="ghost" className="w-full justify-between rounded-xl font-black uppercase tracking-widest text-[10px] group/btn hover:bg-primary hover:text-white transition-all duration-500">
                            {category.action}
                            <ArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-1"/>
                        </Button>
                    </motion.div>))}
            </div>

            {/* Extended Support Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
                <div className="lg:col-span-2 bg-gradient-to-br from-primary/5 to-transparent rounded-[2.5rem] border border-primary/10 p-10 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <LifeBuoy className="h-32 w-32 -rotate-12"/>
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-2xl font-black uppercase italic tracking-tighter mb-4">Urgent Administrative Assistance</h2>
                        <p className="text-muted-foreground text-sm font-medium leading-loose max-w-lg mb-8 uppercase tracking-wide">
                            For critical system failures or high-priority security concerns, our specialist team is available 24/7 to ensure your boutique operations remain seamless and secure.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Button className="rounded-2xl px-8 h-12 font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-primary/20">
                                Contact Specialist
                            </Button>
                            <Button variant="outline" className="rounded-2xl px-8 h-12 font-black uppercase tracking-[0.2em] text-xs border-primary/20 hover:bg-primary/5">
                                System Guide
                            </Button>
                        </div>
                    </div>
                </div>

                <div className="bg-card/40 backdrop-blur-xl border border-border/50 rounded-[2.5rem] p-10 flex flex-col justify-center text-center group">
                    <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-500">
                        <ShieldCheck className="h-8 w-8 text-primary"/>
                    </div>
                    <h2 className="text-xl font-black uppercase italic tracking-tight mb-4 text-primary">Signature Security</h2>
                    <p className="text-muted-foreground text-[10px] font-black uppercase tracking-widest leading-loose mb-8">
                        Every support interaction is encrypted and logged in your administrative matrix for total transparency.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-primary font-black uppercase tracking-widest text-[10px]">
                        <ZapIcon className="h-3 w-3"/>
                        Signature Secured
                    </div>
                </div>
            </div>
        </div>);
}
// Simple Helper for class names since I used it inside the component
function cn(...classes) {
    return classes.filter(Boolean).join(' ');
}
