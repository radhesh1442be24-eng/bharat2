'use client';

import React, { useState, useMemo } from 'react';
import { MainLayoutContainer } from '../components/MainLayoutContainer.jsx';
import { Header } from '../components/Header.jsx';
import { CompactTitle } from '../components/CompactTitle.jsx';
import { TyreInputCard } from '../components/TyreInputCard.jsx';
import { OriginalTyreCard } from '../components/OriginalTyreCard.jsx';
import { CategoryTabs } from '../components/CategoryTabs.jsx';
import { CandidatesList } from '../components/CandidatesList.jsx';
import { EducationalSection } from '../components/EducationalSection.jsx';
import { FitmentDisclaimer } from '../components/FitmentDisclaimer.jsx';
import { Footer } from '../components/Footer.jsx';
import { calculateTyreSpecs } from '../lib/tyreCalculator.js';
import { getCandidateTyres } from '../lib/standardTyres.js';

export default function Home() {
  // Unit system state ('MM' or 'IN')
  const [unit, setUnit] = useState('MM');

  // Default tyre input: 215/60 R16
  const [currentDimension, setCurrentDimension] = useState({
    width: 215,
    aspectRatio: 60,
    rimDiameter: 16,
  });

  // Active Category tab: default SAMERIM
  const [activeCategory, setActiveCategory] = useState('SAMERIM');

  // Selected candidate state
  const [selectedCandidate, setSelectedCandidate] = useState(null);

  // Selected vehicle state (if selected via car model lookup)
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  // Compute specs for original tyre (canonical internal specs)
  const originalSpecs = useMemo(() => {
    return calculateTyreSpecs(currentDimension);
  }, [currentDimension]);

  // Compute candidates for current specs & vehicle metadata
  const candidateResults = useMemo(() => {
    return getCandidateTyres(originalSpecs, selectedVehicle);
  }, [originalSpecs, selectedVehicle]);

  // Handle calculation update
  const handleCalculate = (newDimension, vehicleObj = null) => {
    setCurrentDimension(newDimension);
    setSelectedVehicle(vehicleObj);
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
            vehicle={selectedVehicle}
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
