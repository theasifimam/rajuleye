'use client';

import * as React from 'react';
import { useMobile } from '@/hooks/use-mobile';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogPortal,
    DialogOverlay,
} from '@/components/ui/dialog';
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerDescription,
} from '@/components/ui/drawer';
import { cn } from '@/lib/utils';

interface ResponsiveModalProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    title?: string;
    description?: string;
    children: React.ReactNode;
    className?: string;
    headerClassName?: string;
    contentClassName?: string;
    showHandle?: boolean;
}

export function ResponsiveModal({
    isOpen,
    onOpenChange,
    title,
    description,
    children,
    className,
    headerClassName,
    contentClassName,
    showHandle = true,
}: ResponsiveModalProps) {
    const isMobile = useMobile();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    React.useEffect(() => {
        if (isOpen) {
            // debug removed
        }
    }, [isOpen, isMobile]);

    if (!mounted) return null;

    if (isMobile) {
        return (
            <Drawer open={isOpen} onOpenChange={onOpenChange} repositionInputs={false}>
                <DrawerContent className={cn("rounded-t-[3rem] p-0 border-none outline-none focus:outline-none bg-background", className)}>
                    {showHandle && (
                        <div className="mx-auto mt-4 h-1.5 w-12 rounded-full bg-muted-foreground/20 flex-shrink-0" />
                    )}
                    {(title || description) && (
                        <DrawerHeader className={cn("px-6 pt-4 pb-2 text-left flex-shrink-0", headerClassName)}>
                            {title && <DrawerTitle className="text-2xl font-black tracking-tight">{title}</DrawerTitle>}
                            {description && <DrawerDescription className="text-muted-foreground font-medium">{description}</DrawerDescription>}
                        </DrawerHeader>
                    )}
                    <div
                        className={cn(
                            "px-6 pb-8 pt-2 overflow-y-auto flex-1",
                            "overscroll-contain", // prevents drawer close when scrolling form
                            contentClassName
                        )}
                        style={{ maxHeight: 'calc(90dvh - 120px)' }}
                    >
                        {children}
                        {/* Bottom spacer so submit button isn't hidden by system bars */}
                        <div className="h-safe-area-inset-bottom" />
                    </div>
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent
                className={cn(
                    "sm:max-w-lg rounded-[2.5rem] p-0 border-none shadow-2xl overflow-hidden bg-background z-[501]",
                    className
                )}
            >
                {(title || description) && (
                    <div className={cn("h-32 bg-primary flex flex-col items-center justify-center relative flex-shrink-0 text-white p-6", headerClassName)}>
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl" />
                        {title && <DialogTitle className="text-2xl font-black z-10 text-center">{title}</DialogTitle>}
                        {description && <DialogDescription className="text-white/70 text-[10px] font-black uppercase tracking-[0.2em] z-10 mt-2 text-center max-w-[280px]">{description}</DialogDescription>}
                    </div>
                )}
                <div className={cn("p-8 overflow-y-auto max-h-[70vh] scrollbar-hide flex flex-col items-center", contentClassName)}>
                    {children}
                </div>
            </DialogContent>
        </Dialog>
    );
}
