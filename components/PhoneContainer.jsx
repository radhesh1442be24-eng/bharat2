import React from 'react';

export const PhoneContainer = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-start py-0 sm:py-6 px-0 font-sans antialiased">
      {/* 390px Fixed Master Phone Frame */}
      <main className="w-full max-w-[390px] min-h-screen sm:min-h-[844px] bg-[#0b132b] sm:rounded-[36px] shadow-2xl sm:shadow-indigo-950/50 border-0 sm:border-[6px] border-slate-800/80 overflow-hidden flex flex-col relative">
        {/* Subtle phone status notch bar decoration for authentic mobile preview */}
        <div className="hidden sm:flex justify-between items-center px-6 pt-3 pb-1 bg-[#070d1e] text-[11px] font-medium text-slate-400 select-none z-50">
          <span>9:41</span>
          <div className="w-20 h-4 bg-slate-900 rounded-full flex items-center justify-center">
            <div className="w-3 h-3 rounded-full bg-slate-800"></div>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px]">5G</span>
            <div className="w-4 h-2.5 border border-slate-400 rounded-sm p-[1px] flex justify-end">
              <div className="w-2 h-full bg-slate-300"></div>
            </div>
          </div>
        </div>

        {/* Core Mobile Scroll Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-slate-700">
          {children}
        </div>
      </main>
    </div>
  );
};
