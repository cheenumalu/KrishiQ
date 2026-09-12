import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useKrishiQ } from "../../context/KrishiQContext";
import { useLanguage } from "../../i18n";
import { TokenSlipModal } from "../../components/farmer/TokenSlipModal";
import { RescheduleModal } from "../../components/farmer/RescheduleModal";
import { OfflineAccessCard } from "../../components/farmer/OfflineAccessCard";
import { FarmerTokenSwitcher } from "../../components/farmer/FarmerTokenSwitcher";
import {
  Clock,
  MapPin,
  Calendar,
  Search,
  ArrowRight,
  FileText,
  Navigation,
  TrendingDown,
  ChevronRight,
  ShieldCheck,
  Building2,
  CheckCircle2
} from "lucide-react";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";

export const FarmerDashboard: React.FC = () => {
  const { farmerBooking, setSelectedCentreId, selectedCentre, centres } = useKrishiQ();
  const { t, isHindi, formatLocation, formatCrop, formatTimeSlot, formatDate } = useLanguage();
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const navigate = useNavigate();

  const recommendedCentre = centres.find((c) => c.isRecommended) || selectedCentre;

  return (
    <div className="space-y-5 max-w-7xl mx-auto pb-12 font-sans">
      
      {/* 1. CITIZEN FARMER REGISTRATION CREDENTIALS HEADER */}
      <div className="bg-white dark:bg-[#131D28] border-2 border-[#003366] dark:border-[#1E3A8A] rounded-xs shadow-xs overflow-hidden">
        <div className="bg-[#003366] text-white px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#FF9933]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs uppercase tracking-wider">
              {isHindi ? "राष्ट्रीय खाद्य सुरक्षा मिशन • किसान ई-उपार्जन पहचान पत्र" : "National Food Security Mission • Farmer Registration Credentials"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[#15803D] text-white text-[10px] font-bold rounded-2xs uppercase">
              {isHindi ? "आधार बायोमेट्रिक सत्यापित" : "Aadhaar Bio-Verified"}
            </span>
            <span className="px-2 py-0.5 bg-[#B45309] text-white text-[10px] font-bold rounded-2xs uppercase">
              {isHindi ? "PFMS DBT सक्रिय" : "PFMS DBT Linked"}
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-[#003366] dark:text-[#38BDF8] tracking-tight">
                {isHindi ? "श्री राजेश शर्मा" : "Shri Rajesh Sharma"}
              </h1>
              <span className="font-mono text-xs font-bold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-2xs border border-slate-300 dark:border-slate-700">
                ID: MP-IND-89421
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {isHindi
                ? "ग्राम एवं तहसील सांवेर, जिला इंदौर (मध्य प्रदेश) • बैंक खाता: भारतीय स्टेट बैंक (SBI-***4921)"
                : "Village Sanwer Hub, District Indore (Madhya Pradesh) • Bank A/C: State Bank of India (***4921)"}
            </p>
          </div>

          <div className="flex items-center gap-3 bg-[#F8FAFC] dark:bg-[#0E1620] border border-[#CBD5E1] dark:border-slate-700 p-2.5 rounded-xs shrink-0 text-xs">
            <div>
              <span className="text-[10px] text-slate-500 uppercase font-bold block">
                {isHindi ? "पंजीकृत उपज लॉट" : "Registered Produce"}
              </span>
              <strong className="text-sm font-black text-[#15803D] dark:text-emerald-400 block tabular-nums">
                65 क्विंटल (गेहूं शरबती)
              </strong>
              <span className="text-[10px] text-slate-500">
                MSP दर: ₹2,275/क्विंटल
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* MULTI-BOOKING TOKEN SWITCHER */}
      <FarmerTokenSwitcher />

      {/* 2. THREE PRIMARY QUICK ACTION CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <Link to="/farmer/centres" className="group">
          <Card padding="md" hoverable className="flex items-center justify-between border-[#CBD5E1]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xs bg-[#EFF6FF] text-[#003366] flex items-center justify-center group-hover:bg-[#003366] group-hover:text-white transition-colors border border-blue-200">
                <Search className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#003366] dark:text-white">{t("farmer.findBestCentre")}</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{t("farmer.findBestCentreDesc")}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </Card>
        </Link>

        <Link to="/farmer/book-slot" className="group">
          <Card padding="md" hoverable className="flex items-center justify-between border-[#CBD5E1]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xs bg-[#EFF6FF] text-[#003366] flex items-center justify-center group-hover:bg-[#003366] group-hover:text-white transition-colors border border-blue-200">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#003366] dark:text-white">{t("farmer.bookSlotTitle")}</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">{t("farmer.bookSlotDesc")}</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </Card>
        </Link>

        <Link to="/farmer/queue" className="group">
          <Card padding="md" hoverable className="flex items-center justify-between border-[#CBD5E1]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xs bg-[#F0FDF4] text-[#15803D] flex items-center justify-center group-hover:bg-[#15803D] group-hover:text-white transition-colors border border-emerald-200">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-[#003366] dark:text-white">{t("farmer.trackQueueTitle")}</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {t("farmer.trackQueueDesc", { token: farmerBooking.tokenNumber })}
                </p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
          </Card>
        </Link>

      </div>

      {/* 3. SMART RECOMMENDATION SECTION + MAP (40 / 60 SPLIT) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-[#CBD5E1] pb-1.5">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#003366] dark:text-[#38BDF8]" />
            <h2 className="text-sm sm:text-base font-black text-[#003366] dark:text-[#38BDF8] uppercase tracking-wide">
              {t("farmer.recommendedCentre")}
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            {isHindi ? "न्यूनतम यात्रा समय एवं लाइव कतार भार के आधार पर" : "Based on minimum total journey & live queue time"}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          
          {/* 40% Recommendation Card */}
          <Card padding="md" className="lg:col-span-5 flex flex-col justify-between space-y-4 border-[#CBD5E1]">
            <div className="space-y-3">
              
              {/* Tags */}
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge variant="success" dot size="sm">{t("common.recommended")}</Badge>
                <Badge variant="info" size="sm">{t("farmer.lowQueue")}</Badge>
                <Badge variant="neutral" size="sm">{t("farmer.closest")}</Badge>
              </div>

              <div>
                <h3 className="text-base font-bold text-[#003366] dark:text-white leading-snug">
                  {formatLocation(recommendedCentre.name)}
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 flex items-center gap-1.5 font-medium">
                  <MapPin className="w-3.5 h-3.5 text-[#15803D] shrink-0" />
                  <span>
                    {isHindi
                      ? `आपके गाँव से ${recommendedCentre.distanceKm} किमी दूर (APMC कोड: ${recommendedCentre.code})`
                      : `${recommendedCentre.distanceKm} km away (APMC Code: ${recommendedCentre.code})`}
                  </span>
                </p>
              </div>

              {/* Metric grid */}
              <div className="grid grid-cols-2 gap-2 p-3 rounded-xs bg-[#F1F5F9] dark:bg-[#0E1620] border border-[#CBD5E1] dark:border-slate-700 text-xs">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block font-semibold text-[11px] uppercase">{t("farmer.estWaiting")}</span>
                  <strong className="text-base font-black text-[#003366] dark:text-[#38BDF8] block mt-0.5 tabular-nums font-mono">
                    {recommendedCentre.predictedWaitMinutes} {t("common.min")}
                  </strong>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block font-semibold text-[11px] uppercase">{t("farmer.currentQueue")}</span>
                  <strong className="text-base font-black text-slate-900 dark:text-white block mt-0.5 tabular-nums font-mono">
                    {recommendedCentre.currentQueueCount} {t("common.farmers")}
                  </strong>
                </div>
              </div>

              {/* Time saved callout */}
              <div className="p-2.5 rounded-xs bg-[#FFFBEB] dark:bg-[#201505] border border-[#FDE68A] text-xs text-[#92400E] dark:text-[#FCD34D] flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-[#B45309] shrink-0" />
                <div>
                  <span className="font-bold block text-xs">{t("farmer.saveTimeCallout")}</span>
                  <span className="text-[10px] opacity-90">{t("farmer.comparedToDhar")}</span>
                </div>
              </div>

            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
              <Button
                variant="primary"
                size="sm"
                className="flex-1"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => {
                  setSelectedCentreId(recommendedCentre.id);
                  navigate("/farmer/book-slot");
                }}
              >
                {t("common.bookSlot")}
              </Button>

              <Button
                variant="outline"
                size="sm"
                leftIcon={<Navigation className="w-4 h-4" />}
                onClick={() => navigate("/farmer/centres")}
              >
                {t("common.viewRoute")}
              </Button>
            </div>
          </Card>

          {/* 60% Interactive Map */}
          <Card padding="none" className="lg:col-span-7 flex flex-col h-[340px] overflow-hidden relative border-[#CBD5E1]">
            <div className="px-4 h-10 bg-[#003366] text-white flex items-center justify-between text-xs font-bold z-10 shrink-0">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#FF9933]" />
                <span className="uppercase tracking-wide">{t("farmer.liveMapTitle")}</span>
              </div>
              <span className="text-slate-200 text-[11px] font-medium">
                {isHindi ? "इंदौर संभाग (मध्य प्रदेश)" : "Indore Division (MP)"}
              </span>
            </div>

            <div className="relative flex-1 bg-[#E8F0E4] dark:bg-[#0F172A] overflow-hidden select-none">
              {/* SVG District Map of Indore Division */}
              <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 300" preserveAspectRatio="xMidYMid slice">
                <defs>
                  {/* Congestion gradient fills */}
                  <linearGradient id="lowZone" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#BBF7D0" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#86EFAC" stopOpacity="0.5" />
                  </linearGradient>
                  <linearGradient id="modZone" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#FCD34D" stopOpacity="0.5" />
                  </linearGradient>
                  <linearGradient id="highZone" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#FECACA" stopOpacity="0.7" />
                    <stop offset="100%" stopColor="#FCA5A5" stopOpacity="0.5" />
                  </linearGradient>
                  <pattern id="gridPattern" width="30" height="30" patternUnits="userSpaceOnUse">
                    <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#94A3B8" strokeWidth="0.15" opacity="0.4" />
                  </pattern>
                </defs>

                {/* Background terrain */}
                <rect width="600" height="300" fill="url(#gridPattern)" />

                {/* District Boundaries & Congestion Zones */}
                {/* Indore District — HIGH congestion (red) */}
                <path d="M180 70 L260 55 L310 80 L320 140 L290 180 L230 190 L180 160 L165 110 Z"
                  fill="url(#highZone)" stroke="#DC2626" strokeWidth="1.5" strokeDasharray="6,3" />
                <text x="240" y="130" textAnchor="middle" fontSize="11" fontWeight="800" fill="#991B1B" opacity="0.8" fontFamily="sans-serif">INDORE</text>
                <text x="240" y="143" textAnchor="middle" fontSize="7" fontWeight="600" fill="#B91C1C" opacity="0.7" fontFamily="sans-serif">इंदौर</text>

                {/* Dewas District — MODERATE congestion (amber) */}
                <path d="M310 80 L400 60 L430 95 L420 150 L370 170 L320 140 Z"
                  fill="url(#modZone)" stroke="#D97706" strokeWidth="1.5" strokeDasharray="6,3" />
                <text x="370" y="115" textAnchor="middle" fontSize="10" fontWeight="700" fill="#92400E" opacity="0.8" fontFamily="sans-serif">DEWAS</text>
                <text x="370" y="127" textAnchor="middle" fontSize="7" fontWeight="600" fill="#B45309" opacity="0.7" fontFamily="sans-serif">देवास</text>

                {/* Ujjain District — LOW congestion (green) */}
                <path d="M400 60 L510 40 L540 80 L530 140 L480 160 L420 150 L430 95 Z"
                  fill="url(#lowZone)" stroke="#15803D" strokeWidth="1.5" strokeDasharray="6,3" />
                <text x="475" y="100" textAnchor="middle" fontSize="10" fontWeight="700" fill="#166534" opacity="0.8" fontFamily="sans-serif">UJJAIN</text>
                <text x="475" y="112" textAnchor="middle" fontSize="7" fontWeight="600" fill="#15803D" opacity="0.7" fontFamily="sans-serif">उज्जैन</text>

                {/* Dhar District — LOW congestion (green) */}
                <path d="M60 100 L165 110 L180 160 L230 190 L200 240 L130 260 L60 230 L40 170 Z"
                  fill="url(#lowZone)" stroke="#15803D" strokeWidth="1.5" strokeDasharray="6,3" />
                <text x="130" y="185" textAnchor="middle" fontSize="10" fontWeight="700" fill="#166534" opacity="0.8" fontFamily="sans-serif">DHAR</text>
                <text x="130" y="197" textAnchor="middle" fontSize="7" fontWeight="600" fill="#15803D" opacity="0.7" fontFamily="sans-serif">धार</text>

                {/* Ratlam District — MODERATE congestion (amber) */}
                <path d="M30 30 L140 20 L180 70 L165 110 L60 100 L25 65 Z"
                  fill="url(#modZone)" stroke="#D97706" strokeWidth="1.5" strokeDasharray="6,3" />
                <text x="105" y="68" textAnchor="middle" fontSize="10" fontWeight="700" fill="#92400E" opacity="0.8" fontFamily="sans-serif">RATLAM</text>
                <text x="105" y="80" textAnchor="middle" fontSize="7" fontWeight="600" fill="#B45309" opacity="0.7" fontFamily="sans-serif">रतलाम</text>

                {/* Shajapur District — LOW congestion (green) */}
                <path d="M320 140 L370 170 L380 230 L320 260 L270 240 L290 180 Z"
                  fill="url(#lowZone)" stroke="#15803D" strokeWidth="1.5" strokeDasharray="6,3" />
                <text x="330" y="210" textAnchor="middle" fontSize="9" fontWeight="700" fill="#166534" opacity="0.8" fontFamily="sans-serif">SHAJAPUR</text>
                <text x="330" y="222" textAnchor="middle" fontSize="7" fontWeight="600" fill="#15803D" opacity="0.7" fontFamily="sans-serif">शाजापुर</text>

                {/* Road Network */}
                {/* NH-52 Horizontal */}
                <line x1="20" y1="130" x2="560" y2="100" stroke="#64748B" strokeWidth="2" opacity="0.5" />
                <rect x="280" y="100" width="30" height="12" rx="2" fill="#FFFFFF" stroke="#64748B" strokeWidth="0.5" />
                <text x="295" y="109" textAnchor="middle" fontSize="6" fontWeight="700" fill="#334155" fontFamily="sans-serif">NH-52</text>

                {/* NH-47 Vertical */}
                <line x1="250" y1="10" x2="240" y2="280" stroke="#64748B" strokeWidth="2" opacity="0.5" />
                <rect x="225" y="35" width="30" height="12" rx="2" fill="#FFFFFF" stroke="#64748B" strokeWidth="0.5" />
                <text x="240" y="44" textAnchor="middle" fontSize="6" fontWeight="700" fill="#334155" fontFamily="sans-serif">NH-47</text>

                {/* State Highway */}
                <line x1="140" y1="20" x2="480" y2="250" stroke="#94A3B8" strokeWidth="1.2" strokeDasharray="8,4" opacity="0.4" />

                {/* Kshipra River */}
                <path d="M440 30 C430 80 460 120 440 160 C420 200 450 240 430 280"
                  fill="none" stroke="#38BDF8" strokeWidth="2.5" opacity="0.45" strokeLinecap="round" />
                <text x="455" y="78" fontSize="7" fontWeight="600" fill="#0284C7" opacity="0.6" fontFamily="sans-serif" transform="rotate(8, 455, 78)">Kshipra R.</text>

                {/* Narmada River segment */}
                <path d="M20 240 C80 220 140 250 200 230 C250 215 290 240 340 225"
                  fill="none" stroke="#38BDF8" strokeWidth="2" opacity="0.35" strokeLinecap="round" />
                <text x="175" y="255" fontSize="7" fontWeight="600" fill="#0284C7" opacity="0.5" fontFamily="sans-serif">Narmada R.</text>

                {/* Railway line */}
                <line x1="60" y1="100" x2="530" y2="85" stroke="#78716C" strokeWidth="1.5" strokeDasharray="2,6" opacity="0.3" />
              </svg>

              {/* Route connector lines (on top of map) */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 5 }}>
                <line x1="45%" y1="50%" x2="62%" y2="38%" stroke="#22C55E" strokeWidth="2" strokeDasharray="4" opacity="0.7" />
                <line x1="45%" y1="50%" x2="32%" y2="64%" stroke="#EF4444" strokeWidth="2" opacity="0.7" />
                <line x1="45%" y1="50%" x2="80%" y2="24%" stroke="#38BDF8" strokeWidth="1.5" opacity="0.7" />
              </svg>

              {/* Farmer Pin */}
              <div className="absolute left-[45%] top-[50%] -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-[#15803D] text-white flex items-center justify-center font-bold text-xs border-2 border-white shadow-lg">
                  📍
                </div>
                <span className="mt-0.5 px-2 py-0.5 rounded-2xs bg-black/80 text-white text-[10px] font-bold">
                  {t("farmer.yourFarm")}
                </span>
              </div>

              {/* Centre Pins */}
              {centres.map((c) => {
                const isRec = c.isRecommended;
                const isCrit = c.status === "critical";
                const isWarn = c.status === "warning";
                const colorBg = isCrit ? "bg-[#DC2626]" : isWarn ? "bg-[#D97706]" : "bg-[#15803D]";

                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      setSelectedCentreId(c.id);
                      navigate("/farmer/centres");
                    }}
                    style={{
                      left: c.id === "centre-b" ? "62%" : c.id === "centre-a" ? "32%" : "80%",
                      top: c.id === "centre-b" ? "38%" : c.id === "centre-a" ? "64%" : "24%",
                    }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
                  >
                    {isRec && (
                      <span className="mb-0.5 px-1.5 py-0.2 rounded-2xs text-[8px] font-extrabold bg-[#FF9933] text-[#002244] uppercase shadow-xs">
                        {t("common.recommended")}
                      </span>
                    )}
                    <div className={`w-7 h-7 rounded-xs ${colorBg} text-white flex items-center justify-center font-bold text-xs border border-white shadow-md`}>
                      {c.name.charAt(0)}
                    </div>
                    <span className="mt-0.5 px-1.5 py-0.5 rounded-2xs bg-black/85 text-white text-[10px] font-medium whitespace-nowrap">
                      {formatLocation(c.name.split(" (")[0])} • {c.predictedWaitMinutes}m
                    </span>
                  </div>
                );
              })}

              <div className="absolute bottom-2 left-2 right-2 bg-slate-900/90 p-2 rounded-xs text-[10px] text-white flex items-center justify-between border border-slate-700">
                <div className="flex items-center gap-3 font-semibold">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#22C55E]" /> {t("common.lowCongestion")}</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#F59E0B]" /> {t("common.moderate")}</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#EF4444]" /> {t("common.highCongestion")}</span>
                </div>
                <span className="text-[#FF9933] font-bold uppercase">{t("farmer.liveGrid")}</span>
              </div>
            </div>
          </Card>

        </div>
      </div>

      {/* 4. UPCOMING BOOKING & LIVE QUEUE PROGRESS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Upcoming Booking Card */}
        <Card padding="md" className="space-y-3 border-[#CBD5E1]">
          <div className="flex items-center justify-between pb-2 border-b border-[#CBD5E1] dark:border-slate-700">
            <span className="text-xs uppercase font-extrabold tracking-wider text-[#003366] dark:text-[#38BDF8]">
              {t("farmer.nextBookingTitle")}
            </span>
            <Badge variant="success" size="sm">{t("farmer.confirmed")}</Badge>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                {formatLocation(farmerBooking.centreName)}
              </h3>
              <p className="text-slate-500 text-[11px]">
                {formatDate(farmerBooking.slotDate)} • {formatTimeSlot(farmerBooking.slotTime)}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 p-2 rounded-xs bg-[#F8FAFC] dark:bg-[#0E1620] border border-[#CBD5E1] dark:border-slate-700 text-center font-mono tabular-nums">
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-sans font-semibold">{t("farmer.token")}</span>
                <strong className="text-sm font-black text-[#003366] dark:text-[#38BDF8] block">#{farmerBooking.tokenNumber}</strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-sans font-semibold">{t("farmer.estWaiting")}</span>
                <strong className="text-sm font-black text-[#15803D] block">
                  {farmerBooking.estimatedWaitMinutes} {t("common.min")}
                </strong>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block uppercase font-sans font-semibold">{t("farmer.arrivalWindow")}</span>
                <strong className="text-sm font-black text-slate-800 dark:text-slate-200 block">
                  {formatTimeSlot("10:30 AM")}
                </strong>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<FileText className="w-3.5 h-3.5" />}
              onClick={() => setIsTokenModalOpen(true)}
            >
              {t("farmer.viewGateSlip")}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsRescheduleOpen(true)}
            >
              {t("farmer.reschedule")}
            </Button>
          </div>
        </Card>

        {/* Live Queue Module */}
        <Card padding="md" className="space-y-3 border-[#CBD5E1]">
          <div className="flex items-center justify-between pb-2 border-b border-[#CBD5E1] dark:border-slate-700">
            <span className="text-xs uppercase font-extrabold tracking-wider text-[#003366] dark:text-[#38BDF8]">
              {t("farmer.liveQueueProgressTitle")}
            </span>
            <span className="text-[11px] text-slate-500 font-medium">{t("farmer.updatedJustNow")}</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">{t("farmer.nowServing")}</span>
                <strong className="text-lg font-black text-[#B45309] font-mono tabular-nums">A-124</strong>
              </div>
              <div className="text-right">
                <span className="text-slate-500 block text-[10px] uppercase font-semibold">{t("farmer.yourToken")}</span>
                <strong className="text-lg font-black text-[#003366] dark:text-[#38BDF8] font-mono tabular-nums">#{farmerBooking.tokenNumber}</strong>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="space-y-1">
              <div className="flex justify-between text-[11px] text-slate-600 dark:text-slate-300 font-semibold">
                <span>{t("farmer.nowServing")} A-124</span>
                <span className="font-bold text-[#15803D]">
                  {t("farmer.farmersAhead", { count: 3 })}
                </span>
                <span>{t("farmer.yourToken")} #{farmerBooking.tokenNumber}</span>
              </div>
              
              <div className="h-2 w-full bg-slate-200 dark:bg-slate-700 rounded-2xs overflow-hidden">
                <div
                  className="h-full bg-[#003366] dark:bg-[#38BDF8] rounded-2xs transition-all duration-300"
                  style={{ width: "68%" }}
                />
              </div>
            </div>

            <div className="p-2 rounded-xs bg-[#F1F5F9] dark:bg-[#0E1620] border border-[#CBD5E1] text-xs flex items-center justify-between">
              <span className="text-slate-600 dark:text-slate-300 font-medium">{t("farmer.estimatedIntakeTime")}</span>
              <strong className="font-bold text-xs font-mono tabular-nums text-[#003366] dark:text-white">
                {formatTimeSlot("11:42 AM")}
              </strong>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 dark:border-slate-700 text-right">
            <Link to="/farmer/queue">
              <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                {t("farmer.viewLiveQueueTracker")}
              </Button>
            </Link>
          </div>
        </Card>

      </div>

      {/* Non-Smartphone Fallback Access Banner */}
      <OfflineAccessCard />

      {/* Modals */}
      <TokenSlipModal
        isOpen={isTokenModalOpen}
        onClose={() => setIsTokenModalOpen(false)}
        booking={farmerBooking}
      />
      <RescheduleModal
        isOpen={isRescheduleOpen}
        onClose={() => setIsRescheduleOpen(false)}
      />

    </div>
  );
};