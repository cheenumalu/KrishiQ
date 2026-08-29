import React from "react";
import { useKrishiQ } from "../../context/KrishiQContext";
import { CentreStatusTable } from "../../components/admin/CentreStatusTable";
import { Building2 } from "lucide-react";
import { Card } from "../../components/common/Card";

export const AdminCentres: React.FC = () => {
  const { centres } = useKrishiQ();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 px-1">
      <div className="pb-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Procurement Centres Network Directory
        </h1>
        <p className="text-sm text-slate-600 font-medium">
          Authorized APMC procurement centres, active counters, and real-time handling loads.
        </p>
      </div>

      <div className="space-y-3">
        <CentreStatusTable centres={centres} />
      </div>
    </div>
  );
};