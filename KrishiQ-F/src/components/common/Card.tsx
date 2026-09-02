import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  padding?: "none" | "sm" | "md" | "lg";
  hoverable?: boolean;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  padding = "md",
  hoverable = false,
  className = "",
  ...props
}) => {
  const paddingStyles = {
    none: "",
    sm: "p-3",
    md: "p-4 sm:p-[18px]",
    lg: "p-4 sm:p-5",
  };

  return (
    <div
      className={`bg-white rounded-[16px] border border-[#E4E9E5] card-shadow ${
        hoverable ? "card-shadow-hover cursor-pointer" : ""
      } ${paddingStyles[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};


