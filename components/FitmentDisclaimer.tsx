import React from 'react';
import { Info } from 'lucide-react';

export const FitmentDisclaimer: React.FC = () => {
  return (
    <section className="py-1">
      <div className="bg-white border border-[#D9E1EA] rounded-md p-3.5 sm:p-4 shadow-sm text-[#06152A]">
        <div className="bg-[#FFFBEB] border border-[#FDE68A] rounded-md p-3 sm:p-3.5 text-amber-950 text-xs flex flex-col gap-1.5">
          <div className="flex items-center gap-2 font-bold text-amber-950 text-xs">
            <Info className="w-4 h-4 text-[#A16207] flex-shrink-0" />
            <span className="uppercase tracking-wider">FITMENT NOTICE</span>
          </div>
          
          <p className="font-bold text-amber-950 text-xs">
            Calculated alternative — verify vehicle fitment before purchase.
          </p>

          <p className="text-[11.5px] text-amber-800 leading-relaxed font-normal">
            Overall diameter calculations are for guidance only. Actual fitment depends on vehicle clearance, rim width, load rating, speed rating and manufacturer recommendations.
          </p>
        </div>
      </div>
    </section>
  );
};


