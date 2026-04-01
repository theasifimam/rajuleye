'use client';

import { useAppSelector, useAppDispatch } from '@/store/store';
import { selectCurrentUser, selectIsAuthenticated, clearCredentials, updateUser } from '@/store/authSlice';
import { useLogoutMutation, useGetProfileQuery } from '@/store/authApi';
import { useGetMyOrdersQuery } from '@/store/orderApi';
import { Button } from '@/components/ui/button';
import { User, LogOut, Package, CreditCard, Settings, MapPin, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { UpdateProfileDialog } from '@/components/profile/UpdateProfileDialog';
import { AddressDialog } from '@/components/profile/AddressDialog';
import { OrdersDialog } from '@/components/profile/OrdersDialog';
import { PaymentsDialog } from '@/components/profile/PaymentsDialog';
import { EyePowerDialog } from '@/components/profile/EyePowerDialog';
import { LogoutConfirmDialog } from '@/components/profile/LogoutConfirmDialog';
import { DeleteAccountDialog } from '@/components/profile/DeleteAccountDialog';
import { Glasses } from 'lucide-react';

export default function ProfilePage() {
    const user = useAppSelector(selectCurrentUser);
    const isLoggedIn = useAppSelector(selectIsAuthenticated);
    const { data: profileData } = useGetProfileQuery(undefined, { skip: !isLoggedIn });
    const { data: ordersData } = useGetMyOrdersQuery({}, { skip: !isLoggedIn });
    const dispatch = useAppDispatch();
    const [logoutApi] = useLogoutMutation();
    const router = useRouter();
    const [isUpdateOpen, setIsUpdateOpen] = useState(false);
    const [isAddressOpen, setIsAddressOpen] = useState(false);
    const [isOrdersOpen, setIsOrdersOpen] = useState(false);
    const [isPaymentsOpen, setIsPaymentsOpen] = useState(false);
    const [isEyePowerOpen, setIsEyePowerOpen] = useState(false);
    const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
    const [isDeleteAccountOpen, setIsDeleteAccountOpen] = useState(false);
    const [deletionStep, setDeletionStep] = useState<'warn' | 'otp'>('warn');

    useEffect(() => {
        if (!isLoggedIn) {
            router.push('/');
        }
    }, [isLoggedIn, router]);

    useEffect(() => {
        if (profileData?.success && profileData.data) {
            dispatch(updateUser(profileData.data));
        }
    }, [profileData, dispatch]);

    const handleLogout = useCallback(() => {
        setIsLogoutConfirmOpen(true);
    }, []);

    const confirmLogout = useCallback(async () => {
        setIsLogoutConfirmOpen(false);
        try {
            await logoutApi().unwrap();
        } catch { /* ignore */ }
        dispatch(clearCredentials());
        toast.info("You've been logged out.");
    }, [logoutApi, dispatch]);

    if (!isLoggedIn || !user) {
        return null;
    }

    const menuItems = [
        {
            icon: Package,
            label: "My Orders",
            description: "Track your shipments",
            color: "bg-primary/10 text-primary",
            action: () => setIsOrdersOpen(true)
        },
        {
            icon: MapPin,
            label: "Addresses",
            description: "Manage delivery locations",
            color: "bg-primary/10 text-primary",
            action: () => setIsAddressOpen(true)
        },
        {
            icon: CreditCard,
            label: "Payments",
            description: "Manage your cards",
            color: "bg-primary/10 text-primary",
            action: () => setIsPaymentsOpen(true) // Reuse address action if payments is just a placeholder
        },
        {
            icon: Glasses,
            label: "Eye Power",
            description: "View prescription details",
            color: "bg-blue-500/10 text-blue-600",
            action: () => setIsEyePowerOpen(true)
        },
        {
            icon: Settings,
            label: "Account",
            description: "Update your profile",
            color: "bg-primary/10 text-primary",
            action: () => setIsUpdateOpen(true)
        },
    ];



    return (
        <div className="container mx-auto px-4 md:py-16 max-w-5xl relative z-10">
            {/* Header Section */}
            <div className="relative mb-8 md:mb-12">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-transparent to-primary/5 rounded-3xl md:rounded-[3rem] -z-10 blur-2xl md:blur-3xl opacity-50" />
                <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 bg-card rounded-[2rem] md:rounded-[3rem] p-6 md:p-12 border border-border/50 shadow-md relative overflow-hidden backdrop-blur-sm">
                    {/* Background decoration */}
                    <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

                    <div className="relative group">
                        <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500" />
                        <div className="relative w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center border-8 border-background shadow-md transform transition-transform group-hover:scale-105 duration-500 overflow-hidden">
                            {user.avatar ? (
                                <img
                                    src={user.avatar}
                                    alt={user.name}
                                    className="h-full w-full object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=bg-primary`;
                                    }}
                                />
                            ) : (
                                <User className="h-16 w-16 md:h-20 md:w-20 text-white" />
                            )}
                        </div>
                    </div>

                    <div className="text-center md:text-left flex-1 space-y-3">
                        <div className="flex items-center justify-center md:justify-start gap-4 flex-wrap">
                            <h1 className="text-3xl md:text-5xl font-black tracking-tighter">{user.name}</h1>
                        </div>
                        <p className="text-muted-foreground font-bold text-lg">
                            {user.email} {user.mobile && `• ${user.mobile}`}
                        </p>
                        <div className="flex items-center justify-center md:justify-start gap-3 md:gap-8 pt-2 overflow-x-auto">
                            <div className="flex flex-col items-center md:items-start shrink-0">
                                <span className="text-xl md:text-2xl font-black">{ordersData?.data?.pagination?.total || 0}</span>
                                <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground">Orders</span>
                            </div>
                            <div className="w-px h-6 md:h-8 bg-border/60 shrink-0" />
                            <div className="flex flex-col items-center md:items-start shrink-0">
                                <span className="text-xl md:text-2xl font-black">
                                    ₹{ordersData?.data?.orders?.reduce((sum, order) => sum + (order.orderStatus !== 'cancelled' ? order.finalAmount : 0), 0).toFixed(0) || 0}
                                </span>
                                <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground">Spent</span>
                            </div>
                            <div className="w-px h-6 md:h-8 bg-border/60 shrink-0" />
                            <div
                                onClick={() => setIsEyePowerOpen(true)}
                                className="flex flex-col items-center md:items-start shrink-0 cursor-pointer hover:opacity-80 transition-opacity"
                            >
                                <span className="text-xl md:text-2xl font-black">{user.eyePower ? 'Set' : 'None'}</span>
                                <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground">Eye Power</span>
                            </div>
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        onClick={handleLogout}
                        className="rounded-3xl px-8 h-12 md:self-start border-2 hover:bg-destructive hover:text-white hover:border-destructive transition-all duration-300 font-bold shadow relative z-[30] cursor-pointer pointer-events-auto"
                    >
                        <LogOut className="mr-2 h-5 w-5" /> Log out
                    </Button>
                </div>
            </div>

            {/* Grid Menu */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
                {menuItems.map((item, index) => (
                    <div
                        key={index}
                        onClick={item.action}
                        className="group flex flex-col p-8 rounded-[2.5rem] border bg-card hover:bg-muted/50 hover:shadow-lg hover:-translate-y-1 transition-all duration-500 cursor-pointer relative overflow-hidden"
                    >
                        <div className={`w-14 h-14 ${item.color} rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-500`}>
                            <item.icon className="h-7 w-7" />
                        </div>
                        <h3 className="font-black text-xl tracking-tight mb-2">{item.label}</h3>
                        <p className="text-sm text-muted-foreground font-medium mb-6">{item.description}</p>
                        <div className="mt-auto flex items-center text-primary font-bold text-xs uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            Configure <ChevronRight className="ml-1 h-3 w-3" />
                        </div>
                    </div>
                ))}
            </div>

            <UpdateProfileDialog
                isOpen={isUpdateOpen}
                onOpenChange={setIsUpdateOpen}
                onOpenDeletion={(step) => {
                    setDeletionStep(step);
                    setIsDeleteAccountOpen(true);
                }}
            />
            <AddressDialog isOpen={isAddressOpen} onOpenChange={setIsAddressOpen} />
            <OrdersDialog isOpen={isOrdersOpen} onOpenChange={setIsOrdersOpen} />
            <PaymentsDialog isOpen={isPaymentsOpen} onOpenChange={setIsPaymentsOpen} />
            <EyePowerDialog isOpen={isEyePowerOpen} onOpenChange={setIsEyePowerOpen} />
            <LogoutConfirmDialog
                isOpen={isLogoutConfirmOpen}
                onOpenChange={setIsLogoutConfirmOpen}
                onConfirm={confirmLogout}
            />
            <DeleteAccountDialog
                isOpen={isDeleteAccountOpen}
                onOpenChange={setIsDeleteAccountOpen}
                initialStep={deletionStep}
            />
        </div>
    );
}
