'use client';
import * as React from 'react';
import { ResponsiveModal } from '@/components/ui/responsive-modal';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
export function LogoutConfirmDialog({ isOpen, onOpenChange, onConfirm }) {
    return (<ResponsiveModal isOpen={isOpen} onOpenChange={onOpenChange} title="Wait, Logging Out?" description="Are you sure you want to end your session? You'll need to sign back in to access your orders and profile." className="sm:max-w-[500px]" contentClassName="items-start text-left p-0">
            <div className="w-full flex flex-col">
                {/* Icon & Message Body */}
                <div className="p-8 flex items-center gap-6">
                    <div className="relative h-16 w-16 shrink-0 rounded-2xl bg-destructive/10 flex items-center justify-center">
                        <LogOut className="h-8 w-8 text-destructive"/>
                    </div>
                    <div className="space-y-1">
                        <p className="text-sm font-bold text-foreground">Action Required</p>
                        <p className="text-sm text-muted-foreground font-medium leading-relaxed">
                            Ending your session will clear your local biometric data cache.
                        </p>
                    </div>
                </div>

                {/* Horizontal Action Bar */}
                <div className="p-6 bg-muted/30 border-t flex flex-col sm:flex-row justify-end gap-3">
                    <Button variant="ghost" onClick={() => onOpenChange(false)} className="h-12 rounded-xl font-bold text-muted-foreground hover:bg-muted order-2 sm:order-1">
                        No, Keep Me In
                    </Button>
                    <Button onClick={onConfirm} className="h-12 rounded-xl bg-destructive text-destructive-foreground font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-destructive/90 hover:scale-[1.02] transition-all px-8 order-1 sm:order-2">
                        Yes, Log Me Out
                    </Button>
                </div>
            </div>
        </ResponsiveModal>);
}
