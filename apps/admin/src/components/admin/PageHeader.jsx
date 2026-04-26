"use client";
import React from "react";
import { Button } from "@/components/ui/button";

export function PageHeader({
  badgeIcon: BadgeIcon,
  badgeText,
  titleMain,
  titleAccent,
  description,
  actionIcon: ActionIcon,
  actionLabel,
  onAction,
  showAction = true,
  children,
}) {
  return (
    <div className="relative p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] bg-gradient-to-br from-primary/10 via-background to-background border border-primary/20 overflow-hidden group mx-4 md:mx-0">
      <div className="absolute top-0 right-0 w-64 h-64 md:w-80 md:h-80 bg-primary/10 rounded-full -mr-24 -mt-24 md:-mr-32 md:-mt-32 blur-[80px] md:blur-[100px] animate-pulse" />
      <div className="relative z-10 flex flex-col xl:flex-row xl:items-center justify-between gap-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-[9px] md:text-[10px] font-black uppercase tracking-widest mb-4">
            <BadgeIcon className="h-3 w-3" /> {badgeText}
          </div>
          <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-4 italic leading-none">
            {titleMain} <br />
            <span className="text-primary not-italic">{titleAccent}</span>
          </h2>
          <p className="text-muted-foreground font-bold uppercase tracking-[0.2em] text-[10px] max-w-md leading-relaxed">
            {description}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          {children}
          {showAction && ActionIcon && actionLabel && (
            <Button
              variant="signature"
              size="xl"
              className="h-16 md:h-20 w-full sm:w-auto"
              onClick={onAction}
            >
              <div className="flex flex-col items-center gap-0.5 md:gap-1">
                <ActionIcon className="h-4 w-4 md:h-5 md:w-5 group-hover/btn:scale-125 transition-transform duration-500" />
                <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.25em]">
                  {actionLabel}
                </span>
              </div>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
