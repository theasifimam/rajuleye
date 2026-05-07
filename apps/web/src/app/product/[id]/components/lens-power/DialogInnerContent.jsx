"use client";

import {
  MessageCircle,
  Edit3,
  Eye,
  SkipForward,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { OptionCard } from "./OptionCard";
import { PowerForm } from "./PowerForm";

export function DialogInnerContent({
  selectedOption,
  setSelectedOption,
  hasSavedPower,
  user,
  manualPower,
  setManualPower,
  handleConfirm,
  onClose,
  productName,
}) {
  return (
    <>
      <div className="grid gap-3 py-1 p-3 max-h-[55vh] overflow-y-auto scrollbar-hide">
        {/* Use Saved Power */}
        {hasSavedPower && (
          <OptionCard
            selected={selectedOption === "saved"}
            onClick={() => setSelectedOption("saved")}
            icon={Eye}
            iconColor="#6366f1"
            borderColor="border-indigo-500"
            bgColor="bg-indigo-50/50 dark:bg-indigo-950/20"
            title="Use Saved Power"
            subtitle="Your previously saved prescription"
            badge="Saved"
          >
            {selectedOption === "saved" && (
              <div
                className="grid grid-cols-2 gap-3 mt-4 ml-18 animate-in fade-in slide-in-from-top-2 duration-300"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="bg-white/80 dark:bg-muted/40 p-3 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
                  <p className="font-bold text-[10px] uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-2">
                    Left Eye (OS)
                  </p>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">SPH</span>
                      <span className="font-mono font-bold">
                        {user.eyePower.left?.sphere || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">CYL</span>
                      <span className="font-mono font-bold">
                        {user.eyePower.left?.cylinder || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">AXIS</span>
                      <span className="font-mono font-bold">
                        {user.eyePower.left?.axis || "—"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-white/80 dark:bg-muted/40 p-3 rounded-xl border border-violet-100 dark:border-violet-900/30">
                  <p className="font-bold text-[10px] uppercase tracking-widest text-violet-600 dark:text-violet-400 mb-2">
                    Right Eye (OD)
                  </p>
                  <div className="space-y-1 text-xs">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">SPH</span>
                      <span className="font-mono font-bold">
                        {user.eyePower.right?.sphere || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">CYL</span>
                      <span className="font-mono font-bold">
                        {user.eyePower.right?.cylinder || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">AXIS</span>
                      <span className="font-mono font-bold">
                        {user.eyePower.right?.axis || "—"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </OptionCard>
        )}

        {/* Enter Manually */}
        <OptionCard
          selected={selectedOption === "manual"}
          onClick={() => setSelectedOption("manual")}
          icon={Edit3}
          iconColor="#3b82f6"
          borderColor="border-blue-500"
          bgColor="bg-blue-50/50 dark:bg-blue-950/20"
          title="Enter Lens Power"
          subtitle="Type your prescription values now"
        >
          {selectedOption === "manual" && (
            <div
              className="mt-4 ml-0 sm:ml-18"
              onClick={(e) => e.stopPropagation()}
            >
              <PowerForm
                manualPower={manualPower}
                setManualPower={setManualPower}
              />
            </div>
          )}
        </OptionCard>

        {/* Contact via WhatsApp */}
        <OptionCard
          selected={selectedOption === "whatsapp"}
          onClick={() => setSelectedOption("whatsapp")}
          icon={MessageCircle}
          iconColor="#22c55e"
          borderColor="border-green-500"
          bgColor="bg-green-50/50 dark:bg-green-950/20"
          title="Get Help on WhatsApp"
          subtitle="Our optician will help find the right power"
        >
          {selectedOption === "whatsapp" && (
            <p className="text-xs text-green-700 dark:text-green-400 mt-3 ml-18 animate-in fade-in duration-200 bg-green-50 dark:bg-green-950/30 px-3 py-2 rounded-lg border border-green-200 dark:border-green-800/40">
              💬 You&apos;ll be redirected to WhatsApp to chat with our team.
              Share your prescription photo or details and we&apos;ll take care
              of the rest!
            </p>
          )}
        </OptionCard>

        {/* Skip for Now */}
        <OptionCard
          selected={selectedOption === "skip"}
          onClick={() => setSelectedOption("skip")}
          icon={SkipForward}
          iconColor="#f59e0b"
          borderColor="border-amber-500"
          bgColor="bg-amber-50/50 dark:bg-amber-950/20"
          title="Skip for Now"
          subtitle="You can share your power later before delivery"
        >
          {selectedOption === "skip" && (
            <p className="text-xs text-amber-700 dark:text-amber-400 mt-3 ml-18 animate-in fade-in duration-200 bg-amber-50 dark:bg-amber-950/30 px-3 py-2 rounded-lg border border-amber-200 dark:border-amber-800/40">
              ⚡ No worries! You can share your lens power anytime before we
              ship your order. We&apos;ll reach out to you.
            </p>
          )}
        </OptionCard>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-3 mt-5 pt-4 border-t border-border/50">
        <Button
          variant="ghost"
          onClick={onClose}
          className="rounded-full px-6 text-xs font-semibold"
        >
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          disabled={!selectedOption}
          className={cn(
            "flex-1 rounded-full h-12 text-xs font-bold uppercase tracking-wider shadow-lg transition-all duration-300",
            selectedOption === "whatsapp" &&
              "bg-green-600 hover:bg-green-700 shadow-green-500/20",
            selectedOption === "skip" &&
              "bg-amber-500 hover:bg-amber-600 shadow-amber-500/20",
            !selectedOption && "opacity-50",
          )}
        >
          <span className="flex items-center gap-2">
            {selectedOption === "whatsapp" && (
              <>
                <MessageCircle className="h-4 w-4" />
                Open WhatsApp & Continue
              </>
            )}
            {selectedOption === "skip" && (
              <>
                <SkipForward className="h-4 w-4" />
                Skip & Continue
              </>
            )}
            {selectedOption === "manual" && (
              <>
                <Check className="h-4 w-4" />
                Confirm Power & Continue
              </>
            )}
            {selectedOption === "saved" && (
              <>
                <Check className="h-4 w-4" />
                Use This Power & Continue
              </>
            )}
            {!selectedOption && "Select an option"}
          </span>
        </Button>
      </div>
    </>
  );
}
