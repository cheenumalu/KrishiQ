import React from "react";

interface EmblemProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  showText?: boolean;
}

/**
 * State Emblem of India (Ashoka Lion Capital with Satyameva Jayate)
 * Crisp vector representation standard across all GoI / NIC web portals.
 */
export const EmblemOfIndia: React.FC<EmblemProps> = ({
  className = "",
  size = "md",
  showText = true,
}) => {
  const sizeMap = {
    sm: "w-8 h-10",
    md: "w-10 h-13",
    lg: "w-14 h-18",
    xl: "w-20 h-26",
  };

  return (
    <div className={`inline-flex flex-col items-center select-none ${className}`}>
      <svg
        viewBox="0 0 100 125"
        className={`${sizeMap[size]} text-[#003366] dark:text-[#38BDF8] fill-current`}
        aria-hidden="true"
      >
        {/* Ashoka Lion Capital Vector Silhouette */}
        <g fill="currentColor">
          {/* Central Lion Head */}
          <path d="M50 8 C43 8 39 13 39 19 C39 24 43 28 47 30 L45 38 L55 38 L53 30 C57 28 61 24 61 19 C61 13 57 8 50 8 Z" opacity="0.95" />
          <circle cx="50" cy="17" r="3" fill="#FFFFFF" />
          {/* Left Lion Head */}
          <path d="M35 15 C29 15 25 20 26 26 C27 31 31 34 35 36 L36 44 L43 41 L40 34 C37 32 35 29 35 26 C35 21 38 17 42 16 C39 15 37 15 35 15 Z" opacity="0.9" />
          {/* Right Lion Head */}
          <path d="M65 15 C71 15 75 20 74 26 C73 31 69 34 65 36 L64 44 L57 41 L60 34 C63 32 65 29 65 26 C65 21 62 17 58 16 C61 15 63 15 65 15 Z" opacity="0.9" />
          {/* Mane & Shoulders */}
          <path d="M30 38 C28 45 32 54 38 58 L38 68 L62 68 L62 58 C68 54 72 45 70 38 C65 43 57 45 50 45 C43 45 35 43 30 38 Z" />
          {/* Pedestal Top Trim */}
          <rect x="22" y="69" width="56" height="3" rx="1.5" />
          {/* Abacus Base with Ashoka Chakra */}
          <rect x="20" y="73" width="60" height="15" rx="1" />
          {/* Central Ashoka Chakra in Abacus */}
          <circle cx="50" cy="80.5" r="6" fill="#FFFFFF" />
          <circle cx="50" cy="80.5" r="5" fill="#003366" />
          <circle cx="50" cy="80.5" r="1.5" fill="#FFFFFF" />
          {/* Spokes representation */}
          <path d="M50 75.5 L50 85.5 M45 80.5 L55 80.5 M46.5 77 L53.5 84 M46.5 84 L53.5 77" stroke="#FFFFFF" strokeWidth="0.7" />
          {/* Galloping Horse (Left of Chakra) */}
          <path d="M26 81 C28 78 32 77 35 79 C34 81 33 84 30 84 Z" fill="#FFFFFF" />
          {/* Standing Bull (Right of Chakra) */}
          <path d="M74 81 C72 78 68 77 65 79 C66 81 67 84 70 84 Z" fill="#FFFFFF" />
          {/* Lower Bell-shaped Lotus Base */}
          <path d="M24 89 C24 89 26 95 35 96 C40 96.5 45 94 50 94 C55 94 60 96.5 65 96 C74 95 76 89 76 89 L24 89 Z" />
          {/* Plinth Footer */}
          <rect x="18" y="97" width="64" height="3.5" rx="1" />
        </g>
      </svg>
      {showText && (
        <span className="text-[9px] sm:text-[10px] font-bold text-[#003366] dark:text-[#38BDF8] tracking-[0.08em] uppercase text-center mt-0.5 leading-none font-sans">
          सत्यमेव जयते
        </span>
      )}
    </div>
  );
};

/**
 * Digital India, e-NAM, and Azadi Ka Amrit Mahotsav Badges
 */
export const GovInitiativeBadges: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Digital India Badge */}
      <div className="hidden sm:flex flex-col items-center justify-center px-2.5 py-1 bg-white dark:bg-[#131D28] border border-[#CBD5E1] dark:border-slate-700 rounded-xs shadow-none">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-[#FF9933]" />
          <span className="w-2 h-2 rounded-full bg-[#138808]" />
          <span className="text-[11px] font-extrabold text-[#003366] dark:text-[#38BDF8] tracking-tight">Digital India</span>
        </div>
        <span className="text-[8px] text-slate-500 dark:text-slate-400 font-semibold tracking-wider">डिजिटल भारत</span>
      </div>

      {/* e-NAM Badge */}
      <div className="hidden md:flex flex-col items-center justify-center px-2.5 py-1 bg-white dark:bg-[#131D28] border border-[#CBD5E1] dark:border-slate-700 rounded-xs shadow-none">
        <span className="text-[11px] font-extrabold text-[#15803D] dark:text-emerald-400 tracking-tight">e-NAM</span>
        <span className="text-[8px] text-slate-500 dark:text-slate-400 font-semibold tracking-wider">राष्ट्रीय कृषि बाज़ार</span>
      </div>

      {/* Viksit Bharat @ 2047 */}
      <div className="hidden lg:flex flex-col items-center justify-center px-2.5 py-1 bg-white dark:bg-[#131D28] border border-[#CBD5E1] dark:border-slate-700 rounded-xs shadow-none">
        <span className="text-[10px] font-extrabold text-[#B45309] dark:text-amber-400 tracking-tight">VIKSIT BHARAT</span>
        <span className="text-[8px] text-slate-500 dark:text-slate-400 font-semibold tracking-wider">विकसित भारत @2047</span>
      </div>
    </div>
  );
};
