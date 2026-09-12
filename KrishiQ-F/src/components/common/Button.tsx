import React from "react";

export type ButtonVariant = "primary" | "secondary" | "outline" | "danger" | "accent" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
}

/**
 * Official Government Action Button
 * Formal, authoritative, accessible styling compliant with GIGW.
 */
export const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "md",
  leftIcon,
  rightIcon,
  isLoading,
  disabled,
  className = "",
  ...props
}) => {
  const baseStyles =
    "inline-flex items-center justify-center font-bold rounded-xs transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#003366]/40 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer tracking-tight uppercase";

  const sizeStyles: Record<ButtonSize, string> = {
    sm: "px-2.5 py-1 text-xs h-7.5 gap-1.5",
    md: "px-3.5 py-1.5 text-xs sm:text-sm h-9 gap-2",
    lg: "px-5 py-2.5 text-sm h-10 gap-2.5",
  };

  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      "bg-[#003366] hover:bg-[#002244] text-white border border-[#002244] shadow-xs",
    secondary:
      "bg-[#15803D] hover:bg-[#166534] text-white border border-[#14532D] shadow-xs",
    outline:
      "bg-white dark:bg-[#131D28] hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B] text-[#0F172A] dark:text-white border border-[#CBD5E1] dark:border-[#334155] shadow-xs font-semibold",
    danger:
      "bg-[#B91C1C] hover:bg-[#991B1B] text-white border border-[#7F1D1D] shadow-xs",
    accent:
      "bg-[#D97706] hover:bg-[#B45309] text-white border border-[#92400E] shadow-xs",
    ghost:
      "bg-transparent hover:bg-slate-100 dark:hover:bg-[#1E293B] text-[#334155] dark:text-slate-300 hover:text-[#003366] dark:hover:text-white",
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
};
