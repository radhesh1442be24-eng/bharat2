import React from 'react';
import { MM_PER_INCH, KM_PER_MILE } from '../lib/constants.js';

export const OriginalTyreCard = ({ specs, unit }) => {
  // Conversions for dual unit technical specs
  const widthInches = (specs.width / MM_PER_INCH).toFixed(2);
  const sidewallInches = (specs.sidewallHeight / MM_PER_INCH).toFixed(2);
  const diameterInches = (specs.overallDiameter / MM_PER_INCH).toFixed(2);
  const circumferenceInches = (specs.circumference / MM_PER_INCH).toFixed(2);
  const revsPerMile = (specs.revsPerKm * KM_PER_MILE).toFixed(1);

  // Primary vs Secondary displays based on selected unit
  const widthPrimary = unit === 'IN' ? `${widthInches} in` : `${specs.width} mm`;
  const widthSecondary = unit === 'IN' ? `${specs.width} mm` : `${widthInches} in`;

  const sidewallPrimary = unit === 'IN' ? `${sidewallInches} in` : `${specs.sidewallHeight} mm`;
  const sidewallSecondary = unit === 'IN' ? `${specs.sidewallHeight} mm` : `${sidewallInches} in`;

  const diameterPrimary = unit === 'IN' ? `${diameterInches} in` : `${specs.overallDiameter} mm`;
  const diameterSecondary = unit === 'IN' ? `${specs.overallDiameter} mm` : `${diameterInches} in`;

  const circumferencePrimary = unit === 'IN' ? `${circumferenceInches} in` : `${specs.circumference} mm`;
  const circumferenceSecondary = unit === 'IN' ? `${specs.circumference} mm` : `${circumferenceInches} in`;

  return (
    <div className="bg-white rounded-md border border-[#D9E1EA] p-4 sm:p-5 text-[#172033] h-full flex flex-col justify-between shadow-xs">
      <div>
        {/* Header Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-4 bg-[#087FEA] rounded-full" />
            <span className="text-xs font-bold text-[#172033] uppercase tracking-wider">
              Original Tyre Specifications
            </span>
          </div>
          <span className="text-xs font-bold text-[#087FEA] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200">
            {specs.sizeString}
          </span>
        </div>

        {/* Content Grid: Tyre Visual SVG + Detailed Specs List */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center mt-4">
          
          {/* Tyre SVG Graphic with Live Height & Revs Overlay */}
          <div className="sm:col-span-5 flex flex-col items-center justify-center relative bg-[#F8FAFC] border border-[#E2E8F0] p-3 rounded-md">
            <div className="relative w-36 sm:w-40 h-36 sm:h-40 flex items-center justify-center">
              
              {/* Dynamic SVG Tyre Illustration */}
              <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-xs">
                {/* Outer Tread */}
                <circle cx="100" cy="100" r="94" fill="#1e293b" />
                <circle cx="100" cy="100" r="92" fill="none" stroke="#334155" strokeWidth="4" strokeDasharray="6 4" />
                
                {/* Sidewall Rubber */}
                <circle cx="100" cy="100" r="86" fill="#334155" stroke="#475569" strokeWidth="2" />
                
                {/* Sidewall Tyre Markings */}
                <path id="tyreTextPath" d="M 40,100 A 60,60 0 1,1 160,100" fill="none" />
                <text className="text-[10px] font-semibold fill-slate-200 tracking-wider">
                  <textPath href="#tyreTextPath" startOffset="50%" textAnchor="middle">
                    {specs.sizeString}
                  </textPath>
                </text>

                {/* Inner Rim Bead */}
                <circle cx="100" cy="100" r="54" fill="#0f172a" stroke="#64748b" strokeWidth="3" />
                
                {/* Alloy Wheel Spokes */}
                <g fill="#475569" stroke="#94a3b8" strokeWidth="1.5">
                  <path d="M100 100 L100 48 L108 50 L100 100 Z" />
                  <path d="M100 100 L145 74 L149 82 L100 100 Z" />
                  <path d="M100 100 L145 126 L141 134 L100 100 Z" />
                  <path d="M100 100 L100 152 L92 150 L100 100 Z" />
                  <path d="M100 100 L55 126 L51 118 L100 100 Z" />
                  <path d="M100 100 L55 74 L59 66 L100 100 Z" />
                </g>

                {/* Center Hub */}
                <circle cx="100" cy="100" r="14" fill="#0f172a" stroke="#087FEA" strokeWidth="2" />
                <circle cx="100" cy="100" r="6" fill="#087FEA" />
              </svg>

              {/* Height Indicator */}
              <div className="absolute -left-1 top-0 bottom-0 flex flex-col items-center justify-between pointer-events-none">
                <div className="w-2 h-[1px] bg-[#087FEA]" />
                <div className="w-[1px] flex-1 border-l border-dashed border-[#087FEA]" />
                <div className="w-2 h-[1px] bg-[#087FEA]" />
              </div>

              {/* Overall Diameter Badge */}
              <div className="absolute -left-5 top-1/2 -translate-y-1/2 bg-[#087FEA] text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-xs whitespace-nowrap">
                {diameterPrimary}
              </div>
            </div>

            {/* Revs/km Badge */}
            <span className="mt-2 text-[11px] font-semibold text-[#087FEA] bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200">
              {specs.revsPerKm} revs/km {unit === 'IN' ? `(${revsPerMile} revs/mi)` : ''}
            </span>
          </div>

          {/* Right Column: Technical Specs List */}
          <div className="sm:col-span-7 flex flex-col divide-y divide-[#E2E8F0] text-xs font-normal">
            <div className="py-1.5 flex justify-between items-center">
              <span className="text-slate-500">Section Width</span>
              <div className="text-right">
                <span className="font-semibold text-[#172033] block">{widthPrimary}</span>
                <span className="text-[10px] text-slate-400 font-normal block">{widthSecondary}</span>
              </div>
            </div>
            
            <div className="py-1.5 flex justify-between items-center">
              <span className="text-slate-500">Aspect Ratio</span>
              <span className="font-semibold text-[#172033]">{specs.aspectRatio} %</span>
            </div>
            
            <div className="py-1.5 flex justify-between items-center">
              <span className="text-slate-500">Sidewall Height</span>
              <div className="text-right">
                <span className="font-semibold text-[#172033] block">{sidewallPrimary}</span>
                <span className="text-[10px] text-slate-400 font-normal block">{sidewallSecondary}</span>
              </div>
            </div>
            
            <div className="py-1.5 flex justify-between items-center">
              <span className="text-slate-500">Rim Diameter</span>
              <div className="text-right">
                <span className="font-semibold text-[#172033] block">{specs.rimDiameterInches} in ({specs.rimDiameterMm} mm)</span>
              </div>
            </div>
            
            <div className="py-1.5 flex justify-between items-center">
              <span className="text-slate-500">Overall Diameter</span>
              <div className="text-right">
                <span className="font-bold text-[#087FEA] block">{diameterPrimary}</span>
                <span className="text-[10px] text-slate-400 font-normal block">{diameterSecondary}</span>
              </div>
            </div>
            
            <div className="py-1.5 flex justify-between items-center">
              <span className="text-slate-500">Rolling Circumference</span>
              <div className="text-right">
                <span className="font-semibold text-[#172033] block">{circumferencePrimary}</span>
                <span className="text-[10px] text-slate-400 font-normal block">{circumferenceSecondary}</span>
              </div>
            </div>
            
            <div className="py-1.5 flex justify-between items-center">
              <span className="text-slate-500">Revolutions / km</span>
              <div className="text-right">
                <span className="font-semibold text-[#172033] block">{specs.revsPerKm}</span>
                <span className="text-[10px] text-slate-400 font-normal block">{revsPerMile} revs/mi</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
