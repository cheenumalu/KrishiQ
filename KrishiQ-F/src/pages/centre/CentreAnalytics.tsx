import React from "react";
import { useKrishiQ } from "../../context/KrishiQContext";
import { useLanguage } from "../../i18n";
import { HOURLY_ANALYTICS_DATA, STAGE_CYCLE_TIMES } from "../../data/mockData";
import { Card } from "../../components/common/Card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

export const CentreAnalytics: React.FC = () => {
  const { selectedCentre } = useKrishiQ();
  const { isHindi, formatLocation } = useLanguage();

  const localizedStages = STAGE_CYCLE_TIMES.map((item) => ({
    ...item,
    name: isHindi
      ? item.name === "Gate Registration" ? "गेट पंजीकरण"
      : item.name === "Quality Assay" ? "गुणवत्ता परख"
      : item.name === "Weighbridge" ? "तौल कांटा"
      : "दस्तावेज़/भुगतान"
      : item.name,
  }));

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 px-1">
      
      <div className="pb-1 border-b border-[#E4E9E5]">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#17211B] tracking-tight">
          {isHindi ? "केंद्र उपार्जन गति एवं चक्र समय विश्लेषण" : "Centre Throughput & Cycle Time Analytics"}
        </h1>
        <p className="text-sm text-[#66736B] font-medium mt-0.5">
          {isHindi
            ? `${formatLocation(selectedCentre.name)} के लिए परिचालन निष्पादन मेट्रिक्स।`
            : `Operational performance metrics for ${selectedCentre.name}.`}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        <Card padding="md" className="border-[#E4E9E5] card-shadow">
          <span className="text-xs font-bold text-[#123D2D] uppercase block mb-2">
            {isHindi ? "प्रति घंटे आवक बनाम संसाधित उपज" : "Hourly Arrivals vs Processed Lots"}
          </span>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={HOURLY_ANALYTICS_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "#66736B" }} />
                <YAxis tick={{ fontSize: 10, fill: "#66736B" }} />
                <Tooltip contentStyle={{ borderRadius: "0.75rem", border: "1px solid #E4E9E5", fontSize: "11px" }} />
                <Bar dataKey="arrivals" name={isHindi ? "आवक" : "Arrivals"} fill="#F2A93B" />
                <Bar dataKey="processed" name={isHindi ? "संपादित" : "Processed"} fill="#2F7D4A" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card padding="md" className="border-[#E4E9E5] card-shadow">
          <span className="text-xs font-bold text-[#123D2D] uppercase block mb-2">
            {isHindi ? "प्रति किसान औसत चक्र समय (मिनट)" : "Average Station Cycle Times (Minutes per Farmer)"}
          </span>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={localizedStages} layout="vertical" margin={{ top: 5, right: 15, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 10, fill: "#66736B" }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: "#66736B" }} />
                <Tooltip contentStyle={{ borderRadius: "0.75rem", border: "1px solid #E4E9E5", fontSize: "11px" }} />
                <Bar dataKey="avgMinutes" name={isHindi ? "वास्तविक (मिनट)" : "Actual (min)"} fill="#2F7D4A" radius={[0, 4, 4, 0]} />
                <Bar dataKey="targetMinutes" name={isHindi ? "लक्ष्य (मिनट)" : "Target (min)"} fill="#8A958E" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

      </div>

    </div>
  );
};