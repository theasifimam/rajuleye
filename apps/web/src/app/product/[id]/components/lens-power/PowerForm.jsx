"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const generateValues = (min, max, step) => {
  const values = [];
  for (let i = min; i <= max; i += step) {
    values.push((i > 0 ? "+" : "") + i.toFixed(2));
  }
  return values;
};

const sphereOptions = generateValues(-8, 6, 0.25);
const cylinderOptions = generateValues(-2, 2, 0.25); // Usually negative for glasses
const axisOptions = Array.from({ length: 181 }, (_, i) => i.toString());

export function PowerForm({ manualPower, setManualPower }) {
  const updatePower = (eye, field, value) => {
    setManualPower((prev) => {
      const newState = { ...prev };
      newState[eye] = { ...newState[eye], [field]: value };
      return newState;
    });
  };

  const renderEyeFields = (eyeLabel, eyeKey, dotColor, textColor) => {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className={cn("h-2 w-2 rounded-full shrink-0", dotColor)} />
          <h4
            className={cn(
              "font-black text-xs uppercase tracking-wider",
              textColor,
            )}
          >
            {eyeLabel}
          </h4>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {/* SPH */}
          <div className="space-y-1 text-center">
            <span className="text-[9px] font-black tracking-widest text-muted-foreground/60 uppercase block">
              SPH
            </span>
            <select
              value={manualPower[eyeKey].sphere}
              onChange={(e) => updatePower(eyeKey, "sphere", e.target.value)}
              className="w-full h-14 px-3 rounded-2xl bg-gray-100/80 dark:bg-muted/40 border-2 border-transparent hover:bg-gray-200/50 dark:hover:bg-muted/60 focus:bg-white dark:focus:bg-background focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100/50 dark:focus:ring-emerald-950/20 font-bold text-center text-xs transition-all duration-200 outline-none cursor-pointer appearance-none"
            >
              <option value="">Select</option>
              {sphereOptions.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          {/* CYL */}
          <div className="space-y-1 text-center">
            <span className="text-[9px] font-black tracking-widest text-muted-foreground/60 uppercase block">
              CYL
            </span>
            <select
              value={manualPower[eyeKey].cylinder}
              onChange={(e) => updatePower(eyeKey, "cylinder", e.target.value)}
              className="w-full h-14 px-3 rounded-2xl bg-gray-100/80 dark:bg-muted/40 border-2 border-transparent hover:bg-gray-200/50 dark:hover:bg-muted/60 focus:bg-white dark:focus:bg-background focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100/50 dark:focus:ring-emerald-950/20 font-bold text-center text-xs transition-all duration-200 outline-none cursor-pointer appearance-none"
            >
              <option value="">Select</option>
              {cylinderOptions.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>

          {/* AXIS */}
          <div className="space-y-1 text-center">
            <span className="text-[9px] font-black tracking-widest text-muted-foreground/60 uppercase block">
              AXIS
            </span>
            <select
              value={manualPower[eyeKey].axis}
              onChange={(e) => updatePower(eyeKey, "axis", e.target.value)}
              className="w-full h-14 px-3 rounded-2xl bg-gray-100/80 dark:bg-muted/40 border-2 border-transparent hover:bg-gray-200/50 dark:hover:bg-muted/60 focus:bg-white dark:focus:bg-background focus:border-emerald-300 focus:ring-4 focus:ring-emerald-100/50 dark:focus:ring-emerald-950/20 font-bold text-center text-xs transition-all duration-200 outline-none cursor-pointer appearance-none"
            >
              <option value="">Select</option>
              {axisOptions.map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-300">
      {renderEyeFields(
        "Right Eye (OD)",
        "right",
        "bg-violet-600",
        "text-violet-600",
      )}
      {renderEyeFields("Left Eye (OS)", "left", "bg-blue-600", "text-blue-600")}

      {/* Patient Name / Phone fields */}
      <div className="space-y-3 pt-3 border-t border-dashed border-blue-200 dark:border-blue-900/40">
        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
          Whose prescription is this?
        </p>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <Input
              placeholder="Name *"
              className="h-11 bg-gray-100/80 dark:bg-muted/40 border-none rounded-xl text-xs font-bold px-3"
              value={manualPower.name || ""}
              onChange={(e) =>
                setManualPower((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>
          <div className="space-y-1">
            <Input
              placeholder="Phone Number *"
              className="h-11 bg-gray-100/80 dark:bg-muted/40 border-none rounded-xl text-xs font-bold px-3"
              value={manualPower.phone || ""}
              onChange={(e) =>
                setManualPower((prev) => ({ ...prev, phone: e.target.value }))
              }
            />
          </div>
        </div>
      </div>

      <div className="text-center text-[10px] text-muted-foreground/50 uppercase tracking-wider font-bold pt-1">
        Can&apos;t find your power? Call +91 8470007367
      </div>
    </div>
  );
}
