import React from "react";
import { useLanguage } from "../../i18n";
import { HOURLY_ANALYTICS_DATA } from "../../data/mockData";
import { Card } from "../../components/common/Card";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

export const AdminAnalytics: React.FC = () => {
  const { isHindi } = useLanguage();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 px-1">
      <div className="pb-1 border-b border-[#E4E9E5]">
        <h1 className="text-2xl sm:text-3xl font-bold text-[#17211B] tracking-tight">
          {isHindi ? "राज्य कृषि उपार्जन विश्लेषण" : "State Agricultural Procurement Analytics"}
        </h1>
        <p className="text-sm text-[#66736B] font-medium mt-0.5">
          {isHindi
            ? "संभाग-स्तरीय उपार्जन मात्रा, क्षमता उपयोग एवं DBT अंतरण मेट्रिक्स।"
            : "District-wide procurement volumes, capacity utilization, and DBT settlement metrics."}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card padding="md" className="border-[#E4E9E5] card-shadow">
          <span className="text-xs text-[#66736B] block font-medium">{isHindi ? "आज का कुल उपार्जन" : "Total Procurement Today"}</span>
          <p className="text-2xl font-extrabold text-[#17211B] mt-1 font-sans tabular-nums">48,250 {isHindi ? "क्विंटल" : "Qtl"}</p>
        </Card>

        <Card padding="md" className="border-[#E4E9E5] card-shadow">
          <span className="text-xs text-[#66736B] block font-medium">{isHindi ? "स्वीकृत DBT राशि" : "DBT Amount Cleared"}</span>
          <p className="text-2xl font-extrabold text-[#2F7D4A] mt-1 font-sans tabular-nums">{isHindi ? "₹8.42 करोड़" : "₹8.42 Cr"}</p>
        </Card>

        <Card padding="md" className="border-[#E4E9E5] card-shadow">
          <span className="text-xs text-[#66736B] block font-medium">{isHindi ? "औसत प्रतीक्षा समय" : "Average Wait Time"}</span>
          <p className="text-2xl font-extrabold text-[#17211B] mt-1 font-sans tabular-nums">44 {isHindi ? "मिनट" : "min"}</p>
        </Card>

        <Card padding="md" className="border-[#E4E9E5] card-shadow">
          <span className="text-xs text-[#66736B] block font-medium">{isHindi ? "सक्रिय उपार्जन केंद्र" : "Active Mandis"}</span>
          <p className="text-2xl font-extrabold text-[#17211B] mt-1 font-sans tabular-nums">24</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card padding="md" className="border-[#E4E9E5] card-shadow">
          <span className="text-xs font-bold text-[#123D2D] uppercase block mb-2">
            {isHindi ? "प्रति घंटे जिला उपार्जन आवक प्रवाह" : "Hourly District Procurement Inflow"}
          </span>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={HOURLY_ANALYTICS_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "#66736B" }} />
                <YAxis tick={{ fontSize: 10, fill: "#66736B" }} />
                <Tooltip contentStyle={{ borderRadius: "0.75rem", border: "1px solid #E4E9E5", fontSize: "11px" }} />
                <Area type="monotone" dataKey="processed" stroke="#2F7D4A" fill="#EEF5EF" name={isHindi ? "उपार्जित क्विंटल" : "Procured Qtl"} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card padding="md" className="border-[#E4E9E5] card-shadow">
          <span className="text-xs font-bold text-[#123D2D] uppercase block mb-2">
            {isHindi ? "प्रति घंटे औसत मंडी कतार लंबाई" : "Average Mandi Queue Length by Hour"}
          </span>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={HOURLY_ANALYTICS_DATA} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "#66736B" }} />
                <YAxis tick={{ fontSize: 10, fill: "#66736B" }} />
                <Tooltip contentStyle={{ borderRadius: "0.75rem", border: "1px solid #E4E9E5", fontSize: "11px" }} />
                <Bar dataKey="queueLength" name={isHindi ? "कतार लंबाई" : "Queue Length"} fill="#F2A93B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};