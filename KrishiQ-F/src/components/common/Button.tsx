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
    "inline-flex items-center justify-center font-semibold rounded-[10px] transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-[#2F7D4A]/30 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer active:scale-[0.99] tracking-tight";

  const sizeStyles: Record<ButtonSize, string> = {
    sm: "px-3 py-1 text-xs h-8 gap-1.5",
    md: "px-4 py-2 text-xs sm:text-sm h-10 gap-2 font-semibold",
    lg: "px-5 py-2.5 text-sm h-11 gap-2.5 font-semibold",
  };

  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      "bg-[#2F7D4A] hover:bg-[#123D2D] text-white border border-[#123D2D]/20 shadow-xs",
    secondary:
      "bg-[#EEF5EF] dark:bg-[#1A3125] hover:bg-[#E4E9E5] dark:hover:bg-[#23362B] text-[#123D2D] dark:text-[#52DB89] border border-[#58A66B]/30",
    outline:
      "bg-white dark:bg-[#142019] hover:bg-[#F6F8F4] dark:hover:bg-[#1A3125] text-[#111813] dark:text-[#F0F5F1] border border-[#E4E9E5] dark:border-[#23362B] hover:border-[#404A43]/40 shadow-xs font-medium",
    danger:
      "bg-[#D95555] hover:bg-[#B84040] text-white border border-[#D95555]/20 shadow-xs",
    accent:
      "bg-[#F2A93B] hover:bg-[#D99126] text-[#111813] border border-[#F2A93B]/20 shadow-xs font-bold",
    ghost:
      "bg-transparent hover:bg-[#EEF5EF] dark:hover:bg-[#1A3125] text-[#404A43] dark:text-[#CBD5E1] hover:text-[#123D2D] dark:hover:text-white",
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
