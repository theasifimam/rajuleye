import React from 'react';
import { DollarSign, Package } from 'lucide-react';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Checkbox } from "@/components/ui/checkbox";
export function PricingTab({ control }) {
    return (<div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <FormField control={control} name="price" render={({ field }) => (<FormItem className="space-y-3">
                            <FormLabel tooltip="The standard retail price before any discounts or promotions." className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">MSRP / Base Price</FormLabel>
                            <FormControl>
                                <div className="relative group/field">
                                    <DollarSign className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within/field:text-primary transition-colors"/>
                                    <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} className="h-11 pl-11 rounded-xl bg-muted/30 border-none font-medium focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"/>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>)}/>
                <FormField control={control} name="discount" render={({ field }) => (<FormItem className="space-y-3">
                            <FormLabel tooltip="The discount percentage to be applied to the base price." className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Seasonal Discount (%)</FormLabel>
                            <FormControl>
                                <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} className="h-11 rounded-xl bg-muted/30 border-none font-medium px-5 transition-all"/>
                            </FormControl>
                            <FormMessage />
                        </FormItem>)}/>
                <FormField control={control} name="stock" render={({ field }) => (<FormItem className="space-y-3">
                            <FormLabel tooltip="The current number of units available in the warehouse for this SKU." className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Available Units</FormLabel>
                            <FormControl>
                                <div className="relative group/field">
                                    <Package className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within/field:text-primary transition-colors"/>
                                    <Input type="number" {...field} onChange={e => field.onChange(Number(e.target.value))} className="h-11 pl-11 rounded-xl bg-muted/30 border-none font-medium focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"/>
                                </div>
                            </FormControl>
                            <FormMessage />
                        </FormItem>)}/>
            </div>

            <FormField control={control} name="tags" render={({ field }) => (<FormItem className="space-y-3">
                        <FormLabel tooltip="Keywords for advanced archival search and discovery." className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Archival Tags (Comma-separated)</FormLabel>
                        <FormControl>
                            <Input placeholder="e.g. vintage, collection, limited" value={field.value?.join(', ') || ''} onChange={(e) => field.onChange(e.target.value.split(',').map(t => t.trim()).filter(Boolean))} className="h-11 rounded-xl bg-muted/30 border-none font-medium px-5 transition-all"/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>)}/>

            <div className="flex items-center space-x-3 p-4 rounded-2xl bg-muted/10 border border-primary/5">
                <FormField control={control} name="isActive" render={({ field }) => (<FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                                <Checkbox checked={field.value} onCheckedChange={field.onChange} className="h-6 w-6 rounded-lg border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"/>
                            </FormControl>
                            <div className="space-y-1 leading-none">
                                <FormLabel tooltip="When active, this product will be visible to customers in the storefront." className="text-[11px] font-black uppercase tracking-widest cursor-pointer">Live Distribution</FormLabel>
                                <FormDescription className="text-[9px] uppercase font-bold text-muted-foreground">Toggle visibility across all global storefronts.</FormDescription>
                            </div>
                        </FormItem>)}/>
            </div>
        </div>);
}
