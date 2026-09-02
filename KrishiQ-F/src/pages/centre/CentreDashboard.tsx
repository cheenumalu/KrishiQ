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
  Activity
} from "lucide-react";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";

export const CentreDashboard: React.FC = () => {
  const { selectedCentre, addToast } = useKrishiQ();
  const { t, isHindi, formatLocation, formatCrop } = useLanguage();
  const [isBottleneckResolved, setIsBottleneckResolved] = useState(false);

  // Workstation state
  const [currentServing, setCurrentServing] = useState({
    token: "Token A124",
    tokenRaw: "A124",
    farmer: "Rajesh Kumar",
    farmerHi: "राजेश कुमार",
    crop: "Wheat",
    quantity: 42,
    stage: "Weighing Station 1",
    stageHi: "तौल कांटा नंबर 1",
    estimatedCompletion: "6 minutes",
  });

  const [nextFarmer, setNextFarmer] = useState({
    token: "Token A125",
    tokenRaw: "A125",
    farmer: "Suresh Patil",
    farmerHi: "सुरेश पाटिल",
    crop: "Wheat",
    quantity: 28,
    estimatedProcessing: "8 minutes",
    called: false,
  });

  const [queueTable, setQueueTable] = useState([
    { token: "A124", farmer: "Rajesh Kumar", farmerHi: "राजेश कुमार", crop: "Wheat", quantity: 42, arrival: "10:15 AM", currentStage: "Weighing", currentStageHi: "तौल", status: "Processing" },
    { token: "A125", farmer: "Suresh Patil", farmerHi: "सुरेश पाटिल", crop: "Wheat", quantity: 28, arrival: "10:28 AM", currentStage: "Quality Check", currentStageHi: "गुणवत्ता जाँच", status: "Waiting" },
    { token: "A126", farmer: "Vikram Verma", farmerHi: "विक्रम वर्मा", crop: "Soybean", quantity: 55, arrival: "10:35 AM", currentStage: "Registration", currentStageHi: "पंजीकरण", status: "Waiting" },
    { token: "A127", farmer: "Rajesh Malviya", farmerHi: "राजेश मालवीय", crop: "Wheat", quantity: 65, arrival: "10:45 AM", currentStage: "Registration", currentStageHi: "पंजीकरण", status: "Waiting" },
    { token: "A123", farmer: "Om Prakash", farmerHi: "ओम प्रकाश", crop: "Maize", quantity: 36, arrival: "09:50 AM", currentStage: "Procurement", currentStageHi: "उपार्जन", status: "Completed" },
  ]);

  const handleCompleteStage = () => {
    const completedToken = currentServing.tokenRaw;
    setQueueTable((prev) =>
      prev.map((row) => (row.token === completedToken ? { ...row, status: "Completed", currentStage: "Procurement", currentStageHi: "उपार्जन" } : row))
    );

    setCurrentServing({
      token: "Token A125",
      tokenRaw: "A125",
      farmer: "Suresh Patil",
      farmerHi: "सुरेश पाटिल",
      crop: "Wheat",
      quantity: 28,
      stage: "Weighing Station 1",
      stageHi: "तौल कांटा नंबर 1",
      estimatedCompletion: "5 minutes",
    });

    setNextFarmer({
      token: "Token A126",
      tokenRaw: "A126",
      farmer: "Vikram Verma",
      farmerHi: "विक्रम वर्मा",
      crop: "Soybean",
      quantity: 55,
      estimatedProcessing: "10 minutes",
      called: false,
    });

    addToast(
      isHindi ? "चरण पूर्ण" : "Stage Completed",
      isHindi ? `टोकन ${completedToken} का तौल पूरा हुआ। टोकन A125 अब सक्रिय है।` : `Token ${completedToken} completed weighing. Token A125 now active.`,
      "success"
    );
  };

  const handleCallFarmer = () => {
    setNextFarmer((prev) => ({ ...prev, called: true }));
    setQueueTable((prev) =>
      prev.map((row) => (row.token === nextFarmer.tokenRaw ? { ...row, status: "Called" } : row))
    );
    addToast(
      isHindi ? "किसान को बुलाया गया" : "Farmer Called",
      isHindi ? `${nextFarmer.token} (${isHindi ? nextFarmer.farmerHi : nextFarmer.farmer}) को काउंटर पर बुलाया गया।` : `${nextFarmer.token} (${nextFarmer.farmer}) called to counter.`,
      "info"
    );
  };

  const handleApplyBottleneck = () => {
    setIsBottleneckResolved(true);
    addToast(
      isHindi ? "स्टाफ पुनर्वितरित" : "Staff Rebalanced",
      isHindi ? "कर्मचारी तौल कांटे पर तैनात। कतार की समस्या हल हो गई।" : "Operator shifted to Weighing. Queue backlog resolved.",
      "success"
    );
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
            {isHindi ? "1,360 / 2,000 यूनिट (68%)" : "1,360 / 2,000 Units (68%)"}
          </div>
          <div className="w-40 h-1.5 bg-white/20 rounded-full overflow-hidden mt-1">
            <div className="h-full bg-[#58A66B] rounded-full" style={{ width: "68%" }} />
          </div>
        </div>
      </div>

      {/* 2. OPERATIONAL KPI STRIP */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card padding="sm" className="h-[124px] p-[18px_20px] flex flex-col justify-between">
          <div className="flex items-center gap-2 text-[#66736B]">
            <Building2 className="w-4.5 h-4.5 text-[#2F7D4A] shrink-0" />
            <span className="text-[13px] font-medium leading-[1.3]">{t("centre.todayBookings")}</span>
          </div>
          <div className="text-[30px] font-bold tracking-[-0.02em] leading-none text-[#17211B] tabular-nums font-sans">
            148
          </div>
          <span className="text-[12px] text-[#2F7D4A] font-semibold">{t("centre.checkedInRate")}</span>
        </Card>

        <Card padding="sm" className="h-[124px] p-[18px_20px] flex flex-col justify-between">
          <div className="flex items-center gap-2 text-[#66736B]">
            <Users className="w-4.5 h-4.5 text-[#2F7D4A] shrink-0" />
            <span className="text-[13px] font-medium leading-[1.3]">{t("centre.currentQueueCount")}</span>
          </div>
          <div className="text-[30px] font-bold tracking-[-0.02em] leading-none text-[#9A6210] tabular-nums font-sans">
            {isBottleneckResolved ? 11 : selectedCentre.currentQueueCount}
          </div>
          <span className="text-[12px] text-[#66736B]">{t("centre.farmersWaiting")}</span>
        </Card>

        <Card padding="sm" className="h-[124px] p-[18px_20px] flex flex-col justify-between">
          <div className="flex items-center gap-2 text-[#66736B]">
            <Clock className="w-4.5 h-4.5 text-[#2F7D4A] shrink-0" />
            <span className="text-[13px] font-medium leading-[1.3]">{t("centre.avgWaitTime")}</span>
          </div>
          <div className="text-[30px] font-bold tracking-[-0.02em] leading-none text-[#17211B] tabular-nums font-sans">
            {isBottleneckResolved ? `22 ${t("common.min")}` : `42 ${t("common.min")}`}
          </div>
          <span className="text-[12px] text-[#2F7D4A] font-semibold">{t("centre.vsYesterday")}</span>
        </Card>

        <Card padding="sm" className="h-[124px] p-[18px_20px] flex flex-col justify-between bg-[#EEF5EF] border-[#58A66B]/30">
          <div className="flex items-center gap-2 text-[#123D2D]">
            <Activity className="w-4.5 h-4.5 text-[#2F7D4A] shrink-0" />
            <span className="text-[13px] font-semibold leading-[1.3]">{t("centre.todayProcurement")}</span>
          </div>
          <div className="text-[30px] font-bold tracking-[-0.02em] leading-none text-[#123D2D] tabular-nums font-sans">
            3,240 {t("common.quintal")}
          </div>
          <span className="text-[12px] text-[#2F7D4A] font-medium">61 {t("centre.receiptsCleared")}</span>
        </Card>
      </div>

      {/* 3. BOTTLENECK ALERT ADVISORY STRIP */}
      {!isBottleneckResolved ? (
        <Card padding="sm" className="p-[16px_20px] bg-[#FEF5E7] border border-[#F2A93B]/40 text-xs text-[#9A6210] flex flex-wrap items-center justify-between gap-3 border-l-4 border-l-[#F2A93B]">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-[#F2A93B] shrink-0" />
            <div>
              <div className="font-bold text-[14px] text-[#17211B]">{t("centre.bottleneckAdvisoryTitle")}</div>
              <p className="text-[#66736B] text-[13px] mt-0.5">{t("centre.bottleneckAdvisoryDesc")}</p>
            </div>
          </div>
          <Button variant="accent" size="sm" onClick={handleApplyBottleneck}>
            {t("centre.shiftOperatorAction")}
          </Button>
        </Card>
      ) : (
        <div className="p-3 rounded-xl bg-[#EEF5EF] border border-[#58A66B]/30 text-xs text-[#123D2D] font-medium flex items-center justify-between">
          <span className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#2F7D4A]" />
            {t("centre.bottleneckResolvedText")}
          </span>
          <span className="font-bold text-[#2F7D4A]">{t("centre.optimalFlow")}</span>
        </div>
      )}

      {/* 4. WORKSTATION CARDS & QUEUE TIMELINE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* LEFT 7 COLS: WORKSTATION CARDS */}
        <div className="lg:col-span-7 space-y-4">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Active Serving Card */}
            <Card padding="md" className="space-y-3 border-[#2F7D4A] ring-1 ring-[#2F7D4A]/20">
              <div className="flex items-center justify-between pb-2 border-b border-[#E4E9E5]">
                <span className="text-xs uppercase font-extrabold tracking-wider text-[#123D2D]">
                  {t("centre.currentlyServingTitle")}
                </span>
                <Badge variant="warning" size="sm">{t("centre.activeBadge")}</Badge>
              </div>

              <div className="space-y-1.5 text-xs">
                <h3 className="text-2xl font-bold text-[#17211B] font-sans tabular-nums">
                  {currentServing.token}
                </h3>
                <p className="text-sm font-bold text-[#17211B]">
                  {t("centre.farmerLabel")}: {isHindi ? currentServing.farmerHi : currentServing.farmer}
                </p>
                <p className="text-[#66736B]">
                  {t("centre.lotLabel")}: <strong className="text-[#17211B]">{formatCrop(currentServing.crop)}</strong> • {isHindi ? "मात्रा:" : "Quantity:"} <strong className="text-[#17211B] font-sans tabular-nums">{currentServing.quantity} {t("common.quintal")}</strong>
                </p>
                <p className="text-[#66736B]">
                  {t("centre.stationLabel")}: <strong className="text-[#123D2D] font-semibold">{isHindi ? currentServing.stageHi : currentServing.stage}</strong>
                </p>
              </div>

              <div className="pt-2 border-t border-[#E4E9E5]">
                <Button
                  variant="primary"
                  size="md"
                  className="w-full"
                  leftIcon={<CheckCircle2 className="w-4 h-4" />}
                  onClick={handleCompleteStage}
                >
                  {t("centre.completeStageBtn")}
                </Button>
              </div>
            </Card>

            {/* Next Farmer Card */}
            <Card padding="md" className="space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#E4E9E5]">
                <span className="text-xs uppercase font-extrabold tracking-wider text-[#123D2D]">
                  {t("centre.nextFarmerTitle")}
                </span>
                <Badge variant="neutral" size="sm">{t("centre.position1Badge")}</Badge>
              </div>

              <div className="space-y-1.5 text-xs">
                <h3 className="text-2xl font-bold text-[#17211B] font-sans tabular-nums">
                  {nextFarmer.token}
                </h3>
                <p className="text-sm font-bold text-[#17211B]">
                  {t("centre.farmerLabel")}: {isHindi ? nextFarmer.farmerHi : nextFarmer.farmer}
                </p>
                <p className="text-[#66736B]">
                  {t("centre.lotLabel")}: <strong className="text-[#17211B]">{formatCrop(nextFarmer.crop)}</strong> • {isHindi ? "मात्रा:" : "Quantity:"} <strong className="text-[#17211B] font-sans tabular-nums">{nextFarmer.quantity} {t("common.quintal")}</strong>
                </p>
                <p className="text-[#8A958E]">
                  {t("centre.estInspection")}: {isHindi ? "8 मिनट" : nextFarmer.estimatedProcessing}
                </p>
              </div>

              <div className="pt-2 border-t border-[#E4E9E5]">
                <Button
                  variant={nextFarmer.called ? "secondary" : "primary"}
                  size="md"
                  className="w-full"
                  leftIcon={<PhoneCall className="w-4 h-4" />}
                  onClick={handleCallFarmer}
                >
                  {nextFarmer.called ? t("centre.callAgainBtn") : t("centre.callNextBtn")}
                </Button>
              </div>
            </Card>

          </div>

          {/* Queue Timeline Visual */}
          <Card padding="md" className="space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-[#E4E9E5]">
              <span className="text-xs uppercase font-extrabold tracking-wider text-[#123D2D]">
                {t("centre.queueTimelineTitle")}
              </span>
              <span className="text-xs text-[#66736B]">{t("centre.liveSequence")}</span>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 text-xs pt-0.5">
              <div className="p-2.5 rounded-xl bg-[#FEF5E7] border border-[#F2A93B]/40 text-[#9A6210] font-sans tabular-nums font-bold flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider text-[#66736B]">{t("centre.servingPrefix")}</span>
                <span>KQ-018</span>
              </div>

              <span className="text-[#8A958E]">→</span>

              <div className="p-2.5 rounded-xl bg-[#EEF5EF] border border-[#58A66B]/30 text-[#123D2D] font-sans tabular-nums font-bold flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider text-[#66736B]">{t("centre.nextPrefix")}</span>
                <span>KQ-019</span>
                <span>KQ-020</span>
                <span>KQ-021</span>
              </div>

              <div className="ml-auto px-3 py-1 rounded-full bg-[#EEF5EF] text-[#2F7D4A] text-xs font-semibold">
                {t("centre.onSchedule")}
              </div>
            </div>
          </Card>

        </div>

        {/* RIGHT 5 COLS: OPERATIONAL TABLE */}
        <div className="lg:col-span-5 space-y-4">
          <Card padding="none" className="overflow-hidden">
            <div className="p-3.5 bg-[#F6F8F4] border-b border-[#E4E9E5] flex items-center justify-between">
              <span className="text-xs uppercase font-extrabold tracking-wider text-[#123D2D]">
                {t("centre.todayIntakeLog")}
              </span>
              <span className="text-xs text-[#66736B]">{queueTable.length} {t("centre.recordsCount")}</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-[#E4E9E5] bg-[#F6F8F4] text-[11px] font-bold text-[#66736B] uppercase">
                    <th className="py-2.5 px-3">{t("centre.tableToken")}</th>
                    <th className="py-2.5 px-3">{t("centre.tableFarmer")}</th>
                    <th className="py-2.5 px-3">{t("centre.tableStage")}</th>
                    <th className="py-2.5 px-3">{t("centre.tableStatus")}</th>
                    <th className="py-2.5 px-3 text-right">{t("centre.tableAction")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E4E9E5]">
                  {queueTable.map((row) => {
                    const isCurrent = row.token === currentServing.tokenRaw;

                    return (
                      <tr key={row.token} className={isCurrent ? "bg-[#EEF5EF]/60 font-semibold" : "hover:bg-[#F6F8F4]"}>
                        <td className="py-2.5 px-3 font-sans tabular-nums font-bold text-[#17211B]">{row.token}</td>
                        <td className="py-2.5 px-3 text-[#17211B]">{isHindi ? row.farmerHi : row.farmer}</td>
                        <td className="py-2.5 px-3 text-[#66736B]">{isHindi ? row.currentStageHi : row.currentStage}</td>
                        <td className="py-2.5 px-3">
                          <Badge
                            size="sm"
                            variant={
                              row.status === "Processing"
                                ? "warning"
                                : row.status === "Completed"
                                ? "success"
                                : row.status === "Called"
                                ? "info"
                                : "neutral"
                            }
                          >
                            {row.status === "Processing"
                              ? t("centre.statusProcessing")
                              : row.status === "Completed"
                              ? t("centre.statusCompleted")
                              : row.status === "Called"
                              ? t("centre.statusCalled")
                              : t("centre.statusWaiting")}
                          </Badge>
                        </td>
                        <td className="py-2.5 px-3 text-right">
                          {row.status === "Waiting" && (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => {
                                setQueueTable((prev) =>
                                  prev.map((r) => (r.token === row.token ? { ...r, status: "Called" } : r))
                                );
                                addToast(
                                  isHindi ? "बुलाया गया" : "Called",
                                  isHindi ? `${row.token} को काउंटर पर बुलाया गया।` : `${row.token} called to counter.`,
                                  "info"
                                );
                              }}
                            >
                              {t("centre.callAction")}
                            </Button>
                          )}
                          {row.status === "Called" && (
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => {
                                setQueueTable((prev) =>
                                  prev.map((r) => (r.token === row.token ? { ...r, status: "Processing" } : r))
                                );
                              }}
                            >
                              {t("centre.startAction")}
                            </Button>
                          )}
                          {row.status === "Processing" && (
                            <Button variant="primary" size="sm" onClick={handleCompleteStage}>
                              {t("centre.completeAction")}
                            </Button>
                          )}
                          {row.status === "Completed" && (
                            <span className="text-[11px] text-[#2F7D4A] font-bold">{t("centre.doneBadge")}</span>
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

    </div>
  );
};