import React, { useState } from "react";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Button } from "./button";
import { cn } from "@/lib/utils";

export function MultiSelect({ options, selected, onChange, placeholder = "Select options" }) {
  const [open, setOpen] = useState(false);

  const handleSelect = (val) => {
    if (selected.includes(val)) {
      onChange(selected.filter((item) => item !== val));
    } else {
      onChange([...selected, val]);
    }
  };

  const handleRemove = (val, e) => {
    e.stopPropagation();
    onChange(selected.filter((item) => item !== val));
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-auto min-h-11 bg-muted/30 border-none px-5 hover:bg-muted/50 font-normal"
        >
          <div className="flex flex-wrap gap-1 py-1 w-[90%] overflow-hidden">
            {selected?.length > 0 ? (
              selected.map((val) => (
                <div
                  key={val}
                  className="bg-primary/10 text-primary text-[10px] uppercase font-bold tracking-widest px-2 py-1 rounded-md flex items-center gap-1"
                >
                  {val.replace(/-/g, ' ')}
                  <span
                    className="cursor-pointer rounded-full hover:bg-primary/20 p-0.5"
                    onPointerDown={(e) => handleRemove(val, e)}
                  >
                    <X className="h-3 w-3" />
                  </span>
                </div>
              ))
            ) : (
              <span className="text-muted-foreground text-xs">{placeholder}</span>
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0 rounded-2xl border-primary/10" align="start">
        <div className="max-h-[300px] overflow-y-auto p-1">
          {options.map((option) => (
            <div
              key={option.value}
              className={cn(
                "relative flex w-full cursor-pointer select-none items-center rounded-xl py-2.5 px-4 text-xs outline-none transition-colors hover:bg-accent hover:text-accent-foreground",
                selected?.includes(option.value) ? "bg-accent/50 font-bold" : ""
              )}
              onClick={() => handleSelect(option.value)}
            >
              <div
                className={cn(
                  "mr-3 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                  selected?.includes(option.value)
                    ? "bg-primary text-primary-foreground"
                    : "opacity-50 [&_svg]:invisible"
                )}
              >
                <Check className={cn("h-3 w-3")} />
              </div>
              <span className="capitalize">{option.label}</span>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
