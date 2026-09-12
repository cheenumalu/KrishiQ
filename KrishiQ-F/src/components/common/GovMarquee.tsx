import React from "react";
import { useLanguage } from "../../i18n";
import { AlertCircle, FileText, PhoneCall } from "lucide-react";

/**
 * Official Government Public Notice & Announcement Ticker
 * Standard for Ministry of Agriculture, APMC & e-NAM portals.
 */
export const GovMarquee: React.FC<{ className?: string }> = ({ className = "" }) => {
  const { isHindi } = useLanguage();

  const announcements = isHindi
    ? [
        "रबी/खरीफ विपणन सत्र 2026-27: गेहूं का न्यूनतम समर्थन मूल्य (MSP) ₹2,275/- एवं धान ₹2,183/- प्रति क्विंटल निर्धारित।",
        "उपार्जन केंद्र पर भीड़ नियंत्रण हेतु डिजिटल टोकन स्लॉट बुकिंग अनिवार्य है। बिना टोकन प्रवेश अनुमत नहीं होगा।",
        "सीधा बैंक खाता अंतरण (DBT): तौल एवं गुणवत्ता स्वीकृति के 48 घंटों में PFMS के माध्यम से आधार लिंक खाते में भुगतान।",
        "किसान कॉल सेंटर टोल-फ्री हेल्पलाइन: 1800-180-1551 (प्रातः 06:00 बजे से रात्रि 10:00 बजे तक)।",
      ]
    : [
        "Procurement Season 2026-27: Wheat MSP notified at ₹2,275/qtl and Paddy at ₹2,183/qtl under National Food Security Mission.",
        "Mandi Slot Reservation & Digital Entry Token are mandatory prior to dispatching agricultural produce.",
        "Direct Benefit Transfer (DBT): Payouts disbursed directly to Aadhaar-seeded bank accounts via PFMS within 48 hours of weighment.",
        "Toll-Free Kisan Call Centre National Helpline: 1800-180-1551 (Operational 06:00 AM to 10:00 PM IST daily).",
      ];

  return (
    <div className={`w-full bg-[#FFFBEB] border-b border-[#FDE68A] text-xs text-[#92400E] flex items-center overflow-hidden ${className}`}>
      {/* Static Label Badge */}
      <div className="bg-[#B45309] text-white px-3 py-1.5 font-bold uppercase tracking-wider text-[11px] shrink-0 flex items-center gap-1.5 z-10 shadow-xs">
        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
        <span>{isHindi ? "महत्वपूर्ण सूचना" : "IMPORTANT NOTICE"}</span>
      </div>

      {/* Scrolling Text Container */}
      <div className="flex-1 overflow-hidden py-1 px-3 whitespace-nowrap">
        <div className="inline-block animate-marquee hover:pause font-medium text-slate-800 text-[12px]">
          {announcements.map((item, idx) => (
            <span key={idx} className="inline-flex items-center mr-8">
              <span className="w-1.5 h-1.5 rounded-full bg-[#B45309] inline-block mr-2" />
              <span>{item}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Quick Helpline link */}
      <div className="hidden sm:flex items-center gap-1 bg-[#FEF3C7] border-l border-[#FDE68A] px-3 py-1.5 text-[11px] font-bold text-[#92400E] shrink-0">
        <PhoneCall className="w-3 h-3 text-[#B45309]" />
        <span>1800-180-1551</span>
      </div>
    </div>
  );
};
