import React from "react";
import { useKrishiQ } from "../../context/KrishiQContext";
import { useLanguage } from "../../i18n";
import { CheckCircle2 } from "lucide-react";
import { Card } from "../common/Card";
import { Badge } from "../common/Badge";

export const ProcurementStepper: React.FC = () => {
  const { farmerBooking } = useKrishiQ();
  const { t, isHindi, formatCrop } = useLanguage();

  const stages = [
    { number: 1, name: isHindi ? "पंजीकृत" : "Registered", status: "completed" },
    { number: 2, name: isHindi ? "स्लॉट बुक हुआ" : "Slot Booked", status: "completed" },
    { number: 3, name: isHindi ? "केंद्र पहुँचे" : "Arrived", status: "completed" },
    { number: 4, name: isHindi ? "गुणवत्ता जाँच" : "Quality Check", status: "current" },
    { number: 5, name: isHindi ? "तौल" : "Weighing", status: "pending" },
    { number: 6, name: isHindi ? "खरीदी पूर्ण" : "Procured", status: "pending" },
    { number: 7, name: isHindi ? "भुगतान" : "Payment", status: "pending" },
  ];

  return (
    <Card padding="lg" className="border-[#E4E9E5] card-shadow space-y-6">
      
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E4E9E5]">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-wider text-[#123D2D]">
            {isHindi ? "उपार्जन प्रगति स्थिति" : "PROCUREMENT PROGRESS STATUS"}
          </span>
          <p className="text-xs text-[#66736B] mt-0.5">
            {isHindi ? "टोकन:" : "Token:"} <strong className="font-sans text-[#17211B]">#{farmerBooking.tokenNumber}</strong> • {isHindi ? "उपज: 65 क्विंटल शरबती गेहूँ" : "Lot: 65 Quintals Sharbati Wheat"}
          </p>
        </div>
        <Badge variant="normal">
          {isHindi ? "चरण 4 / 7" : "Stage 4 of 7"}
        </Badge>
      </div>

      {/* Desktop Horizontal Stepper */}
      <div className="hidden sm:block py-4 overflow-x-auto">
        <div className="min-w-[580px]">
          <div className="relative flex items-center justify-between">
            {/* Background connecting line */}
            <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-0.5 bg-[#E4E9E5] z-0" />
            <div
              className="absolute left-6 top-1/2 -translate-y-1/2 h-0.5 bg-[#2F7D4A] z-0"
              style={{ width: "50%" }}
            />

            {stages.map((stage) => {
              const isCompleted = stage.status === "completed";
              const isCurrent = stage.status === "current";

              return (
                <div key={stage.number} className="relative z-10 flex flex-col items-center">
                  <div
                    className={
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all " +
                      (isCompleted
                        ? "bg-[#2F7D4A] text-white"
                        : isCurrent
                        ? "bg-[#123D2D] text-white ring-4 ring-[#EEF5EF]"
                        : "bg-white text-[#8A958E] border-2 border-[#E4E9E5]")
                    }
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : stage.number}
                  </div>

                  <div className="text-center mt-2">
                    <span
                      className={
                        "text-xs font-bold block " +
                        (isCurrent ? "text-[#123D2D] font-extrabold" : isCompleted ? "text-[#17211B]" : "text-[#8A958E]")
                      }
                    >
                      {stage.name}
                    </span>
                    <span className="text-[10px] text-[#66736B] block">
                      {isCompleted ? "✓" : isCurrent ? (isHindi ? "वर्तमान" : "Current") : (isHindi ? "प्रतीक्षा" : "Pending")}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mobile Vertical Stepper */}
      <div className="sm:hidden space-y-3">
        {stages.map((stage) => {
          const isCompleted = stage.status === "completed";
          const isCurrent = stage.status === "current";

          return (
            <div key={stage.number} className="flex items-center gap-3 p-2.5 rounded-xl border border-[#E4E9E5]">
              <div
                className={
                  "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 " +
                  (isCompleted ? "bg-[#2F7D4A] text-white" : isCurrent ? "bg-[#123D2D] text-white ring-2 ring-[#EEF5EF]" : "bg-white text-[#8A958E] border border-[#E4E9E5]")
                }
              >
                {isCompleted ? "✓" : stage.number}
              </div>

              <div className="flex-1 flex justify-between items-center text-xs">
                <span className={"font-bold " + (isCurrent ? "text-[#123D2D] font-extrabold" : "text-[#17211B]")}>
                  {stage.name}
                </span>
                <span className="text-[11px] text-[#66736B]">
                  {isCompleted ? (isHindi ? "पूर्ण ✓" : "Completed ✓") : isCurrent ? (isHindi ? "वर्तमान में सक्रिय" : "Active Now") : (isHindi ? "प्रतीक्षा में" : "Pending")}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Current Active Inspection Details */}
      <div className="p-4 rounded-xl bg-[#EEF5EF] border border-[#58A66B]/30 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <span className="font-bold text-[#123D2D] uppercase text-[11px]">
            {isHindi ? "वर्तमान चरण: फसल गुणवत्ता परीक्षण रिपोर्ट" : "CURRENT STAGE: QUALITY CHECK ASSAY REPORT"}
          </span>
          <Badge variant="success">
            {isHindi ? "मानक उत्तीर्ण ✓" : "Passed Standards ✓"}
          </Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-[#17211B]">
          <div>
            <span className="text-[#66736B] block">{t("farmer.moistureContent")}</span>
            <strong className="text-sm font-sans text-[#123D2D] font-bold">11.4%</strong>
            <span className="text-[10px] text-[#66736B] block">({isHindi ? "अधिकतम सीमा: < 12.0%" : "Limit: < 12.0%"})</span>
          </div>
          <div>
            <span className="text-[#66736B] block">{isHindi ? "गुणवत्ता ग्रेड" : "Quality Grade"}</span>
            <strong className="text-sm font-bold text-[#17211B]">{isHindi ? "ग्रेड A (FAQ)" : "Grade A (FAQ)"}</strong>
            <span className="text-[10px] text-[#66736B] block">{isHindi ? "उचित औसत गुणवत्ता" : "Fair Average Quality"}</span>
          </div>
          <div>
            <span className="text-[#66736B] block">{t("farmer.foreignMatter")}</span>
            <strong className="text-sm font-sans text-[#17211B]">0.6%</strong>
            <span className="text-[10px] text-[#66736B] block">({isHindi ? "अधिकतम सीमा: < 1.5%" : "Limit: < 1.5%"})</span>
          </div>
          <div>
            <span className="text-[#66736B] block">{isHindi ? "जाँच अधिकारी" : "Quality Officer"}</span>
            <strong className="text-xs text-[#17211B] block mt-0.5">{isHindi ? "QC लैब प्रमुख अधिकारी" : "QC Lab Lead Officer"}</strong>
            <span className="text-[10px] text-[#66736B] block">{isHindi ? "परीक्षण: सुबह 11:15 बजे" : "Assayed at 11:15 AM"}</span>
          </div>
        </div>
      </div>

      {/* Next Scheduled Station: Weighbridge */}
      <div className="p-3.5 rounded-xl bg-[#F6F8F4] border border-[#E4E9E5] flex items-center justify-between text-xs text-[#17211B]">
        <div>
          <span className="font-bold text-[#17211B]">
            {isHindi ? "अगला स्टेशन: तौल कांटा (WB-02)" : "Next Station: Weighing Station (WB-02)"}
          </span>
          <p className="text-[#66736B] text-[11px] mt-0.5">
            {isHindi ? "कतार में नंबर आने पर वाहन का कुल एवं शुद्ध तौल स्वतः दर्ज होगा।" : "Automated gross and tare weighment scheduled upon queue call."}
          </p>
        </div>
        <span className="text-[#66736B] font-semibold">
          {isHindi ? "आगामी चरण" : "Scheduled Next"}
        </span>
      </div>

    </Card>
  );
};