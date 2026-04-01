import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { type Control } from 'react-hook-form';
import { type UserFormValues } from '@/lib/zod-schemas';

interface EyePowerTabProps {
    control: Control<UserFormValues>;
}

export function EyePowerTab({ control }: EyePowerTabProps) {
    const eyeFields = [
        { name: 'sphere', label: 'Sphere (SPH)' },
        { name: 'cylinder', label: 'Cylinder (CYL)' },
        { name: 'axis', label: 'Axis' },
        { name: 'addition', label: 'ADD' },
        { name: 'pd', label: 'P.D.' },
    ];

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
            {['left', 'right'].map((side) => (
                <div key={side} className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${side === 'left' ? 'bg-primary/10 text-primary' : 'bg-orange-500/10 text-orange-600'}`}>
                            {side === 'left' ? <Eye className="h-5 w-5" /> : <EyeOff className="h-5 w-5" />}
                        </div>
                        <div>
                            <h4 className="text-sm font-black uppercase tracking-[0.2em] italic">{side === 'left' ? 'Left Eye Vision' : 'Right Eye Vision'}</h4>
                            <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Architectural Prescription</p>
                        </div>
                        <div className="h-px flex-1 bg-primary/10 ml-2" />
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                        {eyeFields.map((field) => (
                            <FormField
                                key={field.name}
                                control={control}
                                name={`eyePower.${side}.${field.name}` as "eyePower.left.sphere" | "eyePower.left.cylinder" | "eyePower.left.axis" | "eyePower.left.addition" | "eyePower.left.pd" | "eyePower.right.sphere" | "eyePower.right.cylinder" | "eyePower.right.axis" | "eyePower.right.addition" | "eyePower.right.pd"}
                                render={({ field: formField }) => (
                                    <FormItem className="space-y-2">
                                        <FormLabel className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">{field.label}</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                step="0.25"
                                                placeholder="0.00"
                                                {...formField}
                                                className="h-10 rounded-xl bg-muted/30 border-none font-black text-center focus-visible:ring-2 focus-visible:ring-primary/20"
                                            />
                                        </FormControl>
                                        <FormMessage className="text-[8px] uppercase font-black" />
                                    </FormItem>
                                )}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
