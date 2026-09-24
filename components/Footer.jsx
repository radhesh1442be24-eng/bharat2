import React from 'react';
import Link from 'next/link';

export const Footer = () => {
  return (
    <footer className="bg-[#06152A]/85 backdrop-blur-md border border-white/10 text-slate-300 text-xs rounded-md p-6 sm:p-8 mt-2 shadow-sm">
      <div className="flex flex-col gap-6">
        
        {/* Top Grid: Brand Statement & Navigation Columns */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          
          {/* Left: Brand Column (2 Spans on Desktop) */}
          <div className="md:col-span-2 flex flex-col gap-2">
            <Link href="/" className="flex flex-col">
              <span className="font-extrabold text-white text-xl italic tracking-tight">
                BHARAT <span className="text-[#087FEA]">TYRES</span>
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest -mt-0.5">
                Driven for a better tomorrow
              </span>
            </Link>
            <p className="text-xs text-slate-300 leading-relaxed max-w-sm mt-1 font-normal">
              India&apos;s trusted manufacturer and retailer of high-performance passenger car, SUV, and commercial vehicle tyres. Dedicated to safety, engineering precision, and mobility.
            </p>
          </div>

          {/* Nav Column 1: Tyres */}
          <div className="flex flex-col gap-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Tyres</h4>
            <ul className="flex flex-col gap-1.5 text-xs text-slate-300 font-normal">
              <li><a href="#passenger" className="hover:text-white transition-colors">Passenger Car</a></li>
              <li><a href="#suv" className="hover:text-white transition-colors">SUV & 4x4</a></li>
              <li><a href="#commercial" className="hover:text-white transition-colors">Commercial Vehicles</a></li>
              <li><a href="#ev" className="hover:text-white transition-colors">EV Specialist Tyres</a></li>
            </ul>
          </div>

          {/* Nav Column 2: Services */}
          <div className="flex flex-col gap-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Services</h4>
            <ul className="flex flex-col gap-1.5 text-xs text-slate-300 font-normal">
              <li><a href="#alignment" className="hover:text-white transition-colors">Wheel Alignment</a></li>
              <li><a href="#balancing" className="hover:text-white transition-colors">Wheel Balancing</a></li>
              <li><a href="#fitting" className="hover:text-white transition-colors">Tyre Fitting & Care</a></li>
              <li><a href="#dealers" className="hover:text-white transition-colors">Find Dealer Store</a></li>
            </ul>
          </div>

          {/* Nav Column 3: Company & Support */}
          <div className="flex flex-col gap-2">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider">Company</h4>
            <ul className="flex flex-col gap-1.5 text-xs text-slate-300 font-normal">
              <li><a href="#about" className="hover:text-white transition-colors">About Bharat Tyres</a></li>
              <li><a href="#calculator" className="hover:text-white transition-colors">Tyre Size Calculator</a></li>
              <li><a href="#warranty" className="hover:text-white transition-colors">Warranty & Fitment</a></li>
              <li><a href="#contact" className="hover:text-white transition-colors">Contact Support</a></li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-300">
          <p>© 2026 Bharat Tyres. All rights reserved.</p>
          
          <div className="flex items-center gap-4">
            <a href="#privacy" className="hover:text-white transition-colors">Privacy Policy</a>
            <span>•</span>
            <a href="#terms" className="hover:text-white transition-colors">Terms of Service</a>
            <span>•</span>
            <a href="#disclaimer" className="hover:text-white transition-colors">Fitment Disclaimer</a>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-3 text-slate-300 font-medium">
            <a href="#linkedin" className="hover:text-[#087FEA] transition-colors">LinkedIn</a>
            <a href="#twitter" className="hover:text-[#087FEA] transition-colors">Twitter</a>
            <a href="#facebook" className="hover:text-[#087FEA] transition-colors">Facebook</a>
            <a href="#instagram" className="hover:text-[#087FEA] transition-colors">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
