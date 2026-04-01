'use client';

import * as React from 'react';
import { ResponsiveModal } from '@/components/ui/responsive-modal';
import { Button } from '@/components/ui/button';
import { CreditCard, Plus } from 'lucide-react';

interface PaymentsDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function PaymentsDialog({ isOpen, onOpenChange }: PaymentsDialogProps) {
    return (
        <ResponsiveModal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
            title="Payment Methods"
            className="sm:max-w-[550px]"
        >
            <div className="space-y-6">
                <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 rounded-[2rem] shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mt-10 -mr-10" />
                    <div className="flex justify-between items-start mb-10 relative z-10">
                        <CreditCard className="h-8 w-8 text-slate-300" />
                        <div className="text-[10px] font-black uppercase tracking-widest text-slate-300/80 bg-white/10 px-3 py-1 rounded-full">Primary</div>
                    </div>
                    <div className="space-y-4 relative z-10">
                        <div className="font-mono text-xl md:text-2xl tracking-widest font-black text-slate-200 indent-2">
                            •••• •••• •••• 4242
                        </div>
                        <div className="flex justify-between items-end">
                            <div className="uppercase">
                                <p className="text-[8px] font-black tracking-widest text-slate-400 mb-1">Card Holder</p>
                                <p className="font-bold tracking-tight">Rajul Demo</p>
                            </div>
                            <div className="uppercase">
                                <p className="text-[8px] font-black tracking-widest text-slate-400 mb-1">Expires</p>
                                <p className="font-bold tracking-tight">12/26</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-4">
                    <Button
                        className="w-full h-16 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg border-2 border-primary bg-transparent text-primary hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                        <Plus className="h-5 w-5" /> Add New Card
                    </Button>
                </div>
            </div>
        </ResponsiveModal>
    );
}
