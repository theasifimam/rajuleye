'use client';

import * as React from 'react';
import { ResponsiveModal } from '@/components/ui/responsive-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Plus, Trash2, Home, Briefcase } from 'lucide-react';
import { toast } from 'sonner';
import { useAppSelector } from '@/store/store';
import { selectCurrentUser } from '@/store/authSlice';
import { useAddAddressMutation, useDeleteAddressMutation } from '@/store/authApi';
import type { IAddress } from '@/store/authSlice';

interface AddressDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AddressDialog({ isOpen, onOpenChange }: AddressDialogProps) {
    const user = useAppSelector(selectCurrentUser);
    const [addAddress, { isLoading: isAddingAddr }] = useAddAddressMutation();
    const [deleteAddress] = useDeleteAddressMutation();

    const addresses = user?.addresses || [];
    const [isAddingMode, setIsAddingMode] = React.useState(false);
    const [formData, setFormData] = React.useState({
        label: '',
        fullName: '',
        line1: '',
        line2: '',
        city: '',
        state: '',
        pincode: '',
        country: 'India',
        mobile: '',
    });

    const handleDelete = async (id: string) => {
        try {
            await deleteAddress(id).unwrap();
            toast.info('Address removed');
        } catch (err: any) {
            toast.error(err.data?.message || 'Failed to remove address');
        }
    };

    const handleAdd = async () => {
        const { label, fullName, line1, city, state, pincode, mobile } = formData;
        if (!label.trim() || !fullName.trim() || !line1.trim() || !city.trim() || !state.trim() || !pincode.trim() || !mobile.trim()) {
            toast.error("Please fill in all required fields.");
            return;
        }

        try {
            const addressDataToSend = {
                ...formData,
                isDefault: false,
            };
            await addAddress(addressDataToSend).unwrap();
            setFormData({
                label: '',
                fullName: '',
                line1: '',
                line2: '',
                city: '',
                state: '',
                pincode: '',
                country: 'India',
                mobile: '',
            });
            setIsAddingMode(false);
            toast.success("Address added successfully!");
        } catch (err: any) {
            toast.error(err.data?.message || 'Failed to add address');
        }
    };

    const getIcon = (label: string) => {
        const l = label.toLowerCase();
        if (l.includes('home')) return Home;
        if (l.includes('office') || l.includes('work')) return Briefcase;
        return MapPin;
    };

    return (
        <ResponsiveModal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title="Manage Addresses"
            className="sm:max-w-[550px]"
        >
            {!isAddingMode ? (
                <div className="space-y-6">
                    <div className="space-y-4">
                        {addresses.length > 0 ? (
                            addresses.map((addr) => {
                                const Icon = getIcon(addr.label);
                                return (
                                    <div
                                        key={addr._id}
                                        className="group flex items-start gap-4 p-5 rounded-3xl border border-border/50 bg-muted/20 hover:bg-muted/40 transition-all relative"
                                    >
                                        <div className="h-10 w-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1 space-y-1 pr-6">
                                            <p className="font-black text-sm uppercase tracking-widest text-primary/80">{addr.label}</p>
                                            <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                                                {addr.fullName}<br />
                                                {addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}, {addr.city}, {addr.state} {addr.pincode}, {addr.country}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => addr._id && handleDelete(addr._id)}
                                            className="absolute top-5 right-5 h-8 w-8 rounded-full bg-destructive/10 text-destructive flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="py-12 text-center space-y-3 opacity-40">
                                <MapPin className="h-12 w-12 mx-auto" />
                                <p className="font-bold">No addresses saved yet</p>
                            </div>
                        )}
                    </div>

                    <Button
                        onClick={() => setIsAddingMode(true)}
                        className="w-full h-16 rounded-2xl font-black text-sm uppercase tracking-widest shadow-xl flex items-center gap-2 border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-white transition-all"
                    >
                        <Plus className="h-5 w-5" /> Add New Address
                    </Button>
                </div>
            ) : (
                <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
                    <div className="flex items-center justify-between pb-4 border-b border-border/50">
                        <h3 className="font-black text-sm uppercase tracking-widest text-muted-foreground/60">New Address Details</h3>
                        <Button variant="ghost" size="sm" onClick={() => setIsAddingMode(false)} className="h-8 rounded-full text-xs font-black uppercase tracking-tighter hover:bg-muted">
                            Cancel
                        </Button>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 scroll-mt-24">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Address Label</label>
                                <Input
                                    placeholder="e.g. Home, Office"
                                    value={formData.label}
                                    onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                    className="h-14 rounded-2xl bg-muted/30 border-none px-5 shadow-inner text-base font-bold focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                            <div className="space-y-2 scroll-mt-24">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                                <Input
                                    placeholder="Receiver's Name"
                                    value={formData.fullName}
                                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                    className="h-14 rounded-2xl bg-muted/30 border-none px-5 shadow-inner text-base font-bold focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 scroll-mt-24">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Street Address</label>
                            <Input
                                placeholder="123 Street Name"
                                value={formData.line1}
                                onChange={(e) => setFormData({ ...formData, line1: e.target.value })}
                                className="h-14 rounded-2xl bg-muted/30 border-none px-5 shadow-inner text-base font-bold focus:ring-2 focus:ring-primary/20"
                            />
                        </div>

                        <div className="space-y-2 scroll-mt-24">
                            <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Area / Landmark (Optional)</label>
                            <Input
                                placeholder="Bldg 4, Apt 12, Near Mall"
                                value={formData.line2}
                                onChange={(e) => setFormData({ ...formData, line2: e.target.value })}
                                className="h-14 rounded-2xl bg-muted/30 border-none px-5 shadow-inner text-base font-semibold focus:ring-2 focus:ring-primary/20"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 scroll-mt-24">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">City</label>
                                <Input
                                    placeholder="City"
                                    value={formData.city}
                                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                                    className="h-14 rounded-2xl bg-muted/30 border-none px-5 shadow-inner text-base font-bold focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                            <div className="space-y-2 scroll-mt-24">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">State</label>
                                <Input
                                    placeholder="State"
                                    value={formData.state}
                                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                                    className="h-14 rounded-2xl bg-muted/30 border-none px-5 shadow-inner text-base font-bold focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2 scroll-mt-24">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Postal Code</label>
                                <Input
                                    placeholder="000000"
                                    value={formData.pincode}
                                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                                    className="h-14 rounded-2xl bg-muted/30 border-none px-5 shadow-inner text-base font-bold focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                            <div className="space-y-2 scroll-mt-24">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Mobile</label>
                                <Input
                                    placeholder="Mobile Number"
                                    value={formData.mobile}
                                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                    className="h-14 rounded-2xl bg-muted/30 border-none px-5 shadow-inner text-base font-bold focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                        </div>

                        <Button
                            onClick={handleAdd}
                            disabled={isAddingAddr}
                            className="w-full h-16 rounded-full bg-primary text-primary-foreground font-black shadow-xl hover:scale-[1.02] transition-transform text-sm uppercase tracking-widest mt-6"
                        >
                            {isAddingAddr ? 'Saving...' : 'Save Address'}
                        </Button>
                    </div>
                </div>
            )}
        </ResponsiveModal>
    );
}

