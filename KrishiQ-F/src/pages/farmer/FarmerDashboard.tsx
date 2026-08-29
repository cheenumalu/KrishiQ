import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useKrishiQ } from "../../context/KrishiQContext";
import { TokenSlipModal } from "../../components/farmer/TokenSlipModal";
import { RescheduleModal } from "../../components/farmer/RescheduleModal";
import {
  Clock,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Bell,
  ArrowRight,
  FileText,
  Building2,
  ShieldCheck
} from "lucide-react";
import { Card } from "../../components/common/Card";
import { Badge } from "../../components/common/Badge";
import { Button } from "../../components/common/Button";

export const FarmerDashboard: React.FC = () => {
  const { farmerBooking, setSelectedCentreId } = useKrishiQ();
  const [isTokenModalOpen, setIsTokenModalOpen] = useState(false);
  const [isRescheduleOpen, setIsRescheduleOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16 px-1">
      
      {/* 1. Official Welcome Greeting */}
      <div className="space-y-0.5 pb-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
          Welcome, Rajesh
        </h1>
        <p className="text-sm text-slate-600 font-medium">
          Here is your procurement status.
        </p>
      </div>

      {/* 2. YOUR CURRENT BOOKING & CURRENT QUEUE PANEL */}
      <Card padding="lg" className="border-slate-300 shadow-xs space-y-5">
        
        {/* Header Tag */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
          <span className="text-xs uppercase font-extrabold tracking-wider text-slate-800">
            YOUR CURRENT BOOKING
          </span>
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>Updated 30 seconds ago</span>
          </span>
        </div>

        {/* Booking Details List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs">
          <div>
            <span className="text-slate-500 block">Token Number</span>
            <strong className="text-lg font-mono font-extrabold text-slate-900 mt-0.5 block">
              {farmerBooking.tokenNumber}
            </strong>
          </div>

          <div>
            <span className="text-slate-500 block">Procurement Centre</span>
            <strong className="text-xs font-bold text-slate-900 mt-0.5 block">
              {farmerBooking.centreName}
            </strong>
          </div>

          <div>
            <span className="text-slate-500 block">Booking Date</span>
            <strong className="text-xs font-bold text-slate-900 mt-0.5 block">
              29 August 2026
            </strong>
          </div>

          <div>
            <span className="text-slate-500 block">Appointment Slot</span>
            <strong className="text-xs font-mono font-bold text-slate-900 mt-0.5 block">
              11:30�12:00
            </strong>
          </div>
        </div>

        {/* CURRENT QUEUE METRICS */}
        <div className="space-y-3 pt-1">
          <span className="text-xs uppercase font-extrabold tracking-wider text-slate-700 block">
            CURRENT QUEUE STATUS
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-4 rounded-lg border border-slate-200 bg-white">
              <span className="text-xs text-slate-500 block">Farmers Ahead</span>
              <p className="text-2xl font-extrabold text-slate-900 mt-1">
                3 farmers ahead
              </p>
              <span className="text-[11px] text-slate-500 block mt-0.5">Moving on schedule</span>
            </div>

            <div className="p-4 rounded-lg border border-emerald-300 bg-emerald-50/50">
              <span className="text-xs font-semibold text-emerald-900 block">Estimated Waiting Time</span>
              <p className="text-2xl font-extrabold text-emerald-950 mt-1 font-mono">
                35 minutes
              </p>
              <span className="text-[11px] text-emerald-800 block mt-0.5">Fast intake active</span>
            </div>

            <div className="p-4 rounded-lg border border-slate-200 bg-white">
              <span className="text-xs text-slate-500 block">Expected Service Time</span>
              <p className="text-2xl font-extrabold text-slate-900 mt-1 font-mono">
                11:42 AM
              </p>
              <span className="text-[11px] text-slate-500 block mt-0.5">Weighbridge 1</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200">
          <Button
            variant="outline"
            size="md"
            leftIcon={<FileText className="w-4 h-4" />}
            onClick={() => setIsTokenModalOpen(true)}
          >
            View Gate Slip
          </Button>

          <Link to="/farmer/queue">
            <Button
              variant="primary"
              size="md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              View Live Queue
            </Button>
          </Link>
        </div>

      </Card>

      {/* 3. RECOMMENDED PROCUREMENT CENTRE */}
      <Card padding="lg" className="border-slate-300 shadow-xs space-y-4">
        
        <div className="flex items-center justify-between pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-extrabold tracking-wider text-slate-800">
              RECOMMENDED PROCUREMENT CENTRE
            </span>
            <Badge variant="normal">Recommended</Badge>
          </div>
          <span className="text-xs text-slate-500">Based on travel & queue time</span>
        </div>

        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Centre B (Shivaji Nagar Procurement Centre)
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Distance: <strong className="text-slate-900">7.2 km away</strong> from your village
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700">
            <div>
              <span className="text-slate-500 block text-[11px]">Distance</span>
              <strong className="text-slate-900 font-mono text-sm block mt-0.5">7.2 km</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Current Queue</span>
              <strong className="text-slate-900 font-mono text-sm block mt-0.5">31 farmers</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Predicted Wait</span>
              <strong className="text-emerald-800 font-mono text-sm font-bold block mt-0.5">42 minutes</strong>
            </div>
            <div>
              <span className="text-slate-500 block text-[11px]">Available Slots</span>
              <strong className="text-slate-900 font-mono text-sm block mt-0.5">14 open</strong>
            </div>
          </div>

          {/* Simple Explanation Callout */}
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 leading-relaxed font-medium">
            "Recommended because it is expected to save approximately 2 hours compared with Centre A."
          </div>
        </div>

        <div className="pt-2 flex flex-wrap items-center justify-end gap-2.5 border-t border-slate-200">
          <Link to="/farmer/centres">
            <Button variant="outline" size="md">
              View Centre
            </Button>
          </Link>
          <Link to="/farmer/book-slot">
            <Button
              variant="primary"
              size="md"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => setSelectedCentreId("centre-b")}
            >
              Book Slot
            </Button>
          </Link>
        </div>

      </Card>

      {/* 4. IMPORTANT NOTIFICATIONS (Simple List) */}
      <Card padding="md" className="border-slate-200 space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <span className="text-xs uppercase font-extrabold tracking-wider text-slate-800 flex items-center gap-1.5">
            <Bell className="w-3.5 h-3.5 text-slate-600" />
            Recent Notifications
          </span>
          <Link to="/farmer/notifications" className="text-xs text-emerald-800 font-semibold hover:underline">
            View All ?
          </Link>
        </div>

        <div className="space-y-2 text-xs">
          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-start justify-between gap-3">
            <div>
              <strong className="text-slate-900 block">Queue update</strong>
              <p className="text-slate-600 mt-0.5">Your estimated waiting time changed from 42 to 35 minutes.</p>
            </div>
            <span className="text-[10px] text-slate-400 font-mono shrink-0">5 mins ago</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-start justify-between gap-3">
            <div>
              <strong className="text-slate-900 block">Slot reminder</strong>
              <p className="text-slate-600 mt-0.5">Your procurement slot begins in 45 minutes.</p>
            </div>
            <span className="text-[10px] text-slate-400 font-mono shrink-0">25 mins ago</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 flex items-start justify-between gap-3">
            <div>
              <strong className="text-slate-900 block">Procurement update</strong>
              <p className="text-slate-600 mt-0.5">Your quality check has been completed.</p>
            </div>
            <span className="text-[10px] text-slate-400 font-mono shrink-0">1 hour ago</span>
          </div>
        </div>
      </Card>

      {/* 5. SECONDARY BOOKING INFORMATION */}
      <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-600 space-y-2">
        <span className="text-[11px] uppercase font-bold text-slate-500 block">
          Farmer Registration & Crop Details
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1">
          <div>
            <span className="text-slate-400 block text-[11px]">Farmer ID</span>
            <strong className="text-slate-900 block mt-0.5">{farmerBooking.farmerId}</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Current Crop</span>
            <strong className="text-slate-900 block mt-0.5">{farmerBooking.variety}</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Expected Quantity</span>
            <strong className="text-slate-900 block mt-0.5">{farmerBooking.quantityQuintals} Quintals (130 Bags)</strong>
          </div>
          <div>
            <span className="text-slate-400 block text-[11px]">Village / Tehsil</span>
            <strong className="text-slate-900 block mt-0.5">{farmerBooking.village}</strong>
          </div>
        </div>
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