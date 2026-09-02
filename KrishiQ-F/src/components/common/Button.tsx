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
      "bg-[#EEF5EF] hover:bg-[#E4E9E5] text-[#123D2D] border border-[#58A66B]/30",
    outline:
      "bg-white hover:bg-[#F6F8F4] text-[#17211B] border border-[#E4E9E5] hover:border-[#66736B]/40 shadow-xs font-medium",
    danger:
      "bg-[#D95555] hover:bg-[#B84040] text-white border border-[#D95555]/20 shadow-xs",
    accent:
      "bg-[#F2A93B] hover:bg-[#D99126] text-[#17211B] border border-[#F2A93B]/20 shadow-xs",
    ghost:
      "bg-transparent hover:bg-[#EEF5EF] text-[#66736B] hover:text-[#123D2D]",
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

