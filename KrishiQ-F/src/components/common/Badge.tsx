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
      container: "bg-emerald-50 text-emerald-800 border-emerald-300",
      dot: "bg-emerald-600",
    },
    success: {
      container: "bg-emerald-50 text-emerald-800 border-emerald-300",
      dot: "bg-emerald-600",
    },
    warning: {
      container: "bg-amber-50 text-amber-900 border-amber-300",
      dot: "bg-amber-600",
    },
    critical: {
      container: "bg-red-50 text-red-900 border-red-300",
      dot: "bg-red-600",
    },
    info: {
      container: "bg-sky-50 text-sky-900 border-sky-300",
      dot: "bg-sky-600",
    },
    neutral: {
      container: "bg-slate-100 text-slate-700 border-slate-300",
      dot: "bg-slate-500",
    },
  };

  const sizeStyles = {
    sm: "px-2 py-0.5 text-[11px] font-semibold",
    md: "px-2.5 py-1 text-xs font-semibold",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border tracking-normal font-sans ${variantStyles[variant].container} ${sizeStyles[size]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${variantStyles[variant].dot}`} />}
      {children}
    </span>
  );
};
