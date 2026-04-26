'use client';
import { useTheme } from 'next-themes';
import { Toaster as Sonner } from 'sonner';
const Toaster = ({ ...props }) => {
    const { theme = 'system' } = useTheme();
    return (<Sonner theme={theme} className="toaster group" toastOptions={{
            classNames: {
                toast: 'group toast group-[.toaster]:bg-card/40 group-[.toaster]:backdrop-blur-xl group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-2xl group-[.toaster]:rounded-2xl group-[.toaster]:p-6 group-[.toaster]:border-l-4 group-[.toaster]:border-l-primary',
                description: 'group-[.toast]:text-muted-foreground group-[.toast]:text-[11px] group-[.toast]:font-medium group-[.toast]:tracking-wide group-[.toast]:mt-1',
                actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:font-black group-[.toast]:uppercase group-[.toast]:tracking-widest group-[.toast]:text-[10px] group-[.toast]:h-8 group-[.toast]:px-4 group-[.toast]:rounded-xl',
                cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:font-black group-[.toast]:uppercase group-[.toast]:tracking-widest group-[.toast]:text-[10px] group-[.toast]:h-8 group-[.toast]:px-4 group-[.toast]:rounded-xl',
                title: 'group-[.toast]:font-black group-[.toast]:uppercase group-[.toast]:tracking-tighter group-[.toast]:text-sm group-[.toast]:italic',
                success: 'group-[.toaster]:border-l-primary',
                error: 'group-[.toaster]:border-l-destructive',
                info: 'group-[.toaster]:border-l-blue-500',
                warning: 'group-[.toaster]:border-l-yellow-500',
            },
        }} {...props}/>);
};
export { Toaster };
