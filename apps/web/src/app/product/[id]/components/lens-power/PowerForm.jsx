"use client";

import { Input } from "@/components/ui/input";

export function PowerForm({ manualPower, setManualPower }) {
  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Left Eye */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-blue-500" />
          <p className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
            Left Eye (OS)
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="space-y-1">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
              SPH
            </label>
            <Input
              placeholder="+0.00"
              className="h-10 text-sm bg-muted/30 border-muted-foreground/10 rounded-xl text-center font-mono focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
              value={manualPower.left.sphere}
              onChange={(e) =>
                setManualPower((prev) => ({
                  ...prev,
                  left: { ...prev.left, sphere: e.target.value },
                }))
              }
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
              CYL
            </label>
            <Input
              placeholder="-0.00"
              className="h-10 text-sm bg-muted/30 border-muted-foreground/10 rounded-xl text-center font-mono focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
              value={manualPower.left.cylinder}
              onChange={(e) =>
                setManualPower((prev) => ({
                  ...prev,
                  left: { ...prev.left, cylinder: e.target.value },
                }))
              }
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
              AXIS
            </label>
            <Input
              placeholder="0°"
              className="h-10 text-sm bg-muted/30 border-muted-foreground/10 rounded-xl text-center font-mono focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50 transition-all"
              value={manualPower.left.axis}
              onChange={(e) =>
                setManualPower((prev) => ({
                  ...prev,
                  left: { ...prev.left, axis: e.target.value },
                }))
              }
            />
          </div>
        </div>
      </div>

      {/* Right Eye */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-violet-500" />
          <p className="text-xs font-bold uppercase tracking-widest text-violet-600 dark:text-violet-400">
            Right Eye (OD)
          </p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="space-y-1">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
              SPH
            </label>
            <Input
              placeholder="+0.00"
              className="h-10 text-sm bg-muted/30 border-muted-foreground/10 rounded-xl text-center font-mono focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all"
              value={manualPower.right.sphere}
              onChange={(e) =>
                setManualPower((prev) => ({
                  ...prev,
                  right: { ...prev.right, sphere: e.target.value },
                }))
              }
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
              CYL
            </label>
            <Input
              placeholder="-0.00"
              className="h-10 text-sm bg-muted/30 border-muted-foreground/10 rounded-xl text-center font-mono focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all"
              value={manualPower.right.cylinder}
              onChange={(e) =>
                setManualPower((prev) => ({
                  ...prev,
                  right: { ...prev.right, cylinder: e.target.value },
                }))
              }
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
              AXIS
            </label>
            <Input
              placeholder="0°"
              className="h-10 text-sm bg-muted/30 border-muted-foreground/10 rounded-xl text-center font-mono focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/50 transition-all"
              value={manualPower.right.axis}
              onChange={(e) =>
                setManualPower((prev) => ({
                  ...prev,
                  right: { ...prev.right, axis: e.target.value },
                }))
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
