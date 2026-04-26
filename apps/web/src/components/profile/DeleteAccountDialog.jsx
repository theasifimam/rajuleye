'use client';
import React, { useState, useEffect } from 'react';
import { ResponsiveModal } from '@/components/ui/responsive-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { useRequestAccountDeletionMutation, useDeleteAccountMutation } from '@/store/authApi';
import { useAppDispatch } from '@/store/store';
import { clearCredentials } from '@/store/authSlice';
import { Loader2, ShieldAlert } from 'lucide-react';
import { useRouter } from 'next/navigation';
export function DeleteAccountDialog({ isOpen, onOpenChange, initialStep = 'warn' }) {
    const [step, setStep] = useState(initialStep);
    const [otp, setOtp] = useState('');
    const [requestDelete, { isLoading: isRequesting }] = useRequestAccountDeletionMutation();
    const [deleteAccount, { isLoading: isDeleting }] = useDeleteAccountMutation();
    const dispatch = useAppDispatch();
    const router = useRouter();
    useEffect(() => {
        if (isOpen) {
            setStep(initialStep);
            setOtp('');
        }
    }, [isOpen, initialStep]);
    const handleRequestOTP = async () => {
        try {
            await requestDelete().unwrap();
            toast.success('Verification OTP sent to your email');
            setStep('otp');
        }
        catch (err) {
            toast.error(err?.data?.message || 'Failed to send OTP. Please try again.');
        }
    };
    const handleDeleteConfirm = async () => {
        if (!otp) {
            toast.error('Please enter the OTP');
            return;
        }
        try {
            await deleteAccount(otp).unwrap();
            toast.success('Your account has been permanently deleted.');
            dispatch(clearCredentials());
            onOpenChange(false);
            router.push('/');
        }
        catch (err) {
            toast.error(err?.data?.message || 'Verification failed. Please check the OTP or try again.');
        }
    };
    const title = step === 'warn' ? 'Delete Account?' : 'Verify Identity';
    const description = step === 'warn'
        ? "This action is permanent and cannot be undone."
        : "Enter the code sent to your email.";
    return (<ResponsiveModal isOpen={isOpen} onOpenChange={onOpenChange} title={title} description={description} headerClassName="bg-destructive" className="sm:max-w-[450px]">
            <div className="w-full flex flex-col items-center gap-6 py-2">
                <div className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center animate-pulse">
                    <ShieldAlert className="h-10 w-10 text-destructive"/>
                </div>

                <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground font-medium px-4">
                        {step === 'warn'
            ? "All your records, including order history and saved addresses, will be permanently removed from our system."
            : "We have sent a 6-digit verification code to your email. Please check your inbox (and spam folder)."}
                    </p>
                </div>

                {step === 'otp' && (<div className="w-full space-y-4 px-2">
                        <div className="relative">
                            <Input type="text" placeholder="000000" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} className="h-16 text-center text-3xl font-black tracking-[0.5em] rounded-2xl border-2 border-muted bg-muted/30 focus-visible:ring-destructive focus-visible:border-destructive transition-all placeholder:tracking-normal placeholder:text-muted-foreground/30" autoFocus/>
                        </div>
                        <div className="flex items-center justify-between px-2">
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                Expires in 10 minutes
                            </p>
                            <button onClick={handleRequestOTP} disabled={isRequesting} className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline disabled:opacity-50">
                                Resend Code
                            </button>
                        </div>
                    </div>)}

                <div className="w-full flex flex-col sm:flex-row gap-3 mt-4">
                    <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-2xl flex-1 font-bold h-14 order-2 sm:order-1 hover:bg-muted">
                        Cancel
                    </Button>
                    {step === 'warn' ? (<Button variant="destructive" onClick={handleRequestOTP} disabled={isRequesting} className="rounded-2xl flex-1 font-black uppercase tracking-widest h-14 shadow-xl shadow-destructive/20 order-1 sm:order-2 active:scale-[0.98] transition-transform">
                            {isRequesting ? <Loader2 className="h-5 w-5 animate-spin"/> : 'Request OTP'}
                        </Button>) : (<Button variant="destructive" onClick={handleDeleteConfirm} disabled={isDeleting || otp.length !== 6} className="rounded-2xl flex-1 font-black uppercase tracking-widest h-14 shadow-xl shadow-destructive/20 order-1 sm:order-2 active:scale-[0.98] transition-transform">
                            {isDeleting ? <Loader2 className="h-5 w-5 animate-spin"/> : 'Confirm Deletion'}
                        </Button>)}
                </div>
            </div>
        </ResponsiveModal>);
}
