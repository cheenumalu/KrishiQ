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
  Sparkles
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
    <div className="space-y-10 max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      
      {/* SaaS Hero Header Banner */}
      <div className="p-8 sm:p-12 rounded-3xl bg-[#123D2D] text-white shadow-sm space-y-4 relative overflow-hidden">
        <div className="absolute -right-12 -top-12 w-80 h-80 bg-[#58A66B]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="flex items-center gap-2 relative z-10">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-white backdrop-blur-md">
            Digital Public Infrastructure • AgriTech SaaS
          </span>
          <span className="text-xs text-white/70">State Agricultural Marketing Board</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight relative z-10">
          KrishiQ Intelligent Agricultural Procurement Platform
        </h1>

        <p className="text-sm sm:text-base text-white/90 max-w-3xl leading-relaxed relative z-10">
          Next-generation coordination platform connecting farmers, procurement centre operators, and government authorities to eliminate mandi congestion, balance regional arrival queues, and automate DBT MSP settlements.
        </p>

        <div className="pt-3 flex flex-wrap gap-2.5 text-xs relative z-10">
          <span className="px-3 py-1.5 rounded-xl bg-white/10 text-white border border-white/15">
            ✓ Smart Centre Recommendation
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-white/10 text-white border border-white/15">
            ✓ Live Mandi Queue Token Tracker
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-white/10 text-white border border-white/15">
            ✓ Direct MSP DBT Disbursement
          </span>
          <span className="px-3 py-1.5 rounded-xl bg-white/10 text-white border border-white/15">
            ✓ Bottleneck & Congestion Simulator
          </span>
        </div>
      </div>

      {/* Role Selection Grid */}
      <div className="space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-[#17211B]">
            Select Portal Persona to Access
          </h2>
          <p className="text-xs sm:text-sm text-[#66736B]">
            Choose your role to launch the tailored experience. You can switch personas anytime from the top navigation bar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* 1. Farmer Portal */}
          <Card padding="lg" hoverable className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#EEF5EF] text-[#2F7D4A] flex items-center justify-center font-bold">
                  <Users className="w-6 h-6" />
                </div>
                <Badge variant="success">Farmer View</Badge>
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#17211B]">1. Farmer Portal</h3>
                <p className="text-xs text-[#66736B] leading-relaxed mt-1">
                  Simple, visual, action-driven interface. Recommended centre selection, appointment slot booking, live queue token tracking, and direct MSP payment receipts.
                </p>
              </div>

              <div className="pt-3 border-t border-[#E5EAE6] space-y-2 text-xs text-[#17211B]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2F7D4A] shrink-0" />
                  <span>Recommended Centre (Saves ~2h wait)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2F7D4A] shrink-0" />
                  <span>Live Queue Token Tracker (#A127)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2F7D4A] shrink-0" />
                  <span>8-Stage Procurement Stepper</span>
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
              Launch Farmer Portal
            </Button>
          </Card>

          {/* 2. Centre Operator */}
          <Card padding="lg" hoverable className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#EEF5EF] text-[#4178C0] flex items-center justify-center font-bold">
                  <Building2 className="w-6 h-6" />
                </div>
                <Badge variant="info">Mandi Operations</Badge>
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#17211B]">2. Centre Operator</h3>
                <p className="text-xs text-[#66736B] leading-relaxed mt-1">
                  Operational console for Mandi operators. Active workstation cards, 1-click station rebalancing, bottleneck advisories, and live queue dispatch.
                </p>
              </div>

              <div className="pt-3 border-t border-[#E5EAE6] space-y-2 text-xs text-[#17211B]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2F7D4A] shrink-0" />
                  <span>Active Station Workstation (Token A124)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2F7D4A] shrink-0" />
                  <span>Weighbridge Bottleneck Warning Alert</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2F7D4A] shrink-0" />
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
              Launch Operator Console
            </Button>
          </Card>

          {/* 3. Administrator */}
          <Card padding="lg" hoverable className="flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#FEF5E7] text-[#9A6210] flex items-center justify-center font-bold">
                  <Landmark className="w-6 h-6" />
                </div>
                <Badge variant="warning">Command Tower</Badge>
              </div>

              <div>
                <h3 className="text-xl font-bold text-[#17211B]">3. State Administrator</h3>
                <p className="text-xs text-[#66736B] leading-relaxed mt-1">
                  Network Command Desk. District overview (42 Mandis), 70/30 map & Needs Attention panel, proactive policy directives, and What-If simulator.
                </p>
              </div>

              <div className="pt-3 border-t border-[#E5EAE6] space-y-2 text-xs text-[#17211B]">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2F7D4A] shrink-0" />
                  <span>Procurement Control Tower (42 Mandis)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2F7D4A] shrink-0" />
                  <span>Needs Attention Alert Panel (Dhar Road)</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#2F7D4A] shrink-0" />
                  <span>What-If Policy Surge Simulator</span>
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
              Launch Administrator Desk
            </Button>
          </Card>

        </div>
      </div>

      {/* Support Footer Panel */}
      <Card padding="md" className="bg-[#F6F8F4] text-xs text-[#66736B] flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <PhoneCall className="w-4 h-4 text-[#2F7D4A]" />
          <span>Kisan Call Centre Toll-Free Support: <strong className="font-mono text-[#17211B]">1800-180-1551</strong> (6:00 AM - 10:00 PM)</span>
        </div>
        <span>Government Agricultural Procurement Infrastructure</span>
      </Card>

    </div>
  );
};