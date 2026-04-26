'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Users, Package, Settings, ChevronRight, BarChart3, Image as ImageIcon, ChevronLeft, Sparkles, LifeBuoy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { useConfigStore } from '@/store/useConfigStore';
import { useState } from 'react';
const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', href: '/' },
    { icon: Package, label: 'Products', href: '/products' },
    { icon: ShoppingBag, label: 'Orders', href: '/orders' },
    { icon: Users, label: 'Customers', href: '/customers' },
    { icon: ImageIcon, label: 'Banners', href: '/banners' },
    { icon: BarChart3, label: 'Analytics', href: '/analytics' },
    {
        icon: Settings,
        label: 'Settings',
        href: '/settings',
        subItems: [
            { label: 'Boutique Profile', href: '/settings/profile' },
            { label: 'Administrative ID', href: '/settings/admin-id' },
            { label: 'Security Fortress', href: '/settings/security' },
            { label: 'Alert Protocols', href: '/settings/alerts' },
            { label: 'Payment Engines', href: '/settings/payments' },
            { label: 'Global Localization', href: '/settings/localization' },
        ]
    },
];
export function Sidebar() {
    const pathname = usePathname();
    const { isSidebarCollapsed, toggleSidebar } = useConfigStore();
    const [expandedMenus, setExpandedMenus] = useState([]);
    const toggleMenu = (label) => {
        setExpandedMenus(prev => prev.includes(label)
            ? prev.filter(l => l !== label)
            : [...prev, label]);
    };
    return (<>
            {/* Desktop Sidebar */}
            <motion.div initial={false} animate={{ width: isSidebarCollapsed ? 80 : 240 }} transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }} className="hidden md:flex h-screen bg-card/80 backdrop-blur-xl border-r flex flex-col sticky top-0 z-[50] relative group/sidebar">
                {/* Sidebar Toggle Button */}
                <button onClick={toggleSidebar} className={cn("absolute -right-4 top-20 h-8 w-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(34,197,94,0.3)] border-4 border-background z-[100] hover:scale-110 active:scale-90 transition-all duration-300 group/toggle", isSidebarCollapsed ? "opacity-100" : "opacity-0 group-hover/sidebar:opacity-100")}>
                    <ChevronLeft className={cn("h-4 w-4 transition-transform duration-500", isSidebarCollapsed && "rotate-180")}/>
                </button>

                {/* Glow Effect Background */}
                <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none"/>

                {/* Logo Section */}
                <div className={cn("p-6 mb-6 transition-all duration-500 relative", isSidebarCollapsed ? "px-4" : "px-6")}>
                    <div className="flex items-center gap-4">
                        <div className="relative shrink-0">
                            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full scale-150 animate-pulse"/>
                            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/20 relative z-10">
                                <div className="h-6 w-6 rounded-full border-[3px] border-primary-foreground/30 flex items-center justify-center">
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary-foreground shadow-[0_0_8px_white]"/>
                                </div>
                            </div>
                        </div>
                        {!isSidebarCollapsed && (<motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.4 }} className="relative">
                                <h1 className="text-2xl font-black tracking-tighter leading-none uppercase">Rajul<span className="text-primary italic">Eye</span></h1>
                                <div className="flex items-center gap-1.5 mt-1">
                                    <Sparkles className="h-2.5 w-2.5 text-primary"/>
                                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-60">Signature</p>
                                </div>
                            </motion.div>)}
                    </div>
                </div>

                {/* Navigation - Scrollable Area */}
                <div className="flex-1 px-4 py-2 space-y-2 overflow-y-auto scrollbar-none relative z-10 transition-all duration-500">
                    {menuItems.map((item) => {
            const isExpanded = expandedMenus.includes(item.label);
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isActive = pathname === item.href || (hasSubItems && pathname.startsWith(item.href));
            return (<div key={item.label} className="space-y-1">
                                <Link href={hasSubItems ? '#' : item.href} onClick={(e) => {
                    if (hasSubItems) {
                        e.preventDefault();
                        toggleMenu(item.label);
                    }
                }} className={cn("group flex items-center py-2 px-4 rounded-[1.25rem] transition-all duration-500 relative overflow-hidden", isActive
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "text-muted-foreground hover:bg-muted/80", isSidebarCollapsed && "justify-center px-0")}>
                                    {/* Highlight Background for Inactive */}
                                    {!isActive && (<div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"/>)}

                                    <div className={cn("flex items-center justify-center gap-4 relative z-10 w-full", isSidebarCollapsed && "gap-0")}>
                                        <div className={cn("p-2 rounded-xl transition-all duration-500", isActive ? "bg-white/20" : "bg-muted group-hover:bg-primary/5 group-hover:text-primary")}>
                                            <item.icon className={cn("h-5 w-5 shrink-0", isActive ? "scale-110" : "group-hover:scale-110")}/>
                                        </div>

                                        <AnimatePresence>
                                            {!isSidebarCollapsed && (<motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.3 }} className="flex items-center justify-between flex-1">
                                                    <span className="text-[13px] font-black uppercase tracking-[0.15em] whitespace-nowrap">
                                                        {item.label}
                                                    </span>
                                                    {hasSubItems && (<ChevronRight className={cn("h-4 w-4 transition-transform duration-300 opacity-60", isExpanded && "rotate-90")}/>)}
                                                </motion.div>)}
                                        </AnimatePresence>
                                    </div>

                                    {!isSidebarCollapsed && isActive && !hasSubItems && (<motion.div layoutId="sidebarActive" className="absolute right-4 h-1.5 w-1.5 rounded-full bg-white shadow-[0_0_10px_white]"/>)}

                                    {isSidebarCollapsed && (<div className="fixed left-[100px] px-4 py-2.5 bg-card/90 backdrop-blur-md text-foreground rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 translate-x-[-15px] group-hover:translate-x-0 transition-all pointer-events-none shadow-md border border-primary/20 z-[200] whitespace-nowrap">
                                            <div className="flex items-center gap-2">
                                                <div className="h-1.5 w-1.5 rounded-full bg-primary"/>
                                                {item.label}
                                            </div>
                                        </div>)}
                                </Link>

                                {/* Submenu Items */}
                                <AnimatePresence>
                                    {hasSubItems && isExpanded && !isSidebarCollapsed && (<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }} className="overflow-hidden bg-primary/[0.02] rounded-[1.25rem] border border-primary/5 ml-4">
                                            <div className="py-1 px-2 space-y-1">
                                                {item.subItems.map((subItem) => {
                        const isSubActive = pathname === subItem.href;
                        return (<Link key={subItem.href} href={subItem.href} className={cn("flex items-center gap-3 py-2.5 px-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300", isSubActive
                                ? "text-primary bg-primary/10 shadow-sm"
                                : "text-muted-foreground hover:text-foreground hover:bg-muted/50")}>
                                                            <div className={cn("h-1.5 w-1.5 rounded-full transition-all duration-500", isSubActive ? "bg-primary scale-125 shadow-[0_0_8px_rgba(34,197,94,0.5)]" : "bg-muted-foreground/30")}/>
                                                            {subItem.label}
                                                        </Link>);
                    })}
                                            </div>
                                        </motion.div>)}
                                </AnimatePresence>
                            </div>);
        })}
                </div>

                {/* Help / Support Replacement for Logout */}
                <div className="p-6 mt-auto relative z-10">
                    <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"/>
                    <Link href="/support" className={cn("group flex items-center py-2 px-4 rounded-[1.25rem] transition-all duration-500 relative overflow-hidden", pathname === '/support'
            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
            : "text-muted-foreground hover:bg-muted/80", isSidebarCollapsed && "justify-center px-0")}>
                        {pathname !== '/support' && (<div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"/>)}

                        <div className={cn("flex items-center gap-4 relative z-10 w-full", isSidebarCollapsed && "gap-0")}>
                            <div className={cn("p-2 rounded-xl transition-all duration-500", pathname === '/support' ? "bg-white/20" : "bg-muted group-hover:bg-primary/5 group-hover:text-primary")}>
                                <LifeBuoy className={cn("h-5 w-5 shrink-0 transition-all duration-500", pathname === '/support' ? "scale-110" : "group-hover:rotate-12")}/>
                            </div>

                            <AnimatePresence>
                                {!isSidebarCollapsed && (<motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.3 }} className="flex flex-col">
                                        <span className="text-[13px] font-black uppercase tracking-[0.15em] whitespace-nowrap">Help Center</span>
                                        <span className="text-[9px] font-bold text-muted-foreground/60 uppercase tracking-widest mt-0.5 whitespace-nowrap">System Support</span>
                                    </motion.div>)}
                            </AnimatePresence>
                        </div>

                        {isSidebarCollapsed && (<div className="fixed left-[100px] px-4 py-2.5 bg-card/90 backdrop-blur-md text-foreground rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 translate-x-[-15px] group-hover:translate-x-0 transition-all pointer-events-none shadow-md border border-primary/20 z-[200] whitespace-nowrap">
                                Support Center
                            </div>)}
                    </Link>
                </div>
            </motion.div>

            {/* Mobile Bottom Navigation - Enhanced Spacing and Horizontal Scroll */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-card/80 backdrop-blur-xl border-t z-[100] flex items-center overflow-x-auto scrollbar-hide px-4 gap-2">
                {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (<Link key={item.href} href={item.href} className={cn("flex flex-col items-center justify-center min-w-[56px] py-2 rounded-xl transition-all duration-300 relative shrink-0", isActive ? "text-primary" : "text-muted-foreground")}>
                            <div className={cn("p-2 rounded-xl transition-all duration-300", isActive ? "bg-primary/20 scale-110 shadow-lg shadow-primary/10" : "hover:bg-muted")}>
                                <item.icon className={cn("h-5 w-5", isActive && "text-primary")}/>
                            </div>
                            <span className={cn("text-[9px] font-black uppercase tracking-widest mt-1.5 transition-all duration-300", isActive ? "opacity-100 translate-y-0" : "opacity-60 translate-y-0.5")}>
                                {item.label}
                            </span>
                            {isActive && (<motion.div layoutId="mobileNavActive" className="absolute -top-1 left-1/2 -translate-x-1/2 h-1 w-4 bg-primary rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)]"/>)}
                        </Link>);
        })}
            </div>
        </>);
}
