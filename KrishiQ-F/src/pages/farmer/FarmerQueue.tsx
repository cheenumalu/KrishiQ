import React, { useState } from "react";
import { useKrishiQ } from "../../context/KrishiQContext";
import { useLanguage } from "../../i18n";
import { TokenSlipModal } from "../../components/farmer/TokenSlipModal";
import { RescheduleModal } from "../../components/farmer/RescheduleModal";
import { AuditTrailModal } from "../../components/common/AuditTrailModal";
import { GrievanceModal } from "../../components/farmer/GrievanceModal";
import {
  Clock,
  FileText,
  History,
  AlertCircle,
  Radio,
} from "lucide-react";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import { Badge } from "../../components/common/Badge";
import { ProcurementStepper } from "../../components/farmer/ProcurementStepper";
import { FarmerTokenSwitcher } from "../../components/farmer/FarmerTokenSwitcher";

export const FarmerQueue: React.FC = () => {
  const {
    farmerBooking,
    queueItems,
    selectedCentre,
    isItemHighlighted,
    isRealtimeConnected,
  } = useKrishiQ();

  const { t, isHindi, formatLocation } = useLanguage();
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const [isAuditOpen, setIsAuditOpen] = useState(false);
  const [isGrievanceOpen, setIsGrievanceOpen] = useState(false);

  const isHighlighted = isItemHighlighted(farmerBooking.id);
  const farmersAhead = Math.max(0, (farmerBooking.queuePosition || 1) - 1);
  const estWait = farmerBooking.estimatedWaitMinutes || (farmersAhead * 12);

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 px-1">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-1 border-b border-[#E4E9E5] dark:border-[#23362B]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#17211B] dark:text-[#F0F5F1] tracking-tight">
              {t("farmer.queueTrackerTitle")}
            </h1>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 animate-pulse">
              <Radio className="w-3 h-3" />
              <span>{isRealtimeConnected ? "Live Realtime" : "Live Ticker"}</span>
            </span>
          </div>
          <p className="text-sm text-[#66736B] dark:text-[#9EAEA4] font-medium">
            {isHindi
              ? "आपकी वास्तविक समय कतार स्थिति, प्रतीक्षारत समय एवं उपार्जन चरण।"
              : "Live queue telemetry, dynamic wait calculation & stage progression."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            leftIcon={<History className="w-3.5 h-3.5 text-[#2F7D4A]" />}
            onClick={() => setIsAuditOpen(true)}
          >
            {isHindi ? "ऑडिट ट्रेल" : "View Audit Log"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            leftIcon={<AlertCircle className="w-3.5 h-3.5 text-[#F2A93B]" />}
            onClick={() => setIsGrievanceOpen(true)}
          >
            {isHindi ? "समस्या दर्ज करें" : "Raise Dispute"}
          </Button>
        </div>
      </div>

      {/* Token Switcher if multiple bookings */}
      <FarmerTokenSwitcher />

      {/* Main Stepper */}
      <ProcurementStepper />

      {/* Hero Live Status Card */}
      <Card
        padding="lg"
        className={`border-[#E4E9E5] dark:border-[#23362B] card-shadow space-y-4 transition-all ${
          isHighlighted ? "highlight-pulse ring-2 ring-[#2F7D4A]/40" : ""
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E4E9E5] dark:border-[#23362B]">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold tracking-wider text-[#123D2D] dark:text-[#52DB89]">
              {isHindi ? "आपकी लाइव कतार स्थिति" : "YOUR LIVE QUEUE TELEMETRY"}
            </span>
            <Badge variant={farmersAhead === 0 ? "success" : "warning"} dot>
              {farmersAhead === 0
                ? isHindi ? "आपकी बारी है!" : "Now Serving / Next!"
                : isHindi ? `आपसे पहले ${farmersAhead} किसान` : `${farmersAhead} Farmers Ahead`}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<FileText className="w-3.5 h-3.5" />}
              onClick={() => setIsTokenModalOpen(true)}
            >
              {t("farmer.viewGateSlip")}
            </Button>
          </div>
        </div>

        {/* 3 Metric Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-[#F6F8F4] dark:bg-[#101B15] border border-[#E4E9E5] dark:border-[#23362B] text-center">
            <span className="text-xs text-[#374151] dark:text-[#CBD5E1] block font-semibold">
              {t("farmer.yourToken")}
            </span>
            <strong className="text-3xl font-extrabold text-[#111827] dark:text-white font-mono block mt-1 tracking-wider">
              #{farmerBooking.tokenNumber}
            </strong>
            <span className="text-xs text-[#4B5563] dark:text-[#CBD5E1] block mt-0.5 font-mono font-medium">
              {farmerBooking.slotDate} ({farmerBooking.slotTime})
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#EEF5EF] dark:bg-[#1A3125] border border-[#58A66B]/30 text-center">
            <span className="text-xs text-[#123D2D] dark:text-[#52DB89] block font-bold">
              {isHindi ? "अनुमानित प्रतीक्षा समय" : "Est. Waiting Time"}
            </span>
            <strong className="text-3xl font-extrabold text-[#2F7D4A] dark:text-[#52DB89] font-mono block mt-1 tracking-wider">
              ~{estWait} {t("common.min")}
            </strong>
            <span className="text-xs text-[#4B5563] dark:text-[#CBD5E1] block mt-0.5 font-medium">
              {isHindi ? "वास्तविक औसत सेवा दर आधारित" : "Based on rolling centre service rate"}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#F6F8F4] dark:bg-[#101B15] border border-[#E4E9E5] dark:border-[#23362B] text-center">
            <span className="text-xs text-[#374151] dark:text-[#CBD5E1] block font-semibold">
              {isHindi ? "उपार्जन केंद्र" : "Assigned Centre"}
            </span>
            <strong className="text-base font-bold text-[#111827] dark:text-white block mt-1 truncate">
              {formatLocation(farmerBooking.centreName || selectedCentre.name)}
            </strong>
            <span className="text-xs text-[#2F7D4A] dark:text-[#52DB89] block mt-0.5 font-medium">
              {farmerBooking.centreDistanceKm || 7.2} km away • {selectedCentre.status} load
            </span>
          </div>
        </div>

        {/* Advisory Banner */}
        <div className="p-3.5 rounded-xl bg-[#FEF5E7] dark:bg-[#2A2315] border border-[#F2A93B]/40 text-xs text-[#9A6210] dark:text-[#F2A93B] flex items-start gap-2.5">
          <Clock className="w-4 h-4 shrink-0 mt-0.5" />
          <p className="font-medium leading-relaxed">
            {isHindi
              ? "आपकी बारी आने पर गेट पर डिजिटल टोकन दिखाएं। इलेक्ट्रॉनिक तौल एवं गुणवत्ता जाँच के तुरंत बाद PFMS द्वारा भुगतान आरंभ कर दिया जाएगा।"
              : "Present your digital token at the intake gate upon call. DBT payment will initiate immediately following certified assay and weighment."}
          </p>
        </div>
      </Card>

      {/* Live Queue Sequence List */}
      <Card padding="lg" className="border-[#E4E9E5] dark:border-[#23362B] card-shadow space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#E4E9E5] dark:border-[#23362B]">
          <span className="text-xs uppercase font-extrabold tracking-wider text-[#123D2D] dark:text-[#52DB89]">
            {isHindi ? "मंडी गेट प्रवेश कतार क्रम" : "LIVE MANDI ENTRY SEQUENCE"}
          </span>
          <span className="text-xs text-[#66736B] dark:text-[#9EAEA4]">
            {selectedCentre.name}
          </span>
        </div>

        <div className="space-y-2 text-xs">
          {queueItems.length === 0 ? (
            <div className="text-center py-6 text-[#8A958E]">
              <p>{isHindi ? "वर्तमान में कोई अन्य किसान कतार में नहीं है।" : "No active farmers in queue."}</p>
            </div>
          ) : (
            queueItems.map((item) => {
              const isUser = item.isCurrentUser;
              const isServing = item.status === "SERVING";
              const isCompleted = item.status === "COMPLETED";

              return (
                <div
                  key={item.id}
                  className={`flex items-center justify-between p-3 rounded-xl border transition-all ${
                    isUser
                      ? "bg-[#EEF5EF] dark:bg-[#1A3125] border-[#2F7D4A] ring-1 ring-[#2F7D4A]/30 font-semibold"
                      : isServing
                      ? "bg-[#FEF5E7] dark:bg-[#2A2315] border-[#F2A93B]/40 font-medium"
                      : isCompleted
                      ? "bg-[#F6F8F4] dark:bg-[#101B15] border-[#E4E9E5] dark:border-[#23362B] opacity-70"
                      : "bg-white dark:bg-[#142019] border-[#E4E9E5] dark:border-[#23362B]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 font-bold text-center font-mono">
                      {isCompleted ? "✓" : isServing ? "●" : "○"}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="font-mono text-[#17211B] dark:text-[#F0F5F1]">#{item.tokenNumber}</strong>
                        <span className="text-[#17211B] dark:text-[#F0F5F1]">
                          {item.farmerName} {isUser && (isHindi ? "(आप)" : "(You)")}
                        </span>
                      </div>
                      <span className="text-[11px] text-[#66736B] dark:text-[#9EAEA4]">
                        {item.crop} • {item.quantityQuintals} Qtl • {item.stageName}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    {isCompleted && (
                      <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                        ✓ {isHindi ? "उपार्जन पूर्ण" : "Procured"}
                      </span>
                    )}
                    {isServing && (
                      <span className="text-[#9A6210] dark:text-[#F2A93B] font-bold bg-[#FEF5E7] dark:bg-[#2A2315] px-2 py-0.5 rounded-lg border border-[#F2A93B]/30">
                        ● {isHindi ? "कांटे पर सक्रिय" : "Now Serving"}
                      </span>
                    )}
                    {!isCompleted && !isServing && !isUser && (
                      <span className="text-[#66736B] dark:text-[#9EAEA4]">
                        ○ {isHindi ? "प्रतीक्षा में" : "In Queue"}
                      </span>
                    )}
                    {isUser && !isServing && (
                      <span className="text-[#123D2D] dark:text-[#52DB89] font-bold bg-[#EEF5EF] dark:bg-[#1A3125] px-2 py-0.5 rounded-lg border border-[#58A66B]/30 font-mono">
                        ● {isHindi ? `आप (~ ${estWait} मिनट)` : `You (~ ${estWait} min)`}
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>

      {/* Reschedule Option */}
      <Card padding="md" className="border-[#E4E9E5] dark:border-[#23362B] bg-[#F6F8F4] dark:bg-[#101B15]">
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
          <div>
            <strong className="text-[#17211B] dark:text-[#F0F5F1] block text-sm">
              {isHindi ? "पहुँचने का समय बदलना चाहते हैं?" : "Need to reschedule your slot?"}
            </strong>
            <p className="text-[#66736B] dark:text-[#9EAEA4] mt-0.5">
              {isHindi
                ? "यदि आप समय पर केंद्र नहीं पहुँच पा रहे हैं, तो बिना किसी दंड के दूसरा उपलब्ध समय स्लॉट चुन सकते हैं।"
                : "You can move your appointment to another time window or centre with no penalty."}
            </p>
          </div>

          <Button
            variant="secondary"
            size="md"
            onClick={() => setIsRescheduleOpen(true)}
          >
            {t("farmer.reschedule")}
          </Button>
        </div>
      </Card>

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
      <AuditTrailModal
        isOpen={isAuditOpen}
        onClose={() => setIsAuditOpen(false)}
        bookingToken={farmerBooking.tokenNumber}
      />
      <GrievanceModal
        isOpen={isGrievanceOpen}
        onClose={() => setIsGrievanceOpen(false)}
        bookingToken={farmerBooking.tokenNumber}
      />
    </div>
  );
};
