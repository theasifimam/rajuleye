"use client";
import React, { useEffect, useState } from "react";
import {
  Save,
  Store,
  Palette,
  Type,
  AlignLeft,
  Image as ImageIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  useGetSettingQuery,
  useUpdateSettingMutation,
} from "@/store/settingApi";
import { toast } from "sonner";

export default function SettingsPage() {
  const { data, isLoading } = useGetSettingQuery();
  const [updateSetting, { isLoading: isUpdating }] = useUpdateSettingMutation();
  const [previewImage, setPreviewImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  const [formData, setFormData] = useState({
    primaryColor: "#000000",
    homePageHeadingTitle: "",
    description: "",
  });

  useEffect(() => {
    if (data?.success && data?.data) {
      setFormData({
        primaryColor: data.data.primaryColor || "#000000",
        homePageHeadingTitle: data.data.homePageHeadingTitle || "",
        description: data.data.description || "",
      });
      setPreviewUrl(data.data.previewImage || "");
    }
  }, [data]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreviewImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const submitData = new FormData();
      submitData.append("primaryColor", formData.primaryColor);
      submitData.append("homePageHeadingTitle", formData.homePageHeadingTitle);
      submitData.append("description", formData.description);
      if (previewImage) {
        submitData.append("previewImage", previewImage);
      }

      const res = await updateSetting(submitData).unwrap();
      if (res.success) {
        toast.success("Website settings updated successfully");
      }
    } catch (error) {
      toast.error(error?.data?.message || "Failed to update settings");
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8 md:space-y-12 pb-10">
      {/* Premium Hero Section */}
      <div className="relative p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] bg-linear-to-br from-primary/10 via-background to-background border border-primary/20 overflow-hidden group mx-4 md:mx-0">
        <div className="absolute top-0 right-0 w-64 h-64 md:w-80 md:h-80 bg-primary/10 rounded-full -mr-24 -mt-24 md:-mr-32 md:-mt-32 blur-[80px] md:blur-[100px] animate-pulse" />
        <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-4">
              <Store className="h-3 w-3" /> Website Configuration
            </div>
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-4 italic leading-none">
              Storefront <br />
              <span className="text-primary not-italic">Settings</span>
            </h2>
            <p className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-[10px] max-w-md leading-relaxed">
              Configure the visual identity, meta information, and global
              appearance of your customer-facing web application.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Button
              type="submit"
              disabled={isUpdating}
              variant="signature"
              size="xl"
              className="h-16 md:h-20 w-full sm:w-auto"
            >
              <div className="flex flex-col items-center gap-0.5 md:gap-1">
                {isUpdating ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                ) : (
                  <Save className="h-4 w-4 md:h-5 md:w-5 group-hover/btn:scale-125 transition-transform duration-500" />
                )}
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.25em]">
                  {isUpdating ? "Saving..." : "Commit Changes"}
                </span>
              </div>
            </Button>
          </div>
        </div>
      </div>

      <div className="px-4 md:px-0">
        <div className="p-6 md:p-10 rounded-[2rem] md:rounded-[3.5rem] bg-card border shadow-sm border-primary/5 space-y-8 md:space-y-10 group/section max-w-4xl">
          <div className="flex items-center gap-4 md:gap-5">
            <div className="h-12 w-12 md:h-14 md:w-14 rounded-xl md:rounded-2xl bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shadow-inner group-hover/section:scale-110 transition-transform">
              <Palette className="h-6 w-6 md:h-7 md:w-7" />
            </div>
            <div>
              <h3 className="text-lg md:text-xl font-black tracking-tight uppercase italic leading-none mb-1">
                Brand Identity
              </h3>
              <p className="text-[9px] md:text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">
                Global colors & aesthetics
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 pt-2 md:pt-4">
            <div className="space-y-2 md:space-y-3">
              <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
                Primary Color
              </label>
              <div className="relative group/input flex items-center gap-4">
                <div className="absolute inset-x-0 bottom-0 h-[2px] bg-primary scale-x-0 group-focus-within/input:scale-x-100 transition-transform origin-left z-10" />
                <input
                  type="color"
                  name="primaryColor"
                  value={formData.primaryColor}
                  onChange={handleChange}
                  className="h-14 w-14 rounded-lg cursor-pointer border-none bg-transparent"
                />
                <Input
                  type="text"
                  name="primaryColor"
                  value={formData.primaryColor}
                  onChange={handleChange}
                  className="h-14 md:h-16 flex-1 rounded-xl md:rounded-2xl bg-muted/20 border-none px-6 md:px-8 font-black tracking-tight text-base md:text-lg shadow-sm focus-visible:ring-0 uppercase"
                />
              </div>
            </div>

            <div className="space-y-2 md:space-y-3">
              <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
                Home Page Heading
              </label>
              <div className="relative group/input">
                <div className="absolute inset-x-0 bottom-0 h-[2px] bg-primary scale-x-0 group-focus-within/input:scale-x-100 transition-transform origin-left z-10" />
                <Input
                  name="homePageHeadingTitle"
                  value={formData.homePageHeadingTitle}
                  onChange={handleChange}
                  placeholder="e.g. See The World Clearly"
                  className="h-14 md:h-16 rounded-xl md:rounded-2xl bg-muted/20 border-none px-6 md:px-8 font-black tracking-tight text-base md:text-lg shadow-sm focus-visible:ring-0"
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-2 md:space-y-3">
              <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
                Website Description (SEO & Hero)
              </label>
              <div className="relative group/input">
                <div className="absolute inset-x-0 bottom-0 h-[2px] bg-primary scale-x-0 group-focus-within/input:scale-x-100 transition-transform origin-left z-10" />
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Brief description of your store..."
                  className="w-full h-32 md:h-40 p-6 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] bg-muted/20 border-none font-black italic tracking-tight text-sm md:text-base shadow-sm focus:ring-0 outline-none resize-none leading-relaxed"
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-2 md:space-y-3">
              <label className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">
                Website Preview / Hero Image
              </label>
              <div className="relative group/input">
                <label className="flex flex-col items-center justify-center w-full h-64 md:h-80 border-2 border-dashed border-primary/20 rounded-[2rem] cursor-pointer bg-muted/10 hover:bg-muted/30 hover:border-primary/50 transition-all overflow-hidden relative">
                  {previewUrl ? (
                    <div className="absolute inset-0">
                      <img
                        src={
                          previewUrl.startsWith("blob:")
                            ? previewUrl
                            : previewUrl.startsWith("http")
                              ? previewUrl
                              : `http://localhost:5000${previewUrl}`
                        }
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                        <p className="text-white font-bold uppercase tracking-widest text-xs flex items-center gap-2">
                          <ImageIcon className="h-4 w-4" /> Change Image
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-muted-foreground group-hover:text-primary transition-colors">
                      <ImageIcon className="w-10 h-10 mb-4" />
                      <p className="text-sm font-bold mb-2">
                        Click to upload preview image
                      </p>
                      <p className="text-[10px] uppercase tracking-widest opacity-60">
                        PNG, JPG or WEBP
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
