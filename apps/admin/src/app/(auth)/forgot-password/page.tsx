'use client';

import React from 'react';
import { Mail, ArrowLeft, Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
    const [isLoading, setIsLoading] = React.useState(false);
    const [email, setEmail] = React.useState('');
    const [isSent, setIsSent] = React.useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        
        // Simulating forgot password logic
        setTimeout(() => {
            setIsLoading(false);
            setIsSent(true);
            toast.success("Security reset protocol initiated.");
        }, 1500);
    };

    if (isSent) {
        return (
            <div className="space-y-8 py-4">
                <div className="text-center">
                    <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                        <Send className="h-10 w-10 text-primary animate-bounce" />
                    </div>
                    <h1 className="text-2xl font-black tracking-tight uppercase mb-4">
                        Reset <span className="text-primary italic">Initiated</span>
                    </h1>
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.2em] leading-relaxed max-w-[280px] mx-auto mb-10">
                        An identity recovery key has been dispatched to your secure identifier.
                    </p>
                    
                    <Button
                        variant="ghost"
                        className="text-[10px] font-black uppercase tracking-[0.3em] hover:text-primary transition-colors"
                        asChild
                    >
                        <Link href="/login" className="flex items-center gap-2">
                            <ArrowLeft className="h-4 w-4" /> Return to Command
                        </Link>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="text-center md:text-left mb-8">
                <Button
                    variant="ghost"
                    className="p-0 h-auto text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 hover:text-primary transition-all mb-4 group"
                    asChild
                >
                    <Link href="/login" className="flex items-center gap-2">
                        <ArrowLeft className="h-3 w-3 group-hover:-translate-x-1 transition-transform" /> 
                        Identify Back
                    </Link>
                </Button>
                <h1 className="text-3xl font-black tracking-tight uppercase italic leading-none mb-2">
                    Identity <span className="text-primary not-italic">Recovery</span>
                </h1>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                    Initiate secure reset protocol
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2 group">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-4">
                        Secure Identifier
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-300" />
                        <Input
                            type="email"
                            placeholder="admin@rajuleye.com"
                            className="h-16 pl-14 pr-6 rounded-[1.25rem] bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 font-bold transition-all text-sm"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full h-18 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-primary/20 group relative overflow-hidden"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        <span className="flex items-center gap-3">
                            Dispatch Reset Key <Send className="h-4 w-4 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform duration-500" />
                        </span>
                    )}
                </Button>
            </form>
            
            <div className="pt-6 text-center">
                <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em] max-w-[280px] mx-auto leading-relaxed">
                    Identity verification is required to regain command status.
                </p>
            </div>
        </div>
    );
}
