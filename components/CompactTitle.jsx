import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ChevronRight } from 'lucide-react';

export const CompactTitle = () => {
  return (
    <div className="py-1 sm:py-2">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-1.5 text-xs font-medium text-slate-300 mb-2">
        <Link href="/" className="hover:text-white transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-white font-semibold">Tyre Calculator</span>
      </div>

      {/* Main Title & Disclaimer Badge Grid */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-col gap-1 max-w-3xl">
          <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-tight">
            Tyre Size Calculator & Comparison
          </h1>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-normal max-w-2xl">
            Compare tyre dimensions and find suitable alternative sizes within ±2.0% rolling diameter tolerance. Understand how changes affect overall diameter, sidewall height, and speedometer accuracy.
          </p>
        </div>

        {/* Right Target Badge - White Content Card */}
        <div className="bg-white border border-[#D9E1EA] rounded-md p-3 flex items-start gap-2.5 max-w-xs flex-shrink-0 text-[#06152A] shadow-sm">
          <ShieldCheck className="w-5 h-5 text-[#087FEA] mt-0.5 flex-shrink-0" />
          <div className="flex flex-col">
            <span className="text-xs font-bold text-[#06152A] leading-tight">
              ±2.0% Rolling Diameter Target
            </span>
            <span className="text-[11px] text-slate-600 leading-tight mt-0.5 font-normal">
              Calculated alternative — verify vehicle fitment before purchase.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
