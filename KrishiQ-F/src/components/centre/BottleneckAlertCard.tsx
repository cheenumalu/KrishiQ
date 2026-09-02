import React from "react";
import { useKrishiQ } from "../../context/KrishiQContext";
import { useLanguage } from "../../i18n";
import { Card } from "../common/Card";
import { Button } from "../common/Button";

export const BottleneckAlertCard: React.FC = () => {
  const { selectedCentre, resolveBottleneck } = useKrishiQ();
  const { t, isHindi } = useLanguage();
  const bottleneck = selectedCentre.bottlenecks?.[0];

  if (!bottleneck) return null;

  return (
    <Card padding="md" className="border-[#F2A93B]/40 bg-[#FEF5E7]/50 space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#9A6210] text-white uppercase">
            {isHindi ? "चेतावनी • रुकावट पहचानी गई" : "WARNING • BOTTLENECK DETECTED"}
          </span>
          <span className="text-xs font-bold text-[#17211B] uppercase">
            {isHindi ? "स्थान: तौल कांटा स्टेशन" : "Location: Weighing Station"}
          </span>
        </div>
        <span className="text-xs text-[#9A6210] font-semibold font-sans tabular-nums">
          {isHindi ? "18 किसान प्रतीक्षा में" : "18 farmers waiting"}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-[#66736B]">
        <div>
          <span>{isHindi ? "औसत संसाधन समय:" : "Average processing time:"} <strong className="text-[#17211B]">11 {t("common.min")}</strong></span>
        </div>
        <div>
          <span>{isHindi ? "सुझाव: एक उपलब्ध कर्मचारी को तौल पर तैनात करें।" : "Recommended action: Shift one available operator to weighing."}</span>
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-1 border-t border-[#F2A93B]/20">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => resolveBottleneck(selectedCentre.id)}
        >
          {isHindi ? "सुझाव देखें" : "View Recommendation"}
        </Button>
      </div>
    </Card>
  );
};