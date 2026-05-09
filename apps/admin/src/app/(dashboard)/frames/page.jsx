"use client";
import React, { useState } from "react";
import {
  Plus,
  Edit2,
  Trash2,
  Loader2,
  Glasses,
  ToggleLeft,
  ToggleRight,
  Tag,
  Percent,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/PageHeader";
import {
  useGetFramesQuery,
  useCreateFrameMutation,
  useUpdateFrameMutation,
  useDeleteFrameMutation,
} from "@/store/frameApi";

export default function FramesPage() {
  const { data, isLoading } = useGetFramesQuery();
  const [createFrame, { isLoading: isCreating }] = useCreateFrameMutation();
  const [updateFrame, { isLoading: isUpdating }] = useUpdateFrameMutation();
  const [deleteFrame, { isLoading: isDeleting }] = useDeleteFrameMutation();

  const frames = data?.data || [];

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingFrame, setEditingFrame] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: 0,
    discount: 0,
    isActive: true,
    sortOrder: 0,
  });

  const openAdd = () => {
    setEditingFrame(null);
    setForm({ name: "", description: "", price: 0, discount: 0, isActive: true, sortOrder: frames.length });
    setIsDialogOpen(true);
  };

  const openEdit = (frame) => {
    setEditingFrame(frame);
    setForm({
      name: frame.name,
      description: frame.description || "",
      price: frame.price,
      discount: frame.discount || 0,
      isActive: frame.isActive,
      sortOrder: frame.sortOrder || 0,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFrame) {
        await updateFrame({ id: editingFrame._id, ...form }).unwrap();
        toast.success("Frame updated successfully");
      } else {
        await createFrame(form).unwrap();
        toast.success("Frame created successfully");
      }
      setIsDialogOpen(false);
    } catch (err) {
      toast.error(err?.data?.message || "Failed to save frame");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this frame option?")) return;
    try {
      await deleteFrame(id).unwrap();
      toast.success("Frame deleted");
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete frame");
    }
  };

  const toggleActive = async (frame) => {
    try {
      await updateFrame({ id: frame._id, isActive: !frame.isActive }).unwrap();
      toast.success(frame.isActive ? "Frame hidden" : "Frame activated");
    } catch {
      toast.error("Failed to update frame");
    }
  };

  const discountedPrice = (price, discount) =>
    discount > 0 ? price - (price * discount) / 100 : price;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <PageHeader
        badgeIcon={Glasses}
        badgeText="Frame Catalog"
        titleMain="Frame"
        titleAccent="Options"
        description="Manage frame options available to customers. Each frame has its own price and discount. A free 'Plane Glass' option is always included automatically."
      >
        <Button
          onClick={openAdd}
          variant="signature"
          size="xl"
          className="h-16 md:h-20 w-full sm:w-auto px-8 md:px-10"
        >
          <div className="flex flex-col items-center gap-0.5 md:gap-1">
            <Plus className="h-4 w-4 md:h-5 md:w-5" />
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em]">
              Add Frame
            </span>
          </div>
        </Button>
      </PageHeader>

      {/* Plane Glass Info Card */}
      <div className="mx-4 md:mx-0 p-6 rounded-[2rem] bg-emerald-500/5 border border-emerald-500/20 flex items-center gap-4">
        <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0">
          <Glasses className="h-6 w-6 text-emerald-600" />
        </div>
        <div>
          <p className="font-black text-sm uppercase tracking-widest text-emerald-700 dark:text-emerald-400">
            Plane Glass — Always Free
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            A "Plane Glass (Free)" option is automatically offered to every customer alongside the frames you define below.
          </p>
        </div>
        <div className="ml-auto">
          <span className="px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
            ₹0.00
          </span>
        </div>
      </div>

      {/* Frames Grid */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : frames.length === 0 ? (
        <div
          onClick={openAdd}
          className="mx-4 md:mx-0 p-16 border-2 border-dashed border-muted-foreground/20 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 cursor-pointer hover:bg-muted/30 transition-all opacity-60 hover:opacity-100"
        >
          <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center">
            <Plus className="h-7 w-7 text-muted-foreground" />
          </div>
          <p className="font-black uppercase tracking-widest text-sm">
            Add Your First Frame
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mx-4 md:mx-0">
          {frames.map((frame) => {
            const finalPrice = discountedPrice(frame.price, frame.discount);
            return (
              <div
                key={frame._id}
                className={`group relative p-6 rounded-[2rem] bg-card border shadow-sm transition-all duration-500 hover:shadow-lg ${
                  frame.isActive
                    ? "border-primary/10 hover:border-primary/30"
                    : "border-destructive/10 opacity-60"
                }`}
              >
                {/* Status dot */}
                <div
                  className={`absolute top-5 right-5 h-2.5 w-2.5 rounded-full animate-pulse ${
                    frame.isActive
                      ? "bg-primary shadow-[0_0_8px_rgba(34,197,94,1)]"
                      : "bg-destructive"
                  }`}
                />

                <div className="flex flex-col gap-3">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                    <Glasses className="h-7 w-7 text-primary" />
                  </div>

                  <div>
                    <h3 className="font-black text-lg tracking-tight">{frame.name}</h3>
                    {frame.description && (
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                        {frame.description}
                      </p>
                    )}
                  </div>

                  <div className="flex items-end gap-3 mt-1">
                    <span className="text-2xl font-black tracking-tighter text-primary">
                      ₹{finalPrice.toFixed(2)}
                    </span>
                    {frame.discount > 0 && (
                      <>
                        <span className="text-sm text-muted-foreground/50 line-through font-medium">
                          ₹{frame.price.toFixed(2)}
                        </span>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase tracking-widest">
                          -{frame.discount}%
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex items-center gap-2 pt-2 border-t border-border/50">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary transition-all"
                      onClick={() => openEdit(frame)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary transition-all"
                      onClick={() => toggleActive(frame)}
                    >
                      {frame.isActive ? (
                        <ToggleRight className="h-5 w-5 text-primary" />
                      ) : (
                        <ToggleLeft className="h-5 w-5 text-muted-foreground" />
                      )}
                    </Button>
                    <div className="ml-auto">
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={isDeleting}
                        className="h-10 w-10 rounded-xl hover:bg-destructive/10 hover:text-destructive transition-all"
                        onClick={() => handleDelete(frame._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsDialogOpen(false)}
          />
          <div className="relative w-full max-w-md bg-card border shadow-2xl border-primary/10 rounded-[2rem] overflow-hidden animate-in zoom-in-95 fade-in duration-300">
            <div className="p-6 border-b border-primary/5 bg-primary/2 flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center">
                <Glasses className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-black tracking-tighter uppercase italic">
                  {editingFrame ? "Edit Frame" : "New Frame"}
                </h3>
                <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-70">
                  {editingFrame ? `Editing: ${editingFrame._id}` : "Define a new frame option"}
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Frame Name *
                </label>
                <Input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. C.R.H (Hard Coated)"
                  className="h-11 rounded-xl bg-muted/30 border-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Description
                </label>
                <Input
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Short description of the frame type"
                  className="h-11 rounded-xl bg-muted/30 border-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                    <Tag className="h-3 w-3" /> Price (₹) *
                  </label>
                  <Input
                    required
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="h-11 rounded-xl bg-muted/30 border-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                    <Percent className="h-3 w-3" /> Discount (%)
                  </label>
                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={form.discount}
                    onChange={(e) => setForm({ ...form, discount: Number(e.target.value) })}
                    className="h-11 rounded-xl bg-muted/30 border-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Sort Order
                </label>
                <Input
                  type="number"
                  min="0"
                  value={form.sortOrder}
                  onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
                  className="h-11 rounded-xl bg-muted/30 border-none"
                />
              </div>

              <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/20 border border-primary/5">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                  className="h-5 w-5 rounded-lg accent-primary"
                />
                <label htmlFor="isActive" className="text-sm font-black uppercase tracking-widest cursor-pointer">
                  Active (visible to customers)
                </label>
              </div>

              {/* Preview */}
              {form.price > 0 && (
                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-2">Price Preview</p>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-black text-primary">
                      ₹{discountedPrice(form.price, form.discount).toFixed(2)}
                    </span>
                    {form.discount > 0 && (
                      <>
                        <span className="text-sm line-through text-muted-foreground/50">
                          ₹{Number(form.price).toFixed(2)}
                        </span>
                        <span className="text-[10px] font-black text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                          -{form.discount}% OFF
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setIsDialogOpen(false)}
                  className="text-[9px] font-black uppercase tracking-widest"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="signature"
                  disabled={isCreating || isUpdating}
                  className="min-w-[140px]"
                >
                  {(isCreating || isUpdating) ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : editingFrame ? "Save Changes" : "Create Frame"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
