import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useKrishiQ } from "../context/KrishiQContext";
import { UserRole } from "../types";
import {
  Users,
  Building2,
  Landmark,
  ArrowRight,
  ShieldCheck,
  Clock,
  MapPin,
  CheckCircle2,
  PhoneCall,
  FileText
} from "lucide-react";
import { Card } from "../components/common/Card";
import { Badge } from "../components/common/Badge";
import { Button } from "../components/common/Button";

export const LandingPage: React.FC = () => {
  const { setRole } = useKrishiQ();
  const navigate = useNavigate();

  const handleSelectRole = (role: UserRole, targetPath: string) => {
    setRole(role);
    navigate(targetPath);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      
      {/* Official Header Banner */}
      <div className="p-6 sm:p-8 rounded-xl bg-slate-900 text-white border border-slate-800 space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-emerald-700 text-white">
            Digital Public Service System
          </span>
          <span className="text-xs text-slate-400">Agricultural Marketing & Procurement</span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight leading-tight">
          KrishiQ Agricultural Procurement Portal
        </h1>

        <p className="text-xs sm:text-sm text-slate-300 max-w-3xl leading-relaxed">
          An intelligent coordination system designed to reduce farmer waiting time and Mandi congestion through dynamic queue tracking, recommended centre balancing, and proactive bottleneck detection.
        </p>

        <div className="pt-2 flex flex-wrap gap-2 text-xs">
          <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
            ? Smart Centre Recommendation
          </span>
          <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
            ? Live Mandi Queue Tracking
          </span>
          <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
            ? Direct MSP DBT Disbursement
          </span>
          <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
            ? Bottleneck & Congestion Forecasting
          </span>
        </div>
      </div>

      {/* Role Selection Grid */}
      <div className="space-y-4">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            Select Portal Section to Enter
          </h2>
          <p className="text-xs text-slate-500">
            Choose your role to access relevant procurement services. You can switch roles anytime from the header.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          {/* 1. Farmer Portal */}
          <Card padding="lg" className="border-slate-300 hover:border-emerald-800 transition-colors flex flex-col justify-between space-y-4">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <Badge variant="normal">Farmer Services</Badge>
              </div>

              <h3 className="text-lg font-bold text-slate-900">1. Farmer Portal</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Answers: "Where and when should I go to sell my produce?" Features recommended centre selection, appointment slot booking, live queue token tracking, and direct MSP payment receipts.
              </p>

              <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-700">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>Recommended Centre (Saves ~2h wait)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>Live Queue Token Tracker (#A127)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>7-Stage Procurement Stepper</span>
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              className="w-full"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => handleSelectRole("farmer", "/farmer/dashboard")}
            >
              Enter Farmer Portal
            </Button>
          </Card>

          {/* 2. Centre Operator */}
          <Card padding="lg" className="border-slate-300 hover:border-emerald-800 transition-colors flex flex-col justify-between space-y-4">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-900 flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <Badge variant="neutral">Mandi Operations</Badge>
              </div>

              <h3 className="text-lg font-bold text-slate-900">2. Procurement Centre Operator</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Operations workstation for Mandi staff. Answers: "Who should I process next and where is the bottleneck?" Allows 1-click station rebalancing and digital assay record management.
              </p>

              <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-700">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>Active Station Hero Card (Token A124)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>Weighing Bottleneck Warning Alert</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>Live Queue Dispatch & Stage Actions</span>
                </div>
              </div>
            </div>

            <Button
              variant="secondary"
              size="md"
              className="w-full"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => handleSelectRole("centre", "/centre/dashboard")}
            >
              Enter Operator Station
            </Button>
          </Card>

          {/* 3. Administrator */}
          <Card padding="lg" className="border-slate-300 hover:border-emerald-800 transition-colors flex flex-col justify-between space-y-4">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-900 flex items-center justify-center font-bold">
                  <Landmark className="w-5 h-5" />
                </div>
                <Badge variant="neutral">State Administration</Badge>
              </div>

              <h3 className="text-lg font-bold text-slate-900">3. Government Administrator</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                State & district monitoring desk. Answers: "Where will congestion occur, and what action should I take before it happens?" Features proactive directives and What-If policy simulation.
              </p>

              <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-slate-700">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>Procurement Network Overview (42 Mandis)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>Predicted Congestion Alert (Centre 17)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>What-If Policy & Surge Simulator</span>
                </div>
              </div>
            </div>

            <Button
              variant="secondary"
              size="md"
              className="w-full"
              rightIcon={<ArrowRight className="w-4 h-4" />}
              onClick={() => handleSelectRole("admin", "/admin/dashboard")}
            >
              Enter Administrator Desk
            </Button>
          </Card>

        </div>
      </div>

      {/* Official Help & Support Footer Panel */}
      <Card padding="md" className="border-slate-200 bg-slate-50 text-xs text-slate-600 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <PhoneCall className="w-4 h-4 text-emerald-800" />
          <span>Kisan Call Centre Toll-Free Support: <strong className="font-mono text-slate-900">1800-180-1551</strong> (6:00 AM � 10:00 PM)</span>
        </div>
        <span>Government Agricultural Procurement Coordination Portal (Prototype)</span>
      </Card>

    </div>
  );
};