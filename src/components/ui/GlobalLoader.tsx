import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import useLoadingStore from "../../store/loadingStore";

interface GlobalLoaderProps {
  show?: boolean;
  message?: string;
  fullScreen?: boolean;
}

export const GlobalLoader: React.FC<GlobalLoaderProps> = ({
  show,
  message,
  fullScreen = true,
}) => {
  const storeState = useLoadingStore();

  const isVisible = show !== undefined ? show : storeState.isLoading;
  const displayMessage = message || storeState.message || "Loading...";

  // Prevent background scrolling when full-screen loader is active
  useEffect(() => {
    if (fullScreen && isVisible && typeof document !== "undefined") {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [fullScreen, isVisible]);

  if (!isVisible) return null;

  const loaderCard = (
    <div className="bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-3xl p-8 sm:p-10 shadow-2xl flex flex-col items-center justify-center max-w-xs sm:max-w-sm w-full mx-4 text-center animate-in fade-in zoom-in-95 duration-200">
      {/* Brand Spinner Container */}
      <div className="relative w-16 h-16 flex items-center justify-center mb-5">
        {/* Outer glowing halo */}
        <div className="absolute inset-0 rounded-full bg-rose-500/10 animate-ping opacity-60" />

        {/* Dual-color spinning ring */}
        <div className="w-16 h-16 rounded-full border-[3.5px] border-slate-100 border-t-slate-900 border-r-rose-600 animate-spin" />

        {/* Brand Monogram in center */}
        <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none">
          <span className="text-sm font-black text-slate-900 tracking-tighter">
            D
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-rose-600 ml-0.5 inline-block" />
        </div>
      </div>

      {/* Main Status Text */}
      <h3 className="text-base font-bold text-slate-900 tracking-tight mb-1">
        {displayMessage}
      </h3>

      {/* Status Subtitle */}
      <p className="text-xs text-slate-500 font-medium">
        Please wait a moment...
      </p>
    </div>
  );

  if (!fullScreen) {
    return (
      <div className="w-full min-h-[350px] flex items-center justify-center p-6">
        {loaderCard}
      </div>
    );
  }

  // Render full-screen overlay in portal at root
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      role="status"
      aria-live="polite"
      aria-label={displayMessage}
      className="fixed inset-0 z-[99999] w-screen h-screen bg-black/40 backdrop-blur-md flex items-center justify-center p-4 transition-all duration-200"
    >
      {loaderCard}
    </div>,
    document.body
  );
};

export default GlobalLoader;
