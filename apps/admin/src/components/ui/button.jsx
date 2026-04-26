import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
const buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-3xl text-sm font-bold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary/20", {
    variants: {
        variant: {
            default: "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] border border-primary/20",
            destructive: "bg-destructive text-white hover:bg-destructive/90 shadow-lg shadow-destructive/20 hover:scale-[1.02] active:scale-[0.98]",
            outline: "border-2 bg-background shadow-sm hover:bg-primary/5 hover:border-primary/50 hover:text-primary active:scale-[0.98]",
            secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
            ghost: "hover:bg-primary/10 hover:text-primary transition-colors font-bold",
            link: "text-primary underline-offset-4 hover:underline",
            signature: "bg-gradient-to-br from-primary to-primary-foreground/20 text-primary-foreground shadow-2xl shadow-primary/40 border-t border-white/20 hover:scale-[1.05] active:scale-95 group/btn",
        },
        size: {
            default: "h-11 px-6 rounded-3xl",
            sm: "h-9 rounded-lg px-4",
            lg: "h-14 rounded-4xl px-10 text-base",
            xl: "h-20 rounded-[2.5rem] px-12 text-xs font-black uppercase tracking-[0.2em]",
            icon: "h-11 w-11",
        },
    },
    defaultVariants: {
        variant: "default",
        size: "default",
    },
});
const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (<Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}/>);
});
Button.displayName = "Button";
export { Button, buttonVariants };
