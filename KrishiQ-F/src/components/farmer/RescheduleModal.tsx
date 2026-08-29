import React, { useState } from "react";
import { Modal } from "../common/Modal";
import { useKrishiQ } from "../../context/KrishiQContext";
import { AlertTriangle } from "lucide-react";
import { Button } from "../common/Button";

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RescheduleModal: React.FC<RescheduleModalProps> = ({ isOpen, onClose }) => {
  const { centres, farmerBooking, rescheduleSlot } = useKrishiQ();

  const [selectedCentreId, setSelectedCentreId] = useState(farmerBooking.centreId);
  const [selectedDate, setSelectedDate] = useState("Tomorrow (30 Aug 2026)");
  const [selectedTime, setSelectedTime] = useState("09:00 AM - 10:00 AM");

  const dates = ["Today (29 Aug 2026)", "Tomorrow (30 Aug 2026)", "Monday (01 Sep 2026)", "Tuesday (02 Sep 2026)"];
  const timeslots = [
    { time: "08:00 AM - 09:00 AM", wait: "22 min", load: "Low" },
    { time: "09:00 AM - 10:00 AM", wait: "38 min", load: "Moderate" },
    { time: "10:00 AM - 11:00 AM", wait: "55 min", load: "Peak" },
    { time: "11:00 AM - 12:00 PM", wait: "62 min", load: "Peak" },
    { time: "02:00 PM - 03:00 PM", wait: "30 min", load: "Low" },
    { time: "03:00 PM - 04:00 PM", wait: "25 min", load: "Low" },
  ];

  const handleConfirm = () => {
    rescheduleSlot(selectedCentreId, selectedDate, selectedTime);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Reschedule Appointment Slot"
      subtitle="Select a new time window or alternative procurement centre"
      maxWidth="lg"
    >
      <div className="space-y-5">
        <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-900">
            <strong className="font-semibold">Dynamic Waiting Time Notice: </strong>
            Changing your slot date or time window will dynamically recalculate your predicted queue wait time based on forecasted Mandi arrivals.
          </div>
        </div>

        <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs">
          <span className="text-slate-500">Current Slot:</span>
          <p className="font-bold text-slate-900">
            {farmerBooking.centreName} � {farmerBooking.slotDate} ({farmerBooking.slotTime})
          </p>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
            1. Select Procurement Centre
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {centres.map((c) => (
              <div
                key={c.id}
                onClick={() => setSelectedCentreId(c.id)}
                className={
                  "p-3 rounded-xl border cursor-pointer transition-all text-xs " +
                  (selectedCentreId === c.id
                    ? "bg-emerald-50 border-emerald-500 ring-2 ring-emerald-500/20"
                    : "bg-white border-slate-200 hover:border-slate-300")
                }
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{c.name.split(" - ")[0]}</span>
                  {c.isRecommended && (
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800">
                      Recommended
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between text-slate-500 text-[11px] mt-1">
                  <span>{c.distanceKm} km away</span>
                  <span className="font-semibold text-slate-700">{c.predictedWaitMinutes} min wait</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
            2. Select Date
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {dates.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setSelectedDate(d)}
                className={
                  "p-2.5 rounded-lg border text-xs font-semibold text-center cursor-pointer transition-all " +
                  (selectedDate === d
                    ? "bg-emerald-800 text-white border-emerald-800 shadow-xs"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50")
                }
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
            3. Select Time Window (Predicted Wait Times)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {timeslots.map((slot) => (
              <div
                key={slot.time}
                onClick={() => setSelectedTime(slot.time)}
                className={
                  "p-3 rounded-lg border cursor-pointer transition-all " +
                  (selectedTime === slot.time
                    ? "bg-emerald-50 border-emerald-600 ring-2 ring-emerald-500/20"
                    : "bg-white border-slate-200 hover:border-slate-300")
                }
              >
                <p className="text-xs font-bold text-slate-900">{slot.time}</p>
                <div className="flex items-center justify-between mt-1 text-[10px]">
                  <span className="text-slate-500">Wait: <strong>{slot.wait}</strong></span>
                  <span
                    className={
                      "px-1.5 py-0.2 rounded font-semibold " +
                      (slot.load === "Low"
                        ? "bg-emerald-100 text-emerald-800"
                        : slot.load === "Moderate"
                        ? "bg-sky-100 text-sky-800"
                        : "bg-amber-100 text-amber-800")
                    }
                  >
                    {slot.load}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" size="sm" onClick={handleConfirm}>
            Confirm New Appointment Slot
          </Button>
        </div>
      </div>
    </Modal>
  );
};