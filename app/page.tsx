'use client';

import React, { useState, useMemo } from 'react';
import { MainLayoutContainer } from '../components/MainLayoutContainer';
import { Header } from '../components/Header';
import { CompactTitle } from '../components/CompactTitle';
import { TyreInputCard } from '../components/TyreInputCard';
import { OriginalTyreCard } from '../components/OriginalTyreCard';
import { CategoryTabs } from '../components/CategoryTabs';
import { CandidatesList } from '../components/CandidatesList';
import { EducationalSection } from '../components/EducationalSection';
import { FitmentDisclaimer } from '../components/FitmentDisclaimer';
import { Footer } from '../components/Footer';
import {
  TyreDimension,
  CandidateTyre,
  UnitSystem,
  CandidateCategory,
} from '../types/tyre';
import { calculateTyreSpecs } from '../lib/tyreCalculator';
import { getCandidateTyres } from '../lib/standardTyres';

export default function Home() {
  // Unit system state ('MM' or 'IN')
  const [unit, setUnit] = useState<UnitSystem>('MM');

  // Default tyre input: 215/60 R16
  const [currentDimension, setCurrentDimension] = useState<TyreDimension>({
    width: 215,
    aspectRatio: 60,
    rimDiameter: 16,
  });

  // Active Category tab: default SAMERIM
  const [activeCategory, setActiveCategory] = useState<CandidateCategory>('SAMERIM');

  // Selected candidate state
  const [selectedCandidate, setSelectedCandidate] = useState<CandidateTyre | null>(null);

  // Compute specs for original tyre (canonical internal specs)
  const originalSpecs = useMemo(() => {
    return calculateTyreSpecs(currentDimension);
  }, [currentDimension]);

  // Compute candidates for current specs
  const candidateResults = useMemo(() => {
    return getCandidateTyres(originalSpecs);
  }, [originalSpecs]);

  // Handle calculation update
  const handleCalculate = (newDimension: TyreDimension) => {
    setCurrentDimension(newDimension);
    setSelectedCandidate(null);
  };

  return (
    <MainLayoutContainer>
      {/* Brand Header */}
      <Header />

      {/* Breadcrumb & Title Bar */}
      <CompactTitle />

      {/* Responsive Upper Section Grid (Input on Left, Original Specs + SVG Graphic on Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-stretch my-2">
        <div className="lg:col-span-6">
          <TyreInputCard
            currentInput={currentDimension}
            onCalculate={handleCalculate}
            unit={unit}
            onUnitChange={setUnit}
          />
        </div>
        <div className="lg:col-span-6">
          <OriginalTyreCard
            specs={originalSpecs}
            unit={unit}
          />
        </div>
      </div>

      {/* Category Result Switcher Tabs (Same Rim | Downsize | Upsize | Closest Diameter) */}
      <CategoryTabs
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        sameRimCount={candidateResults.sameRim.length}
        downsizeCount={candidateResults.downsize.length}
        upsizeCount={candidateResults.upsize.length}
        similarCount={candidateResults.similar.length}
        origRim={currentDimension.rimDiameter}
      />

      {/* Candidate Alternatives List / Table */}
      <CandidatesList
        activeCategory={activeCategory}
        onSelectCategory={setActiveCategory}
        sameRimCandidates={candidateResults.sameRim}
        upsizeCandidates={candidateResults.upsize}
        downsizeCandidates={candidateResults.downsize}
        similarCandidates={candidateResults.similar}
        origRim={currentDimension.rimDiameter}
        selectedCandidate={selectedCandidate}
        onSelectCandidate={setSelectedCandidate}
        unit={unit}
      />

      {/* Educational Knowledge Base */}
      <EducationalSection />

      {/* Fitment Compliance Disclaimer */}
      <FitmentDisclaimer />

      {/* Brand Footer */}
      <Footer />
    </MainLayoutContainer>
  );
}
