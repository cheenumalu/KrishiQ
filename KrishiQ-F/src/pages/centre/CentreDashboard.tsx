import React, { useState } from "react";
import { useKrishiQ } from "../../context/KrishiQContext";
import { useLanguage } from "../../i18n";
import {
  Building2,
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  PhoneCall,
  Activity,
  Play,
  ShieldCheck,
  ArrowRight
} from "lucide-react";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { QualityGradingModal } from "../../components/centre/QualityGradingModal";
import { getStageLabel } from "../../utils/stages";

export const CentreDashboard: React.FC = () => {
  const {
    selectedCentre,
    queueItems,
    allBookings,
    addToast,
    advanceBookingStage,
    callNextFarmer,
    updateQualityAndWeight,
    resolveBottleneck,
    isItemHighlighted,
  } = useKrishiQ();
  const { t, isHindi, formatLocation, formatCrop } = useLanguage();

  const [isBottleneckResolved, setIsBottleneckResolved] = useState(false);
  const [isQCModalOpen, setIsQCModalOpen] = useState(false);
  const [activeQCItemId, setActiveQCItemId] = useState<string | null>(null);

  // Dynamic calculations from central state
  const centreBookings = allBookings.filter((b) => b.centreId === selectedCentre.id);
  const totalBookingsCount = Math.max(centreBookings.length, 140 + centreBookings.length);
  
  const waitingOrServing = queueItems.filter((q) => q.status === "WAITING" || q.status === "SERVING");
  const currentQueueCount = isBottleneckResolved ? Math.max(1, waitingOrServing.length - 2) : waitingOrServing.length;
  const avgWaitMinutes = Math.max(6, currentQueueCount * 5);

  const totalProcuredQuintals = allBookings
    .filter((b) => b.centreId === selectedCentre.id && b.currentStageNumber >= 6)
    .reduce((acc, b) => acc + (b.weighing?.netWeightQuintals || b.quantityQuintals || 0), 3240);

  const receiptsClearedCount = allBookings.filter((b) => b.centreId === selectedCentre.id && b.currentStageNumber >= 6).length + 61;

  // Active serving & next farmer in line
  const currentServing = queueItems.find((q) => q.status === "SERVING") || queueItems[0];
  const nextFarmer = queueItems.find((q) => q.status === "WAITING");

  const handleCompleteCurrentStage = async () => {
    if (!currentServing) return;
    await advanceBookingStage(currentServing.id);
    addToast(
      isHindi ? "चरण पूर्ण" : "Stage Completed",
      isHindi ? `टोकन ${currentServing.tokenNumber} का चरण पूर्ण हुआ।` : `Token ${currentServing.tokenNumber} completed stage progression.`,
      "success"
    );
  };

  const handleCallNext = () => {
    callNextFarmer();
  };

  const handleApplyBottleneck = () => {
    resolveBottleneck(selectedCentre.id);
    setIsBottleneckResolved(true);
    addToast(
      isHindi ? "स्टाफ पुनर्वितरित" : "Staff Rebalanced",
      isHindi ? "कर्मचारी तौल कांटे पर तैनात। कतार की समस्या हल हो गई।" : "Operator shifted to Weighing. Queue backlog resolved.",
      "success"
    );
  };

  const handleQCSubmit = async (data: any) => {
    if (activeQCItemId) {
      await updateQualityAndWeight(
        activeQCItemId,
        {
          moisturePercent: data.moisture,
          dockagePercent: data.dockage,
          foreignMatterPercent: data.foreignMatter,
          grade: data.grade,
          passed: data.grade !== "Below FAQ",
        },
        {
          netWeightQuintals: data.netWeightQuintals,
          bagCount: Math.round(data.netWeightQuintals * 2),
        }
      );
      await advanceBookingStage(activeQCItemId, "procured_loading");
      setActiveQCItemId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* 1. OPERATOR HERO BANNER */}
      <div className="bg-[#123D2D] p-5 sm:p-6 rounded-[18px] text-white shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#58A66B] animate-pulse" />
            <span className="text-[11px] text-[#58A66B] font-bold uppercase tracking-wider">
              {t("centre.operationalOpen")}
            </span>
            <span className="text-[11px] text-white/60">• {t("centre.shiftInfo")}</span>
          </div>

          <h1 className="text-[28px] sm:text-[32px] font-bold tracking-[-0.025em] text-white leading-[1.12]">
            {formatLocation(selectedCentre.name)}
          </h1>
          <p className="text-xs sm:text-sm text-white/80 font-sans">
            Code: <strong className="text-white font-semibold">{selectedCentre.code}</strong> • {isHindi ? "जिला:" : "District:"} {selectedCentre.district} • {isHindi ? "सक्रिय कांटे:" : "Active Counters:"} {selectedCentre.activeCounters}
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-white/15 text-xs text-white space-y-1 shrink-0">
          <div className="text-white/70 text-[11px]">{t("centre.mandiCapacityLoad")}</div>
          <div className="text-sm font-bold font-sans tabular-nums">
            {isHindi ? `${totalBookingsCount} / ${selectedCentre.totalCapacityPerDay} किसान (सक्रिय)` : `${totalBookingsCount} / ${selectedCentre.totalCapacityPerDay} Farmers (Active)`}
          </div>
          <div className="w-40 h-1.5 bg-white/20 rounded-full overflow-hidden mt-1">
            <div className="h-full bg-[#58A66B] rounded-full" style={{ width: `${Math.min(100, Math.round((totalBookingsCount / selectedCentre.totalCapacityPerDay) * 100))}%` }} />
          </div>
        </div>
      </div>

      {/* 2. OPERATIONAL KPI STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card padding="sm" className="h-[124px] p-[18px_20px] flex flex-col justify-between">
          <div className="flex items-center gap-2 text-[#404A43] dark:text-[#CBD5E1]">
            <Building2 className="w-4.5 h-4.5 text-[#2F7D4A] shrink-0" />
            <span className="text-[13px] font-medium leading-[1.3]">{t("centre.todayBookings")}</span>
          </div>
          <div className="text-[30px] font-bold tracking-[-0.02em] leading-none text-[#111813] dark:text-white tabular-nums font-sans">
            {totalBookingsCount}
          </div>
          <span className="text-[12px] text-[#2F7D4A] dark:text-[#52DB89] font-semibold">{t("centre.checkedInRate")}</span>
        </Card>

        <Card padding="sm" className="h-[124px] p-[18px_20px] flex flex-col justify-between">
          <div className="flex items-center gap-2 text-[#404A43] dark:text-[#CBD5E1]">
            <Users className="w-4.5 h-4.5 text-[#2F7D4A] shrink-0" />
            <span className="text-[13px] font-medium leading-[1.3]">{t("centre.currentQueueCount")}</span>
          </div>
          <div className="text-[30px] font-bold tracking-[-0.02em] leading-none text-[#9A6210] dark:text-[#F2A93B] tabular-nums font-sans">
            {currentQueueCount}
          </div>
          <span className="text-[12px] text-[#404A43] dark:text-[#CBD5E1]">{t("centre.farmersWaiting")}</span>
        </Card>

        <Card padding="sm" className="h-[124px] p-[18px_20px] flex flex-col justify-between">
          <div className="flex items-center gap-2 text-[#404A43] dark:text-[#CBD5E1]">
            <Clock className="w-4.5 h-4.5 text-[#2F7D4A] shrink-0" />
            <span className="text-[13px] font-medium leading-[1.3]">{t("centre.avgWaitTime")}</span>
          </div>
          <div className="text-[30px] font-bold tracking-[-0.02em] leading-none text-[#111813] dark:text-white tabular-nums font-sans">
            {isBottleneckResolved ? `18 ${t("common.min")}` : `${avgWaitMinutes} ${t("common.min")}`}
          </div>
          <span className="text-[12px] text-[#2F7D4A] dark:text-[#52DB89] font-semibold">{t("centre.vsYesterday")}</span>
        </Card>

        <Card padding="sm" className="h-[124px] p-[18px_20px] flex flex-col justify-between bg-[#EEF5EF] dark:bg-[#1A3125] border-[#58A66B]/30">
          <div className="flex items-center gap-2 text-[#123D2D] dark:text-[#52DB89]">
            <Activity className="w-4.5 h-4.5 text-[#2F7D4A] shrink-0" />
            <span className="text-[13px] font-semibold leading-[1.3]">{t("centre.todayProcurement")}</span>
          </div>
          <div className="text-[30px] font-bold tracking-[-0.02em] leading-none text-[#123D2D] dark:text-[#52DB89] tabular-nums font-sans">
            {totalProcuredQuintals.toLocaleString()} {t("common.quintal")}
          </div>
          <span className="text-[12px] text-[#2F7D4A] dark:text-[#52DB89] font-medium">{receiptsClearedCount} {t("centre.receiptsCleared")}</span>
        </Card>
      </div>

      {/* 3. BOTTLENECK ALERT ADVISORY STRIP */}
      {!isBottleneckResolved ? (
        <Card padding="sm" className="p-[16px_20px] bg-[#FEF5E7] dark:bg-[#2A2315] border border-[#F2A93B]/40 text-xs text-[#9A6210] dark:text-[#F2A93B] flex flex-wrap items-center justify-between gap-3 border-l-4 border-l-[#F2A93B]">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-[#F2A93B] shrink-0" />
            <div>
              <div className="font-bold text-[14px] text-[#111813] dark:text-white">{t("centre.bottleneckAdvisoryTitle")}</div>
              <p className="text-[#404A43] dark:text-[#CBD5E1] text-[13px] mt-0.5">{t("centre.bottleneckAdvisoryDesc")}</p>
            </div>
          </div>
          <Button variant="accent" size="sm" onClick={handleApplyBottleneck}>
            {t("centre.shiftOperatorAction")}
          </Button>
        </Card>
      ) : (
        <div className="p-3 rounded-xl bg-[#EEF5EF] dark:bg-[#1A3125] border border-[#58A66B]/30 text-xs text-[#123D2D] dark:text-[#52DB89] font-medium flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#2F7D4A] dark:text-[#52DB89]" />
            {t("centre.bottleneckResolvedText")}
          </span>
          <span className="font-bold text-[#2F7D4A] dark:text-[#52DB89]">{t("centre.optimalFlow")}</span>
        </div>
      )}

      {/* 4. WORKSTATION CARDS & QUEUE TIMELINE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* LEFT 7 COLS: WORKSTATION CARDS */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Active Serving Card */}
            <Card padding="md" className="space-y-3 border-[#2F7D4A] ring-1 ring-[#2F7D4A]/20">
              <div className="flex items-center justify-between pb-2 border-b border-[#E4E9E5] dark:border-[#23362B]">
                <span className="text-xs uppercase font-extrabold tracking-wider text-[#123D2D] dark:text-[#52DB89]">
                  {t("centre.currentlyServingTitle")}
                </span>
                <Badge variant={currentServing?.status === "SERVING" ? "warning" : "success"} size="sm">
                  {currentServing?.status === "SERVING" ? t("centre.activeBadge") : "Queued"}
                </Badge>
              </div>

              {currentServing ? (
                <div className="space-y-1.5 text-xs">
                  <h3 className="text-2xl font-bold text-[#111813] dark:text-white font-sans tabular-nums">
                    Token #{currentServing.tokenNumber}
                  </h3>
                  <p className="text-sm font-bold text-[#111813] dark:text-white">
                    {t("centre.farmerLabel")}: {currentServing.farmerName} {currentServing.isCurrentUser && (isHindi ? "(डेमो किसान)" : "(Demo User)")}
                  </p>
                  <p className="text-[#404A43] dark:text-[#CBD5E1]">
                    {t("centre.lotLabel")}: <strong className="text-[#111813] dark:text-white">{formatCrop(currentServing.crop)}</strong> • {isHindi ? "मात्रा:" : "Quantity:"} <strong className="text-[#111813] dark:text-white font-sans tabular-nums">{currentServing.quantityQuintals} {t("common.quintal")}</strong>
                  </p>
                  <p className="text-[#404A43] dark:text-[#CBD5E1]">
                    {t("centre.stationLabel")}: <strong className="text-[#123D2D] dark:text-[#52DB89] font-semibold">{getStageLabel(currentServing.stageName || "quality_inspection", isHindi)}</strong>
                  </p>
                </div>
              ) : (
                <div className="py-6 text-center text-[#66736C]">
                  {isHindi ? "कोई सक्रिय किसान नहीं है" : "No active farmer serving"}
                </div>
              )}

              <div className="pt-2 border-t border-[#E4E9E5] dark:border-[#23362B] flex items-center gap-2">
                {currentServing && currentServing.stageNumber >= 3 && currentServing.stageNumber <= 5 ? (
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full"
                    leftIcon={<ShieldCheck className="w-4 h-4" />}
                    onClick={() => {
                      setActiveQCItemId(currentServing.id);
                      setIsQCModalOpen(true);
                    }}
                  >
                    {isHindi ? "गुणवत्ता व तौल दर्ज करें" : "Record Assay & Weigh"}
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    size="md"
                    className="w-full"
                    leftIcon={<CheckCircle2 className="w-4 h-4" />}
                    onClick={handleCompleteCurrentStage}
                    disabled={!currentServing}
                  >
                    {t("centre.completeStageBtn")}
                  </Button>
                )}
              </div>
            </Card>

            {/* Next Farmer Card */}
            <Card padding="md" className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#E4E9E5] dark:border-[#23362B]">
                <span className="text-xs uppercase font-extrabold tracking-wider text-[#123D2D] dark:text-[#52DB89]">
                  {t("centre.nextFarmerTitle")}
                </span>
                <Badge variant="neutral" size="sm">{t("centre.position1Badge")}</Badge>
              </div>

              {nextFarmer ? (
                <div className="space-y-1.5 text-xs">
                  <h3 className="text-2xl font-bold text-[#111813] dark:text-white font-sans tabular-nums">
                    Token #{nextFarmer.tokenNumber}
                  </h3>
                  <p className="text-sm font-bold text-[#111813] dark:text-white">
                    {t("centre.farmerLabel")}: {nextFarmer.farmerName} {nextFarmer.isCurrentUser && (isHindi ? "(डेमो किसान)" : "(Demo User)")}
                  </p>
                  <p className="text-[#404A43] dark:text-[#CBD5E1]">
                    {t("centre.lotLabel")}: <strong className="text-[#111813] dark:text-white">{formatCrop(nextFarmer.crop)}</strong> • {isHindi ? "मात्रा:" : "Quantity:"} <strong className="text-[#111813] dark:text-white font-sans tabular-nums">{nextFarmer.quantityQuintals} {t("common.quintal")}</strong>
                  </p>
                  <p className="text-[#66736C] dark:text-[#94A3B8]">
                    {t("centre.estInspection")}: ~{nextFarmer.estimatedProcessingMinutes || 8} {t("common.min")}
                  </p>
                </div>
              ) : (
                <div className="py-6 text-center text-[#66736C]">
                  {isHindi ? "कतार में अगला किसान नहीं है" : "No waiting farmer in queue"}
                </div>
              )}

              <div className="pt-2 border-t border-[#E4E9E5] dark:border-[#23362B]">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full"
                  leftIcon={<PhoneCall className="w-4 h-4" />}
                  onClick={handleCallNext}
                  disabled={!nextFarmer}
                >
                  {t("centre.callNextBtn")}
                </Button>
              </div>
            </Card>

          </div>

          {/* Queue Timeline Visual */}
          <Card padding="md" className="space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-[#E4E9E5] dark:border-[#23362B]">
              <span className="text-xs uppercase font-extrabold tracking-wider text-[#123D2D] dark:text-[#52DB89]">
                {t("centre.queueTimelineTitle")}
              </span>
              <span className="text-xs text-[#404A43] dark:text-[#CBD5E1]">{t("centre.liveSequence")}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 text-xs pt-0.5">
              {currentServing && (
                <div className="p-2.5 rounded-xl bg-[#FEF5E7] dark:bg-[#2A2315] border border-[#F2A93B]/40 text-[#9A6210] dark:text-[#F2A93B] font-sans tabular-nums font-bold flex items-center gap-2">
                  <span className="text-[10px] uppercase tracking-wider text-[#404A43] dark:text-[#CBD5E1]">{t("centre.servingPrefix")}</span>
                  <span>#{currentServing.tokenNumber}</span>
                </div>
              )}

              <span className="text-[#66736C] dark:text-[#94A3B8]">→</span>

              <div className="p-2.5 rounded-xl bg-[#EEF5EF] dark:bg-[#1A3125] border border-[#58A66B]/30 text-[#123D2D] dark:text-[#52DB89] font-sans tabular-nums font-bold flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider text-[#404A43] dark:text-[#CBD5E1]">{t("centre.nextPrefix")}</span>
                {queueItems.filter((q) => q.status === "WAITING").slice(0, 4).map((q) => (
                  <span key={q.id} className={q.isCurrentUser ? "underline decoration-[#2F7D4A] font-extrabold" : ""}>
                    #{q.tokenNumber}
                  </span>
                ))}
              </div>

              <div className="ml-auto px-3 py-1 rounded-full bg-[#EEF5EF] dark:bg-[#1A3125] text-[#2F7D4A] dark:text-[#52DB89] text-xs font-semibold">
                {t("centre.onSchedule")}
              </div>
            </div>
          </Card>

        </div>

        {/* RIGHT 5 COLS: OPERATIONAL TABLE */}
        <div className="lg:col-span-5 space-y-4">
          <Card padding="none" className="overflow-hidden">
            <div className="p-3.5 bg-[#F6F8F4] dark:bg-[#101B15] border-b border-[#E4E9E5] dark:border-[#23362B] flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold tracking-wider text-[#123D2D] dark:text-[#52DB89]">
                {t("centre.todayIntakeLog")}
              </span>
              <span className="text-xs text-[#404A43] dark:text-[#CBD5E1]">{queueItems.length} {t("centre.recordsCount")}</span>
            </div>

            <div className="overflow-x-auto max-h-[480px]">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#E4E9E5] dark:border-[#23362B] bg-[#F6F8F4] dark:bg-[#101B15] text-[11px] font-bold text-[#404A43] dark:text-[#CBD5E1] uppercase">
                    <th className="py-2.5 px-3">{t("centre.tableToken")}</th>
                    <th className="py-2.5 px-3">{t("centre.tableFarmer")}</th>
                    <th className="py-2.5 px-3">{t("centre.tableStage")}</th>
                    <th className="py-2.5 px-3">{t("centre.tableStatus")}</th>
                    <th className="py-2.5 px-3 text-right">{t("centre.tableAction")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4E9E5] dark:divide-[#23362B]">
                  {queueItems.map((row) => {
                    const isServingRow = row.status === "SERVING";
                    const isHighlighted = isItemHighlighted(row.id);

                    return (
                      <tr
                        key={row.id}
                        className={`${
                          isHighlighted
                            ? "highlight-pulse bg-emerald-50 dark:bg-emerald-950/40"
                            : isServingRow
                            ? "bg-[#FEF5E7]/70 dark:bg-[#2A2315]/70 font-semibold"
                            : "hover:bg-[#F6F8F4] dark:hover:bg-[#18281F]"
                        }`}
                      >
                        <td className="py-2.5 px-3 font-sans tabular-nums font-bold text-[#111813] dark:text-white">
                          <span className={row.isCurrentUser ? "text-[#2F7D4A] dark:text-[#52DB89]" : ""}>
                            #{row.tokenNumber}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-[#111813] dark:text-white font-medium">
                          {row.farmerName} {row.isCurrentUser && (isHindi ? "(आप)" : "(You)")}
                        </td>
                        <td className="py-2.5 px-3 text-[#404A43] dark:text-[#CBD5E1]">
                          {getStageLabel(row.stageName || "quality_inspection", isHindi)}
                        </td>
                        <td className="py-2.5 px-3">
                          <Badge
                            size="sm"
                            variant={
                              row.status === "SERVING"
                                ? "warning"
                                : row.status === "COMPLETED"
                                ? "success"
                                : "neutral"
                            }
                          >
                            {row.status === "SERVING"
                              ? t("centre.statusProcessing")
                              : row.status === "COMPLETED"
                              ? t("centre.statusCompleted")
                              : t("centre.statusWaiting")}
                          </Badge>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          {row.status === "WAITING" && (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={async () => {
                                await advanceBookingStage(row.id, "gate_verification");
                                addToast(
                                  isHindi ? "बुलाया गया" : "Called",
                                  isHindi ? `${row.tokenNumber} को काउंटर पर बुलाया गया।` : `${row.tokenNumber} called to intake counter.`,
                                  "info"
                                );
                              }}
                            >
                              {t("centre.callAction")}
                            </Button>
                          )}
                          {row.status === "SERVING" && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => {
                                setActiveQCItemId(row.id);
                                setIsQCModalOpen(true);
                              }}
                            >
                              {isHindi ? "तौल/QC" : "QC / Weigh"}
                            </Button>
                          )}
                          {row.status === "COMPLETED" && (
                            <span className="text-[11px] text-[#2F7D4A] dark:text-[#52DB89] font-bold">
                              {t("centre.doneBadge")}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

      </div>

      {/* QC & Weighbridge Modal */}
      <QualityGradingModal
        isOpen={isQCModalOpen}
        onClose={() => {
          setIsQCModalOpen(false);
          setActiveQCItemId(null);
        }}
        onSubmit={handleQCSubmit}
      />

    </div>
  );
};