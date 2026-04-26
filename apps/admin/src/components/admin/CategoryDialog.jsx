/* eslint-disable @next/next/no-img-element */
'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Tag, Zap, Image as ImageIcon, Layers, X, Loader2, Upload, } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form";
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TooltipProvider } from '@/components/ui/tooltip';
import { Checkbox } from '@/components/ui/checkbox';
import { CategoryFormSchema } from '@/lib/zod-schemas';
import { useCreateCategoryMutation, useUpdateCategoryMutation } from '@/store/categoryApi';
import { toast } from 'sonner';
export function CategoryDialog({ isOpen, onOpenChange, category, categories }) {
    const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
    const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
    const loading = isCreating || isUpdating;
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    const form = useForm({
        resolver: zodResolver(CategoryFormSchema),
        defaultValues: {
            name: '',
            slug: '',
            image: '',
            parent: null,
            isActive: true,
        }
    });
    useEffect(() => {
        if (category && isOpen) {
            form.reset({
                name: category.name || '',
                slug: category.slug || '',
                image: category.image || '',
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                parent: category.parent?._id || (typeof category.parent === 'string' ? category.parent : null),
                isActive: category.isActive ?? true,
            });
            setImagePreview(category.image || null);
        }
        else if (!category && isOpen) {
            form.reset({
                name: '',
                slug: '',
                image: '',
                parent: null,
                isActive: true,
            });
            setImagePreview(null);
        }
    }, [category, form, isOpen]);
    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            form.setValue('image', file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    const onSubmit = async (values) => {
        try {
            const formData = new FormData();
            formData.append('name', values.name);
            formData.append('slug', values.slug);
            formData.append('isActive', String(values.isActive));
            if (values.parent && values.parent !== 'none') {
                formData.append('parent', values.parent);
            }
            if (values.image) {
                formData.append('image', values.image);
            }
            if (category?._id) {
                await updateCategory({ id: category._id, body: formData }).unwrap();
                toast.success('Category updated successfully');
            }
            else {
                await createCategory(formData).unwrap();
                toast.success('Category created successfully');
            }
            onOpenChange(false);
        }
        catch (error) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            toast.error(error?.data?.message || 'Something went wrong');
            console.error('Submission error:', error);
        }
    };
    const handleClose = () => {
        onOpenChange(false);
    };
    if (!isOpen)
        return null;
    return (<div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={handleClose}/>

            {/* ModalContent */}
            <TooltipProvider delayDuration={200}>
                <div className="relative w-full max-w-xl bg-card border shadow-2xl border-primary/10 rounded-3xl md:rounded-[2.5rem] overflow-hidden animate-in zoom-in-95 fade-in duration-500 max-h-[85vh] flex flex-col">
                    <div className="absolute top-5 right-6 z-50">
                        <Button variant="ghost" size="icon" onClick={handleClose} className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20 transition-all">
                            <X className="h-5 w-5"/>
                        </Button>
                    </div>

                    <div className="p-6 md:p-10 pb-5 flex items-center gap-5 border-b border-primary/5 bg-primary/[0.02]">
                        <div className="h-14 w-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
                            <Layers className="h-7 w-7"/>
                        </div>
                        <div>
                            <h3 className="text-2xl md:text-3xl font-black tracking-tighter uppercase italic leading-none mb-1">
                                {category ? 'Refine Collection' : 'Draft Category'}
                            </h3>
                            <p className="text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground opacity-70">
                                {category ? `Editing taxonomy: ${category.id || 'N/A'}` : 'Defining a new collection branch'}
                            </p>
                        </div>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 overflow-hidden flex flex-col">
                            <ScrollArea className="flex-1 h-full w-full overflow-y-auto px-8 md:px-12 py-10">
                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 gap-6">
                                        <FormField control={form.control} name="name" render={({ field }) => (<FormItem className="space-y-3">
                                                    <FormLabel tooltip="The formal title of the category." className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Category Name</FormLabel>
                                                    <FormControl>
                                                        <div className="relative group/field">
                                                            <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within/field:text-primary transition-colors"/>
                                                            <Input placeholder="e.g. Designer Sunglasses" {...field} className="h-11 pl-11 rounded-xl bg-muted/30 border-none font-medium focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"/>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage className="text-[10px] uppercase font-black tracking-widest"/>
                                                </FormItem>)}/>
                                        <FormField control={form.control} name="slug" render={({ field }) => (<FormItem className="space-y-3">
                                                    <FormLabel tooltip="Unique URL identifier." className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Archive Slug</FormLabel>
                                                    <FormControl>
                                                        <div className="relative group/field">
                                                            <Zap className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within/field:text-primary transition-colors"/>
                                                            <Input placeholder="designer-sunglasses" {...field} className="h-11 pl-11 rounded-xl bg-muted/30 border-none font-medium focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"/>
                                                        </div>
                                                    </FormControl>
                                                    <FormMessage className="text-[10px] uppercase font-black tracking-widest"/>
                                                </FormItem>)}/>
                                        <FormField control={form.control} name="image" render={({ field }) => (<FormItem className="space-y-3">
                                                    <FormLabel tooltip="Strategic visual representative for this category." className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Hero Asset URL</FormLabel>
                                                    <FormControl>
                                                        <div className="flex gap-2">
                                                            <div className="relative group/field flex-1">
                                                                <ImageIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within/field:text-primary transition-colors"/>
                                                                <Input placeholder="https://assets.rajuleye.com/..." {...field} value={field.value instanceof File ? field.value.name : field.value || ''} onChange={(e) => {
                field.onChange(e.target.value);
                setImagePreview(e.target.value);
            }} className="h-11 pl-11 rounded-xl bg-muted/30 border-none font-medium focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"/>
                                                            </div>
                                                            <Button type="button" onClick={() => fileInputRef.current?.click()} variant="outline" className="shrink-0 h-11 px-4 rounded-xl border-primary/20 hover:bg-primary/5">
                                                                <Upload className="h-4 w-4 mr-2"/> Upload
                                                            </Button>
                                                            <input type="file" className="hidden" ref={fileInputRef} onChange={handleImageChange} accept="image/*"/>
                                                        </div>
                                                    </FormControl>
                                                    {imagePreview && (<div className="mt-3 relative h-32 w-32 rounded-xl overflow-hidden border border-primary/10">
                                                            <img src={imagePreview.startsWith('http') || imagePreview.startsWith('/') || imagePreview.startsWith('data:') ? imagePreview : `/${imagePreview}`} alt="Preview" className="h-full w-full object-cover" onError={(e) => {
                    e.target.style.display = 'none';
                }} onLoad={(e) => {
                    e.target.style.display = 'block';
                }}/>
                                                            <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6 rounded-full" onClick={() => {
                    setImagePreview(null);
                    field.onChange('');
                    if (fileInputRef.current)
                        fileInputRef.current.value = '';
                }}>
                                                                <X className="h-3 w-3"/>
                                                            </Button>
                                                        </div>)}
                                                    <FormMessage className="text-[10px] uppercase font-black tracking-widest"/>
                                                </FormItem>)}/>
                                        <FormField control={form.control} name="parent" render={({ field }) => (<FormItem className="space-y-3">
                                                    <FormLabel tooltip="Hierarchy position within the collection architecture." className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Parent Nexus</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value || "none"}>
                                                        <FormControl>
                                                            <SelectTrigger className="h-11 rounded-xl bg-muted/30 border-none font-medium focus:ring-2 focus:ring-primary/20 transition-all">
                                                                <SelectValue placeholder="Root Collection"/>
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent className="rounded-xl border-primary/10 shadow-2xl">
                                                            <SelectItem value="none" className="rounded-lg text-[10px] font-black uppercase tracking-widest">Root Collection</SelectItem>
                                                            {categories.filter(c => c.id !== category?.id).map((c) => (<SelectItem key={c.id} value={c.id} className="rounded-lg text-[10px] font-black uppercase tracking-widest">{c.name}</SelectItem>))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage className="text-[10px] uppercase font-black tracking-widest"/>
                                                </FormItem>)}/>
                                        <FormField control={form.control} name="isActive" render={({ field }) => (<FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4 rounded-xl bg-muted/20 border border-primary/5">
                                                    <FormControl>
                                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} className="rounded-md h-5 w-5 border-2 border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"/>
                                                    </FormControl>
                                                    <div className="space-y-1 leading-none">
                                                        <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] cursor-pointer">Catalog Visibility</FormLabel>
                                                        <p className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest opacity-60">Should this category be accessible to global guests?</p>
                                                    </div>
                                                </FormItem>)}/>
                                    </div>
                                </div>
                            </ScrollArea>

                            {/* Footer */}
                            <div className="p-6 md:p-8 border-t border-primary/5 bg-primary/[0.01] flex items-center justify-between">
                                <Button type="button" variant="ghost" onClick={handleClose} className="text-[9px] font-black uppercase tracking-widest hover:text-primary transition-colors">
                                    Discard Fragment
                                </Button>
                                <Button type="submit" disabled={loading} variant="signature" size="lg" className="min-w-[180px]">
                                    {loading ? (<Loader2 className="h-4 w-4 animate-spin"/>) : (<div className="flex items-center gap-2.5">
                                            <div className="flex items-center justify-center h-4 w-4 rounded-full border-2 border-primary-foreground/30">
                                                <div className="h-1 w-1 rounded-full bg-primary-foreground animate-pulse"/>
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Save Blueprint</span>
                                        </div>)}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </TooltipProvider>
        </div>);
}
