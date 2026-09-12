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
  ShieldCheck,
  Scale
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
    <div className="space-y-5 max-w-7xl mx-auto pb-12 font-sans">
      
      {/* 1. OPERATOR MANDI CONSOLE HEADER */}
      <div className="bg-white dark:bg-[#131D28] border-2 border-[#003366] dark:border-[#1E3A8A] rounded-xs shadow-xs overflow-hidden">
        <div className="bg-[#003366] text-white px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2 border-b-2 border-[#FF9933]">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs uppercase tracking-wider">
              {isHindi ? "राज्य कृषि विपणन बोर्ड • उपार्जन केंद्र संचालन कंसोल" : "State Agricultural Marketing Board • APMC Mandi Operational Workstation"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[#15803D] text-white text-[10px] font-bold rounded-2xs uppercase">
              {t("centre.operationalOpen")}
            </span>
            <span className="text-[11px] text-slate-200">
              {t("centre.shiftInfo")}
            </span>
          </div>
        </div>

        <div className="p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-xl sm:text-2xl font-black text-[#003366] dark:text-[#38BDF8] tracking-tight">
              {formatLocation(selectedCentre.name)}
            </h1>
            <p className="text-xs text-slate-600 dark:text-slate-300 font-mono">
              APMC Code: <strong className="text-slate-900 dark:text-white font-bold">{selectedCentre.code}</strong> • {isHindi ? "जिला:" : "District:"} {selectedCentre.district} • {isHindi ? "सक्रिय तौल कांटे:" : "Active Weighbridges:"} {selectedCentre.activeCounters}
            </p>
          </div>

          <div className="bg-[#F8FAFC] dark:bg-[#0E1620] border border-[#CBD5E1] dark:border-slate-700 p-3 rounded-xs shrink-0 text-xs">
            <span className="text-[10px] text-slate-500 uppercase font-bold block">{t("centre.mandiCapacityLoad")}</span>
            <div className="text-sm font-black text-[#003366] dark:text-[#38BDF8] font-mono tabular-nums">
              {totalBookingsCount} / {selectedCentre.totalCapacityPerDay} {isHindi ? "किसान (सक्रिय)" : "Farmers (Active)"}
            </div>
            <div className="w-40 h-2 bg-slate-200 dark:bg-slate-700 rounded-2xs overflow-hidden mt-1.5">
              <div className="h-full bg-[#15803D]" style={{ width: `${Math.min(100, Math.round((totalBookingsCount / selectedCentre.totalCapacityPerDay) * 100))}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* 2. OPERATIONAL KPI STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card padding="sm" className="border-[#CBD5E1] flex flex-col justify-between p-3.5">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <Building2 className="w-4 h-4 text-[#003366]" />
            <span className="text-xs font-bold uppercase">{t("centre.todayBookings")}</span>
          </div>
          <div className="text-2xl font-black text-[#003366] dark:text-[#38BDF8] font-mono tabular-nums mt-1">
            {totalBookingsCount}
          </div>
          <span className="text-[11px] text-[#15803D] font-semibold">{t("centre.checkedInRate")}</span>
        </Card>

        <Card padding="sm" className="border-[#CBD5E1] flex flex-col justify-between p-3.5">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <Users className="w-4 h-4 text-[#B45309]" />
            <span className="text-xs font-bold uppercase">{t("centre.currentQueueCount")}</span>
          </div>
          <div className="text-2xl font-black text-[#B45309] font-mono tabular-nums mt-1">
            {currentQueueCount}
          </div>
          <span className="text-[11px] text-slate-500">{t("centre.farmersWaiting")}</span>
        </Card>

        <Card padding="sm" className="border-[#CBD5E1] flex flex-col justify-between p-3.5">
          <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
            <Clock className="w-4 h-4 text-[#003366]" />
            <span className="text-xs font-bold uppercase">{t("centre.avgWaitTime")}</span>
          </div>
          <div className="text-2xl font-black text-[#003366] dark:text-[#38BDF8] font-mono tabular-nums mt-1">
            {isBottleneckResolved ? `18 ${t("common.min")}` : `${avgWaitMinutes} ${t("common.min")}`}
          </div>
          <span className="text-[11px] text-[#15803D] font-semibold">{t("centre.vsYesterday")}</span>
        </Card>

        <Card padding="sm" className="border-[#CBD5E1] bg-[#F0FDF4] dark:bg-[#062413] flex flex-col justify-between p-3.5">
          <div className="flex items-center gap-2 text-[#15803D]">
            <Activity className="w-4 h-4 text-[#15803D]" />
            <span className="text-xs font-bold uppercase">{t("centre.todayProcurement")}</span>
          </div>
          <div className="text-2xl font-black text-[#15803D] font-mono tabular-nums mt-1">
            {totalProcuredQuintals.toLocaleString()} {t("common.quintal")}
          </div>
          <span className="text-[11px] text-[#15803D] font-medium">{receiptsClearedCount} {t("centre.receiptsCleared")}</span>
        </Card>
      </div>

      {/* 3. BOTTLENECK ALERT ADVISORY STRIP */}
      {!isBottleneckResolved ? (
        <div className="p-3.5 bg-[#FFFBEB] dark:bg-[#201505] border-l-4 border-l-[#B45309] border border-[#FDE68A] text-xs text-[#92400E] dark:text-[#FCD34D] flex flex-wrap items-center justify-between gap-3 rounded-xs">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-[#B45309] shrink-0" />
            <div>
              <div className="font-bold text-sm text-[#92400E] dark:text-[#FCD34D]">{t("centre.bottleneckAdvisoryTitle")}</div>
              <p className="text-slate-700 dark:text-slate-300 text-xs mt-0.5">{t("centre.bottleneckAdvisoryDesc")}</p>
            </div>
          </div>
          <Button variant="accent" size="sm" onClick={handleApplyBottleneck}>
            {t("centre.shiftOperatorAction")}
          </Button>
        </div>
      ) : (
        <div className="p-3 rounded-xs bg-[#F0FDF4] dark:bg-[#062413] border border-[#86EFAC] text-xs text-[#15803D] dark:text-[#4ADE80] font-semibold flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#15803D]" />
            {t("centre.bottleneckResolvedText")}
          </span>
          <span className="font-bold uppercase">{t("centre.optimalFlow")}</span>
        </div>
      )}

      {/* 4. WORKSTATION CARDS & QUEUE REGISTER */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* LEFT 7 COLS: WORKSTATION CARDS */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Active Serving Card */}
            <Card padding="md" className="space-y-3 border-2 border-[#003366] dark:border-[#1E3A8A]">
              <div className="flex items-center justify-between pb-2 border-b border-[#CBD5E1] dark:border-slate-700">
                <span className="text-xs uppercase font-extrabold tracking-wider text-[#003366] dark:text-[#38BDF8]">
                  {t("centre.currentlyServingTitle")}
                </span>
                <Badge variant={currentServing?.status === "SERVING" ? "warning" : "success"} size="sm">
                  {currentServing?.status === "SERVING" ? t("centre.activeBadge") : "Queued"}
                </Badge>
              </div>

              {currentServing ? (
                <div className="space-y-1.5 text-xs">
                  <h3 className="text-2xl font-black text-[#003366] dark:text-white font-mono tabular-nums">
                    Token #{currentServing.tokenNumber}
                  </h3>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {t("centre.farmerLabel")}: {currentServing.farmerName} {currentServing.isCurrentUser && (isHindi ? "(डेमो किसान)" : "(Demo User)")}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300">
                    {t("centre.lotLabel")}: <strong className="text-[#003366] dark:text-white">{formatCrop(currentServing.crop)}</strong> • {isHindi ? "मात्रा:" : "Quantity:"} <strong className="text-[#15803D] font-mono tabular-nums">{currentServing.quantityQuintals} {t("common.quintal")}</strong>
                  </p>
                  <p className="text-slate-600 dark:text-slate-300">
                    {t("centre.stationLabel")}: <strong className="text-[#003366] dark:text-[#38BDF8] font-bold">{getStageLabel(currentServing.stageName || "quality_inspection", isHindi)}</strong>
                  </p>
                </div>
              ) : (
                <div className="py-6 text-center text-slate-400">
                  {isHindi ? "कोई सक्रिय किसान नहीं है" : "No active farmer serving"}
                </div>
              )}

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex items-center gap-2">
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
            <Card padding="md" className="space-y-3 border-[#CBD5E1]">
              <div className="flex items-center justify-between pb-2 border-b border-[#CBD5E1] dark:border-slate-700">
                <span className="text-xs uppercase font-extrabold tracking-wider text-[#003366] dark:text-[#38BDF8]">
                  {t("centre.nextFarmerTitle")}
                </span>
                <Badge variant="neutral" size="sm">{t("centre.position1Badge")}</Badge>
              </div>

              {nextFarmer ? (
                <div className="space-y-1.5 text-xs">
                  <h3 className="text-2xl font-black text-slate-800 dark:text-white font-mono tabular-nums">
                    Token #{nextFarmer.tokenNumber}
                  </h3>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {t("centre.farmerLabel")}: {nextFarmer.farmerName} {nextFarmer.isCurrentUser && (isHindi ? "(डेमो किसान)" : "(Demo User)")}
                  </p>
                  <p className="text-slate-600 dark:text-slate-300">
                    {t("centre.lotLabel")}: <strong className="text-slate-800 dark:text-white">{formatCrop(nextFarmer.crop)}</strong> • {isHindi ? "मात्रा:" : "Quantity:"} <strong className="text-[#15803D] font-mono tabular-nums">{nextFarmer.quantityQuintals} {t("common.quintal")}</strong>
                  </p>
                  <p className="text-slate-500">
                    {t("centre.estInspection")}: ~{nextFarmer.estimatedProcessingMinutes || 8} {t("common.min")}
                  </p>
                </div>
              ) : (
                <div className="py-6 text-center text-slate-400">
                  {isHindi ? "कतार में अगला किसान नहीं है" : "No waiting farmer in queue"}
                </div>
              )}

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700">
                <Button
                  variant="secondary"
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

          {/* Queue Sequence Visual Strip */}
          <Card padding="md" className="space-y-2 border-[#CBD5E1]">
            <div className="flex items-center justify-between pb-1.5 border-b border-[#CBD5E1] dark:border-slate-700">
              <span className="text-xs uppercase font-extrabold tracking-wider text-[#003366] dark:text-[#38BDF8]">
                {t("centre.queueTimelineTitle")}
              </span>
              <span className="text-xs text-slate-500 font-mono">{t("centre.liveSequence")}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
              {currentServing && (
                <div className="px-2.5 py-1.5 rounded-2xs bg-[#FFFBEB] dark:bg-[#201505] border border-[#FDE68A] text-[#92400E] dark:text-[#FCD34D] font-mono tabular-nums font-bold flex items-center gap-1.5">
                  <span className="text-[10px] uppercase text-slate-500">{t("centre.servingPrefix")}</span>
                  <span>#{currentServing.tokenNumber}</span>
                </div>
              )}

              <span className="text-slate-400 font-bold">→</span>

              <div className="px-2.5 py-1.5 rounded-2xs bg-[#EFF6FF] dark:bg-[#0C2340] border border-[#BFDBFE] text-[#003366] dark:text-[#38BDF8] font-mono tabular-nums font-bold flex items-center gap-2">
                <span className="text-[10px] uppercase text-slate-500">{t("centre.nextPrefix")}</span>
                {queueItems.filter((q) => q.status === "WAITING").slice(0, 4).map((q) => (
                  <span key={q.id} className={q.isCurrentUser ? "underline decoration-[#003366] font-black" : ""}>
                    #{q.tokenNumber}
                  </span>
                ))}
              </div>

              <div className="ml-auto px-2.5 py-1 rounded-2xs bg-[#F0FDF4] dark:bg-[#062413] border border-[#86EFAC] text-[#15803D] dark:text-[#4ADE80] text-xs font-bold">
                {t("centre.onSchedule")}
              </div>
            </div>
          </Card>

        </div>

        {/* RIGHT 5 COLS: OFFICIAL INTAKE REGISTER TABLE */}
        <div className="lg:col-span-5 space-y-4">
          <div className="border border-[#CBD5E1] dark:border-slate-700 bg-white dark:bg-[#131D28] rounded-xs overflow-hidden shadow-xs">
            <div className="p-3 bg-[#003366] text-white flex items-center justify-between">
              <span className="text-xs uppercase font-bold tracking-wider">
                {t("centre.todayIntakeLog")}
              </span>
              <span className="text-xs text-[#FF9933] font-mono">{queueItems.length} {t("centre.recordsCount")}</span>
            </div>

            <div className="overflow-x-auto max-h-[480px]">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#CBD5E1] dark:border-slate-700 bg-[#F1F5F9] dark:bg-[#0E1620] text-[11px] font-bold text-[#003366] dark:text-[#38BDF8] uppercase">
                    <th className="py-2.5 px-3">{t("centre.tableToken")}</th>
                    <th className="py-2.5 px-3">{t("centre.tableFarmer")}</th>
                    <th className="py-2.5 px-3">{t("centre.tableStage")}</th>
                    <th className="py-2.5 px-3">{t("centre.tableStatus")}</th>
                    <th className="py-2.5 px-3 text-right">{t("centre.tableAction")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                  {queueItems.map((row) => {
                    const isServingRow = row.status === "SERVING";
                    const isHighlighted = isItemHighlighted(row.id);

                    return (
                      <tr
                        key={row.id}
                        className={`${
                          isHighlighted
                            ? "bg-amber-50 dark:bg-amber-950/40"
                            : isServingRow
                            ? "bg-[#FFFBEB] dark:bg-[#201505] font-semibold"
                            : "hover:bg-slate-50 dark:hover:bg-slate-800/50"
                        }`}
                      >
                        <td className="py-2 px-3 font-mono tabular-nums font-bold text-[#003366] dark:text-[#38BDF8]">
                          <span className={row.isCurrentUser ? "text-[#15803D] font-black" : ""}>
                            #{row.tokenNumber}
                          </span>
                        </td>
                        <td className="py-2 px-3 text-slate-900 dark:text-white font-medium">
                          {row.farmerName} {row.isCurrentUser && (isHindi ? "(आप)" : "(You)")}
                        </td>
                        <td className="py-2 px-3 text-slate-600 dark:text-slate-300">
                          {getStageLabel(row.stageName || "quality_inspection", isHindi)}
                        </td>
                        <td className="py-2 px-3">
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
                        <td className="py-2 px-3 text-right">
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
                            <span className="text-[11px] text-[#15803D] font-bold uppercase">
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
          </div>
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