'use client';

import React, { useState } from 'react';
import { DIAMETER_TARGET_PERCENT, MM_PER_INCH } from '../lib/constants.js';
import {
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  Disc,
  CircleDot,
  ShieldCheck,
  Filter,
  ChevronDown,
  ChevronUp,
  Info,
  AlertTriangle,
} from 'lucide-react';

export const CandidatesList = ({
  activeCategory,
  onSelectCategory,
  sameRimCandidates,
  upsizeCandidates,
  downsizeCandidates,
  similarCandidates,
  origRim,
  originalSpecs,
  selectedCandidate,
  onSelectCandidate,
  unit,
}) => {
  // Filter mode: PRIMARY (±2.0% target) vs ALL (includes ±2% to ±3% extended)
  const [filterMode, setFilterMode] = useState('PRIMARY');
  // Expand technical details state for candidates
  const [expandedCandidate, setExpandedCandidate] = useState(null);

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

  const handleRowClick = (item) => {
    if (onSelectCandidate) {
      onSelectCandidate(item);
    }
    if (expandedCandidate === item.sizeString) {
      setExpandedCandidate(null);
    } else {
      setExpandedCandidate(item.sizeString);
    }
  };

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

      {/* Mandatory Fitment Compliance Banner */}
      <div className="bg-blue-50/70 px-4 py-2 border-b border-blue-100 flex items-center gap-2 text-[11px] text-blue-950 font-normal">
        <Info className="w-4 h-4 text-[#087FEA] flex-shrink-0" />
        <span>
          <strong>Fitment Note:</strong> Calculated compatibility is mathematical similarity only. Physical fitment depends on rim width, offset, PCD, suspension and body clearance.
        </span>
      </div>

      {/* Recommendation Status Legend */}
      <div className="bg-[#F8FAFC] px-4 py-2.5 border-b border-[#D9E1EA] flex flex-col lg:flex-row lg:items-center justify-between gap-2 text-xs">
        <span className="font-bold text-slate-700 text-[11px] uppercase tracking-wider">
          Recommendation Legend:
        </span>
        <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] bg-emerald-50 text-emerald-900 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Close calculated alternative</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] bg-amber-50 text-amber-900 border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Possible alternative — verify fitment</span>
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[11px] bg-rose-50 text-rose-900 border border-rose-200">
            <span className="w-2 h-2 rounded-full bg-rose-500" />
            <span>Outside calculated range</span>
          </span>
        </div>
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
                <th scope="col" className="py-3 px-2 text-right hidden lg:table-cell">Speed @ 100km/h</th>
                <th scope="col" className="py-3 px-2 text-right hidden lg:table-cell">Ride Height</th>
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
                const isExpanded = expandedCandidate === item.sizeString;

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

                // Ride height change string
                const clearanceStr = item.clearanceChangeMm > 0
                  ? `+${item.clearanceChangeMm.toFixed(1)} mm`
                  : `${item.clearanceChangeMm.toFixed(1)} mm`;

                // Difference Badge Color Styling based on item.statusColor
                let diffBadgeStyle = "bg-amber-50 text-amber-900 border-amber-300";
                let statusBadgeStyle = "bg-amber-50 text-amber-900 border-amber-200";

                if (item.statusColor === 'GREEN') {
                  diffBadgeStyle = "bg-emerald-50 text-emerald-900 border-emerald-300";
                  statusBadgeStyle = "bg-emerald-50 text-emerald-900 border-emerald-200";
                } else if (item.statusColor === 'RED') {
                  diffBadgeStyle = "bg-rose-50 text-rose-900 border-rose-300";
                  statusBadgeStyle = "bg-rose-50 text-rose-900 border-rose-200";
                }

                // Calculated diffs against OE for expanded drawer
                const oeDia = originalSpecs?.overallDiameter || 0;
                const oeWidth = originalSpecs?.width || 0;
                const oeSidewall = originalSpecs?.sidewallHeight || 0;
                const oeRim = originalSpecs?.rimDiameterInches || 0;
                const oeCirc = originalSpecs?.circumference || 0;

                const diaDiffPctVal = oeDia > 0 ? ((item.overallDiameter - oeDia) / oeDia) * 100 : item.differencePct;
                const diaDiffMmVal = item.overallDiameter - oeDia;
                const widthDiffMmVal = item.width - oeWidth;
                const widthDiffPctVal = oeWidth > 0 ? (Math.abs(widthDiffMmVal) / oeWidth) * 100 : 0;
                const sidewallDiffMmVal = sidewallMm - oeSidewall;
                const rimDiffInchesVal = item.rimDiameter - oeRim;
                const circDiffPctVal = oeCirc > 0 ? ((item.circumference - oeCirc) / oeCirc) * 100 : 0;

                return (
                  <React.Fragment key={`${item.sizeString}-${idx}`}>
                    <tr
                      onClick={() => handleRowClick(item)}
                      className={`cursor-pointer transition-colors ${
                        isSelected || isExpanded
                          ? 'bg-blue-50/70 border-l-4 border-l-[#087FEA]'
                          : idx % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-[#F8FAFC] hover:bg-slate-100/60'
                      }`}
                    >
                      {/* Tyre Size */}
                      <td className="py-3 px-4 font-semibold text-[#172033]">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#087FEA] flex-shrink-0" />}
                          <span className="text-xs sm:text-sm font-bold">{item.sizeString}</span>
                          {isExpanded ? (
                            <ChevronUp className="w-3.5 h-3.5 text-slate-400 ml-auto" />
                          ) : (
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-auto" />
                          )}
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

                      {/* Speed at 100km/h */}
                      <td className="py-3 px-2 text-right font-semibold text-blue-950 hidden lg:table-cell">
                        {item.speedometer100.toFixed(1)} km/h
                      </td>

                      {/* Ride Height Change */}
                      <td className="py-3 px-2 text-right font-normal text-slate-600 hidden lg:table-cell">
                        {clearanceStr}
                      </td>

                      {/* Colored Difference Badge */}
                      <td className="py-3 px-4 text-right font-semibold">
                        <div className="flex flex-col items-end gap-0.5">
                          <span className={`inline-block px-2.5 py-0.5 rounded text-[11px] font-bold border ${diffBadgeStyle}`}>
                            {formattedDiff}
                          </span>
                        </div>
                      </td>
                    </tr>

                    {/* Expandable Detailed Technical Comparison Drawer */}
                    {isExpanded && (
                      <tr className="bg-slate-50/90 border-b border-[#D9E1EA]">
                        <td colSpan="8" className="p-4">
                          <div className="bg-white border border-[#D9E1EA] rounded-md p-4 shadow-2xs flex flex-col gap-3">
                            
                            {/* Drawer Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2.5 border-b border-[#E2E8F0] gap-2">
                              <div className="flex items-center gap-2">
                                <Info className="w-4 h-4 text-[#087FEA] flex-shrink-0" />
                                <span className="text-xs sm:text-sm font-bold text-[#172033]">
                                  Detailed Comparison: {originalSpecs?.sizeString || 'Original'} vs {item.sizeString}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5 self-start sm:self-auto">
                                <span className={`px-2.5 py-0.5 rounded text-[11px] font-bold border ${statusBadgeStyle}`}>
                                  {item.statusHeading}
                                </span>
                              </div>
                            </div>

                            {/* Section: Side-by-Side Dimension Metrics */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                              {/* Overall Diameter */}
                              <div className="bg-[#F8FAFC] p-2.5 rounded border border-[#E2E8F0] flex flex-col">
                                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Overall Diameter</span>
                                <span className="text-xs font-bold text-[#172033] mt-0.5">
                                  {unit === 'IN' ? `${(item.overallDiameter / MM_PER_INCH).toFixed(2)} in` : `${item.overallDiameter.toFixed(1)} mm`}
                                </span>
                                <span className={`text-[11px] font-semibold mt-1 ${Math.abs(diaDiffPctVal) <= 2 ? 'text-emerald-700' : Math.abs(diaDiffPctVal) <= 3 ? 'text-amber-700' : 'text-rose-700'}`}>
                                  {diaDiffPctVal >= 0 ? `+${diaDiffPctVal.toFixed(2)}%` : `${diaDiffPctVal.toFixed(2)}%`} ({diaDiffMmVal >= 0 ? `+${diaDiffMmVal.toFixed(1)} mm` : `${diaDiffMmVal.toFixed(1)} mm`})
                                </span>
                              </div>

                              {/* Section Width */}
                              <div className="bg-[#F8FAFC] p-2.5 rounded border border-[#E2E8F0] flex flex-col">
                                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Section Width</span>
                                <span className="text-xs font-bold text-[#172033] mt-0.5">
                                  {unit === 'IN' ? `${(item.width / MM_PER_INCH).toFixed(2)} in` : `${item.width} mm`}
                                </span>
                                <span className="text-[11px] font-semibold text-slate-700 mt-1">
                                  {widthDiffMmVal === 0 ? '0 mm change (0.0%)' : `${widthDiffMmVal > 0 ? `+${widthDiffMmVal}` : widthDiffMmVal} mm (${widthDiffMmVal > 0 ? '+' : '-'}${widthDiffPctVal.toFixed(1)}%)`}
                                </span>
                              </div>

                              {/* Sidewall Height */}
                              <div className="bg-[#F8FAFC] p-2.5 rounded border border-[#E2E8F0] flex flex-col">
                                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Sidewall Height</span>
                                <span className="text-xs font-bold text-[#172033] mt-0.5">
                                  {unit === 'IN' ? `${(sidewallMm / MM_PER_INCH).toFixed(2)} in` : `${sidewallMm.toFixed(1)} mm`}
                                </span>
                                <span className="text-[11px] font-semibold text-slate-700 mt-1">
                                  {sidewallDiffMmVal === 0 ? '0.0 mm change' : `${sidewallDiffMmVal > 0 ? `+${sidewallDiffMmVal.toFixed(1)}` : sidewallDiffMmVal.toFixed(1)} mm`}
                                </span>
                              </div>

                              {/* Rim Diameter */}
                              <div className="bg-[#F8FAFC] p-2.5 rounded border border-[#E2E8F0] flex flex-col">
                                <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Rim Diameter</span>
                                <span className="text-xs font-bold text-[#172033] mt-0.5">
                                  R{item.rimDiameter} ({unit === 'IN' ? `${item.rimDiameter} in` : `${(item.rimDiameter * MM_PER_INCH).toFixed(1)} mm`})
                                </span>
                                <span className="text-[11px] font-semibold text-slate-700 mt-1">
                                  {rimDiffInchesVal === 0 ? 'Same rim diameter' : `${rimDiffInchesVal > 0 ? `+${rimDiffInchesVal}` : rimDiffInchesVal} inch (${rimDiffInchesVal > 0 ? 'Upsize' : 'Downsize'})`}
                                </span>
                              </div>
                            </div>

                            {/* Section: Secondary Engineering Metrics & Screening Reasons */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                              {/* Screening Reasons */}
                              <div className="flex flex-col gap-1.5 bg-[#F8FAFC] p-3 rounded border border-[#E2E8F0]">
                                <span className="font-semibold text-slate-800 text-[11px]">Screening Checklist & Status:</span>
                                <ul className="space-y-1 text-[11px] text-slate-600">
                                  {item.reasons.map((reason, rIdx) => (
                                    <li key={rIdx} className="flex items-start gap-1.5">
                                      <span className="text-[#087FEA] font-bold">•</span>
                                      <span>{reason}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>

                              {/* Operational & Fitment Metrics */}
                              <div className="flex flex-col gap-1.5 bg-[#F8FAFC] p-3 rounded border border-[#E2E8F0] text-[11px]">
                                <span className="font-semibold text-slate-800">Operational & Fitment Metrics:</span>
                                <div className="flex justify-between py-0.5 border-b border-slate-200/60">
                                  <span className="text-slate-500">Rolling Circumference:</span>
                                  <span className="font-semibold">{item.circumference.toFixed(1)} mm ({circDiffPctVal >= 0 ? `+${circDiffPctVal.toFixed(2)}%` : `${circDiffPctVal.toFixed(2)}%`})</span>
                                </div>
                                <div className="flex justify-between py-0.5 border-b border-slate-200/60">
                                  <span className="text-slate-500">Speedometer Indication @ 100 km/h:</span>
                                  <span className="font-semibold text-blue-950">{item.speedometer100.toFixed(1)} km/h</span>
                                </div>
                                <div className="flex justify-between py-0.5 border-b border-slate-200/60">
                                  <span className="text-slate-500">Ground Clearance Change:</span>
                                  <span className="font-semibold">{item.clearanceChangeMm > 0 ? `+${item.clearanceChangeMm.toFixed(1)} mm` : `${item.clearanceChangeMm.toFixed(1)} mm`}</span>
                                </div>
                                <div className="flex justify-between py-0.5 border-b border-slate-200/60">
                                  <span className="text-slate-500">Wheel Revolutions / km:</span>
                                  <span className="font-semibold">{item.revsPerKm.toFixed(1)} revs/km</span>
                                </div>
                                <div className="flex justify-between py-0.5">
                                  <span className="text-slate-500">Recommended Rim Width (ETRTO):</span>
                                  <span className="font-semibold">{item.screening?.recommendedRimRange?.min}&quot; - {item.screening?.recommendedRimRange?.max}&quot;</span>
                                </div>
                              </div>
                            </div>

                            {/* Fitment Distinction Notice */}
                            <div className="bg-amber-50/70 border border-amber-200 rounded p-2.5 text-[11px] text-amber-900 flex items-start gap-2">
                              <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                              <span>
                                <strong>Fitment Notice:</strong> {item.isManufacturerApproved ? 'This size is verified in manufacturer specifications for this vehicle.' : 'Calculated compatibility indicates dimensional closeness only. Verify wheel offset, PCD, suspension clearance, and brake disc clearance before installation.'}
                              </span>
                            </div>

                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
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
