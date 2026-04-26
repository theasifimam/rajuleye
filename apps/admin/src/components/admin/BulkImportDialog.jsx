'use client';
import React, { useState, useRef } from 'react';
import { FileSpreadsheet, ImagePlus, Upload, CheckCircle2, AlertCircle, Loader2, X, FileUp, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useBulkImportProductsMutation, useBulkUploadImagesMutation } from '@/store/productApi';
import { ScrollArea } from "@/components/ui/scroll-area";
import * as xlsx from 'xlsx';
export function BulkImportDialog({ isOpen, onOpenChange }) {
    const [bulkImport, { isLoading: isImporting }] = useBulkImportProductsMutation();
    const [bulkUploadImages, { isLoading: isUploadingImages }] = useBulkUploadImagesMutation();
    const [excelFile, setExcelFile] = useState(null);
    const [imageFiles, setImageFiles] = useState([]);
    const [autoMatch] = useState(true);
    const [results, setResults] = useState(null);
    const excelInputRef = useRef(null);
    const imageInputRef = useRef(null);
    const handleExcelChange = (e) => {
        if (e.target.files?.[0]) {
            setExcelFile(e.target.files[0]);
            setResults(null);
        }
    };
    const handleImageChange = (e) => {
        if (e.target.files) {
            setImageFiles(Array.from(e.target.files));
            setResults(null);
        }
    };
    const handleImport = async () => {
        if (!excelFile) {
            toast.error('Please select an Excel file');
            return;
        }
        const formData = new FormData();
        formData.append('excel', excelFile);
        try {
            const res = await bulkImport(formData).unwrap();
            setResults(res.data);
            toast.success('Bulk import successful');
            setExcelFile(null);
            if (excelInputRef.current)
                excelInputRef.current.value = '';
        }
        catch (err) {
            toast.error(err?.data?.message || 'Import failed');
        }
    };
    const handleUploadImages = async () => {
        if (imageFiles.length === 0) {
            toast.error('Please select images');
            return;
        }
        const formData = new FormData();
        imageFiles.forEach(file => formData.append('images', file));
        try {
            const res = await bulkUploadImages({ body: formData, autoMatch }).unwrap();
            toast.success(`Uploaded ${imageFiles.length} images. ${res.data.autoMatched} auto-matched!`);
            setImageFiles([]);
            if (imageInputRef.current)
                imageInputRef.current.value = '';
        }
        catch (err) {
            toast.error(err?.data?.message || 'Upload failed');
        }
    };
    const downloadTemplate = () => {
        const template = [
            {
                name: 'Example Product',
                sku: 'SKU123',
                description: 'Full description here',
                brand: 'Rajul Eye',
                category: 'Sunglasses',
                type: 'sunglasses',
                price: 199.99,
                stock: 50,
                discount: 10,
                gender: 'unisex',
                images: 'url1, url2',
                tags: 'tag1, tag2',
                lensWidth: 50,
                bridge: 20,
                templeLength: 140,
                frameWidth: 135
            }
        ];
        const ws = xlsx.utils.json_to_sheet(template);
        const wb = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb, ws, "Template");
        xlsx.writeFile(wb, "Product_Import_Template.xlsx");
    };
    if (!isOpen)
        return null;
    return (<div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => onOpenChange(false)}/>

            <div className="relative w-full max-w-4xl bg-card border shadow-2xl border-primary/10 rounded-[2.5rem] overflow-hidden animate-in zoom-in-95 fade-in duration-500 max-h-[90vh] flex flex-col">
                <div className="absolute top-5 right-6 z-50">
                    <Button variant="ghost" size="icon" onClick={() => onOpenChange(false)} className="h-10 w-10 rounded-xl">
                        <X className="h-5 w-5"/>
                    </Button>
                </div>

                <div className="p-8 pb-4 flex items-center gap-5 border-b border-primary/5 bg-primary/[0.02]">
                    <div className="h-14 w-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
                        <FileUp className="h-7 w-7"/>
                    </div>
                    <div>
                        <h3 className="text-2xl font-black tracking-tighter uppercase italic leading-none mb-1">Bulk Command Center</h3>
                        <p className="text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground opacity-70">Scale your inventory with industrial precision</p>
                    </div>
                </div>

                <ScrollArea className="flex-1 p-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Step 1: Bulk Images */}
                        <div className="space-y-6 p-6 rounded-[2rem] bg-muted/20 border border-primary/5">
                            <div className="flex items-center gap-3 mb-2">
                                <ImagePlus className="h-5 w-5 text-primary"/>
                                <h4 className="text-sm font-black uppercase tracking-widest italic">1. Batch Asset Intake</h4>
                            </div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase leading-relaxed">
                                Upload up to 50 assets. If files are named by <b>SKU</b> (e.g., <code className="text-primary">SKU123.jpg</code>), they will auto-link to blueprints.
                            </p>

                            <div onClick={() => imageInputRef.current?.click()} className="cursor-pointer group flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-primary/10 rounded-2xl hover:border-primary/30 hover:bg-primary/[0.02] transition-all">
                                <Upload className="h-8 w-8 text-muted-foreground/30 group-hover:text-primary transition-colors"/>
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                    {imageFiles.length > 0 ? `${imageFiles.length} assets staged` : 'Select high-res assets'}
                                </span>
                                <input type="file" ref={imageInputRef} className="hidden" multiple accept="image/*" onChange={handleImageChange}/>
                            </div>

                            <Button onClick={handleUploadImages} disabled={imageFiles.length === 0 || isUploadingImages} className="w-full h-12 rounded-xl group" variant="outline">
                                {isUploadingImages ? <Loader2 className="h-4 w-4 animate-spin"/> : 'Sync Staged Assets'}
                            </Button>
                        </div>

                        {/* Step 2: Excel Import */}
                        <div className="space-y-6 p-6 rounded-[2rem] bg-muted/20 border border-primary/5">
                            <div className="flex items-center gap-3 mb-2">
                                <FileSpreadsheet className="h-5 w-5 text-primary"/>
                                <h4 className="text-sm font-black uppercase tracking-widest italic">2. Blueprint Injection</h4>
                            </div>
                            <div className="flex flex-col gap-2">
                                <p className="text-[10px] font-bold text-muted-foreground uppercase leading-relaxed">
                                    Inject multi-row product data via spreadsheet. Use our master template for perfect alignment.
                                </p>
                                <Button variant="link" className="p-0 h-auto w-fit text-primary font-black uppercase text-[9px] tracking-widest" onClick={downloadTemplate}>
                                    <Download className="h-3 w-3 mr-1"/> Get Master Template
                                </Button>
                            </div>

                            <div onClick={() => excelInputRef.current?.click()} className="cursor-pointer group flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-primary/10 rounded-2xl hover:border-primary/30 hover:bg-primary/[0.02] transition-all">
                                <Upload className="h-8 w-8 text-muted-foreground/30 group-hover:text-primary transition-colors"/>
                                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                    {excelFile ? excelFile.name : 'Staging blueprint spreadsheet'}
                                </span>
                                <input type="file" ref={excelInputRef} className="hidden" accept=".xlsx, .xls" onChange={handleExcelChange}/>
                            </div>

                            <Button onClick={handleImport} disabled={!excelFile || isImporting} className="w-full h-12 rounded-xl" variant="signature">
                                {isImporting ? <Loader2 className="h-4 w-4 animate-spin"/> : 'Execute Injection'}
                            </Button>
                        </div>
                    </div>

                    {/* Results Display */}
                    {results && (<div className="mt-8 space-y-4 animate-in slide-in-from-bottom-4 duration-500">
                            <div className="flex items-center gap-4 p-6 rounded-2xl bg-card border border-primary/10 shadow-sm">
                                <div className="flex-1 grid grid-cols-3 gap-4">
                                    <div className="text-center">
                                        <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-1">Born</p>
                                        <h5 className="text-lg font-black text-primary italic leading-none">{results.created}</h5>
                                    </div>
                                    <div className="text-center border-x border-primary/5">
                                        <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-1">Refined</p>
                                        <h5 className="text-lg font-black text-orange-500 italic leading-none">{results.updated}</h5>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground mb-1">Offline</p>
                                        <h5 className="text-lg font-black text-destructive italic leading-none">{results.failed}</h5>
                                    </div>
                                </div>
                                <CheckCircle2 className="h-8 w-8 text-primary/40"/>
                            </div>

                            {results.errors.length > 0 && (<div className="p-6 rounded-[1.5rem] bg-destructive/5 border border-destructive/10">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-destructive mb-3 flex items-center gap-2">
                                        <AlertCircle className="h-3 w-3"/> Malfunction Log
                                    </p>
                                    <div className="space-y-2 max-h-40 overflow-y-auto pr-2">
                                        {results.errors.map((err, idx) => (<div key={idx} className="flex items-center justify-between text-[10px] font-bold border-b border-destructive/5 pb-2">
                                                <span className="uppercase text-muted-foreground">SKU: {err.sku || 'N/A'}</span>
                                                <span className="text-destructive font-black italic">{err.error}</span>
                                            </div>))}
                                    </div>
                                </div>)}
                        </div>)}
                </ScrollArea>
            </div>
        </div>);
}
