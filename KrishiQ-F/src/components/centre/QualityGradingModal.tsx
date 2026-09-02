import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { Button } from "../common/Button";
import { useLanguage } from "../../i18n";
import { ShieldCheck, Scale } from "lucide-react";

interface QualityGradingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

export const QualityGradingModal: React.FC<QualityGradingModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const { t, isHindi } = useLanguage();
  const [moisture, setMoisture] = useState("11.2");
  const [dockage, setDockage] = useState("0.5");
  const [foreignMatter, setForeignMatter] = useState("0.2");
  const [grade, setGrade] = useState<"Grade A" | "FAQ" | "Below FAQ">("Grade A");
  const [grossWeight, setGrossWeight] = useState("9120");
  const [tareWeight, setTareWeight] = useState("2620");

  const netWeightQuintals = (Math.max(0, Number(grossWeight) - Number(tareWeight)) / 100).toFixed(1);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      moisture: Number(moisture),
      dockage: Number(dockage),
      foreignMatter: Number(foreignMatter),
      grade,
      netWeightQuintals: Number(netWeightQuintals),
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isHindi ? "इलेक्ट्रॉनिक परख एवं वेईंग कांटा प्रविष्टि" : "Electronic Assay & Weighbridge Entry"}
      subtitle={isHindi ? "केंद्रीय पूल उपार्जन हेतु डिजिटल ग्रेडिंग" : "Digital lot grading for central pool procurement"}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        
        {/* Quality Assay Section */}
        <div className="p-3.5 rounded-xl bg-[#F6F8F4] border border-[#E4E9E5] space-y-3">
          <h5 className="font-bold text-[#17211B] flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#2F7D4A]" />
            {isHindi ? "1. अनाज गुणवत्ता मापदंड (FAQ सीमा)" : "1. Grain Quality Parameters (FAQ Limits)"}
          </h5>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="text-[#66736B] block mb-1">{isHindi ? "नमी % (अधिकतम 12%)" : "Moisture % (Max 12%)"}</label>
              <input
                type="number"
                step="0.1"
                value={moisture}
                onChange={(e) => setMoisture(e.target.value)}
                className="w-full p-2 rounded-lg border border-[#E4E9E5] font-bold text-[#17211B] bg-white"
                required
              />
            </div>

            <div>
              <label className="text-[#66736B] block mb-1">{isHindi ? "डोकेज % (अधिकतम 1%)" : "Dockage % (Max 1%)"}</label>
              <input
                type="number"
                step="0.1"
                value={dockage}
                onChange={(e) => setDockage(e.target.value)}
                className="w-full p-2 rounded-lg border border-[#E4E9E5] font-bold text-[#17211B] bg-white"
                required
              />
            </div>

            <div>
              <label className="text-[#66736B] block mb-1">{isHindi ? "कचरा/अन्य %" : "Foreign Matter %"}</label>
              <input
                type="number"
                step="0.1"
                value={foreignMatter}
                onChange={(e) => setForeignMatter(e.target.value)}
                className="w-full p-2 rounded-lg border border-[#E4E9E5] font-bold text-[#17211B] bg-white"
                required
              />
            </div>
          </div>

          <div>
            <label className="text-[#66736B] block mb-1 font-semibold">{isHindi ? "निर्धारित गुणवत्ता ग्रेड" : "Assigned Quality Grade"}</label>
            <div className="grid grid-cols-3 gap-2">
              {(["Grade A", "FAQ", "Below FAQ"] as const).map((g) => (
                <button
                  key={g}
                  type="button"
                  onClick={() => setGrade(g)}
                  className={`p-2 rounded-lg border text-center font-bold transition-all cursor-pointer ${
                    grade === g
                      ? "bg-[#123D2D] text-white border-[#123D2D] shadow-xs"
                      : "bg-white text-[#17211B] border-[#E4E9E5] hover:bg-[#F6F8F4]"
                  }`}
                >
                  {g === "Grade A" ? (isHindi ? "ग्रेड A (उत्कृष्ट)" : "Grade A") : g === "FAQ" ? (isHindi ? "FAQ (सामान्य)" : "FAQ") : (isHindi ? "मानक से नीचे" : "Below FAQ")}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Weighbridge Section */}
        <div className="p-3.5 rounded-xl bg-[#F6F8F4] border border-[#E4E9E5] space-y-3">
          <h5 className="font-bold text-[#17211B] flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-[#2F7D4A]" />
            {isHindi ? "2. इलेक्ट्रॉनिक तौल कांटा रिकॉर्ड (किग्रा)" : "2. Electronic Weighbridge Record (KG)"}
          </h5>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[#66736B] block mb-1">{isHindi ? "सकल वजन (Gross)" : "Gross Weight"}</label>
              <input
                type="number"
                value={grossWeight}
                onChange={(e) => setGrossWeight(e.target.value)}
                className="w-full p-2 rounded-lg border border-[#E4E9E5] font-mono font-bold text-[#17211B] bg-white"
                required
              />
            </div>

            <div>
              <label className="text-[#66736B] block mb-1">{isHindi ? "खाली वाहन वजन (Tare)" : "Tare Weight"}</label>
              <input
                type="number"
                value={tareWeight}
                onChange={(e) => setTareWeight(e.target.value)}
                className="w-full p-2 rounded-lg border border-[#E4E9E5] font-mono font-bold text-[#17211B] bg-white"
                required
              />
            </div>
          </div>

          <div className="p-2.5 rounded-lg bg-[#EEF5EF] border border-[#58A66B]/30 flex items-center justify-between">
            <span className="font-semibold text-[#123D2D]">{isHindi ? "शुद्ध उपज वजन (Net):" : "Calculated Net Weight:"}</span>
            <strong className="text-base font-mono font-bold text-[#123D2D]">
              {netWeightQuintals} {t("common.quintals")}
            </strong>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E4E9E5]">
          <Button variant="outline" size="sm" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button variant="primary" size="md" type="submit">
            {isHindi ? "स्वीकृत करें व रसीद बनाएँ" : "Accept & Generate Receipt"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};