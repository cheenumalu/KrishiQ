import React from "react";
import { Link } from "react-router-dom";
import { useKrishiQ } from "../../context/KrishiQContext";
import { useLanguage } from "../../i18n";
import { ArrowRight } from "lucide-react";
import { Card } from "../common/Card";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";

export const CentreRecommendationCard: React.FC = () => {
  const { centres, setSelectedCentreId } = useKrishiQ();
  const { t, isHindi, formatLocation } = useLanguage();
  const recommendedCentre = centres.find((c) => c.isRecommended) || centres[0];

  return (
    <Card padding="lg" className="border-[#E4E9E5] card-shadow space-y-4">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#E4E9E5]">
        <div className="flex items-center gap-2">
          <span className="text-xs uppercase font-extrabold tracking-wider text-[#123D2D]">
            {t("farmer.recommendedCentre")}
          </span>
          <Badge variant="normal">{t("common.recommended").toUpperCase()}</Badge>
        </div>
        <span className="text-xs text-[#66736B] font-medium">
          {t("farmer.saveTimeCallout")}
        </span>
      </div>

      <div>
        <h2 className="text-xl font-bold text-[#17211B]">
          {formatLocation(recommendedCentre.name.split(" (")[0])}
        </h2>
        <p className="text-xs text-[#66736B] mt-0.5">
          {t("common.distance")}: <strong className="text-[#17211B]">{recommendedCentre.distanceKm} {t("common.km")}</strong> • {recommendedCentre.district}
        </p>
      </div>

      {/* 4 Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl bg-[#F6F8F4] border border-[#E4E9E5] text-xs text-[#17211B]">
        <div>
          <span className="text-[#66736B] block text-[11px] font-sans">{t("common.distance")}</span>
          <strong className="text-[#17211B] font-sans tabular-nums text-sm block mt-0.5">{recommendedCentre.distanceKm} {t("common.km")}</strong>
        </div>
        <div>
          <span className="text-[#66736B] block text-[11px] font-sans">{t("common.activeQueue")}</span>
          <strong className="text-[#17211B] font-sans tabular-nums text-sm block mt-0.5">{recommendedCentre.currentQueueCount} {t("common.farmers")}</strong>
        </div>
        <div>
          <span className="text-[#66736B] block text-[11px] font-sans">{t("farmer.estWaiting")}</span>
          <strong className="text-[#2F7D4A] font-sans tabular-nums text-sm font-bold block mt-0.5">{recommendedCentre.predictedWaitMinutes} {t("common.min")}</strong>
        </div>
        <div>
          <span className="text-[#66736B] block text-[11px] font-sans">{t("common.capacityLoad")}</span>
          <strong className="text-[#17211B] font-sans tabular-nums text-sm block mt-0.5">{recommendedCentre.utilizationPercent}%</strong>
        </div>
      </div>

      {/* Rationale */}
      <div className="p-3 rounded-xl bg-[#EEF5EF] border border-[#58A66B]/30 text-xs text-[#123D2D] font-medium leading-relaxed">
        {isHindi
          ? "सुझाव: धार रोड केंद्र की तुलना में लगभग 2 घंटे कम प्रतीक्षा समय रहने की संभावना है।"
          : "Recommended because it is expected to save approximately 2 hours compared with Centre A."}
      </div>

      {/* Actions */}
      <div className="pt-2 flex flex-wrap items-center justify-end gap-2.5 border-t border-[#E4E9E5]">
        <Link to="/farmer/centres">
          <Button variant="outline" size="md">
            {isHindi ? "केंद्र देखें" : "View Centre"}
          </Button>
        </Link>
        <Link to="/farmer/book-slot">
          <Button
            variant="primary"
            size="md"
            rightIcon={<ArrowRight className="w-4 h-4" />}
            onClick={() => setSelectedCentreId("centre-b")}
          >
            {t("common.bookSlot")}
          </Button>
        </Link>
      </div>

    </Card>
  );
};