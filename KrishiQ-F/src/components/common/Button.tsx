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
    "inline-flex items-center justify-center font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";

  const sizeStyles: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-xs gap-1.5",
    md: "px-4 py-2 text-xs sm:text-sm gap-2",
    lg: "px-5 py-2.5 text-sm sm:text-base gap-2.5",
  };

  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      "bg-emerald-800 hover:bg-emerald-900 active:bg-emerald-950 text-white border border-emerald-900 shadow-xs",
    secondary:
      "bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-800 border border-slate-300 shadow-xs",
    outline:
      "bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 hover:border-slate-400 shadow-xs",
    danger:
      "bg-red-700 hover:bg-red-800 active:bg-red-900 text-white border border-red-800 shadow-xs",
    accent:
      "bg-amber-700 hover:bg-amber-800 active:bg-amber-900 text-white border border-amber-800 shadow-xs",
    ghost:
      "bg-transparent hover:bg-slate-100 text-slate-700 hover:text-slate-900",
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
};
