import React, { useState } from "react";
import { useKrishiQ } from "../../context/KrishiQContext";
import { useLanguage } from "../../i18n";
import { AlertOctagon, Send, ShieldAlert } from "lucide-react";
import { Button } from "../common/Button";
import { Badge } from "../common/Badge";
import { Modal } from "../common/Modal";

export const CongestionAdvisoryCard: React.FC = () => {
  const { centres, resolveBottleneck, addToast } = useKrishiQ();
  const { isHindi, formatLocation } = useLanguage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [directiveIssued, setDirectiveIssued] = useState(false);

  const criticalCentre = centres.find((c) => c.status === "critical") || centres[1];

  const handleIssueDirective = () => {
    resolveBottleneck(criticalCentre.id);
    setDirectiveIssued(true);
    setIsModalOpen(false);
    addToast(
      isHindi ? "राज्य निर्देश जारी" : "State Directive Dispatched",
      isHindi ? "45 किसानों को स्वचालित SMS रूटिंग भेजी गई। अतिरिक्त कांटा खोला गया।" : "Automated SMS reroute alerts sent to 45 farmers. Auxiliary counter opened at Centre #17.",
      "success"
    );
  };

  return (
    <>
      <div className="relative overflow-hidden rounded-2xl border-2 border-[#D95555]/50 bg-[#142019] text-white p-6 shadow-lg">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-72 h-72 bg-[#D95555]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-[#D95555] text-white text-[11px] font-extrabold tracking-wider flex items-center gap-1.5 shadow-xs">
              <AlertOctagon className="w-3.5 h-3.5" />
              {isHindi ? "अनुमानित रुकावट चेतावनी" : "PREDICTED BOTTLENECK ALERT"}
            </span>
            <span className="text-xs text-[#FCA5A5] font-medium">{isHindi ? "AI अग्रिम भीड़ चेतावनी" : "AI Early Congestion Warning"}</span>
          </div>

          <Badge variant="critical">{isHindi ? "स्थिति: गंभीर (136% भार)" : "Status: CRITICAL (136% Load)"}</Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          
          <div className="lg:col-span-7">
            <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              {formatLocation(criticalCentre.name)}
            </h3>
            <p className="text-xs text-white/80 mt-1">
              {isHindi ? "स्थान: धार रोड कॉरिडोर • दैनिक क्षमता:" : "Location: Dhar Road Corridor • Capacity:"} {criticalCentre.totalCapacityPerDay} {isHindi ? "किसान/दिन" : "Farmers/Day"}
            </p>

            <div className="grid grid-cols-3 gap-2 sm:gap-3 my-4">
              <div className="p-2.5 rounded-xl bg-white/10 border border-white/15 text-center">
                <span className="text-[10px] text-white/70 block">{isHindi ? "वर्तमान कतार" : "Current Queue"}</span>
                <span className="text-lg font-bold text-white font-mono">{criticalCentre.currentQueueCount}</span>
              </div>

              <div className="p-2.5 rounded-xl bg-white/10 border border-white/15 text-center">
                <span className="text-[10px] text-white/70 block">{isHindi ? "अपेक्षित आवक" : "Expected Arrivals"}</span>
                <span className="text-lg font-bold text-[#FCA5A5] font-mono">+140</span>
              </div>

              <div className="p-2.5 rounded-xl bg-[#D95555]/20 border border-[#D95555]/40 text-center">
                <span className="text-[10px] text-[#FCA5A5] block font-bold">{isHindi ? "अनुमानित प्रतीक्षा" : "Predicted Wait"}</span>
                <span className="text-lg font-bold text-[#FCA5A5] font-mono">{criticalCentre.predictedWaitMinutes}m</span>
              </div>
            </div>

            <p className="text-xs text-white/80 leading-relaxed">
              {isHindi
                ? "अनुशंसा: टोकन A140 से A185 को शिवाजी नगर उपार्जन केंद्र की ओर डायवर्ट करें। इससे जिले का औसत प्रतीक्षा समय 18 मिनट कम होगा।"
                : "Recommended Action: Reroute arrival tokens A140 through A185 to Shivaji Nagar Centre. Estimated district wait reduction: 18 min."}
            </p>
          </div>

          <div className="lg:col-span-5 flex flex-col justify-center items-start lg:items-end gap-3 pt-2 lg:pt-0">
            <Button
              variant="accent"
              size="lg"
              leftIcon={<Send className="w-4 h-4" />}
              onClick={() => setIsModalOpen(true)}
              disabled={directiveIssued}
            >
              {directiveIssued ? (isHindi ? "निर्देश जारी किया गया ✓" : "Directive Executed ✓") : (isHindi ? "राज्य निर्देश जारी करें" : "Dispatch State Directive")}
            </Button>
          </div>

        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={isHindi ? "राज्य उपार्जन निर्देश जारी करें" : "Issue State Procurement Directive"}
        subtitle={isHindi ? "धार रोड मंडी से शिवाजी नगर केंद्र की ओर आवक डायवर्ट करें" : "Reroute incoming lots from Dhar Road to Shivaji Nagar Hub"}
        maxWidth="md"
      >
        <div className="space-y-4 text-xs">
          <div className="p-3 rounded-lg bg-[#FDF2F2] dark:bg-[#2A1515] border border-[#D95555]/30 text-[#9B2C2C] dark:text-[#FCA5A5] flex items-start gap-2.5">
            <ShieldAlert className="w-5 h-5 text-[#D95555] shrink-0" />
            <div>
              <strong className="block text-sm">{isHindi ? "क्या आप इस निर्देश की पुष्टि करते हैं?" : "Confirm Automated Intervention"}</strong>
              <p className="mt-0.5 text-[11px]">
                {isHindi
                  ? "धार रोड के लिए बुक 45 किसानों को तुरंत SMS सूचना भेजी जाएगी जिसमें शिवाजी नगर पर त्वरित आवक की सलाह होगी।"
                  : "Immediate SMS reroute advisories will be sent to 45 farmers with slots between 11:30 AM and 01:30 PM."}
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#E4E9E5] dark:border-[#23362B]">
            <Button variant="outline" size="sm" onClick={() => setIsModalOpen(false)}>
              {isHindi ? "रद्द करें" : "Cancel"}
            </Button>
            <Button variant="accent" size="md" onClick={handleIssueDirective}>
              {isHindi ? "SMS निर्देश भेजें" : "Confirm & Send SMS Advisories"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};