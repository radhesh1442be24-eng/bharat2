'use client';

import React, { useState } from 'react';
import {
  AVAILABLE_WIDTHS,
  AVAILABLE_ASPECT_RATIOS,
  AVAILABLE_RIM_DIAMETERS,
  MM_PER_INCH,
} from '../lib/constants.js';
import {
  getMakes,
  getModelsForMake,
  getVariantsForModel,
  getVehicleByDetails,
} from '../lib/vehiclesData.js';
import { ArrowRight, Car, Sliders, Check, HelpCircle } from 'lucide-react';

export const TyreInputCard = ({
  currentInput,
  onCalculate,
  unit,
  onUnitChange,
}) => {
  const [inputMode, setInputMode] = useState('DIMENSIONS');
  const [showHelper, setShowHelper] = useState(false);
  const [isCustomWidth, setIsCustomWidth] = useState(false);

  // Canonical internal inputs (width in mm, aspectRatio %, rimDiameter in inches)
  const [width, setWidth] = useState(currentInput.width);
  const [aspectRatio, setAspectRatio] = useState(currentInput.aspectRatio);
  const [rimDiameter, setRimDiameter] = useState(currentInput.rimDiameter);
  const [customWidthInput, setCustomWidthInput] = useState('');

  // Vehicle select states
  const [selectedMake, setSelectedMake] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [selectedVariant, setSelectedVariant] = useState('');

  // Sync internal state when parent props change
  const [prevInput, setPrevInput] = useState(currentInput);
  if (
    currentInput.width !== prevInput.width ||
    currentInput.aspectRatio !== prevInput.aspectRatio ||
    currentInput.rimDiameter !== prevInput.rimDiameter
  ) {
    setPrevInput(currentInput);
    setWidth(currentInput.width);
    setAspectRatio(currentInput.aspectRatio);
    setRimDiameter(currentInput.rimDiameter);
  }

  // Derive unique makes, models, variants using lib/vehiclesData.js
  const makes = getMakes();
  const uniqueModels = selectedMake ? getModelsForMake(selectedMake) : [];
  const variantsForModel = (selectedMake && selectedModel)
    ? getVariantsForModel(selectedMake, selectedModel)
    : [];

  const handleVehicleSelect = (variantName) => {
    setSelectedVariant(variantName);
    const vehicleMatch = getVehicleByDetails(selectedMake, selectedModel, variantName);
    if (vehicleMatch && vehicleMatch.oemTyre) {
      setWidth(vehicleMatch.oemTyre.width);
      setAspectRatio(vehicleMatch.oemTyre.aspectRatio);
      setRimDiameter(vehicleMatch.oemTyre.rim);
      setIsCustomWidth(false);
      onCalculate(
        {
          width: vehicleMatch.oemTyre.width,
          aspectRatio: vehicleMatch.oemTyre.aspectRatio,
          rimDiameter: vehicleMatch.oemTyre.rim,
        },
        vehicleMatch
      );
    }
  };

  const handleCustomWidthChange = (valStr) => {
    setCustomWidthInput(valStr);
    const valNum = parseFloat(valStr);
    if (!isNaN(valNum) && valNum > 0) {
      if (unit === 'IN') {
        setWidth(valNum * MM_PER_INCH);
      } else {
        setWidth(valNum);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onCalculate({ width, aspectRatio, rimDiameter });
  };

  // Format width for display in dropdown/inputs
  const formattedWidthDisplay = unit === 'IN'
    ? `${(width / MM_PER_INCH).toFixed(2)} in`
    : `${Math.round(width)} mm`;

  return (
    <div className="bg-white rounded-md border border-[#D9E1EA] p-4 sm:p-5 text-[#172033] h-full flex flex-col justify-between shadow-xs">
      <div>
        {/* Card Header & Controls */}
        <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
          {/* Mode Switcher Tabs */}
          <div className="flex gap-1 bg-[#F1F5F9] p-1 rounded-md border border-[#E2E8F0]">
            <button
              type="button"
              onClick={() => setInputMode('DIMENSIONS')}
              className={`py-1.5 px-3 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                inputMode === 'DIMENSIONS'
                  ? 'bg-[#087FEA] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Enter Tyre Size</span>
            </button>

            <button
              type="button"
              onClick={() => setInputMode('VEHICLE')}
              className={`py-1.5 px-3 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                inputMode === 'VEHICLE'
                  ? 'bg-[#087FEA] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Car className="w-3.5 h-3.5" />
              <span>Find By Car Model</span>
            </button>
          </div>

          {/* Helper toggle & Unit selector */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowHelper(!showHelper)}
              className="text-slate-500 hover:text-[#087FEA] p-1 rounded-md text-xs font-medium flex items-center gap-1"
              title="Tyre Size Help Guide"
            >
              <HelpCircle className="w-4 h-4 text-[#087FEA]" />
              <span className="hidden sm:inline">Help</span>
            </button>

            {/* MM / IN Unit Switcher */}
            <div className="bg-[#F1F5F9] p-0.5 rounded-md flex items-center border border-[#E2E8F0] text-[10px] font-semibold">
              <button
                type="button"
                onClick={() => onUnitChange('MM')}
                className={`px-2.5 py-1 rounded-xs font-bold transition-colors ${
                  unit === 'MM'
                    ? 'bg-[#087FEA] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                MM
              </button>
              <button
                type="button"
                onClick={() => onUnitChange('IN')}
                className={`px-2.5 py-1 rounded-xs font-bold transition-colors ${
                  unit === 'IN'
                    ? 'bg-[#087FEA] text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                IN
              </button>
            </div>
          </div>
        </div>

        {/* Customer Helper Banner */}
        {showHelper && (
          <div className="mt-3 p-3 bg-blue-50/80 border border-blue-200 rounded-md text-xs text-blue-950 flex flex-col gap-1 leading-relaxed">
            <span className="font-bold text-blue-900">How to find your tyre size:</span>
            <p>
              Look at the sidewall of your existing tyre. You will see a specification like <strong className="text-[#087FEA] font-bold">215/60 R16</strong>.
            </p>
            <div className="grid grid-cols-3 gap-1 text-[11px] mt-0.5 font-normal">
              <div>• <strong>215</strong> = Tread Width (mm / { (215 / MM_PER_INCH).toFixed(2) } in)</div>
              <div>• <strong>60</strong> = Sidewall Ratio (%)</div>
              <div>• <strong>16</strong> = Rim Diameter (inch)</div>
            </div>
          </div>
        )}

        {inputMode === 'DIMENSIONS' ? (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
            {/* Input Grid: Width, Aspect Ratio, Rim Diameter */}
            <div className="grid grid-cols-3 gap-3">
              {/* Width Field */}
              <div className="bg-[#F8FAFC] border border-[#D9E1EA] rounded-md p-2.5 flex flex-col justify-between hover:border-blue-300 transition-colors">
                <label className="text-[11px] font-medium text-slate-600 flex items-center justify-between">
                  <span>Width ({unit === 'IN' ? 'inch' : 'mm'})</span>
                  <button
                    type="button"
                    onClick={() => {
                      setIsCustomWidth(!isCustomWidth);
                      if (!isCustomWidth) {
                        setCustomWidthInput(unit === 'IN' ? (width / MM_PER_INCH).toFixed(2) : width.toString());
                      }
                    }}
                    className="text-[9px] font-semibold text-[#087FEA] hover:underline"
                  >
                    {isCustomWidth ? 'Preset' : 'Custom'}
                  </button>
                </label>

                {isCustomWidth ? (
                  <input
                    type="number"
                    step="0.01"
                    value={customWidthInput}
                    onChange={(e) => handleCustomWidthChange(e.target.value)}
                    placeholder={unit === 'IN' ? '8.46' : '215'}
                    className="bg-white border border-[#D9E1EA] rounded px-2 py-1 font-bold text-[#172033] text-sm sm:text-base focus:outline-none focus:ring-1 focus:ring-[#087FEA] mt-1"
                  />
                ) : (
                  <select
                    value={Math.round(width)}
                    onChange={(e) => {
                      const newMm = Number(e.target.value);
                      setWidth(newMm);
                    }}
                    className="bg-transparent font-bold text-[#172033] text-sm sm:text-base focus:outline-none cursor-pointer mt-1"
                  >
                    {AVAILABLE_WIDTHS.map((w) => {
                      const displayStr = unit === 'IN'
                        ? `${(w / MM_PER_INCH).toFixed(2)} in`
                        : `${w} mm`;
                      return (
                        <option key={w} value={w}>
                          {displayStr}
                        </option>
                      );
                    })}
                  </select>
                )}
                
                <span className="text-[10px] text-slate-500 mt-0.5">
                  Current: {formattedWidthDisplay}
                </span>
              </div>

              {/* Aspect Ratio Field */}
              <div className="bg-[#F8FAFC] border border-[#D9E1EA] rounded-md p-2.5 flex flex-col justify-between hover:border-blue-300 transition-colors">
                <label className="text-[11px] font-medium text-slate-600">
                  Aspect Ratio (%)
                </label>
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(Number(e.target.value))}
                  className="bg-transparent font-bold text-[#172033] text-sm sm:text-base focus:outline-none cursor-pointer mt-1"
                >
                  {AVAILABLE_ASPECT_RATIOS.map((ar) => (
                    <option key={ar} value={ar}>
                      {ar} %
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-slate-500 mt-0.5">Sidewall height %</span>
              </div>

              {/* Rim Diameter Field */}
              <div className="bg-[#F8FAFC] border border-[#D9E1EA] rounded-md p-2.5 flex flex-col justify-between hover:border-blue-300 transition-colors">
                <label className="text-[11px] font-medium text-slate-600">
                  Rim Size (inch)
                </label>
                <select
                  value={rimDiameter}
                  onChange={(e) => setRimDiameter(Number(e.target.value))}
                  className="bg-transparent font-bold text-[#172033] text-sm sm:text-base focus:outline-none cursor-pointer mt-1"
                >
                  {AVAILABLE_RIM_DIAMETERS.map((r) => (
                    <option key={r} value={r}>
                      R{r} ({r}&quot;)
                    </option>
                  ))}
                </select>
                <span className="text-[10px] text-slate-500 mt-0.5">Wheel rim</span>
              </div>
            </div>

            {/* Calculate Action Button */}
            <button
              type="submit"
              className="mt-1 w-full bg-[#087FEA] hover:bg-[#0668C2] text-white font-semibold py-2.5 px-4 rounded-md flex items-center justify-center gap-2 shadow-xs transition-colors text-xs sm:text-sm"
            >
              <span>Calculate Alternatives</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          /* Car Model Lookup Mode */
          <div className="flex flex-col gap-3 mt-4">
            <span className="text-xs font-medium text-slate-600">
              Select your vehicle to automatically load OEM factory tyre size:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Make */}
              <div className="flex flex-col">
                <label className="text-[11px] font-medium text-slate-600 mb-1">
                  1. Brand / Make
                </label>
                <select
                  value={selectedMake}
                  onChange={(e) => {
                    setSelectedMake(e.target.value);
                    setSelectedModel('');
                    setSelectedVariant('');
                  }}
                  className="bg-[#F8FAFC] border border-[#D9E1EA] rounded-md p-2 text-xs font-semibold text-[#172033] focus:outline-none focus:ring-1 focus:ring-[#087FEA]"
                >
                  <option value="">-- Select Brand --</option>
                  {makes.map((m) => (
                    <option key={m} value={m}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>

              {/* Model */}
              <div className="flex flex-col">
                <label className="text-[11px] font-medium text-slate-600 mb-1">
                  2. Car Model
                </label>
                <select
                  value={selectedModel}
                  disabled={!selectedMake}
                  onChange={(e) => {
                    setSelectedModel(e.target.value);
                    setSelectedVariant('');
                  }}
                  className="bg-[#F8FAFC] border border-[#D9E1EA] rounded-md p-2 text-xs font-semibold text-[#172033] focus:outline-none focus:ring-1 focus:ring-[#087FEA] disabled:opacity-50"
                >
                  <option value="">-- Select Model --</option>
                  {uniqueModels.map((mod) => (
                    <option key={mod} value={mod}>
                      {mod}
                    </option>
                  ))}
                </select>
              </div>

              {/* Variant */}
              <div className="flex flex-col">
                <label className="text-[11px] font-medium text-slate-600 mb-1">
                  3. Variant / Trim
                </label>
                <select
                  value={selectedVariant}
                  disabled={!selectedModel}
                  onChange={(e) => handleVehicleSelect(e.target.value)}
                  className="bg-[#F8FAFC] border border-[#D9E1EA] rounded-md p-2 text-xs font-semibold text-[#172033] focus:outline-none focus:ring-1 focus:ring-[#087FEA] disabled:opacity-50"
                >
                  <option value="">-- Select Variant --</option>
                  {variantsForModel.map((v) => (
                    <option key={v.variant} value={v.variant}>
                      {v.variant} ({v.oemTyre.width}/{v.oemTyre.aspectRatio} R{v.oemTyre.rim})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {selectedVariant && (
              <div className="p-3 bg-blue-50/80 border border-blue-200 rounded-md flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs mt-1">
                <span className="font-semibold text-blue-950 text-xs flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-[#087FEA] flex-shrink-0" />
                  <span>Factory OEM Tyre Size:</span>
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#087FEA] bg-white px-3 py-1 rounded-md border border-blue-200 text-xs shadow-xs">
                    {Math.round(width)}/{aspectRatio} R{rimDiameter}
                  </span>
                  <span className="text-[11px] text-slate-600 font-medium">
                    ({formattedWidthDisplay} / {aspectRatio}% / R{rimDiameter})
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
