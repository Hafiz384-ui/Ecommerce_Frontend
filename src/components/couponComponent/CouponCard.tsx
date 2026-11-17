import React, { useState } from "react";
import { Tag, Copy, Check, Clock, Sparkles } from "lucide-react";
import { toast } from "react-toastify";

interface CouponProp {
  index?: number;
  isActive: Boolean;
  code: String;
  discount: number;
  expiry: Date;
}

const CouponCard: React.FC<CouponProp> = ({
  isActive,
  code,
  discount,
  expiry,
}) => {
  const [copied, setCopied] = useState(false);
  const formattedDate = expiry
    ? new Date(expiry).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : "No expiry";

  const handleCopy = () => {
    navigator.clipboard.writeText(String(code));
    setCopied(true);
    toast.success(`Coupon "${code}" copied to clipboard!`);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={`relative bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all duration-300 flex flex-col justify-between overflow-hidden ${
        !isActive ? "opacity-60 grayscale" : ""
      }`}
    >
      {/* Top Banner & Status */}
      <div>
        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <Tag size={13} className="text-slate-400" />
            <span>Store Voucher</span>
          </div>

          {isActive ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
              <Sparkles size={11} className="text-emerald-500" />
              <span>Active</span>
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-slate-100 text-slate-500">
              Expired
            </span>
          )}
        </div>

        {/* Discount Amount */}
        <div className="mt-2">
          <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {discount}% OFF
          </p>
          <p className="text-xs text-slate-500 mt-1">
            Apply at checkout on all eligible electronics.
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
        <div className="flex items-center justify-between gap-2 p-1.5 bg-slate-50 rounded-2xl border border-slate-200/70">
          <span className="font-mono text-sm font-black text-slate-900 px-3 tracking-wider select-all">
            {code}
          </span>
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-black text-white text-xs font-bold hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
          >
            {copied ? (
              <>
                <Check size={12} strokeWidth={2.5} />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy size={12} />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <Clock size={12} />
          <span>Valid until {formattedDate}</span>
        </div>
      </div>
    </div>
  );
};

export default CouponCard;
