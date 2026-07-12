"use client";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X, Loader2, Camera, Box, Sparkles, Smartphone } from "lucide-react";

// Valid SKUs from Jeeliz GlassesDB
// Full list: https://github.com/jeeliz/jeelizGlassesVTOWidget/blob/master/glassesSKU.csv
const FALLBACK_SKU = "rayban_aviator_or_vertFlash";

function TryOnModal({ sku, arModelUrl, onClose }) {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState(null);
  const [modelViewerLoaded, setModelViewerLoaded] = useState(false);
  const initRef = useRef(false);

  useEffect(() => {
    // Prevent body scroll while modal is open
    document.body.style.overflow = "hidden";

    if (arModelUrl) {
      // ── Custom GLB Model Mode (Model Viewer) ──
      const script = document.createElement("script");
      script.type = "module";
      script.src =
        "https://ajax.googleapis.com/ajax/libs/model-viewer/4.0.0/model-viewer.min.js";
      script.onload = () => {
        setModelViewerLoaded(true);
        setIsReady(true);
      };
      script.onerror = () => {
        setError("Failed to load 3D visualizer script. Please refresh.");
      };
      document.body.appendChild(script);

      return () => {
        document.body.style.overflow = "";
        if (document.body.contains(script)) document.body.removeChild(script);
      };
    } else {
      // ── Standard Jeeliz VTO Mode (Webcam Face Tracking) ──
      // Inject Jeeliz CSS
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "/jeeliz/JeelizVTOWidget.css";
      document.head.appendChild(link);

      // Inject Jeeliz JS
      const script = document.createElement("script");
      script.src = "/jeeliz/JeelizVTOWidget.js";
      script.async = false;

      script.onload = () => {
        if (!window.JEELIZVTOWIDGET) {
          setError("AR library failed to expose its API. Please refresh.");
          return;
        }
        if (initRef.current) return;
        initRef.current = true;

        // One rAF to ensure DOM elements are painted
        requestAnimationFrame(() => {
          try {
            window.JEELIZVTOWIDGET.start({
              sku: sku || FALLBACK_SKU,
              isShadow: true,
              searchImageMask:
                "https://appstatic.jeeliz.com/jeewidget/images/target512.jpg",
              searchImageColor: 0xeeeeee,
              callbackReady: () => {
                setIsReady(true);
              },
              onError: (errorLabel) => {
                console.error("Jeeliz Error:", errorLabel);
                initRef.current = false;
                switch (errorLabel) {
                  case "WEBCAM_UNAVAILABLE":
                    setError("Camera not available or access was denied.");
                    break;
                  case "HTTPS_ONLY":
                    setError(
                      "Virtual Try-On requires a secure (HTTPS) connection.",
                    );
                    break;
                  case "BROWSER_NOTCOMPATIBLE":
                    setError("Your browser doesn't support WebAR. Try Chrome.");
                    break;
                  case "INVALID_SKU":
                    setError(
                      "This glasses model is not available for try-on yet.",
                    );
                    break;
                  case "PLACEHOLDER_NULL_WIDTH":
                  case "PLACEHOLDER_NULL_HEIGHT":
                    setError("AR container not visible. Please try again.");
                    break;
                  default:
                    setError(`AR error: ${errorLabel}. Please refresh.`);
                }
              },
            });
          } catch (err) {
            console.error("Failed to start Jeeliz:", err);
            setError("Failed to initialize Virtual Try-On. Please refresh.");
            initRef.current = false;
          }
        });
      };

      script.onerror = () => {
        setError("Could not load AR library. Check your connection.");
      };

      document.body.appendChild(script);

      return () => {
        document.body.style.overflow = "";
        if (window.JEELIZVTOWIDGET && initRef.current) {
          try {
            window.JEELIZVTOWIDGET.pause();
          } catch (_) {}
        }
        if (document.head.contains(link)) document.head.removeChild(link);
        if (document.body.contains(script)) document.body.removeChild(script);
      };
    }
  }, [sku, arModelUrl]);

  // Close on Escape key
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    /* Portal renders this directly on <body> — no stacking context issues */
    <div
      style={{ position: "fixed", inset: 0, zIndex: 9999 }}
      className="bg-black/95 flex flex-col items-center justify-center backdrop-blur-md p-4 animate-in fade-in duration-300"
    >
      {/* Premium Ambient Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -z-10 pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-[100px] -z-10 pointer-events-none" />

      {/* Header Close button */}
      <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-50">
        <div className="flex items-center gap-2 text-white">
          <Sparkles className="w-5 h-5 text-primary animate-pulse" />
          <span className="text-xs font-black uppercase tracking-[0.25em] italic">
            {arModelUrl ? "Custom 3D & Mobile AR" : "Webcam Face-Track AR"}
          </span>
        </div>
        <button
          onClick={onClose}
          className="bg-white/10 hover:bg-white/20 text-white p-3 rounded-2xl backdrop-blur-md border border-white/10 transition-all hover:scale-105 active:scale-95"
          aria-label="Close Virtual Try-On"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {error ? (
        <div className="text-white text-center p-8 bg-destructive/10 rounded-3xl border border-destructive/20 max-w-sm mx-4 backdrop-blur-md shadow-2xl animate-in zoom-in-95">
          <Camera className="w-12 h-12 mx-auto mb-4 text-destructive/80" />
          <p className="font-black uppercase tracking-wider text-base mb-2">
            Could not start AR
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed mb-6">
            {error}
          </p>
          <button
            onClick={onClose}
            className="w-full py-3 bg-white text-black font-black uppercase tracking-widest text-[10px] rounded-xl hover:bg-zinc-200 transition-all active:scale-95 shadow-xl"
          >
            Close Dialog
          </button>
        </div>
      ) : arModelUrl ? (
        // ── Custom GLB Model Viewer Rendering ──
        <div className="relative w-full max-w-2xl bg-zinc-950/80 border border-white/5 rounded-[2rem] shadow-2xl overflow-hidden aspect-4/3 flex flex-col justify-between">
          {/* 3D Viewer Element */}
          <div className="flex-1 w-full h-full relative">
            {modelViewerLoaded && (
              <model-viewer
                src={arModelUrl}
                ar
                ar-modes="webxr scene-viewer quick-look"
                camera-controls
                touch-action="pan-y"
                auto-rotate
                shadow-intensity="1.5"
                environment-image="neutral"
                alt="Glasses 3D custom model"
                style={{
                  width: "100%",
                  height: "100%",
                  background: "transparent",
                }}
              >
                {/* Custom Slot AR Prompt / Button inside Viewer */}
                <button
                  slot="ar-button"
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2.5 bg-primary text-primary-foreground px-6 py-3 rounded-full font-black text-[10px] uppercase tracking-widest shadow-2xl hover:scale-105 active:scale-95 transition-all"
                >
                  <Smartphone className="w-4 h-4" />
                  Try On / View in Mobile AR
                </button>
              </model-viewer>
            )}

            {!isReady && (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-zinc-950">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
                <p className="text-xs font-black uppercase tracking-widest animate-pulse">
                  Configuring 3D Viewer...
                </p>
              </div>
            )}
          </div>

          {/* Bottom Interactive Bar */}
          <div className="p-5 border-t border-white/5 bg-zinc-900/60 backdrop-blur-md flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-white">
                Interactive 3D Preview
              </p>
              <p className="text-[8px] text-muted-foreground font-medium mt-0.5">
                Drag to rotate • Pinch to zoom
              </p>
            </div>
            <div className="flex items-center gap-2 bg-primary/10 text-primary border border-primary/20 px-3 py-1.5 rounded-xl">
              <Box className="w-3.5 h-3.5" />
              <span className="text-[8px] font-black uppercase tracking-widest">
                Custom AR Frame
              </span>
            </div>
          </div>
        </div>
      ) : (
        // ── Standard Jeeliz VTO Webcam Canvas ──
        <div
          id="JeelizVTOWidget"
          className="relative w-full max-w-2xl bg-zinc-950/80 border border-white/5 overflow-hidden rounded-[2rem] shadow-2xl aspect-4/3"
        >
          <canvas
            id="JeelizVTOWidgetCanvas"
            className="w-full h-full object-cover"
          />

          {!isReady && (
            <div
              style={{ position: "absolute", inset: 0, zIndex: 10 }}
              className="flex flex-col items-center justify-center text-white bg-zinc-950"
            >
              <Loader2 className="w-10 h-10 animate-spin mb-4 text-primary" />
              <p className="text-xs font-black uppercase tracking-widest animate-pulse">
                Initializing Camera AR...
              </p>
              <p className="text-[9px] text-muted-foreground mt-2 uppercase tracking-widest">
                Please approve camera access
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function VirtualTryOn({ sku, arModelUrl, onClose }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  // createPortal renders at document.body — bypasses ALL parent stacking contexts
  return createPortal(
    <TryOnModal
      sku={sku || FALLBACK_SKU}
      arModelUrl={arModelUrl}
      onClose={onClose}
    />,
    document.body,
  );
}
