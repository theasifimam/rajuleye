'use client';
import * as React from 'react';
import { ResponsiveModal } from '@/components/ui/responsive-modal';
import { Button } from '@/components/ui/button';
import { Save, Loader2, Info } from 'lucide-react';
import { toast } from 'sonner';
import { useAppSelector } from '@/store/store';
import { selectCurrentUser } from '@/store/authSlice';
import { useUpdateEyePowerMutation } from '@/store/authApi';
import { PowerForm } from '@/app/product/[id]/components/lens-power/PowerForm';

export function EyePowerDialog({ isOpen, onOpenChange }) {
    const user = useAppSelector(selectCurrentUser);
    const [updateEyePower, { isLoading: isUpdating }] = useUpdateEyePowerMutation();
    const [formState, setFormState] = React.useState({
        left: { sphere: "", cylinder: "", axis: "" },
        right: { sphere: "", cylinder: "", axis: "" },
        name: "",
        phone: "",
    });

    React.useEffect(() => {
        if (user?.eyePower) {
            setFormState({
                left: {
                    sphere: user.eyePower.left?.sphere || "",
                    cylinder: user.eyePower.left?.cylinder || "",
                    axis: user.eyePower.left?.axis || "",
                },
                right: {
                    sphere: user.eyePower.right?.sphere || "",
                    cylinder: user.eyePower.right?.cylinder || "",
                    axis: user.eyePower.right?.axis || "",
                },
                name: user.eyePower.name || "",
                phone: user.eyePower.phone || "",
            });
        }
    }, [user, isOpen]);

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            await updateEyePower(formState).unwrap();
            toast.success('Eye power profile updated!');
            onOpenChange(false);
        }
        catch (err) {
            toast.error(err.data?.message || 'Failed to update eye power');
        }
    };

    return (
        <ResponsiveModal isOpen={isOpen} onOpenChange={onOpenChange} title="Eye Power Profile" className="sm:max-w-[600px]">
            <div className="bg-blue-500/5 rounded-2xl p-4 flex gap-4 items-start mb-6 border border-blue-500/10">
                <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5"/>
                <p className="text-xs font-medium text-blue-700 leading-relaxed">
                    Updating your eye power information ensures your future orders are fast and accurate. This data is only visible to you.
                </p>
            </div>

            <form onSubmit={handleSave} className="space-y-6">
                <PowerForm manualPower={formState} setManualPower={setFormState} />

                <Button type="submit" className="w-full h-16 rounded-full font-black text-xs uppercase tracking-[0.2em] shadow-xl mt-4 group overflow-hidden relative" disabled={isUpdating}>
                    {isUpdating ? (<Loader2 className="h-5 w-5 animate-spin"/>) : (<span className="flex items-center gap-2">
                            Save Prescription <Save className="h-5 w-5 group-hover:scale-110 transition-transform"/>
                        </span>)}
                </Button>
            </form>
        </ResponsiveModal>
    );
}
