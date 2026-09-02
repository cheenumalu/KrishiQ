import React, { useState } from "react";
import { useKrishiQ } from "../../context/KrishiQContext";
import { useLanguage } from "../../i18n";
import { OperatorQueueRow } from "../../components/centre/OperatorQueueRow";
import { QualityGradingModal } from "../../components/centre/QualityGradingModal";
import { PhoneCall, Search } from "lucide-react";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";

export const CentreQueue: React.FC = () => {
  const {
    selectedCentre,
    queueItems,
    callNextFarmer,
    completeProcessingItem,
  } = useKrishiQ();

  const { t, isHindi, formatLocation } = useLanguage();
  const [filter, setFilter] = useState<"all" | "WAITING" | "SERVING" | "COMPLETED">("all");
  const [search, setSearch] = useState("");
  const [isQCModalOpen, setIsQCModalOpen] = useState(false);
  const [activeQCItemId, setActiveQCItemId] = useState<string | null>(null);

  const filteredItems = queueItems.filter((item) => {
    const matchesFilter = filter === "all" || item.status === filter;
    const matchesSearch =
      item.farmerName.toLowerCase().includes(search.toLowerCase()) ||
      item.tokenNumber.toLowerCase().includes(search.toLowerCase()) ||
      item.village.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleStartQC = (id: string) => {
    setActiveQCItemId(id);
    setIsQCModalOpen(true);
  };

  const handleQCSubmit = (_data: any) => {
    if (activeQCItemId) {
      completeProcessingItem(activeQCItemId);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 px-1">
      
      <div className="flex flex-wrap items-center justify-between gap-4 pb-1 border-b border-[#E4E9E5]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#17211B] tracking-tight">
            {isHindi ? "उपार्जन केंद्र लाइव कतार" : "Procurement Centre Live Queue"}
          </h1>
          <p className="text-sm text-[#66736B] font-medium">
            {isHindi
              ? `${formatLocation(selectedCentre.name)} के लिए सक्रिय गेट आवक एवं स्टेशन कतार।`
              : `Active gate arrival and station queue for ${selectedCentre.name}.`}
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

      <Card padding="none" className="border-[#E4E9E5] card-shadow overflow-hidden">
        <div className="p-3.5 border-b border-[#E4E9E5] flex flex-wrap items-center justify-between gap-3 bg-[#F6F8F4]">
          
          <div className="flex items-center gap-1 text-xs">
            {(["all", "WAITING", "SERVING", "COMPLETED"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={
                  "px-3 py-1 rounded-xl font-semibold transition-colors cursor-pointer " +
                  (filter === tab
                    ? "bg-[#123D2D] text-white font-bold"
                    : "text-[#66736B] hover:bg-[#EEF5EF]")
                }
              >
                {tab === "all"
                  ? (isHindi ? "सभी टोकन" : "All Tokens")
                  : tab === "WAITING"
                  ? (isHindi ? "प्रतीक्षा में" : "Waiting")
                  : tab === "SERVING"
                  ? (isHindi ? "अभी सेवा में" : "Now Serving")
                  : (isHindi ? "पूर्ण" : "Completed")}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-[#8A958E] absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={isHindi ? "टोकन, किसान, गाँव खोजें..." : "Search token, name, village..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl border border-[#E4E9E5] bg-white text-[#17211B] focus:outline-none focus:ring-2 focus:ring-[#2F7D4A]/30"
            />
          </div>

        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-[#E4E9E5] bg-[#F6F8F4] text-[11px] font-bold text-[#66736B] uppercase">
                <th className="py-2.5 px-4">{t("centre.tableToken")}</th>
                <th className="py-2.5 px-4">{isHindi ? "किसान विवरण" : "Farmer Details"}</th>
                <th className="py-2.5 px-4">{isHindi ? "घोषित उपज" : "Declared Lot"}</th>
                <th className="py-2.5 px-4">{isHindi ? "वर्तमान चरण" : "Current Stage"}</th>
                <th className="py-2.5 px-4">{t("centre.tableStatus")}</th>
                <th className="py-2.5 px-4">{isHindi ? "अनुमानित समय" : "Est. Processing"}</th>
                <th className="py-2.5 px-4 text-right">{t("centre.tableAction")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4E9E5]">
              {filteredItems.map((item) => (
                <OperatorQueueRow
                  key={item.id}
                  item={item}
                  onCallNext={() => callNextFarmer()}
                  onStartProcessing={(id) => handleStartQC(id)}
                  onCompleteProcessing={(id) => completeProcessingItem(id)}
                />
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <QualityGradingModal
        isOpen={isQCModalOpen}
        onClose={() => setIsQCModalOpen(false)}
        onSubmit={handleQCSubmit}
      />

    </div>
  );
};