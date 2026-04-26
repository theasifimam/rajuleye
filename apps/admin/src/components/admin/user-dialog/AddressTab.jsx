import React from 'react';
import { MapPin, Plus, Trash2, Home } from 'lucide-react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useFieldArray } from 'react-hook-form';
export function AddressTab({ control }) {
    const { fields, append, remove } = useFieldArray({
        control,
        name: "addresses"
    });
    return (<div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="text-sm font-black uppercase tracking-[0.2em] italic">Delivery Manifests</h4>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Verified Logistics Points</p>
                </div>
                <Button type="button" variant="outline" size="sm" onClick={() => append({ label: 'Home', fullName: '', line1: '', city: '', state: '', pincode: '', country: 'India', mobile: '', isDefault: fields.length === 0 })} className="rounded-xl border-primary/20 text-primary hover:bg-primary/5 font-black text-[9px] uppercase tracking-widest h-9 border-2">
                    <Plus className="h-3.5 w-3.5 mr-2"/>
                    New Manifest
                </Button>
            </div>

            <div className="space-y-6">
                {fields.length === 0 && (<div className="p-12 border-2 border-dashed border-primary/10 rounded-[2rem] flex flex-col items-center justify-center text-center">
                        <MapPin className="h-10 w-10 text-muted-foreground/20 mb-4"/>
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground italic">No addresses registered in the archive</p>
                    </div>)}

                {fields.map((field, index) => (<div key={field.id} className="relative p-6 md:p-8 rounded-[2rem] border-2 border-primary/5 bg-primary/[0.01] hover:border-primary/20 transition-all group/address">
                        <div className="absolute top-6 right-6 flex items-center gap-2 translate-x-4 opacity-0 group-hover/address:translate-x-0 group-hover/address:opacity-100 transition-all duration-500">
                            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="h-10 w-10 rounded-xl hover:bg-destructive/10 hover:text-destructive border border-transparent hover:border-destructive/20">
                                <Trash2 className="h-4 w-4"/>
                            </Button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <FormField control={control} name={`addresses.${index}.label`} render={({ field }) => (<FormItem className="space-y-2">
                                        <FormLabel className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Manifest Label</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Home className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary/40"/>
                                                <Input placeholder="Home, Office..." {...field} className="h-10 pl-10 rounded-xl bg-muted/30 border-none font-bold"/>
                                            </div>
                                        </FormControl>
                                        <FormMessage className="text-[8px] uppercase font-black"/>
                                    </FormItem>)}/>
                            <FormField control={control} name={`addresses.${index}.fullName`} render={({ field }) => (<FormItem className="space-y-2 md:col-span-2">
                                        <FormLabel className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Consignee Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Full name for delivery" {...field} className="h-10 rounded-xl bg-muted/30 border-none font-bold"/>
                                        </FormControl>
                                        <FormMessage className="text-[8px] uppercase font-black"/>
                                    </FormItem>)}/>
                            <FormField control={control} name={`addresses.${index}.line1`} render={({ field }) => (<FormItem className="space-y-2 md:col-span-2">
                                        <FormLabel className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Primary Address Line</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Building, Street, Area..." {...field} className="h-10 rounded-xl bg-muted/30 border-none font-bold"/>
                                        </FormControl>
                                        <FormMessage className="text-[8px] uppercase font-black"/>
                                    </FormItem>)}/>
                            <FormField control={control} name={`addresses.${index}.line2`} render={({ field }) => (<FormItem className="space-y-2">
                                        <FormLabel className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Address Line 2 (Optional)</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Suite, Landmark..." {...field} className="h-10 rounded-xl bg-muted/30 border-none font-bold"/>
                                        </FormControl>
                                        <FormMessage className="text-[8px] uppercase font-black"/>
                                    </FormItem>)}/>
                            <FormField control={control} name={`addresses.${index}.city`} render={({ field }) => (<FormItem className="space-y-2">
                                        <FormLabel className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">City</FormLabel>
                                        <FormControl>
                                            <Input placeholder="City" {...field} className="h-10 rounded-xl bg-muted/30 border-none font-bold"/>
                                        </FormControl>
                                        <FormMessage className="text-[8px] uppercase font-black"/>
                                    </FormItem>)}/>
                            <FormField control={control} name={`addresses.${index}.state`} render={({ field }) => (<FormItem className="space-y-2">
                                        <FormLabel className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">State</FormLabel>
                                        <FormControl>
                                            <Input placeholder="State" {...field} className="h-10 rounded-xl bg-muted/30 border-none font-bold"/>
                                        </FormControl>
                                        <FormMessage className="text-[8px] uppercase font-black"/>
                                    </FormItem>)}/>
                            <FormField control={control} name={`addresses.${index}.pincode`} render={({ field }) => (<FormItem className="space-y-2">
                                        <FormLabel className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Pincode</FormLabel>
                                        <FormControl>
                                            <Input placeholder="XXXXXX" {...field} className="h-10 rounded-xl bg-muted/30 border-none font-black"/>
                                        </FormControl>
                                        <FormMessage className="text-[8px] uppercase font-black"/>
                                    </FormItem>)}/>
                            <FormField control={control} name={`addresses.${index}.country`} render={({ field }) => (<FormItem className="space-y-2">
                                        <FormLabel className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Country</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Country" {...field} className="h-10 rounded-xl bg-muted/30 border-none font-bold"/>
                                        </FormControl>
                                        <FormMessage className="text-[8px] uppercase font-black"/>
                                    </FormItem>)}/>
                            <FormField control={control} name={`addresses.${index}.mobile`} render={({ field }) => (<FormItem className="space-y-2">
                                        <FormLabel className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Contact Number</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Mobile for delivery" {...field} className="h-10 rounded-xl bg-muted/30 border-none font-bold"/>
                                        </FormControl>
                                        <FormMessage className="text-[8px] uppercase font-black"/>
                                    </FormItem>)}/>
                        </div>
                    </div>))}
            </div>
        </div>);
}
