import React, { useState } from "react";
import { ProcurementCentre } from "../../types";
import { formatQuintals } from "../../utils/calculations";
import { Building2, Clock, Users, ArrowUpRight, Search } from "lucide-react";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";

interface CentreStatusTableProps {
  centres: ProcurementCentre[];
  onSelectCentre?: (id: string) => void;
}

export const CentreStatusTable: React.FC<CentreStatusTableProps> = ({
  centres,
  onSelectCentre,
}) => {
  const [filter, setFilter] = useState<"all" | "normal" | "warning" | "critical">("all");
  const [search, setSearch] = useState("");

  const filteredCentres = centres.filter((c) => {
    const matchesFilter = filter === "all" || c.status === filter;
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.district.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="bg-white rounded-2xl border border-[#E5EAE6] card-shadow overflow-hidden">
      
      {/* Table Header Filter Toolbar */}
      <div className="p-4 border-b border-[#E5EAE6] flex flex-wrap items-center justify-between gap-3 bg-[#F6F8F4]">
        
        <div className="flex items-center gap-1 bg-[#EEF5EF] p-1 rounded-xl border border-[#58A66B]/30">
          {(["all", "normal", "warning", "critical"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={
                "px-3 py-1 rounded-lg text-xs font-semibold capitalize transition-all cursor-pointer " +
                (filter === tab
                  ? "bg-white text-[#123D2D] shadow-xs font-bold"
                  : "text-[#66736B] hover:text-[#17211B]")
              }
            >
              {tab === "all" ? "All Mandis" : tab}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-[#8A958E] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Mandi or district..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-[#E5EAE6] bg-white text-[#17211B] focus:outline-none focus:ring-2 focus:ring-[#2F7D4A]/30"
          />
        </div>

      </div>

      {/* Table Body */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-[#E5EAE6] bg-[#F6F8F4] text-[11px] font-bold text-[#66736B] uppercase tracking-wider">
              <th className="py-3 px-4">Procurement Centre</th>
              <th className="py-3 px-4">District</th>
              <th className="py-3 px-4">Active Queue</th>
              <th className="py-3 px-4">Capacity Load</th>
              <th className="py-3 px-4">Predicted Wait</th>
              <th className="py-3 px-4">Today Procured</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E5EAE6]">
            {filteredCentres.map((centre) => {
              const statusVariant = centre.status === "critical" ? "critical" : centre.status === "warning" ? "warning" : "normal";

              return (
                <tr key={centre.id} className="hover:bg-[#F6F8F4] transition-colors">
                  
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-[#17211B]">{centre.name}</div>
                    <div className="text-[11px] text-[#66736B] font-mono">{centre.code} • {centre.activeCounters} Counters Active</div>
                  </td>

                  <td className="py-3.5 px-4 text-[#66736B] font-medium">{centre.district}</td>

                  <td className="py-3.5 px-4 font-mono font-bold text-[#17211B]">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-[#8A958E]" />
                      {centre.currentQueueCount} farmers
                    </span>
                  </td>

                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-[#EEF5EF] rounded-full h-2 overflow-hidden">
                        <div
                          className={
                            "h-2 rounded-full " +
                            (centre.utilizationPercent > 100
                              ? "bg-[#D95555]"
                              : centre.utilizationPercent > 75
                              ? "bg-[#F2A93B]"
                              : "bg-[#2F7D4A]")
                          }
                          style={{ width: Math.min(100, centre.utilizationPercent) + "%" }}
                        />
                      </div>
                      <span className="font-mono font-bold text-[#17211B]">{centre.utilizationPercent}%</span>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono font-bold text-[#17211B]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-[#8A958E]" />
                      {centre.predictedWaitMinutes} min
                    </span>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[#2F7D4A] font-bold">
                    {formatQuintals(centre.todayProcuredQuintals)}
                  </td>

                  <td className="py-3.5 px-4">
                    <Badge variant={statusVariant} dot>
                      {centre.status.toUpperCase()}
                    </Badge>
                  </td>

                  <td className="py-3.5 px-4 text-right">
                    {onSelectCentre && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onSelectCentre(centre.id)}
                      >
                        Inspect
                      </Button>
                    )}
                  </td>

                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};