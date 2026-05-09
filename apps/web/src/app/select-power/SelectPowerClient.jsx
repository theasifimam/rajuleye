"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/store";
import { selectCurrentUser, selectIsAuthenticated } from "@/store/authSlice";
import { useGetProfileQuery, useUpdateEyePowerMutation } from "@/store/authApi";
import { useAddToCartMutation } from "@/store/cartApi";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { DialogInnerContent } from "@/app/product/[id]/components/lens-power/DialogInnerContent";

const WHATSAPP_NUMBER = "919877406583";

export function SelectPowerClient({ product }) {
  const router = useRouter();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const authUser = useAppSelector(selectCurrentUser);
  const { data: profileData } = useGetProfileQuery(undefined, {
    skip: !isAuthenticated,
  });
  const user = profileData?.data || authUser;

  const [selectedOption, setSelectedOption] = useState(null);
  const [prescriptionFile, setPrescriptionFile] = useState(null);
  const [manualPower, setManualPower] = useState({
    left: { sphere: "", cylinder: "", axis: "" },
    right: { sphere: "", cylinder: "", axis: "" },
  });
  const [addToCartMutation] = useAddToCartMutation();
  const [updateEyePower] = useUpdateEyePowerMutation();
  const [isAdding, setIsAdding] = useState(false);

  const hasSavedPower =
    user?.eyePower &&
    (user.eyePower.left?.sphere || user.eyePower.right?.sphere);

  const handleConfirm = async () => {
    let selectedPower = null;
    if (selectedOption === "whatsapp") {
      const msg = encodeURIComponent(
        `Hi, I want to share my lens power for my order of "${product.name}". Please help me find the correct power for my glasses.`,
      );
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
    } else if (selectedOption === "saved") {
      selectedPower = user.eyePower;
    } else if (selectedOption === "manual") {
      selectedPower = manualPower;
      // Save to profile if logged in
      if (isAuthenticated) {
        try {
          await updateEyePower(manualPower).unwrap();
          toast.success("Prescription saved to profile!");
        } catch (error) {
          console.error("Failed to save prescription to profile:", error);
        }
      }
    } else if (selectedOption === "upload") {
      if (!prescriptionFile) {
        toast.error("Please upload a prescription picture");
        return;
      }
      // Save to profile if logged in
      if (isAuthenticated) {
        try {
          const formData = new FormData();
          formData.append("prescription", prescriptionFile);
          const res = await updateEyePower(formData).unwrap();
          toast.success("Prescription saved to profile!");
          selectedPower = res.data;
        } catch (error) {
          console.error("Failed to save prescription to profile:", error);
          toast.error("Failed to upload prescription");
          return;
        }
      } else {
        toast.error("Please login to upload prescription");
        return;
      }
    }

    // Proceed to add to cart
    setIsAdding(true);
    try {
      const payload = {
        product,
        qty: 1,
      };

      const searchParams = new URLSearchParams(window.location.search);
      const lensName = searchParams.get("lens") || "Plane Glass";
      const lensId = searchParams.get("lensId");
      const lensPrice = parseFloat(searchParams.get("lensPrice") || "0");

      payload.lensType = lensName;
      payload.frameId = lensId !== "plane" ? lensId : null;
      payload.frameName = lensName;
      payload.framePrice = lensPrice;
      payload.isPlaneGlass = lensId === "plane" || !lensId;

      if (selectedPower) {
        payload.selectedPower = selectedPower;
      }

      await addToCartMutation(payload).unwrap();
      toast.success("Added to Cart with power details!");
      router.push("/checkout"); // Go to checkout page!
    } catch (error) {
      toast.error("Failed to add to cart");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="container mx-auto px-4 md:px-6 py-6 md:py-12 max-w-2xl">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="mb-6 gap-2"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Product
      </Button>

      <div className="flex flex-col md:flex-row gap-6 items-start mb-8 border-b pb-6">
        <div className="relative w-24 h-24 rounded-xl overflow-hidden bg-muted border shrink-0">
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/60 mb-1">
            Step 2: Lens Power
          </p>
          <h1 className="text-2xl font-black uppercase tracking-tighter mb-1">
            {product.name}
          </h1>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-background rounded-3xl border border-border/50 shadow-sm p-6">
        <div className="mb-6">
          <h2 className="text-lg font-bold tracking-tight">
            How would you like to provide your prescription?
          </h2>
          <p className="text-xs text-muted-foreground">
            Select an option to proceed
          </p>
        </div>

        <DialogInnerContent
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
          hasSavedPower={hasSavedPower}
          user={user}
          manualPower={manualPower}
          setManualPower={setManualPower}
          prescriptionFile={prescriptionFile}
          setPrescriptionFile={setPrescriptionFile}
          handleConfirm={handleConfirm}
          onClose={() => router.back()}
          productName={product.name}
        />
      </div>
    </div>
  );
}
