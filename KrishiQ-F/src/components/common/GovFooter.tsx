import React from "react";
import { useLanguage } from "../../i18n";
import { ShieldCheck, ExternalLink, HelpCircle, FileText, Phone, Mail, Building } from "lucide-react";
import { EmblemOfIndia } from "./EmblemOfIndia";

/**
 * Standard GIGW-Compliant National Portal Footer
 * Styled with NIC / Ministry of Agriculture & Farmers Welfare guidelines.
 */
export const GovFooter: React.FC = () => {
  const { isHindi } = useLanguage();

  const relatedPortals = [
    { label: isHindi ? "ई-नाम (e-NAM)" : "e-NAM (National Agriculture Market)", url: "https://enam.gov.in" },
    { label: isHindi ? "पीएम किसान (PM-KISAN)" : "PM-KISAN Portal", url: "https://pmkisan.gov.in" },
    { label: isHindi ? "एगमार्कनेट (Agmarknet)" : "Agmarknet Mandi Rates", url: "https://agmarknet.gov.in" },
    { label: isHindi ? "प्रधानमंत्री फसल बीमा योजना" : "PM Fasal Bima Yojana (PMFBY)", url: "https://pmfby.gov.in" },
    { label: isHindi ? "मृदा स्वास्थ्य कार्ड" : "Soil Health Card Scheme", url: "https://soilhealth.dac.gov.in" },
    { label: isHindi ? "डिजिटल भारत (Digital India)" : "Digital India Initiative", url: "https://digitalindia.gov.in" },
  ];

  const govPolicies = isHindi
    ? [
        "वेबसाइट नीतियां",
        "हाइपरलिंकिंग नीति",
        "गोपनीयता नीति",
        "नियम एवं शर्तें",
        "सूचना का अधिकार (RTI)",
        "कॉपीराइट नीति",
        "सुरक्षा नीति",
        "साइटमैप",
        "सहायता एवं संपर्क",
      ]
    : [
        "Website Policies",
        "Hyperlinking Policy",
        "Privacy Policy",
        "Terms & Conditions",
        "Right to Information (RTI)",
        "Copyright Policy",
        "Security Policy",
        "Sitemap",
        "Help & Contact",
      ];

  return (
    <footer className="w-full bg-[#002244] text-slate-200 text-xs border-t-4 border-[#FF9933] mt-auto select-none font-sans">
      
      {/* 1. Related Portals Section */}
      <div className="border-b border-[#0A3866] bg-[#001B36] py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-slate-300 font-semibold text-[11px] uppercase tracking-wider">
            <ExternalLink className="w-3.5 h-3.5 text-[#FF9933]" />
            <span>{isHindi ? "संबंधित सरकारी पोर्टल" : "Related Government Portals"}:</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[11px]">
            {relatedPortals.map((portal, idx) => (
              <a
                key={idx}
                href={portal.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-300 hover:text-white hover:underline transition-colors flex items-center gap-1"
              >
                <span>{portal.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Main Footer Body with Ministry & NIC Information */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Column 1: Ministry Brand & Emblem */}
          <div className="space-y-3 md:col-span-1 border-b md:border-b-0 md:border-r border-[#0A3866] pb-6 md:pb-0 md:pr-6">
            <div className="flex items-center gap-3">
              <div className="bg-white p-1.5 rounded-xs">
                <EmblemOfIndia size="sm" showText={false} />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm leading-tight">
                  {isHindi ? "कृषि एवं किसान कल्याण मंत्रालय" : "Ministry of Agriculture & Farmers Welfare"}
                </h4>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {isHindi ? "भारत सरकार" : "Government of India"}
                </p>
              </div>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed">
              {isHindi
                ? "राष्ट्रीय कृषि उपज मंडी ई-उपार्जन प्रणाली देश के किसानों को पारदर्शी, कतार-मुक्त और न्यूनतम समर्थन मूल्य (MSP) का समयबद्ध DBT भुगतान सुनिश्चित करती है।"
                : "KrishiQ National Procurement Platform coordinates seamless mandi arrivals, queue optimization, and fair average quality assurance for farmers across India."}
            </p>

            <div className="text-[10px] text-slate-400 font-mono">
              <span>APMC Mandi Act • Model APMC Rules 2026</span>
            </div>
          </div>

          {/* Column 2: Mandatory GIGW Policies */}
          <div className="space-y-3 md:col-span-1">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider text-[#FF9933]">
              {isHindi ? "नीति एवं दिशानिर्देश" : "Policies & Guidelines"}
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              {govPolicies.slice(0, 5).map((policy, idx) => (
                <li key={idx}>
                  <a href="#main-content" className="text-slate-300 hover:text-white hover:underline transition-colors">
                    {policy}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Grievance & Citizen Helpdesk */}
          <div className="space-y-3 md:col-span-1">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider text-[#FF9933]">
              {isHindi ? "किसान सहायता एवं समाधान" : "Farmer Helpdesk & Support"}
            </h4>
            
            <div className="space-y-2 text-[11px] text-slate-300">
              <div className="flex items-start gap-2">
                <Phone className="w-3.5 h-3.5 text-[#138808] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-white block">1800-180-1551</span>
                  <span className="text-[10px] text-slate-400">{isHindi ? "किसान कॉल सेंटर (टोल फ्री - 24x7)" : "Kisan Call Centre (Toll Free)"}</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Mail className="w-3.5 h-3.5 text-[#FF9933] shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold block">support.krishiq@nic.in</span>
                  <span className="text-[10px] text-slate-400">{isHindi ? "आधिकारिक ईमेल सहायता" : "Official Support Email"}</span>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Building className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <div>
                  <span className="block">{isHindi ? "कृषि भवन, डॉ. राजेंद्र प्रसाद रोड, नई दिल्ली - 110001" : "Krishi Bhawan, Dr. Rajendra Prasad Road, New Delhi - 110001"}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Column 4: Compliance & Visitor Stats */}
          <div className="space-y-3 md:col-span-1">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider text-[#FF9933]">
              {isHindi ? "प्रमाणीकरण एवं सांख्यिकी" : "Certification & Metrics"}
            </h4>

            {/* STQC Badge Box */}
            <div className="p-2.5 bg-[#001B36] border border-[#0A3866] rounded-xs space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-[11px]">
                <ShieldCheck className="w-4 h-4" />
                <span>GIGW 3.0 Compliant</span>
              </div>
              <p className="text-[10px] text-slate-400">
                {isHindi
                  ? "यह वेबसाइट भारत सरकार की वेबसाइट दिशानिर्देशों (GIGW 3.0) के अनुरूप निर्मित है।"
                  : "Certified for compliance with Guidelines for Indian Government Websites (GIGW)."}
              </p>
            </div>

            {/* Visitor Counter Box */}
            <div className="p-2.5 bg-[#001B36] border border-[#0A3866] rounded-xs">
              <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">
                {isHindi ? "कुल पोर्टल प्रविष्टियाँ / आगंतुक" : "Total Portal Visitors"}
              </span>
              <span className="font-mono font-bold text-sm text-[#FF9933] tabular-nums tracking-widest block mt-0.5">
                14,892,104
              </span>
              <span className="text-[9px] text-slate-500 block mt-0.5">
                {isHindi ? "पंजीकृत किसान: 5,42,890" : "Registered Farmers: 5,42,890"}
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* 3. National Technical Credit Line (NIC / MeitY) */}
      <div className="bg-[#001429] py-4 px-4 sm:px-6 lg:px-8 border-t border-[#0A3866] text-center text-[11px] text-slate-400">
        <div className="max-w-[1600px] mx-auto space-y-1">
          <p>
            {isHindi ? (
              <>
                यह पोर्टल <strong className="text-white">राष्ट्रीय सूचना विज्ञान केंद्र (NIC)</strong>, इलेक्ट्रॉनिकी और सूचना प्रौद्योगिकी मंत्रालय, भारत सरकार द्वारा डिजाइन, विकसित और होस्ट किया गया है।
              </>
            ) : (
              <>
                Designed, Developed and Hosted by <strong className="text-white">National Informatics Centre (NIC)</strong>, Ministry of Electronics & Information Technology, Government of India.
              </>
            )}
          </p>
          <p className="text-slate-400">
            {isHindi ? (
              <>
                सामग्री प्रबंधन: <strong className="text-slate-300">कृषि एवं किसान कल्याण विभाग</strong>, कृषि एवं किसान कल्याण मंत्रालय, भारत सरकार।
              </>
            ) : (
              <>
                Content Managed by <strong className="text-slate-300">Department of Agriculture and Farmers Welfare</strong>, Ministry of Agriculture & Farmers Welfare, Government of India.
              </>
            )}
          </p>
          <div className="pt-2 text-[10px] text-slate-400 flex flex-wrap items-center justify-center gap-3">
            <span>{isHindi ? "अंतिम समीक्षा एवं अद्यतन: 12 सितम्बर 2026" : "Last Reviewed & Updated: 12-Sep-2026"}</span>
            <span>•</span>
            <span>{isHindi ? "संस्करण: 2.4.0 (SIH-2026)" : "Portal Version: 2.4.0 (SIH-2026)"}</span>
          </div>
        </div>
      </div>

    </footer>
  );
};
