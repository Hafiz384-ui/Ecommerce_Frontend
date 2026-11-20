import React, { useState } from "react";
import { Tag, Copy, Check, Clock, Sparkles, CheckCircle2, Ban } from "lucide-react";
import { toast } from "react-toastify";

interface CouponProp {
  index?: number;
  isActive: boolean;
  code: string;
  discount: number;
  expiry: Date | string;
  isUsed?: boolean;
  status?: "ACTIVE" | "USED" | "EXPIRED" | "DISABLED";
  statusLabel?: string;
}

const CouponCard: React.FC<CouponProp> = ({
  isActive,
  code,
  discount,
  expiry,
  isUsed,
  status,
  statusLabel,
}) => {
  const [copied, setCopied] = useState(false);
  const formattedDate = expiry
    ? new Date(expiry).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "No expiry";

  const isUsable = isActive && !isUsed && status !== "USED" && status !== "EXPIRED" && status !== "DISABLED";

  const handleCopy = () => {
    if (!isUsable) {
      toast.info(`This coupon is ${statusLabel?.toLowerCase() || "unavailable"}.`);
      return;
    }
    navigator.clipboard.writeText(String(code));
    setCopied(true);
    toast.success(`Coupon "${code}" copied to clipboard!`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`relative bg-white rounded-3xl border p-6 transition-all duration-300 flex flex-col justify-between overflow-hidden ${
        isUsable
          ? "border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-sm"
          : "border-slate-200/60 bg-slate-50/50 opacity-75"
      }`}
    >
      {/* Top Banner & Explicit Status Badge */}
      <div>
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <Tag size={13} className="text-slate-400" />
            <span>Store Voucher</span>
          </div>

          {/* Dynamic badge based on actual state */}
          {status === "USED" || isUsed ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200/70">
              <CheckCircle2 size={11} className="text-amber-600" />
              <span>Redeemed</span>
            </span>
          ) : isUsable ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
              <Sparkles size={11} className="text-emerald-500" />
              <span>Available</span>
            </span>
          ) : status === "EXPIRED" ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200/70">
              <Ban size={11} className="text-rose-500" />
              <span>Expired</span>
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-500">
              {statusLabel || "Inactive"}
            </span>
          )}
        </div>

        {/* Discount Amount */}
        <div className="mt-2">
          <p
            className={`text-3xl sm:text-4xl font-black tracking-tight ${
              isUsable ? "text-slate-900" : "text-slate-400 line-through decoration-slate-300"
            }`}
          >
            {discount}% OFF
          </p>
          <p className="text-xs text-slate-500 mt-1">
            {isUsable
              ? "Apply at checkout on all eligible electronics."
              : isUsed || status === "USED"
              ? "This coupon has already been redeemed on an order."
              : "This promotional voucher is no longer active."}
          </p>
        </div>
      </div>

      {/* Ticket Divider with Notches */}
      <div className="relative my-5">
        <div className="border-t border-dashed border-slate-200" />
        {/* Left Notch */}
        <div className="absolute -left-9 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#FBFBFC] border-r border-slate-200/80" />
        {/* Right Notch */}
        <div className="absolute -right-9 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#FBFBFC] border-l border-slate-200/80" />
      </div>

      {/* Code & Copy Action */}
      <div className="space-y-3">
        <div
          className={`flex items-center justify-between gap-2 p-1.5 rounded-2xl border ${
            isUsable
              ? "bg-slate-50 border-slate-200/70"
              : "bg-slate-100/60 border-slate-200/50"
          }`}
        >
          <span
            className={`font-mono text-sm font-black px-3 tracking-wider select-all ${
              isUsable ? "text-slate-900" : "text-slate-400"
            }`}
          >
            {code}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            disabled={!isUsable}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer shrink-0 ${
              isUsable
                ? "bg-black text-white hover:bg-slate-800"
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            {copied ? (
              <>
                <Check size={12} strokeWidth={2.5} />
                <span>Copied</span>
              </>
            ) : isUsed || status === "USED" ? (
              <span>Redeemed</span>
            ) : isUsable ? (
              <>
                <Copy size={12} />
                <span>Copy</span>
              </>
            ) : (
              <span>Unavailable</span>
            )}
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Clock size={12} />
          <span>
            {status === "EXPIRED" ? `Expired on ${formattedDate}` : `Valid until ${formattedDate}`}
          </span>
        </div>
      </div>
    </div>
  );
};

export default CouponCard;
