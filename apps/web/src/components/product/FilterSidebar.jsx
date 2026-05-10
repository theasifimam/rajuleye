"use client";
import { useState } from "react";
import { ChevronDown, ChevronUp, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const FilterSection = ({ title, options, selected, onChange }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (!options || options.length === 0) return null;

  return (
    <div className="border-b py-5 border-dashed">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between font-bold text-sm uppercase tracking-widest text-primary/80 hover:text-primary transition-colors"
      >
        {title}
        {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </button>

      {isOpen && (
        <div className="mt-4 space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
          {options.map((opt) => {
            const value = typeof opt === "string" ? opt : opt.id || opt.value;
            const label = typeof opt === "string" ? opt.replace(/-/g, " ") : opt.name || opt.label;
            const isChecked = selected.includes(value);

            return (
              <label
                key={value}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div
                  className={cn(
                    "flex h-5 w-5 items-center justify-center rounded border transition-colors shrink-0",
                    isChecked
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-muted-foreground/30 group-hover:border-primary/50 bg-background"
                  )}
                >
                  {isChecked && <Check className="h-3.5 w-3.5" />}
                </div>
                <input
                  type="checkbox"
                  className="hidden"
                  checked={isChecked}
                  onChange={(e) => {
                    if (e.target.checked) {
                      onChange([...selected, value]);
                    } else {
                      onChange(selected.filter((v) => v !== value));
                    }
                  }}
                />
                <span className="text-sm font-medium capitalize text-muted-foreground group-hover:text-foreground transition-colors truncate">
                  {label}
                </span>
              </label>
            );
          })}
        </div>
      )}
    </div>
  );
};

export function FilterSidebar({ filterOptions, categories, currentFilters, onFilterChange, className }) {
  const handleChange = (key, values) => {
    onFilterChange({ ...currentFilters, [key]: values });
  };

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="mb-6 hidden md:block">
        <h2 className="text-xl font-black tracking-tighter uppercase">Filters</h2>
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest mt-1">
          Refine your selection
        </p>
      </div>

      <div className="space-y-1">
        <FilterSection
          title="Categories"
          options={categories}
          selected={currentFilters.category ? [currentFilters.category] : []}
          onChange={(vals) => handleChange("category", vals.length > 0 ? vals[vals.length - 1] : null)}
        />
        
        <FilterSection
          title="Product Type"
          options={filterOptions?.types}
          selected={currentFilters.type ? [currentFilters.type] : []}
          onChange={(vals) => handleChange("type", vals.length > 0 ? vals[vals.length - 1] : null)}
        />

        <FilterSection
          title="Gender"
          options={filterOptions?.genders}
          selected={currentFilters.gender || []}
          onChange={(vals) => handleChange("gender", vals)}
        />

        <FilterSection
          title="Styles"
          options={filterOptions?.styles}
          selected={currentFilters.styles || []}
          onChange={(vals) => handleChange("styles", vals)}
        />

        <FilterSection
          title="Face Shape"
          options={filterOptions?.faceShapes}
          selected={currentFilters.faceShapes || []}
          onChange={(vals) => handleChange("faceShapes", vals)}
        />

        <FilterSection
          title="Materials"
          options={filterOptions?.materials}
          selected={currentFilters.materials || []}
          onChange={(vals) => handleChange("materials", vals)}
        />

        <FilterSection
          title="Frame Type"
          options={filterOptions?.frameTypes}
          selected={currentFilters.frameType ? [currentFilters.frameType] : []}
          onChange={(vals) => handleChange("frameType", vals.length > 0 ? vals[vals.length - 1] : null)}
        />

        <FilterSection
          title="Features"
          options={filterOptions?.lensFeatures}
          selected={currentFilters.lensFeatures || []}
          onChange={(vals) => handleChange("lensFeatures", vals)}
        />
      </div>
    </div>
  );
}
