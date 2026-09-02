import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { Language, TranslationSchema } from "./types";
import { en } from "./locales/en";
import { hi } from "./locales/hi";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  formatLocation: (location: string) => string;
  formatCrop: (crop: string) => string;
  formatTimeSlot: (timeStr: string) => string;
  formatDate: (dateStr: string) => string;
  getDynamicGreeting: (userName?: string) => string;
  isHindi: boolean;
}

const translations: Record<Language, TranslationSchema> = {
  en,
  hi,
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = "krishiq_language";

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === "en" || saved === "hi") {
        return saved;
      }
    }
    return "en";
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, lang);
      document.documentElement.lang = lang;
    }
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === "en" ? "hi" : "en");
  }, [language, setLanguage]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.lang = language;
    }
  }, [language]);

  // Nested dot-notation key lookup with variable interpolation
  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const currentDict = translations[language] || translations.en;
      const fallbackDict = translations.en;

      const keys = key.split(".");
      let value: any = currentDict;
      let fallbackValue: any = fallbackDict;

      for (const k of keys) {
        if (value && typeof value === "object" && k in value) {
          value = value[k];
        } else {
          value = undefined;
          break;
        }
      }

      if (value === undefined) {
        for (const k of keys) {
          if (fallbackValue && typeof fallbackValue === "object" && k in fallbackValue) {
            fallbackValue = fallbackValue[k];
          } else {
            fallbackValue = undefined;
            break;
          }
        }
        value = fallbackValue !== undefined ? fallbackValue : key;
      }

      if (typeof value !== "string") {
        return key;
      }

      if (params) {
        let interpolated = value;
        for (const [pKey, pVal] of Object.entries(params)) {
          interpolated = interpolated.replace(new RegExp(`\\{${pKey}\\}`, "g"), String(pVal));
        }
        return interpolated;
      }

      return value;
    },
    [language]
  );

  // Helper for location names transliteration
  const formatLocation = useCallback(
    (locationName: string): string => {
      if (!locationName) return "";
      if (language !== "hi") return locationName;

      const locs = translations.hi.locations;
      for (const [enKey, hiVal] of Object.entries(locs)) {
        if (locationName.includes(enKey)) {
          return locationName.replace(new RegExp(enKey, "g"), hiVal);
        }
      }
      return locationName;
    },
    [language]
  );

  // Helper for crop name translation
  const formatCrop = useCallback(
    (cropName: string): string => {
      if (!cropName) return "";
      if (language !== "hi") return cropName;

      const crops = translations.hi.crops;
      return crops[cropName] || cropName;
    },
    [language]
  );

  // Helper for contextual time slots (e.g. 10:30 AM -> सुबह 10:30 बजे)
  const formatTimeSlot = useCallback(
    (timeStr: string): string => {
      if (!timeStr) return "";
      if (language !== "hi") return timeStr;

      // Match HH:MM AM/PM
      const match = timeStr.match(/(\d{1,2}:\d{2})\s*(AM|PM)/i);
      if (!match) return timeStr;

      const time = match[1];
      const period = match[2].toUpperCase();
      const hour = parseInt(time.split(":")[0], 10);

      let prefix = "सुबह"; // morning
      if (period === "AM") {
        prefix = hour < 12 ? "सुबह" : "दोपहर";
      } else {
        if (hour === 12 || hour < 4) {
          prefix = "दोपहर"; // afternoon
        } else if (hour < 8) {
          prefix = "शाम"; // evening
        } else {
          prefix = "रात"; // night
        }
      }

      return `${prefix} ${time} बजे`;
    },
    [language]
  );

  // Helper for date formatting
  const formatDate = useCallback(
    (dateStr: string): string => {
      if (!dateStr) return "";
      if (language !== "hi") return dateStr;

      if (dateStr.toLowerCase() === "today") return "आज";
      if (dateStr.toLowerCase() === "tomorrow") return "कल";
      if (dateStr.toLowerCase() === "yesterday") return "बीता कल";

      return dateStr;
    },
    [language]
  );

  // Dynamic time-based greeting (morning / afternoon / evening)
  const getDynamicGreeting = useCallback(
    (userName: string = "Rajesh"): string => {
      const currentHour = new Date().getHours();
      let greetingKey = "farmer.greetingMorning";

      if (currentHour >= 12 && currentHour < 17) {
        greetingKey = "farmer.greetingAfternoon";
      } else if (currentHour >= 17) {
        greetingKey = "farmer.greetingEvening";
      }

      const greeting = t(greetingKey);
      const displayName = language === "hi" && userName === "Rajesh" ? "राजेश" : userName;

      return `${greeting}, ${displayName}`;
    },
    [language, t]
  );

  const contextValue = useMemo<LanguageContextType>(
    () => ({
      language,
      setLanguage,
      toggleLanguage,
      t,
      formatLocation,
      formatCrop,
      formatTimeSlot,
      formatDate,
      getDynamicGreeting,
      isHindi: language === "hi",
    }),
    [
      language,
      setLanguage,
      toggleLanguage,
      t,
      formatLocation,
      formatCrop,
      formatTimeSlot,
      formatDate,
      getDynamicGreeting,
    ]
  );

  return <LanguageContext.Provider value={contextValue}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};

export const useTranslation = () => {
  const { t, language, isHindi, formatLocation, formatCrop, formatTimeSlot, formatDate, getDynamicGreeting } = useLanguage();
  return { t, language, isHindi, formatLocation, formatCrop, formatTimeSlot, formatDate, getDynamicGreeting };
};
