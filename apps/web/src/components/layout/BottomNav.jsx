'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, ShoppingBag, User, Heart } from 'lucide-react';
import { useGetCartQuery } from '@/store/cartApi';
import { useGetWishlistQuery } from '@/store/wishlistApi';
import { useAppSelector, useAppDispatch } from '@/store/store';
import { selectIsAuthenticated, openAuthDialog, selectCurrentUser } from '@/store/authSlice';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
export function BottomNav() {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const isLoggedIn = useAppSelector(selectIsAuthenticated);
    // Get database wishlist count
    const { data: wishlistData } = useGetWishlistQuery(undefined, { skip: !isLoggedIn });
    const wishlistItemsCount = isLoggedIn ? (wishlistData?.data?.products?.length || 0) : 0;
    // Get database cart count
    const { data: cartData } = useGetCartQuery(undefined, { skip: !isLoggedIn });
    const cartItemsCount = isLoggedIn ? (cartData?.data?.items?.reduce((sum, item) => sum + item.qty, 0) || 0) : 0;
    const user = useAppSelector(selectCurrentUser);
    const openAuth = () => dispatch(openAuthDialog());
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        setMounted(true);
    }, []);
    const handleProfileClick = (e) => {
        e.preventDefault();
        if (isLoggedIn) {
            router.push('/profile');
        }
        else {
            openAuth();
        }
    };
    // Style from user image: Floating pill, subtle icons, one prominent action
    const navItems = [
        { name: 'Home', href: '/', icon: Home },
        { name: 'Search', href: '/search', icon: Search },
        { name: 'Wishlist', href: '/wishlist', icon: Heart, badge: mounted ? wishlistItemsCount : 0 },
        { name: 'Cart', href: '/cart', icon: ShoppingBag, badge: mounted ? cartItemsCount : 0 },
        { name: 'Profile', href: '/profile', icon: User, onClick: handleProfileClick },
    ];
    // Only show on core navigation pages
    const mainRoutes = ['/', '/search', '/cart', '/profile', '/wishlist'];
    const showNav = mainRoutes.includes(pathname);
    if (!showNav)
        return null;
    return (<div className="fixed bottom-6 left-0 right-0 z-[100] flex justify-center px-6 lg:hidden pointer-events-none">
            <div className="pointer-events-auto flex h-16 items-center justify-around gap-1 px-2 bg-black dark:bg-white backdrop-blur-3xl rounded-full border border-white/20 dark:border-black/10 shadow-[0_12px_40px_-12px_rgba(0,0,0,0.3)] w-full max-w-[360px]">
                {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (<Link key={item.href} href={item.href} onClick={item.onClick} className={cn("relative flex flex-col items-center justify-center h-12 flex-1 rounded-full transition-all duration-500", isActive
                    ? "text-primary"
                    : "text-white/60 dark:text-black/60 hover:text-white dark:hover:text-black")}>
                            {/* Active Background Pill */}
                            {isActive && (<div className="absolute inset-x-1 inset-y-1 bg-primary/10 rounded-full -z-10 animate-in fade-in zoom-in duration-500"/>)}

                            <div className="relative">
                                <div className="h-5 w-5 rounded-full overflow-hidden transition-all duration-500">
                                    {item.name === 'Profile' && isLoggedIn && user?.avatar ? (<img src={user.avatar} alt={user.name} className="h-full w-full object-cover" onError={(e) => {
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`;
                    }}/>) : (<Icon className={cn("w-5 h-5 transition-transform duration-500", isActive ? "stroke-[2.5px] scale-110" : "stroke-[1.5px]")}/>)}
                                </div>
                                {item.badge ? (<span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-[7px] font-black min-w-[14px] h-3.5 px-1 rounded-full flex items-center justify-center ring-2 ring-black dark:ring-white shadow-sm z-10 transition-all duration-300">
                                        {item.badge}
                                    </span>) : null}
                            </div>

                            {/* Dot Indicator */}
                            {/* <div className={cn(
                    "w-1 h-1 rounded-full mt-1.5 transition-all duration-500",
                    isActive ? "bg-primary scale-100 opacity-100" : "bg-transparent scale-0 opacity-0"
                )} /> */}
                        </Link>);
        })}
            </div>
        </div>);
}
