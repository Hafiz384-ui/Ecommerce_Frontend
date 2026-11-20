import React from "react";
import { Loader2 } from "lucide-react";

interface ButtonProps {
  text: string;
  onclick: (e?: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  loading?: boolean;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
}

const CredientialButton: React.FC<ButtonProps> = ({
  text,
  onclick,
  className,
  loading = false,
  disabled = false,
  type = "button",
}) => {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onclick}
      className={`group relative flex items-center justify-center gap-2.5 bg-black hover:bg-slate-800 disabled:bg-slate-400 disabled:cursor-not-allowed w-full py-3.5 cursor-pointer 
        rounded-2xl text-white font-bold text-base tracking-wide 
        shadow-md transition-all duration-200 active:scale-[0.98] ${className || ""}`}
    >
      {loading ? (
        <>
          <Loader2 size={18} className="animate-spin text-white" />
          <span>{text || "Please wait..."}</span>
        </>
      ) : (
        <span>{text}</span>
      )}
    </button>
  );
};

export default CredientialButton;
