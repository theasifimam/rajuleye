import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MultiSelect } from "@/components/ui/multi-select";

export function SpecsTab({ control, filterOptions }) {
    const formatOption = (str) => ({ label: str.replace(/-/g, ' '), value: str });
    const getOptions = (arr) => (arr || []).map(formatOption);

    return (
        <div className="space-y-5 animate-in fade-in slide-in-from-left-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Type - Single Select */}
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
                                {filterOptions.types?.map(t => <SelectItem key={t} value={t} className="capitalize">{t.replace(/-/g, ' ')}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}/>

                {/* Gender - Multi Select */}
                <FormField control={control} name="gender" render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel tooltip="The intended audience for this specific design." className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Target Persona</FormLabel>
                        <FormControl>
                            <MultiSelect 
                                options={getOptions(filterOptions.genders)} 
                                selected={field.value || []} 
                                onChange={field.onChange} 
                                placeholder="Select Gender(s)" 
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>

                {/* Styles - Multi Select */}
                <FormField control={control} name="styles" render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel tooltip="The aesthetic and design style(s) of the eyewear." className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Styles</FormLabel>
                        <FormControl>
                            <MultiSelect 
                                options={getOptions(filterOptions.styles)} 
                                selected={field.value || []} 
                                onChange={field.onChange} 
                                placeholder="Select Style(s)" 
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>

                {/* Usage - Multi Select */}
                <FormField control={control} name="usage" render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel tooltip="Recommended activities or environments for use." className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Usage / Activity</FormLabel>
                        <FormControl>
                            <MultiSelect 
                                options={getOptions(filterOptions.usages)} 
                                selected={field.value || []} 
                                onChange={field.onChange} 
                                placeholder="Select Usage(s)" 
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>

                {/* Face Shapes - Multi Select */}
                <FormField control={control} name="faceShapes" render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel tooltip="Compatible face shapes for this frame." className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Face Shape Fit</FormLabel>
                        <FormControl>
                            <MultiSelect 
                                options={getOptions(filterOptions.faceShapes)} 
                                selected={field.value || []} 
                                onChange={field.onChange} 
                                placeholder="Select Face Shape(s)" 
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>

                {/* Materials - Multi Select */}
                <FormField control={control} name="materials" render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel tooltip="The core materials used in construction." className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Material DNA</FormLabel>
                        <FormControl>
                            <MultiSelect 
                                options={getOptions(filterOptions.materials)} 
                                selected={field.value || []} 
                                onChange={field.onChange} 
                                placeholder="Select Material(s)" 
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>

                {/* Colors - Multi Select (Wait, color might not be constrained to enums in constants if users want custom. But wait, the requirement says "Colors: support multiple colors". I'll use a free-text tags input, or since I don't have a Tags input ready, I will use an input with comma separated strings or a simple approach for now, or just provide standard color options. Let's make an input where user types comma separated, or standard options? Let's check requirements. "Colors: Support multiple colors". A MultiSelect with standard colors? Let's assume standard colors are fine, or I can use an input and parse commas). Let's use standard input for now and tell user to comma separate, or implement a simple tag input. Let's do a simple text input for colors. */}
                <FormField control={control} name="colors" render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel tooltip="Colors (comma separated)." className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Hues / Colors</FormLabel>
                        <FormControl>
                            <input 
                                className="flex h-11 w-full rounded-2xl border-none bg-muted/30 px-5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Black, Tortoise, Gold"
                                value={(field.value || []).join(', ')}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    field.onChange(val ? val.split(',').map(s => s.trim()).filter(Boolean) : []);
                                }}
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>

                {/* Lens Features - Multi Select */}
                <FormField control={control} name="lensFeatures" render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel tooltip="Special properties of the lenses." className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Lens Features</FormLabel>
                        <FormControl>
                            <MultiSelect 
                                options={getOptions(filterOptions.lensFeatures)} 
                                selected={field.value || []} 
                                onChange={field.onChange} 
                                placeholder="Select Feature(s)" 
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}/>

                {/* Frame Type - Single Select */}
                <FormField control={control} name="frameType" render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel tooltip="The structural type of the frame." className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Frame Type</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || undefined}>
                            <FormControl>
                                <SelectTrigger className="h-11 w-full bg-muted/30 border-none font-medium px-5 transition-all text-xs">
                                    <SelectValue placeholder="Select Frame Type"/>
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-2xl border-primary/10">
                                {filterOptions.frameTypes?.map(t => <SelectItem key={t} value={t} className="capitalize">{t.replace(/-/g, ' ')}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}/>

                {/* Fit - Single Select */}
                <FormField control={control} name="fit" render={({ field }) => (
                    <FormItem className="space-y-3">
                        <FormLabel tooltip="The size/fit profile of the frame." className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Size / Fit</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || undefined}>
                            <FormControl>
                                <SelectTrigger className="h-11 w-full bg-muted/30 border-none font-medium px-5 transition-all text-xs">
                                    <SelectValue placeholder="Select Fit"/>
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-2xl border-primary/10">
                                {filterOptions.fits?.map(t => <SelectItem key={t} value={t} className="capitalize">{t.replace(/-/g, ' ')}</SelectItem>)}
                            </SelectContent>
                        </Select>
                        <FormMessage />
                    </FormItem>
                )}/>
            </div>
        </div>
    );
}
