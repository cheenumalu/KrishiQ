import React from "react";
import { useKrishiQ } from "../../context/KrishiQContext";
import { useLanguage } from "../../i18n";
import { CentreStatusTable } from "../../components/admin/CentreStatusTable";

export const AdminCentres: React.FC = () => {
  const { centres } = useKrishiQ();
  const { isHindi } = useLanguage();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 px-1">
      <div className="pb-1 border-b border-[#E4E9E5]">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#17211B] tracking-tight">
          {isHindi ? "उपार्जन केंद्र नेटवर्क निर्देशिका" : "Procurement Centres Network Directory"}
        </h1>
        <p className="text-sm text-[#66736B] font-medium mt-0.5">
          {isHindi
            ? "अधिकृत APMC उपार्जन केंद्र, सक्रिय कांटे एवं वास्तविक समय भार स्थिति।"
            : "Authorized APMC procurement centres, active counters, and real-time handling loads."}
        </p>
      </div>

      <div className="space-y-3">
        <CentreStatusTable centres={centres} />
      </div>
    </div>
  );
};