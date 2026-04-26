'use client';
import { useState } from 'react';
import Image from "next/image";
import { Star, Camera, ImagePlus, X, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useCreateReviewMutation } from "@/store/reviewApi";
export function ReviewForm({ user, productId, orderId }) {
    const [userRating, setUserRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewText, setReviewText] = useState("");
    const [reviewImages, setReviewImages] = useState([]);
    const [hasSubmittedRate, setHasSubmittedRate] = useState(false);
    const [createReview, { isLoading }] = useCreateReviewMutation();
    const handleImageUpload = (e) => {
        const files = e.target.files;
        if (files) {
            const newImages = Array.from(files).map(file => ({
                file,
                preview: URL.createObjectURL(file)
            }));
            setReviewImages(prev => [...prev, ...newImages].slice(0, 4));
        }
    };
    const removeImage = (index) => {
        setReviewImages(prev => prev.filter((_, i) => i !== index));
    };
    const handleSubmit = async () => {
        if (userRating === 0) {
            toast.error("Please select a star rating");
            return;
        }
        if (!reviewText.trim()) {
            toast.error("Please write a comment");
            return;
        }
        try {
            const formData = new FormData();
            formData.append('productId', productId);
            formData.append('orderId', orderId);
            formData.append('rating', userRating.toString());
            formData.append('comment', reviewText);
            reviewImages.forEach((img) => {
                formData.append('images', img.file);
            });
            await createReview(formData).unwrap();
            setHasSubmittedRate(true);
            toast.success("Opinion published!");
        }
        catch (error) {
            toast.error(error.data?.message || "Failed to publish review");
        }
    };
    if (hasSubmittedRate) {
        return (<div className="py-12 px-6 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/20 text-center animate-in fade-in zoom-in-95 duration-500">
                <div className="h-16 w-16 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg mb-4">
                    <CheckCircle2 className="h-8 w-8"/>
                </div>
                <h3 className="text-xl font-black mb-2 uppercase tracking-tighter text-emerald-600">Review Published</h3>
                <p className="text-sm text-muted-foreground font-medium max-w-[280px] mx-auto">
                    Thank you for your feedback! Your signature opinion has been added to our gallery.
                </p>
                <Button variant="ghost" className="mt-6 text-[10px] font-black uppercase tracking-widest" onClick={() => setHasSubmittedRate(false)}>
                    Post another review
                </Button>
            </div>);
    }
    return (<div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Your Signature Rating</p>
                    <span className="text-xs font-bold text-muted-foreground">{userRating > 0 ? `${userRating}/5 Stars` : 'Select stars'}</span>
                </div>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (<button key={star} type="button" onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)} onClick={() => setUserRating(star)} className="transition-all duration-300 transform active:scale-90">
                            <Star className={cn("w-8 h-8 xs:w-10 xs:h-10 transition-all duration-300", (hoverRating || userRating) >= star
                ? "fill-primary text-primary"
                : "text-muted-foreground/20")}/>
                        </button>))}
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary ml-1">The Opinion</p>
                    <p className="text-[9px] font-black text-muted-foreground/30 uppercase tracking-widest">{reviewText.length}/500</p>
                </div>
                <div className="relative">
                    <Textarea placeholder="Describe the fit, lens clarity, and overall feel..." className="min-h-[160px] rounded-[2.5rem] bg-muted/20 border-2 border-transparent focus:border-primary/20 focus:bg-background transition-all font-medium text-sm p-6 pr-12 resize-none shadow-inner" value={reviewText} onChange={(e) => setReviewText(e.target.value.slice(0, 500))}/>
                    <div className="absolute top-6 right-6">
                        <Camera className="h-4 w-4 text-muted-foreground/20"/>
                    </div>
                </div>
            </div>

            {/* Image Selector */}
            <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-primary ml-1">Visual Samples</p>
                <div className="flex flex-wrap gap-4">
                    {reviewImages.map((img, i) => (<div key={i} className="relative h-20 w-20 xs:h-24 xs:w-24 rounded-2xl overflow-hidden border border-border group/img shadow-sm hover:shadow-md transition-shadow">
                            <Image src={img.preview} alt="Preview" fill className="object-cover transition-transform group-hover/img:scale-110"/>
                            <button type="button" onClick={() => removeImage(i)} className="absolute top-2 right-2 h-6 w-6 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover/img:opacity-100 transition-all">
                                <X className="h-3 w-3"/>
                            </button>
                        </div>))}

                    {reviewImages.length < 4 && (<label className="h-20 w-20 xs:h-24 xs:w-24 rounded-2xl border-2 border-dashed border-muted-foreground/10 hover:border-primary/30 hover:bg-primary/5 transition-all cursor-pointer flex flex-col items-center justify-center gap-2 group">
                            <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden"/>
                            <ImagePlus className="h-6 w-6 text-muted-foreground/30 group-hover:text-primary transition-colors"/>
                            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/20 group-hover:text-primary/60">Upload</span>
                        </label>)}
                </div>
                <p className="text-[9px] text-muted-foreground/30 font-medium italic">Share up to 4 photos of your frames in different lighting.</p>
            </div>

            <Button onClick={handleSubmit} disabled={isLoading} className="w-full h-16 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] shadow-2xl shadow-primary/20 group relative overflow-hidden bg-primary hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                <span className="relative z-10 flex items-center justify-center gap-3">
                    {isLoading ? "Publishing..." : "Publish Signature Opinion"} <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform"/>
                </span>
            </Button>
        </div>);
}
