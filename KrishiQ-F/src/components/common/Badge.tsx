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
      container: "bg-[#EEF5EF] text-[#123D2D] border-[#58A66B]/30",
      dot: "bg-[#2F7D4A]",
    },
    success: {
      container: "bg-[#EEF5EF] text-[#123D2D] border-[#58A66B]/30",
      dot: "bg-[#2F7D4A]",
    },
    warning: {
      container: "bg-[#FEF5E7] text-[#9A6210] border-[#F2A93B]/40",
      dot: "bg-[#F2A93B]",
    },
    critical: {
      container: "bg-[#FDF2F2] text-[#9B2C2C] border-[#D95555]/30",
      dot: "bg-[#D95555]",
    },
    info: {
      container: "bg-[#F0F5FA] text-[#24538F] border-[#4178C0]/30",
      dot: "bg-[#4178C0]",
    },
    neutral: {
      container: "bg-[#F6F8F4] text-[#66736B] border-[#E5EAE6]",
      dot: "bg-[#8A958E]",
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

