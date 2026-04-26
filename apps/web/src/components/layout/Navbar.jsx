'use client';
import Link from 'next/link';
import { Search, User, ShoppingCart, X, Eye, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ModeToggle } from '@/components/layout/ModeToggle';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from '@/components/ui/sheet';
import { useGetCartQuery } from '@/store/cartApi';
import { useAppSelector, useAppDispatch } from '@/store/store';
import { selectIsAuthenticated, openAuthDialog, selectCurrentUser } from '@/store/authSlice';
import { useGetWishlistQuery } from '@/store/wishlistApi';
import { useGetTopNavCategoriesQuery } from '@/store/categoryApi';
import { useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, Package, ChevronRight, LogIn } from 'lucide-react';
export function Navbar() {
    const isLoggedIn = useAppSelector(selectIsAuthenticated);
    // Get database wishlist count
    const { data: wishlistData } = useGetWishlistQuery(undefined, { skip: !isLoggedIn });
    const wishlistItemsCount = isLoggedIn ? (wishlistData?.data?.products?.length || 0) : 0;
    // Get database cart count
    const { data: cartData } = useGetCartQuery(undefined, { skip: !isLoggedIn });
    const cartItemsCount = isLoggedIn ? (cartData?.data?.items?.reduce((sum, item) => sum + item.qty, 0) || 0) : 0;
    // Get Top Nav Categories
    const { data: topCategoriesData } = useGetTopNavCategoriesQuery();
    const topCategories = topCategoriesData?.data || [];
    const user = useAppSelector(selectCurrentUser);
    const dispatch = useAppDispatch();
    const openAuth = () => dispatch(openAuthDialog());
    const [mounted, setMounted] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const urlQuery = searchParams.get('q');
    const [searchQuery, setSearchQuery] = useState(urlQuery || '');
    useEffect(() => {
        if (urlQuery !== null && urlQuery !== searchQuery) {
            setSearchQuery(urlQuery);
        }
        else if (urlQuery === null && pathname !== '/search') {
            setSearchQuery('');
        }
    }, [urlQuery, pathname]);
    useEffect(() => {
        setMounted(true);
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
    const handleProfileClick = () => {
        setIsMobileMenuOpen(false);
        if (isLoggedIn) {
            router.push('/profile');
        }
        else {
            openAuth();
        }
    };
    const handleSearchSubmit = (e) => {
        if (e)
            e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };
    return (<header className="fixed top-0 left-0 right-0 z-[100] pointer-events-none lg:px-6">
            {!scrolled && (<div className="absolute inset-0 h-40 bg-gradient-to-b from-black/80 via-black/20 to-transparent pointer-events-none"/>)}
            <div className={cn("container mx-auto max-w-[1600px] flex items-center justify-between h-20 transition-all duration-500 relative px-4 lg:px-0", scrolled && "lg:h-16 lg:mt-2 lg:bg-background/80 lg:backdrop-blur-2xl lg:border lg:border-white/20 lg:dark:border-white/10 lg:rounded-full lg:shadow-[0_8px_32px_rgba(0,0,0,0.1)] lg:px-6", scrolled && "bg-background/95 backdrop-blur-md border-b border-border/10 lg:border-b-0 h-16")}>
                {/* Left Area: Mobile Brand Island / Desktop Nav */}
                <div className="flex items-center gap-8 pointer-events-auto">
                    {/* Mobile Brand Island */}
                    <Link href="/" className="lg:hidden">
                        <div className="flex items-baseline gap-1 px-4 py-2 bg-background/50 backdrop-blur-md border border-white/10 rounded-full shadow-lg">
                            <span className="text-sm font-black uppercase tracking-tighter">Rajul</span>
                            <span className="text-sm font-light uppercase tracking-tighter opacity-40">Eye</span>
                        </div>
                    </Link>

                    {/* Desktop Nav */}
                    <nav className="hidden lg:flex items-center gap-10">
                        {topCategories.length > 0 ? topCategories.map((category) => (<Link key={category.id} href={`/search?category=${category.slug}`} className={cn("text-[10px] font-black uppercase tracking-[0.2em] transition-all relative group", scrolled ? "text-foreground/70 hover:text-foreground" : "text-white/70 hover:text-white")}>
                                {category.name}
                                <span className={cn("absolute -bottom-1 left-0 w-0 h-[1.5px] transition-all duration-300 group-hover:w-full", scrolled ? "bg-foreground" : "bg-white")}/>
                            </Link>)) : (
        // Fallback Skeleton
        ['Loading...', 'Please', 'Wait'].map((item, i) => (<span key={i} className={cn("text-[10px] font-black uppercase tracking-[0.2em] animate-pulse", scrolled ? "text-foreground/40" : "text-white/40")}>
                                    {item}
                                </span>)))}
                    </nav>
                </div>

                {/* Center: Desktop Logo */}
                <Link href="/" className="absolute left-1/2 -translate-x-1/2 hidden lg:flex items-center gap-3 group focus:outline-none pointer-events-auto">
                    <div className="flex items-baseline gap-1.5 select-none transition-all duration-500 group-hover:tracking-normal">
                        <span className={cn("text-xl md:text-3xl font-black uppercase tracking-tighter transition-all duration-500 group-hover:tracking-normal", scrolled ? "text-foreground" : "text-white")}>
                            Rajul
                        </span>
                        <span className={cn("text-xl md:text-3xl font-light uppercase tracking-tighter transition-all duration-500 group-hover:tracking-normal", scrolled ? "text-foreground/50 group-hover:text-foreground/80" : "text-white/50 group-hover:text-white/80")}>
                            Eye
                        </span>
                    </div>
                </Link>

                {/* Right Area: Mobile Menu Island / Desktop Utilities */}
                <div className="flex items-center gap-4 pointer-events-auto">
                    {/* Mobile Menu Island */}
                    <div className="lg:hidden">
                        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className={cn("h-12 w-12 rounded-full backdrop-blur-md border shadow-lg relative group transition-all", scrolled
            ? "bg-primary/10 border-primary/20 hover:bg-primary/20"
            : "bg-background/50 border-white/10 hover:bg-white/10")}>
                                    <div className="flex flex-col gap-1.5 items-center justify-center">
                                        <span className={cn("w-5 h-[2px] rounded-full transition-all group-hover:w-6", scrolled ? "bg-foreground" : "bg-white")}/>
                                        <span className={cn("w-3 h-[2px] rounded-full transition-all group-hover:w-6", scrolled ? "bg-foreground" : "bg-white")}/>
                                    </div>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-full sm:w-[400px] p-0 border-l-none" showCloseButton={false}>
                                <div className="flex flex-col h-full bg-background relative overflow-hidden z-50">
                                    {/* Ambient Glow */}
                                    <div className="absolute -top-20 -left-20 w-80 h-80 bg-primary/20 rounded-full blur-[100px] pointer-events-none -z-10"/>

                                    <div className="p-8 flex items-center justify-between relative z-10">
                                        <div className="flex items-baseline gap-1 select-none">
                                            <span className="text-2xl font-black uppercase tracking-tighter">Rajul</span>
                                            <span className="text-2xl font-light uppercase tracking-tighter opacity-40">Eye</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <ModeToggle />
                                            <SheetClose asChild>
                                                <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full bg-muted/50 hover:bg-primary hover:text-primary-foreground backdrop-blur-md transition-all shadow-sm">
                                                    <X className="h-5 w-5"/>
                                                </Button>
                                            </SheetClose>
                                        </div>
                                    </div>

                                    <nav className="flex-1 px-8 py-8 space-y-2 overflow-y-auto">
                                        <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between p-4 rounded-2xl hover:bg-muted/50 transition-all group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                                    <Home className="w-5 h-5"/>
                                                </div>
                                                <span className="text-xl font-black tracking-tight uppercase">Home</span>
                                            </div>
                                            <ChevronRight className="w-5 h-5 opacity-20 group-hover:opacity-100 group-hover:translate-x-1 transition-all"/>
                                        </Link>

                                        {/* Categories Section (Submenu Style) */}
                                        <div className="space-y-2 pt-4">
                                            <button onClick={() => setIsCategoriesOpen(!isCategoriesOpen)} className="w-full flex items-center justify-between p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-all group">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                                                        <Eye className="w-5 h-5"/>
                                                    </div>
                                                    <span className="text-xl font-black tracking-tight uppercase">Collections</span>
                                                </div>
                                                <ChevronRight className={cn("w-5 h-5 opacity-40 transition-transform duration-300", isCategoriesOpen && "rotate-90 opacity-100")}/>
                                            </button>

                                            {isCategoriesOpen && (<div className="grid grid-cols-1 gap-2 pl-4 animate-in slide-in-from-top-4 duration-300">
                                                    {[
                { name: 'Optical Frames', href: '/search?category=optical' },
                { name: 'Sunglasses', href: '/search?category=sunglasses' },
                { name: 'Blue Light', href: '/search?category=blue-light' },
                { name: 'Heritage Collection', href: '/search?category=designer' }
            ].map((item) => (<Link key={item.href} href={item.href} onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-between p-4 rounded-2xl hover:bg-primary/5 transition-all group">
                                                            <span className="text-sm font-bold uppercase tracking-wider opacity-60 group-hover:opacity-100">{item.name}</span>
                                                            <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-30 translate-x-1"/>
                                                        </Link>))}
                                                </div>)}
                                        </div>

                                        <div className="pt-8 space-y-2">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 ml-4 mb-2">Your Space</p>
                                            <Link href="/profile" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-muted/50 transition-all">
                                                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                                                    <User className="w-5 h-5"/>
                                                </div>
                                                <span className="text-lg font-bold tracking-tight">Profile & Identity</span>
                                            </Link>
                                            <Link href="/profile/orders" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-muted/50 transition-all">
                                                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                                                    <Package className="w-5 h-5"/>
                                                </div>
                                                <span className="text-lg font-bold tracking-tight">Order Archives</span>
                                            </Link>
                                            <Link href="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-muted/50 transition-all">
                                                <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                                                    <Heart className="w-5 h-5"/>
                                                </div>
                                                <span className="text-lg font-bold tracking-tight">Wishlist Gallery</span>
                                            </Link>
                                        </div>
                                    </nav>

                                    <div className="p-8 pb-12 mt-auto">
                                        {isLoggedIn ? (<div className="flex items-center gap-4 p-4 rounded-3xl bg-primary text-primary-foreground shadow-xl">
                                                <div className="w-12 h-12 rounded-2xl overflow-hidden bg-white/20">
                                                    {user?.avatar ? (<img src={user.avatar} alt="" className="w-full h-full object-cover"/>) : (<div className="w-full h-full flex items-center justify-center font-black">
                                                            {user?.name?.[0]}
                                                        </div>)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-black truncate uppercase tracking-tight">{user?.name}</p>
                                                    <p className="text-[10px] opacity-70 uppercase tracking-widest">Verified Member</p>
                                                </div>
                                                <Button variant="ghost" size="icon" onClick={handleProfileClick} className="rounded-full hover:bg-white/20">
                                                    <ChevronRight className="w-5 h-5"/>
                                                </Button>
                                            </div>) : (<Button onClick={() => { setIsMobileMenuOpen(false); openAuth(); }} className="w-full h-16 rounded-[2rem] bg-primary font-black text-sm uppercase tracking-widest shadow-2xl flex items-center justify-center gap-3">
                                                Join Rajul Eye Gallery <LogIn className="w-5 h-5"/>
                                            </Button>)}
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>

                    {/* Desktop Utilities */}
                    <div className="hidden lg:flex items-center gap-4">
                        <div className="flex items-center relative group">
                            <Search className={cn("absolute left-4 h-3.5 w-3.5 transition-colors cursor-pointer", scrolled
            ? "text-foreground/60 group-focus-within:text-foreground"
            : "text-white/60 group-focus-within:text-white")} onClick={() => handleSearchSubmit()}/>
                            <input type="text" placeholder="Find your fit..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => {
            if (e.key === 'Enter')
                handleSearchSubmit(e);
        }} className={cn("h-10 w-48 pl-10 pr-4 rounded-full border text-[11px] font-medium tracking-wide focus:outline-none focus:w-64 transition-all duration-500", scrolled
            ? "border-border bg-muted/50 text-foreground placeholder:text-foreground/40 focus:border-primary/40 focus:bg-background"
            : "border-white/20 bg-black/20 text-white placeholder:text-white/50 focus:border-white/40 focus:bg-black/40")}/>
                        </div>

                        <ModeToggle />


                        <Link href="/wishlist">
                            <div className="relative">
                                <Button variant="ghost" size="icon" className={cn("rounded-full transition-all hover:scale-105 active:scale-95", scrolled ? "text-foreground/80 hover:text-foreground" : "text-white/80 hover:text-white")} asChild>
                                    <span>
                                        <Heart className="h-5 w-5"/>
                                    </span>
                                </Button>
                                {mounted && wishlistItemsCount > 0 && (<span className="absolute top-1.5 right-1.5 min-w-[14px] h-3.5 px-0.5 rounded-full bg-primary text-[7px] font-black text-primary-foreground flex items-center justify-center ring-2 ring-black dark:ring-white">
                                        {wishlistItemsCount}
                                    </span>)}
                            </div>
                        </Link>

                        <Link href="/cart">
                            <Button variant="ghost" size="icon" className={cn("relative rounded-full transition-all hover:scale-105 active:scale-95", scrolled ? "text-foreground/80 hover:text-foreground" : "text-white/80 hover:text-white")}>
                                <ShoppingCart className="h-5 w-5"/>
                                {mounted && cartItemsCount > 0 && (<span className="absolute top-1.5 right-1.5 min-w-[14px] h-3.5 px-0.5 rounded-full bg-primary text-[7px] font-black text-primary-foreground flex items-center justify-center ring-2 ring-black dark:ring-white">
                                        {cartItemsCount}
                                    </span>)}
                            </Button>
                        </Link>

                        <Button variant="ghost" size="icon" className={cn("rounded-full transition-all hover:scale-105 active:scale-95 overflow-hidden", scrolled ? "text-foreground/80 hover:text-foreground" : "text-white/80 hover:text-white")} onClick={handleProfileClick}>
                            {isLoggedIn && user?.avatar ? (<img src={user.avatar} alt={user.name} className="h-full w-full object-cover" onError={(e) => {
                // Fallback if image fails to load
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;
            }}/>) : (<User className="h-5 w-5"/>)}
                        </Button>
                    </div>
                </div>
            </div>
        </header>);
}
