import React from "react";
import { useKrishiQ } from "../../context/KrishiQContext";
import { useLanguage } from "../../i18n";
import { Card } from "../common/Card";
import { Button } from "../common/Button";

interface LiveQueueVisualizerProps {
  onOpenReschedule?: () => void;
  onOpenTokenSlip?: () => void;
}

export const LiveQueueVisualizer: React.FC<LiveQueueVisualizerProps> = ({
  onOpenReschedule,
  onOpenTokenSlip,
}) => {
  const { queueItems, farmerBooking } = useKrishiQ();
  const { t, isHindi, formatLocation, formatCrop, formatTimeSlot } = useLanguage();

  const currentServingItem = queueItems.find((q) => q.status === "SERVING") || queueItems[3];

  return (
    <Card padding="lg" className="border-[#E4E9E5] card-shadow">
      
      {/* Top Title Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E4E9E5]">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-[#17211B]">{isHindi ? "लाइव मंडी कतार" : "Live Mandi Queue"}</h3>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#EEF5EF] text-[#123D2D] border border-[#58A66B]/30">
              <span className="w-2 h-2 rounded-full bg-[#2F7D4A] animate-ping" />
              {isHindi ? "लाइव" : "Live"}
            </span>
          </div>
          <p className="text-xs text-[#66736B] mt-0.5">
            {isHindi ? "खरीदी केंद्र:" : "Centre:"} <strong className="text-[#17211B] font-semibold">{formatLocation(farmerBooking.centreName)}</strong>
          </p>
        </div>

        <div className="text-right">
          <span className="text-[11px] text-[#8A958E] block font-mono">{isHindi ? "कतार स्थिति" : "Status update"}</span>
          <span className="text-xs font-semibold text-[#17211B]">{t("farmer.updatedJustNow")}</span>
        </div>
      </div>

      {/* 4 Summary Counters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
        
        <div className="p-3.5 rounded-xl bg-[#F6F8F4] border border-[#E4E9E5]">
          <span className="text-xs text-[#66736B] font-medium block">{t("farmer.nowServing")}</span>
          <p className="text-2xl font-extrabold text-[#F2A93B] mt-0.5 font-sans tabular-nums">
            {currentServingItem?.tokenNumber || "A124"}
          </p>
          <span className="text-[11px] text-[#9A6210] font-medium block mt-0.5">{isHindi ? "कांटा 1 पर" : "Now serving"}</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#F6F8F4] border border-[#E4E9E5]">
          <span className="text-xs text-[#66736B] font-medium block">{isHindi ? "आपसे पहले किसान" : "Farmers Ahead"}</span>
          <p className="text-2xl font-extrabold text-[#17211B] mt-0.5 font-sans tabular-nums">
            8
          </p>
          <span className="text-[11px] text-[#66736B] block mt-0.5">{isHindi ? "कतार में आगे" : "farmers in front"}</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#EEF5EF] border border-[#58A66B]/30">
          <span className="text-xs text-[#123D2D] font-semibold block">{t("farmer.estWaiting")}</span>
          <p className="text-2xl font-extrabold text-[#123D2D] mt-0.5 font-sans tabular-nums">
            35 {t("common.min")}
          </p>
          <span className="text-[11px] text-[#2F7D4A] block mt-0.5">{isHindi ? "अनुमानित प्रतीक्षा" : "Expected wait"}</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#F6F8F4] border border-[#E4E9E5]">
          <span className="text-xs text-[#66736B] font-medium block">{isHindi ? "संभावित सेवा समय" : "Expected Service"}</span>
          <p className="text-2xl font-extrabold text-[#17211B] mt-0.5 font-sans tabular-nums">
            {formatTimeSlot("11:42 AM")}
          </p>
          <span className="text-[11px] text-[#66736B] block mt-0.5">{isHindi ? "कांटा नंबर 1" : "Counter 1"}</span>
        </div>

      </div>

      {/* Visual Queue Order */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#123D2D]">
            {isHindi ? "कतार क्रम एवं टोकन सूची" : "Queue Order & Token Stream"}
          </span>
          <div className="flex items-center gap-3 text-[11px] text-[#66736B]">
            <span className="flex items-center gap-1"><strong className="text-[#2F7D4A]">✓</strong> {isHindi ? "पूर्ण" : "Completed"}</span>
            <span className="flex items-center gap-1"><strong className="text-[#F2A93B]">●</strong> {isHindi ? "सेवा में" : "Serving"}</span>
            <span className="flex items-center gap-1"><strong className="text-[#8A958E]">○</strong> {isHindi ? "प्रतीक्षा" : "Waiting"}</span>
            <span className="flex items-center gap-1"><strong className="text-[#123D2D]">★</strong> {isHindi ? "आप" : "You"}</span>
          </div>
        </div>

        <div className="space-y-2">
          {queueItems.slice(0, 7).map((item) => {
            const isCompleted = item.status === "COMPLETED";
            const isServing = item.status === "SERVING";
            const isUser = item.isCurrentUser || item.tokenNumber === "A127";
            const isWaiting = !isCompleted && !isServing && !isUser;

            return (
              <div
                key={item.id}
                className={
                  "flex items-center justify-between p-3 rounded-xl border transition-all text-xs " +
                  (isUser
                    ? "bg-[#EEF5EF] border-[#2F7D4A] ring-2 ring-[#2F7D4A]/20 shadow-xs"
                    : isServing
                    ? "bg-[#FEF5E7] border-[#F2A93B]/40"
                    : isCompleted
                    ? "bg-[#F6F8F4] border-[#E4E9E5] opacity-70"
                    : "bg-white border-[#E4E9E5]")
                }
              >
                <div className="flex items-center gap-3">
                  <div
                    className={
                      "w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm " +
                      (isCompleted
                        ? "bg-[#E4E9E5] text-[#2F7D4A]"
                        : isServing
                        ? "bg-[#F2A93B] text-white animate-pulse"
                        : isUser
                        ? "bg-[#123D2D] text-[#58A66B] shadow-xs"
                        : "bg-[#F6F8F4] text-[#8A958E]")
                    }
                  >
                    {isCompleted && "✓"}
                    {isServing && "●"}
                    {isWaiting && "○"}
                    {isUser && "★"}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-sans font-bold text-sm text-[#17211B]">
                        {item.tokenNumber}
                      </span>
                      <span className="font-semibold text-[#17211B]">
                        {isUser ? (isHindi ? "राजेश शर्मा" : "Rajesh Sharma") : item.farmerName}
                      </span>
                      {isUser && (
                        <span className="px-2 py-0.5 rounded-full bg-[#123D2D] text-white text-[10px] font-extrabold">
                          ★ {isHindi ? "आप" : "YOU"}
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#66736B] mt-0.5">
                      {formatCrop(item.crop)} ({item.quantityQuintals} {t("common.quintals")}) • {formatLocation(item.village)}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  {isCompleted && (
                    <span className="text-xs font-bold text-[#2F7D4A] bg-[#EEF5EF] px-2.5 py-1 rounded-md border border-[#58A66B]/20">
                      ✓ {isHindi ? "पूर्ण" : "Done"}
                    </span>
                  )}
                  {isServing && (
                    <span className="text-xs font-bold text-[#9A6210] bg-[#FEF5E7] px-2.5 py-1 rounded-md border border-[#F2A93B]/30 animate-pulse">
                      ● {isHindi ? "अभी सेवा में" : "Currently serving"}
                    </span>
                  )}
                  {isWaiting && (
                    <span className="text-xs text-[#66736B] bg-[#F6F8F4] px-2.5 py-1 rounded-md">
                      ○ {isHindi ? "प्रतीक्षा में" : "Waiting"}
                    </span>
                  )}
                  {isUser && (
                    <span className="text-xs font-extrabold text-[#123D2D] bg-[#EEF5EF] px-3 py-1 rounded-md border border-[#58A66B]/40">
                      ★ {isHindi ? "आपकी बारी (लगभग 35 मिनट)" : "Your Position (~35 min)"}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Footer */}
      <div className="mt-6 pt-4 border-t border-[#E4E9E5] flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-[#66736B]">
          {isHindi
            ? "टोकन A126 बुलाए जाने पर गेट 1 पर ध्वनि उद्घोषणा होगी।"
            : "Audio announcement will sound at Gate 1 when Token A126 is called."}
        </p>

        <div className="flex items-center gap-2">
          {onOpenTokenSlip && (
            <Button variant="outline" size="sm" onClick={onOpenTokenSlip}>
              {t("farmer.viewGateSlip")}
            </Button>
          )}
          {onOpenReschedule && (
            <Button variant="secondary" size="sm" onClick={onOpenReschedule}>
              {t("farmer.reschedule")}
            </Button>
          )}
        </div>
      </div>

    </Card>
  );
};