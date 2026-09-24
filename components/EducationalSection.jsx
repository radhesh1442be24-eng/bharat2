'use client';

import React from 'react';
import { BookOpen, HelpCircle, Gauge, Scale } from 'lucide-react';

export const EducationalSection = () => {
  return (
    <section className="flex flex-col gap-4 py-2">
      {/* Section Header */}
      <div className="flex flex-col gap-1 pb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4.5 h-4.5 text-[#087FEA]" />
          <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
            TYRE SIZE GUIDE
          </h2>
        </div>
        <p className="text-xs text-slate-300 font-normal">
          Essential engineering principles for tyre sizing, rolling circumference, and fitment changes.
        </p>
      </div>

      {/* 3 Clean Information Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Block 1: How to Read a Tyre Size */}
        <div className="bg-white border border-[#D9E1EA] rounded-md p-4 sm:p-5 text-[#172033] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#087FEA] font-bold text-sm mb-2.5">
              <HelpCircle className="w-4 h-4 flex-shrink-0" />
              <h3>How to Read a Tyre Size</h3>
            </div>
            
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Your tyre size is printed directly on the sidewall rubber (e.g. <strong className="text-[#172033]">215/60 R16</strong>).
            </p>

            <div className="grid grid-cols-2 gap-2 text-center text-xs my-2">
              <div className="bg-[#F8FAFC] p-2 rounded-md border border-[#E2E8F0]">
                <span className="font-bold text-[#087FEA] block text-sm">215</span>
                <span className="text-[10px] text-slate-500 font-medium">Width (mm)</span>
              </div>
              <div className="bg-[#F8FAFC] p-2 rounded-md border border-[#E2E8F0]">
                <span className="font-bold text-[#087FEA] block text-sm">60</span>
                <span className="text-[10px] text-slate-500 font-medium">Aspect Ratio (%)</span>
              </div>
              <div className="bg-[#F8FAFC] p-2 rounded-md border border-[#E2E8F0]">
                <span className="font-bold text-[#087FEA] block text-sm">R</span>
                <span className="text-[10px] text-slate-500 font-medium">Radial Type</span>
              </div>
              <div className="bg-[#F8FAFC] p-2 rounded-md border border-[#E2E8F0]">
                <span className="font-bold text-[#087FEA] block text-sm">16</span>
                <span className="text-[10px] text-slate-500 font-medium">Rim (inches)</span>
              </div>
            </div>
          </div>
          
          <p className="text-[11px] text-slate-500 mt-2 leading-normal">
            Width is tread section width in mm. Aspect ratio (60) is sidewall height as a % of width. R16 denotes radial construction for a 16-inch wheel.
          </p>
        </div>

        {/* Block 2: Why Rolling Circumference Matters */}
        <div className="bg-white border border-[#D9E1EA] rounded-md p-4 sm:p-5 text-[#172033] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#087FEA] font-bold text-sm mb-2.5">
              <Gauge className="w-4 h-4 flex-shrink-0" />
              <h3>Why Rolling Circumference Matters</h3>
            </div>
            
            <p className="text-xs text-slate-600 leading-relaxed mb-2">
              Rolling circumference determines the exact distance covered in one full revolution of the wheel.
            </p>

            <ul className="space-y-2 text-xs text-slate-600 my-2">
              <li className="flex items-start gap-1.5">
                <span className="text-[#087FEA] font-bold">•</span>
                <span><strong className="text-[#172033]">Speedometer Accuracy:</strong> Tyres with larger diameters cause speedometers to read slower than actual speed.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#087FEA] font-bold">•</span>
                <span><strong className="text-[#172033]">Transmission & Gearing:</strong> Substantial changes alter final drive ratios and engine torque delivery.</span>
              </li>
              <li className="flex items-start gap-1.5">
                <span className="text-[#087FEA] font-bold">•</span>
                <span><strong className="text-[#172033]">Wheel Arch Clearance:</strong> Staying within ±2.0% prevents tyre rubbing under full steering lock.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Block 3: Upsizing & Downsizing */}
        <div className="bg-white border border-[#D9E1EA] rounded-md p-4 sm:p-5 text-[#172033] shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-[#087FEA] font-bold text-sm mb-2.5">
              <Scale className="w-4 h-4 flex-shrink-0" />
              <h3>Upsizing & Downsizing</h3>
            </div>
            
            <p className="text-xs text-slate-600 leading-relaxed mb-2">
              Understanding structural trade-offs when selecting non-standard tyre configurations:
            </p>

            <div className="flex flex-col gap-2.5 text-xs text-slate-600 my-2">
              <div className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md">
                <h4 className="font-bold text-[#172033] mb-0.5">Upsizing (Plus Sizing)</h4>
                <p className="text-[11px] leading-normal text-slate-600">
                  Increasing rim size or tread width with a lower aspect ratio improves high-speed cornering grip, steering feedback, and stance.
                </p>
              </div>

              <div className="p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-md">
                <h4 className="font-bold text-[#172033] mb-0.5">Downsizing</h4>
                <p className="text-[11px] leading-normal text-slate-600">
                  Reducing rim diameter while increasing sidewall profile provides a taller rubber cushion for enhanced ride comfort on unpaved roads.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
