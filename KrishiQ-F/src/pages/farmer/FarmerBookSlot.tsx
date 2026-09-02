import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useKrishiQ } from "../../context/KrishiQContext";
import { useLanguage } from "../../i18n";
import { CropType } from "../../types";
import { CROP_MSP_RATES } from "../../data/mockData";
import { formatCurrency, formatQuintals } from "../../utils/calculations";
import {
  Calendar,
  Clock,
  Building2,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  MapPin,
  Users,
  ShieldCheck,
  AlertCircle
} from "lucide-react";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";

export const FarmerBookSlot: React.FC = () => {
  const { centres, bookSlot, selectedCentre, farmerBooking } = useKrishiQ();
  const { t, isHindi, formatLocation, formatCrop, formatTimeSlot } = useLanguage();
  const navigate = useNavigate();

  // ONE Source of Truth for active step
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4>(1);

  // Single shared booking data state preserving input when moving back and forth
  const [bookingData, setBookingData] = useState({
    centreId: selectedCentre?.id || "centre-b",
    crop: ((farmerBooking.crop as CropType) || "Wheat") as CropType,
    variety: farmerBooking.variety || "Sharbati (Grade A)",
    quantityQuintals: farmerBooking.quantityQuintals || 65,
    date: "29 August 2026 (Today)",
    timeSlot: "11:30 - 12:00",
  });

  // Validation errors
  const [quantityError, setQuantityError] = useState<string>("");
  const [varietyError, setVarietyError] = useState<string>("");

  // Post-booking modal
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [generatedToken, setGeneratedToken] = useState("A-127");

  const dates = [
    { value: "29 August 2026 (Today)", label: isHindi ? "29 अगस्त 2026 (आज)" : "29 August 2026 (Today)" },
    { value: "30 August 2026 (Tomorrow)", label: isHindi ? "30 अगस्त 2026 (कल)" : "30 August 2026 (Tomorrow)" },
    { value: "01 September 2026 (Monday)", label: isHindi ? "01 सितंबर 2026 (सोमवार)" : "01 September 2026 (Monday)" },
    { value: "02 September 2026 (Tuesday)", label: isHindi ? "02 सितंबर 2026 (मंगलवार)" : "02 September 2026 (Tuesday)" },
  ];

  const timeSlots = [
    "10:00 - 10:30",
    "10:30 - 11:00",
    "11:00 - 11:30",
    "11:30 - 12:00",
    "02:00 - 02:30",
    "02:30 - 03:00",
  ];

  const targetCentre = centres.find((c) => c.id === bookingData.centreId) || centres[0];
  const mspRate = CROP_MSP_RATES[bookingData.crop] || 2275;
  const estimatedGrossMSP = (bookingData.quantityQuintals || 0) * mspRate;

  // Step 2 validation
  const validateStep2 = () => {
    let isValid = true;
    if (!bookingData.variety.trim()) {
      setVarietyError(isHindi ? "कृपया किस्म का नाम दर्ज करें।" : "Please enter a valid crop variety.");
      isValid = false;
    } else {
      setVarietyError("");
    }

    if (!bookingData.quantityQuintals || bookingData.quantityQuintals <= 0) {
      setQuantityError(isHindi ? "मात्रा 0 से अधिक होनी चाहिए।" : "Quantity must be greater than 0.");
      isValid = false;
    } else if (bookingData.quantityQuintals > 500) {
      setQuantityError(isHindi ? "अधिकतम अनुमेय मात्रा 500 क्विंटल है।" : "Maximum permissible lot is 500 Quintals.");
      isValid = false;
    } else {
      setQuantityError("");
    }

    return isValid;
  };

  // Step transitions
  const handleNextFromStep1 = () => {
    if (bookingData.centreId) {
      setCurrentStep(2);
    }
  };

  const handleNextFromStep2 = () => {
    if (validateStep2()) {
      setCurrentStep(3);
    }
  };

  const handleNextFromStep3 = () => {
    if (bookingData.date && bookingData.timeSlot) {
      setCurrentStep(4);
    }
  };

  const handleFinalBooking = (e: React.FormEvent) => {
    e.preventDefault();
    const token = "A-" + (125 + Math.floor(Math.random() * 15));
    setGeneratedToken(token);

    // Call existing booking state method
    bookSlot(
      bookingData.centreId,
      bookingData.crop,
      bookingData.variety,
      bookingData.quantityQuintals,
      bookingData.date,
      bookingData.timeSlot
    );

    setIsSuccessModalOpen(true);
  };

  const stepLabels = [
    { step: 1 as const, title: t("farmer.stepperStep1"), short: isHindi ? "केंद्र" : "Centre" },
    { step: 2 as const, title: t("farmer.stepperStep2"), short: isHindi ? "फसल व मात्रा" : "Crop & Qty" },
    { step: 3 as const, title: t("farmer.stepperStep3"), short: isHindi ? "तारीख व समय" : "Date & Time" },
    { step: 4 as const, title: t("farmer.stepperStep4"), short: isHindi ? "पुष्टि" : "Confirm" },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      
      {/* Header */}
      <div className="space-y-1 pb-2 border-b border-[#E4E9E5]">
        <div className="flex items-center gap-2">
          <Badge variant="normal">
            {isHindi ? "चरणबद्ध स्लॉट बुकिंग" : "Step-by-Step Booking"}
          </Badge>
          <span className="text-xs text-[#66736B]">
            {isHindi ? "त्वरित डिजिटल टोकन" : "Instant Token Allocation"}
          </span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#17211B] tracking-tight">
          {t("farmer.bookingHeading")}
        </h1>
        <p className="text-xs sm:text-sm text-[#66736B]">
          {t("farmer.bookingSubheading")}
        </p>
      </div>

      {/* CONNECTED STEPPER PROGRESSION BAR */}
      <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-[#E4E9E5] card-shadow">
        
        {/* Desktop Connected Bar */}
        <div className="hidden sm:block">
          <div className="relative flex items-center justify-between">
            {/* Background connecting bar */}
            <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-[2px] bg-[#E4E9E5] z-0" />
            
            {/* Active connecting bar */}
            <div
              className="absolute left-6 top-1/2 -translate-y-1/2 h-[2px] bg-[#2F7D4A] transition-all duration-300 z-0"
              style={{
                width: currentStep === 1 ? "0%" : currentStep === 2 ? "33%" : currentStep === 3 ? "66%" : "100%",
              }}
            />

            {stepLabels.map((item) => {
              const isCompleted = currentStep > item.step;
              const isCurrent = currentStep === item.step;
              const isFuture = currentStep < item.step;

              return (
                <button
                  key={item.step}
                  type="button"
                  disabled={isFuture}
                  onClick={() => {
                    if (isCompleted) {
                      setCurrentStep(item.step);
                    }
                  }}
                  className={`relative z-10 flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isCurrent
                      ? "bg-[#123D2D] text-white shadow-sm ring-2 ring-[#123D2D]/20 cursor-default"
                      : isCompleted
                      ? "bg-[#EEF5EF] text-[#123D2D] border border-[#58A66B]/40 hover:bg-[#E4E9E5] cursor-pointer"
                      : "bg-white text-[#8A958E] border border-[#E4E9E5] cursor-not-allowed opacity-70"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isCurrent
                        ? "bg-white text-[#123D2D]"
                        : isCompleted
                        ? "bg-[#2F7D4A] text-white"
                        : "bg-[#F6F8F4] text-[#8A958E] border border-[#E4E9E5]"
                    }`}
                  >
                    {isCompleted ? <Check className="w-3 h-3 stroke-[3]" /> : item.step}
                  </span>
                  <span>{item.title}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Mobile Responsive Connected Stepper */}
        <div className="sm:hidden space-y-2">
          <div className="flex items-center justify-between relative px-2">
            <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 h-[2px] bg-[#E4E9E5] z-0" />
            <div
              className="absolute left-4 top-1/2 -translate-y-1/2 h-[2px] bg-[#2F7D4A] transition-all duration-300 z-0"
              style={{
                width: currentStep === 1 ? "0%" : currentStep === 2 ? "33%" : currentStep === 3 ? "66%" : "100%",
              }}
            />

            {stepLabels.map((item) => {
              const isCompleted = currentStep > item.step;
              const isCurrent = currentStep === item.step;
              const isFuture = currentStep < item.step;

              return (
                <button
                  key={item.step}
                  type="button"
                  disabled={isFuture}
                  onClick={() => {
                    if (isCompleted) {
                      setCurrentStep(item.step);
                    }
                  }}
                  className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                    isCurrent
                      ? "bg-[#123D2D] text-white ring-4 ring-[#EEF5EF]"
                      : isCompleted
                      ? "bg-[#2F7D4A] text-white"
                      : "bg-white text-[#8A958E] border border-[#E4E9E5]"
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : item.step}
                </button>
              );
            })}
          </div>

          <div className="text-center pt-1">
            <span className="text-xs font-bold text-[#123D2D]">
              {stepLabels[currentStep - 1].title}
            </span>
          </div>
        </div>

      </div>

      {/* FORM STEP CONTENT — STRICTLY RENDERS ACCORDING TO currentStep */}
      <div className="space-y-6">

        {/* ==================================================== */}
        {/* STEP 1: SELECT CENTRE */}
        {/* ==================================================== */}
        {currentStep === 1 && (
          <Card padding="lg" className="space-y-5 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E9E5]">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#2F7D4A]" />
                <span className="text-xs uppercase font-extrabold tracking-wider text-[#123D2D]">
                  {t("farmer.selectCentreLabel")}
                </span>
              </div>
              <span className="text-xs text-[#66736B]">
                {isHindi ? "इंदौर मंडी नेटवर्क" : "Indore Mandi Network"}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
              {centres.slice(0, 4).map((c) => {
                const isSelected = bookingData.centreId === c.id;
                const isRec = c.isRecommended;

                return (
                  <div
                    key={c.id}
                    onClick={() => setBookingData((prev) => ({ ...prev, centreId: c.id }))}
                    className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                      isSelected
                        ? "bg-[#EEF5EF] border-[#2F7D4A] ring-2 ring-[#2F7D4A]/25 shadow-xs"
                        : "bg-white border-[#E4E9E5] hover:border-[#66736B]/40 hover:bg-[#F6F8F4]"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
                            isSelected ? "border-[#2F7D4A] bg-[#2F7D4A]" : "border-[#8A958E]"
                          }`}
                        >
                          {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                        <span className="font-bold text-sm text-[#17211B]">
                          {formatLocation(c.name.split(" (")[0])}
                        </span>
                      </div>
                      {isRec && <Badge variant="success">{t("common.recommended")}</Badge>}
                    </div>

                    <p className="text-[#66736B] text-[11px] mt-2 flex items-center gap-1.5">
                      <MapPin className="w-3 h-3 text-[#2F7D4A]" />
                      <span>{isHindi ? `${c.distanceKm} किमी दूर` : `${c.distanceKm} km away`} • {c.district}</span>
                    </p>

                    <div className="flex justify-between mt-3 pt-2 border-t border-[#E4E9E5] text-[11px] font-sans tabular-nums">
                      <span>{t("farmer.currentQueue")}: <strong className="text-[#17211B]">{c.currentQueueCount} {t("common.farmers")}</strong></span>
                      <span>{t("farmer.estWaiting")}: <strong className={isRec ? "text-[#2F7D4A] font-bold" : "text-[#17211B]"}>{c.predictedWaitMinutes} {t("common.min")}</strong></span>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#E4E9E5]">
              <span className="text-xs text-[#66736B]">
                {isHindi ? "चयनित केंद्र:" : "Selected:"} <strong className="text-[#17211B]">{formatLocation(targetCentre.name)}</strong>
              </span>
              <Button
                type="button"
                variant="primary"
                size="md"
                disabled={!bookingData.centreId}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={handleNextFromStep1}
              >
                {t("common.continue")} →
              </Button>
            </div>
          </Card>
        )}

        {/* ==================================================== */}
        {/* STEP 2: CROP & QUANTITY */}
        {/* ==================================================== */}
        {currentStep === 2 && (
          <Card padding="lg" className="space-y-5 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E9E5]">
              <span className="text-xs uppercase font-extrabold tracking-wider text-[#123D2D]">
                2. {isHindi ? "फसल और मात्रा विवरण" : "Crop & Quantity Details"}
              </span>
              <Badge variant="normal">
                {isHindi ? `MSP दर: ₹${mspRate}/क्विंटल` : `MSP Rate: ₹${mspRate}/Qtl`}
              </Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="text-[#17211B] block mb-1.5 font-semibold">
                  {t("farmer.selectCropLabel")}
                </label>
                <select
                  value={bookingData.crop}
                  onChange={(e) => setBookingData((prev) => ({ ...prev, crop: e.target.value as CropType }))}
                  className="w-full p-2.5 rounded-xl border border-[#E4E9E5] bg-[#F6F8F4] font-bold text-[#17211B] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2F7D4A]/30"
                >
                  <option value="Wheat">{formatCrop("Wheat")} (MSP: ₹2,275/{isHindi ? "क्विंटल" : "Qtl"})</option>
                  <option value="Paddy">{formatCrop("Paddy")} (MSP: ₹2,300/{isHindi ? "क्विंटल" : "Qtl"})</option>
                  <option value="Soybean">{formatCrop("Soybean")} (MSP: ₹4,892/{isHindi ? "क्विंटल" : "Qtl"})</option>
                  <option value="Maize">{formatCrop("Maize")} (MSP: ₹2,090/{isHindi ? "क्विंटल" : "Qtl"})</option>
                </select>
              </div>

              <div>
                <label className="text-[#17211B] block mb-1.5 font-semibold">
                  {isHindi ? "किस्म (Variety)" : "Variety"}
                </label>
                <input
                  type="text"
                  value={bookingData.variety}
                  onChange={(e) => {
                    setBookingData((prev) => ({ ...prev, variety: e.target.value }));
                    if (e.target.value.trim()) setVarietyError("");
                  }}
                  placeholder={isHindi ? "जैसे शरबती (ग्रेड A)" : "e.g. Sharbati (Grade A)"}
                  className={`w-full p-2.5 rounded-xl border bg-[#F6F8F4] text-[#17211B] focus:bg-white focus:outline-none focus:ring-2 ${
                    varietyError ? "border-[#D95555] focus:ring-[#D95555]/30" : "border-[#E4E9E5] focus:ring-[#2F7D4A]/30"
                  }`}
                  required
                />
                {varietyError && (
                  <p className="text-[11px] text-[#D95555] mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {varietyError}
                  </p>
                )}
              </div>

              <div>
                <label className="text-[#17211B] block mb-1.5 font-semibold">
                  {t("farmer.quantityLabel")}
                </label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={bookingData.quantityQuintals || ""}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setBookingData((prev) => ({ ...prev, quantityQuintals: val }));
                    if (val > 0 && val <= 500) setQuantityError("");
                  }}
                  className={`w-full p-2.5 rounded-xl border bg-[#F6F8F4] font-sans tabular-nums font-bold text-[#17211B] focus:bg-white focus:outline-none focus:ring-2 ${
                    quantityError ? "border-[#D95555] focus:ring-[#D95555]/30" : "border-[#E4E9E5] focus:ring-[#2F7D4A]/30"
                  }`}
                  required
                />
                {quantityError && (
                  <p className="text-[11px] text-[#D95555] mt-1 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {quantityError}
                  </p>
                )}
                <span className="text-[10px] text-[#66736B] block mt-1">
                  {isHindi ? "पंजीकृत अधिकतम सीमा: 500 क्विंटल" : "Registered allotment limit: 500 Qtl"}
                </span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#EEF5EF] border border-[#58A66B]/30 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="text-[#123D2D] font-medium">
                {isHindi ? "अनुमानित न्यूनतम समर्थन मूल्य (MSP) DBT राशि:" : "Estimated MSP Direct Benefit Transfer (DBT):"}
              </span>
              <strong className="text-lg font-sans tabular-nums font-bold text-[#123D2D]">
                {formatCurrency(estimatedGrossMSP)}
              </strong>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#E4E9E5]">
              <Button
                type="button"
                variant="outline"
                size="md"
                leftIcon={<ArrowLeft className="w-4 h-4" />}
                onClick={() => setCurrentStep(1)}
              >
                ← {t("common.back")}
              </Button>
              <Button
                type="button"
                variant="primary"
                size="md"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={handleNextFromStep2}
              >
                {t("common.continue")} →
              </Button>
            </div>
          </Card>
        )}

        {/* ==================================================== */}
        {/* STEP 3: DATE & TIME */}
        {/* ==================================================== */}
        {currentStep === 3 && (
          <Card padding="lg" className="space-y-6 animate-in fade-in duration-150">
            
            {/* Date Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2.5 border-b border-[#E4E9E5]">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-[#2F7D4A]" />
                  <span className="text-xs uppercase font-extrabold tracking-wider text-[#123D2D]">
                    {t("farmer.selectDateLabel")}
                  </span>
                </div>
                <span className="text-xs text-[#66736B]">
                  {isHindi ? "उपलब्ध कार्य दिवस" : "Operating Days"}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                {dates.map((d) => {
                  const isSelected = bookingData.date === d.value;
                  return (
                    <button
                      key={d.value}
                      type="button"
                      onClick={() => setBookingData((prev) => ({ ...prev, date: d.value }))}
                      className={`p-3.5 rounded-2xl border text-left font-medium transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#123D2D] text-white border-[#123D2D] font-bold shadow-xs"
                          : "bg-white text-[#17211B] border-[#E4E9E5] hover:bg-[#F6F8F4]"
                      }`}
                    >
                      <span className="block font-semibold">{d.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time Slot Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-2.5 border-b border-[#E4E9E5]">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#2F7D4A]" />
                  <span className="text-xs uppercase font-extrabold tracking-wider text-[#123D2D]">
                    {t("farmer.availableSlots")}
                  </span>
                </div>
                <span className="text-xs text-[#66736B]">
                  {isHindi ? "30 मिनट आवक समय" : "30-Min Intake Window"}
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-sans tabular-nums">
                {timeSlots.map((slot) => {
                  const isSelected = bookingData.timeSlot === slot;

                  return (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setBookingData((prev) => ({ ...prev, timeSlot: slot }))}
                      className={`p-3.5 rounded-2xl border text-center font-bold transition-all cursor-pointer text-sm ${
                        isSelected
                          ? "bg-[#2F7D4A] text-white border-[#2F7D4A] shadow-xs"
                          : "bg-white text-[#17211B] border-[#E4E9E5] hover:bg-[#EEF5EF]"
                      }`}
                    >
                      {formatTimeSlot(slot)}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-[#E4E9E5]">
              <Button
                type="button"
                variant="outline"
                size="md"
                leftIcon={<ArrowLeft className="w-4 h-4" />}
                onClick={() => setCurrentStep(2)}
              >
                ← {t("common.back")}
              </Button>
              <Button
                type="button"
                variant="primary"
                size="md"
                disabled={!bookingData.date || !bookingData.timeSlot}
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={handleNextFromStep3}
              >
                {t("common.continue")} →
              </Button>
            </div>
          </Card>
        )}

        {/* ==================================================== */}
        {/* STEP 4: CONFIRM (BOOKING SUMMARY) */}
        {/* ==================================================== */}
        {currentStep === 4 && (
          <Card padding="lg" className="space-y-6 animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#E4E9E5]">
              <span className="text-xs uppercase font-extrabold tracking-wider text-[#123D2D]">
                4. {t("farmer.bookingSummary")}
              </span>
              <Badge variant="success">
                {isHindi ? "पुष्टि हेतु तैयार" : "Ready to Confirm"}
              </Badge>
            </div>

            {/* Summary Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              
              {/* Centre Box */}
              <div className="p-4 rounded-2xl bg-[#F6F8F4] border border-[#E4E9E5] space-y-2">
                <div className="flex items-center gap-2 text-[#123D2D] font-bold uppercase text-[11px]">
                  <Building2 className="w-4 h-4" />
                  <span>{isHindi ? "खरीदी केंद्र" : "Procurement Centre"}</span>
                </div>
                <h4 className="text-base font-bold text-[#17211B] leading-tight">
                  {formatLocation(targetCentre.name)}
                </h4>
                <p className="text-[#66736B] text-[11px]">
                  {targetCentre.code} • {targetCentre.district} • {targetCentre.distanceKm} {t("common.km")} {t("common.away")}
                </p>
                <div className="pt-2 border-t border-[#E4E9E5] flex justify-between text-[#66736B]">
                  <span>{t("farmer.estWaiting")}:</span>
                  <strong className="text-[#2F7D4A] font-sans tabular-nums">{targetCentre.predictedWaitMinutes} {t("common.min")}</strong>
                </div>
              </div>

              {/* Harvest Lot Box */}
              <div className="p-4 rounded-2xl bg-[#F6F8F4] border border-[#E4E9E5] space-y-2">
                <div className="flex items-center gap-2 text-[#123D2D] font-bold uppercase text-[11px]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>{isHindi ? "उपज विवरण" : "Harvest Lot"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#66736B]">{isHindi ? "फसल व किस्म:" : "Crop & Variety:"}</span>
                  <strong className="text-[#17211B] font-bold">{formatCrop(bookingData.crop)} ({bookingData.variety})</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#66736B]">{t("farmer.quantityLabel")}:</span>
                  <strong className="text-[#17211B] font-sans tabular-nums font-bold text-sm">
                    {bookingData.quantityQuintals} {t("common.quintals")}
                  </strong>
                </div>
                <div className="pt-2 border-t border-[#E4E9E5] flex justify-between items-center">
                  <span className="text-[#66736B]">{isHindi ? "समर्थन मूल्य (MSP):" : "MSP Rate:"}</span>
                  <strong className="text-[#17211B] font-sans tabular-nums">₹{mspRate} / {isHindi ? "क्विंटल" : "Qtl"}</strong>
                </div>
              </div>

              {/* Appointment Window Box */}
              <div className="p-4 rounded-2xl bg-[#F6F8F4] border border-[#E4E9E5] space-y-2">
                <div className="flex items-center gap-2 text-[#123D2D] font-bold uppercase text-[11px]">
                  <Calendar className="w-4 h-4" />
                  <span>{isHindi ? "आवंटित समय" : "Appointment Window"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#66736B]">{t("farmer.date")}:</span>
                  <strong className="text-[#17211B]">{bookingData.date}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#66736B]">{t("farmer.time")}:</span>
                  <strong className="text-[#17211B] font-sans tabular-nums">{formatTimeSlot(bookingData.timeSlot)}</strong>
                </div>
                <p className="text-[10px] text-[#66736B] pt-1">
                  {isHindi ? "कृपया अपने निर्धारित समय से 15 मिनट पूर्व केंद्र पहुँचें।" : "Please arrive 15 minutes before your scheduled arrival window."}
                </p>
              </div>

              {/* Farmer Profile Box */}
              <div className="p-4 rounded-2xl bg-[#F6F8F4] border border-[#E4E9E5] space-y-2">
                <div className="flex items-center gap-2 text-[#123D2D] font-bold uppercase text-[11px]">
                  <Users className="w-4 h-4" />
                  <span>{isHindi ? "किसान प्रोफ़ाइल" : "Farmer Profile"}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#66736B]">{isHindi ? "किसान:" : "Farmer:"}</span>
                  <strong className="text-[#17211B]">{isHindi ? "राजेश शर्मा" : "Rajesh Sharma"}</strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#66736B]">{isHindi ? "पंजीकरण आईडी:" : "Reg. ID:"}</span>
                  <strong className="text-[#17211B] font-mono">MP-FARM-90218</strong>
                </div>
                <div className="pt-2 border-t border-[#E4E9E5] flex justify-between items-center">
                  <span className="text-[#66736B]">{t("farmer.aadhaarVerified")}:</span>
                  <span className="text-[#2F7D4A] font-bold">✓ {isHindi ? "सत्यापित" : "Verified"}</span>
                </div>
              </div>

            </div>

            {/* Estimated MSP DBT Highlight Bar */}
            <div className="p-4 rounded-2xl bg-[#EEF5EF] border border-[#58A66B]/30 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-[#123D2D] font-bold text-sm block">
                  {isHindi ? "सीधे बैंक खाते में DBT देय राशि:" : "Estimated MSP Direct Benefit Transfer (DBT):"}
                </span>
                <span className="text-[11px] text-[#66736B]">
                  {isHindi ? "शून्य मंडी शुल्क कटौती • सीधे आधार से जुड़े बैंक खाते में" : "Zero intermediary deduction • Directly to Aadhaar-linked account"}
                </span>
              </div>
              <strong className="text-2xl font-sans tabular-nums font-bold text-[#123D2D]">
                {formatCurrency(estimatedGrossMSP)}
              </strong>
            </div>

            {/* Step 4 Buttons */}
            <div className="flex items-center justify-between pt-4 border-t border-[#E4E9E5]">
              <Button
                type="button"
                variant="outline"
                size="md"
                leftIcon={<ArrowLeft className="w-4 h-4" />}
                onClick={() => setCurrentStep(3)}
              >
                ← {t("common.back")}
              </Button>
              <Button
                type="button"
                variant="primary"
                size="lg"
                rightIcon={<CheckCircle2 className="w-4 h-4" />}
                onClick={handleFinalBooking}
              >
                {t("farmer.confirmBooking")}
              </Button>
            </div>
          </Card>
        )}

      </div>

      {/* Confirmation Success Modal */}
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => {
          setIsSuccessModalOpen(false);
          navigate("/farmer/queue");
        }}
        title={t("farmer.bookingConfirmedTitle")}
        subtitle={t("farmer.bookingConfirmedDesc")}
        maxWidth="md"
      >
        <div className="space-y-5 text-xs">
          <div className="p-6 rounded-3xl bg-[#123D2D] text-white text-center space-y-1 shadow-sm">
            <span className="text-[11px] text-[#58A66B] uppercase font-bold tracking-wider block">
              {isHindi ? "आवंटित गेट पास टोकन" : "Assigned Gate Token"}
            </span>
            <p className="text-4xl font-extrabold font-sans tabular-nums text-white mt-1">{generatedToken}</p>
            <span className="text-xs text-white/80 block">{formatLocation(targetCentre.name)}</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#F6F8F4] border border-[#E4E9E5] space-y-2 text-[#17211B]">
            <div className="flex justify-between">
              <span>{t("farmer.date")}:</span>
              <strong className="font-semibold">{bookingData.date}</strong>
            </div>
            <div className="flex justify-between">
              <span>{t("farmer.time")}:</span>
              <strong className="font-semibold font-sans tabular-nums">{formatTimeSlot(bookingData.timeSlot)}</strong>
            </div>
            <div className="flex justify-between">
              <span>{t("farmer.registeredLot")}:</span>
              <strong className="font-semibold font-sans tabular-nums">
                {bookingData.quantityQuintals} {t("common.quintals")} {formatCrop(bookingData.crop)}
              </strong>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={() => {
                setIsSuccessModalOpen(false);
                navigate("/farmer/queue");
              }}
            >
              {t("farmer.viewLiveQueueTracker")} →
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};