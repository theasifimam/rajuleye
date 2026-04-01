/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useEffect, useState } from 'react';
import { Search, Bell, User, Sun, Moon } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { selectCurrentUser, clearCredentials } from '@/store/authSlice';
import { useLogoutMutation } from '@/store/authApi';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import dynamic from 'next/dynamic';
const LogoutConfirmDialog = dynamic(() => import('@/components/admin/LogoutConfirmDialog').then(mod => mod.LogoutConfirmDialog), { ssr: false });
import { Settings, Shield } from 'lucide-react';

export function Topbar() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const user = useAppSelector(selectCurrentUser);
    const dispatch = useAppDispatch();
    const [logout] = useLogoutMutation();
    const router = useRouter();
    const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

    const handleLogout = async () => {
        try {
            await logout().unwrap();
        } catch { /* ignore */ }
        dispatch(clearCredentials());
        toast.info("Session terminated.");
        router.push('/login');
    };

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="h-20 bg-background/80 backdrop-blur-xl border-b sticky top-0 z-40 px-4 md:px-8 flex items-center justify-between transition-colors duration-500 gap-4">
            <div className="flex items-center gap-2 md:gap-4 flex-1 max-w-xl group relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors z-10" />
                <Input
                    type="text"
                    placeholder="Search..."
                    className="w-full h-11 md:h-12 bg-muted/50 border-none rounded-2xl pl-12 pr-4 text-[13px] md:text-sm font-bold focus-visible:ring-2 focus-visible:ring-primary/20 transition-all outline-none"
                />
            </div>

            <div className="flex items-center gap-2 md:gap-4">
                {/* Theme Toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                    className="h-11 w-11 md:h-12 md:w-12 rounded-2xl hover:bg-primary/5 transition-colors group relative shrink-0"
                >
                    {mounted && (
                        theme === 'dark' ? (
                            <Sun className="h-4 w-4 md:h-5 md:w-5 text-primary group-hover:rotate-45 transition-transform" />
                        ) : (
                            <Moon className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground group-hover:-rotate-12 transition-transform" />
                        )
                    )}
                </Button>

                <Button variant="ghost" size="icon" className="h-11 w-11 md:h-12 md:w-12 rounded-2xl hover:bg-primary/5 transition-colors relative shrink-0">
                    <Bell className="h-4 w-4 md:h-5 md:w-5 text-muted-foreground" />
                    <span className="absolute top-2.5 right-2.5 md:top-3 md:right-3 h-2 w-2 bg-destructive rounded-full border-2 border-background" />
                </Button>

                <div className="h-6 w-[1px] bg-border/50 mx-1 md:mx-2 hidden xs:block" />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <div className="flex items-center gap-2 md:gap-3 pl-1 md:pl-2 group shrink-0 cursor-pointer">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-black uppercase tracking-widest leading-none mb-1 text-foreground group-hover:text-primary transition-colors">{user?.name || 'Admin User'}</p>
                                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{user?.role || 'Access Denied'}</p>
                            </div>
                            <div className="h-11 w-11 md:h-12 md:w-12 rounded-2xl bg-primary/20 p-[1.5px] md:p-[2px] flex items-center justify-center transition-all group-hover:bg-primary/30 overflow-hidden ring-2 ring-transparent group-hover:ring-primary/20">
                                <div className="h-full w-full rounded-[0.8rem] md:rounded-[0.9rem] bg-card border-2 border-primary/50 flex items-center justify-center overflow-hidden shadow-[inset_0_0_10px_rgba(34,197,94,0.1)]">
                                    {user?.avatar ? (
                                        <img src={user.avatar} alt={user.name} className="h-full w-full object-cover" />
                                    ) : (
                                        <User className="h-5 w-5 md:h-6 md:w-6 text-primary" />
                                    )}
                                </div>
                            </div>
                        </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56" align="end">
                        <DropdownMenuLabel>Control Center</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => router.push('/settings')}>
                            <Settings className="mr-3 h-4 w-4 text-muted-foreground" />
                            Security Settings
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push('/profile')}>
                            <Shield className="mr-3 h-4 w-4 text-muted-foreground" />
                            Admin Profile
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => setIsLogoutDialogOpen(true)}
                            className="text-destructive focus:bg-destructive focus:text-white"
                        >
                            <LogOut className="mr-3 h-4 w-4" />
                            Terminate Session
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <LogoutConfirmDialog
                    isOpen={isLogoutDialogOpen}
                    onOpenChange={setIsLogoutDialogOpen}
                    onConfirm={handleLogout}
                />
            </div>
        </div>
    );
}
