'use client';

import React, { useState } from 'react';
import { DIAMETER_TARGET_PERCENT, MM_PER_INCH } from '../lib/constants.js';
import { CheckCircle2, ArrowUp, ArrowDown, Disc, CircleDot, AlertTriangle, ShieldCheck, Filter } from 'lucide-react';

export const CandidatesList = ({
  activeCategory,
  onSelectCategory,
  sameRimCandidates,
  upsizeCandidates,
  downsizeCandidates,
  similarCandidates,
  origRim,
  selectedCandidate,
  onSelectCandidate,
  unit,
}) => {
  // Filter mode: PRIMARY (±2.0% target) vs ALL (includes ±2% to ±3% secondary close alternatives)
  const [filterMode, setFilterMode] = useState('PRIMARY');

  // Determine active list & titles according to strict mutually exclusive rim-based categories
  let fullCategoryList = sameRimCandidates;
  let categoryTitle = 'SAME RIM OPTIONS';
  let categorySubheading = `Same Rim Diameter (R${origRim})`;
  let categoryDesc = `Alternative tyre sizes with the exact same rim diameter (R${origRim}) as your original tyre spec.`;

  if (activeCategory === 'DOWNSIZE') {
    fullCategoryList = downsizeCandidates;
    categoryTitle = 'DOWNSIZE OPTIONS';
    categorySubheading = `Smaller Rim Diameter (< R${origRim})`;
    categoryDesc = 'Alternative tyre sizes with a smaller rim diameter for enhanced ride cushion.';
  } else if (activeCategory === 'UPSIZE') {
    fullCategoryList = upsizeCandidates;
    categoryTitle = 'UPSIZE OPTIONS';
    categorySubheading = `Larger Rim Diameter (> R${origRim})`;
    categoryDesc = 'Alternative tyre sizes with a larger rim diameter for enhanced steering response and performance.';
  } else if (activeCategory === 'SIMILAR') {
    fullCategoryList = similarCandidates;
    categoryTitle = 'CLOSEST DIAMETER OPTIONS';
    categorySubheading = 'Sorted by Overall Diameter Difference';
    categoryDesc = 'All qualifying tyre sizes sorted strictly by closest overall diameter to your original tyre spec.';
  }

  // Filter current list based on filter mode
  const currentList = filterMode === 'PRIMARY'
    ? fullCategoryList.filter((c) => c.isWithinTarget)
    : fullCategoryList;

  const primaryCount = fullCategoryList.filter((c) => c.isWithinTarget).length;
  const secondaryCount = fullCategoryList.filter((c) => !c.isWithinTarget).length;

  return (
    <div className="bg-white rounded-md shadow-xs border border-[#D9E1EA] overflow-hidden text-[#172033]">
      
      {/* Category Header Bar & Target Filter Switcher */}
      <div className="bg-[#F8FAFC] p-4 border-b border-[#D9E1EA] flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-4 bg-[#087FEA] rounded-full" />
            <h3 className="text-xs sm:text-sm font-bold text-[#172033] uppercase tracking-wider">
              {categoryTitle}
            </h3>
            <span className="text-xs font-semibold text-slate-500">
              ({categorySubheading})
            </span>
          </div>
          <p className="text-[11px] text-slate-500 pl-3.5 font-normal">
            {categoryDesc}
          </p>
        </div>

        {/* Primary vs Secondary Filter Controls */}
        <div className="flex items-center gap-2 self-start md:self-center">
          <div className="bg-[#E2E8F0]/60 p-0.5 rounded-md flex items-center border border-[#CBD5E1] text-[11px]">
            <button
              type="button"
              onClick={() => setFilterMode('PRIMARY')}
              className={`px-2.5 py-1 rounded font-semibold transition-colors flex items-center gap-1 ${
                filterMode === 'PRIMARY'
                  ? 'bg-[#087FEA] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Within ±{DIAMETER_TARGET_PERCENT.toFixed(1)}% Target ({primaryCount})</span>
            </button>

            <button
              type="button"
              onClick={() => setFilterMode('ALL')}
              className={`px-2.5 py-1 rounded font-semibold transition-colors flex items-center gap-1 ${
                filterMode === 'ALL'
                  ? 'bg-[#087FEA] text-white shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>All Alternatives ({fullCategoryList.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Safety Notice Bar */}
      <div className="bg-blue-50/70 px-4 py-2 border-b border-blue-100 flex items-center gap-2 text-[11px] text-blue-950 font-normal">
        <ShieldCheck className="w-4 h-4 text-[#087FEA] flex-shrink-0" />
        <span>
          <strong>Fitment Note:</strong> Calculated mathematical alternatives. Always verify vehicle wheel clearance and load ratings before purchase.
        </span>
      </div>

      {/* Candidate List Table */}
      {currentList.length === 0 ? (
        <div className="p-8 text-center text-xs font-medium text-slate-500 flex flex-col items-center gap-2">
          <span>No qualifying candidate sizes found within selected target filter for this category.</span>
          {filterMode === 'PRIMARY' && secondaryCount > 0 && (
            <button
              onClick={() => setFilterMode('ALL')}
              className="text-[#087FEA] font-semibold underline text-xs mt-1 cursor-pointer"
            >
              Show {secondaryCount} secondary close alternative(s) outside ±{DIAMETER_TARGET_PERCENT.toFixed(1)}% target
            </button>
          )}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F1F5F9] border-b border-[#D9E1EA] text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th scope="col" className="py-3 px-4">Tyre Size</th>
                <th scope="col" className="py-3 px-2 text-right">Width ({unit === 'IN' ? 'in' : 'mm'})</th>
                <th scope="col" className="py-3 px-2 text-right hidden sm:table-cell">Sidewall ({unit === 'IN' ? 'in' : 'mm'})</th>
                <th scope="col" className="py-3 px-2 text-right hidden md:table-cell">Rim</th>
                <th scope="col" className="py-3 px-2 text-right hidden sm:table-cell">Overall Dia. ({unit === 'IN' ? 'in' : 'mm'})</th>
                <th scope="col" className="py-3 px-2 text-right hidden lg:table-cell">Circumference ({unit === 'IN' ? 'in' : 'mm'})</th>
                <th scope="col" className="py-3 px-2 text-right hidden md:table-cell">Speed @ 100km/h</th>
                <th scope="col" className="py-3 px-2 text-right hidden lg:table-cell">Ride Height</th>
                <th scope="col" className="py-3 px-2 text-right hidden md:table-cell">Revs / km</th>
                <th scope="col" className="py-3 px-4 text-right">Difference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0] text-xs font-normal">
              {currentList.map((item, idx) => {
                const isPositive = item.differencePct > 0;
                const formattedDiff = isPositive
                  ? `+${item.differencePct.toFixed(1)}%`
                  : `${item.differencePct.toFixed(1)}%`;

                const isSelected = selectedCandidate?.sizeString === item.sizeString;

                // Sidewall calculation in mm
                const sidewallMm = (item.width * item.aspectRatio) / 100;
                const sidewallDisplay = unit === 'IN'
                  ? `${(sidewallMm / MM_PER_INCH).toFixed(2)} in`
                  : `${sidewallMm.toFixed(1)} mm`;

                // Width display
                const widthDisplay = unit === 'IN'
                  ? `${(item.width / MM_PER_INCH).toFixed(2)} in`
                  : `${item.width} mm`;

                // Diameter display
                const diameterDisplay = unit === 'IN'
                  ? `${(item.overallDiameter / MM_PER_INCH).toFixed(2)} in`
                  : `${item.overallDiameter.toFixed(1)} mm`;

                // Circumference display
                const circumferenceDisplay = unit === 'IN'
                  ? `${(item.circumference / MM_PER_INCH).toFixed(2)} in`
                  : `${item.circumference.toFixed(1)} mm`;

                // Ride height change string
                const clearanceStr = item.clearanceChangeMm > 0
                  ? `+${item.clearanceChangeMm.toFixed(1)} mm`
                  : `${item.clearanceChangeMm.toFixed(1)} mm`;

                return (
                  <tr
                    key={`${item.sizeString}-${idx}`}
                    onClick={() => onSelectCandidate(item)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-blue-50/70 border-l-4 border-l-[#087FEA]'
                        : idx % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-[#F8FAFC] hover:bg-slate-100/60'
                    }`}
                  >
                    {/* Tyre Size */}
                    <td className="py-3 px-4 font-semibold text-[#172033]">
                      <div className="flex items-center gap-1.5">
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#087FEA] flex-shrink-0" />}
                        <span className="text-xs sm:text-sm font-bold">{item.sizeString}</span>
                      </div>
                    </td>

                    {/* Width */}
                    <td className="py-3 px-2 text-right font-medium text-slate-700">
                      {widthDisplay}
                    </td>

                    {/* Sidewall */}
                    <td className="py-3 px-2 text-right font-normal text-slate-500 hidden sm:table-cell">
                      {sidewallDisplay}
                    </td>

                    {/* Rim */}
                    <td className="py-3 px-2 text-right font-semibold text-slate-700 hidden md:table-cell">
                      R{item.rimDiameter}
                    </td>

                    {/* Overall Diameter */}
                    <td className="py-3 px-2 text-right font-semibold text-slate-800 hidden sm:table-cell">
                      {diameterDisplay}
                    </td>

                    {/* Circumference */}
                    <td className="py-3 px-2 text-right font-normal text-slate-500 hidden lg:table-cell">
                      {circumferenceDisplay}
                    </td>

                    {/* Speed at 100km/h */}
                    <td className="py-3 px-2 text-right font-semibold text-blue-950 hidden md:table-cell">
                      {item.speedometer100.toFixed(1)} km/h
                    </td>

                    {/* Ride Height Change */}
                    <td className="py-3 px-2 text-right font-normal text-slate-600 hidden lg:table-cell">
                      {clearanceStr}
                    </td>

                    {/* Revs / km */}
                    <td className="py-3 px-2 text-right font-semibold text-slate-700 hidden md:table-cell">
                      {item.revsPerKm.toFixed(1)}
                    </td>

                    {/* Difference Badge */}
                    <td className="py-3 px-4 text-right font-semibold">
                      {item.isWithinTarget ? (
                        <div className="flex flex-col items-end gap-0.5">
                          <span className="inline-block text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[11px] font-bold">
                            {formattedDiff}
                          </span>
                          <span className="text-[9px] text-emerald-700 font-normal">
                            Within ±{DIAMETER_TARGET_PERCENT.toFixed(1)}% target
                          </span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-end gap-0.5">
                          <span className="inline-block text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded text-[11px] font-bold flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3 text-amber-600" />
                            {formattedDiff}
                          </span>
                          <span className="text-[9px] text-amber-700 font-normal">
                            Outside ±{DIAMETER_TARGET_PERCENT.toFixed(1)}% target — verify fitment
                          </span>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Expandable Category Switcher Links */}
      <div className="bg-[#F8FAFC] p-3 border-t border-[#D9E1EA] flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="text-slate-500 font-medium">Explore other sizing categories:</span>
        <div className="flex flex-wrap items-center gap-2">
          {activeCategory !== 'SAMERIM' && (
            <button
              type="button"
              onClick={() => onSelectCategory('SAMERIM')}
              className="px-3 py-1.5 bg-white border border-[#D9E1EA] hover:border-[#087FEA] text-[#087FEA] font-semibold rounded-md shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Disc className="w-3.5 h-3.5 text-[#087FEA]" />
              <span>View Same Rim Diameter (R{origRim}) Options</span>
            </button>
          )}

          {activeCategory !== 'DOWNSIZE' && (
            <button
              type="button"
              onClick={() => onSelectCategory('DOWNSIZE')}
              className="px-3 py-1.5 bg-white border border-[#D9E1EA] hover:border-[#087FEA] text-[#087FEA] font-semibold rounded-md shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowDown className="w-3.5 h-3.5 text-[#087FEA]" />
              <span>View Downsize Options (Smaller Rim)</span>
            </button>
          )}

          {activeCategory !== 'UPSIZE' && (
            <button
              type="button"
              onClick={() => onSelectCategory('UPSIZE')}
              className="px-3 py-1.5 bg-white border border-[#D9E1EA] hover:border-[#087FEA] text-[#087FEA] font-semibold rounded-md shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowUp className="w-3.5 h-3.5 text-[#087FEA]" />
              <span>View Upsize Options (Larger Rim)</span>
            </button>
          )}

          {activeCategory !== 'SIMILAR' && (
            <button
              type="button"
              onClick={() => onSelectCategory('SIMILAR')}
              className="px-3 py-1.5 bg-white border border-[#D9E1EA] hover:border-[#087FEA] text-[#087FEA] font-semibold rounded-md shadow-2xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <CircleDot className="w-3.5 h-3.5 text-[#087FEA]" />
              <span>View Closest Diameter Alternatives</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
