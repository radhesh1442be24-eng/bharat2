'use client';

import React from 'react';
import { ArrowUp, ArrowDown, Disc, CircleDot } from 'lucide-react';
import { CandidateCategory } from '../types/tyre';

export type CategoryType = CandidateCategory;

interface CategoryTabsProps {
  activeCategory: CategoryType;
  onSelectCategory: (category: CategoryType) => void;
  sameRimCount: number;
  downsizeCount: number;
  upsizeCount: number;
  similarCount: number;
  origRim: number;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  activeCategory,
  onSelectCategory,
  sameRimCount,
  downsizeCount,
  upsizeCount,
  similarCount,
  origRim,
}) => {
  return (
    <div className="py-1">
      <div role="tablist" aria-label="Tyre sizing categories" className="bg-white rounded-md shadow-xs border border-[#D9E1EA] p-1.5 grid grid-cols-2 sm:grid-cols-4 gap-1.5">
        {/* Same Rim Tab */}
        <button
          type="button"
          role="tab"
          aria-selected={activeCategory === 'SAMERIM'}
          onClick={() => onSelectCategory('SAMERIM')}
          className={`py-2 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border ${
            activeCategory === 'SAMERIM'
              ? 'bg-blue-50/80 border-blue-200 text-[#087FEA] shadow-xs border-b-2 border-b-[#087FEA]'
              : 'bg-transparent border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <Disc className="w-3.5 h-3.5 text-[#087FEA]" />
          <span>Same Rim (R{origRim})</span>
          <span className="text-[11px] font-normal opacity-75">({sameRimCount})</span>
        </button>

        {/* Downsize Tab */}
        <button
          type="button"
          role="tab"
          aria-selected={activeCategory === 'DOWNSIZE'}
          onClick={() => onSelectCategory('DOWNSIZE')}
          className={`py-2 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border ${
            activeCategory === 'DOWNSIZE'
              ? 'bg-blue-50/80 border-blue-200 text-[#087FEA] shadow-xs border-b-2 border-b-[#087FEA]'
              : 'bg-transparent border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <ArrowDown className="w-3.5 h-3.5 text-[#087FEA]" />
          <span>Downsize (Smaller Rim)</span>
          <span className="text-[11px] font-normal opacity-75">({downsizeCount})</span>
        </button>

        {/* Upsize Tab */}
        <button
          type="button"
          role="tab"
          aria-selected={activeCategory === 'UPSIZE'}
          onClick={() => onSelectCategory('UPSIZE')}
          className={`py-2 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border ${
            activeCategory === 'UPSIZE'
              ? 'bg-blue-50/80 border-blue-200 text-[#087FEA] shadow-xs border-b-2 border-b-[#087FEA]'
              : 'bg-transparent border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <ArrowUp className="w-3.5 h-3.5 text-[#087FEA]" />
          <span>Upsize (Larger Rim)</span>
          <span className="text-[11px] font-normal opacity-75">({upsizeCount})</span>
        </button>

        {/* Closest Diameter Tab */}
        <button
          type="button"
          role="tab"
          aria-selected={activeCategory === 'SIMILAR'}
          onClick={() => onSelectCategory('SIMILAR')}
          className={`py-2 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border ${
            activeCategory === 'SIMILAR'
              ? 'bg-blue-50/80 border-blue-200 text-[#087FEA] shadow-xs border-b-2 border-b-[#087FEA]'
              : 'bg-transparent border-transparent text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <CircleDot className="w-3.5 h-3.5 text-[#087FEA]" />
          <span>Closest Diameter</span>
          <span className="text-[11px] font-normal opacity-75">({similarCount})</span>
        </button>
      </div>
    </div>
  );
};
