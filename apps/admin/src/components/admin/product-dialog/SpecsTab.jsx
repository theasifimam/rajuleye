import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { Input } from '@/components/ui/input';

export function SpecsTab({ control }) {
    return (
        <div className="space-y-5 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <FormField control={control} name="type" render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel tooltip="The primary category that defines the utility of this piece." className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Archetype</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || undefined}>
                            <FormControl>
                                <SelectTrigger className="h-11 w-full bg-muted/30 border-none font-medium px-5 transition-all text-xs">
                                    <SelectValue placeholder="Select type"/>
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-2xl border-primary/10">
                                <SelectItem value="eyeglasses">Eyeglasses</SelectItem>
                                <SelectItem value="sunglasses">Sunglasses</SelectItem>
                                <SelectItem value="reading-glasses">Reading Glasses</SelectItem>
                                <SelectItem value="contact-lenses">Contact Lenses</SelectItem>
                                <SelectItem value="accessories">Accessories</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}/>

                <FormField control={control} name="gender" render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel tooltip="The intended audience for this specific design." className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Target Persona</FormLabel>
                        <FormControl>
                            <div className="flex flex-wrap items-center gap-6 pt-2">
                                {['men', 'women', 'unisex', 'kids'].map((g) => (
                                    <label key={g} className="flex items-center gap-2 cursor-pointer group">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value={g}
                                            checked={field.value === g}
                                            onChange={() => field.onChange(g)}
                                            className="w-4 h-4 accent-primary cursor-pointer"
                                        />
                                        <span className="text-sm font-medium capitalize text-muted-foreground group-hover:text-foreground transition-colors">
                                            {g}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>

                <FormField control={control} name="frameShape" render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel tooltip="The silhouette and architectural shape of the frame." className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Frame Geometry</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || undefined}>
                            <FormControl>
                                <SelectTrigger className="h-11 w-full bg-muted/30 border-none font-medium px-5 transition-all text-xs">
                                    <SelectValue placeholder="Shape"/>
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-2xl border-primary/10">
                                {['round', 'square', 'rectangle', 'oval', 'cat-eye', 'wayfarer', 'aviator', 'clubmaster'].map(s => (<SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}/>

                <FormField control={control} name="frameMaterial" render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel tooltip="The core substance used in the frame's construction." className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Material DNA</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || undefined}>
                            <FormControl>
                                <SelectTrigger className="h-11 w-full bg-muted/30 border-none font-medium px-5 transition-all text-xs">
                                    <SelectValue placeholder="Material"/>
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-2xl border-primary/10">
                                {['metal', 'acetate', 'tr90', 'wood', 'titanium', 'mixed'].map(m => (<SelectItem key={m} value={m} className="capitalize">{m}</SelectItem>))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}/>

                <FormField control={control} name="lensType" render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel tooltip="The technical specification of the installed lenses." className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Optic Precision</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || undefined}>
                            <FormControl>
                                <SelectTrigger className="h-11 w-full bg-muted/30 border-none font-medium px-5 transition-all text-xs">
                                    <SelectValue placeholder="Lens Type"/>
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-2xl border-primary/10">
                                {['single-vision', 'bifocal', 'progressive', 'non-prescription'].map(l => (<SelectItem key={l} value={l} className="capitalize">{l.replace('-', ' ')}</SelectItem>))}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}/>

                <FormField control={control} name="frameColor" render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel tooltip="The visual color and aesthetic finish of the product." className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Hue / Finish</FormLabel>
                        <FormControl>
                            <Input {...field} placeholder="e.g. Polished Gold" className="w-full bg-muted/30 border-none font-medium px-5 transition-all text-xs"/>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>
            </div>
        </div>
    );
}
