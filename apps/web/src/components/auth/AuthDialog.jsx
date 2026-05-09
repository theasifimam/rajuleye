"use client";
import * as React from "react";
import { ResponsiveModal } from "@/components/ui/responsive-modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  User,
  Lock,
  ArrowRight,
  RefreshCw,
  KeyRound,
  Mail,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/store/store";
import {
  setCredentials,
  closeAuthDialog,
  selectIsAuthDialogOpen,
} from "@/store/authSlice";
import {
  useRegisterMutation,
  useVerifyMobileMutation,
  useLoginMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} from "@/store/authApi";
import { cn } from "@/lib/utils";
const SESSION_KEY = "auth_dialog_state";

function saveSessionState(state) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}
function loadSessionState() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return null;
}
function clearSessionState() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    /* ignore */
  }
}
function getErrorMessage(error) {
  if (error && typeof error === "object") {
    const err = error;
    return err.data?.message || err.error || "Something went wrong";
  }
  return "Something went wrong";
}
const DEFAULT_FORM = {
  name: "",
  mobile: "",
  password: "",
  otp: "",
  newPassword: "",
};

export function AuthDialog() {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector(selectIsAuthDialogOpen);
  const [mode, setMode] = React.useState("signin");
  const [step, setStep] = React.useState("auth");
  const [formData, setFormData] = React.useState({ ...DEFAULT_FORM });
  const contentRef = React.useRef(null);
  const [register, { isLoading: isRegistering }] = useRegisterMutation();
  const [verifyMobile, { isLoading: isVerifying }] = useVerifyMobileMutation();
  const [login, { isLoading: isLoggingIn }] = useLoginMutation();
  const [forgotPassword, { isLoading: isForgetting }] =
    useForgotPasswordMutation();
  const [resetPassword, { isLoading: isResetting }] =
    useResetPasswordMutation();
  const isLoading =
    isRegistering || isVerifying || isLoggingIn || isForgetting || isResetting;

  // ── Restore form state when dialog opens ──
  React.useEffect(() => {
    if (isOpen) {
      const saved = loadSessionState();
      if (saved) {
        setMode(saved.mode);
        setStep(saved.step);
        setFormData(saved.formData);
      }
    }
  }, [isOpen]);

  // ── Persist form state on every change ──
  React.useEffect(() => {
    if (isOpen) {
      // Only persist if user has started filling something meaningful
      const hasContent =
        formData.name || formData.email || formData.password || step !== "auth";
      if (hasContent) {
        saveSessionState({ mode, step, formData });
      }
    }
  }, [mode, step, formData, isOpen]);

  // ── Fix mobile keyboard pushing inputs off screen ──
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const handleFocus = (e) => {
      const target = e.target;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
        // Small delay to allow keyboard to appear
        setTimeout(() => {
          target.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 300);
      }
    };
    document.addEventListener("focusin", handleFocus);
    return () => document.removeEventListener("focusin", handleFocus);
  }, []);

  const resetForm = () => {
    setMode("signin");
    setStep("auth");
    setFormData({ ...DEFAULT_FORM });
    clearSessionState();
  };

  const onOpenChange = (open) => {
    if (!open) {
      dispatch(closeAuthDialog());
      // Don't reset form on close — state is persisted in sessionStorage
      // Only reset if on a terminal state (not mid-flow)
    }
  };

  const updateForm = (updates) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  };

  // ── Sign In ──
  const handleLogin = async () => {
    if (!formData.mobile || formData.mobile.length < 10) {
      toast.error("Please enter a valid mobile number");
      return;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    try {
      const formattedMobile = formData.mobile.startsWith('+') ? formData.mobile : `+91${formData.mobile}`;
      const result = await login({
        mobile: formattedMobile,
        password: formData.password,
      }).unwrap();
      dispatch(
        setCredentials({
          user: result.data.user,
          accessToken: result.data.accessToken,
        }),
      );
      toast.success("Welcome back!");
      dispatch(closeAuthDialog());
      setTimeout(resetForm, 300);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  // ── Sign Up → send OTP ──
  const handleRegister = async () => {
    if (!formData.name) {
      toast.error("Please enter your name");
      return;
    }
    if (!formData.mobile || formData.mobile.length < 10) {
      toast.error("Please enter a valid mobile number");
      return;
    }
    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    try {
      const formattedMobile = formData.mobile.startsWith('+') ? formData.mobile : `+91${formData.mobile}`;
      await register({
        name: formData.name,
        mobile: formattedMobile,
        password: formData.password,
      }).unwrap();
      toast.success("Verification code sent to your mobile");
      setStep("verify");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  // ── Verify email OTP ──
  const handleVerifyMobile = async () => {
    if (formData.otp.length < 4) {
      toast.error("Please enter the verification code");
      return;
    }
    try {
      const formattedMobile = formData.mobile.startsWith('+') ? formData.mobile : `+91${formData.mobile}`;
      const result = await verifyMobile({
        mobile: formattedMobile,
        otp: formData.otp,
      }).unwrap();
      dispatch(
        setCredentials({
          user: result.data.user,
          accessToken: result.data.accessToken,
        }),
      );
      toast.success("Account verified successfully!");
      dispatch(closeAuthDialog());
      setTimeout(resetForm, 300);
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  // ── Forgot Password → send OTP ──
  const handleForgotPassword = async () => {
    if (!formData.mobile || formData.mobile.length < 10) {
      toast.error("Please enter your mobile number");
      return;
    }
    try {
      const formattedMobile = formData.mobile.startsWith('+') ? formData.mobile : `+91${formData.mobile}`;
      await forgotPassword({ mobile: formattedMobile }).unwrap();
      toast.success("Reset code sent to your mobile");
      setStep("reset");
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  // ── Reset Password ──
  const handleResetPassword = async () => {
    if (formData.otp.length < 4) {
      toast.error("Please enter the verification code");
      return;
    }
    if (formData.newPassword.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    try {
      const formattedMobile = formData.mobile.startsWith('+') ? formData.mobile : `+91${formData.mobile}`;
      await resetPassword({
        mobile: formattedMobile,
        otp: formData.otp,
        newPassword: formData.newPassword,
      }).unwrap();
      toast.success("Password reset successful! Please sign in.");
      setStep("auth");
      setMode("signin");
      updateForm({ otp: "", newPassword: "", password: "" });
      clearSessionState();
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (step === "auth") {
      mode === "signin" ? handleLogin() : handleRegister();
    } else if (step === "verify") {
      handleVerifyMobile();
    } else if (step === "forgot") {
      handleForgotPassword();
    } else if (step === "reset") {
      handleResetPassword();
    }
  };

  const getTitle = () => {
    if (step === "verify") return "Verify Mobile";
    if (step === "forgot") return "Forgot Password";
    if (step === "reset") return "Reset Password";
    return mode === "signin" ? "Sign In" : "Join Rajul Eye";
  };

  const getDescription = () => {
    if (step === "verify") return "Enter the code sent to your mobile.";
    if (step === "forgot") return "We'll send a reset code to your mobile.";
    if (step === "reset") return "Enter the code and your new password.";
    return mode === "signin"
      ? "Welcome back to architectural excellence."
      : "Experience the future of precision optics.";
  };

  return (
    <ResponsiveModal
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={getTitle()}
      description={getDescription()}
      className="sm:max-w-[440px]"
    >
      <div className="space-y-6" ref={contentRef}>
        {/* ────── AUTH STEP (Sign In / Sign Up) ────── */}
        {step === "auth" && (
          <>
            {/* Custom Tabs */}
            <div className="flex p-1.5 bg-muted/50 rounded-3xl border border-border/40 mb-2">
              <button
                onClick={() => setMode("signin")}
                className={cn(
                  "flex-1 py-3 px-4 rounded-3xl text-xs font-black uppercase tracking-widest transition-all duration-300",
                  mode === "signin"
                    ? "bg-background text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Sign In
              </button>
              <button
                onClick={() => setMode("signup")}
                className={cn(
                  "flex-1 py-3 px-4 rounded-3xl text-xs font-black uppercase tracking-widest transition-all duration-300",
                  mode === "signup"
                    ? "bg-background text-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                Sign Up
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === "signup" && (
                <div className="space-y-2 group">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                    <Input
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={(e) => updateForm({ name: e.target.value })}
                      className="h-14 pl-12 rounded-3xl bg-muted/30 border-2 border-transparent focus:border-primary/20 focus:bg-background transition-all font-bold"
                      autoComplete="name"
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2 group">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">
                  Mobile Number (10 digits)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">+91</span>
                  <Input
                    type="tel"
                    placeholder="1234567890"
                    value={formData.mobile}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                      updateForm({ mobile: val });
                    }}
                    className="h-14 pl-14 rounded-3xl bg-muted/30 border-2 border-transparent focus:border-primary/20 focus:bg-background transition-all font-bold"
                    autoComplete="tel"
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">
                  Security Key
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => updateForm({ password: e.target.value })}
                    className="h-14 pl-12 rounded-3xl bg-muted/30 border-2 border-transparent focus:border-primary/20 focus:bg-background transition-all font-bold"
                    autoComplete={
                      mode === "signin" ? "current-password" : "new-password"
                    }
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-14 rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-xl mt-4 group overflow-hidden relative"
                disabled={isLoading}
              >
                {isLoading ? (
                  <RefreshCw className="h-5 w-5 animate-spin" />
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    {mode === "signin"
                      ? "Verify Identity"
                      : "Continue to Verify"}
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>

              {mode === "signin" && (
                <button
                  type="button"
                  onClick={() => setStep("forgot")}
                  className="w-full py-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors"
                >
                  Forgot Password?
                </button>
              )}

              <p className="text-[10px] text-center text-muted-foreground/50 font-bold px-4 leading-relaxed uppercase tracking-wider">
                By continuing, you agree to our{" "}
                <span className="text-primary hover:underline cursor-pointer">
                  Terms of Service
                </span>{" "}
                and{" "}
                <span className="text-primary hover:underline cursor-pointer">
                  Privacy Policy
                </span>
              </p>
            </form>
          </>
        )}

        {/* ────── VERIFY EMAIL STEP (after signup) ────── */}
        {step === "verify" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                <Mail className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight">
                Verify Mobile
              </h3>
              <p className="text-xs text-muted-foreground font-bold">
                We've sent a verification code to <br />
                <span className="text-foreground">{formData.mobile}</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2 group">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">
                  Verification Code
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    placeholder="000000"
                    value={formData.otp}
                    onChange={(e) =>
                      updateForm({
                        otp: e.target.value.replace(/\D/g, "").slice(0, 6),
                      })
                    }
                    className="h-16 text-center text-2xl tracking-[1em] pl-6 rounded-3xl bg-muted/30 border-2 border-transparent focus:border-primary/20 focus:bg-background transition-all font-black"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-14 rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-xl mt-2 group overflow-hidden relative"
                disabled={isLoading}
              >
                {isLoading ? (
                  <RefreshCw className="h-5 w-5 animate-spin" />
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Verify & Create Account
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>

              <button
                type="button"
                onClick={async () => {
                  try {
                    await register({
                      name: formData.name,
                      mobile: formData.mobile,
                      password: formData.password,
                    }).unwrap();
                    toast.success("New code sent!");
                  } catch (err) {
                    toast.error(getErrorMessage(err));
                  }
                }}
                disabled={isLoading}
                className="w-full py-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-1 disabled:opacity-40"
              >
                <RefreshCw className="h-3 w-3" />
                Resend Code
              </button>

              <button
                type="button"
                onClick={() => setStep("auth")}
                className="w-full py-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-1"
              >
                <ArrowLeft className="h-3 w-3" />
                Change Details
              </button>
            </form>
          </div>
        )}

        {/* ────── FORGOT PASSWORD STEP ────── */}
        {step === "forgot" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                <KeyRound className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight">
                Forgot Password
              </h3>
              <p className="text-xs text-muted-foreground font-bold">
                Enter your mobile and we'll send a reset code.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2 group">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">
                  Mobile Number (10 digits)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-muted-foreground">+91</span>
                  <Input
                    type="tel"
                    placeholder="1234567890"
                    value={formData.mobile}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                      updateForm({ mobile: val });
                    }}
                    className="h-14 pl-14 rounded-3xl bg-muted/30 border-2 border-transparent focus:border-primary/20 focus:bg-background transition-all font-bold"
                    autoComplete="tel"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-14 rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-xl mt-2 group overflow-hidden relative"
                disabled={isLoading}
              >
                {isLoading ? (
                  <RefreshCw className="h-5 w-5 animate-spin" />
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Send Reset Code
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>

              <button
                type="button"
                onClick={() => {
                  setStep("auth");
                  setMode("signin");
                }}
                className="w-full py-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-1"
              >
                <ArrowLeft className="h-3 w-3" />
                Back to Sign In
              </button>
            </form>
          </div>
        )}

        {/* ────── RESET PASSWORD STEP ────── */}
        {step === "reset" && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="h-16 w-16 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight">
                Reset Password
              </h3>
              <p className="text-xs text-muted-foreground font-bold">
                Enter the code sent to <br />
                <span className="text-foreground">{formData.mobile}</span>
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2 group">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">
                  Reset Code
                </label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    placeholder="000000"
                    value={formData.otp}
                    onChange={(e) =>
                      updateForm({
                        otp: e.target.value.replace(/\D/g, "").slice(0, 6),
                      })
                    }
                    className="h-16 text-center text-2xl tracking-[1em] pl-6 rounded-3xl bg-muted/30 border-2 border-transparent focus:border-primary/20 focus:bg-background transition-all font-black"
                    inputMode="numeric"
                    autoComplete="one-time-code"
                  />
                </div>
              </div>

              <div className="space-y-2 group">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 ml-1">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground transition-colors group-focus-within:text-primary" />
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={formData.newPassword}
                    onChange={(e) =>
                      updateForm({ newPassword: e.target.value })
                    }
                    className="h-14 pl-12 rounded-3xl bg-muted/30 border-2 border-transparent focus:border-primary/20 focus:bg-background transition-all font-bold"
                    autoComplete="new-password"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-14 rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-xl mt-2 group overflow-hidden relative"
                disabled={isLoading}
              >
                {isLoading ? (
                  <RefreshCw className="h-5 w-5 animate-spin" />
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Reset Password
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                )}
              </Button>

              <button
                type="button"
                onClick={() => {
                  setStep("auth");
                  setMode("signin");
                }}
                className="w-full py-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center justify-center gap-1"
              >
                <ArrowLeft className="h-3 w-3" />
                Back to Sign In
              </button>
            </form>
          </div>
        )}
      </div>
    </ResponsiveModal>
  );
}
