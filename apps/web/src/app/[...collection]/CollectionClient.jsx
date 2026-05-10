"use client";
import { Suspense } from "react";
import { CatalogView } from "@/components/product/CatalogView";
import { Loader2 } from "lucide-react";

export default function CollectionClient({ collection }) {
  // Convert collection paths to initial filters
  // Example: /eyeglasses/men/round -> type: eyeglasses, gender: men, styles: round
  
  const initialFilters = {};
  if (collection && collection.length > 0) {
    initialFilters.type = collection[0];
    
    if (collection.length > 1) {
      initialFilters.gender = [collection[1]];
    }
    
    if (collection.length > 2) {
      initialFilters.styles = [collection[2]];
    }
    
    // Support more parameters if needed, or map specific strings
  }

  const basePath = "/" + (collection ? collection.join("/") : "");

  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center min-h-[50vh]">
          <Loader2 className="w-10 h-10 text-primary animate-spin" />
        </div>
      }
    >
      <CatalogView basePath={basePath} initialFilters={initialFilters} />
    </Suspense>
  );
}
