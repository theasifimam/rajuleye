"use client";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TooltipProvider } from "@/components/ui/tooltip";
import { UserFormSchema } from "@/lib/zod-schemas";
import { GeneralTab } from "./user-dialog/GeneralTab";
import { AddressTab } from "./user-dialog/AddressTab";
import { useCreateUserMutation, useUpdateUserMutation } from "@/store/userApi";
import { toast } from "sonner";

export function UserDialog({ isOpen, onOpenChange, user }) {
  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const loading = isCreating || isUpdating;
  const form = useForm({
    resolver: zodResolver(UserFormSchema),
    defaultValues: {
      name: "",
      email: "",
      mobile: "",
      role: "user",
      gender: "male",
      addresses: [],
      eyePower: {
        left: {},
        right: {},
      },
      isEmailVerified: true,
      avatar: "",
    },
  });
  useEffect(() => {
    if (user && isOpen) {
      form.reset({
        ...user,
        addresses: user.addresses || [],
        eyePower: user.eyePower || { left: {}, right: {} },
        dateOfBirth: user.dateOfBirth
          ? new Date(user.dateOfBirth).toISOString()
          : "",
        role: user.role || "user",
        avatar: user.avatar || "",
      });
    } else if (!user && isOpen) {
      form.reset({
        name: "",
        email: "",
        mobile: "",
        role: "user",
        gender: "male",
        addresses: [],
        eyePower: {
          left: {},
          right: {},
        },
        isEmailVerified: true,
        dateOfBirth: "",
        avatar: "",
      });
    }
  }, [user, form, isOpen]);
  const onSubmit = async (values) => {
    const userId = user?._id || user?.id;
    console.log(values, "values");
    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("email", values.email);
      if (values.mobile) formData.append("mobile", values.mobile);
      if (values.password) formData.append("password", values.password);
      if (values.role) formData.append("role", values.role);
      if (values.gender) formData.append("gender", values.gender);
      if (values.dateOfBirth) formData.append("dateOfBirth", new Date(values.dateOfBirth).toISOString());
      formData.append("isEmailVerified", String(values.isEmailVerified));
      if (values.addresses) formData.append("addresses", JSON.stringify(values.addresses));
      if (values.eyePower) formData.append("eyePower", JSON.stringify(values.eyePower));

      if (values.avatar && values.avatar instanceof File) {
        formData.append("avatar", values.avatar);
      }

      if (userId) {
        await updateUser({ id: userId, body: formData }).unwrap();
        toast.success("Identity refined successfully");
      } else {
        await createUser(formData).unwrap();
        toast.success("New ambassador cataloged");
      }
      onOpenChange(false);
    } catch (err) {
      toast.error(err?.data?.message || "Verification failed");
    }
  };
  const onError = (errors) => {
    console.error("Form Validation Errors:", errors);
    toast.error("Validation failed. Please check the form for errors.");
  };
  const handleClose = () => {
    onOpenChange(false);
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={handleClose}
      />

      {/* ModalContent */}
      <TooltipProvider delayDuration={200}>
        <div className="relative w-full max-w-4xl bg-card border shadow-2xl border-primary/10 rounded-3xl md:rounded-[2.5rem] overflow-hidden animate-in zoom-in-95 fade-in duration-500 max-h-[90vh] flex flex-col">
          <div className="absolute top-5 right-6 z-50">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-10 w-10 rounded-xl hover:bg-primary/10 hover:text-primary border border-transparent hover:border-primary/20 transition-all"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="p-6 md:p-10 pb-5 flex items-center gap-5 border-b border-primary/5 bg-primary/2">
            <div className="h-14 w-14 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-lg shadow-primary/20 shrink-0">
              <User className="h-7 w-7" />
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-black tracking-tighter uppercase italic leading-none mb-1">
                {user ? "Refine Identity" : "Enroll Guest"}
              </h3>
              <p className="text-[9px] font-black uppercase tracking-[0.25em] text-muted-foreground opacity-70">
                {user
                  ? `Updating profile catalog: ${user.id || "N/A"}`
                  : "Cataloging a new ambassador"}
              </p>
            </div>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit, onError)}
              className="flex-1 overflow-hidden flex flex-col"
            >
              <ScrollArea className="flex-1 h-full w-full overflow-y-auto px-8 md:px-12 py-6">
                <Tabs defaultValue="general" className="w-full p-1">
                  <TabsList className="bg-muted/30 p-1 rounded-2xl mb-8 w-fit border border-primary/5">
                    <TabsTrigger
                      value="general"
                      className="rounded-xl px-6 py-2 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                    >
                      General
                    </TabsTrigger>
                    <TabsTrigger
                      value="addresses"
                      className="rounded-xl px-6 py-2 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all"
                    >
                      Addresses
                    </TabsTrigger>
                  </TabsList>

                  <div className="mt-2">
                    <TabsContent value="general">
                      <GeneralTab control={form.control} />
                    </TabsContent>
                    <TabsContent value="addresses">
                      <AddressTab control={form.control} />
                    </TabsContent>
                  </div>
                </Tabs>
              </ScrollArea>

              {/* Footer */}
              <div className="p-6 md:p-8 border-t border-primary/5 bg-primary/1 flex items-center justify-between">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={handleClose}
                  className="text-[9px] font-black uppercase tracking-widest hover:text-primary transition-colors"
                >
                  Discard Entry
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  variant="signature"
                  size="lg"
                  className="min-w-[200px]"
                >
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <div className="flex items-center gap-2.5">
                      <div className="flex items-center justify-center h-4 w-4 rounded-full border-2 border-primary-foreground/30">
                        <div className="h-1 w-1 rounded-full bg-primary-foreground animate-pulse" />
                      </div>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                        Commit Identity
                      </span>
                    </div>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </TooltipProvider>
    </div>
  );
}
