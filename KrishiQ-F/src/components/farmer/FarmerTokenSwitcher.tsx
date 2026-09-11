import React from "react";
import { Link } from "react-router-dom";
import { useKrishiQ } from "../../context/KrishiQContext";
import { useLanguage } from "../../i18n";
import { Plus, Ticket, CheckCircle2, Clock } from "lucide-react";
import { getStageLabel } from "../../utils/stages";

export const FarmerTokenSwitcher: React.FC = () => {
  const { farmerBookings, activeBookingId, setActiveBookingId, isItemHighlighted } = useKrishiQ();
  const { isHindi, formatCrop } = useLanguage();

  if (farmerBookings.length <= 1) return null;

  return (
    <div className="bg-white dark:bg-[#142019] p-3.5 sm:p-4 rounded-2xl border border-[#E4E9E5] dark:border-[#23362B] card-shadow space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase font-extrabold tracking-wider text-[#123D2D] dark:text-[#52DB89] flex items-center gap-1.5">
          <Ticket className="w-4 h-4 text-[#2F7D4A]" />
          <span>{isHindi ? "आपके सक्रिय टोकन एवं स्लॉट" : "Your Active Booked Slots"}</span>
        </span>
        <Link
          to="/farmer/book-slot"
          className="text-xs font-bold text-[#2F7D4A] dark:text-[#52DB89] hover:underline flex items-center gap-1"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{isHindi ? "+ नया स्लॉट बुक करें" : "+ Book Another Slot"}</span>
        </Link>
      </div>

      <div
        className={`grid gap-2.5 ${
          farmerBookings.length === 2
            ? "grid-cols-1 sm:grid-cols-2"
            : farmerBookings.length === 3
            ? "grid-cols-1 sm:grid-cols-3"
            : "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        }`}
      >
        {farmerBookings.map((b) => {
          const isActive = b.id === activeBookingId;
          const isHigh = isItemHighlighted(b.id);
          const isDone = b.currentStageNumber === 8;

          return (
            <button
              key={b.id}
              onClick={() => setActiveBookingId(b.id)}
              className={`p-2.5 sm:p-3 rounded-xl border text-left transition-all cursor-pointer flex items-center justify-between gap-2.5 w-full ${
                isActive
                  ? "bg-[#EEF5EF] dark:bg-[#1A3125] border-[#2F7D4A] ring-2 ring-[#2F7D4A]/25 shadow-xs"
                  : "bg-[#F6F8F4] dark:bg-[#101B15] border-[#E4E9E5] dark:border-[#23362B] hover:bg-[#EEF5EF] dark:hover:bg-[#1A3125]"
              } ${isHigh ? "highlight-pulse" : ""}`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span className="font-mono font-bold text-xs sm:text-sm text-[#123D2D] dark:text-[#52DB89] bg-white dark:bg-[#142019] px-2 py-1 rounded-lg border border-[#E4E9E5] dark:border-[#23362B] shrink-0">
                  #{b.tokenNumber}
                </span>
                <div className="min-w-0">
                  <strong className="block text-[#111813] dark:text-white text-xs leading-tight truncate font-bold">
                    {b.quantityQuintals} Qtl {formatCrop(b.crop)}
                  </strong>
                  <span className="text-[11px] text-[#404A43] dark:text-[#CBD5E1] flex items-center gap-1 mt-0.5">
                    {isDone ? (
                      <CheckCircle2 className="w-3 h-3 text-[#2F7D4A] shrink-0" />
                    ) : (
                      <Clock className="w-3 h-3 text-[#F2A93B] shrink-0" />
                    )}
                    <span className="truncate">{getStageLabel(b.lastUpdated || "Stage " + b.currentStageNumber, isHindi)}</span>
                  </span>
                </div>
              </div>

              {isActive && (
                <span className="w-2 h-2 rounded-full bg-[#2F7D4A] dark:bg-[#52DB89] shrink-0" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
