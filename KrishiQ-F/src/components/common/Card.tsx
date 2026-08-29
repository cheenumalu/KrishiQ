import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  padding?: "none" | "sm" | "md" | "lg";
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  padding = "md",
  className = "",
  ...props
}) => {
  const paddingStyles = {
    none: "",
    sm: "p-3 sm:p-4",
    md: "p-4 sm:p-5",
    lg: "p-5 sm:p-6",
  };

  return (
    <div
      className={`bg-white rounded-xl border border-slate-200 ${paddingStyles[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
