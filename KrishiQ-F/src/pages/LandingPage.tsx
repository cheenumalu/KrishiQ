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
  PhoneCall
} from "lucide-react";
import { Card } from "../components/common/Card";
import { Badge } from "../components/common/Badge";
import { Button } from "../components/common/Button";

export const LandingPage: React.FC = () => {
  const { setRole } = useKrishiQ();
  const { isHindi } = useLanguage();
  const navigate = useNavigate();

  const handleSelectRole = (role: UserRole, targetPath: string) => {
    setRole(role);
    navigate(targetPath);
  };

  return (
    <div className="space-y-10 max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      
      {/* SaaS Hero Header Banner */}
      <div className="p-8 sm:p-12 rounded-3xl bg-[#123D2D] text-white shadow-sm space-y-4 relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-80 h-80 bg-[#58A66B]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-2 relative z-10">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-white backdrop-blur-md">
            {isHindi ? "डिजिटल सार्वजनिक अवसंरचना • कृषि उपार्जन SaaS" : "Digital Public Infrastructure • AgriTech SaaS"}
          </span>
          <span className="text-xs text-white/70">
            {isHindi ? "राज्य कृषि विपणन बोर्ड" : "State Agricultural Marketing Board"}
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight relative z-10">
          {isHindi
            ? "KrishiQ आधुनिक कृषि उपार्जन समन्वय मंच"
            : "KrishiQ Intelligent Agricultural Procurement Platform"}
        </h1>

        <p className="text-sm sm:text-base text-white/90 max-w-3xl leading-relaxed relative z-10">
          {isHindi
            ? "किसानों, उपार्जन केंद्र संचालकों एवं राज्य प्रशासन को जोड़ने वाला एकीकृत डिजिटल मंच, जो मंडियों में अनावश्यक भीड़ समाप्त करता है, लाइव कतार संतुलित करता है और पारदर्शी DBT MSP भुगतान सुनिश्चित करता है।"
            : "Next-generation coordination platform connecting farmers, procurement centre operators, and government authorities to eliminate mandi congestion, balance regional arrival queues, and automate DBT MSP settlements."}
        </p>

        <div className="pt-3 flex flex-wrap gap-2.5 text-xs relative z-10">
          <span className="px-3 py-1.5 rounded-xl bg-white/10 text-white border border-white/15">
            ✓ {isHindi ? "स्मार्ट खरीदी केंद्र सुझाव" : "Smart Centre Recommendation"}
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-white/10 text-white border border-white/15">
            ✓ {isHindi ? "लाइव मंडी कतार टोकन ट्रैकर" : "Live Mandi Queue Token Tracker"}
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-white/10 text-white border border-white/15">
            ✓ {isHindi ? "सीधा MSP DBT बैंक अंतरण" : "Direct MSP DBT Disbursement"}
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-white/10 text-white border border-white/15">
            ✓ {isHindi ? "परिदृश्य एवं भीड़ सिमुलेटर" : "Bottleneck & Congestion Simulator"}
          </span>
        </div>
      </div>

      {/* Role Selection Grid */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#17211B]">
            {isHindi ? "उपयोग हेतु पोर्टल चुनें" : "Select Portal Persona to Access"}
          </h2>
          <p className="text-xs sm:text-sm text-[#66736B]">
            {isHindi
              ? "अपनी भूमिका चुनकर पोर्टल शुरू करें। आप शीर्ष नेविगेशन बार से कभी भी प्रोफ़ाइल बदल सकते हैं।"
              : "Choose your role to launch the tailored experience. You can switch personas anytime from the top navigation bar."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* 1. Farmer Portal */}
          <Card padding="lg" hoverable className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#EEF5EF] text-[#2F7D4A] flex items-center justify-center font-bold">
                  <Users className="w-6 h-6" />
                </div>
                <Badge variant="success">{isHindi ? "किसान दृश्य" : "Farmer View"}</Badge>
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#17211B]">
                  {isHindi ? "1. किसान पोर्टल" : "1. Farmer Portal"}
                </h3>
                <p className="text-xs text-[#66736B] leading-relaxed mt-1">
                  {isHindi
                    ? "सरल, सहज और स्पष्ट इंटरफ़ेस। अनुशंसित केंद्र चयन, समय स्लॉट आरक्षण, लाइव टोकन ट्रैकिंग एवं प्रत्यक्ष MSP भुगतान रसीदें।"
                    : "Simple, visual, action-driven interface. Recommended centre selection, appointment slot booking, live queue token tracking, and direct MSP payment receipts."}
                </p>
              </div>

              <div className="pt-3 border-t border-[#E4E9E5] space-y-2 text-xs text-[#17211B]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2F7D4A] shrink-0" />
                  <span>{isHindi ? "सुझाया गया केंद्र (~2h समय बचत)" : "Recommended Centre (Saves ~2h wait)"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2F7D4A] shrink-0" />
                  <span>{isHindi ? "लाइव कतार ट्रैकर (#A127)" : "Live Queue Token Tracker (#A127)"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2F7D4A] shrink-0" />
                  <span>{isHindi ? "7-चरणीय उपार्जन ट्रैकर" : "8-Stage Procurement Stepper"}</span>
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              className="w-full"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => handleSelectRole("farmer", "/farmer/dashboard")}
            >
              {isHindi ? "किसान पोर्टल खोलें" : "Launch Farmer Portal"}
            </Button>
          </Card>

          {/* 2. Centre Operator */}
          <Card padding="lg" hoverable className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#EEF5EF] text-[#4178C0] flex items-center justify-center font-bold">
                  <Building2 className="w-6 h-6" />
                </div>
                <Badge variant="info">{isHindi ? "मंडी संचालन" : "Mandi Operations"}</Badge>
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#17211B]">
                  {isHindi ? "2. केंद्र संचालक" : "2. Centre Operator"}
                </h3>
                <p className="text-xs text-[#66736B] leading-relaxed mt-1">
                  {isHindi
                    ? "मंडी ऑपरेटरों के लिए परिचालन कंसोल। सक्रिय स्टेशन कार्ड, 1-क्लिक कर्मचारी पुनर्वितरण, रुकावट चेतावनी एवं लाइव कतार प्रेषण।"
                    : "Operational console for Mandi operators. Active workstation cards, 1-click station rebalancing, bottleneck advisories, and live queue dispatch."}
                </p>
              </div>

              <div className="pt-3 border-t border-[#E4E9E5] space-y-2 text-xs text-[#17211B]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2F7D4A] shrink-0" />
                  <span>{isHindi ? "सक्रिय स्टेशन कार्ड (टोकन A124)" : "Active Station Workstation (Token A124)"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2F7D4A] shrink-0" />
                  <span>{isHindi ? "कांटा रुकावट चेतावनी अलर्ट" : "Weighbridge Bottleneck Warning Alert"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2F7D4A] shrink-0" />
                  <span>{isHindi ? "लाइव कतार प्रेषण एवं चरण कार्रवाई" : "Live Queue Dispatch & Stage Actions"}</span>
                </div>
              </div>
            </div>

            <Button
              variant="secondary"
              size="md"
              className="w-full"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => handleSelectRole("centre", "/centre/dashboard")}
            >
              {isHindi ? "संचालन कंसोल खोलें" : "Launch Operator Console"}
            </Button>
          </Card>

          {/* 3. Administrator */}
          <Card padding="lg" hoverable className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#FEF5E7] text-[#9A6210] flex items-center justify-center font-bold">
                  <Landmark className="w-6 h-6" />
                </div>
                <Badge variant="warning">{isHindi ? "कंट्रोल टॉवर" : "Command Tower"}</Badge>
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#17211B]">
                  {isHindi ? "3. राज्य प्रशासक" : "3. State Administrator"}
                </h3>
                <p className="text-xs text-[#66736B] leading-relaxed mt-1">
                  {isHindi
                    ? "नेटवर्क कमांड डेस्क। जिला अवलोकन (42 केंद्र), 70/30 नक्शा एवं ध्यान आवश्यक पैनल, अग्रिम नीति निर्देश और परिदृश्य सिम्युलेटर।"
                    : "Network Command Desk. District overview (42 Mandis), 70/30 map & Needs Attention panel, proactive policy directives, and What-If simulator."}
                </p>
              </div>

              <div className="pt-3 border-t border-[#E4E9E5] space-y-2 text-xs text-[#17211B]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2F7D4A] shrink-0" />
                  <span>{isHindi ? "उपार्जन कंट्रोल टॉवर (42 केंद्र)" : "Procurement Control Tower (42 Mandis)"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2F7D4A] shrink-0" />
                  <span>{isHindi ? "ध्यान आवश्यक अलर्ट पैनल (धार रोड)" : "Needs Attention Alert Panel (Dhar Road)"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2F7D4A] shrink-0" />
                  <span>{isHindi ? "परिदृश्य मांग नीति सिम्युलेटर" : "What-If Policy Surge Simulator"}</span>
                </div>
              </div>
            </div>

            <Button
              variant="secondary"
              size="md"
              className="w-full"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => handleSelectRole("admin", "/admin/dashboard")}
            >
              {isHindi ? "प्रशासन डेस्क खोलें" : "Launch Administrator Desk"}
            </Button>
          </Card>

        </div>
      </div>

      {/* Support Footer Panel */}
      <Card padding="md" className="bg-[#F6F8F4] text-xs text-[#66736B] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <PhoneCall className="w-4 h-4 text-[#2F7D4A]" />
          <span>
            {isHindi
              ? "किसान कॉल सेंटर टोल-फ्री सहायता: "
              : "Kisan Call Centre Toll-Free Support: "}
            <strong className="font-mono text-[#17211B]">1800-180-1551</strong> ({isHindi ? "सुबह 6:00 - रात 10:00" : "6:00 AM - 10:00 PM"})
          </span>
        </div>
        <span>{isHindi ? "शासकीय कृषि उपार्जन अवसंरचना" : "Government Agricultural Procurement Infrastructure"}</span>
      </Card>

    </div>
  );
};