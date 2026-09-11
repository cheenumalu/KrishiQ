import React from "react";
import { MessageSquare, PhoneCall, HelpCircle, Building2 } from "lucide-react";
import { useLanguage } from "../../i18n";

export const OfflineAccessCard: React.FC = () => {
  const { isHindi } = useLanguage();

  return (
    <div className="bg-gradient-to-br from-[#123D2D] to-[#1F5441] text-white p-5 rounded-2xl shadow-sm border border-[#58A66B]/30 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center">
            <HelpCircle className="w-5 h-5 text-[#52DB89]" />
          </div>
          <div>
            <h4 className="font-bold text-sm">
              {isHindi ? "स्मार्टफोन के बिना स्लॉट एवं कतार स्थिति" : "Access Without a Smartphone"}
            </h4>
            <p className="text-[11px] text-white/80">
              {isHindi ? "सरल SMS, IVR कॉल एवं सहायता केंद्र के माध्यम से" : "Assisted booking & status via SMS/IVR architecture"}
            </p>
          </div>
        </div>
        <span className="px-2 py-0.5 rounded bg-white/20 text-[10px] font-mono uppercase tracking-wider font-semibold">
          {isHindi ? "नागरिक सुविधा" : "Planned Architecture"}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
        <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-[#52DB89]">
            <MessageSquare className="w-4 h-4" />
            <span>{isHindi ? "SMS सेवा" : "SMS Alerts"}</span>
          </div>
          <p className="text-[11px] text-white/90">
            {isHindi ? "SMS भेजें: KRISHIQ SLOT to 56161" : "Send SMS: KRISHIQ SLOT to 56161"}
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-[#52DB89]">
            <PhoneCall className="w-4 h-4" />
            <span>{isHindi ? "टोल-फ्री IVR" : "Toll-Free IVR"}</span>
          </div>
          <p className="text-[11px] text-white/90">
            {isHindi ? "डायल करें 1800-180-1551 (कृषि हेल्पलाइन)" : "Call 1800-180-1551 (Kisan Call Centre)"}
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-xs p-3 rounded-xl border border-white/10 space-y-1">
          <div className="flex items-center gap-1.5 font-bold text-[#52DB89]">
            <Building2 className="w-4 h-4" />
            <span>{isHindi ? "CSC / जन सेवा केंद्र" : "Mandi Helpdesk"}</span>
          </div>
          <p className="text-[11px] text-white/90">
            {isHindi ? "मंडी गेट हेल्पडेस्क पर त्वरित बुकिंग" : "Assisted counter registration at gate"}
          </p>
        </div>
      </div>
    </div>
  );
};
