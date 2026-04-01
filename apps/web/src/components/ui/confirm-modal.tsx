'use client';

import * as React from 'react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'default' | 'destructive';
}

export function ConfirmModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    variant = 'default',
}: ConfirmModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[450px] rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden">
                <div className="p-8 pb-4">
                    <DialogHeader className="text-left">
                        <DialogTitle className="text-2xl font-black tracking-tight">{title}</DialogTitle>
                        <DialogDescription className="text-base text-muted-foreground font-medium pt-3 leading-relaxed">
                            {description}
                        </DialogDescription>
                    </DialogHeader>
                </div>
                <div className="p-6 bg-muted/30 border-t flex items-center justify-end gap-3">
                    <Button
                        variant="ghost"
                        onClick={onClose}
                        className="h-12 px-6 rounded-xl font-bold text-muted-foreground hover:bg-muted transition-all"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant={variant === 'destructive' ? 'destructive' : 'default'}
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={cn(
                            "h-12 px-8 rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg transition-all hover:scale-[1.02] active:scale-95",
                            variant === 'default' && "bg-primary text-primary-foreground hover:bg-primary/90 shadow-primary/20"
                        )}
                    >
                        Confirm Action
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}
