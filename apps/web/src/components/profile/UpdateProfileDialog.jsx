'use client';
import * as React from 'react';
import { ResponsiveModal } from '@/components/ui/responsive-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, Mail, Smartphone, Save, Camera, Loader2, Calendar, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAppSelector, useAppDispatch } from '@/store/store';
import { selectCurrentUser, updateUser } from '@/store/authSlice';
import { useUpdateProfileMutation, useRequestAccountDeletionMutation } from '@/store/authApi';
export function UpdateProfileDialog({ isOpen, onOpenChange, onOpenDeletion }) {
    const user = useAppSelector(selectCurrentUser);
    const dispatch = useAppDispatch();
    const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();
    const [requestDelete, { isLoading: isRequesting }] = useRequestAccountDeletionMutation();
    const [formState, setFormState] = React.useState({
        name: '',
        email: '',
        mobile: '',
        gender: '',
        dateOfBirth: '',
    });
    const [avatarFile, setAvatarFile] = React.useState(null);
    const [avatarPreview, setAvatarPreview] = React.useState(null);
    const fileInputRef = React.useRef(null);
    React.useEffect(() => {
        if (user) {
            setFormState({
                name: user.name || '',
                email: user.email || '',
                mobile: user.mobile || '',
                gender: user.gender || '',
                dateOfBirth: user.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
            });
            setAvatarPreview(user.avatar || null);
        }
    }, [user, isOpen]);
    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('File size too large (max 5MB)');
                return;
            }
            setAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const handleUpdate = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', formState.name);
        formData.append('mobile', formState.mobile);
        formData.append('gender', formState.gender || '');
        formData.append('dateOfBirth', formState.dateOfBirth);
        if (avatarFile) {
            formData.append('avatar', avatarFile);
        }
        try {
            const result = await updateProfile(formData).unwrap();
            dispatch(updateUser(result.data));
            toast.success('Profile updated successfully!');
            onOpenChange(false);
        }
        catch (err) {
            toast.error(err.data?.message || 'Failed to update profile');
        }
    };
    const handleDeleteAccount = async () => {
        try {
            await requestDelete().unwrap();
            toast.success('Verification OTP sent to your email');
            onOpenChange(false); // Close current update modal
            onOpenDeletion?.('otp'); // Open deletion modal at OTP step
        }
        catch (err) {
            toast.error(err.data?.message || 'Failed to request account deletion');
        }
    };
    return (<ResponsiveModal isOpen={isOpen} onOpenChange={onOpenChange} title="Update Profile" className="sm:max-w-[500px]">
            <div className="flex flex-col items-center mb-8 pt-4">
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <div className="w-28 h-28 rounded-full bg-muted border-4 border-background shadow-2xl flex items-center justify-center overflow-hidden transition-transform duration-500 group-hover:scale-105">
                        {avatarPreview ? (<img src={avatarPreview} alt="Avatar" className="w-full h-full object-cover"/>) : (<User className="h-12 w-12 text-muted-foreground"/>)}
                    </div>
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <Camera className="h-8 w-8 text-white"/>
                    </div>
                </div>
                <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange}/>
                <button onClick={() => fileInputRef.current?.click()} className="text-[10px] font-black uppercase tracking-widest text-primary mt-4 hover:underline">
                    {avatarPreview ? 'Change Avatar' : 'Upload Avatar'}
                </button>
            </div>

            <form onSubmit={handleUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 group">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary"/>
                            <Input value={formState.name} onChange={(e) => setFormState({ ...formState, name: e.target.value })} className="h-14 pl-12 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 font-bold" placeholder="Your Name" required/>
                        </div>
                    </div>

                    <div className="space-y-2 group">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Mobile Number</label>
                        <div className="relative">
                            <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary"/>
                            <Input value={formState.mobile} onChange={(e) => setFormState({ ...formState, mobile: e.target.value })} className="h-14 pl-12 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 font-bold" placeholder="+1 234 567 890"/>
                        </div>
                    </div>
                </div>

                <div className="space-y-2 group opacity-60">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Email (Primary)</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                        <Input value={formState.email} disabled className="h-14 pl-12 rounded-2xl bg-muted border-none font-bold cursor-not-allowed"/>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 group">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Gender</label>
                        <select value={formState.gender} onChange={(e) => setFormState({ ...formState, gender: e.target.value })} className="w-full h-14 px-4 rounded-2xl bg-muted/30 border-none focus:ring-2 focus:ring-primary/20 font-bold text-sm outline-none appearance-none">
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="space-y-2 group">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 ml-1">Date of Birth</label>
                        <div className="relative">
                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
                            <Input type="date" value={formState.dateOfBirth} onChange={(e) => setFormState({ ...formState, dateOfBirth: e.target.value })} className="h-14 pl-12 rounded-2xl bg-muted/30 border-none focus-visible:ring-2 focus-visible:ring-primary/20 font-bold"/>
                        </div>
                    </div>
                </div>

                <Button type="submit" className="w-full h-16 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-xl mt-4 group overflow-hidden relative" disabled={isUpdating}>
                    {isUpdating ? (<Loader2 className="h-5 w-5 animate-spin"/>) : (<span className="flex items-center gap-2">
                            Update Identity <Save className="h-5 w-5 group-hover:scale-110 transition-transform"/>
                        </span>)}
                </Button>
            </form>

            <div className="mt-12 pt-8 border-t border-destructive/10">
                <div className="bg-destructive/5 rounded-3xl p-6 border border-destructive/10">
                    <h4 className="text-[10px] font-black uppercase tracking-widest text-destructive mb-1">Danger Zone</h4>
                    <p className="text-xs text-muted-foreground font-medium mb-4">Permanently delete your account and all associated data.</p>
                    <Button variant="ghost" onClick={handleDeleteAccount} disabled={isRequesting} className="w-full h-12 rounded-xl border border-destructive/20 text-destructive hover:bg-destructive hover:text-white font-bold text-xs uppercase tracking-widest transition-all">
                        {isRequesting ? <Loader2 className="h-4 w-4 animate-spin"/> : <><Trash2 className="mr-2 h-4 w-4"/> Delete Account</>}
                    </Button>
                </div>
            </div>
        </ResponsiveModal>);
}
