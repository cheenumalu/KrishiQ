import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useKrishiQ } from "../../context/KrishiQContext";
import { CropType } from "../../types";
import {
  MapPin,
  Clock,
  Search,
  ArrowRight,
  SlidersHorizontal,
  Navigation,
  List,
  Map as MapIcon,
  Sparkles,
  CheckCircle2,
  AlertTriangle
} from "lucide-react";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";

export const FarmerCentres: React.FC = () => {
  const { setSelectedCentreId, centres } = useKrishiQ();
  const navigate = useNavigate();

  const [selectedCrop, setSelectedCrop] = useState<CropType>("Wheat");
  const [selectedDate, setSelectedDate] = useState("Today, 29 Aug");
  const [maxDistance, setMaxDistance] = useState<number>(25);
  const [maxWaitFilter, setMaxWaitFilter] = useState<"any" | "45m" | "90m">("any");
  const [sortBy, setSortBy] = useState<"recommended" | "distance" | "wait">("recommended");
  const [activeCentreId, setActiveCentreId] = useState<string>("centre-b");
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");

  const filteredCentres = centres
    .filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.district.toLowerCase().includes(search.toLowerCase()) ||
        c.code.toLowerCase().includes(search.toLowerCase());
      const matchesDistance = c.distanceKm <= maxDistance;
      const matchesWait =
        maxWaitFilter === "any" ||
        (maxWaitFilter === "45m" && c.predictedWaitMinutes <= 45) ||
        (maxWaitFilter === "90m" && c.predictedWaitMinutes <= 90);
      return matchesSearch && matchesDistance && matchesWait;
    })
    .sort((a, b) => {
      if (sortBy === "recommended") return (b.isRecommended ? 1 : 0) - (a.isRecommended ? 1 : 0);
      if (sortBy === "distance") return a.distanceKm - b.distanceKm;
      if (sortBy === "wait") return a.predictedWaitMinutes - b.predictedWaitMinutes;
      return 0;
    });

  const handleBookAtCentre = (centreId: string) => {
    setSelectedCentreId(centreId);
    navigate("/farmer/book-slot");
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#E5EAE6]">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant="normal">Discover & Book</Badge>
            <span className="text-xs text-[#66736B]">Authorized Mandis</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#17211B] tracking-tight mt-1">
            Procurement Centres Directory
          </h1>
          <p className="text-xs sm:text-sm text-[#66736B]">
            Find nearby government procurement centres with predicted queue wait times and direct slot booking.
          </p>
        </div>

        {/* View mode toggle */}
        <div className="flex items-center p-1 bg-[#EEF5EF] rounded-2xl border border-[#58A66B]/30 text-xs font-semibold">
          <button
            onClick={() => setViewMode("grid")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
              viewMode === "grid" ? "bg-white text-[#123D2D] font-bold shadow-xs" : "text-[#66736B]"
            }`}
          >
            <List className="w-4 h-4" />
            <span>List Cards</span>
          </button>
          <button
            onClick={() => setViewMode("map")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
              viewMode === "map" ? "bg-white text-[#123D2D] font-bold shadow-xs" : "text-[#66736B]"
            }`}
          >
            <MapIcon className="w-4 h-4" />
            <span>Interactive Map</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <Card padding="md" className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-3 items-center">
          
          {/* Search Input */}
          <div className="lg:col-span-4 relative">
            <Search className="w-4 h-4 text-[#8A958E] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by centre name, code, district..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-[#E5EAE6] bg-[#F6F8F4] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#2F7D4A]/30 text-[#17211B]"
            />
          </div>

          {/* Crop Dropdown */}
          <div className="lg:col-span-2">
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value as CropType)}
              className="w-full p-2 text-xs rounded-xl border border-[#E5EAE6] bg-[#F6F8F4] font-semibold text-[#17211B]"
            >
              <option value="Wheat">Wheat</option>
              <option value="Soybean">Soybean</option>
              <option value="Paddy">Paddy</option>
              <option value="Maize">Maize</option>
            </select>
          </div>

          {/* Date Dropdown */}
          <div className="lg:col-span-2">
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full p-2 text-xs rounded-xl border border-[#E5EAE6] bg-[#F6F8F4] font-semibold text-[#17211B]"
            >
              <option value="Today, 29 Aug">29 Aug (Today)</option>
              <option value="Tomorrow, 30 Aug">30 Aug (Tomorrow)</option>
            </select>
          </div>

          {/* Sort Pills */}
          <div className="lg:col-span-4 flex items-center justify-end gap-1.5 text-xs">
            <span className="text-[#66736B] font-medium mr-1">Sort:</span>
            <button
              onClick={() => setSortBy("recommended")}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
                sortBy === "recommended" ? "bg-[#123D2D] text-white" : "bg-[#F6F8F4] text-[#66736B] hover:bg-[#EEF5EF]"
              }`}
            >
              Recommended
            </button>
            <button
              onClick={() => setSortBy("distance")}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
                sortBy === "distance" ? "bg-[#123D2D] text-white" : "bg-[#F6F8F4] text-[#66736B] hover:bg-[#EEF5EF]"
              }`}
            >
              Nearest
            </button>
            <button
              onClick={() => setSortBy("wait")}
              className={`px-3 py-1.5 rounded-xl font-semibold transition-colors cursor-pointer ${
                sortBy === "wait" ? "bg-[#123D2D] text-white" : "bg-[#F6F8F4] text-[#66736B] hover:bg-[#EEF5EF]"
              }`}
            >
              Lowest Wait
            </button>
          </div>

        </div>
      </Card>

      {/* Main Content Layout */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCentres.map((centre) => {
            const isRec = centre.isRecommended;
            const isCrit = centre.status === "critical";
            const isWarn = centre.status === "warning";

            return (
              <Card
                key={centre.id}
                padding="lg"
                hoverable
                className={`space-y-4 ${
                  isRec ? "ring-2 ring-[#2F7D4A] bg-[#EEF5EF]/30" : ""
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-[#17211B]">{centre.name}</h3>
                    </div>
                    <p className="text-xs text-[#66736B] mt-0.5 font-mono">
                      Code: {centre.code} • {centre.district}, {centre.state}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1 shrink-0">
                    {isRec && <Badge variant="success" dot>Recommended</Badge>}
                    {isCrit && <Badge variant="critical">High Surge</Badge>}
                    {isWarn && <Badge variant="warning">Moderate Queue</Badge>}
                    {!isRec && !isCrit && !isWarn && <Badge variant="normal">Normal Intake</Badge>}
                  </div>
                </div>

                {/* 4 Key Metrics */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3 rounded-2xl bg-[#F6F8F4] border border-[#E5EAE6] text-xs text-center font-mono">
                  <div>
                    <span className="text-[10px] text-[#66736B] block font-sans">Distance</span>
                    <strong className="text-[#17211B] font-bold text-sm block mt-0.5">{centre.distanceKm} km</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#66736B] block font-sans">Queue Count</span>
                    <strong className="text-[#17211B] font-bold text-sm block mt-0.5">{centre.currentQueueCount}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#66736B] block font-sans">Est. Wait</span>
                    <strong className={`font-bold text-sm block mt-0.5 ${isRec ? "text-[#2F7D4A]" : "text-[#17211B]"}`}>
                      {centre.predictedWaitMinutes} min
                    </strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#66736B] block font-sans">Utilization</span>
                    <strong className="text-[#17211B] font-bold text-sm block mt-0.5">{centre.utilizationPercent}%</strong>
                  </div>
                </div>

                {/* Recommendation Rationale */}
                {isRec && (
                  <div className="p-3 rounded-xl bg-[#EEF5EF] text-[#123D2D] text-xs font-medium border border-[#58A66B]/30">
                    "Recommended: Saves ~2h 28m total wait time compared with Dhar Road Hub."
                  </div>
                )}

                {isCrit && (
                  <div className="p-3 rounded-xl bg-[#FDF2F2] text-[#9B2C2C] text-xs font-medium border border-[#D95555]/30">
                    "Notice: Heavy gate queue reported. Rerouting to Shivaji Nagar is advised."
                  </div>
                )}

                <div className="pt-2 border-t border-[#E5EAE6] flex items-center justify-between">
                  <span className="text-xs text-[#66736B]">
                    Hours: <strong className="font-mono text-[#17211B]">{centre.operatingHours}</strong>
                  </span>

                  <Button
                    variant={isRec ? "primary" : "outline"}
                    size="sm"
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                    onClick={() => handleBookAtCentre(centre.id)}
                  >
                    Book Slot
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        /* Full Map View */
        <Card padding="none" className="overflow-hidden">
          <div className="p-4 bg-[#123D2D] text-white flex items-center justify-between text-xs font-semibold">
            <span>District Network Map View</span>
            <span>Indore Procurement Sector</span>
          </div>

          <div className="relative h-[480px] bg-[#17211B] overflow-hidden select-none">
            <div className="absolute inset-0 flex items-center justify-center text-white/50 text-xs">
              [ Interactive District Map Loaded - 5 Procurement Centres Active ]
            </div>

            {/* Pins */}
            {filteredCentres.map((c, idx) => (
              <div
                key={c.id}
                style={{ top: `${30 + idx * 14}%`, left: `${25 + idx * 16}%` }}
                className="absolute z-30 flex flex-col items-center cursor-pointer hover:scale-110 transition-transform"
                onClick={() => handleBookAtCentre(c.id)}
              >
                <div className={`w-10 h-10 rounded-2xl ${c.isRecommended ? "bg-[#2F7D4A]" : c.status === "critical" ? "bg-[#D95555]" : "bg-[#4178C0]"} text-white flex items-center justify-center font-bold text-sm shadow-xl border-2 border-white`}>
                  {c.name.charAt(0)}
                </div>
                <div className="mt-1 px-2.5 py-1 rounded-xl bg-black/85 text-white text-[11px] font-medium text-center backdrop-blur-md">
                  <div className="font-bold">{c.name.split(" (")[0]}</div>
                  <div className="text-[10px] text-[#58A66B] font-mono">{c.predictedWaitMinutes}m wait • {c.distanceKm} km</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

    </div>
  );
};