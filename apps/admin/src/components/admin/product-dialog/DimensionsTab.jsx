import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
export function DimensionsTab({ control }) {
    return (<div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <FormField control={control} name="size.lensWidth" render={({ field }) => (<FormItem className="space-y-3">
                            <FormLabel tooltip="The horizontal diameter of a single lens at its widest point (in mm)." className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Lens Width (mm)</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} className="h-14 rounded-2xl bg-muted/30 border-none font-bold px-6 text-center"/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>)}/>
                <FormField control={control} name="size.bridge" render={({ field }) => (<FormItem className="space-y-3">
                            <FormLabel tooltip="The distance between the two lenses over the nose (in mm)." className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Bridge Width (mm)</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} className="h-14 rounded-2xl bg-muted/30 border-none font-bold px-6 text-center"/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>)}/>
                <FormField control={control} name="size.templeLength" render={({ field }) => (<FormItem className="space-y-3">
                            <FormLabel tooltip="The total length of the temple arm from the hinge to the tip (in mm)." className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Temple Length (mm)</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} className="h-14 rounded-2xl bg-muted/30 border-none font-bold px-6 text-center"/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>)}/>
                <FormField control={control} name="size.frameWidth" render={({ field }) => (<FormItem className="space-y-3">
                            <FormLabel tooltip="The total horizontal width of the frame from edge to edge (in mm)." className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Frame Width (mm)</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} className="h-14 rounded-2xl bg-muted/30 border-none font-bold px-6 text-center"/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>)}/>
            </div>
            <FormField control={control} name="weight" render={({ field }) => (<FormItem className="space-y-3 w-fit">
                        <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Net Weight (g)</FormLabel>
                        <FormControl>
                            <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} className="h-14 w-40 rounded-2xl bg-muted/30 border-none font-bold px-6 text-center"/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>)}/>
        </div>);
}
