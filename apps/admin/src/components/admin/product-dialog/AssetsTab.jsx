/* eslint-disable @next/next/no-img-element */
import React from "react";
import { Plus, X } from "lucide-react";
import { FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useWatch, useFormContext } from "react-hook-form";

export function AssetsTab({ control, productId }) {
  const { getValues, setValue } = useFormContext();
  const images = useWatch({ control, name: "images" }) || [];
  const newImages = useWatch({ control, name: "newImages" }) || [];

  const handleFileChange = (e) => {
    if (e.target.files) {
      const current = getValues("newImages") || [];
      setValue("newImages", [...current, ...Array.from(e.target.files)], { shouldDirty: true });
    }
  };

  const removeSelectedFile = (index) => {
    const current = getValues("newImages") || [];
    setValue("newImages", current.filter((_, i) => i !== index), { shouldDirty: true });
  };

  const removeExistingImage = (index) => {
    const currentImages = getValues("images") || [];
    const newImages = currentImages.filter((_, i) => i !== index);
    setValue("images", newImages, { shouldValidate: true, shouldDirty: true });
  };


  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-left-4 duration-500">
      <div className="space-y-4">
        <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
          Visual Archive / Gallery
        </FormLabel>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {/* Existing Images */}
          {images.map((img, i) => (
            <div
              key={i}
              className="relative group aspect-square rounded-3xl overflow-hidden border-2 border-primary/5 bg-muted/30 hover:border-primary/20 transition-all duration-500"
            >
              <img
                src={img}
                alt={`Asset ${i}`}
                className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Button
                  type="button"
                  onClick={() => removeExistingImage(i)}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg text-white hover:bg-destructive transition-colors"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}

          {/* Pending Uploads */}
          {newImages.map((file, i) => (
            <div
              key={`new-${i}`}
              className="relative group aspect-square rounded-3xl overflow-hidden border-2 border-primary/20 bg-primary/5 transition-all duration-500"
            >
              <img
                src={URL.createObjectURL(file)}
                alt="Pending"
                className="h-full w-full object-cover opacity-60"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <Button
                  type="button"
                  onClick={() => removeSelectedFile(i)}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg text-white hover:bg-destructive transition-colors bg-black/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-primary text-[8px] font-black uppercase tracking-widest text-primary-foreground">
                Pending
              </div>
            </div>
          ))}

          {/* Add Button */}
          <label className="aspect-square rounded-3xl border-2 border-dashed border-primary/20 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-primary/5 hover:border-primary/40 transition-all duration-500 group">
            <input
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
              <Plus className="h-5 w-5" />
            </div>
            <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
              Add Asset
            </span>
          </label>
        </div>
      </div>

      {newImages.length > 0 && (
        <div className="flex items-center gap-3 p-4 rounded-3xl bg-primary/5 border border-primary/10">
          <div className="h-8 w-8 rounded-xl bg-primary/20 text-primary flex items-center justify-center shrink-0">
            <Plus className="h-4 w-4" />
          </div>
          <p className="text-[9px] font-black uppercase tracking-widest text-primary">
            {newImages.length} asset(s) queued. They will be uploaded when you save the signature.
          </p>
        </div>
      )}
    </div>
  );
}
