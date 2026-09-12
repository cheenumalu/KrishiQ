import React from "react";

export type BadgeVariant = "normal" | "success" | "warning" | "critical" | "info" | "neutral";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: "sm" | "md";
  dot?: boolean;
  className?: string;
}

/**
 * Official Government Status Badge / Stamp
 * Renders as a structured status stamp with crisp borders and uppercase typography.
 */
export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "neutral",
  size = "md",
  dot = false,
  className = "",
}) => {
  const variantStyles: Record<BadgeVariant, { container: string; dot: string }> = {
    normal: {
      container: "bg-[#F0FDF4] dark:bg-[#062413] text-[#15803D] dark:text-[#4ADE80] border-[#86EFAC] dark:border-[#166534]",
      dot: "bg-[#15803D] dark:bg-[#4ADE80]",
    },
    success: {
      container: "bg-[#F0FDF4] dark:bg-[#062413] text-[#15803D] dark:text-[#4ADE80] border-[#86EFAC] dark:border-[#166534]",
      dot: "bg-[#15803D] dark:bg-[#4ADE80]",
    },
    warning: {
      container: "bg-[#FFFBEB] dark:bg-[#2E1A04] text-[#B45309] dark:text-[#FBBF24] border-[#FDE68A] dark:border-[#78350F]",
      dot: "bg-[#B45309] dark:bg-[#FBBF24]",
    },
    critical: {
      container: "bg-[#FEF2F2] dark:bg-[#2A0808] text-[#B91C1C] dark:text-[#F87171] border-[#FECACA] dark:border-[#7F1D1D]",
      dot: "bg-[#B91C1C] dark:bg-[#F87171]",
    },
    info: {
      container: "bg-[#EFF6FF] dark:bg-[#081B38] text-[#003366] dark:text-[#60A5FA] border-[#BFDBFE] dark:border-[#1E3A8A]",
      dot: "bg-[#003366] dark:bg-[#60A5FA]",
    },
    neutral: {
      container: "bg-[#F8FAFC] dark:bg-[#0F172A] text-[#334155] dark:text-[#CBD5E1] border-[#CBD5E1] dark:border-[#334155]",
      dot: "bg-[#64748B] dark:bg-[#94A3B8]",
    },
  };

  const sizeStyles = {
    sm: "px-1.5 py-0.5 text-[10px] font-bold rounded-2xs uppercase tracking-wide",
    md: "px-2 py-0.5 text-[11px] font-bold rounded-2xs uppercase tracking-wide",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 border font-sans select-none ${variantStyles[variant].container} ${sizeStyles[size]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${variantStyles[variant].dot}`} />}
      {children}
    </span>
  );
};
