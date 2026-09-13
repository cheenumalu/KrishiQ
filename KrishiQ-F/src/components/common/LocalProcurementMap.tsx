import React, { useState } from "react";
import { MapPin, Navigation, Clock, Users, ArrowRight, ShieldCheck, AlertTriangle, CheckCircle2, X } from "lucide-react";
import { ProcurementCentre } from "../../types";
import { useLanguage } from "../../i18n";
import { Button } from "./Button";
import { Badge } from "./Badge";

interface LocalProcurementMapProps {
  centres: ProcurementCentre[];
  selectedCentreId?: string | null;
  onSelectCentre?: (centreId: string) => void;
  onBookCentre?: (centreId: string) => void;
  heightClass?: string;
  showFilters?: boolean;
}

export const LocalProcurementMap: React.FC<LocalProcurementMapProps> = ({
  centres,
  selectedCentreId,
  onSelectCentre,
  onBookCentre,
  heightClass = "h-[380px] sm:h-[420px]",
  showFilters = true,
}) => {
  const { isHindi, t } = useLanguage();
  const [filterLevel, setFilterLevel] = useState<"all" | "low" | "moderate" | "high">("all");
  const [hoveredCentreId, setHoveredCentreId] = useState<string | null>(null);
  const [clickedCentreId, setClickedCentreId] = useState<string | null>(null);
  const [hoveredDistrict, setHoveredDistrict] = useState<string | null>(null);

  // Determine congestion level for a centre
  const getCongestionLevel = (centre: ProcurementCentre): "low" | "moderate" | "high" => {
    if (centre.status === "critical" || centre.predictedWaitMinutes >= 75) {
      return "high";
    }
    if (centre.status === "warning" || centre.predictedWaitMinutes >= 35) {
      return "moderate";
    }
    return "low";
  };

  // Pre-mapped visual pin coordinates for centres in Indore Division
  const centreCoordinates: Record<string, { x: string; y: string; district: string; shortName: string; hindiName: string }> = {
    "centre-a": { x: "32%", y: "62%", district: "Indore", shortName: "Dhar Road Mandi", hindiName: "धार रोड उपार्जन केंद्र" },
    "centre-b": { x: "55%", y: "44%", district: "Indore", shortName: "Shivaji Nagar Mandi", hindiName: "शिवाजी नगर उपार्जन केंद्र" },
    "centre-c": { x: "78%", y: "26%", district: "Ujjain / Sanwer", shortName: "Sanwer Hub", hindiName: "सांवेर हब मंडी" },
    "centre-d": { x: "20%", y: "38%", district: "Indore / Depalpur", shortName: "Depalpur Mandi", hindiName: "देपालपुर मंडी" },
    "centre-e": { x: "42%", y: "82%", district: "Indore / Mhow", shortName: "Mhow APMC Yard", hindiName: "महू मंडी" },
  };

  const filteredCentres = centres.filter((c) => {
    if (filterLevel === "all") return true;
    return getCongestionLevel(c) === filterLevel;
  });

  // Only show detail card on active hover or explicit user click
  const activeCentreId = hoveredCentreId || clickedCentreId;
  const activeCentre = activeCentreId ? centres.find((c) => c.id === activeCentreId) : null;

  const formatLocation = (name: string) => {
    if (!isHindi) return name;
    if (name.includes("Shivaji Nagar")) return "शिवाजी नगर उपार्जन केंद्र";
    if (name.includes("Dhar Road")) return "धार रोड उपार्जन केंद्र";
    if (name.includes("Sanwer")) return "सांवेर हब उपार्जन केंद्र";
    if (name.includes("Depalpur")) return "देपालपुर मंडी";
    if (name.includes("Mhow")) return "महू एपीएमसी यार्ड";
    return name;
  };

  return (
    <div className={`relative isolate z-0 flex flex-col ${heightClass} w-full bg-[#EBF3EA] dark:bg-[#0B131F] rounded-xs border border-[#CBD5E1] dark:border-[#1E293B] overflow-hidden select-none shadow-sm`}>
      
      {/* 1. MAP HEADER BAR */}
      <div className="px-3.5 py-2 bg-[#003366] dark:bg-[#08192E] text-white flex flex-wrap items-center justify-between gap-2 text-xs font-bold shrink-0 z-10 border-b border-[#002244]">
        <div className="flex items-center gap-2">
          <div className="p-1 rounded-xs bg-[#FF9933]/20 text-[#FF9933]">
            <MapPin className="w-3.5 h-3.5" />
          </div>
          <div>
            <span className="uppercase tracking-wider font-extrabold text-xs">
              {t("farmer.liveMapTitle")}
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] text-slate-300 font-normal">
              ({isHindi ? "इंदौर संभाग" : "Indore Division (MP)"})
            </span>
          </div>
        </div>

        {/* Filter Pills */}
        {showFilters && (
          <div className="flex items-center gap-1 bg-black/30 p-0.5 rounded-xs text-[10px] font-medium border border-white/10">
            <button
              onClick={() => setFilterLevel("all")}
              className={`px-2 py-0.5 rounded-2xs transition-all ${
                filterLevel === "all" ? "bg-white text-[#003366] font-bold shadow-xs" : "text-slate-300 hover:text-white"
              }`}
            >
              {isHindi ? "सभी केंद्र" : "All"}
            </button>
            <button
              onClick={() => setFilterLevel("low")}
              className={`px-2 py-0.5 rounded-2xs flex items-center gap-1 transition-all ${
                filterLevel === "low" ? "bg-[#15803D] text-white font-bold shadow-xs" : "text-emerald-300 hover:text-white"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {isHindi ? "कम" : "Low"}
            </button>
            <button
              onClick={() => setFilterLevel("moderate")}
              className={`px-2 py-0.5 rounded-2xs flex items-center gap-1 transition-all ${
                filterLevel === "moderate" ? "bg-[#D97706] text-white font-bold shadow-xs" : "text-amber-300 hover:text-white"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
              {isHindi ? "मध्यम" : "Mod"}
            </button>
            <button
              onClick={() => setFilterLevel("high")}
              className={`px-2 py-0.5 rounded-2xs flex items-center gap-1 transition-all ${
                filterLevel === "high" ? "bg-[#DC2626] text-white font-bold shadow-xs" : "text-red-300 hover:text-white"
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
              {isHindi ? "भारी" : "High"}
            </button>
          </div>
        )}
      </div>

      {/* 2. MAP CANVAS BODY */}
      <div className="relative flex-1 w-full h-full overflow-hidden bg-[#EBF3EA] dark:bg-[#09111E]">
        
        {/* SVG Topographic & District Layer */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 640 360" preserveAspectRatio="xMidYMid slice">
          <defs>
            {/* Low Congestion Fill (Green) */}
            <linearGradient id="lowCongestionGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#86EFAC" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#BBF7D0" stopOpacity="0.3" />
            </linearGradient>

            {/* Moderate Congestion Fill (Yellow/Amber) */}
            <linearGradient id="modCongestionGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FDE047" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#FEF08A" stopOpacity="0.3" />
            </linearGradient>

            {/* High Congestion Fill (Red) */}
            <linearGradient id="highCongestionGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#FCA5A5" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#FECACA" stopOpacity="0.35" />
            </linearGradient>

            {/* Grid Pattern */}
            <pattern id="mapGrid" width="28" height="28" patternUnits="userSpaceOnUse">
              <path d="M 28 0 L 0 0 0 28" fill="none" stroke="#94A3B8" strokeWidth="0.25" opacity="0.3" />
            </pattern>
          </defs>

          {/* Background Grid */}
          <rect width="640" height="360" fill="url(#mapGrid)" />

          {/* ================= DISTRICT REGIONS WITH CONGESTION COLORED BOUNDARIES ================= */}

          {/* 1. UJJAIN DISTRICT (North - GREEN / LOW CONGESTION) */}
          <g 
            className="cursor-pointer transition-opacity hover:opacity-80"
            onMouseEnter={() => setHoveredDistrict("Ujjain")}
            onMouseLeave={() => setHoveredDistrict(null)}
          >
            <path
              d="M380 40 L530 20 L580 65 L570 140 L500 165 L430 150 L400 100 Z"
              fill="url(#lowCongestionGrad)"
              stroke="#16A34A"
              strokeWidth="1.5"
              strokeDasharray="4,3"
            />
            <text x="485" y="78" textAnchor="middle" fontSize="10" fontWeight="700" fill="#15803D" opacity="0.75" fontFamily="sans-serif">
              UJJAIN (उज्जैन)
            </text>
          </g>

          {/* 2. DEWAS DISTRICT (East - YELLOW / MODERATE CONGESTION) */}
          <g 
            className="cursor-pointer transition-opacity hover:opacity-80"
            onMouseEnter={() => setHoveredDistrict("Dewas")}
            onMouseLeave={() => setHoveredDistrict(null)}
          >
            <path
              d="M360 120 L430 150 L500 165 L520 230 L450 265 L380 235 L350 170 Z"
              fill="url(#modCongestionGrad)"
              stroke="#D97706"
              strokeWidth="1.5"
              strokeDasharray="4,3"
            />
            <text x="435" y="190" textAnchor="middle" fontSize="10" fontWeight="700" fill="#B45309" opacity="0.75" fontFamily="sans-serif">
              DEWAS (देवास)
            </text>
          </g>

          {/* 3. INDORE CENTRAL DISTRICT (Center - RED / HIGH CONGESTION) */}
          <g 
            className="cursor-pointer transition-opacity hover:opacity-80"
            onMouseEnter={() => setHoveredDistrict("Indore")}
            onMouseLeave={() => setHoveredDistrict(null)}
          >
            <path
              d="M190 85 L280 65 L360 120 L350 170 L380 235 L330 265 L260 270 L210 240 L170 170 L175 120 Z"
              fill="url(#highCongestionGrad)"
              stroke="#DC2626"
              strokeWidth="2"
            />
            <text x="270" y="145" textAnchor="middle" fontSize="12" fontWeight="800" fill="#991B1B" opacity="0.8" fontFamily="sans-serif">
              INDORE (इंदौर)
            </text>
          </g>

          {/* 4. DHAR DISTRICT (West - GREEN / LOW CONGESTION) */}
          <g 
            className="cursor-pointer transition-opacity hover:opacity-80"
            onMouseEnter={() => setHoveredDistrict("Dhar")}
            onMouseLeave={() => setHoveredDistrict(null)}
          >
            <path
              d="M40 110 L175 120 L170 170 L210 240 L160 310 L80 320 L30 240 L25 160 Z"
              fill="url(#lowCongestionGrad)"
              stroke="#16A34A"
              strokeWidth="1.5"
              strokeDasharray="4,3"
            />
            <text x="105" y="195" textAnchor="middle" fontSize="10" fontWeight="700" fill="#15803D" opacity="0.75" fontFamily="sans-serif">
              DHAR (धार)
            </text>
          </g>

          {/* 5. KHARGONE / MHOW SOUTH CORRIDOR (South - GREEN / LOW CONGESTION) */}
          <g className="cursor-pointer transition-opacity hover:opacity-80">
            <path
              d="M160 310 L210 240 L260 270 L330 265 L360 340 L220 350 Z"
              fill="url(#lowCongestionGrad)"
              stroke="#16A34A"
              strokeWidth="1.5"
              strokeDasharray="4,2"
            />
            <text x="265" y="315" textAnchor="middle" fontSize="9" fontWeight="700" fill="#166534" opacity="0.7" fontFamily="sans-serif">
              MHOW / KHARGONE
            </text>
          </g>

          {/* ================= HIGHWAY NETWORK & CORRIDORS ================= */}

          {/* NH-52 (Jaipur-Indore-Dewas) */}
          <path d="M500 30 L360 120 L270 155 L210 240 L180 330" fill="none" stroke="#64748B" strokeWidth="2" opacity="0.45" />
          <rect x="300" y="105" width="30" height="11" rx="2" fill="#FFFFFF" stroke="#64748B" strokeWidth="0.6" />
          <text x="315" y="113" textAnchor="middle" fontSize="6.5" fontWeight="700" fill="#334155" fontFamily="sans-serif">NH-52</text>

          {/* NH-47 (Ahmedabad-Indore-Bhopal) */}
          <path d="M40 210 L170 170 L270 155 L430 150 L560 150" fill="none" stroke="#64748B" strokeWidth="2" opacity="0.45" />
          <rect x="195" y="165" width="30" height="11" rx="2" fill="#FFFFFF" stroke="#64748B" strokeWidth="0.6" />
          <text x="210" y="173" textAnchor="middle" fontSize="6.5" fontWeight="700" fill="#334155" fontFamily="sans-serif">NH-47</text>

          {/* Kshipra River */}
          <path d="M460 20 C440 60 480 110 460 150 C430 200 460 260 440 330" fill="none" stroke="#0EA5E9" strokeWidth="2" opacity="0.35" strokeLinecap="round" />
          <text x="475" y="65" fontSize="7" fontWeight="600" fill="#0284C7" opacity="0.6" fontFamily="sans-serif">Kshipra R.</text>

          {/* Gambhir River */}
          <path d="M120 70 C150 140 130 220 170 300" fill="none" stroke="#0EA5E9" strokeWidth="1.8" opacity="0.3" strokeLinecap="round" />
          <text x="110" y="100" fontSize="7" fontWeight="600" fill="#0284C7" opacity="0.5" fontFamily="sans-serif">Gambhir R.</text>

          {/* ================= DYNAMIC ROUTE LINES FROM FARMER'S LOCATION ================= */}
          <path d="M290 190 Q320 180 352 158" fill="none" stroke="#16A34A" strokeWidth="2" strokeDasharray="4,4" opacity="0.75" />
          <path d="M290 190 Q250 210 205 223" fill="none" stroke="#DC2626" strokeWidth="1.8" strokeDasharray="3,3" opacity="0.65" />
          <path d="M290 190 Q400 130 500 94" fill="none" stroke="#0284C7" strokeWidth="1.5" strokeDasharray="4,4" opacity="0.55" />
        </svg>

        {/* ================= FARMER LOCATION PIN ================= */}
        <div 
          style={{ left: "45%", top: "53%" }}
          className="absolute -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col items-center group pointer-events-auto cursor-pointer"
        >
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-[#15803D] text-white flex items-center justify-center font-bold text-sm shadow-xl border-2 border-white ring-4 ring-emerald-400/40">
              📍
            </div>
            <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-30 pointer-events-none" />
          </div>

          {/* Hover Tooltip ONLY */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-xs bg-[#0F172A] text-white text-[10px] font-bold shadow-xl border border-white/20 whitespace-nowrap z-20 pointer-events-none">
            {t("farmer.yourFarm")} ({isHindi ? "इंदौर ग्रामीण" : "Indore Rural"})
          </div>
        </div>

        {/* ================= PROCUREMENT CENTRE PINS ================= */}
        {filteredCentres.map((centre) => {
          const coords = centreCoordinates[centre.id] || { x: "50%", y: "50%", district: "Indore", shortName: centre.name, hindiName: centre.name };
          const congestion = getCongestionLevel(centre);
          const isSelected = selectedCentreId === centre.id || clickedCentreId === centre.id;
          const isHovered = hoveredCentreId === centre.id;
          const isRec = centre.isRecommended;

          // Theme color mapping based on congestion
          const markerColors = {
            low: {
              bg: "bg-[#16A34A]",
              ring: "ring-emerald-400",
              tag: isHindi ? "🟢 कम भीड़" : "🟢 Low Traffic",
            },
            moderate: {
              bg: "bg-[#D97706]",
              ring: "ring-amber-400",
              tag: isHindi ? "🟡 मध्यम" : "🟡 Moderate",
            },
            high: {
              bg: "bg-[#DC2626]",
              ring: "ring-red-400",
              tag: isHindi ? "🔴 भारी भीड़" : "🔴 High Wait",
            },
          };

          const colorConfig = markerColors[congestion];

          return (
            <div
              key={centre.id}
              style={{ left: coords.x, top: coords.y }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center cursor-pointer transition-transform duration-150 hover:scale-110 group"
              onMouseEnter={() => setHoveredCentreId(centre.id)}
              onMouseLeave={() => setHoveredCentreId(null)}
              onClick={() => {
                setClickedCentreId(clickedCentreId === centre.id ? null : centre.id);
                if (onSelectCentre) onSelectCentre(centre.id);
              }}
            >
              {/* Pin Icon with Congestion Color */}
              <div className="relative">
                <div
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xs ${colorConfig.bg} text-white flex items-center justify-center font-black text-xs sm:text-sm border-2 border-white shadow-xl ${
                    isSelected ? "ring-4 " + colorConfig.ring : ""
                  }`}
                >
                  {centre.id === "centre-a" ? "A" : centre.id === "centre-b" ? "B" : centre.id === "centre-c" ? "C" : centre.id === "centre-d" ? "D" : "E"}
                </div>
                {congestion === "high" && (
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-600 border border-white" />
                  </span>
                )}
              </div>

              {/* CLEAN HOVER TOOLTIP ONLY (Disappears when not hovered) */}
              {isHovered && (
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded-xs bg-[#0F172A]/95 text-white text-[10px] font-bold text-center border border-slate-700 shadow-2xl whitespace-nowrap z-30 pointer-events-none animate-in fade-in zoom-in-95 duration-100">
                  <div className="text-slate-100">{isHindi ? coords.hindiName : coords.shortName}</div>
                  <div className="text-[9px] font-semibold flex items-center justify-center gap-1.5 mt-0.5">
                    <span>{centre.predictedWaitMinutes}m {t("common.waitTime")}</span>
                    <span>•</span>
                    <span className={congestion === "low" ? "text-emerald-400" : congestion === "moderate" ? "text-amber-400" : "text-red-400"}>
                      {colorConfig.tag}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* ================= HOVERED / CLICKED CENTRE DETAIL CARD (Shows on hover/click only) ================= */}
        {activeCentre && (
          <div 
            className="absolute top-3 right-3 max-w-[260px] sm:max-w-[280px] bg-white/95 dark:bg-[#0F172A]/95 p-3 rounded-xs border border-[#CBD5E1] dark:border-[#334155] shadow-2xl backdrop-blur-md z-30 text-[#0F172A] dark:text-[#F8FAFC] animate-in fade-in zoom-in-95 duration-150"
            onMouseEnter={() => setHoveredCentreId(activeCentre.id)}
            onMouseLeave={() => setHoveredCentreId(null)}
          >
            <div className="flex items-start justify-between gap-1.5 pb-2 border-b border-[#E2E8F0] dark:border-[#1E293B]">
              <div>
                <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wide">
                  {activeCentre.code} • {activeCentre.district}
                </span>
                <h4 className="text-xs font-bold leading-tight text-[#003366] dark:text-[#38BDF8]">
                  {formatLocation(activeCentre.name.split(" (")[0])}
                </h4>
              </div>
              <div className="flex items-center gap-1">
                <Badge
                  variant={
                    getCongestionLevel(activeCentre) === "low"
                      ? "success"
                      : getCongestionLevel(activeCentre) === "moderate"
                      ? "warning"
                      : "critical"
                  }
                  size="sm"
                >
                  {getCongestionLevel(activeCentre) === "low"
                    ? isHindi ? "कम भीड़" : "Low"
                    : getCongestionLevel(activeCentre) === "moderate"
                    ? isHindi ? "मध्यम" : "Moderate"
                    : isHindi ? "भारी भीड़" : "High"}
                </Badge>
                {clickedCentreId === activeCentre.id && (
                  <button 
                    onClick={() => setClickedCentreId(null)}
                    className="p-0.5 text-slate-400 hover:text-slate-600 dark:hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 py-2 text-[11px]">
              <div className="bg-slate-50 dark:bg-[#1E293B] p-1.5 rounded-2xs">
                <div className="text-[9px] text-slate-500 dark:text-slate-400">{t("common.waitTime")}</div>
                <div className="font-extrabold text-xs flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#FF9933]" />
                  {activeCentre.predictedWaitMinutes} {t("common.min")}
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-[#1E293B] p-1.5 rounded-2xs">
                <div className="text-[9px] text-slate-500 dark:text-slate-400">{t("farmer.currentQueue")}</div>
                <div className="font-extrabold text-xs flex items-center gap-1">
                  <Users className="w-3 h-3 text-[#003366] dark:text-[#38BDF8]" />
                  {activeCentre.currentQueueCount} {isHindi ? "ट्रॉली" : "vehicles"}
                </div>
              </div>
            </div>

            {activeCentre.isRecommended && (
              <div className="p-1.5 mb-2 rounded-2xs bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 text-[10px] text-emerald-800 dark:text-emerald-300 font-medium flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span>{isHindi ? "AI अनुशंसित: न्यूनतम प्रतीक्षा समय" : "AI Optimal Choice: Lowest wait time"}</span>
              </div>
            )}

            {onBookCentre && (
              <Button
                variant={activeCentre.isRecommended ? "primary" : "outline"}
                size="sm"
                className="w-full text-xs"
                onClick={() => onBookCentre(activeCentre.id)}
              >
                {t("common.bookSlot")}
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            )}
          </div>
        )}

      </div>

      {/* 3. BOTTOM TELEMETRY & CONGESTION LEGEND */}
      <div className="px-3 py-2 bg-[#002244] text-white flex flex-wrap items-center justify-between gap-2 text-[11px] shrink-0 z-10 border-t border-slate-700">
        <div className="flex items-center gap-4 font-semibold flex-wrap">
          <span className="text-slate-300 text-[10px] uppercase font-bold tracking-wider">
            {isHindi ? "भीड़ सूचकांक:" : "Congestion Index:"}
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#22C55E] shadow-xs" />
            <span className="text-emerald-200">{t("common.lowCongestion")} (&lt;35m)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#F59E0B] shadow-xs" />
            <span className="text-amber-200">{t("common.moderate")} (35–75m)</span>
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#EF4444] shadow-xs animate-pulse" />
            <span className="text-red-200">{t("common.highCongestion")} (&gt;75m / रेड अलर्ट)</span>
          </span>
        </div>

        <div className="flex items-center gap-2 text-[10px] text-slate-300">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="font-mono text-[#FF9933] font-bold">LIVE TELEMETRY SYNC</span>
        </div>
      </div>

    </div>
  );
};
