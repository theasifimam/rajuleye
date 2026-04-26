'use client';
import * as React from 'react';
import { ResponsiveModal } from '@/components/ui/responsive-modal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Save, Loader2, Info } from 'lucide-react';
import { toast } from 'sonner';
import { useAppSelector, useAppDispatch } from '@/store/store';
import { selectCurrentUser } from '@/store/authSlice';
import { useUpdateEyePowerMutation } from '@/store/authApi';
export function EyePowerDialog({ isOpen, onOpenChange }) {
    const user = useAppSelector(selectCurrentUser);
    const dispatch = useAppDispatch();
    const [updateEyePower, { isLoading: isUpdating }] = useUpdateEyePowerMutation();
    const [formState, setFormState] = React.useState({
        left: {
            sphere: 0,
            cylinder: 0,
            axis: 0,
            addition: 0,
            pd: 0,
        },
        right: {
            sphere: 0,
            cylinder: 0,
            axis: 0,
            addition: 0,
            pd: 0,
        }
    });
    React.useEffect(() => {
        if (user?.eyePower) {
            setFormState({
                left: {
                    sphere: user.eyePower.left.sphere || 0,
                    cylinder: user.eyePower.left.cylinder || 0,
                    axis: user.eyePower.left.axis || 0,
                    addition: user.eyePower.left.addition || 0,
                    pd: user.eyePower.left.pd || 0,
                },
                right: {
                    sphere: user.eyePower.right.sphere || 0,
                    cylinder: user.eyePower.right.cylinder || 0,
                    axis: user.eyePower.right.axis || 0,
                    addition: user.eyePower.right.addition || 0,
                    pd: user.eyePower.right.pd || 0,
                }
            });
        }
    }, [user, isOpen]);
    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const result = await updateEyePower(formState).unwrap();
            // The mutation returns the updated user or eyePower depending on your backend
            // In authApi, we handle it. Let's assume we need to sync manually if authApi doesn't dispatch.
            // Actually, we'll sync in ProfilePage anyway, but let's be safe.
            toast.success('Eye power profile updated!');
            onOpenChange(false);
        }
        catch (err) {
            toast.error(err.data?.message || 'Failed to update eye power');
        }
    };
    const renderEyeFields = (side) => (<div className="space-y-4 p-6 rounded-3xl bg-muted/20 border border-border/50">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-primary"/>
                {side} Eye
            </h4>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground ml-1">Sphere (SPH)</label>
                    <Input type="number" step="0.25" value={formState[side].sphere} onChange={(e) => setFormState({
            ...formState,
            [side]: { ...formState[side], sphere: parseFloat(e.target.value) }
        })} className="h-12 rounded-xl bg-background border-none shadow-sm font-bold"/>
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground ml-1">Cylinder (CYL)</label>
                    <Input type="number" step="0.25" value={formState[side].cylinder} onChange={(e) => setFormState({
            ...formState,
            [side]: { ...formState[side], cylinder: parseFloat(e.target.value) }
        })} className="h-12 rounded-xl bg-background border-none shadow-sm font-bold"/>
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground ml-1">Axis</label>
                    <Input type="number" value={formState[side].axis} onChange={(e) => setFormState({
            ...formState,
            [side]: { ...formState[side], axis: parseFloat(e.target.value) }
        })} className="h-12 rounded-xl bg-background border-none shadow-sm font-bold"/>
                </div>
                <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground ml-1">Addition (ADD)</label>
                    <Input type="number" step="0.25" value={formState[side].addition} onChange={(e) => setFormState({
            ...formState,
            [side]: { ...formState[side], addition: parseFloat(e.target.value) }
        })} className="h-12 rounded-xl bg-background border-none shadow-sm font-bold"/>
                </div>
            </div>
            {side === 'right' && (<div className="space-y-1.5 pt-2">
                    <label className="text-[10px] font-bold uppercase tracking-tighter text-muted-foreground ml-1">Pupillary Distance (PD)</label>
                    <Input type="number" value={formState.right.pd} onChange={(e) => setFormState({
                ...formState,
                right: { ...formState.right, pd: parseFloat(e.target.value) },
                left: { ...formState.left, pd: parseFloat(e.target.value) }
            })} className="h-12 rounded-xl bg-background border-none shadow-sm font-bold" placeholder="Combined PD"/>
                </div>)}
        </div>);
    return (<ResponsiveModal isOpen={isOpen} onOpenChange={onOpenChange} title="Eye Power Profile" className="sm:max-w-[600px]">
            <div className="bg-blue-500/5 rounded-2xl p-4 flex gap-4 items-start mb-6 border border-blue-500/10">
                <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5"/>
                <p className="text-xs font-medium text-blue-700 leading-relaxed">
                    Updating your eye power information ensures your future orders are fast and accurate. This data is only visible to you.
                </p>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {renderEyeFields('left')}
                    {renderEyeFields('right')}
                </div>

                <Button type="submit" className="w-full h-16 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-xl mt-4 group overflow-hidden relative" disabled={isUpdating}>
                    {isUpdating ? (<Loader2 className="h-5 w-5 animate-spin"/>) : (<span className="flex items-center gap-2">
                            Save Prescription <Save className="h-5 w-5 group-hover:scale-110 transition-transform"/>
                        </span>)}
                </Button>
            </form>
        </ResponsiveModal>);
}
