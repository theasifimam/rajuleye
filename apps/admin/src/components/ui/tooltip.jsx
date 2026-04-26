"use client";
import * as React from "react";
import { Tooltip as TooltipPrimitive } from "radix-ui";
import { cn } from "@/lib/utils";
function TooltipProvider({ delayDuration = 400, ...props }) {
    return (<TooltipPrimitive.Provider data-slot="tooltip-provider" delayDuration={delayDuration} {...props}/>);
}
function Tooltip({ ...props }) {
    return (<TooltipProvider>
            <TooltipPrimitive.Root data-slot="tooltip" {...props}/>
        </TooltipProvider>);
}
function TooltipTrigger({ ...props }) {
    return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props}/>;
}
function TooltipContent({ className, children, sideOffset = 4, showArrow = true, ...props }) {
    return (<TooltipPrimitive.Portal>
            <TooltipPrimitive.Content data-slot="tooltip-content" sideOffset={sideOffset} className={cn("bg-popover text-popover-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-[110] overflow-hidden rounded-md border px-3 py-1.5 text-xs shadow-md", className)} {...props}>
                {children}
                {showArrow && (<TooltipPrimitive.Arrow data-slot="tooltip-arrow" className="fill-popover -mt-px drop-shadow-[0_1px_0_rgba(0,0,0,0.1)]"/>)}
            </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>);
}
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider };
