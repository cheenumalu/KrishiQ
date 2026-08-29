import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useKrishiQ } from "../../context/KrishiQContext";
import { CropType } from "../../types";
import { CROP_MSP_RATES } from "../../data/mockData";
import { formatCurrency, formatQuintals } from "../../utils/calculations";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Building2,
  ArrowRight,
  FileText
} from "lucide-react";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";

export const FarmerBookSlot: React.FC = () => {
  const { centres, bookSlot, farmerBooking } = useKrishiQ();
  const navigate = useNavigate();

  const [selectedCentreId, setSelectedCentreId] = useState<string>("centre-b");
  const [selectedCrop, setSelectedCrop] = useState<CropType>("Wheat");
  const [variety, setVariety] = useState("Sharbati (Grade A)");
  const [quantityQuintals, setQuantityQuintals] = useState<number>(65);
  const [selectedDate, setSelectedDate] = useState("29 August 2026 (Today)");
  const [selectedTime, setSelectedTime] = useState("11:30�12:00");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [generatedToken, setGeneratedToken] = useState("A127");

  const dates = [
    "29 August 2026 (Today)",
    "30 August 2026 (Tomorrow)",
    "01 September 2026 (Monday)",
    "02 September 2026 (Tuesday)",
  ];

  const slots = [
    "10:00�10:30",
    "10:30�11:00",
    "11:00�11:30",
    "11:30�12:00",
    "02:00�02:30",
    "02:30�03:00",
  ];

  const targetCentre = centres.find((c) => c.id === selectedCentreId) || centres[0];
  const mspRate = CROP_MSP_RATES[selectedCrop] || 2275;
  const estimatedGrossMSP = quantityQuintals * mspRate;

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    const token = "A127";
    setGeneratedToken(token);
    bookSlot(selectedCentreId, selectedCrop, variety, quantityQuintals, selectedDate, selectedTime);
    setIsSuccessModalOpen(true);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16 px-1">
      
      {/* Official Header */}
      <div className="space-y-0.5 pb-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Book Procurement Appointment Slot
        </h1>
        <p className="text-sm text-slate-600 font-medium">
          Select your centre, date, and appointment window to eliminate waiting time at the Mandi.
        </p>
      </div>

      <form onSubmit={handleBook} className="space-y-5">
        
        {/* Step 1: Select Centre */}
        <Card padding="lg" className="border-slate-300 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-xs uppercase font-extrabold tracking-wider text-slate-800">
              1. Select Procurement Centre
            </span>
            <span className="text-xs text-slate-500">Choose authorized Mandi</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {centres.slice(0, 4).map((c) => {
              const isSelected = selectedCentreId === c.id;
              const isRec = c.isRecommended;

              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedCentreId(c.id)}
                  className={
                    "p-3.5 rounded-lg border cursor-pointer transition-colors relative " +
                    (isSelected
                      ? "bg-emerald-50/70 border-emerald-700 ring-2 ring-emerald-700/20"
                      : "bg-white border-slate-300 hover:border-slate-400")
                  }
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-slate-900">{c.name.split(" (")[0]}</span>
                    {isRec && (
                      <span className="px-2 py-0.2 rounded text-[10px] font-bold bg-emerald-800 text-white">
                        RECOMMENDED
                      </span>
                    )}
                  </div>
                  <p className="text-slate-500 text-[11px] mt-0.5">{c.distanceKm} km away � {c.district}</p>
                  <div className="flex justify-between mt-2 pt-2 border-t border-slate-200 text-[11px]">
                    <span>Current queue: <strong>{c.currentQueueCount} farmers</strong></span>
                    <span>Wait: <strong className={isRec ? "text-emerald-800" : ""}>{c.predictedWaitMinutes} min</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Step 2: Select Date */}
        <Card padding="lg" className="border-slate-300 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-xs uppercase font-extrabold tracking-wider text-slate-800">
              2. Select Date
            </span>
            <span className="text-xs text-slate-500">Operating days</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 text-xs">
            {dates.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setSelectedDate(d)}
                className={
                  "p-3 rounded-lg border text-left font-medium transition-colors cursor-pointer " +
                  (selectedDate === d
                    ? "bg-emerald-800 text-white border-emerald-800 font-bold"
                    : "bg-white text-slate-800 border-slate-300 hover:bg-slate-50")
                }
              >
                {d}
              </button>
            ))}
          </div>
        </Card>

        {/* Step 3: Select Time Window */}
        <Card padding="lg" className="border-slate-300 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-xs uppercase font-extrabold tracking-wider text-slate-800">
              3. Select Time Window
            </span>
            <span className="text-xs text-slate-500">Available appointment slots</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs font-mono">
            {slots.map((slot) => {
              const isSelected = selectedTime === slot;

              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setSelectedTime(slot)}
                  className={
                    "p-3 rounded-lg border text-center font-bold transition-colors cursor-pointer text-sm " +
                    (isSelected
                      ? "bg-emerald-800 text-white border-emerald-800 shadow-xs"
                      : "bg-white text-slate-800 border-slate-300 hover:bg-slate-50")
                  }
                >
                  {slot}
                </button>
              );
            })}
          </div>
        </Card>

        {/* Step 4: Crop & Lot Details Confirmation */}
        <Card padding="lg" className="border-slate-300 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200">
            <span className="text-xs uppercase font-extrabold tracking-wider text-slate-800">
              4. Lot Details & Confirmation
            </span>
            <span className="text-xs text-slate-500">MSP Rate: ?{mspRate}/Qtl</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-slate-600 block mb-1 font-semibold">Crop Type</label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value as CropType)}
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-bold text-slate-800"
              >
                <option value="Wheat">Wheat (MSP: ?2,275/Qtl)</option>
                <option value="Paddy">Paddy (MSP: ?2,300/Qtl)</option>
                <option value="Soybean">Soybean (MSP: ?4,892/Qtl)</option>
                <option value="Maize">Maize (MSP: ?2,090/Qtl)</option>
              </select>
            </div>

            <div>
              <label className="text-slate-600 block mb-1 font-semibold">Variety</label>
              <input
                type="text"
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-white text-slate-800"
                required
              />
            </div>

            <div>
              <label className="text-slate-600 block mb-1 font-semibold">Quantity (Quintals)</label>
              <input
                type="number"
                min="5"
                max="500"
                value={quantityQuintals}
                onChange={(e) => setQuantityQuintals(Number(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-slate-300 bg-white font-mono font-bold text-slate-800"
                required
              />
            </div>
          </div>

          <div className="p-3 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-between text-xs">
            <span>Estimated MSP Direct Benefit Transfer:</span>
            <strong className="text-sm font-mono font-bold text-slate-900">
              {formatCurrency(estimatedGrossMSP)}
            </strong>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="outline" size="md" onClick={() => navigate("/farmer/dashboard")}>
              Cancel
            </Button>
            <Button variant="primary" size="lg" type="submit" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Confirm Booking
            </Button>
          </div>
        </Card>

      </form>

      {/* Success Modal */}
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => {
          setIsSuccessModalOpen(false);
          navigate("/farmer/queue");
        }}
        title="Appointment Booking Confirmed"
        subtitle="Your slot is registered in the Mandi procurement system"
        maxWidth="md"
      >
        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-lg bg-emerald-900 text-white text-center">
            <span className="text-[11px] text-emerald-200 uppercase font-bold tracking-wider block">Assigned Token Number</span>
            <p className="text-3xl font-extrabold font-mono text-white mt-1">A127</p>
            <span className="text-xs text-emerald-200 block mt-1">{targetCentre.name}</span>
          </div>

          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5 text-slate-700">
            <div className="flex justify-between"><span>Date:</span><strong className="text-slate-900">{selectedDate}</strong></div>
            <div className="flex justify-between"><span>Slot:</span><strong className="text-slate-900">{selectedTime}</strong></div>
            <div className="flex justify-between"><span>Lot:</span><strong className="text-slate-900">{quantityQuintals} Qtl {selectedCrop}</strong></div>
          </div>

          <div className="flex justify-end pt-2">
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                setIsSuccessModalOpen(false);
                navigate("/farmer/queue");
              }}
            >
              Go to Live Queue Tracker ?
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};