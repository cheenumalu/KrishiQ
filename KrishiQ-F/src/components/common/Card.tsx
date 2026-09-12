import React from "react";

interface CardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  children: React.ReactNode;
  padding?: "none" | "sm" | "md" | "lg";
  hoverable?: boolean;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  headerRight?: React.ReactNode;
  className?: string;
}

/**
 * Standard Government Panel / Card
 * Replaces SaaS rounded pill containers with structured, high-density government panels.
 */
export const Card: React.FC<CardProps> = ({
  children,
  padding = "md",
  hoverable = false,
  title,
  subtitle,
  headerRight,
  className = "",
  ...props
}) => {
  const paddingStyles = {
    none: "",
    sm: "p-2.5 sm:p-3",
    md: "p-3.5 sm:p-4",
    lg: "p-4 sm:p-5",
  };

  return (
    <div
      className={`bg-white dark:bg-[#131D28] text-[#0F172A] dark:text-[#F8FAFC] rounded-xs border border-[#CBD5E1] dark:border-[#1E293B] card-shadow overflow-hidden ${
        hoverable ? "card-shadow-hover" : ""
      } ${title || headerRight ? "" : paddingStyles[padding]} ${className}`}
      {...props}
    >
      {(title || headerRight) && (
        <div className="bg-[#F8FAFC] dark:bg-[#0E1620] px-3.5 sm:px-4 py-2.5 border-b border-[#CBD5E1] dark:border-[#1E293B] flex items-center justify-between gap-2">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-[#003366] dark:text-[#38BDF8] tracking-tight leading-snug">
              {title}
            </h3>
            {subtitle && (
              <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400">
                {subtitle}
              </p>
            )}
          </div>
          {headerRight && <div className="shrink-0">{headerRight}</div>}
        </div>
      )}
      <div className={title || headerRight ? paddingStyles[padding] : ""}>{children}</div>
    </div>
  );
};
