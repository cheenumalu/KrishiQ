import React from "react";
import { useKrishiQ } from "../../context/KrishiQContext";
import { useLanguage } from "../../i18n";
import { ShieldCheck, Scale, Check } from "lucide-react";
import { Card } from "../common/Card";
import { Badge } from "../common/Badge";
import { PROCUREMENT_STAGES, getStageLabel, getStageProgressPercent } from "../../utils/stages";

export const ProcurementStepper: React.FC = () => {
  const { farmerBooking, isItemHighlighted } = useKrishiQ();
  const { isHindi, formatCrop } = useLanguage();

  const currentStageNum = farmerBooking.currentStageNumber || 1;
  const progressPercent = getStageProgressPercent(farmerBooking.currentStageNumber);
  const isHighlighted = isItemHighlighted(farmerBooking.id);

  return (
    <Card
      padding="lg"
      className={`border-[#E4E9E5] dark:border-[#23362B] card-shadow space-y-6 transition-all ${
        isHighlighted ? "highlight-pulse ring-2 ring-[#2F7D4A]/40" : ""
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E4E9E5] dark:border-[#23362B]">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider text-[#123D2D] dark:text-[#52DB89]">
            {isHindi ? "उपार्जन 8-चरणीय प्रगति स्थिति" : "PROCUREMENT 8-STAGE LIVE TRACKER"}
          </span>
          <p className="text-xs text-[#374151] dark:text-[#CBD5E1] mt-0.5 font-medium">
            {isHindi ? "टोकन:" : "Token:"} <strong className="font-mono text-[#111827] dark:text-[#F0F5F1] font-bold">#{farmerBooking.tokenNumber}</strong> • {isHindi ? `उपज: ${farmerBooking.quantityQuintals} क्विंटल ${formatCrop(farmerBooking.crop)}` : `Lot: ${farmerBooking.quantityQuintals} Qtl ${farmerBooking.crop}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={currentStageNum === 8 ? "success" : "normal"}>
            {isHindi ? `चरण ${currentStageNum} / 8` : `Stage ${currentStageNum} of 8`}
          </Badge>
          <span className="text-xs font-mono font-bold text-[#2F7D4A] dark:text-[#52DB89]">
            {progressPercent}%
          </span>
        </div>
      </div>

      {/* Desktop Horizontal Stepper */}
      <div className="hidden md:block py-4 overflow-x-auto">
        <div className="min-w-[680px]">
          <div className="relative flex items-center justify-between">
            {/* Background connecting line passing through circle centers */}
            <div className="absolute left-6 right-6 top-4 -translate-y-1/2 h-0.5 bg-[#CBD5E1] dark:bg-[#23362B] z-0" />
            <div
              className="absolute left-6 top-4 -translate-y-1/2 h-0.5 bg-[#2F7D4A] dark:bg-[#52DB89] transition-all duration-500 z-0"
              style={{ width: `${Math.min(100, Math.max(0, ((currentStageNum - 1) / 7) * 100))}%` }}
            />

            {PROCUREMENT_STAGES.map((stage) => {
              const isCompleted = currentStageNum > stage.number;
              const isCurrent = currentStageNum === stage.number;

              return (
                <div key={stage.number} className="relative z-10 flex flex-col items-center">
                  <div
                    className={
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all " +
                      (isCompleted
                        ? "bg-[#2F7D4A] text-white shadow-xs"
                        : isCurrent
                        ? "bg-[#123D2D] text-white ring-4 ring-[#EEF5EF] dark:ring-[#1E372A]"
                        : "bg-white dark:bg-[#142019] text-[#374151] dark:text-[#94A3B8] border-2 border-[#CBD5E1] dark:border-[#23362B]")
                    }
                  >
                    {isCompleted ? <Check className="w-4 h-4" /> : stage.number}
                  </div>

                  <div className="text-center mt-2 max-w-[84px]">
                    <span
                      className={
                        "text-[11px] font-bold block leading-tight " +
                        (isCurrent
                          ? "text-[#123D2D] dark:text-[#52DB89] font-extrabold"
                          : isCompleted
                          ? "text-[#111827] dark:text-[#F0F5F1]"
                          : "text-[#374151] dark:text-[#CBD5E1]")
                      }
                    >
                      {getStageLabel(stage.key, isHindi)}
                    </span>
                    <span className="text-[10px] text-[#4B5563] dark:text-[#94A3B8] font-semibold block mt-0.5">
                      {isCompleted ? "✓" : isCurrent ? (isHindi ? "सक्रिय" : "Active") : (isHindi ? "प्रतीक्षा" : "Pending")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Vertical Stepper */}
      <div className="md:hidden space-y-2">
        {PROCUREMENT_STAGES.map((stage) => {
          const isCompleted = currentStageNum > stage.number;
          const isCurrent = currentStageNum === stage.number;

          return (
            <div
              key={stage.number}
              className={`flex items-center gap-3 p-2.5 rounded-xl border transition-colors ${
                isCurrent
                  ? "bg-[#EEF5EF] dark:bg-[#1A3125] border-[#58A66B]/50"
                  : isCompleted
                  ? "bg-[#F6F8F4] dark:bg-[#101B15] border-[#E4E9E5] dark:border-[#23362B]"
                  : "bg-white dark:bg-[#142019] border-[#E4E9E5] dark:border-[#23362B]"
              }`}
            >
              <div
                className={
                  "w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 " +
                  (isCompleted
                    ? "bg-[#2F7D4A] text-white"
                    : isCurrent
                    ? "bg-[#123D2D] text-white ring-2 ring-[#52DB89]/40"
                    : "bg-white dark:bg-[#142019] text-[#374151] dark:text-[#94A3B8] border border-[#CBD5E1] dark:border-[#23362B]")
                }
              >
                {isCompleted ? <Check className="w-3.5 h-3.5" /> : stage.number}
              </div>
              <div className="flex-1 min-w-0">
                <span
                  className={
                    "text-xs font-bold block " +
                    (isCurrent
                      ? "text-[#123D2D] dark:text-[#52DB89]"
                      : isCompleted
                      ? "text-[#111827] dark:text-[#F0F5F1]"
                      : "text-[#374151] dark:text-[#CBD5E1]")
                  }
                >
                  {getStageLabel(stage.key, isHindi)}
                </span>
                <span className="text-[10px] text-[#4B5563] dark:text-[#94A3B8] block">
                  {stage.description}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Quality Assay Inspection Card (When Stage >= 4) */}
      {currentStageNum >= 4 && farmerBooking.qualityCheck && (
        <div className="p-4 rounded-xl bg-[#EEF5EF] dark:bg-[#1A3125] border border-[#58A66B]/30 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#123D2D] dark:text-[#52DB89] uppercase text-[11px] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#2F7D4A]" />
              {isHindi ? "फसल गुणवत्ता परीक्षण प्रमाण पत्र" : "CERTIFIED QUALITY ASSAY REPORT"}
            </span>
            <Badge variant="success">
              {farmerBooking.qualityCheck.passed ? (isHindi ? "मानक उत्तीर्ण ✓" : "FAQ Passed ✓") : "Below FAQ"}
            </Badge>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-[#17211B] dark:text-[#F0F5F1]">
            <div>
              <span className="text-[#66736B] dark:text-[#9EAEA4] block">{isHindi ? "नमी प्रतिशत (Moisture)" : "Moisture %"}</span>
              <strong className="text-sm font-mono text-[#123D2D] dark:text-[#52DB89] font-bold">
                {farmerBooking.qualityCheck.moisturePercent}%
              </strong>
              <span className="text-[10px] text-[#66736B] dark:text-[#9EAEA4] block">(&lt; 12.0% FAQ)</span>
            </div>
            <div>
              <span className="text-[#66736B] dark:text-[#9EAEA4] block">{isHindi ? "गुणवत्ता ग्रेड" : "Quality Grade"}</span>
              <strong className="text-sm font-bold text-[#17211B] dark:text-[#F0F5F1]">
                {farmerBooking.qualityCheck.grade}
              </strong>
            </div>
            <div>
              <span className="text-[#66736B] dark:text-[#9EAEA4] block">{isHindi ? "कचरा/अन्य (Foreign Matter)" : "Foreign Matter"}</span>
              <strong className="text-sm font-mono text-[#17211B] dark:text-[#F0F5F1]">
                {farmerBooking.qualityCheck.foreignMatterPercent}%
              </strong>
            </div>
            <div>
              <span className="text-[#66736B] dark:text-[#9EAEA4] block">{isHindi ? "परीक्षक" : "Inspected By"}</span>
              <strong className="text-xs text-[#17211B] dark:text-[#F0F5F1] block mt-0.5">
                {farmerBooking.qualityCheck.inspectedBy}
              </strong>
            </div>
          </div>
        </div>
      )}

      {/* Electronic Weighbridge Slip (When Stage >= 5) */}
      {currentStageNum >= 5 && farmerBooking.weighing && (
        <div className="p-4 rounded-xl bg-[#F6F8F4] dark:bg-[#101B15] border border-[#E4E9E5] dark:border-[#23362B] space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-bold text-[#17211B] dark:text-[#F0F5F1] uppercase text-[11px] flex items-center gap-1.5">
              <Scale className="w-4 h-4 text-[#2F7D4A]" />
              {isHindi ? "इलेक्ट्रॉनिक कांटा वजन पर्ची" : "CERTIFIED ELECTRONIC WEIGHBRIDGE SLIP"}
            </span>
            <span className="font-mono text-[11px] text-[#66736B] dark:text-[#9EAEA4]">
              {farmerBooking.weighing.weighbridgeId}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-[#17211B] dark:text-[#F0F5F1]">
            <div>
              <span className="text-[#66736B] dark:text-[#9EAEA4] block">{isHindi ? "सकल वजन (Gross)" : "Gross Weight"}</span>
              <strong className="text-sm font-mono">{farmerBooking.weighing.grossWeightKg} KG</strong>
            </div>
            <div>
              <span className="text-[#66736B] dark:text-[#9EAEA4] block">{isHindi ? "खाली वाहन (Tare)" : "Tare Weight"}</span>
              <strong className="text-sm font-mono">{farmerBooking.weighing.tareWeightKg} KG</strong>
            </div>
            <div>
              <span className="text-[#66736B] dark:text-[#9EAEA4] block">{isHindi ? "शुद्ध उपज वजन (Net)" : "Net Weight"}</span>
              <strong className="text-sm font-mono font-bold text-[#2F7D4A] dark:text-[#52DB89]">
                {farmerBooking.weighing.netWeightQuintals} Qtl
              </strong>
            </div>
            <div>
              <span className="text-[#66736B] dark:text-[#9EAEA4] block">{isHindi ? "बोरी संख्या" : "Bag Count"}</span>
              <strong className="text-sm font-mono">{farmerBooking.weighing.bagCount} Bags</strong>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};
