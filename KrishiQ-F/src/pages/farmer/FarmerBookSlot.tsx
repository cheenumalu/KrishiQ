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
  FileText,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";

export const FarmerBookSlot: React.FC = () => {
  const { centres, bookSlot, selectedCentre } = useKrishiQ();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedCentreId, setSelectedCentreId] = useState<string>(selectedCentre.id || "centre-b");
  const [selectedCrop, setSelectedCrop] = useState<CropType>("Wheat");
  const [variety, setVariety] = useState("Sharbati (Grade A)");
  const [quantityQuintals, setQuantityQuintals] = useState<number>(65);
  const [selectedDate, setSelectedDate] = useState("29 August 2026 (Today)");
  const [selectedTime, setSelectedTime] = useState("11:30 - 12:00");
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [generatedToken, setGeneratedToken] = useState("A-127");

  const dates = [
    "29 August 2026 (Today)",
    "30 August 2026 (Tomorrow)",
    "01 September 2026 (Monday)",
    "02 September 2026 (Tuesday)",
  ];

  const slots = [
    "10:00 - 10:30",
    "10:30 - 11:00",
    "11:00 - 11:30",
    "11:30 - 12:00",
    "02:00 - 02:30",
    "02:30 - 03:00",
  ];

  const targetCentre = centres.find((c) => c.id === selectedCentreId) || centres[0];
  const mspRate = CROP_MSP_RATES[selectedCrop] || 2275;
  const estimatedGrossMSP = quantityQuintals * mspRate;

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    const token = "A-" + (125 + Math.floor(Math.random() * 10));
    setGeneratedToken(token);
    bookSlot(selectedCentreId, selectedCrop, variety, quantityQuintals, selectedDate, selectedTime);
    setIsSuccessModalOpen(true);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      
      {/* Header */}
      <div className="space-y-1 pb-2 border-b border-[#E5EAE6]">
        <div className="flex items-center gap-2">
          <Badge variant="normal">Step-by-Step Booking</Badge>
          <span className="text-xs text-[#66736B]">Instant Token Allocation</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-[#17211B] tracking-tight">
          Book Procurement Appointment Slot
        </h1>
        <p className="text-xs sm:text-sm text-[#66736B]">
          Schedule your mandi arrival window to eliminate waiting queues and ensure immediate weighbridge intake.
        </p>
      </div>

      {/* 4-STEP STEPPER PROGRESS INDICATOR */}
      <div className="grid grid-cols-4 gap-2 sm:gap-4 text-xs font-semibold text-center">
        {[
          { step: 1, label: "1 Select Centre" },
          { step: 2, label: "2 Select Date" },
          { step: 3, label: "3 Select Slot" },
          { step: 4, label: "4 Confirm" },
        ].map((item) => (
          <div
            key={item.step}
            onClick={() => setCurrentStep(item.step)}
            className={`p-3 rounded-2xl border transition-all cursor-pointer ${
              currentStep === item.step
                ? "bg-[#123D2D] text-white border-[#123D2D] shadow-xs"
                : currentStep > item.step
                ? "bg-[#EEF5EF] text-[#123D2D] border-[#58A66B]/30 font-bold"
                : "bg-white text-[#66736B] border-[#E5EAE6]"
            }`}
          >
            <span className="block truncate">{item.label}</span>
          </div>
        ))}
      </div>

      <form onSubmit={handleBook} className="space-y-6">
        
        {/* Step 1: Select Centre */}
        <Card padding="lg" className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5EAE6]">
            <div className="flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#2F7D4A]" />
              <span className="text-xs uppercase font-extrabold tracking-wider text-[#123D2D]">
                1. Select Procurement Centre
              </span>
            </div>
            <span className="text-xs text-[#66736B]">Indore Mandi Network</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
            {centres.slice(0, 4).map((c) => {
              const isSelected = selectedCentreId === c.id;
              const isRec = c.isRecommended;

              return (
                <div
                  key={c.id}
                  onClick={() => {
                    setSelectedCentreId(c.id);
                    setCurrentStep(2);
                  }}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-[#EEF5EF] border-[#2F7D4A] ring-2 ring-[#2F7D4A]/20"
                      : "bg-white border-[#E5EAE6] hover:border-[#66736B]/40"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#17211B]">{c.name.split(" (")[0]}</span>
                    {isRec && <Badge variant="success">Recommended</Badge>}
                  </div>
                  <p className="text-[#66736B] text-[11px] mt-1">{c.distanceKm} km away • {c.district}</p>
                  <div className="flex justify-between mt-3 pt-2 border-t border-[#E5EAE6] text-[11px] font-mono">
                    <span>Queue: <strong className="text-[#17211B]">{c.currentQueueCount} farmers</strong></span>
                    <span>Wait: <strong className={isRec ? "text-[#2F7D4A] font-bold" : "text-[#17211B]"}>{c.predictedWaitMinutes} min</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Step 2: Select Date */}
        <Card padding="lg" className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5EAE6]">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#2F7D4A]" />
              <span className="text-xs uppercase font-extrabold tracking-wider text-[#123D2D]">
                2. Select Date
              </span>
            </div>
            <span className="text-xs text-[#66736B]">Operating Days</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            {dates.map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => {
                  setSelectedDate(d);
                  setCurrentStep(3);
                }}
                className={`p-3.5 rounded-2xl border text-left font-medium transition-all cursor-pointer ${
                  selectedDate === d
                    ? "bg-[#123D2D] text-white border-[#123D2D] font-bold shadow-xs"
                    : "bg-white text-[#17211B] border-[#E5EAE6] hover:bg-[#F6F8F4]"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </Card>

        {/* Step 3: Select Time Window (Selectable Pills) */}
        <Card padding="lg" className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5EAE6]">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#2F7D4A]" />
              <span className="text-xs uppercase font-extrabold tracking-wider text-[#123D2D]">
                3. Select Appointment Time Window
              </span>
            </div>
            <span className="text-xs text-[#66736B]">30-Min Intake Window</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-mono">
            {slots.map((slot) => {
              const isSelected = selectedTime === slot;

              return (
                <button
                  key={slot}
                  type="button"
                  onClick={() => {
                    setSelectedTime(slot);
                    setCurrentStep(4);
                  }}
                  className={`p-3.5 rounded-2xl border text-center font-bold transition-all cursor-pointer text-sm ${
                    isSelected
                      ? "bg-[#2F7D4A] text-white border-[#2F7D4A] shadow-xs"
                      : "bg-white text-[#17211B] border-[#E5EAE6] hover:bg-[#EEF5EF]"
                  }`}
                >
                  {slot}
                </button>
              );
            })}
          </div>
        </Card>

        {/* Step 4: Lot & Confirmation */}
        <Card padding="lg" className="space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5EAE6]">
            <span className="text-xs uppercase font-extrabold tracking-wider text-[#123D2D]">
              4. Lot Details & Final Confirmation
            </span>
            <Badge variant="normal">MSP Rate: ₹{mspRate}/Qtl</Badge>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 text-xs">
            <div>
              <label className="text-[#66736B] block mb-1 font-semibold">Crop Type</label>
              <select
                value={selectedCrop}
                onChange={(e) => setSelectedCrop(e.target.value as CropType)}
                className="w-full p-3 rounded-xl border border-[#E5EAE6] bg-[#F6F8F4] font-bold text-[#17211B]"
              >
                <option value="Wheat">Wheat (MSP: ₹2,275/Qtl)</option>
                <option value="Paddy">Paddy (MSP: ₹2,300/Qtl)</option>
                <option value="Soybean">Soybean (MSP: ₹4,892/Qtl)</option>
                <option value="Maize">Maize (MSP: ₹2,090/Qtl)</option>
              </select>
            </div>

            <div>
              <label className="text-[#66736B] block mb-1 font-semibold">Variety</label>
              <input
                type="text"
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                className="w-full p-3 rounded-xl border border-[#E5EAE6] bg-[#F6F8F4] text-[#17211B]"
                required
              />
            </div>

            <div>
              <label className="text-[#66736B] block mb-1 font-semibold">Quantity (Quintals)</label>
              <input
                type="number"
                min="5"
                max="500"
                value={quantityQuintals}
                onChange={(e) => setQuantityQuintals(Number(e.target.value))}
                className="w-full p-3 rounded-xl border border-[#E5EAE6] bg-[#F6F8F4] font-mono font-bold text-[#17211B]"
                required
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#EEF5EF] border border-[#58A66B]/30 flex items-center justify-between text-xs">
            <span>Estimated MSP Direct Benefit Transfer (DBT):</span>
            <strong className="text-base font-mono font-bold text-[#123D2D]">
              {formatCurrency(estimatedGrossMSP)}
            </strong>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="outline" size="md" onClick={() => navigate("/farmer/dashboard")}>
              Cancel
            </Button>
            <Button variant="primary" size="lg" type="submit" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Confirm Booking & Generate Token
            </Button>
          </div>
        </Card>

      </form>

      {/* Confirmation Success Modal */}
      <Modal
        isOpen={isSuccessModalOpen}
        onClose={() => {
          setIsSuccessModalOpen(false);
          navigate("/farmer/queue");
        }}
        title="Appointment Booking Confirmed"
        subtitle="Your token is allocated in the Mandi procurement coordination engine"
        maxWidth="md"
      >
        <div className="space-y-5 text-xs">
          <div className="p-6 rounded-3xl bg-[#123D2D] text-white text-center space-y-1 shadow-sm">
            <span className="text-[11px] text-[#58A66B] uppercase font-bold tracking-wider block">Assigned Gate Token</span>
            <p className="text-4xl font-extrabold font-mono text-white mt-1">{generatedToken}</p>
            <span className="text-xs text-white/80 block">{targetCentre.name}</span>
          </div>

          <div className="p-4 rounded-2xl bg-[#F6F8F4] border border-[#E5EAE6] space-y-2 text-[#17211B]">
            <div className="flex justify-between"><span>Date:</span><strong className="font-semibold">{selectedDate}</strong></div>
            <div className="flex justify-between"><span>Time Window:</span><strong className="font-semibold font-mono">{selectedTime}</strong></div>
            <div className="flex justify-between"><span>Lot Quantity:</span><strong className="font-semibold font-mono">{quantityQuintals} Quintals {selectedCrop}</strong></div>
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
              Go to Live Queue Tracker →
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};