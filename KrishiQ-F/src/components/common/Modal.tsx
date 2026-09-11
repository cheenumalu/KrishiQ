import React, { useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: React.ReactNode;
  subtitle?: string;
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl";
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  maxWidth = "md",
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClass = {
    sm: "max-w-sm",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  }[maxWidth];

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-xs transition-opacity"
        aria-hidden="true"
      />
      <div
        onClick={(e) => e.stopPropagation()}
        className={
          "relative bg-white dark:bg-[#142019] text-[#111827] dark:text-[#F0F5F1] rounded-2xl border border-[#E4E9E5] dark:border-[#23362B] shadow-2xl w-full z-10 overflow-hidden transform transition-all " +
          maxWidthClass
        }
      >
        <div className="flex items-start justify-between p-5 border-b border-[#E4E9E5] dark:border-[#23362B] bg-[#F6F8F4] dark:bg-[#101B15]">
          <div>
            <h3 className="text-lg font-bold text-[#111827] dark:text-white">{title}</h3>
            {subtitle && <p className="text-xs text-[#4B5563] dark:text-[#CBD5E1] mt-0.5 font-medium">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="text-[#6B7280] hover:text-[#111827] dark:text-[#94A3B8] dark:hover:text-white rounded-lg p-1.5 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};