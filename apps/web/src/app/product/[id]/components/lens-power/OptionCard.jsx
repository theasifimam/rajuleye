"use client";

import { Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function OptionCard({
  selected,
  onClick,
  icon: Icon,
  iconColor,
  borderColor,
  bgColor,
  title,
  subtitle,
  badge,
  children,
}) {
  return (
    <div
      className={cn(
        "relative p-4 border-2 rounded-2xl cursor-pointer transition-all duration-300 group",
        selected
          ? `${borderColor} ${bgColor} shadow-lg scale-[1.01]`
          : "border-muted/60 hover:border-muted-foreground/20 hover:shadow-md",
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-3">
        {/* Radio indicator */}
        <div
          className={cn(
            "h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all duration-300",
            selected
              ? `${borderColor} bg-current`
              : "border-muted-foreground/30",
          )}
          style={
            selected
              ? { backgroundColor: iconColor, borderColor: iconColor }
              : {}
          }
        >
          {selected && (
            <Check className="h-3 w-3 text-white animate-in zoom-in duration-200" />
          )}
        </div>

        {/* Icon */}
        <div
          className={cn(
            "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300",
            selected ? "scale-110" : "scale-100 group-hover:scale-105",
          )}
          style={{ backgroundColor: `${iconColor}15` }}
        >
          <Icon className="h-5 w-5" style={{ color: iconColor }} />
        </div>

        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="font-bold text-sm">{title}</p>
            {badge && (
              <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                {badge}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
            {subtitle}
          </p>
        </div>

        <ChevronRight
          className={cn(
            "h-4 w-4 text-muted-foreground/40 transition-all duration-300 shrink-0",
            selected
              ? "opacity-100 translate-x-0"
              : "opacity-0 -translate-x-2 group-hover:opacity-60 group-hover:translate-x-0",
          )}
        />
      </div>
      {children}
    </div>
  );
}
