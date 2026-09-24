'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X, MapPin, Search } from 'lucide-react';

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="bg-[#06152A]/85 backdrop-blur-md text-white border border-white/10 rounded-md px-4 sm:px-6 py-3 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between h-12 sm:h-14">
        
        {/* Left: Brand Logo & Slogan */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex flex-col group">
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold tracking-tight text-white text-xl sm:text-2xl italic">
                BHARAT <span className="text-[#087FEA]">TYRES</span>
              </span>
            </div>
            <span className="text-[8px] sm:text-[9px] font-bold tracking-widest text-slate-300 uppercase -mt-0.5">
              Driven for a better tomorrow
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-medium text-slate-300 ml-2">
            <a
              href="#calculator"
              className="text-white font-semibold border-b-2 border-[#087FEA] pb-3.5 pt-3.5 -mb-[14px]"
            >
              Tyre Calculator
            </a>
            <a href="#tyres" className="hover:text-white transition-colors pb-3.5 pt-3.5 -mb-[14px]">
              Tyres Range
            </a>
            <a href="#services" className="hover:text-white transition-colors pb-3.5 pt-3.5 -mb-[14px]">
              Services
            </a>
            <a href="#about" className="hover:text-white transition-colors pb-3.5 pt-3.5 -mb-[14px]">
              About Us
            </a>
            <a href="#contact" className="hover:text-white transition-colors pb-3.5 pt-3.5 -mb-[14px]">
              Contact
            </a>
          </nav>
        </div>

        {/* Right: Search Bar & Find a Dealer CTA */}
        <div className="flex items-center gap-3">
          {/* Search Input Bar */}
          <div className="hidden sm:flex items-center relative w-48 lg:w-56">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search tyres, sizes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0d223f]/90 border border-[#1b3d69] rounded-md pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#087FEA]"
            />
          </div>

          {/* Find a Dealer Button */}
          <button className="bg-[#087FEA] hover:bg-[#0668C2] text-white text-xs font-semibold px-3.5 py-2 rounded-md flex items-center gap-1.5 transition-colors shadow-xs">
            <MapPin className="w-3.5 h-3.5" />
            <span>Find a Dealer</span>
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden text-white p-1.5 rounded-md hover:bg-[#0d223f] focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 mt-3 pt-3 flex flex-col gap-2 pb-1 animate-fadeIn">
          {/* Mobile Search */}
          <div className="flex items-center relative w-full mb-1">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search tyres, sizes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0d223f]/90 border border-[#1b3d69] rounded-md pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-400 focus:outline-none"
            />
          </div>

          <a href="#calculator" className="text-xs font-semibold text-white py-1 border-l-2 border-[#087FEA] pl-2">
            Tyre Calculator
          </a>
          <a href="#tyres" className="text-xs font-medium text-slate-300 py-1 hover:text-white pl-2">
            Tyres Range
          </a>
          <a href="#services" className="text-xs font-medium text-slate-300 py-1 hover:text-white pl-2">
            Services
          </a>
          <a href="#about" className="text-xs font-medium text-slate-300 py-1 hover:text-white pl-2">
            About Us
          </a>
          <a href="#contact" className="text-xs font-medium text-slate-300 py-1 hover:text-white pl-2">
            Contact
          </a>
        </div>
      )}
    </header>
  );
};
