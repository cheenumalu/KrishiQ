import React from "react";
import { useKrishiQ } from "../../context/KrishiQContext";
import { useLanguage } from "../../i18n";
import { formatQuintals } from "../../utils/calculations";
import { Printer } from "lucide-react";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";

export const CentreProcurement: React.FC = () => {
  const { selectedCentre } = useKrishiQ();
  const { t, isHindi } = useLanguage();

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16 px-1">
      
      <div className="flex flex-wrap items-center justify-between gap-4 pb-1 border-b border-[#E4E9E5]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#17211B] tracking-tight">
            {isHindi ? "उपार्जन एवं गुणवत्ता जाँच बही" : "Procurement & Quality Assay Log"}
          </h1>
          <p className="text-sm text-[#66736B] font-medium">
            {isHindi
              ? "दैनिक औसत उचित गुणवत्ता (FAQ) मानक एवं तौल कांटा सत्यापन रिकॉर्ड।"
              : "Daily Fair Average Quality (FAQ) standards & weighment calibration ledger."}
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          leftIcon={<Printer className="w-4 h-4" />}
          onClick={() => window.print()}
        >
          {isHindi ? "दैनिक बही प्रिंट करें" : "Print Daily Shift Ledger"}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card padding="md" className="border-[#E4E9E5] card-shadow">
          <span className="text-xs text-[#66736B] block font-medium">{t("centre.todayProcurement")}</span>
          <p className="text-2xl font-extrabold text-[#17211B] mt-1 font-sans tabular-nums">{formatQuintals(3240)}</p>
          <span className="text-[11px] text-[#66736B] block mt-0.5">{isHindi ? "दैनिक लक्ष्य: 4,000 क्विंटल" : "Target: 4,000 Qtl"}</span>
        </Card>

        <Card padding="md" className="border-[#E4E9E5] card-shadow">
          <span className="text-xs text-[#66736B] block font-medium">{isHindi ? "कांटा अंशांकन (Calibration)" : "Weighbridge Calibration"}</span>
          <p className="text-2xl font-extrabold text-[#2F7D4A] mt-1 font-sans tabular-nums">{isHindi ? "सत्यापित ✓" : "Calibrated ✓"}</p>
          <span className="text-[11px] text-[#66736B] block mt-0.5">{isHindi ? "कांटा 1 व 2 प्रमाणित" : "WB-01 & WB-02 Verified"}</span>
        </Card>

        <Card padding="md" className="border-[#E4E9E5] card-shadow">
          <span className="text-xs text-[#66736B] block font-medium">{isHindi ? "औसत नमी प्रतिशत" : "Average Moisture"}</span>
          <p className="text-2xl font-extrabold text-[#17211B] mt-1 font-sans tabular-nums">11.6%</p>
          <span className="text-[11px] text-[#66736B] block mt-0.5">{isHindi ? "अनुमेय सीमा के भीतर < 12.0%" : "Within permissible < 12.0%"}</span>
        </Card>
      </div>

      <Card padding="lg" className="border-[#E4E9E5] card-shadow space-y-4">
        <span className="text-xs uppercase font-extrabold tracking-wider text-[#123D2D] block pb-2 border-b border-[#E4E9E5]">
          {isHindi ? "हालिया गुणवत्ता परीक्षण रिकॉर्ड (आज की शिफ्ट)" : "Recent Quality Assay Records (Today's Shift)"}
        </span>

        <div className="space-y-2.5 text-xs text-[#17211B]">
          <div className="p-3 rounded-xl bg-[#F6F8F4] border border-[#E4E9E5] flex items-center justify-between">
            <div>
              <strong className="text-[#17211B]">{isHindi ? "टोकन A124 (राजेश कुमार)" : "Token A124 (Rajesh Kumar)"}</strong>
              <p className="text-[#66736B] text-[11px] mt-0.5">
                {isHindi ? "42 क्विंटल गेहूँ • नमी 11.2% • कचरा 0.4% • ग्रेड A (FAQ)" : "42 Qtl Wheat • Moisture 11.2% • Foreign Matter 0.4% • Grade A (FAQ)"}
              </p>
            </div>
            <Badge variant="success">{isHindi ? "उत्तीर्ण ✓" : "Passed ✓"}</Badge>
          </div>

          <div className="p-3 rounded-xl bg-[#F6F8F4] border border-[#E4E9E5] flex items-center justify-between">
            <div>
              <strong className="text-[#17211B]">{isHindi ? "टोकन A123 (ओम प्रकाश)" : "Token A123 (Om Prakash)"}</strong>
              <p className="text-[#66736B] text-[11px] mt-0.5">
                {isHindi ? "36 क्विंटल मक्का • नमी 12.1% • कचरा 0.7% • ग्रेड A (FAQ)" : "36 Qtl Maize • Moisture 12.1% • Foreign Matter 0.7% • Grade A (FAQ)"}
              </p>
            </div>
            <Badge variant="success">{isHindi ? "उत्तीर्ण ✓" : "Passed ✓"}</Badge>
          </div>

          <div className="p-3 rounded-xl bg-[#F6F8F4] border border-[#E4E9E5] flex items-center justify-between">
            <div>
              <strong className="text-[#17211B]">{isHindi ? "टोकन A122 (देवेंद्र चौहान)" : "Token A122 (Devendra Chouhan)"}</strong>
              <p className="text-[#66736B] text-[11px] mt-0.5">
                {isHindi ? "50 क्विंटल गेहूँ • नमी 11.8% • कचरा 0.5% • ग्रेड A (FAQ)" : "50 Qtl Wheat • Moisture 11.8% • Foreign Matter 0.5% • Grade A (FAQ)"}
              </p>
            </div>
            <Badge variant="success">{isHindi ? "उत्तीर्ण ✓" : "Passed ✓"}</Badge>
          </div>
        </div>
      </Card>

    </div>
  );
};