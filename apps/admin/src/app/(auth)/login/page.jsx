'use client';
import React from 'react';
import { Eye, EyeOff, Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { toast } from 'sonner';
import { useLoginMutation } from '@/store/authApi';
import { useAppDispatch } from '@/store/store';
import { setCredentials } from '@/store/authSlice';
import { useRouter } from 'next/navigation';
export default function LoginPage() {
    const [login, { isLoading }] = useLoginMutation();
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [showPassword, setShowPassword] = React.useState(false);
    const [formData, setFormData] = React.useState({
        email: '',
        password: '',
    });
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await login(formData).unwrap();
            const { user, accessToken } = res.data;
            if (user.role === 'admin' || user.role === 'moderator') {
                dispatch(setCredentials({ user, accessToken }));
                toast.success(`Welcome back, ${user.name}`);
                router.push('/');
            }
            else {
                toast.error("Access denied. Administrative clearance required.");
            }
        }
        catch (err) {
            toast.error(err?.data?.message || "Authentication failed. Check your clearance.");
        }
    };
    return (<div className="space-y-6">
            <div className="text-center md:text-left mb-8">
                <h1 className="text-3xl font-black tracking-tight uppercase italic leading-none mb-2">
                    System <span className="text-primary not-italic">Access</span>
                </h1>
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">
                    Synchronize your administrative identity
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2 group">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-4">
                        Secure Identifier
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-300"/>
                        <Input type="email" placeholder="admin@rajuleye.com" className="h-16 pl-14 pr-6 rounded-[1.25rem] bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 font-bold transition-all" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required/>
                    </div>
                </div>

                <div className="space-y-2 group">
                    <div className="flex items-center justify-between px-4">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                            Clearance Key
                        </label>
                        <Link href="/forgot-password" className="text-[9px] font-black uppercase tracking-widest text-primary hover:underline">
                            Lost Key?
                        </Link>
                    </div>
                    <div className="relative">
                        <Lock className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors duration-300"/>
                        <Input type={showPassword ? "text" : "password"} placeholder="••••••••" className="h-16 pl-14 pr-14 rounded-[1.25rem] bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 font-bold tracking-widest transition-all" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required/>
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors focus:outline-none">
                            {showPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                        </button>
                    </div>
                </div>

                <Button type="submit" className="w-full h-18 rounded-[1.5rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-primary/20 group relative overflow-hidden mt-4" disabled={isLoading}>
                    {isLoading ? (<Loader2 className="h-5 w-5 animate-spin"/>) : (<span className="flex items-center gap-3">
                            Authorize Entry <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform"/>
                        </span>)}
                </Button>
            </form>

            <div className="pt-6 text-center">
                <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-[0.2em] max-w-[280px] mx-auto leading-relaxed">
                    By accessing this command center, you adhere to the Rajul Eye administrative security protocols.
                </p>
            </div>
        </div>);
}
