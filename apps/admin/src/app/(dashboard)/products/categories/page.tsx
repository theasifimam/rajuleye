/* eslint-disable @typescript-eslint/no-unused-vars, @next/next/no-img-element */
'use client';

import React, { useState } from 'react';

import {
    Search,
    Edit2,
    Trash2,
    ArrowUpDown,
    XCircle,
    Layers,
    Tag,
    Image as ImageIcon,
    TrendingUp,
    Loader2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
const CategoryDialog = dynamic(() => import('@/components/admin/CategoryDialog').then(mod => mod.CategoryDialog), { ssr: false });
import { useGetCategoriesQuery, useDeleteCategoryMutation, type Category } from '@/store/categoryApi';
import { toast } from 'sonner';
import dynamic from 'next/dynamic';

export default function CategoriesPage() {
    const [categorySearchTerm, setCategorySearchTerm] = useState('');
    const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const { data: categoriesData, isLoading, isError, error } = useGetCategoriesQuery({ all: true });
    const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

    const categories = categoriesData?.data || [];

    const openAddCategoryDialog = () => {
        setEditingCategory(null);
        setIsCategoryDialogOpen(true);
    };

    const openEditCategoryDialog = (category: Category) => {
        setEditingCategory(category);
        setIsCategoryDialogOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await deleteCategory(id).unwrap();
                toast.success('Category deleted successfully');
            } catch (err: unknown) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                toast.error((err as any)?.data?.message || 'Failed to delete category');
            }
        }
    };

    if (isLoading) {
        return (
            <div className="flex h-[400px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="flex h-[400px] flex-col items-center justify-center gap-4 text-destructive">
                <XCircle className="h-12 w-12" />
                <p className="font-bold uppercase tracking-widest text-[10px]">Failed to load categories</p>
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                <p className="text-sm font-medium">{(error as any)?.data?.message || 'Something went wrong'}</p>
            </div>
        );
    }

    const filteredCategories = categories.filter(cat =>
        cat.name.toLowerCase().includes(categorySearchTerm.toLowerCase()) ||
        cat.slug.toLowerCase().includes(categorySearchTerm.toLowerCase())
    );

    return (
        <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 outline-none">
            {/* Collection Hero Section */}
            <div className="relative p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] bg-gradient-to-br from-primary/10 via-background to-background border border-primary/20 overflow-hidden group mx-4 md:mx-0">
                <div className="absolute top-0 right-0 w-64 h-64 md:w-80 md:h-80 bg-primary/10 rounded-full -mr-24 -mt-24 md:-mr-32 md:-mt-32 blur-[80px] md:blur-[100px] animate-pulse" />
                <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-8">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-4">
                            <Layers className="h-3 w-3" /> Taxonomy Command
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-4 italic leading-none">
                            The Collection <br />
                            <span className="text-primary not-italic">Taxonomy</span>
                        </h2>
                        <p className="text-muted-foreground font-bold uppercase tracking-[0.2e] text-[9px] md:text-[10px] max-w-md leading-relaxed">
                            Defining the architectural hierarchy of elegance. Structured collections that curate the global Rajul Eye experience.
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                        <div className="h-16 md:h-20 px-6 md:px-8 rounded-2xl md:rounded-[2rem] bg-card/80 backdrop-blur-md border-2 border-primary/10 shadow-sm flex flex-col justify-center gap-0.5 md:gap-1 min-w-[180px] md:min-w-[200px] hover:border-primary/30 transition-all duration-500">
                            <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap">Verified Collections</p>
                            <div className="flex items-end justify-between">
                                <h4 className="text-xl md:text-2xl font-black italic leading-none">{categories.length} Units</h4>
                                <div className="flex items-center gap-1 text-primary text-[9px] md:text-[10px] font-black italic uppercase">
                                    <TrendingUp className="h-3 w-3" /> Alpha
                                </div>
                            </div>
                        </div>
                        <Button
                            onClick={openAddCategoryDialog}
                            variant="signature"
                            size="xl"
                            className="h-16 md:h-20 w-full sm:w-auto"
                        >
                            <div className="flex flex-col items-center gap-0.5 md:gap-1">
                                <Tag className="h-4 w-4 md:h-5 md:w-5 group-hover/btn:scale-110 transition-transform duration-500" />
                                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.25em]">Draft Collection</span>
                            </div>
                        </Button>
                    </div>
                </div>
            </div>

            {/* Taxonomy Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 px-4 md:px-0">
                {[
                    { label: 'Active Clusters', value: '12 Active', icon: Layers, color: 'primary' },
                    { label: 'Deepest Hierarchy', value: '4 Levels', icon: ArrowUpDown, color: 'blue' },
                    { label: 'Hidden Blueprints', value: '2 Hidden', icon: XCircle, color: 'destructive' },
                ].map((stat, i) => (
                    <div key={i} className="p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] bg-card border shadow-sm flex items-center gap-4 md:gap-5 group hover:border-primary/20 transition-all">
                        <div className={cn(
                            "h-10 w-10 md:h-12 md:w-12 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110",
                            stat.color === 'primary' ? "bg-primary text-primary-foreground" :
                                stat.color === 'destructive' ? "bg-destructive/10 text-destructive" : "bg-blue-500/10 text-blue-600"
                        )}>
                            <stat.icon className="h-4 w-4 md:h-5 md:w-5" />
                        </div>
                        <div>
                            <p className="text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-0.5">{stat.label}</p>
                            <h4 className="text-lg md:text-xl font-black italic">{stat.value}</h4>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col md:flex-row items-center gap-4 p-4 rounded-[2rem] bg-card/50 border border-primary/5 backdrop-blur-md mx-4 md:mx-0">
                <div className="relative flex-1 w-full group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <Input
                        placeholder="Search by collection name or slug..."
                        className="h-11 md:h-12 w-full pl-12 pr-4 bg-muted/20 border-none rounded-xl font-bold text-sm focus-visible:ring-2 focus-visible:ring-primary/20"
                        value={categorySearchTerm}
                        onChange={(e) => setCategorySearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Categories Table */}
            <div className="rounded-[3rem] bg-card border shadow-md border-primary/5 overflow-hidden relative mx-4 md:mx-0">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b bg-muted/10">
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 w-24 text-center">Visual</th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Collection Identity</th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Registry Slug</th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Parent Nexus</th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Manifest Count</th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">Status</th>
                                <th className="p-8 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-primary/5">
                            {filteredCategories.map((cat) => (
                                <tr key={cat._id} className="group hover:bg-primary/[0.03] transition-all duration-500">
                                    <td className="p-8">
                                        <div className="relative h-14 w-14 mx-auto">
                                            <div className="absolute inset-0 bg-primary/10 blur-xl rounded-full scale-75 opacity-0 group-hover:opacity-100 transition-opacity" />
                                            <div className="relative h-full w-full rounded-2xl overflow-hidden border border-white/10 shadow-sm bg-muted shrink-0 z-10 flex items-center justify-center">
                                                {cat.image ? (
                                                    <img src={cat.image} alt={cat.name} className="h-full w-full object-cover" />
                                                ) : (
                                                    <ImageIcon className="h-5 w-5 text-muted-foreground/40" />
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-8">
                                        <p className="font-black text-sm uppercase tracking-tight mb-1 leading-none">{cat.name}</p>
                                        <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest italic">{cat._id}</p>
                                    </td>
                                    <td className="p-8">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground bg-muted/30 px-3 py-1 rounded-lg">
                                            /{cat.slug}
                                        </span>
                                    </td>
                                    <td className="p-8">
                                        <span className="text-[10px] font-black uppercase tracking-widest text-primary italic">
                                            {cat.parent ? (typeof cat.parent === 'object' ? cat.parent.name : cat.parent) : 'Root level'}
                                        </span>
                                    </td>
                                    <td className="p-8">
                                        <span className="text-sm font-black italic tracking-tighter">{cat.productsCount || 0}</span>
                                    </td>
                                    <td className="p-8">
                                        <div className={cn(
                                            "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border",
                                            cat.isActive ? "bg-primary/5 text-primary border-primary/20" : "bg-destructive/5 text-destructive border-destructive/20"
                                        )}>
                                            <div className={cn(
                                                "h-1.5 w-1.5 rounded-full animate-pulse",
                                                cat.isActive ? "bg-primary shadow-[0_0_8px_rgba(34,197,94,1)]" : "bg-destructive shadow-[0_0_8px_rgba(239,68,68,1)]"
                                            )} />
                                            {cat.isActive ? 'Active' : 'Hidden'}
                                        </div>
                                    </td>
                                    <td className="p-8 text-right">
                                        <div className="flex items-center justify-end gap-2 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => openEditCategoryDialog(cat)}
                                                className="h-12 w-12 rounded-xl hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20 transition-all"
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                disabled={isDeleting}
                                                onClick={() => handleDelete(cat._id)}
                                                className="h-12 w-12 rounded-xl hover:bg-destructive/10 hover:text-destructive border border-transparent hover:border-destructive/20 transition-all"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <CategoryDialog
                isOpen={isCategoryDialogOpen}
                onOpenChange={setIsCategoryDialogOpen}
                category={editingCategory}
                categories={categories.map(c => ({ id: c._id, name: c.name }))}
            />
        </div>
    );
}
