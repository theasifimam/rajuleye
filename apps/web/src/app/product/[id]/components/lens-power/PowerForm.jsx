"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const generateValues = (min, max, step) => {
  const values = [];
  for (let i = min; i <= max; i += step) {
    values.push((i > 0 ? "+" : "") + i.toFixed(2));
  }
  return values;
};

const sphereOptions = generateValues(-6, 5, 0.25);
const cylinderOptions = generateValues(-2, 2, 0.25); // Usually negative for glasses
const axisOptions = Array.from({ length: 181 }, (_, i) => i.toString());

export function PowerForm({ manualPower, setManualPower }) {
  const [samePower, setSamePower] = useState(false);
  const [hasCylindrical, setHasCylindrical] = useState(false);

  useEffect(() => {
    if (samePower) {
      setManualPower((prev) => ({
        ...prev,
        right: { ...prev.left },
      }));
    }
  }, [samePower, manualPower.left, setManualPower]);

  const updatePower = (eye, field, value) => {
    setManualPower((prev) => {
      const newState = { ...prev };
      newState[eye] = { ...newState[eye], [field]: value };
      if (samePower && eye === "left") {
        newState.right = { ...newState.right, [field]: value };
      }
      return newState;
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="flex flex-col gap-3">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={samePower}
            onChange={(e) => setSamePower(e.target.checked)}
            className="rounded border-gray-300 text-primary focus:ring-primary"
          />
          <span className="text-sm font-medium">
            I have same power for both eyes
          </span>
        </label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={hasCylindrical}
            onChange={(e) => setHasCylindrical(e.target.checked)}
            className="rounded border-gray-300 text-primary focus:ring-primary"
          />
          <span className="text-sm font-medium">I have cylindrical power</span>
        </label>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead>
            <tr className="text-xs uppercase text-muted-foreground/70">
              <th className="pb-2 font-bold">Power</th>
              <th className="pb-2 font-bold text-center">Left</th>
              <th className="pb-2 font-bold text-center">Right</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {/* SPH Row */}
            <tr>
              <td className="py-3 font-bold">SPH</td>
              <td className="py-2 px-1">
                <select
                  value={manualPower.left.sphere}
                  onChange={(e) =>
                    updatePower("left", "sphere", e.target.value)
                  }
                  className="w-full h-10 px-3 rounded-xl bg-muted/30 border-none focus:ring-2 focus:ring-primary/20 font-mono text-sm"
                >
                  <option value="">Select</option>
                  {sphereOptions.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </td>
              <td className="py-2 px-1">
                <select
                  value={manualPower.right.sphere}
                  onChange={(e) =>
                    updatePower("right", "sphere", e.target.value)
                  }
                  disabled={samePower}
                  className={cn(
                    "w-full h-10 px-3 rounded-xl bg-muted/30 border-none focus:ring-2 focus:ring-primary/20 font-mono text-sm",
                    samePower && "opacity-50 cursor-not-allowed",
                  )}
                >
                  <option value="">Select</option>
                  {sphereOptions.map((v) => (
                    <option key={v} value={v}>
                      {v}
                    </option>
                  ))}
                </select>
              </td>
            </tr>

            {/* CYL Row */}
            {hasCylindrical && (
              <tr>
                <td className="py-3 font-bold">CYL</td>
                <td className="py-2 px-1">
                  <select
                    value={manualPower.left.cylinder}
                    onChange={(e) =>
                      updatePower("left", "cylinder", e.target.value)
                    }
                    className="w-full h-10 px-3 rounded-xl bg-muted/30 border-none focus:ring-2 focus:ring-primary/20 font-mono text-sm"
                  >
                    <option value="">Select</option>
                    {cylinderOptions.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-2 px-1">
                  <select
                    value={manualPower.right.cylinder}
                    onChange={(e) =>
                      updatePower("right", "cylinder", e.target.value)
                    }
                    disabled={samePower}
                    className={cn(
                      "w-full h-10 px-3 rounded-xl bg-muted/30 border-none focus:ring-2 focus:ring-primary/20 font-mono text-sm",
                      samePower && "opacity-50 cursor-not-allowed",
                    )}
                  >
                    <option value="">Select</option>
                    {cylinderOptions.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            )}

            {/* AXIS Row */}
            {hasCylindrical && (
              <tr>
                <td className="py-3 font-bold">AXIS</td>
                <td className="py-2 px-1">
                  <select
                    value={manualPower.left.axis}
                    onChange={(e) =>
                      updatePower("left", "axis", e.target.value)
                    }
                    className="w-full h-10 px-3 rounded-xl bg-muted/30 border-none focus:ring-2 focus:ring-primary/20 font-mono text-sm"
                  >
                    <option value="">Select</option>
                    {axisOptions.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="py-2 px-1">
                  <select
                    value={manualPower.right.axis}
                    onChange={(e) =>
                      updatePower("right", "axis", e.target.value)
                    }
                    disabled={samePower}
                    className={cn(
                      "w-full h-10 px-3 rounded-xl bg-muted/30 border-none focus:ring-2 focus:ring-primary/20 font-mono text-sm",
                      samePower && "opacity-50 cursor-not-allowed",
                    )}
                  >
                    <option value="">Select</option>
                    {axisOptions.map((v) => (
                      <option key={v} value={v}>
                        {v}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="space-y-4 pt-4 border-t border-dashed">
        <h3 className="text-sm font-bold">Whose prescription is this</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
              Name *
            </label>
            <Input
              placeholder="Name"
              className="h-12 bg-muted/30 border-none rounded-xl"
              value={manualPower.name || ""}
              onChange={(e) =>
                setManualPower((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
              Phone Number *
            </label>
            <Input
              placeholder="Phone Number"
              className="h-12 bg-muted/30 border-none rounded-xl"
              value={manualPower.phone || ""}
              onChange={(e) =>
                setManualPower((prev) => ({ ...prev, phone: e.target.value }))
              }
            />
          </div>
        </div>
      </div>

      <div className="text-center text-xs text-muted-foreground pt-2">
        Can&apos;t find your power, Call +91 8470007367
      </div>
    </div>
  );
}
