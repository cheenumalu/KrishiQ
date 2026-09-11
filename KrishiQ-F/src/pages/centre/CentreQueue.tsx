import React, { useState } from "react";
import { useKrishiQ } from "../../context/KrishiQContext";
import { useLanguage } from "../../i18n";
import { OperatorQueueRow } from "../../components/centre/OperatorQueueRow";
import { QualityGradingModal } from "../../components/centre/QualityGradingModal";
import { AuditTrailModal } from "../../components/common/AuditTrailModal";
import { PhoneCall, Search, Radio } from "lucide-react";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";

export const CentreQueue: React.FC = () => {
  const {
    selectedCentre,
    queueItems,
    callNextFarmer,
    advanceBookingStage,
    updateQualityAndWeight,
    isRealtimeConnected,
  } = useKrishiQ();

  const { isHindi, formatLocation } = useLanguage();
  const [filter, setFilter] = useState<"all" | "WAITING" | "SERVING" | "COMPLETED">("all");
  const [search, setSearch] = useState("");
  const [isQCModalOpen, setIsQCModalOpen] = useState(false);
  const [activeQCItemId, setActiveQCItemId] = useState<string | null>(null);
  const [auditModalToken, setAuditModalToken] = useState<string | null>(null);

  const filteredItems = queueItems.filter((item) => {
    const matchesFilter = filter === "all" || item.status === filter;
    const matchesSearch =
      item.farmerName.toLowerCase().includes(search.toLowerCase()) ||
      item.tokenNumber.toLowerCase().includes(search.toLowerCase()) ||
      item.village.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleStartGateIntake = (id: string) => {
    advanceBookingStage(id, "gate_verification");
  };

  const handleOpenQCModal = (id: string) => {
    setActiveQCItemId(id);
    setIsQCModalOpen(true);
  };

  const handleAdvanceStage = (id: string) => {
    advanceBookingStage(id);
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
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 px-1">
      {/* Page Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-1 border-b border-[#E4E9E5] dark:border-[#23362B]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#17211B] dark:text-[#F0F5F1] tracking-tight">
              {isHindi ? "उपार्जन केंद्र लाइव कतार" : "Procurement Centre Live Queue"}
            </h1>
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 animate-pulse">
              <Radio className="w-3 h-3" />
              <span>{isRealtimeConnected ? "Live Subscribed" : "Live Demo"}</span>
            </span>
          </div>
          <p className="text-sm text-[#66736B] dark:text-[#9EAEA4] font-medium">
            {isHindi
              ? `${formatLocation(selectedCentre.name)} के लिए वास्तविक समय कतार एवं 8-चरणीय उपार्जन नियंत्रण।`
              : `Real-time intake stream and 8-stage operational control for ${selectedCentre.name}.`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="md"
            leftIcon={<PhoneCall className="w-4 h-4" />}
            onClick={callNextFarmer}
          >
            {isHindi ? "अगला टोकन बुलाएँ" : "Call Next Token"}
          </Button>
        </div>
      </div>

      {/* Main Queue Table Card */}
      <Card padding="none" className="border-[#E4E9E5] dark:border-[#23362B] card-shadow overflow-hidden">
        {/* Table Toolbar */}
        <div className="p-3.5 border-b border-[#E4E9E5] dark:border-[#23362B] flex flex-wrap items-center justify-between gap-3 bg-[#F6F8F4] dark:bg-[#101B15]">
          <div className="flex items-center gap-1 text-xs">
            {(["all", "WAITING", "SERVING", "COMPLETED"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={
                  "px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer " +
                  (filter === tab
                    ? "bg-[#123D2D] text-white font-bold shadow-xs"
                    : "text-[#66736B] dark:text-[#9EAEA4] hover:bg-[#EEF5EF] dark:hover:bg-[#1A3125]")
                }
              >
                {tab === "all"
                  ? (isHindi ? "सभी टोकन" : "All Tokens")
                  : tab === "WAITING"
                  ? (isHindi ? "प्रतीक्षा में" : "Waiting")
                  : tab === "SERVING"
                  ? (isHindi ? "सेवा में (Active)" : "Now Serving")
                  : (isHindi ? "पूर्ण" : "Completed")}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-[#8A958E] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={isHindi ? "किसान नाम या टोकन खोजें..." : "Search farmer or token..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-[#E4E9E5] dark:border-[#23362B] bg-white dark:bg-[#142019] text-xs text-[#17211B] dark:text-[#F0F5F1] placeholder-[#8A958E]"
            />
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#EEF5EF] dark:bg-[#16271E] border-b border-[#E4E9E5] dark:border-[#23362B] text-[11px] font-bold text-[#123D2D] dark:text-[#52DB89] uppercase tracking-wider">
                <th className="py-3 px-4">{isHindi ? "टोकन संख्या" : "Token Code"}</th>
                <th className="py-3 px-4">{isHindi ? "किसान एवं गाँव" : "Farmer & Village"}</th>
                <th className="py-3 px-4">{isHindi ? "फसल / मात्रा" : "Crop / Lot Size"}</th>
                <th className="py-3 px-4">{isHindi ? "उपार्जन चरण" : "Procurement Stage"}</th>
                <th className="py-3 px-4">{isHindi ? "स्थिति" : "Status"}</th>
                <th className="py-3 px-4">{isHindi ? "अनुमानित समय" : "Est. Wait"}</th>
                <th className="py-3 px-4 text-right">{isHindi ? "कार्यवाही" : "Operator Actions"}</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-[#8A958E]">
                    <p className="font-semibold">{isHindi ? "कोई टोकन नहीं मिला" : "No tokens found for current filter."}</p>
                    <p className="text-[11px] mt-1">{isHindi ? "नए किसान स्लॉट बुक करते ही यहाँ स्वतः प्रदर्शित होंगे।" : "New farmer bookings will appear automatically without refresh."}</p>
                  </td>
                </tr>
              ) : (
                filteredItems.map((item) => (
                  <OperatorQueueRow
                    key={item.id}
                    item={item}
                    onStartProcessing={handleStartGateIntake}
                    onOpenQCModal={handleOpenQCModal}
                    onAdvanceStage={handleAdvanceStage}
                    onOpenAudit={(tok) => setAuditModalToken(tok)}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Quality Grading Modal */}
      <QualityGradingModal
        isOpen={isQCModalOpen}
        onClose={() => {
          setIsQCModalOpen(false);
          setActiveQCItemId(null);
        }}
        onSubmit={handleQCSubmit}
      />

      {/* Audit Trail Modal */}
      <AuditTrailModal
        isOpen={Boolean(auditModalToken)}
        onClose={() => setAuditModalToken(null)}
        bookingToken={auditModalToken || undefined}
      />
    </div>
  );
};
