import React from "react";
import { Tag, Zap, Layers, Settings2 } from "lucide-react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export function GeneralTab({ control, categories }) {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <FormField
          control={control}
          name="category"
          render={({ field }) => {
            const selectedCat = categories.find(c => String(c._id) === String(field.value));
            const displayText = selectedCat?.name || "";
            return (
              <FormItem className="space-y-3">
                <FormLabel
                  tooltip="The parent archival collection this piece belongs to."
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1"
                >
                  Archive Collection / Category
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <select
                      value={field.value || ""}
                      onChange={(e) => field.onChange(e.target.value)}
                      className="h-11 w-full appearance-none rounded-2xl bg-muted/30 border-none font-medium px-5 text-xs transition-all cursor-pointer focus:ring-2 focus:ring-primary/20 focus:outline-none"
                      style={{ color: field.value ? 'inherit' : 'var(--muted-foreground)' }}
                    >
                      <option value="" disabled>
                        Select Category
                      </option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={String(cat._id)}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                  </div>
                </FormControl>
                <FormMessage className="text-[10px] uppercase font-black tracking-widest" />
              </FormItem>
            );
          }}
        />
        <FormField
          control={control}
          name="name"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel
                tooltip="The public title of the product as it appears in the catalog."
                className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1"
              >
                Product Name
              </FormLabel>
              <FormControl>
                <div className="relative group/field">
                  <Tag className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within/field:text-primary transition-colors" />
                  <Input
                    placeholder="e.g. Aether Gold Aviators"
                    {...field}
                    className="h-11 pl-11 rounded-2xl bg-muted/30 border-none font-medium focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"
                  />
                </div>
              </FormControl>
              <FormMessage className="text-[10px] uppercase font-black tracking-widest" />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="slug"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel
                tooltip="The unique URL-friendly identifier. Auto-generated from name if left empty."
                className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1"
              >
                URL Identifier (Slug)
              </FormLabel>
              <FormControl>
                <div className="relative group/field">
                  <Zap className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within/field:text-primary transition-colors" />
                  <Input
                    placeholder="aether-gold-aviators"
                    {...field}
                    className="h-11 pl-11 rounded-2xl bg-muted/30 border-none font-medium focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"
                  />
                </div>
              </FormControl>
              <FormMessage className="text-[10px] uppercase font-black tracking-widest" />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="sku"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel
                tooltip="Stock Keeping Unit. A unique internal code for inventory tracking."
                className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1"
              >
                Master SKU
              </FormLabel>
              <FormControl>
                <div className="relative group/field">
                  <Layers className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within/field:text-primary transition-colors" />
                  <Input
                    placeholder="PRD-VLT-001"
                    {...field}
                    className="h-11 pl-11 rounded-2xl bg-muted/30 border-none font-medium focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"
                  />
                </div>
              </FormControl>
              <FormMessage className="text-[10px] uppercase font-black tracking-widest" />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="brand"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel
                tooltip="The designer or manufacturer of this signature piece."
                className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1"
              >
                Maison / Brand
              </FormLabel>
              <FormControl>
                <div className="relative group/field">
                  <Settings2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within/field:text-primary transition-colors" />
                  <Input
                    placeholder="Rajul Eye"
                    {...field}
                    className="h-11 pl-11 rounded-2xl bg-muted/30 border-none font-medium focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"
                  />
                </div>
              </FormControl>
              <FormMessage className="text-[10px] uppercase font-black tracking-widest" />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={control}
        name="description"
        render={({ field }) => (
          <FormItem className="space-y-3">
            <FormLabel
              tooltip="A detailed narrative describing the essence and craftsmanship of the product."
              className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1"
            >
              Vision Narrative
            </FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe the artistic vision and technical prowess of this piece..."
                className="min-h-[100px] rounded-2xl bg-muted/30 border-none font-medium focus-visible:ring-2 focus-visible:ring-primary/20 p-5 resize-none transition-all"
                {...field}
              />
            </FormControl>
            <FormMessage className="text-[10px] uppercase font-black tracking-widest" />
          </FormItem>
        )}
      />
    </div>
  );
}
