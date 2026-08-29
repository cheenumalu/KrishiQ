import React from "react";
import { Modal } from "../common/Modal";
import { FarmerBooking } from "../../types";
import { formatQuintals } from "../../utils/calculations";
import { QrCode, Printer, ShieldCheck } from "lucide-react";
import { Button } from "../common/Button";

interface TokenSlipModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: FarmerBooking;
}

export const TokenSlipModal: React.FC<TokenSlipModalProps> = ({
  isOpen,
  onClose,
  booking,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Digital Mandi Gate Pass & Token"
      subtitle="Official Agricultural Procurement Entry Authorization"
      maxWidth="md"
    >
      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-slate-900 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-500" />
          <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400">
            Govt of Madhya Pradesh � Food & Civil Supplies
          </span>
          <h3 className="text-3xl font-extrabold font-mono tracking-wider mt-1 text-white">
            #{booking.tokenNumber}
          </h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Booking ID: <span className="font-mono text-emerald-300">{booking.id}</span>
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <div>
            <span className="text-slate-500 block text-[11px]">Farmer Name</span>
            <strong className="text-slate-900 text-sm">{booking.farmerName}</strong>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Farmer Registration ID</span>
            <strong className="text-slate-900 font-mono">{booking.farmerId}</strong>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Crop & Variety</span>
            <strong className="text-slate-900">{booking.crop} ({booking.variety})</strong>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Declared Quantity</span>
            <strong className="text-emerald-800 text-sm font-bold">{formatQuintals(booking.quantityQuintals)}</strong>
          </div>
          <div className="col-span-2 pt-2 border-t border-slate-200">
            <span className="text-slate-500 block text-[11px]">Designated Mandi Centre</span>
            <strong className="text-slate-900">{booking.centreName}</strong>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Slot Date & Time</span>
            <strong className="text-slate-900">{booking.slotDate} ({booking.slotTime})</strong>
          </div>
          <div>
            <span className="text-slate-500 block text-[11px]">Predicted Wait Time</span>
            <strong className="text-emerald-800 font-semibold">{booking.estimatedWaitMinutes} Minutes</strong>
          </div>
        </div>

        <div className="flex items-center justify-between p-3.5 rounded-xl border border-dashed border-slate-300 bg-white">
          <div className="space-y-1">
            <span className="text-xs font-bold text-slate-800 block">Security Verification Barcode</span>
            <p className="text-[10px] text-slate-500">Scan at Gate 1 Reader for automated barrier clearance.</p>
            <div className="font-mono text-xs text-slate-700 tracking-widest bg-slate-100 px-2 py-1 rounded inline-block">
              ||| | |||| ||| ||||||| | ||
            </div>
          </div>
          <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200">
            <QrCode className="w-12 h-12 text-slate-800" />
          </div>
        </div>

        <div className="p-3 rounded-lg bg-emerald-50/60 border border-emerald-200 text-xs text-emerald-950">
          <h5 className="font-bold flex items-center gap-1.5 text-emerald-900 mb-1">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            Mandatory Documents at Mandi Gate
          </h5>
          <ul className="list-disc list-inside space-y-0.5 text-[11px] text-emerald-800">
            <li>Original Aadhaar Card or Voter ID</li>
            <li>Land Khasra / B1 Rin Pustika copy</li>
            <li>Bank Passbook (SBI Account ending 4092)</li>
          </ul>
        </div>

        <div className="flex items-center justify-end gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" size="sm" leftIcon={<Printer className="w-4 h-4" />} onClick={() => window.print()}>
            Print / Save Token Slip
          </Button>
        </div>
      </div>
    </Modal>
  );
};