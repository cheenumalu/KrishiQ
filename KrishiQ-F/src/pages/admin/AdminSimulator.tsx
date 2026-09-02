import React, { useState } from "react";
import { Sliders, CheckCircle2 } from "lucide-react";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { useKrishiQ } from "../../context/KrishiQContext";
import { useLanguage } from "../../i18n";
import { runWhatIfSimulation } from "../../utils/calculations";

export const AdminSimulator: React.FC = () => {
  const { selectedCentre } = useKrishiQ();
  const { t, isHindi } = useLanguage();
  const [additionalFarmers, setAdditionalFarmers] = useState<number>(120);
  const [counters, setCounters] = useState<number>(6);
  const [qualityStaff, setQualityStaff] = useState<number>(4);
  const [extendedHours, setExtendedHours] = useState<number>(2);

  const simResult = runWhatIfSimulation(
    {
      additionalFarmers,
      activeCounters: counters,
      qualityStaff,
      extendedHours,
      targetCentreId: selectedCentre.id,
    },
    selectedCentre
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      
      {/* Header */}
      <div className="space-y-1 pb-2 border-b border-[#E4E9E5]">
        <div className="flex items-center gap-2">
          <Badge variant="info" size="sm">{t("admin.policySandboxBadge")}</Badge>
          <span className="text-xs text-[#66736B]">{isHindi ? "मांग पूर्वानुमान एवं सिमुलेशन इंजन" : "What-If Demand Forecast Engine"}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#17211B] tracking-[-0.025em]">
          {t("admin.simulatorHeading")}
        </h1>
        <p className="text-xs sm:text-sm text-[#66736B] leading-[1.45]">
          {t("admin.simulatorSubheading")}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* Left 6 cols: SIMULATION PARAMETERS */}
        <Card padding="md" className="lg:col-span-6 space-y-4">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#E4E9E5]">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#2F7D4A]" />
              <span className="text-xs uppercase font-extrabold tracking-wider text-[#123D2D]">
                {t("admin.simulationParameters")}
              </span>
            </div>
            <button
              onClick={() => { setAdditionalFarmers(120); setCounters(6); setQualityStaff(4); setExtendedHours(2); }}
              className="text-xs text-[#2F7D4A] font-bold hover:underline cursor-pointer"
            >
              {t("admin.resetDefaultBtn")}
            </button>
          </div>

          <div className="space-y-3.5 text-xs">
            
            {/* Arrival Surge Slider */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-[#17211B] font-medium">{t("admin.arrivalSurgeLabel")}</span>
                <strong className="font-sans tabular-nums text-[#2F7D4A] font-bold text-sm">+{additionalFarmers} {t("common.farmers")}</strong>
              </div>
              <input
                type="range"
                min="0"
                max="400"
                step="10"
                value={additionalFarmers}
                onChange={(e) => setAdditionalFarmers(Number(e.target.value))}
                className="w-full accent-[#2F7D4A] cursor-pointer h-2 bg-[#EEF5EF] rounded-lg"
              />
            </div>

            {/* Counters Control */}
            <div className="pt-2.5 border-t border-[#E4E9E5]">
              <div className="flex justify-between mb-1">
                <span className="text-[#17211B] font-medium">{t("admin.activeWeighbridgeLabel")}</span>
                <strong className="font-sans tabular-nums text-[#17211B] font-bold text-sm">{counters} {t("admin.countersSuffix")}</strong>
              </div>
              <div className="flex items-center justify-between bg-[#F6F8F4] p-1.5 rounded-xl border border-[#E4E9E5]">
                <button
                  type="button"
                  onClick={() => setCounters((prev) => Math.max(1, prev - 1))}
                  className="w-7 h-7 rounded-lg bg-white border border-[#E4E9E5] font-bold text-[#17211B] hover:bg-[#EEF5EF] cursor-pointer"
                >
                  -
                </button>
                <span className="font-sans tabular-nums font-bold text-base text-[#123D2D]">{counters}</span>
                <button
                  type="button"
                  onClick={() => setCounters((prev) => Math.min(10, prev + 1))}
                  className="w-7 h-7 rounded-lg bg-white border border-[#E4E9E5] font-bold text-[#17211B] hover:bg-[#EEF5EF] cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Quality Staff Control */}
            <div className="pt-2.5 border-t border-[#E4E9E5]">
              <div className="flex justify-between mb-1">
                <span className="text-[#17211B] font-medium">{t("admin.qualityStaffLabel")}</span>
                <strong className="font-sans tabular-nums text-[#17211B] font-bold text-sm">{qualityStaff} {t("admin.inspectorsSuffix")}</strong>
              </div>
              <div className="flex items-center justify-between bg-[#F6F8F4] p-1.5 rounded-xl border border-[#E4E9E5]">
                <button
                  type="button"
                  onClick={() => setQualityStaff((prev) => Math.max(2, prev - 1))}
                  className="w-7 h-7 rounded-lg bg-white border border-[#E4E9E5] font-bold text-[#17211B] hover:bg-[#EEF5EF] cursor-pointer"
                >
                  -
                </button>
                <span className="font-sans tabular-nums font-bold text-base text-[#123D2D]">{qualityStaff}</span>
                <button
                  type="button"
                  onClick={() => setQualityStaff((prev) => Math.min(12, prev + 1))}
                  className="w-7 h-7 rounded-lg bg-white border border-[#E4E9E5] font-bold text-[#17211B] hover:bg-[#EEF5EF] cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Extended Hours Slider */}
            <div className="pt-2.5 border-t border-[#E4E9E5]">
              <div className="flex justify-between mb-1">
                <span className="text-[#17211B] font-medium">{t("admin.extendedShiftLabel")}</span>
                <strong className="font-sans tabular-nums text-[#17211B] font-bold text-sm">+{extendedHours} {t("admin.hoursSuffix")}</strong>
              </div>
              <input
                type="range"
                min="0"
                max="4"
                value={extendedHours}
                onChange={(e) => setExtendedHours(Number(e.target.value))}
                className="w-full accent-[#2F7D4A] cursor-pointer h-2 bg-[#EEF5EF] rounded-lg"
              />
            </div>

          </div>
        </Card>

        {/* Right 6 cols: SIMULATION RESULTS & POLICY DIRECTIVES */}
        <div className="lg:col-span-6 space-y-4">
          
          <Card padding="md" className="space-y-4">
            <div className="flex items-center justify-between pb-2.5 border-b border-[#E4E9E5]">
              <span className="text-xs uppercase font-extrabold tracking-wider text-[#123D2D]">
                {t("admin.projectionResultsTitle")}
              </span>
              <Badge variant="success" size="sm">{t("admin.calculatedModelBadge")}</Badge>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-xs">
              <div className="p-3 rounded-xl bg-[#F6F8F4] border border-[#E4E9E5]">
                <span className="text-[#66736B] block">{t("admin.baselineWaitLabel")}</span>
                <strong className="text-lg font-bold font-sans tabular-nums text-[#17211B] block mt-0.5">{simResult.baseWaitTime} {t("common.min")}</strong>
              </div>

              <div className="p-3 rounded-xl bg-[#FDF2F2] border border-[#D95555]/30">
                <span className="text-[#9B2C2C] block">{t("admin.unmitigatedSurgeLabel")}</span>
                <strong className="text-lg font-bold font-sans tabular-nums text-[#D95555] block mt-0.5">{simResult.unmitigatedWaitTime} {t("common.min")}</strong>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#EEF5EF] border border-[#58A66B]/30 flex items-center justify-between text-xs">
              <div>
                <span className="text-[#66736B] block">{t("admin.mitigatedWaitLabel")}</span>
                <span className="text-xs text-[#123D2D] font-bold">{t("admin.withProposedPolicy")}</span>
              </div>
              <strong className="text-2xl font-bold font-sans tabular-nums text-[#123D2D]">
                {simResult.simulatedWaitTime} {t("common.min")}
              </strong>
            </div>

            {/* Policy directives */}
            <div className="p-3.5 rounded-xl bg-[#F6F8F4] border border-[#E4E9E5] text-xs space-y-2">
              <span className="font-bold text-[#17211B] block uppercase text-[10px]">{t("admin.policyDirectivesTitle")}</span>
              {simResult.policyDirectives.map((dir, idx) => (
                <div key={idx} className="flex items-start gap-2 text-[#66736B]">
                  <CheckCircle2 className="w-4 h-4 text-[#2F7D4A] shrink-0 mt-0.5" />
                  <span>{dir}</span>
                </div>
              ))}
            </div>
          </Card>

        </div>

      </div>

    </div>
  );
};