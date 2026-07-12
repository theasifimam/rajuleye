/* eslint-disable @next/next/no-img-element */
import React, { useRef } from "react";
import { Plus, X, Box, Trash2, CheckCircle2, Loader2 } from "lucide-react";
import { FormLabel } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { useWatch, useFormContext } from "react-hook-form";
import { useUploadArModelMutation, useDeleteArModelMutation } from "@/store/productApi";
import { toast } from "sonner";

export function AssetsTab({ control, productId }) {
  const { getValues, setValue } = useFormContext();
  const images = useWatch({ control, name: "images" }) || [];
  const newImages = useWatch({ control, name: "newImages" }) || [];
  const arModelUrl = useWatch({ control, name: "arModelUrl" });

  const arFileRef = useRef(null);

  const [uploadArModel, { isLoading: isUploadingAr }] = useUploadArModelMutation();
  const [deleteArModel, { isLoading: isDeletingAr }] = useDeleteArModelMutation();

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

  const handleArFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!productId) {
      toast.error("Save the product first before uploading an AR model.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("arModel", file);
      const result = await uploadArModel({ id: productId, body: formData }).unwrap();
      setValue("arModelUrl", result.data.arModelUrl, { shouldDirty: true });
      toast.success("AR model uploaded successfully!");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to upload AR model");
    }
    // reset input
    e.target.value = "";
  };

  const handleArDelete = async () => {
    if (!productId) return;
    if (!window.confirm("Remove the AR model from this product?")) return;
    try {
      await deleteArModel(productId).unwrap();
      setValue("arModelUrl", null, { shouldDirty: true });
      toast.success("AR model removed.");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to remove AR model");
    }
  };

  const arFileName = arModelUrl ? arModelUrl.split("/").pop() : null;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-left-4 duration-500">
      {/* ── Product Images ── */}
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

      {/* ── AR Try-On Model ── */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <FormLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
            AR Try-On Model
          </FormLabel>
          <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest">
            GLB / GLTF
          </span>
        </div>

        {arModelUrl ? (
          /* Model already uploaded */
          <div className="flex items-center gap-4 p-5 rounded-3xl bg-primary/5 border-2 border-primary/20">
            <div className="h-12 w-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-black uppercase tracking-widest text-primary">
                AR Model Ready
              </p>
              <p className="text-[9px] text-muted-foreground font-medium mt-0.5 truncate">
                {arFileName}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              {/* Replace */}
              <label>
                <input
                  ref={arFileRef}
                  type="file"
                  accept=".glb,.gltf"
                  className="hidden"
                  onChange={handleArFileUpload}
                  disabled={isUploadingAr || !productId}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-9 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-primary/10 hover:text-primary cursor-pointer"
                  onClick={() => arFileRef.current?.click()}
                  disabled={isUploadingAr || !productId}
                >
                  {isUploadingAr ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : "Replace"}
                </Button>
              </label>
              {/* Delete */}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-xl hover:bg-destructive/10 hover:text-destructive"
                onClick={handleArDelete}
                disabled={isDeletingAr}
              >
                {isDeletingAr ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Trash2 className="h-3.5 w-3.5" />
                )}
              </Button>
            </div>
          </div>
        ) : (
          /* No model yet */
          <label className={`block ${!productId ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}>
            <input
              type="file"
              accept=".glb,.gltf"
              className="hidden"
              onChange={handleArFileUpload}
              disabled={isUploadingAr || !productId}
            />
            <div className="flex flex-col items-center gap-3 p-8 rounded-3xl border-2 border-dashed border-primary/20 hover:border-primary/40 hover:bg-primary/5 transition-all duration-500 group">
              {isUploadingAr ? (
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              ) : (
                <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Box className="h-7 w-7" />
                </div>
              )}
              <div className="text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-foreground">
                  {isUploadingAr ? "Uploading…" : "Upload AR Frame Model"}
                </p>
                <p className="text-[9px] text-muted-foreground mt-1">
                  {productId
                    ? "Accepts .glb or .gltf files up to 100 MB"
                    : "Save the product first, then upload the AR model"}
                </p>
              </div>
            </div>
          </label>
        )}

        {/* Info box */}
        <div className="p-4 rounded-2xl bg-muted/30 border border-primary/5 space-y-1.5">
          <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
            How to create your AR glasses model
          </p>
          <ul className="text-[9px] text-muted-foreground/70 font-medium space-y-1 list-disc list-inside">
            <li>
              <strong>KIRI Engine</strong> (Android/iOS, free) — photogrammetry from photos → exports GLB
            </li>
            <li>
              <strong>Polycam</strong> (iOS, free tier) — LiDAR or photo mode → exports GLB/GLTF
            </li>
            <li>
              <strong>Scaniverse</strong> (iOS, free) — 3D scan → exports GLB
            </li>
            <li>
              For best results: use matte-coated glasses on a plain white background
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
