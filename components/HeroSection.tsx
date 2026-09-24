import React from 'react';
import { ShieldCheck, Settings, Car } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="bg-gradient-to-b from-[#0c1836] to-[#0a1226] px-4 pt-5 pb-6 border-b border-slate-800/50 relative overflow-hidden">
      {/* Background glowing arc matching reference image header backdrop */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-blue-600/15 rounded-full blur-2xl pointer-events-none" />

      {/* Main hero content container */}
      <div className="relative z-10 flex flex-col gap-3">
        {/* Category Tag */}
        <span className="text-[10px] font-bold tracking-widest text-blue-400 uppercase">
          Tyre Size Calculator
        </span>

        {/* Title */}
        <h1 className="text-xl font-black text-white leading-tight tracking-tight">
          Find the Right Fit <br />
          <span className="text-blue-400 font-black">for Your Journey</span>
        </h1>

        {/* Subtitle */}
        <p className="text-xs text-slate-300 leading-relaxed max-w-[280px]">
          Compare tyre sizes, get upsize/downsize suggestions and make an informed choice.
        </p>

        {/* Value Proposition Badges */}
        <div className="grid grid-cols-3 gap-1.5 mt-2">
          <div className="bg-slate-900/80 border border-slate-800/80 rounded-lg p-2 flex flex-col items-center text-center">
            <ShieldCheck className="w-4 h-4 text-blue-400 mb-1" />
            <span className="text-[9px] font-medium leading-tight text-slate-200">
              Accurate Calculations
            </span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800/80 rounded-lg p-2 flex flex-col items-center text-center">
            <Settings className="w-4 h-4 text-blue-400 mb-1" />
            <span className="text-[9px] font-medium leading-tight text-slate-200">
              Industry Guidelines
            </span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800/80 rounded-lg p-2 flex flex-col items-center text-center">
            <Car className="w-4 h-4 text-blue-400 mb-1" />
            <span className="text-[9px] font-medium leading-tight text-slate-200">
              Better Safety
            </span>
          </div>
        </div>

        {/* Tyre Banner Strip */}
        <div className="mt-2 bg-blue-950/40 border border-blue-800/30 rounded-lg p-2.5 flex items-center justify-between">
          <div className="flex flex-col text-left">
            <span className="text-[9px] font-bold text-blue-400 uppercase">Key Benefits</span>
            <div className="flex items-center gap-2 mt-0.5">
              <span className="text-[10px] font-semibold text-slate-200">More Grip</span>
              <span className="text-slate-600">•</span>
              <span className="text-[10px] font-semibold text-slate-200">Better Control</span>
              <span className="text-slate-600">•</span>
              <span className="text-[10px] font-semibold text-slate-200">Safer</span>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center border border-blue-500/40 text-blue-400 text-xs font-bold">
            100%
          </div>
        </div>
      </div>
    </section>
  );
};
