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

/**
 * Official Government Dialogue / Modal
 * Styled with an authoritative national header strip and crisp borders.
 */
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
      className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        className="fixed inset-0 bg-slate-900/70 dark:bg-black/85 transition-opacity"
        aria-hidden="true"
      />
      <div
        onClick={(e) => e.stopPropagation()}
        className={
          "relative bg-white dark:bg-[#131D28] text-[#0F172A] dark:text-[#F8FAFC] rounded-xs border-2 border-[#003366] dark:border-[#1E3A8A] shadow-2xl w-full z-10 overflow-hidden " +
          maxWidthClass
        }
      >
        {/* National Header Strip */}
        <div className="flex items-start justify-between px-4 sm:px-5 py-3.5 bg-[#003366] text-white border-b-2 border-[#FF9933]">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white tracking-tight leading-snug">
              {title}
            </h3>
            {subtitle && (
              <p className="text-[11px] text-slate-200 mt-0.5 font-normal">
                {subtitle}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white rounded-xs p-1 hover:bg-white/10 transition-colors cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-5 max-h-[82vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
};