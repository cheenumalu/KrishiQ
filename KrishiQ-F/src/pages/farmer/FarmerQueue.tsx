import React, { useState } from "react";
import { useKrishiQ } from "../../context/KrishiQContext";
import { useLanguage } from "../../i18n";
import { TokenSlipModal } from "../../components/farmer/TokenSlipModal";
import { RescheduleModal } from "../../components/farmer/RescheduleModal";
import {
  Clock,
  CheckCircle2,
  FileText
} from "lucide-react";
import { Card } from "../../components/common/Card";
import { Button } from "../../components/common/Button";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from "recharts";

export const FarmerQueue: React.FC = () => {
  const { farmerBooking, addToast } = useKrishiQ();
  const { t, isHindi, formatLocation, formatTimeSlot } = useLanguage();
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);

  // Local demo simulation state
  const [simulationStep, setSimulationStep] = useState<number>(0);

  const queueMovementData = [
    { time: "10:30", ahead: 12 },
    { time: "10:40", ahead: 9 },
    { time: "10:50", ahead: 6 },
    { time: "11:00", ahead: Math.max(0, 3 - simulationStep) },
  ];

  const simulatedServingToken = simulationStep === 0 ? "A124" : simulationStep === 1 ? "A125" : simulationStep === 2 ? "A126" : "A127";
  const simulatedFarmersAhead = Math.max(0, 3 - simulationStep);
  const simulatedWaitTime = Math.max(0, 24 - simulationStep * 8);

  const handleSimulateUpdate = () => {
    if (simulationStep < 3) {
      const nextStep = simulationStep + 1;
      setSimulationStep(nextStep);
      if (nextStep === 1) {
        addToast(
          isHindi ? "कतार आगे बढ़ी" : "Queue Advanced",
          isHindi ? "टोकन A124 पूर्ण हुआ। टोकन A125 बुलाया गया। आपसे पहले 2 किसान हैं।" : "Token A124 completed. Token A125 called. 2 farmers ahead.",
          "info"
        );
      } else if (nextStep === 2) {
        addToast(
          isHindi ? "कतार आगे बढ़ी" : "Queue Advanced",
          isHindi ? "टोकन A125 पूर्ण हुआ। टोकन A126 बुलाया गया। केवल 1 किसान आगे है!" : "Token A125 completed. Token A126 called. Only 1 farmer ahead!",
          "warning"
        );
      } else if (nextStep === 3) {
        addToast(
          isHindi ? "आपकी बारी है!" : "Your Turn!",
          isHindi ? "टोकन A127 (राजेश) को कांटा नंबर 1 पर बुलाया गया। कृपया गेट 1 पर जाएँ!" : "Token A127 (Rajesh) called to Weighbridge. Please proceed to Gate 1!",
          "success"
        );
      }
    } else {
      setSimulationStep(0);
      addToast(
        isHindi ? "सिमुलेशन रीसेट" : "Queue Reset",
        isHindi ? "कतार की स्थिति सामान्य पर रीसेट हो गई।" : "Simulation returned to baseline queue state.",
        "info"
      );
    }
  };

  const queueList = [
    { token: "A121", name: isHindi ? "हरीश पटेल" : "Harish Patel", crop: isHindi ? "गेहूँ 45 क्विंटल" : "Wheat 45 Qtl", status: "completed" },
    { token: "A122", name: isHindi ? "सुरेश चौहान" : "Suresh Chouhan", crop: isHindi ? "गेहूँ 80 क्विंटल" : "Wheat 80 Qtl", status: "completed" },
    { token: "A123", name: isHindi ? "विक्रम वर्मा" : "Vikram Verma", crop: isHindi ? "सोयाबीन 50 क्विंटल" : "Soybean 50 Qtl", status: "completed" },
    {
      token: "A124",
      name: isHindi ? "रामेश्वर गुर्जर" : "Rameshwar Gurjar",
      crop: isHindi ? "गेहूँ 72 क्विंटल" : "Wheat 72 Qtl",
      status: simulationStep > 0 ? "completed" : "serving",
    },
    {
      token: "A125",
      name: isHindi ? "बलवंत सिंह" : "Balwant Singh",
      crop: isHindi ? "गेहूँ 60 क्विंटल" : "Wheat 60 Qtl",
      status: simulationStep >= 2 ? "completed" : simulationStep === 1 ? "serving" : "waiting",
    },
    {
      token: "A126",
      name: isHindi ? "देवेंद्र राठौड़" : "Devendra Rathore",
      crop: isHindi ? "मक्का 40 क्विंटल" : "Maize 40 Qtl",
      status: simulationStep >= 3 ? "completed" : simulationStep === 2 ? "serving" : "waiting",
    },
    {
      token: "A127",
      name: isHindi ? "राजेश (आप)" : "Rajesh (You)",
      crop: isHindi ? "शरबती गेहूँ 65 क्विंटल" : "Sharbati Wheat 65 Qtl",
      status: simulationStep === 3 ? "serving" : "user",
      isUser: true,
    },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16 px-1">
      
      {/* Official Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-1 border-b border-[#E4E9E5]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#17211B] tracking-tight">
            {t("farmer.queuePageHeading")}
          </h1>
          <div className="flex items-center gap-2 text-xs text-[#66736B] mt-1">
            <span>
              {isHindi ? "केंद्र:" : "Centre:"} <strong className="text-[#17211B]">{formatLocation("Shivaji Nagar Procurement Centre")}</strong>
            </span>
            <span>•</span>
            <span className="inline-flex items-center gap-1 text-[#2F7D4A] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#2F7D4A] animate-pulse" />
              {isHindi ? "सामान्य परिचालन चालू" : "Operating normally"}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSimulateUpdate}
          >
            {simulationStep < 3
              ? (isHindi ? "कतार आगे बढ़ाएँ (+1)" : "Simulate Queue Update (+1)")
              : (isHindi ? "सिमुलेशन रीसेट" : "Reset Simulation")}
          </Button>

          <Button
            variant="outline"
            size="sm"
            leftIcon={<FileText className="w-4 h-4" />}
            onClick={() => setIsTokenModalOpen(true)}
          >
            {t("farmer.viewGateSlip")}
          </Button>
        </div>
      </div>

      {/* 4 Large Clean Status Metric Panels */}
      <Card padding="lg" className="border-[#E4E9E5] card-shadow space-y-4">
        
        <div className="flex items-center justify-between pb-2 border-b border-[#E4E9E5]">
          <span className="text-xs uppercase font-extrabold tracking-wider text-[#123D2D]">
            {isHindi ? "आपकी कतार स्थिति" : "YOUR QUEUE POSITION"}
          </span>
          <span className="text-xs text-[#66736B] font-sans">
            {t("farmer.updatedJustNow")}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          
          <div className="p-4 rounded-xl bg-[#123D2D] text-white shadow-xs">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#58A66B] block">
              {t("farmer.yourToken")}
            </span>
            <p className="text-3xl font-extrabold font-sans mt-1 text-white tabular-nums">A127</p>
            <span className="text-[11px] text-white/80 block mt-0.5">
              {isHindi ? "राजेश (65 क्विंटल)" : "Rajesh (65 Qtl)"}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#F6F8F4] border border-[#E4E9E5]">
            <span className="text-xs text-[#66736B] block uppercase text-[10px] font-semibold">
              {t("farmer.nowServing")}
            </span>
            <p className="text-2xl font-extrabold text-[#F2A93B] mt-1 font-sans tabular-nums">{simulatedServingToken}</p>
            <span className="text-[11px] text-[#66736B] block mt-0.5">
              {isHindi ? "तौल कांटा 1" : "Weighbridge 1"}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#F6F8F4] border border-[#E4E9E5]">
            <span className="text-xs text-[#66736B] block uppercase text-[10px] font-semibold">
              {isHindi ? "आपसे पहले किसान" : "FARMERS AHEAD"}
            </span>
            <p className="text-2xl font-extrabold text-[#17211B] mt-1 font-sans tabular-nums">{simulatedFarmersAhead}</p>
            <span className="text-[11px] text-[#66736B] block mt-0.5">
              {isHindi ? "कतार में आगे" : "in line before you"}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-[#EEF5EF] border border-[#58A66B]/30">
            <span className="text-xs text-[#123D2D] font-semibold block uppercase text-[10px]">
              {t("farmer.estWaiting")}
            </span>
            <p className="text-2xl font-extrabold text-[#123D2D] mt-1 font-sans tabular-nums">
              {simulatedWaitTime} {t("common.min").toUpperCase()}
            </p>
            <span className="text-[11px] text-[#2F7D4A] block mt-0.5">
              {isHindi ? "संभावित समय:" : "Expected:"} {formatTimeSlot("11:42 AM")}
            </span>
          </div>

        </div>

        {/* Helpful Proactive Reminder */}
        <div className="p-3 rounded-xl bg-[#FEF5E7] border border-[#F2A93B]/40 text-xs text-[#9A6210] flex items-start gap-2.5">
          <Clock className="w-4 h-4 text-[#F2A93B] shrink-0 mt-0.5" />
          <p className="font-medium leading-relaxed">
            {isHindi
              ? "आपकी बारी जल्द आने वाली है। कृपया 15 मिनट के भीतर खरीदी केंद्र पहुँचें।"
              : "Your turn is approaching. Please be at the procurement centre within 15 minutes."}
          </p>
        </div>

      </Card>

      {/* Queue Sequence List */}
      <Card padding="lg" className="border-[#E4E9E5] card-shadow space-y-3">
        
        <div className="flex items-center justify-between pb-2 border-b border-[#E4E9E5]">
          <span className="text-xs uppercase font-extrabold tracking-wider text-[#123D2D]">
            {isHindi ? "गेट प्रवेश क्रम (टोकन A121 - A127)" : "GATE ENTRY ORDER (TOKENS A121 - A127)"}
          </span>
          <span className="text-xs text-[#66736B]">
            {formatLocation("Shivaji Nagar Centre")}
          </span>
        </div>

        <div className="space-y-2 text-xs">
          {queueList.map((item) => {
            const isUser = item.isUser;
            const isCompleted = item.status === "completed";
            const isServing = item.status === "serving";

            return (
              <div
                key={item.token}
                className={
                  "flex items-center justify-between p-3 rounded-xl border transition-colors " +
                  (isUser
                    ? "bg-[#EEF5EF] border-[#2F7D4A] ring-1 ring-[#2F7D4A]/20 font-semibold"
                    : isServing
                    ? "bg-[#FEF5E7] border-[#F2A93B]/40 font-medium"
                    : isCompleted
                    ? "bg-[#F6F8F4] border-[#E4E9E5] text-[#66736B]"
                    : "bg-white border-[#E4E9E5]")
                }
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 font-bold text-center">
                    {isCompleted ? "✓" : isServing ? "●" : "○"}
                  </span>
                  <div>
                    <div className="flex items-center gap-2">
                      <strong className="font-sans text-[#17211B]">{item.token}</strong>
                      <span className="text-[#17211B]">{item.name}</span>
                    </div>
                    <span className="text-[11px] text-[#66736B]">{item.crop}</span>
                  </div>
                </div>

                <div className="text-right">
                  {isCompleted && (
                    <span className="text-[#66736B] font-medium">
                      ✓ {isHindi ? "पूर्ण" : "Completed"}
                    </span>
                  )}
                  {isServing && (
                    <span className="text-[#9A6210] font-bold bg-[#FEF5E7] px-2 py-0.5 rounded-lg border border-[#F2A93B]/30">
                      ● {isHindi ? "अभी सेवा में" : "Currently serving"}
                    </span>
                  )}
                  {!isCompleted && !isServing && !isUser && (
                    <span className="text-[#66736B]">
                      ○ {isHindi ? "प्रतीक्षा में" : "Waiting"}
                    </span>
                  )}
                  {isUser && !isServing && (
                    <span className="text-[#123D2D] font-bold bg-[#EEF5EF] px-2 py-0.5 rounded-lg border border-[#58A66B]/30">
                      ● {isHindi ? "आप (लगभग 24 मिनट)" : "You (~24 min)"}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

      </Card>

      {/* Reschedule Option */}
      <Card padding="md" className="border-[#E4E9E5] bg-[#F6F8F4]">
        <div className="flex flex-wrap items-center justify-between gap-4 text-xs">
          <div>
            <strong className="text-[#17211B] block text-sm">
              {isHindi ? "पहुँचने का समय बदलना चाहते हैं?" : "Need to change your arrival time?"}
            </strong>
            <p className="text-[#66736B] mt-0.5">
              {isHindi
                ? "यदि आप समय पर केंद्र नहीं पहुँच पा रहे हैं, तो दूसरा उपलब्ध समय स्लॉट चुन सकते हैं।"
                : "If you cannot reach the centre on time, you can select another available slot."}
            </p>
          </div>

          <Button
            variant="secondary"
            size="md"
            onClick={() => setIsRescheduleOpen(true)}
          >
            {t("farmer.reschedule")}
          </Button>
        </div>
      </Card>

      {/* Modals */}
      <TokenSlipModal
        isOpen={isTokenModalOpen}
        onClose={() => setIsTokenModalOpen(false)}
        booking={farmerBooking}
      />
      <RescheduleModal
        isOpen={isRescheduleOpen}
        onClose={() => setIsRescheduleOpen(false)}
      />

    </div>
  );
};