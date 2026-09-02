import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useKrishiQ } from "../../context/KrishiQContext";
import { TokenSlipModal } from "../../components/farmer/TokenSlipModal";
import { RescheduleModal } from "../../components/farmer/RescheduleModal";
import {
  Clock,
  MapPin,
  Calendar,
  Search,
  ArrowRight,
  FileText,
  Building2,
  Sparkles,
  Navigation,
  CheckCircle2,
  TrendingDown,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";

export const FarmerDashboard: React.FC = () => {
  const { farmerBooking, setSelectedCentreId, selectedCentre, centres } = useKrishiQ();
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const navigate = useNavigate();

  const recommendedCentre = centres.find((c) => c.isRecommended) || selectedCentre;

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      
      {/* 1. COMPACT HERO GREETING AREA (35-40% smaller height) */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-gradient-to-r from-[#123D2D] to-[#2F7D4A] p-5 sm:p-6 rounded-[18px] text-white shadow-sm relative overflow-hidden">
        <div className="space-y-2 max-w-[700px] relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-white text-[11px] font-semibold backdrop-blur-md">
              🌾 Wheat • Indore District
            </span>
            <span className="text-[12px] text-white/80 font-medium">Aadhaar Verified</span>
          </div>

          <h1 className="text-[30px] sm:text-[34px] font-bold tracking-[-0.025em] text-white leading-[1.12]">
            Good morning, Rajesh 👋
          </h1>
          <p className="text-sm text-white/90 leading-[1.45]">
            Let's find the best place to sell your wheat today with minimal waiting time.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-3 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/15 text-xs text-white shrink-0">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center font-bold text-white">
            KQ
          </div>
          <div>
            <span className="text-white/70 block text-[11px]">Registered Lot</span>
            <span className="font-semibold text-xs text-white block tabular-nums">65 Quintals (Sharbati)</span>
          </div>
        </div>
      </div>

      {/* 2. THREE PRIMARY QUICK ACTION CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        
        <Link to="/farmer/centres" className="group">
          <Card padding="md" hoverable className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EEF5EF] text-[#2F7D4A] flex items-center justify-center group-hover:bg-[#2F7D4A] group-hover:text-white transition-colors">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-[15px] text-[#17211B]">Find Best Centre</h3>
                <p className="text-[12px] text-[#66736B]">Compare live queue & distance</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#8A958E] group-hover:translate-x-1 transition-transform" />
          </Card>
        </Link>

        <Link to="/farmer/book-slot" className="group">
          <Card padding="md" hoverable className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EEF5EF] text-[#2F7D4A] flex items-center justify-center group-hover:bg-[#2F7D4A] group-hover:text-white transition-colors">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-[15px] text-[#17211B]">Book a Slot</h3>
                <p className="text-[12px] text-[#66736B]">Reserve appointment window</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#8A958E] group-hover:translate-x-1 transition-transform" />
          </Card>
        </Link>

        <Link to="/farmer/queue" className="group">
          <Card padding="md" hoverable className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#EEF5EF] text-[#2F7D4A] flex items-center justify-center group-hover:bg-[#2F7D4A] group-hover:text-white transition-colors">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-[15px] text-[#17211B]">Track Queue</h3>
                <p className="text-[12px] text-[#66736B]">Token #{farmerBooking.tokenNumber} status</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-[#8A958E] group-hover:translate-x-1 transition-transform" />
          </Card>
        </Link>

      </div>

      {/* 3. SMART RECOMMENDATION SECTION + MAP (40 / 60 SPLIT) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#2F7D4A]" />
            <h2 className="text-[17px] font-bold text-[#17211B] tracking-[-0.01em]">
              Recommended Procurement Centre
            </h2>
          </div>
          <span className="text-xs text-[#66736B] hidden sm:inline">AI-powered travel & queue balancer</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          
          {/* 40% Recommendation Card */}
          <Card padding="md" className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              
              {/* Tags */}
              <div className="flex flex-wrap items-center gap-1.5">
                <Badge variant="success" dot size="sm">Recommended</Badge>
                <Badge variant="info" size="sm">Low Queue</Badge>
                <Badge variant="neutral" size="sm">Closest</Badge>
              </div>

              <div>
                <h3 className="text-[18px] font-bold text-[#17211B] leading-snug">
                  {recommendedCentre.name}
                </h3>
                <p className="text-xs text-[#66736B] mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#2F7D4A] shrink-0" />
                  <span>{recommendedCentre.distanceKm} km away from your village</span>
                </p>
              </div>

              {/* Metric grid (tabular-nums font-sans) */}
              <div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-[#EEF5EF] border border-[#58A66B]/20 text-xs">
                <div>
                  <span className="text-[#66736B] block font-medium">Est. Waiting</span>
                  <strong className="text-[18px] font-bold text-[#123D2D] block mt-0.5 tabular-nums font-sans">
                    {recommendedCentre.predictedWaitMinutes} min
                  </strong>
                </div>
                <div>
                  <span className="text-[#66736B] block font-medium">Current Queue</span>
                  <strong className="text-[18px] font-bold text-[#17211B] block mt-0.5 tabular-nums font-sans">
                    {recommendedCentre.currentQueueCount} farmers
                  </strong>
                </div>
              </div>

              {/* Time saved callout */}
              <div className="p-3 rounded-xl bg-[#FEF5E7] border border-[#F2A93B]/30 text-xs text-[#9A6210] flex items-center gap-2.5">
                <TrendingDown className="w-4 h-4 text-[#F2A93B] shrink-0" />
                <div>
                  <span className="font-bold block text-[13px]">Save approx. 2h 13m</span>
                  <span className="text-[11px] text-[#66736B]">Compared with Dhar Road Centre (heavy surge)</span>
                </div>
              </div>

            </div>

            {/* Buttons */}
            <div className="flex items-center gap-2.5 pt-1">
              <Button
                variant="primary"
                size="md"
                className="flex-1"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={() => {
                  setSelectedCentreId(recommendedCentre.id);
                  navigate("/farmer/book-slot");
                }}
              >
                Book Slot
              </Button>

              <Button
                variant="outline"
                size="md"
                leftIcon={<Navigation className="w-4 h-4" />}
                onClick={() => navigate("/farmer/centres")}
              >
                View Route
              </Button>
            </div>
          </Card>

          {/* 60% Interactive Map */}
          <Card padding="none" className="lg:col-span-7 flex flex-col h-[340px] overflow-hidden relative">
            <div className="px-4 h-11 bg-[#123D2D] text-white flex items-center justify-between text-xs font-semibold z-10 shrink-0">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#58A66B]" />
                <span>Live District Procurement Map</span>
              </div>
              <span className="text-white/70 text-[11px]">Indore Division</span>
            </div>

            <div className="relative flex-1 bg-[#17211B] overflow-hidden select-none">
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                <line x1="45%" y1="50%" x2="62%" y2="38%" stroke="#58A66B" strokeWidth="2" strokeDasharray="4" />
                <line x1="45%" y1="50%" x2="32%" y2="64%" stroke="#D95555" strokeWidth="2" />
                <line x1="45%" y1="50%" x2="80%" y2="24%" stroke="#4178C0" strokeWidth="1.5" />
              </svg>

              {/* Farmer Pin */}
              <div className="absolute left-[45%] top-[50%] -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
                <div className="w-7 h-7 rounded-full bg-[#2F7D4A] text-white flex items-center justify-center font-bold text-xs border-2 border-white shadow-lg">
                  📍
                </div>
                <span className="mt-0.5 px-2 py-0.5 rounded-full bg-black/80 text-white text-[10px] font-bold backdrop-blur-md">
                  Your Farm
                </span>
              </div>

              {/* Centre Pins */}
              {centres.map((c) => {
                const isRec = c.isRecommended;
                const isCrit = c.status === "critical";
                const isWarn = c.status === "warning";
                const colorBg = isCrit ? "bg-[#D95555]" : isWarn ? "bg-[#F2A93B]" : "bg-[#2F7D4A]";

                return (
                  <div
                    key={c.id}
                    onClick={() => {
                      setSelectedCentreId(c.id);
                      navigate("/farmer/centres");
                    }}
                    style={{
                      left: c.id === "centre-b" ? "62%" : c.id === "centre-a" ? "32%" : "80%",
                      top: c.id === "centre-b" ? "38%" : c.id === "centre-a" ? "64%" : "24%",
                    }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center cursor-pointer hover:scale-105 transition-transform"
                  >
                    {isRec && (
                      <span className="mb-0.5 px-1.5 py-0.2 rounded-full text-[8px] font-extrabold bg-[#58A66B] text-[#123D2D] uppercase shadow-sm">
                        RECOMMENDED
                      </span>
                    )}
                    <div className={`w-7 h-7 rounded-xl ${colorBg} text-white flex items-center justify-center font-bold text-xs border-2 border-white shadow-md`}>
                      {c.name.charAt(0)}
                    </div>
                    <span className="mt-0.5 px-1.5 py-0.5 rounded-md bg-black/80 text-white text-[10px] font-medium whitespace-nowrap">
                      {c.name.split(" (")[0]} • {c.predictedWaitMinutes}m wait
                    </span>
                  </div>
                );
              })}

              <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-black/75 backdrop-blur-md p-2 rounded-xl text-[10px] text-white flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#2F7D4A]" /> Low Congestion</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#F2A93B]" /> Moderate</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-[#D95555]" /> High Congestion</span>
                </div>
                <span className="text-[#58A66B] font-bold">Live Grid</span>
              </div>
            </div>
          </Card>

        </div>
      </div>

      {/* 4. UPCOMING BOOKING & LIVE QUEUE PROGRESS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Upcoming Booking Card */}
        <Card padding="md" className="space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#E4E9E5]">
            <span className="text-xs uppercase font-extrabold tracking-wider text-[#123D2D]">
              YOUR NEXT BOOKING
            </span>
            <Badge variant="success" size="sm">Confirmed</Badge>
          </div>

          <div className="space-y-2 text-xs">
            <div>
              <h3 className="text-[16px] font-bold text-[#17211B]">{farmerBooking.centreName}</h3>
              <p className="text-[#66736B] text-[12px]">{farmerBooking.slotDate} • {farmerBooking.slotTime}</p>
            </div>

            <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-[#F6F8F4] border border-[#E4E9E5] text-center font-sans tabular-nums">
              <div>
                <span className="text-[10px] text-[#66736B] block">Token</span>
                <strong className="text-sm font-bold text-[#17211B] block">{farmerBooking.tokenNumber}</strong>
              </div>
              <div>
                <span className="text-[10px] text-[#66736B] block">Est. Wait</span>
                <strong className="text-sm font-bold text-[#2F7D4A] block">{farmerBooking.estimatedWaitMinutes} min</strong>
              </div>
              <div>
                <span className="text-[10px] text-[#66736B] block">Arrival Window</span>
                <strong className="text-sm font-bold text-[#17211B] block">10:30 AM</strong>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1 border-t border-[#E4E9E5]">
            <Button
              variant="outline"
              size="sm"
              leftIcon={<FileText className="w-4 h-4" />}
              onClick={() => setIsTokenModalOpen(true)}
            >
              View Gate Slip
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsRescheduleOpen(true)}
            >
              Reschedule
            </Button>
          </div>
        </Card>

        {/* Live Queue Module */}
        <Card padding="md" className="space-y-3">
          <div className="flex items-center justify-between pb-2.5 border-b border-[#E4E9E5]">
            <span className="text-xs uppercase font-extrabold tracking-wider text-[#123D2D]">
              LIVE QUEUE PROGRESS
            </span>
            <span className="text-[11px] text-[#66736B]">Updated 30s ago</span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[#66736B] block text-[11px]">Currently Serving</span>
                <strong className="text-xl font-bold text-[#F2A93B] tabular-nums font-sans">A-124</strong>
              </div>
              <div className="text-right">
                <span className="text-[#66736B] block text-[11px]">Your Token</span>
                <strong className="text-xl font-bold text-[#2F7D4A] tabular-nums font-sans">{farmerBooking.tokenNumber}</strong>
              </div>
            </div>

            {/* Visual Progress Bar */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between text-[11px] text-[#66736B]">
                <span>Serving A-124</span>
                <span className="font-bold text-[#2F7D4A]">3 Farmers Ahead</span>
                <span>Your Turn A-127</span>
              </div>
              
              <div className="h-2.5 w-full bg-[#EEF5EF] rounded-full overflow-hidden relative border border-[#58A66B]/30">
                <div
                  className="h-full bg-[#2F7D4A] rounded-full transition-all duration-300"
                  style={{ width: "68%" }}
                />
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#EEF5EF] text-[#123D2D] text-xs flex items-center justify-between">
              <span>Estimated intake service time:</span>
              <strong className="font-bold text-xs font-sans tabular-nums">11:42 AM</strong>
            </div>
          </div>

          <div className="pt-1 border-t border-[#E4E9E5] text-right">
            <Link to="/farmer/queue">
              <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                View Live Queue Tracker
              </Button>
            </Link>
          </div>
        </Card>

      </div>

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