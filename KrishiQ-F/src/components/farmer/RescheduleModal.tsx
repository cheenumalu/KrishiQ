import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { useKrishiQ } from "../../context/KrishiQContext";
import { useLanguage } from "../../i18n";
import { AlertTriangle } from "lucide-react";
import { Button } from "../common/Button";

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RescheduleModal: React.FC<RescheduleModalProps> = ({ isOpen, onClose }) => {
  const { centres, farmerBooking, rescheduleSlot } = useKrishiQ();
  const { t, isHindi, formatLocation, formatTimeSlot, formatDate } = useLanguage();

  const [selectedCentreId, setSelectedCentreId] = useState(farmerBooking.centreId);
  const [selectedDate, setSelectedDate] = useState("Tomorrow (30 Aug 2026)");
  const [selectedTime, setSelectedTime] = useState("09:00 AM - 10:00 AM");

  const dates = [
    { value: "Today (29 Aug 2026)", label: isHindi ? "आज (29 अगस्त 2026)" : "Today (29 Aug 2026)" },
    { value: "Tomorrow (30 Aug 2026)", label: isHindi ? "कल (30 अगस्त 2026)" : "Tomorrow (30 Aug 2026)" },
    { value: "Monday (01 Sep 2026)", label: isHindi ? "सोमवार (01 सितंबर 2026)" : "Monday (01 Sep 2026)" },
    { value: "Tuesday (02 Sep 2026)", label: isHindi ? "मंगलवार (02 सितंबर 2026)" : "Tuesday (02 Sep 2026)" },
  ];

  const timeslots = [
    { time: "08:00 AM - 09:00 AM", wait: isHindi ? "22 मिनट" : "22 min", load: isHindi ? "कम" : "Low", loadType: "low" },
    { time: "09:00 AM - 10:00 AM", wait: isHindi ? "38 मिनट" : "38 min", load: isHindi ? "मध्यम" : "Moderate", loadType: "mod" },
    { time: "10:00 AM - 11:00 AM", wait: isHindi ? "55 मिनट" : "55 min", load: isHindi ? "अधिक" : "Peak", loadType: "peak" },
    { time: "11:00 AM - 12:00 PM", wait: isHindi ? "62 मिनट" : "62 min", load: isHindi ? "अधिक" : "Peak", loadType: "peak" },
    { time: "02:00 PM - 03:00 PM", wait: isHindi ? "30 मिनट" : "30 min", load: isHindi ? "कम" : "Low", loadType: "low" },
    { time: "03:00 PM - 04:00 PM", wait: isHindi ? "25 मिनट" : "25 min", load: isHindi ? "कम" : "Low", loadType: "low" },
  ];

  const handleConfirm = () => {
    rescheduleSlot(selectedCentreId, selectedDate, selectedTime);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isHindi ? "स्लॉट का समय बदलें" : "Reschedule Appointment Slot"}
      subtitle={isHindi ? "नया समय स्लॉट या वैकल्पिक खरीदी केंद्र चुनें" : "Select a new time window or alternative procurement centre"}
      maxWidth="lg"
    >
      <div className="space-y-5">
        <div className="p-3.5 rounded-xl bg-[#FEF5E7] border border-[#F2A93B]/40 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-[#F2A93B] shrink-0 mt-0.5" />
          <div className="text-xs text-[#9A6210]">
            <strong className="font-semibold">
              {isHindi ? "प्रतीक्षा समय सूचना: " : "Dynamic Waiting Time Notice: "}
            </strong>
            {isHindi
              ? "तारीख या समय स्लॉट बदलने पर मंडी में अनुमानित आवक के आधार पर आपकी प्रतीक्षा का समय स्वतः पुनर्गणना होगा।"
              : "Changing your slot date or time window will dynamically recalculate your predicted queue wait time based on forecasted Mandi arrivals."}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#F6F8F4] border border-[#E4E9E5] text-xs">
          <span className="text-[#66736B]">{isHindi ? "मौजूदा स्लॉट:" : "Current Slot:"}</span>
          <p className="font-bold text-[#17211B] mt-0.5">
            {formatLocation(farmerBooking.centreName)} • {formatDate(farmerBooking.slotDate)} ({formatTimeSlot(farmerBooking.slotTime)})
          </p>
        </div>

        <div>
          <label className="text-xs font-bold text-[#123D2D] uppercase tracking-wider block mb-2">
            {t("farmer.selectCentreLabel")}
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {centres.map((c) => (
              <div
                key={c.id}
                onClick={() => setSelectedCentreId(c.id)}
                className={
                  "p-3 rounded-xl border cursor-pointer transition-all text-xs " +
                  (selectedCentreId === c.id
                    ? "bg-[#EEF5EF] border-[#2F7D4A] ring-2 ring-[#2F7D4A]/20"
                    : "bg-white border-[#E4E9E5] hover:border-[#66736B]/40")
                }
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#17211B]">{formatLocation(c.name.split(" - ")[0])}</span>
                  {c.isRecommended && (
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-[#EEF5EF] text-[#123D2D] border border-[#58A66B]/30">
                      {t("common.recommended")}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between text-[#66736B] text-[11px] mt-1 font-sans tabular-nums">
                  <span>{c.distanceKm} {t("common.km")}</span>
                  <span className="font-semibold text-[#17211B]">{c.predictedWaitMinutes} {t("common.min")}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-[#123D2D] uppercase tracking-wider block mb-2">
            {t("farmer.selectDateLabel")}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {dates.map((d) => (
              <button
                key={d.value}
                type="button"
                onClick={() => setSelectedDate(d.value)}
                className={
                  "p-2.5 rounded-xl border text-xs font-semibold text-center cursor-pointer transition-all " +
                  (selectedDate === d.value
                    ? "bg-[#123D2D] text-white border-[#123D2D] shadow-xs"
                    : "bg-white text-[#17211B] border-[#E4E9E5] hover:bg-[#F6F8F4]")
                }
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-[#123D2D] uppercase tracking-wider block mb-2">
            {t("farmer.selectTimeLabel")}
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {timeslots.map((slot) => (
              <div
                key={slot.time}
                onClick={() => setSelectedTime(slot.time)}
                className={
                  "p-3 rounded-xl border cursor-pointer transition-all " +
                  (selectedTime === slot.time
                    ? "bg-[#EEF5EF] border-[#2F7D4A] ring-2 ring-[#2F7D4A]/20"
                    : "bg-white border-[#E4E9E5] hover:border-[#66736B]/40")
                }
              >
                <p className="text-xs font-bold text-[#17211B] font-sans tabular-nums">{formatTimeSlot(slot.time)}</p>
                <div className="flex items-center justify-between mt-1 text-[10px]">
                  <span className="text-[#66736B]">
                    {t("farmer.estWaiting")}: <strong>{slot.wait}</strong>
                  </span>
                  <span
                    className={
                      "px-1.5 py-0.5 rounded font-semibold " +
                      (slot.loadType === "low"
                        ? "bg-[#EEF5EF] text-[#123D2D]"
                        : slot.loadType === "mod"
                        ? "bg-[#F0F5FA] text-[#24538F]"
                        : "bg-[#FEF5E7] text-[#9A6210]")
                    }
                  >
                    {slot.load}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E4E9E5]">
          <Button variant="outline" size="sm" onClick={onClose}>
            {t("common.cancel")}
          </Button>
          <Button variant="primary" size="sm" onClick={handleConfirm}>
            {isHindi ? "नया स्लॉट सुरक्षित करें" : "Confirm New Appointment Slot"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};