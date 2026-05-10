/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  XCircle,
  Package,
  Layers,
  TrendingUp,
  Boxes,
  AlertCircle,
  ArrowRight,
  Loader2,
  FileUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
const ProductDialog = dynamic(
  () =>
    import("@/components/admin/ProductDialog").then((mod) => mod.ProductDialog),
  { ssr: false },
);
const BulkImportDialog = dynamic(
  () =>
    import("@/components/admin/BulkImportDialog").then(
      (mod) => mod.BulkImportDialog,
    ),
  { ssr: false },
);
import { cn } from "@/lib/utils";
import {
  useGetProductsQuery,
  useDeleteProductMutation,
} from "@/store/productApi";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/PageHeader";
import { Pagination } from "@/components/admin/Pagination";
import { useDebounce } from "@/hooks/useDebounce";

export default function ProductsPage() {
  const [productSearchTerm, setProductSearchTerm] = useState("");
  const debouncedSearch = useDebounce(productSearchTerm, 500);
  const [page, setPage] = useState(1);

  // RTK Query
  const {
    data: productsData,
    isLoading,
    isError,
    error,
  } = useGetProductsQuery({
    page,
    search: debouncedSearch,
    limit: 10,
  });

  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const products = React.useMemo(
    () => productsData?.data?.products || [],
    [productsData],
  );

  const pagination = React.useMemo(
    () => productsData?.data?.pagination,
    [productsData],
  );

  // Dialog States
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false);
  const [isBulkImportDialogOpen, setIsBulkImportDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const openAddProductDialog = () => {
    setEditingProduct(null);
    setIsProductDialogOpen(true);
  };

  const openEditProductDialog = (product) => {
    setEditingProduct(product);
    setIsProductDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id).unwrap();
        toast.success("Product deleted successfully");
      } catch (err) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        toast.error(err?.data?.message || "Failed to delete product");
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
        <p className="font-bold uppercase tracking-widest text-[10px]">
          Failed to load products
        </p>
        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
        <p className="text-sm font-medium">
          {error?.data?.message || "Something went wrong"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-700 outline-none">
      <PageHeader
        badgeIcon={Package}
        badgeText="Inventory Command"
        titleMain="The Product"
        titleAccent="Archive"
        description="Managing the blueprint of precision. Every lens, frame, and accessory meticulously cataloged for global distribution."
      >
        <div className="h-16 md:h-20 px-6 md:px-8 rounded-2xl md:rounded-[2rem] bg-card/80 backdrop-blur-md border-2 border-primary/10 shadow-sm flex flex-col justify-center gap-0.5 md:gap-1 min-w-[180px] md:min-w-[200px] hover:border-primary/30 transition-all duration-500">
          <p className="text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap">
            Active SKU Count
          </p>
          <div className="flex items-end justify-between">
            <h4 className="text-xl md:text-2xl font-black italic leading-none">
              {pagination?.total || 0}
            </h4>
            <div className="flex items-center gap-1 text-primary text-[9px] md:text-[10px] font-black italic uppercase">
              <TrendingUp className="h-3 w-3" /> Alpha
            </div>
          </div>
        </div>
        <Button
          onClick={() => setIsBulkImportDialogOpen(true)}
          variant="outline"
          size="xl"
          className="h-16 md:h-20 w-full sm:w-auto px-8 md:px-10 rounded-2xl md:rounded-[2rem] border-2 group/bulk"
        >
          <div className="flex flex-col items-center gap-0.5 md:gap-1">
            <FileUp className="h-4 w-4 md:h-5 md:w-5 group-hover/bulk:translate-y-[-2px] transition-transform duration-500" />
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.25em]">
              Bulk Archive Import
            </span>
          </div>
        </Button>
        <Button
          onClick={openAddProductDialog}
          variant="signature"
          size="xl"
          className="h-16 md:h-20 w-full sm:w-auto px-8 md:px-10"
        >
          <div className="flex flex-col items-center gap-0.5 md:gap-1">
            <Plus className="h-4 w-4 md:h-5 md:w-5 group-hover/btn:rotate-90 transition-transform duration-500" />
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.25em]">
              Add Products
            </span>
          </div>
        </Button>
      </PageHeader>

      {/* Products Table */}
      <div className="rounded-[3rem] bg-card border shadow-md border-primary/5 overflow-hidden relative mx-4 md:mx-0">
        {/* Filters Bar */}
        <div className="flex flex-col md:flex-row items-center gap-4 p-4 backdrop-blur-md mx-4 md:mx-0">
          <div className="relative flex-1 w-full group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search by product name, ID or category..."
              className="h-11 md:h-12 w-full pl-12 pr-4 bg-muted/20 border-none rounded-2xl font-bold text-sm focus-visible:ring-2 focus-visible:ring-primary/20"
              value={productSearchTerm}
              onChange={(e) => setProductSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b bg-muted/10">
                <th className="p-4 md:p-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 w-24 text-center">
                  Preview
                </th>
                <th className="p-4 md:p-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">
                  Product DNA
                </th>
                <th className="p-4 md:p-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">
                  Category
                </th>
                <th className="p-4 md:p-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">
                  Stock Status
                </th>
                <th className="p-4 md:p-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">
                  MSRP
                </th>
                <th className="p-4 md:p-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60">
                  Visibility
                </th>
                <th className="p-4 md:p-6 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-primary/5">
              {products.map((product) => (
                <tr
                  key={product._id}
                  className="group hover:bg-primary/3 transition-all duration-500"
                >
                  <td className="p-4 md:p-6">
                    <div className="relative h-20 w-20 mx-auto">
                      <div className="absolute inset-0 bg-primary/10 blur-xl rounded-full scale-75 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="relative h-full w-full rounded-2xl overflow-hidden border border-white/10 shadow-sm bg-muted shrink-0 z-10">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="h-full w-full object-cover group-hover:scale-125 transition-transform duration-700"
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center">
                            <Package className="h-8 w-8 text-muted-foreground/20" />
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 md:p-6">
                    <div className="max-w-[200px]">
                      <p className="font-black text-[13px] uppercase tracking-tight line-height-1 mb-1 leading-none">
                        {product.name}
                      </p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 opacity-60">
                        <Layers className="h-3 w-3" /> {product.sku}
                      </p>
                    </div>
                  </td>
                  <td className="p-4 md:p-6">
                    <span className="px-4 py-1.5 rounded-xl bg-muted/50 border border-primary/5 text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground group-hover:text-primary transition-colors">
                      {typeof product.category === "object"
                        ? product.category.name
                        : product.category}
                    </span>
                  </td>
                  <td className="p-4 md:p-6">
                    <div className="flex flex-col gap-2 min-w-[120px]">
                      <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                        <span
                          className={cn(
                            product.stock > 10
                              ? "text-primary"
                              : product.stock > 0
                                ? "text-orange-500"
                                : "text-destructive",
                          )}
                        >
                          {product.stock} units
                        </span>
                        <span className="opacity-30">/ Max</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-1000 ease-out",
                            product.stock > 10
                              ? "bg-primary shadow-[0_0_8px_rgba(34,197,94,0.5)]"
                              : product.stock > 0
                                ? "bg-orange-500"
                                : "bg-destructive shadow-[0_0_8px_rgba(239,68,68,0.5)]",
                          )}
                          style={{
                            width: `${Math.min((product.stock / 50) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="p-4 md:p-6">
                    <span className="text-sm font-black italic tracking-tighter">
                      ₹{product.price.toFixed(2)}
                    </span>
                  </td>
                  <td className="p-4 md:p-6">
                    <div
                      className={cn(
                        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border",
                        product.isActive
                          ? "bg-primary/5 text-primary border-primary/20"
                          : "bg-destructive/5 text-destructive border-destructive/20",
                      )}
                    >
                      <div
                        className={cn(
                          "h-1.5 w-1.5 rounded-full animate-pulse",
                          product.isActive
                            ? "bg-primary shadow-[0_0_8px_rgba(34,197,94,1)]"
                            : "bg-destructive shadow-[0_0_8px_rgba(239,68,68,1)]",
                        )}
                      />
                      {product.isActive ? "Active" : "Inactive"}
                    </div>
                  </td>
                  <td className="p-4 md:p-6 text-right">
                    <div className="flex items-center justify-end gap-2 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditProductDialog(product)}
                        className="h-12 w-12 rounded-xl hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20 transition-all"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        disabled={isDeleting}
                        onClick={() => handleDelete(product._id)}
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

        {/* Pagination */}
        <div className="p-4 md:p-6 border-t border-primary/5 bg-primary/1 flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground text-center sm:text-left">
            Catalog sync: {products.length} verified units from{" "}
            {pagination?.total || 0} total
          </p>
          <Pagination
            currentPage={page}
            totalPages={pagination?.pages || 1}
            onPageChange={setPage}
          />
        </div>
      </div>

      <ProductDialog
        isOpen={isProductDialogOpen}
        onOpenChange={setIsProductDialogOpen}
        product={editingProduct}
      />

      <BulkImportDialog
        isOpen={isBulkImportDialogOpen}
        onOpenChange={setIsBulkImportDialogOpen}
      />
    </div>
  );
}
