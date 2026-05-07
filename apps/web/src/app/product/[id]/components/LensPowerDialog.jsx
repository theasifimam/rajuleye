"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
} from "@/components/ui/drawer";
import { Sparkles } from "lucide-react";
import { DialogInnerContent } from "./lens-power/DialogInnerContent";

const WHATSAPP_NUMBER = "919877406583";

export function LensPowerDialog({
  isOpen,
  onClose,
  onConfirm,
  user,
  productName,
}) {
  const [selectedOption, setSelectedOption] = useState(null);
  const [manualPower, setManualPower] = useState({
    left: { sphere: "", cylinder: "", axis: "" },
    right: { sphere: "", cylinder: "", axis: "" },
  });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Reset state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setSelectedOption(null);
      setManualPower({
        left: { sphere: "", cylinder: "", axis: "" },
        right: { sphere: "", cylinder: "", axis: "" },
      });
    }
  }, [isOpen]);

  const hasSavedPower =
    user?.eyePower &&
    (user.eyePower.left?.sphere || user.eyePower.right?.sphere);

  const handleConfirm = () => {
    if (selectedOption === "whatsapp") {
      const msg = encodeURIComponent(
        `Hi, I want to share my lens power for my order of "${productName}". Please help me find the correct power for my glasses.`,
      );
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
      onConfirm(null);
    } else if (selectedOption === "saved") {
      onConfirm(user.eyePower);
    } else if (selectedOption === "manual") {
      onConfirm(manualPower);
    } else if (selectedOption === "skip") {
      onConfirm(null);
    }
  };

  const headerContent = (
    <div className="flex items-center gap-3 mb-1">
      <div className="h-10 w-10 rounded-2xl bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center">
        <Sparkles className="h-5 w-5 text-primary" />
      </div>
      <div>
        <h3 className="font-bold text-lg tracking-tight">Lens Power</h3>
        <p className="text-xs text-muted-foreground">
          How would you like to provide your prescription?
        </p>
      </div>
    </div>
  );

  const innerContent = (
    <DialogInnerContent
      selectedOption={selectedOption}
      setSelectedOption={setSelectedOption}
      hasSavedPower={hasSavedPower}
      user={user}
      manualPower={manualPower}
      setManualPower={setManualPower}
      handleConfirm={handleConfirm}
      onClose={onClose}
      productName={productName}
    />
  );

  // Mobile: Drawer from bottom
  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className="px-5 pb-8 pt-6 max-h-[90vh]">
          <div className="mx-auto w-12 h-1.5 rounded-full bg-muted-foreground/20 mb-5" />
          {headerContent}
          <div className="mt-4 overflow-y-auto">{innerContent}</div>
        </DrawerContent>
      </Drawer>
    );
  }

  // Desktop: Dialog
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg z-1000 rounded-4xl border-border/50 shadow-2xl p-6">
        <DialogHeader className="pb-0">
          <DialogTitle className="sr-only">Lens Power Selection</DialogTitle>
          <DialogDescription className="sr-only">
            Choose how you would like to provide your lens prescription details
          </DialogDescription>
          {headerContent}
        </DialogHeader>
        {innerContent}
      </DialogContent>
    </Dialog>
  );
}
