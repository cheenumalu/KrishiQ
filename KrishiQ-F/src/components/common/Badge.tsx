import React from "react";

export type BadgeVariant = "normal" | "success" | "warning" | "critical" | "info" | "neutral";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: "sm" | "md";
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = "neutral",
  size = "md",
  dot = false,
  className = "",
}) => {
  const variantStyles: Record<BadgeVariant, { container: string; dot: string }> = {
    normal: {
      container: "bg-[#EEF5EF] dark:bg-[#1A3125] text-[#123D2D] dark:text-[#52DB89] border-[#58A66B]/30",
      dot: "bg-[#2F7D4A] dark:bg-[#52DB89]",
    },
    success: {
      container: "bg-[#EEF5EF] dark:bg-[#1A3125] text-[#123D2D] dark:text-[#52DB89] border-[#58A66B]/30",
      dot: "bg-[#2F7D4A] dark:bg-[#52DB89]",
    },
    warning: {
      container: "bg-[#FEF5E7] dark:bg-[#2A2315] text-[#9A6210] dark:text-[#F2A93B] border-[#F2A93B]/40",
      dot: "bg-[#F2A93B]",
    },
    critical: {
      container: "bg-[#FDF2F2] dark:bg-[#2A1515] text-[#9B2C2C] dark:text-[#FCA5A5] border-[#D95555]/30",
      dot: "bg-[#D95555]",
    },
    info: {
      container: "bg-[#EEF5EF] dark:bg-[#1A3125] text-[#123D2D] dark:text-[#52DB89] border-[#58A66B]/30",
      dot: "bg-[#2F7D4A] dark:bg-[#52DB89]",
    },
    neutral: {
      container: "bg-[#F6F8F4] dark:bg-[#101B15] text-[#404A43] dark:text-[#CBD5E1] border-[#E4E9E5] dark:border-[#23362B]",
      dot: "bg-[#66736C] dark:bg-[#94A3B8]",
    },
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px] font-semibold rounded-full",
    md: "px-2.5 py-0.5 text-xs font-semibold rounded-full",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 border tracking-tight font-sans ${variantStyles[variant].container} ${sizeStyles[size]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${variantStyles[variant].dot}`} />}
      {children}
    </span>
  );
};
