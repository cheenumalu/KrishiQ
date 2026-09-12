import React from "react";
import { useNavigate } from "react-router-dom";
import { useKrishiQ } from "../context/KrishiQContext";
import { useLanguage } from "../i18n";
import { UserRole } from "../types";
import {
  Users,
  Building2,
  Landmark,
  ArrowRight,
  CheckCircle2,
  PhoneCall,
  FileText,
  ShieldCheck,
  TrendingUp,
  Scale,
  Calendar,
  AlertCircle,
  ExternalLink
} from "lucide-react";
import { Card } from "../components/common/Card";
import { Badge } from "../components/common/Badge";
import { Button } from "../components/common/Button";
import { EmblemOfIndia } from "../components/common/EmblemOfIndia";

export const LandingPage: React.FC = () => {
  const { setRole } = useKrishiQ();
  const { isHindi } = useLanguage();
  const navigate = useNavigate();

  const handleSelectRole = (role: UserRole, targetPath: string) => {
    setRole(role);
    navigate(targetPath);
  };

  const officialCirculars = isHindi
    ? [
        {
          id: "CIR-2026-089",
          date: "10 सितम्बर 2026",
          subject: "रबी/खरीफ विपणन सत्र 2026-27 हेतु न्यूनतम समर्थन मूल्य (MSP) की अधिसूचना",
          dept: "कृषि एवं किसान कल्याण विभाग",
        },
        {
          id: "CIR-2026-084",
          date: "06 सितम्बर 2026",
          subject: "उपार्जन केंद्रों पर निष्पक्ष औसत गुणवत्ता (FAQ) मानकों एवं नमी जांच का निर्धारण",
          dept: "खाद्य एवं नागरिक आपूर्ति निदेशालय",
        },
        {
          id: "CIR-2026-079",
          date: "01 सितम्बर 2026",
          subject: "मंडी में प्रवेश हेतु डिजिटल गेट पास एवं समय स्लॉट आरक्षण अनिवार्य करने बाबत",
          dept: "राज्य कृषि विपणन बोर्ड",
        },
      ]
    : [
        {
          id: "CIR-2026-089",
          date: "10 Sep 2026",
          subject: "Gazette Notification for Minimum Support Price (MSP) Rates - Season 2026-27",
          dept: "Department of Agriculture & Farmers Welfare",
        },
        {
          id: "CIR-2026-084",
          date: "06 Sep 2026",
          subject: "Fair Average Quality (FAQ) Standards & Permissible Moisture Thresholds in APMC Mandis",
          dept: "Directorate of Food & Civil Supplies",
        },
        {
          id: "CIR-2026-079",
          date: "01 Sep 2026",
          subject: "Mandatory Digital Entry Token & Slot Reservation for Mandi Inflow Coordination",
          dept: "State Agricultural Marketing Board",
        },
      ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto py-3 sm:py-5 font-sans">
      
      {/* 1. Official Government National Portal Hero Banner */}
      <div className="bg-white dark:bg-[#131D28] border-2 border-[#003366] dark:border-[#1E3A8A] rounded-xs shadow-xs overflow-hidden">
        {/* Top Tricolor Accent Line */}
        <div className="h-[4px] w-full flex">
          <div className="w-1/3 bg-[#FF9933]"></div>
          <div className="w-1/3 bg-[#FFFFFF]"></div>
          <div className="w-1/3 bg-[#138808]"></div>
        </div>

        <div className="p-5 sm:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 bg-[#F8FAFC] dark:bg-[#0E1620]">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2 py-0.5 bg-[#003366] text-white text-[11px] font-bold rounded-2xs uppercase tracking-wider">
                {isHindi ? "राष्ट्रीय सार्वजनिक डिजिटल अवसंरचना" : "National Digital Public Infrastructure"}
              </span>
              <span className="text-[11px] text-slate-600 dark:text-slate-400 font-semibold">
                {isHindi ? "कृषि एवं किसान कल्याण मंत्रालय, भारत सरकार" : "Ministry of Agriculture & Farmers Welfare, GoI"}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-black text-[#003366] dark:text-[#38BDF8] tracking-tight leading-tight">
              {isHindi
                ? "राष्ट्रीय कृषि उपज ई-उपार्जन एवं कतार प्रबंधन प्रणाली"
                : "KrishiQ - National Agricultural Procurement Coordination Portal"}
            </h1>

            <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
              {isHindi
                ? "भारतीय कृषि मंडियों (APMC) में किसानों की अनावश्यक प्रतीक्षा समाप्त करने, यात्रा समय व लाइव कतार का अनुकूलन करने और पारदर्शी प्रत्यक्ष लाभ अंतरण (DBT) सुनिश्चित करने वाला केंद्रीय पोर्टल।"
                : "Central digital coordination portal for APMC Mandis across India—optimizing farmer travel journeys, sequencing real-time weighbridge queues, and guaranteeing timely Direct Benefit Transfer (DBT) MSP settlements."}
            </p>

            <div className="pt-1 flex flex-wrap gap-2 text-xs">
              <span className="px-2.5 py-1 bg-white dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-2xs flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D]" />
                <span>{isHindi ? "स्मार्ट मंडी केंद्र सुझाव" : "Smart Mandi Recommendation"}</span>
              </span>
              <span className="px-2.5 py-1 bg-white dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-2xs flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D]" />
                <span>{isHindi ? "डिजिटल गेट पास व लाइव कतार" : "Digital Gate Pass & Live Queue"}</span>
              </span>
              <span className="px-2.5 py-1 bg-white dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-2xs flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D]" />
                <span>{isHindi ? "इलेक्ट्रॉनिक कांटा व FAQ ग्रेडिंग" : "e-Weighment & FAQ Inspection"}</span>
              </span>
              <span className="px-2.5 py-1 bg-white dark:bg-[#1E293B] border border-[#CBD5E1] dark:border-slate-700 text-slate-800 dark:text-slate-200 font-bold rounded-2xs flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D]" />
                <span>{isHindi ? "सीधा DBT बैंक अंतरण (PFMS)" : "PFMS Direct Benefit Transfer"}</span>
              </span>
            </div>
          </div>

          {/* Right: National Seal & Verification Box */}
          <div className="shrink-0 flex flex-col items-center justify-center p-4 bg-white dark:bg-[#131D28] border-2 border-[#CBD5E1] dark:border-slate-700 rounded-xs text-center w-full sm:w-auto">
            <EmblemOfIndia size="lg" />
            <span className="text-[11px] font-bold text-[#003366] dark:text-[#38BDF8] uppercase tracking-wider mt-2 block">
              {isHindi ? "सत्यापित शासकीय पोर्टल" : "GOI VERIFIED PORTAL"}
            </span>
            <span className="text-[10px] text-slate-500 font-mono block mt-0.5">
              SIH-2026 • NIC HOSTED
            </span>
          </div>
        </div>
      </div>

      {/* 2. National Key Procurement Telemetry Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white dark:bg-[#131D28] p-3.5 border border-[#CBD5E1] dark:border-slate-700 rounded-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xs bg-[#EFF6FF] text-[#003366] flex items-center justify-center font-bold">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              {isHindi ? "पंजीकृत किसान" : "Registered Farmers"}
            </span>
            <span className="text-lg sm:text-xl font-black text-[#003366] dark:text-[#38BDF8] tabular-nums">
              5,42,890
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#131D28] p-3.5 border border-[#CBD5E1] dark:border-slate-700 rounded-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xs bg-[#F0FDF4] text-[#15803D] flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              {isHindi ? "सक्रिय उपार्जन केंद्र" : "Connected APMC Mandis"}
            </span>
            <span className="text-lg sm:text-xl font-black text-[#15803D] tabular-nums">
              42 {isHindi ? "केंद्र" : "Centres"}
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#131D28] p-3.5 border border-[#CBD5E1] dark:border-slate-700 rounded-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xs bg-[#FFFBEB] text-[#B45309] flex items-center justify-center font-bold">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              {isHindi ? "सीधा DBT भुगतान" : "Disbursed via PFMS"}
            </span>
            <span className="text-lg sm:text-xl font-black text-[#B45309] tabular-nums">
              ₹ 1,482.5 Cr
            </span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#131D28] p-3.5 border border-[#CBD5E1] dark:border-slate-700 rounded-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xs bg-[#EFF6FF] text-[#003366] flex items-center justify-center font-bold">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              {isHindi ? "कतार दक्षता दर" : "Queue Clearance Rate"}
            </span>
            <span className="text-lg sm:text-xl font-black text-[#003366] dark:text-[#38BDF8] tabular-nums">
              94.8%
            </span>
          </div>
        </div>
      </div>

      {/* 3. Official 3 Persona Service Portals */}
      <div className="space-y-4">
        <div className="border-b-2 border-[#003366] pb-2 flex items-center justify-between">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-[#003366] dark:text-[#38BDF8] uppercase tracking-wide">
              {isHindi ? "ई-सेवाएं एवं आधिकारिक लॉगिन" : "Official e-Services & Operational Portals"}
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              {isHindi
                ? "अपनी भूमिका के अनुसार उपयुक्त पोर्टल का चयन करें। आप शीर्ष नेविगेशन बार से भी भूमिका बदल सकते हैं।"
                : "Select the tailored service desk matching your operational role. Personas can also be toggled anytime from the top bar."}
            </p>
          </div>
          <span className="text-xs font-bold text-slate-500 uppercase hidden sm:inline">
            GIGW 3.0 Standard
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* 1. Farmer Portal */}
          <div className="bg-white dark:bg-[#131D28] border border-[#CBD5E1] dark:border-slate-700 rounded-xs flex flex-col justify-between overflow-hidden shadow-xs">
            <div className="p-4 bg-[#F8FAFC] dark:bg-[#0E1620] border-b border-[#CBD5E1] dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-2xs bg-[#15803D] text-white flex items-center justify-center font-bold">
                  <Users className="w-4 h-4" />
                </div>
                <h3 className="font-black text-sm text-[#003366] dark:text-white uppercase">
                  {isHindi ? "1. किसान ई-सेवा केंद्र" : "1. Farmer e-Services"}
                </h3>
              </div>
              <Badge variant="success">{isHindi ? "नागरिक सेवा" : "Citizen"}</Badge>
            </div>

            <div className="p-4 space-y-3 text-xs">
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {isHindi
                  ? "किसानों के लिए समर्पित पोर्टल। अपनी नजदीकी न्यूनतम प्रतीक्षा वाली मंडी चुनें, डिजिटल टोकन जनरेट करें, लाइव कतार ट्रैक करें और बैंक DBT स्थिति देखें।"
                  : "Dedicated farmer interface. Discover optimal Mandis minimizing journey time, reserve entry time-slots, track sequential token status, and monitor DBT MSP credits."}
              </p>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-1.5 text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D]" />
                  <span>{isHindi ? "डिजिटल मंडी गेट पास एवं समय स्लॉट" : "Digital Entry Pass & 30-Min Time Slots"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D]" />
                  <span>{isHindi ? "लाइव कतार एवं अनुमानित आगमन समय" : "Live Queue Stream & ETA Confidence"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#15803D]" />
                  <span>{isHindi ? "8-चरणीय उपार्जन व PFMS बैंक पावती" : "8-Stage Tracking & PFMS DBT Ledger"}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-[#0E1620] border-t border-[#CBD5E1] dark:border-slate-700">
              <Button
                variant="secondary"
                size="md"
                className="w-full"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => handleSelectRole("farmer", "/farmer/dashboard")}
              >
                {isHindi ? "किसान पोर्टल में प्रवेश करें" : "Enter Farmer Portal"}
              </Button>
            </div>
          </div>

          {/* 2. Mandi Operator */}
          <div className="bg-white dark:bg-[#131D28] border border-[#CBD5E1] dark:border-slate-700 rounded-xs flex flex-col justify-between overflow-hidden shadow-xs">
            <div className="p-4 bg-[#F8FAFC] dark:bg-[#0E1620] border-b border-[#CBD5E1] dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-2xs bg-[#003366] text-white flex items-center justify-center font-bold">
                  <Building2 className="w-4 h-4" />
                </div>
                <h3 className="font-black text-sm text-[#003366] dark:text-white uppercase">
                  {isHindi ? "2. मंडी संचालन कंसोल" : "2. APMC Mandi Operations"}
                </h3>
              </div>
              <Badge variant="info">{isHindi ? "उपार्जन केंद्र" : "Mandi"}</Badge>
            </div>

            <div className="p-4 space-y-3 text-xs">
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {isHindi
                  ? "मंडी उपार्जन केंद्र अधिकारियों हेतु कार्यक्षेत्र। इलेक्ट्रॉनिक तौल कांटा रिकॉर्ड, FAQ गुणवत्ता परीक्षण रिपोर्ट, किसान कॉल सिस्टम और रुकावट निवारण।"
                  : "Official operational workstation for Mandi staff. Execute electronic weighment, issue Fair Average Quality (FAQ) grading slips, call next tokens, and resolve bottlenecks."}
              </p>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-1.5 text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#003366]" />
                  <span>{isHindi ? "सक्रिय स्टेशन काउंटर व अगला किसान कॉल" : "Active Counter Station & Next Token Call"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#003366]" />
                  <span>{isHindi ? "कांटा रुकावट चेतावनी व 1-क्लिक रीबैलेंस" : "Weighbridge Choke Warning & Load Rebalance"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#003366]" />
                  <span>{isHindi ? "इलेक्ट्रॉनिक तौल पर्ची व गुणवत्ता प्रमाणन" : "Electronic Weighment Slip & FAQ Slips"}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-[#0E1620] border-t border-[#CBD5E1] dark:border-slate-700">
              <Button
                variant="primary"
                size="md"
                className="w-full"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => handleSelectRole("centre", "/centre/dashboard")}
              >
                {isHindi ? "ऑपरेटर कंसोल खोलें" : "Open Mandi Console"}
              </Button>
            </div>
          </div>

          {/* 3. State Administration */}
          <div className="bg-white dark:bg-[#131D28] border border-[#CBD5E1] dark:border-slate-700 rounded-xs flex flex-col justify-between overflow-hidden shadow-xs">
            <div className="p-4 bg-[#F8FAFC] dark:bg-[#0E1620] border-b border-[#CBD5E1] dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-2xs bg-[#B45309] text-white flex items-center justify-center font-bold">
                  <Landmark className="w-4 h-4" />
                </div>
                <h3 className="font-black text-sm text-[#003366] dark:text-white uppercase">
                  {isHindi ? "3. राज्य नियंत्रण कक्ष" : "3. State Command Centre"}
                </h3>
              </div>
              <Badge variant="warning">{isHindi ? "प्रशासन" : "Admin"}</Badge>
            </div>

            <div className="p-4 space-y-3 text-xs">
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {isHindi
                  ? "राज्य कृषि विपणन बोर्ड एवं नोडल अधिकारियों हेतु कमांड डेस्क। 42 केंद्रों की लाइव टेलीमेट्री, 4-घंटे का भीड़ पूर्वानुमान और नीति परीक्षण सिमुलेटर।"
                  : "State Agricultural Marketing Board central control tower. Monitor network-wide telemetry across 42 Mandis, 4-hour congestion forecasts, and dispatch policy directives."}
              </p>

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 space-y-1.5 text-[11px] font-semibold text-slate-800 dark:text-slate-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#B45309]" />
                  <span>{isHindi ? "राज्य स्तरीय टेलीमेट्री व जिला नेटवर्क नक्शा" : "State Telemetry & District Mandi Map"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#B45309]" />
                  <span>{isHindi ? "4-घंटे का अग्रिम भीड़ पूर्वानुमान" : "4-Hour Predictive Congestion Alert"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#B45309]" />
                  <span>{isHindi ? "व्हाट-इफ नीति व मांग उछाल सैंडबॉक्स" : "What-If Policy Surge Simulation Sandbox"}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 dark:bg-[#0E1620] border-t border-[#CBD5E1] dark:border-slate-700">
              <Button
                variant="accent"
                size="md"
                className="w-full"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => handleSelectRole("admin", "/admin/dashboard")}
              >
                {isHindi ? "कमांड डेस्क खोलें" : "Open State Command"}
              </Button>
            </div>
          </div>

        </div>
      </div>

      {/* 4. Official Gazette Notifications & Public Circulars */}
      <div className="bg-white dark:bg-[#131D28] border border-[#CBD5E1] dark:border-slate-700 rounded-xs overflow-hidden">
        <div className="px-4 py-2.5 bg-[#003366] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#FF9933]" />
            <h3 className="font-bold text-xs sm:text-sm uppercase tracking-wide">
              {isHindi ? "नवीनतम शासकीय अधिसूचनाएं एवं परिपत्र" : "Latest Government Notifications & Circulars"}
            </h3>
          </div>
          <span className="text-[11px] text-[#FF9933] font-semibold">
            {isHindi ? "अद्यतन: सितम्बर 2026" : "Updated: Sep 2026"}
          </span>
        </div>

        <div className="divide-y divide-slate-200 dark:divide-slate-800">
          {officialCirculars.map((circ) => (
            <div key={circ.id} className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs hover:bg-slate-50 dark:hover:bg-slate-800/50">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-[#003366] dark:text-[#38BDF8] bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded-2xs">
                    {circ.id}
                  </span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-500">{circ.date}</span>
                </div>
                <h4 className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm">
                  {circ.subject}
                </h4>
                <p className="text-[11px] text-slate-500">
                  {circ.dept}
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold text-[10px] rounded-2xs border border-slate-300 dark:border-slate-700">
                  PDF (240 KB)
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};