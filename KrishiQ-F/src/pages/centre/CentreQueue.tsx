import React, { useState } from "react";
import { useKrishiQ } from "../../context/KrishiQContext";
import { OperatorQueueRow } from "../../components/centre/OperatorQueueRow";
import { QualityGradingModal } from "../../components/centre/QualityGradingModal";
import { ListOrdered, PhoneCall, Search } from "lucide-react";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";

export const CentreQueue: React.FC = () => {
  const {
    selectedCentre,
    queueItems,
    callNextFarmer,
    startProcessingItem,
    completeProcessingItem,
  } = useKrishiQ();

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

  const handleQCSubmit = (data: any) => {
    if (activeQCItemId) {
      completeProcessingItem(activeQCItemId);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 px-1">
      
      <div className="flex flex-wrap items-center justify-between gap-4 pb-1">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Procurement Centre Live Queue
          </h1>
          <p className="text-sm text-slate-600 font-medium">
            Active gate arrival and station queue for {selectedCentre.name}.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="primary"
            size="md"
            leftIcon={<PhoneCall className="w-4 h-4" />}
            onClick={callNextFarmer}
          >
            Call Next Token
          </Button>
        </div>
      </div>

      <Card padding="none" className="border-slate-300 overflow-hidden">
        <div className="p-3.5 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 bg-slate-50">
          
          <div className="flex items-center gap-1 text-xs">
            {(["all", "WAITING", "SERVING", "COMPLETED"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={
                  "px-3 py-1 rounded font-semibold transition-colors cursor-pointer " +
                  (filter === tab
                    ? "bg-emerald-800 text-white font-bold"
                    : "text-slate-700 hover:bg-slate-200")
                }
              >
                {tab === "all" ? "All Tokens" : tab === "WAITING" ? "Waiting" : tab === "SERVING" ? "Now Serving" : "Completed"}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search token, name, village..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded border border-slate-300 bg-white text-slate-800"
            />
          </div>

        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold text-slate-600 uppercase">
                <th className="py-2.5 px-4">Token</th>
                <th className="py-2.5 px-4">Farmer Details</th>
                <th className="py-2.5 px-4">Declared Lot</th>
                <th className="py-2.5 px-4">Current Stage</th>
                <th className="py-2.5 px-4">Status</th>
                <th className="py-2.5 px-4">Est. Processing</th>
                <th className="py-2.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
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