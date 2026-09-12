import React, { useState, useEffect } from "react";
import { useLanguage } from "../../i18n";
import { Globe, Volume2, Moon, Sun, ArrowDown } from "lucide-react";

interface GovTopBarProps {
  onFontSizeChange?: (size: "sm" | "md" | "lg") => void;
  onContrastToggle?: () => void;
  isHighContrast?: boolean;
  theme?: "light" | "dark";
  onToggleTheme?: () => void;
}

/**
 * GIGW-Standard Accessibility & National Identity Top Bar
 * Mandatory for all Indian Government / NIC web portals.
 */
export const GovTopBar: React.FC<GovTopBarProps> = ({
  onFontSizeChange,
  onContrastToggle,
  isHighContrast = false,
  theme = "light",
  onToggleTheme,
}) => {
  const { language, setLanguage, isHindi } = useLanguage();
  const [currentISTTime, setCurrentISTTime] = useState("");
  const [activeFontSize, setActiveFontSize] = useState<"sm" | "md" | "lg">("md");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Format to Indian Standard Time (IST)
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Kolkata",
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      };
      setCurrentISTTime(new Intl.DateTimeFormat("en-IN", options).format(now));
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleFontChange = (size: "sm" | "md" | "lg") => {
    setActiveFontSize(size);
    if (onFontSizeChange) {
      onFontSizeChange(size);
    }
    // Also apply to document root for global accessibility sizing
    const root = document.documentElement;
    root.classList.remove("text-scale-sm", "text-scale-md", "text-scale-lg");
    root.classList.add(`text-scale-${size}`);
  };

  return (
    <div className="w-full bg-[#F1F5F9] dark:bg-[#0B1118] border-b border-[#CBD5E1] dark:border-slate-800 text-[#1E293B] dark:text-slate-300 text-[11px] font-sans">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between py-1 gap-2">
          
          {/* Left: National Identity & Ministry Title */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 font-semibold text-[#003366] dark:text-[#38BDF8]">
              <span className="inline-block w-3.5 h-2.5 rounded-2xs overflow-hidden border border-slate-300 dark:border-slate-600">
                <span className="block h-1/3 bg-[#FF9933]"></span>
                <span className="block h-1/3 bg-[#FFFFFF]"></span>
                <span className="block h-1/3 bg-[#138808]"></span>
              </span>
              <span>{isHindi ? "भारत सरकार" : "GOVERNMENT OF INDIA"}</span>
            </div>

            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>

            <span className="text-slate-700 dark:text-slate-300 hidden sm:inline font-medium">
              {isHindi ? "कृषि एवं किसान कल्याण मंत्रालय" : "MINISTRY OF AGRICULTURE & FARMERS WELFARE"}
            </span>
          </div>

          {/* Right: Accessibility Controls & Utilities */}
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            {/* Skip to Main Content */}
            <a
              href="#main-content"
              className="text-[#003366] dark:text-[#38BDF8] hover:underline font-semibold focus:outline-none focus:ring-1 focus:ring-[#003366] px-1 hidden md:inline-block"
            >
              {isHindi ? "मुख्य सामग्री पर जाएं" : "Skip to Main Content"}
            </a>

            <span className="text-slate-300 dark:text-slate-700 hidden md:inline">|</span>

            {/* Screen Reader Notice */}
            <span
              title={isHindi ? "स्क्रीन रीडर सहायता" : "Screen Reader Access Available"}
              className="hidden lg:flex items-center gap-1 text-slate-600 dark:text-slate-400"
            >
              <Volume2 className="w-3 h-3 text-[#003366] dark:text-[#38BDF8]" />
              <span>{isHindi ? "स्क्रीन रीडर" : "Screen Reader"}</span>
            </span>

            <span className="text-slate-300 dark:text-slate-700 hidden lg:inline">|</span>

            {/* Font Sizer (A- / A / A+) */}
            <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-xs overflow-hidden bg-white dark:bg-slate-800">
              <button
                type="button"
                onClick={() => handleFontChange("sm")}
                title="Decrease Font Size"
                className={`px-1.5 py-0.5 font-bold transition-colors cursor-pointer ${
                  activeFontSize === "sm" ? "bg-[#003366] text-white dark:bg-[#1E40AF]" : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                A-
              </button>
              <button
                type="button"
                onClick={() => handleFontChange("md")}
                title="Default Font Size"
                className={`px-1.5 py-0.5 font-bold border-x border-slate-300 dark:border-slate-700 transition-colors cursor-pointer ${
                  activeFontSize === "md" ? "bg-[#003366] text-white dark:bg-[#1E40AF]" : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                A
              </button>
              <button
                type="button"
                onClick={() => handleFontChange("lg")}
                title="Increase Font Size"
                className={`px-1.5 py-0.5 font-bold transition-colors cursor-pointer ${
                  activeFontSize === "lg" ? "bg-[#003366] text-white dark:bg-[#1E40AF]" : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                A+
              </button>
            </div>

            {/* Dark Mode Toggle */}
            {onToggleTheme && (
              <button
                type="button"
                onClick={onToggleTheme}
                title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
                className="flex items-center gap-1 px-1.5 py-0.5 border border-slate-300 dark:border-slate-700 rounded-xs bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 font-semibold cursor-pointer"
              >
                {theme === "dark" ? (
                  <>
                    <Sun className="w-3 h-3 text-amber-400" />
                    <span className="hidden sm:inline">{isHindi ? "लाइट मोड" : "Light"}</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3 h-3 text-slate-600 dark:text-slate-300" />
                    <span className="hidden sm:inline">{isHindi ? "डार्क मोड" : "Dark"}</span>
                  </>
                )}
              </button>
            )}

            {/* High Contrast Toggle */}
            {onContrastToggle && (
              <button
                type="button"
                onClick={onContrastToggle}
                title={isHighContrast ? "Disable High Contrast" : "Enable High Contrast (WCAG AAA)"}
                className={`flex items-center gap-1 px-1.5 py-0.5 border rounded-xs font-semibold cursor-pointer ${
                  isHighContrast
                    ? "bg-black text-yellow-300 border-yellow-400"
                    : "border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                <span className="hidden sm:inline">{isHighContrast ? "Standard" : "Contrast"}</span>
              </button>
            )}

            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">|</span>

            {/* Language Switcher */}
            <div className="flex items-center border border-slate-300 dark:border-slate-700 rounded-xs overflow-hidden bg-white dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setLanguage("hi")}
                className={`px-2 py-0.5 font-semibold transition-colors cursor-pointer ${
                  language === "hi" ? "bg-[#003366] text-white dark:bg-[#1E40AF] font-bold" : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                हिन्दी
              </button>
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`px-2 py-0.5 font-semibold border-l border-slate-300 dark:border-slate-700 transition-colors cursor-pointer ${
                  language === "en" ? "bg-[#003366] text-white dark:bg-[#1E40AF] font-bold" : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                }`}
              >
                English
              </button>
            </div>

            {/* Live IST Timestamp */}
            {currentISTTime && (
              <span className="hidden xl:inline text-slate-600 dark:text-slate-400 font-mono text-[10px] pl-1 font-medium tabular-nums">
                {currentISTTime} IST
              </span>
            )}
          </div>

        </div>
      </div>

      {/* National Tricolor 4px Strip (Saffron, White, Green) */}
      <div className="h-[4px] w-full flex">
        <div className="w-1/3 bg-[#FF9933]"></div>
        <div className="w-1/3 bg-[#FFFFFF]"></div>
        <div className="w-1/3 bg-[#138808]"></div>
      </div>
    </div>
  );
};
