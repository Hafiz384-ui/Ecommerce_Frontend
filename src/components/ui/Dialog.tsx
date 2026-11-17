import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

interface DialogContentProps {
  children: React.ReactNode;
  className?: string;
  onClose?: () => void;
}

export const Dialog: React.FC<DialogProps> = ({ open, onOpenChange, children }) => {
  useEffect(() => {
    if (!open) return;

    // Lock background scroll when dialog is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Close on Escape key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onOpenChange(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onOpenChange]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        boxSizing: "border-box",
      }}
    >
      {/* Dialog Overlay */}
      <div
        onClick={() => onOpenChange(false)}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.45)",
          backdropFilter: "blur(4px)",
          WebkitBackdropFilter: "blur(4px)",
        }}
      />

      {/* Dialog Viewport Centered Container */}
      <div
        style={{
          position: "relative",
          zIndex: 10000,
          width: "100%",
          maxWidth: "32rem",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

export const DialogContent: React.FC<DialogContentProps> = ({
  children,
  className = "",
  onClose,
}) => {
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={`relative w-full bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-8 shadow-2xl duration-200 animate-in fade-in zoom-in-95 ${className}`}
    >
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-5 top-5 p-2 rounded-full text-slate-400 hover:text-black hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>
      )}
      {children}
    </div>
  );
};

export const DialogHeader: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <div className={`flex flex-col space-y-1.5 text-left pb-4 border-b border-slate-100 ${className}`}>
    {children}
  </div>
);

export const DialogTitle: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <h2 className={`text-xl sm:text-2xl font-black text-slate-900 tracking-tight ${className}`}>
    {children}
  </h2>
);

export const DialogDescription: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <p className={`text-xs sm:text-sm text-slate-500 ${className}`}>
    {children}
  </p>
);

export const DialogFooter: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => (
  <div className={`flex items-center justify-end gap-3 pt-4 border-t border-slate-100 ${className}`}>
    {children}
  </div>
);
