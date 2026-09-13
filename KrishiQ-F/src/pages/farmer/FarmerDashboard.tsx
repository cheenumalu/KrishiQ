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
import { LocalProcurementMap } from "../../components/common/LocalProcurementMap";

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

          {/* 60% Interactive Congestion Map */}
          <div className="lg:col-span-7 flex flex-col">
            <LocalProcurementMap
              centres={centres}
              selectedCentreId={selectedCentre?.id}
              onSelectCentre={(id) => {
                setSelectedCentreId(id);
                navigate("/farmer/centres");
              }}
              onBookCentre={(id) => {
                setSelectedCentreId(id);
                navigate("/farmer/centres");
              }}
              heightClass="h-[360px]"
            />
          </div>

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